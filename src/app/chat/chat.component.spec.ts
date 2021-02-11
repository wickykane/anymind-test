import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectComponent, NzSelectModule } from 'ng-zorro-antd/select';

import { SharedModule } from 'src/app/shared/shared.module';
import { featureKey, reducer } from '../redux/chat/reducers';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import userEvent from '@testing-library/user-event';
import {
  Component,
  forwardRef,
  Input,
  NO_ERRORS_SCHEMA,
  OnInit,
  Output,
} from '@angular/core';
import EventEmitter from 'events';

@Component({
  selector: 'nz-option',
  template: `<option value="nzValue">{{ nzLabel }}</option>`,
})
export class MockOptionComponent implements OnInit {
  @Input() nzValue: any;
  @Input() nzLabel: any;
  constructor() {}

  ngOnInit() {}
}

@Component({
  selector: 'nz-select',
  template: `<select [ngModel]="value" (ngModelChange)="updateChanges()">
    <option value="Sam">Sam</option>
  </select>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockSelectComponent),
      multi: true,
    },
  ],
  entryComponents: [MockOptionComponent],
})
class MockSelectComponent implements OnInit, ControlValueAccessor {
  constructor() {}

  ngOnInit() {}

  value: number = 0;

  onChange: (_: any) => void = (_: any) => {};

  onTouched: () => void = () => {};

  updateChanges() {
    this.onChange(this.value);
  }

  writeValue(value: number): void {
    this.value = value;
    this.updateChanges();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}

describe('Chat Component', () => {
  let _fixture: ComponentFixture<ChatComponent>;
  let store: MockStore;

  beforeEach(async () => {
    const { fixture } = await render(ChatComponent, {
      imports: [
        NzLayoutModule,
        ChatRoutingModule,
        NzMenuModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        StoreModule.forFeature(featureKey, reducer),
        StoreModule.forRoot(
          {},
          {
            runtimeChecks: {},
          }
        ),
      ],
      declarations: [
        ChatBoxComponent,
        ChatMessageComponent,
        MockSelectComponent,
        MockOptionComponent,
      ],
      providers: [
        provideMockStore({
          selectors: [],
        }),
      ],
    });
    _fixture = fixture;

    store = TestBed.inject(MockStore);
    store.dispatch = jest.fn();
  });

  test('should able to select user', async () => {
    const select = screen.getByTestId('select-user').firstElementChild;
    userEvent.selectOptions(select!, 'Sam');

    expect(store.dispatch).toBeCalledTimes(1);
  });

  test('should able to select channel', async () => {
    const menu = screen.getAllByTestId('select-channel');
    expect(menu.length).toEqual(3);
    userEvent.click(menu[1]);
    expect(store.dispatch).toBeCalledTimes(1);
  });

  test('should able to send new message', () => {
    const sendBtn = screen.getByText('Send');
    const textarea = screen.getByTestId('message-control');

    userEvent.type(textarea, 'Huy test Message');
    userEvent.click(sendBtn);

    expect(textarea).toHaveValue('');
    expect(store.dispatch).toBeCalledTimes(1);
  });

  test('should able to fetch more message', () => {
    const fetchMoreBtn = screen.getByTestId('fetch-more');
    userEvent.click(fetchMoreBtn);
    expect(store.dispatch).toBeCalledTimes(1);
  });
});
