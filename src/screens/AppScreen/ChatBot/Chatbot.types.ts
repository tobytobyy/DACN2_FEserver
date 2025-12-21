export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSuggestion {
  label: string;
  color: string;
}
