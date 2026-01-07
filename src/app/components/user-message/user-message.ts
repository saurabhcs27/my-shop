import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UserMessage } from '../../models/chat.model';

@Component({
  selector: 'app-user-message',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="user-message">
      <div class="bubble">
        <p class="text">{{ message().text }}</p>
        <span class="time">{{ message().timestamp | date:'shortTime' }}</span>
      </div>
    </div>
  `,
  styles: [`
    .user-message {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 16px;
    }

    .bubble {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 16px;
      border-radius: 18px 18px 4px 18px;
      max-width: 75%;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    }

    .text {
      margin: 0;
      font-size: 15px;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .time {
      display: block;
      font-size: 11px;
      opacity: 0.8;
      margin-top: 6px;
      text-align: right;
    }
  `]
})
export class UserMessageComponent {
  message = input.required<UserMessage>();
}
