export type AiAudience = 'seller' | 'customer';
export type AiMessageRole = 'user' | 'assistant';

export interface AiAttachment {
  id: string;
  file: File;
  name: string;
  mimeType: string;
  size: number;
  previewUrl?: string;
}

export interface AiMessageAttachment {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  previewUrl?: string;
}

export interface AiMessage {
  id: string;
  role: AiMessageRole;
  content: string;
  createdAt: Date;
  attachments?: AiMessageAttachment[];
  generatedImageUrl?: string;
  conversationId?: string;
}

export interface SendAiMessageRequest {
  audience: AiAudience;
  message: string;
  attachments?: AiAttachment[];
  conversationId?: string;
}

export interface AiAssistantService {
  sendMessage(request: SendAiMessageRequest): Promise<AiMessage>;
}
