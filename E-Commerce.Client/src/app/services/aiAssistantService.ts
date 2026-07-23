import { apiRequest } from './apiClient';
import { API_BASE_URL } from '../config/runtime';
import {
  AiAssistantService,
  AiMessage,
  AiMessageAttachment,
  SendAiMessageRequest,
} from '../types/ai';

interface AiAttachmentResponse {
  id: string;
  attachmentType: number | string;
  source: number | string;
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
}

interface AiChatResponse {
  conversationId: string;
  messageId: string;
  content: string;
  attachments: AiAttachmentResponse[];
  generatedImageUrl?: string | null;
}

const CUSTOMER_SESSION_KEY = 'e-commerce.ai-customer-session';
const CUSTOMER_CONVERSATION_KEY = 'e-commerce.ai-customer-conversation';
const SELLER_CONVERSATION_KEY = 'e-commerce.ai-seller-conversation';

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getOrCreateCustomerSession() {
  const current = window.localStorage.getItem(CUSTOMER_SESSION_KEY);
  if (current) return current;
  const session = createId();
  window.localStorage.setItem(CUSTOMER_SESSION_KEY, session);
  return session;
}

function resolveMediaUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return `${API_BASE_URL}${value.startsWith('/') ? '' : '/'}${value}`;
}

function attachmentToMessage(value: AiAttachmentResponse): AiMessageAttachment {
  return {
    id: value.id,
    name: value.fileName,
    mimeType: value.contentType,
    size: value.fileSize,
    previewUrl: resolveMediaUrl(value.fileUrl),
  };
}

function toMessage(response: AiChatResponse): AiMessage {
  return {
    id: response.messageId,
    role: 'assistant',
    content: response.content,
    createdAt: new Date(),
    conversationId: response.conversationId,
    attachments: response.attachments?.map(attachmentToMessage) ?? [],
    generatedImageUrl: resolveMediaUrl(response.generatedImageUrl),
  };
}

export class HttpAiAssistantService implements AiAssistantService {
  async sendMessage(request: SendAiMessageRequest): Promise<AiMessage> {
    if (request.audience === 'customer') {
      const conversationId = request.conversationId
        ?? window.localStorage.getItem(CUSTOMER_CONVERSATION_KEY)
        ?? undefined;

      const response = await apiRequest<AiChatResponse>('/api/ai/customer/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: request.message,
          conversationId,
          sessionId: getOrCreateCustomerSession(),
        }),
      });

      window.localStorage.setItem(CUSTOMER_CONVERSATION_KEY, response.conversationId);
      return toMessage(response);
    }

    const formData = new FormData();
    formData.append('Message', request.message);

    const conversationId = request.conversationId
      ?? window.localStorage.getItem(SELLER_CONVERSATION_KEY)
      ?? undefined;

    if (conversationId) formData.append('ConversationId', conversationId);
    request.attachments?.forEach((attachment) => {
      formData.append('Files', attachment.file, attachment.name);
    });

    const response = await apiRequest<AiChatResponse>('/api/ai/seller/chat', {
      method: 'POST',
      body: formData,
    });

    window.localStorage.setItem(SELLER_CONVERSATION_KEY, response.conversationId);
    return toMessage(response);
  }
}

export const aiAssistantService: AiAssistantService = new HttpAiAssistantService();
