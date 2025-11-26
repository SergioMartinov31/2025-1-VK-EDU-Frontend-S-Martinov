import { useEffect, useState } from 'react'
import { Routes, Route } from "react-router-dom"

import './App.css'
import { PageChatList } from "./pages/PageChatList/PageChatList"
import {PageChat} from "./pages/PageChat/PageChat"

import { getChats } from './api/chatsAPI'

function App() {
  const [chats, setChats] = useState([])


useEffect(() => {
  const loadChats = async () => {
    try {
      console.log('🟡 Начинаю загрузку чатов...');
      const chatsData = await getChats();
      console.log('🟢 Данные получены:', chatsData);
      console.log('🟢 Тип данных:', typeof chatsData);
      console.log('🟢 Это массив?', Array.isArray(chatsData));
      
      setChats(chatsData);
    } catch (error) {
      console.error('🔴 Ошибка:', error);
      console.log('🟡 Устанавливаю пустой массив');
      setChats([]);
    }
  }
  loadChats();
}, [])

  return (
    <div className='pagesContainer'>
      {/* Список чатов виден всегда */}
      <PageChatList ChatsLog={chats} ></PageChatList>

      <Routes>
        {/* {Нет активного чата} */}
        <Route
          path='/'
          element={
            <div className='Chat-container'>
              <h2 className='Chat-container__selectTitle'>Выберите чат слева</h2>
            </div>
          }
        />
        {/* {Страница активного чата} */}
        <Route
          path='/chat/:chatId'
          element={
            <PageChat selectChatAPI={chats}  setChats={setChats}></PageChat>
          }
        />
      </Routes>
      
    </div>
  )
}

export default App
