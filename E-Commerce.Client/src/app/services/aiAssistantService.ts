import { getAuthSession } from '../auth/authSession';
import { API_BASE_URL } from '../config/runtime';
import {
  AiAssistantService,
  AiMessage,
  AiMessageAttachment,
  SendAiMessageRequest,
} from '../types/ai';
import { ApiError, apiRequest } from './apiClient';

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
const LEGACY_CUSTOMER_CONVERSATION_KEY = 'e-commerce.ai-customer-conversation';
const LEGACY_SELLER_CONVERSATION_KEY = 'e-commerce.ai-seller-conversation';
const CUSTOMER_CONVERSATION_PREFIX = `${LEGACY_CUSTOMER_CONVERSATION_KEY}:`;
const SELLER_CONVERSATION_PREFIX = `${LEGACY_SELLER_CONVERSATION_KEY}:`;

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

function removeLegacyConversationKeys() {
  // Older Client versions stored one global conversation id for every user.
  // That id becomes invalid after an AI database reset or an account change and
  // causes the backend to return "AI conversation was not found".
  window.localStorage.removeItem(LEGACY_CUSTOMER_CONVERSATION_KEY);
  window.localStorage.removeItem(LEGACY_SELLER_CONVERSATION_KEY);
}

function customerConversationKey(sessionId: string) {
  const userId = getAuthSession()?.userId;
  return userId
    ? `${CUSTOMER_CONVERSATION_PREFIX}user:${userId}`
    : `${CUSTOMER_CONVERSATION_PREFIX}session:${sessionId}`;
}

function sellerConversationKey() {
  const userId = getAuthSession()?.userId;
  return `${SELLER_CONVERSATION_PREFIX}user:${userId ?? 'unknown'}`;
}

function getConversationId(storageKey: string, requestedId?: string) {
  return requestedId ?? window.localStorage.getItem(storageKey) ?? undefined;
}

function saveConversationId(storageKey: string, conversationId: string) {
  if (conversationId.trim()) {
    window.localStorage.setItem(storageKey, conversationId);
  }
}

function isMissingConversationError(error: unknown) {
  return error instanceof ApiError && error.status === 404;
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

async function postCustomerMessage(
  message: string,
  sessionId: string,
  conversationId?: string,
) {
  return apiRequest<AiChatResponse>('/api/ai/customer/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      conversationId,
      sessionId,
    }),
  });
}

async function postSellerMessage(
  message: string,
  attachments: SendAiMessageRequest['attachments'],
  conversationId?: string,
) {
  const formData = new FormData();
  formData.append('Message', message);

  if (conversationId) {
    formData.append('ConversationId', conversationId);
  }

  attachments?.forEach((attachment) => {
    formData.append('Files', attachment.file, attachment.name);
  });

  return apiRequest<AiChatResponse>('/api/ai/seller/chat', {
    method: 'POST',
    body: formData,
  });
}

export class HttpAiAssistantService implements AiAssistantService {
  async sendMessage(request: SendAiMessageRequest): Promise<AiMessage> {
    removeLegacyConversationKeys();

    if (request.audience === 'customer') {
      return this.sendCustomerMessage(request);
    }

    return this.sendSellerMessage(request);
  }

  private async sendCustomerMessage(request: SendAiMessageRequest): Promise<AiMessage> {
    const sessionId = getOrCreateCustomerSession();
    const storageKey = customerConversationKey(sessionId);
    const conversationId = getConversationId(storageKey, request.conversationId);

    try {
      const response = await postCustomerMessage(
        request.message,
        sessionId,
        conversationId,
      );

      saveConversationId(storageKey, response.conversationId);
      return toMessage(response);
    } catch (error) {
      if (!conversationId || !isMissingConversationError(error)) {
        throw error;
      }

      // The backend no longer has the locally cached conversation (for example,
      // after a database reset). Clear only that stale id and retry once so the
      // backend can create a fresh conversation for the same message.
      window.localStorage.removeItem(storageKey);

      const response = await postCustomerMessage(
        request.message,
        sessionId,
      );

      saveConversationId(storageKey, response.conversationId);
      return toMessage(response);
    }
  }

  private async sendSellerMessage(request: SendAiMessageRequest): Promise<AiMessage> {
    const storageKey = sellerConversationKey();
    const conversationId = getConversationId(storageKey, request.conversationId);

    try {
      const response = await postSellerMessage(
        request.message,
        request.attachments,
        conversationId,
      );

      saveConversationId(storageKey, response.conversationId);
      return toMessage(response);
    } catch (error) {
      if (!conversationId || !isMissingConversationError(error)) {
        throw error;
      }

      window.localStorage.removeItem(storageKey);

      const response = await postSellerMessage(
        request.message,
        request.attachments,
      );

      saveConversationId(storageKey, response.conversationId);
      return toMessage(response);
    }
  }
}

export const aiAssistantService: AiAssistantService = new HttpAiAssistantService();
