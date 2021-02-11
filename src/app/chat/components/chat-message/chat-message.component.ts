import { Component, Input, OnInit } from '@angular/core';
import { ChatMessage } from 'src/app/core/types';

@Component({
  selector: 'app-chat-message',
  templateUrl: 'chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit {
  @Input()
  isActiveUser!: boolean;
  @Input() data!: ChatMessage;

  constructor() {}

  ngOnInit() {}
}
