import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, map, catchError, of } from 'rxjs';
import { BotResponse } from '../models/chat.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private readonly API_KEY = environment.geminiApiKey; // Replace with your API key
  private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  readonly isLoading = signal(false);

  constructor(private http: HttpClient) {}

  chat(userMessage: string): Observable<BotResponse> {
    this.isLoading.set(true);

    const prompt = `You are a bilingual assistant. The user will send a message in Hindi (can be written in Roman script like "kaise ho") or English.

Your task:
1. Detect if the message is in Hindi or English
2. Translate the message to the OTHER language
3. Provide a helpful, conversational response in BOTH Hindi and English

Respond with EXACTLY this JSON format (no markdown, no code blocks, just pure JSON):
{
  "detectedLanguage": "hindi" or "english",
  "translation": "<message translated to the OTHER language>",
  "hindiAnswer": "<your conversational response in Hindi, written in Roman script>",
  "englishAnswer": "<your conversational response in English>"
}

User message: ${userMessage}`;

    const body = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    return this.http.post<any>(`${this.API_URL}?key=${this.API_KEY}`, body).pipe(
      map(response => {
        this.isLoading.set(false);
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Clean the response - remove markdown code blocks if present
        let cleanText = text.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.slice(7);
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.slice(3);
        }
        if (cleanText.endsWith('```')) {
          cleanText = cleanText.slice(0, -3);
        }
        cleanText = cleanText.trim();

        try {
          const parsed = JSON.parse(cleanText);
          return {
            type: 'bot' as const,
            detectedLanguage: parsed.detectedLanguage || 'english',
            translation: parsed.translation || '',
            hindiAnswer: parsed.hindiAnswer || '',
            englishAnswer: parsed.englishAnswer || '',
            timestamp: new Date()
          };
        } catch (e) {
          // If JSON parsing fails, return a fallback response
          return {
            type: 'bot' as const,
            detectedLanguage: 'english' as const,
            translation: 'Translation unavailable',
            hindiAnswer: 'Maaf kijiye, kuch gadbad ho gayi',
            englishAnswer: 'Sorry, something went wrong. Please try again.',
            timestamp: new Date()
          };
        }
      }),
      catchError(error => {
        this.isLoading.set(false);
        console.error('Gemini API error:', error);
        return of({
          type: 'bot' as const,
          detectedLanguage: 'english' as const,
          translation: 'Error',
          hindiAnswer: 'API error - kripya apna API key check karein',
          englishAnswer: 'API error - please check your API key and try again.',
          timestamp: new Date()
        });
      })
    );
  }
}
