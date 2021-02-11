import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { Channel, ChatMessage } from 'src/app/core/types';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ChatBoxComponent } from './chat-box.component';

describe('Chat Box Component', () => {
  let componentFixture: ComponentFixture<ChatBoxComponent>;

  const channel: Channel = {
    id: '1',
    name: 'Test Channel',
  };

  const userId: string = 'Wicky';
  const messages: ChatMessage[] = [
    {
      messageId: '1',
      userId: 'Wicky',
      datetime: new Date().toISOString(),
      text: 'Chat message number 1',
    },
    {
      messageId: '2',
      userId: 'Wicky',
      datetime: new Date().toISOString(),
      text: 'Chat message number 2',
    },
  ];

  const send = jest.fn();
  const fetchMore = jest.fn();

  beforeEach(async () => {
    const { fixture } = await render(ChatBoxComponent, {
      declarations: [ChatMessageComponent],
      imports: [SharedModule, ReactiveFormsModule, FormsModule],
      componentProperties: {
        channel,
        userId,
        messages,
        send: {
          emit: send,
        } as any,
        fetchMore: {
          emit: fetchMore,
        } as any,
      },
    });
    componentFixture = fixture;
  });

  test('should render correct box', () => {
    const boxHeader = screen.getByText('Test Channel');
    expect(boxHeader).toBeInTheDocument();
  });

  test('should render 2 messages', () => {
    const messages = screen.queryAllByTestId('chat-message');
    expect(messages.length).toEqual(2);
  });

  test('should not send new message if value is empty', () => {
    const sendBtn = screen.getByText('Send');
    const textarea = screen.getByTestId('message-control');

    userEvent.type(textarea, '');
    userEvent.click(sendBtn);

    expect(send).toHaveBeenCalledTimes(0);
    expect(textarea).toHaveValue('');
  });

  test('should send new message', () => {
    const sendBtn = screen.getByText('Send');
    const textarea = screen.getByTestId('message-control');

    userEvent.type(textarea, 'Huy test Message');
    userEvent.click(sendBtn);

    expect(send).toHaveBeenCalledTimes(1);
    expect(textarea).toHaveValue('');
  });

  test('should fetch more message', () => {
    const fetchMoreBtn = screen.getByTestId('fetch-more');
    userEvent.click(fetchMoreBtn);
    expect(fetchMore).toHaveBeenCalledTimes(1);
  });

  test('should scroll to bottom content init', () => {
    const component = componentFixture.componentInstance;
    component.ngAfterContentInit();
    const scrollContainer = screen.getByTestId('scrollContainer');
    expect(scrollContainer.scrollTop).toEqual(scrollContainer.scrollHeight);
  });
});
