import { Component, ElementRef, viewChild, signal, effect } from '@angular/core';
import { UserMessageComponent } from '../user-message/user-message';
import { BotResponseComponent } from '../bot-response/bot-response';
import { ChatInputComponent } from '../chat-input/chat-input';
import { GeminiService } from '../../services/gemini.service';
import { ChatMessage, UserMessage, BotResponse } from '../../models/chat.model';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [UserMessageComponent, BotResponseComponent, ChatInputComponent],
  template: `
    <div class="chat-container">
      <div class="header">
        <h1>Bilingual Chat</h1>
        <p>Type in Hindi or English</p>
      </div>

      <div class="messages" #messagesContainer>
        @for (msg of messages(); track msg.timestamp) {
          @if (msg.type === 'user') {
            <app-user-message [message]="$any(msg)" />
          } @else {
            <app-bot-response [message]="$any(msg)" />
          }
        }

        @if (geminiService.isLoading()) {
          <div class="typing-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        }
      </div>

      <app-chat-input (messageSent)="onMessageSent($event)" #chatInput />
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      max-width: 800px;
      margin: 0 auto;
      background: #f5f7fb;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .header p {
      margin: 5px 0 0;
      font-size: 14px;
      opacity: 0.9;
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }

    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 16px;
      justify-content: flex-start;
    }

    .dot {
      width: 10px;
      height: 10px;
      background: #667eea;
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out;
    }

    .dot:nth-child(1) { animation-delay: -0.32s; }
    .dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
  `]
})
export class ChatContainerComponent {
  messages = signal<ChatMessage[]>([]);
  messagesContainer = viewChild<ElementRef>('messagesContainer');
  chatInput = viewChild(ChatInputComponent);

  constructor(public geminiService: GeminiService) {
    // Auto-scroll when messages change
    effect(() => {
      this.messages();
      this.geminiService.isLoading();
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  onMessageSent(text: string) {
    // Add user message
    const userMessage: UserMessage = {
      type: 'user',
      text,
      timestamp: new Date()
    };
    this.messages.update(msgs => [...msgs, userMessage]);

    // Disable input while loading
    this.chatInput()?.setDisabled(true);

    // Get bot response
    this.geminiService.chat(text).subscribe(response => {
      this.messages.update(msgs => [...msgs, response]);
      this.chatInput()?.setDisabled(false);
    });
  }

  private scrollToBottom() {
    const container = this.messagesContainer()?.nativeElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}
