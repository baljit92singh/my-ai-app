import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  messages: any[] = [{ from: 'ai', text: 'Namaste! 🙏 Main Mera AI Dost hoon. Kuch bhi pucho, Hindi, Marathi ya English me.' }];
  userInput: string = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    let userText = this.userInput;
    this.messages.push({ from: 'user', text: userText });
    this.userInput = '';
    this.isLoading = true;

    // YAHAN APNI API KEY DAALNA
    const API_KEY = 'KEY';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${API_KEY}`;

    const body = {
      contents: [{ parts: [{ text: userText }] }]
    };

    this.http.post<any>(url, body).subscribe({
      next: (data) => {
        // Yahi wala Fix hai - Poora jawab jodne ke liye
        let aiReply = data.candidates[0].content.parts.map((p: any) => p.text || '').join('');
        this.messages.push({ from: 'ai', text: aiReply });
        this.isLoading = false;
        setTimeout(() => this.scrollDown(), 100);
      },
      error: (err) => {
        this.messages.push({ from: 'ai', text: 'Error aa gaya, API Key check kar.' });
        this.isLoading = false;
      }
    });
  }

  // **Bold** ko <b> banane ke liye + Line Break ke liye
  formatMessage(text: string) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\n/g, '<br>');
  }

  scrollDown() {
    const el = document.getElementById('scrollBox');
    if (el) el.scrollTop = el.scrollHeight;
  }
}