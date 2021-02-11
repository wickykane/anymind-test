import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Channel, ChatMessage, User } from '../core/types';
import { ChatState } from '../redux/chat/reducers';
import {
  selectMessages,
  selectSelectedChannel,
  selectSelectedUser,
  selectUsers,
} from '../redux/chat/selectors';
import { Observable } from 'rxjs';
import {
  fetchMoreMessage,
  getLastestMessage,
  getUserList,
  selectChannel,
  selectUser,
  sendMessage,
} from '../redux/chat/actions';
import { channels } from '../redux/chat/constants';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.component.html',
})
export class ChatComponent implements OnInit {
  users$: Observable<User[]> | undefined;
  selectedChannel$: Observable<Channel> | undefined;
  selectedUser$: Observable<string> | undefined;
  messages$: Observable<ChatMessage[]> | undefined;

  channelList: Channel[] = channels;

  constructor(private store: Store<ChatState>) {
    this.users$ = this.store.pipe(select(selectUsers));
    this.selectedUser$ = this.store.pipe(select(selectSelectedUser));
    this.selectedChannel$ = this.store.pipe(select(selectSelectedChannel));
    this.messages$ = this.store.pipe(select(selectMessages));
  }

  ngOnInit() {
    this.store.dispatch(getUserList());
    this.store.dispatch(getLastestMessage());
  }

  selectUser(id: string) {
    this.store.dispatch(selectUser(id));
  }

  selectChannel(channel: Channel) {
    this.store.dispatch(selectChannel(channel));
  }

  sendMessage(message: string) {
    this.store.dispatch(sendMessage(message));
  }

  fetchMoreMessage(old: boolean) {
    this.store.dispatch(fetchMoreMessage(old));
  }
}
