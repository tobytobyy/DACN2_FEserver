import { api } from '../../services/api';

export const fetchChatSessions = async () => {
  const res = await api.get('/chat/sessions');
  return res.data?.data || [];
};

export const createChatSession = async () => {
  const res = await api.post('/chat/sessions', {});
  return res.data?.data || null;
};

export const fetchMessages = async (sessionId: string) => {
  const res = await api.get(`/chat/sessions/${sessionId}/messages`);
  return (
    res.data?.data?.map((msg: any) => ({
      role: msg.role === 'USER' ? 'user' : 'assistant',
      content: msg.content,
    })) || []
  );
};

type SendMessageOpts = {
  imageObjectKey?: string;
  meta?: Record<string, any>;
};

export const sendMessage = async (
  sessionId: string,
  content: string,
  opts?: SendMessageOpts,
) => {
  const res = await api.post(`/chat/sessions/${sessionId}/messages`, {
    content,
    imageObjectKey: opts?.imageObjectKey,
    meta: opts?.meta,
  });

  const data = res.data?.data;
  return {
    user: data?.userMessage,
    assistant: data?.assistantMessage,
  };
};
