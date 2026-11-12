import apiClient from './client';
import { mapSubmission } from './forms';

const messagesApi = {
  getMessages: (params) => apiClient.get('/messages', { params }).then((res) => {
    const payload = res.data;
    const messages = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : payload?.data && Array.isArray(payload.data.messages)
          ? payload.data.messages
          : Array.isArray(payload?.messages)
            ? payload.messages
            : null;

    if (!messages) {
      throw new Error('Messages API returned an invalid response.');
    }

    return {
      ...res,
      data: {
        ...(Array.isArray(payload) ? {} : payload),
        data: messages.map(mapSubmission),
      },
    };
  }),
};

export default messagesApi;
