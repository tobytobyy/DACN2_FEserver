export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSuggestion {
  label: string;
  color: string;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}
