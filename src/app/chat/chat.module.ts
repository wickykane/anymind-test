import { NgModule } from '@angular/core';
import { ChatComponent } from './chat.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ChatRoutingModule } from './chat-routing.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { SharedModule } from '../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from '../redux/chat/reducers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { ChatEffects } from '../redux/chat/effects';

@NgModule({
  imports: [
    NzLayoutModule,
    ChatRoutingModule,
    NzMenuModule,
    NzSelectModule,
    NzInputModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forFeature(featureKey, reducer),
    EffectsModule.forFeature([ChatEffects]),
  ],
  exports: [],
  declarations: [ChatComponent, ChatBoxComponent, ChatMessageComponent],
  providers: [],
})
export class ChatModule {}
