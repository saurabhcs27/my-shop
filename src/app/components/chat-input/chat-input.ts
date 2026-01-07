import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="chat-input">
      <input
        type="text"
        [(ngModel)]="inputText"
        (keyup.enter)="send()"
        placeholder="Type in Hindi or English..."
        [disabled]="disabled()"
      />
      <button (click)="send()" [disabled]="disabled() || !inputText().trim()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .chat-input {
      display: flex;
      gap: 12px;
      padding: 16px 20px;
      background: white;
      border-top: 1px solid #e0e0e0;
    }

    input {
      flex: 1;
      padding: 14px 18px;
      border: 2px solid #e0e0e0;
      border-radius: 25px;
      font-size: 15px;
      outline: none;
      transition: border-color 0.2s;
    }

    input:focus {
      border-color: #667eea;
    }

    input:disabled {
      background: #f5f5f5;
    }

    input::placeholder {
      color: #999;
    }

    button {
      width: 50px;
      height: 50px;
      border: none;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, opacity 0.2s;
    }

    button:hover:not(:disabled) {
      transform: scale(1.05);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ChatInputComponent {
  inputText = signal('');
  disabled = signal(false);

  messageSent = output<string>();

  send() {
    const text = this.inputText().trim();
    if (text && !this.disabled()) {
      this.messageSent.emit(text);
      this.inputText.set('');
    }
  }

  setDisabled(value: boolean) {
    this.disabled.set(value);
  }
}
