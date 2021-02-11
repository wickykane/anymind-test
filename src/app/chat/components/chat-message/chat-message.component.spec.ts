import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ChatMessage } from 'src/app/core/types';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChatMessageComponent } from './chat-message.component';

describe('Chat Message Component', () => {
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

  test('should render chat message on right side', async () => {
    const { getByTestId, getByText } = await render(ChatMessageComponent, {
      imports: [SharedModule, ReactiveFormsModule, FormsModule],
      componentProperties: {
        data: messages[0],
        isActiveUser: true,
      },
    });

    const chatContainer = getByTestId('chat-container');
    const chatMessage = getByText(messages[0].text);

    expect(chatContainer).toHaveClass('chat-right');
    expect(chatMessage).toBeInTheDocument();
  });

  test('should render chat message on right side and show error', async () => {
    const { getByTestId, getByText, container } = await render(
      ChatMessageComponent,
      {
        imports: [SharedModule, ReactiveFormsModule, FormsModule],
        componentProperties: {
          data: { ...messages[0], offline: true },
          isActiveUser: true,
        },
      }
    );

    const chatContainer = getByTestId('chat-container');
    const chatMessage = getByText(messages[0].text);

    expect(chatContainer).toHaveClass('chat-right');
    expect(chatMessage).toBeInTheDocument();
    expect(container).toContainElement(getByText('Error'));
  });

  test('should render chat message on left side', async () => {
    const { getByTestId, getByText } = await render(ChatMessageComponent, {
      imports: [SharedModule, ReactiveFormsModule, FormsModule],
      componentProperties: {
        data: messages[0],
        isActiveUser: false,
      },
    });

    const chatContainer = getByTestId('chat-container');
    const chatMessage = getByText(messages[0].text);

    expect(chatContainer).toHaveClass('chat-left');
    expect(chatMessage).toBeInTheDocument();
  });
});
