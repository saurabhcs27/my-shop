import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BotResponse } from '../../models/chat.model';

@Component({
  selector: 'app-bot-response',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="bot-response">
      <div class="card">
        <div class="section translation">
          <span class="label">Translation</span>
          <p class="content">{{ message().translation }}</p>
        </div>

        <div class="divider"></div>

        <div class="section hindi">
          <span class="label">Hindi</span>
          <p class="content">{{ message().hindiAnswer }}</p>
        </div>

        <div class="divider"></div>

        <div class="section english">
          <span class="label">English</span>
          <p class="content">{{ message().englishAnswer }}</p>
        </div>

        <span class="time">{{ message().timestamp | date:'shortTime' }}</span>
      </div>
    </div>
  `,
  styles: [`
    .bot-response {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 16px;
    }

    .card {
      background: white;
      border-radius: 18px 18px 18px 4px;
      max-width: 85%;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }

    .section {
      padding: 12px 16px;
    }

    .label {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 3px 8px;
      border-radius: 12px;
      margin-bottom: 8px;
    }

    .translation .label {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .hindi .label {
      background: #fff3e0;
      color: #ef6c00;
    }

    .english .label {
      background: #e3f2fd;
      color: #1565c0;
    }

    .content {
      margin: 0;
      font-size: 15px;
      line-height: 1.5;
      color: #333;
    }

    .divider {
      height: 1px;
      background: #f0f0f0;
    }

    .time {
      display: block;
      font-size: 11px;
      color: #999;
      padding: 8px 16px;
      text-align: right;
    }
  `]
})
export class BotResponseComponent {
  message = input.required<BotResponse>();
}
