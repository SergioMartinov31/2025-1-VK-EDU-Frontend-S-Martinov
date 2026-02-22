// simple-chat-react/src/api/chatsAPI.js
// const API_BASE_URL = 'http://localhost:3001/api';
const API_BASE_URL = 'http://192.168.1.113:3001/api'; 

// Функция для получения токена из localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Базовые заголовки с токеном
const getAuthHeaders = (contentType = 'application/json') => {
  const headers = {};
  
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const getChats = async () => {
  try {
    console.log('🟡 Запрашиваю чаты... Токен:', getToken() ? 'есть' : 'нет');
    
    const response = await fetch(`${API_BASE_URL}/chats`, {
      headers: getAuthHeaders()
    });
    
    if (response.status === 401) {
      console.error('❌ Ошибка 401: Неавторизован');
      throw new Error('Неавторизован');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Чаты получены:', data.length, 'чатов');
    return data;
    
  } catch (error) {
    console.error('❌ Ошибка при загрузке чатов:', error);
    throw error;
  }
};

export const getChatsList = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/chats-list`, {
      headers: getAuthHeaders()
    });
    
    if (response.status === 401) {
      throw new Error('Неавторизован');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('❌ Ошибка при загрузке списка чатов:', error);
    throw error;
  }
};

export const addMyMessageToChat = async (chatId, text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text }),
    });
    
    if (response.status === 401) {
      throw new Error('Неавторизован');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('❌ Ошибка при отправке текстового сообщения:', error);
    throw error;
  }
};

export const addMyVoiceMessageToChat = async (chatId, voiceMessageObj) => {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append('voice', voiceMessageObj.file);
    formData.append('duration', voiceMessageObj.duration || 0);
    
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/voice-upload`, {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    
    if (response.status === 401) {
      throw new Error('Неавторизован');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('❌ Ошибка при отправке голосового сообщения:', error);
    throw error;
  }
};

export const deleteMessageFromChat = async (chatId, messageId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ messageId }),
    });
    
    if (response.status === 401) {
      throw new Error('Неавторизован');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('❌ Ошибка при удалении текстового сообщения:', error);
    throw error;
  }
};