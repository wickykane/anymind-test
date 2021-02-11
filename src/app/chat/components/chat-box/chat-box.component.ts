import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Channel, ChatMessage } from 'src/app/core/types';

@Component({
  selector: 'app-chat-box',
  templateUrl: 'chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit, AfterContentInit {
  @Input() channel: Channel | null = null;
  @Input() userId: string | null = null;
  @Input() messages: ChatMessage[] | null = [];
  @Output() send: EventEmitter<string> = new EventEmitter();
  @Output() fetchMore: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('scrollContainer') container: ElementRef | undefined;

  message: FormControl = new FormControl(['']);

  constructor() {}

  ngOnInit() {}

  ngAfterContentInit() {
    if (this.container?.nativeElement) {
      this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
    }
  }

  sendMessage() {
    this.send.emit(this.message.value.trim());
    this.message.setValue('');
  }

  fetchMoreMessage(old: boolean) {
    this.fetchMore.emit(old);
  }
}
