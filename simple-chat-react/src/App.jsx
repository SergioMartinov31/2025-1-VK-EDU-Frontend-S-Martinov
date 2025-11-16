import { useEffect, useState } from 'react'
import { Routes, Route } from "react-router-dom"

import './App.css'
import { PageChatList } from "./pages/PageChatList/PageChatList"
import {PageChat} from "./pages/PageChat/PageChat"

import { getChats } from './api/chats'

function App() {
  const [chats, setChats] = useState([])


  useEffect(() => {
    setChats(getChats());
  },[])


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
