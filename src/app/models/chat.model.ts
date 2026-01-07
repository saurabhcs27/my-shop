export interface UserMessage {
  type: 'user';
  text: string;
  timestamp: Date;
}

export interface BotResponse {
  type: 'bot';
  detectedLanguage: 'hindi' | 'english';
  translation: string;
  hindiAnswer: string;
  englishAnswer: string;
  timestamp: Date;
}

export type ChatMessage = UserMessage | BotResponse;
