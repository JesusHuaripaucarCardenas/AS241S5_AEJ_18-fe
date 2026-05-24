export interface AIQuery {
  id: string;
  apiName: string;
  prompt: string;
  response: string;
  estado: 'A' | 'I';
  createdAt: string;
  updatedAt: string;
  url?: string;
  lang?: string;
  engine?: number;
}

export interface ChatGptRequest {
  prompt: string;
}

export interface SummarizerRequest {
  url: string;
  lang?: string;
  engine?: number;
}

export interface UpdateAIQueryRequest {
  prompt?: string;
  url?: string;
  lang?: string;
  engine?: number;
}
