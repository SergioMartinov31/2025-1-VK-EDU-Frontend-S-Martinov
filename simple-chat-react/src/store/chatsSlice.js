// src/store/chatsSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Начальное состояние
const initialState = {
  chats: [],      // массив чатов
  loading: false, // загружается ли
  error: null     // ошибка
};

// Создаем slice
const chatsSlice = createSlice({
  name: 'chats', //имя этого slice
  initialState,
  reducers: {
    // Загружаем чаты
    loadChats: (state, action) => {
      state.chats = action.payload;
      state.loading = false;
    },
    // Начинаем загрузку
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Ошибка загрузки
    loadingFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Добавляем сообщение
    addMessage: (state, action) => {
      const { chatId, text } = action.payload;
      const chat = state.chats.find(c => c.id === chatId);
      if (chat) {
        chat.messages.push({
          isOurs: true,
          text,
          time: new Date().toLocaleTimeString()
        });
      }
    }
  }
});

// Экспортируем actions
export const { loadChats, startLoading, loadingFailed, addMessage } = chatsSlice.actions;

// Экспортируем reducer
export default chatsSlice.reducer;