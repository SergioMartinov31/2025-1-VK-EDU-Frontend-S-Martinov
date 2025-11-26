const API_BASE_URL = 'http://localhost:3001/api';

export const getChats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/chats`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Ошибка при загрузке чатов:', error);
    throw error;
  }
};

export const getChatsList = async () => {
  try{
    const response = await fetch(`${API_BASE_URL}/chats-list`);
    if (!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json();
  } catch(error) {
    console.error('Ошибка при загрузке списка чатов:', error);
    throw error
  }
}

export const addMyMessageToChat = async (chatId, text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    console.error('❌ Ошибка при отправке сообщения:', error)
    throw error
  }
}