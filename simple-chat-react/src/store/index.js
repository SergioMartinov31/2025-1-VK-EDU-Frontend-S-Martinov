// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import chatsReducer from './chatsSlice';

//chatsSlice - Хранит данные о чатах и функции для работы изменения этих данных
// Создаем store
const store = configureStore({
  reducer: {
    chats: chatsReducer //отдель chats,chatsReducer- функция для управления этими отделами 
  }
});

// Экспортируем store
export { store };