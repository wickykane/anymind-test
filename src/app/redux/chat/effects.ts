import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { of } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  concatMap,
  withLatestFrom,
  mergeMap,
} from 'rxjs/operators';
import {
  Channel,
  FetchMoreMessagesResponse,
  MessagesResponse,
  PostMessageResponse,
} from 'src/app/core/types';
import { cache } from 'src/app/graph-ql/graph-ql.module';

import * as actions from './actions';
import { MessageDatabase } from './db';
import { ChatState } from './reducers';
import {
  selectFirstMessageId,
  selectLastMessageId,
  selectMessages,
  selectSelectedChannel,
  selectSelectedUser,
} from './selectors';

import { ChangeChannelPayload, LoadMorePayload } from './types';

export const LATEST_MESSAGE_QUERY = gql`
  query LATEST_MESSAGE($channelId: String!) {
    fetchLatestMessages(channelId: $channelId) {
      messageId
      text
      datetime
      userId
    }
  }
`;

export const FETCH_MORE_MESSAGE = gql`
  query FETCH_MORE_MESSAGE(
    $channelId: String!
    $messageId: String!
    $old: Boolean!
  ) {
    fetchMoreMessages(channelId: $channelId, messageId: $messageId, old: $old) {
      messageId
      text
      datetime
      userId
    }
  }
`;

export const POST_MESSAGE_MUTATION = gql`
  mutation POST_MESSAGE($channelId: String!, $text: String!, $userId: String!) {
    postMessage(channelId: $channelId, text: $text, userId: $userId) {
      messageId
      text
      datetime
      userId
    }
  }
`;

@Injectable()
export class ChatEffects {
  loadRef: QueryRef<MessagesResponse> | undefined;
  loadMoreRef: QueryRef<FetchMoreMessagesResponse> | undefined;

  loadMessages$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.ActionTypes.GET_LATEST_MESSAGE),
        concatMap((action: typeof actions.getLastestMessage) =>
          of(action).pipe(
            withLatestFrom(this.store.pipe(select(selectSelectedChannel)))
          )
        ),
        switchMap(([_, selectedChannel]) => {
          const variables = {
            channelId: selectedChannel.id,
          };

          this.loadRef = this.apollo.watchQuery<MessagesResponse>({
            query: LATEST_MESSAGE_QUERY,
            variables,
          });

          return this.loadRef.valueChanges.pipe(
            mergeMap((res) =>
              of(res).pipe(
                withLatestFrom(
                  this.store.pipe(select(selectSelectedChannel)),
                  this.store.pipe(select(selectSelectedUser))
                )
              )
            ),
            map(async ([response, channel, user]) => {
              const data = response.data.fetchLatestMessages;
              const db = new MessageDatabase();
              const errorMessages = await db
                .messages!.where({
                  channelId: channel.id,
                  userId: user,
                })
                .toArray();

              const messages = [...data, ...errorMessages];
              this.store.dispatch(actions.getLastestMessageSuccess(messages));
            }),
            catchError((error) => {
              this.store.dispatch(actions.getLastestMessageFailed());
              return of(error);
            })
          );
        })
      ),
    { dispatch: false }
  );

  changeChannel$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.ActionTypes.SELECT_CHANNEL),
        map((action: ChangeChannelPayload) => {
          // Fetch Latest Messages
          this.loadRef?.refetch({ channelId: action.channel.id });

          // Reset Fetch More Result to []
          this.loadMoreRef?.updateQuery(() => {
            return {
              fetchMoreMessages: [],
            };
          });
        })
      ),
    { dispatch: false }
  );

  postMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.ActionTypes.SEND_MESSAGE),

        concatMap((action: { message: string }) =>
          of(action).pipe(
            withLatestFrom(
              this.store.pipe(select(selectSelectedChannel)),
              this.store.pipe(select(selectSelectedUser)),
              this.store.pipe(select(selectMessages))
            )
          )
        ),
        switchMap(
          ([{ message }, selectedChannel, selectedUser, savedMessages]) => {
            const variables = {
              channelId: selectedChannel.id,
              userId: selectedUser,
              text: message,
            };

            return this.apollo
              .mutate<PostMessageResponse>({
                mutation: POST_MESSAGE_MUTATION,
                variables,
              })
              .pipe(
                map((response) => {
                  if (response.data?.postMessage) {
                    const messages = [
                      response.data.postMessage,
                      ...savedMessages,
                    ];

                    this.store.dispatch(
                      actions.getLastestMessageSuccess(messages)
                    );
                  }
                }),
                catchError((error) => {
                  // Handle store error messages in Dexie
                  const db = new MessageDatabase();
                  db.transaction('rw', db.messages!, async () => {
                    const message = {
                      messageId: new Date().toISOString(),
                      ...variables,
                      datetime: new Date().toISOString(),
                      offline: true,
                    };

                    await db.messages!.add(message); // Store error message to dexie

                    const messages = [message, ...savedMessages];

                    this.store.dispatch(
                      actions.getLastestMessageSuccess(messages)
                    );
                  }).catch((e) => {
                    alert(e.stack || e);
                  });

                  return of(error);
                })
              );
          }
        )
      ),
    { dispatch: false }
  );

  loadMoreMessages$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.ActionTypes.GET_OLDER_MESSAGE),
        concatMap((action: LoadMorePayload) =>
          of(action).pipe(
            withLatestFrom(
              this.store.pipe(select(selectSelectedChannel)),
              this.store.pipe(select(selectFirstMessageId)),
              this.store.pipe(select(selectLastMessageId))
            )
          )
        ),
        map(([{ old }, selectedChannel, firstMessageId, lastMessageId]) => {
          const variables = {
            channelId: selectedChannel.id,
            old,
            messageId: old ? lastMessageId : firstMessageId,
          };

          const loadMore = () => {
            this.loadMoreRef?.fetchMore({
              variables,
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) {
                  return prev;
                }
                return Object.assign({}, prev, {
                  fetchMoreMessages: [
                    ...prev.fetchMoreMessages,
                    ...fetchMoreResult.fetchMoreMessages,
                  ],
                });
              },
            });
          };

          if (this.loadMoreRef) {
            loadMore();
          } else {
            this.loadMoreRef = this.apollo.watchQuery<FetchMoreMessagesResponse>(
              {
                query: FETCH_MORE_MESSAGE,
                variables,
              }
            );

            this.loadMoreRef.valueChanges.subscribe((res) => {
              this.store.dispatch(
                actions.getLastestMessageSuccess(
                  res.data.fetchMoreMessages,
                  true
                )
              );
            });
          }
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private apollo: Apollo,
    private store: Store<ChatState>
  ) {}
}
