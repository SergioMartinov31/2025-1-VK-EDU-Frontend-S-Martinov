import { useEffect, useState } from 'react'
import { Routes, Route , Navigate} from "react-router-dom"

import { useDispatch, useSelector } from 'react-redux'
import { loadChats, startLoading, loadingFailed } from './store/chatsSlice'

import './App.css'
import { PageChatList } from "./pages/PageChatList/PageChatList"
import {PageChat} from "./pages/PageChat/PageChat"
import {PageLogin} from './pages/PageLogin/PageLogin'

import { getChats } from './api/chatsAPI'

function App() {
  const [chats, setChats] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  const dispatch = useDispatch(); // функция для отправки действий в Redux
  const reduxChats = useSelector(state => state.chats.chats); // 👈 обратите внимание: state.chats.chats
  const loading = useSelector(state => state.chats.loading);
  const error = useSelector(state => state.chats.error);


  useEffect(() => {
   const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // Проверяем токен на сервере
          const response = await fetch('/api/check-auth', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          if (data.authenticated) {
            setIsAuthenticated(true);
            setCurrentUser(JSON.parse(savedUser));
          } else {
            // Токен невалидный - очищаем
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Ошибка проверки авторизации:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setAuthChecking(false);
    };
    
    checkAuth();
  }, []);


useEffect(() => {
  if (isAuthenticated){
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
  }
}, [isAuthenticated, currentUser])


  if (authChecking) {
    return <div className="loading-screen">Проверка авторизации...</div>;
  }

    if (!isAuthenticated) {
      return(
         <div className='pagesContainer'>
          <Routes>
            <Route
              path='/login'
              element={
                <PageLogin setIsAuthenticated={setIsAuthenticated} setCurrentUser={setCurrentUser}/>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
    )}

    return (
    <main>
    <header className='App-header'>
      {currentUser && (
        <>
        <div className='App-header__userInfo'>
          <img src={`https://avatar.iran.liara.run/public/boy?username=${currentUser.username}`} alt="Аватар" className="user-avatar" />
          <span className='App-header__username'>{currentUser.username}</span>
        </div>
        <button 
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setIsAuthenticated(false);
              setCurrentUser(null);
            }}
          >
            Выйти
        </button>
        </>

      )}
    </header>
    <div className='pagesContainer'>
      {/* Список чатов виден всегда */}
      <PageChatList ChatsLog={chats} currentUser={currentUser}></PageChatList>

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

        <Route path="/login" element={<Navigate to="/" replace />} />
      </Routes>
      
    </div>
    </main>
    )
}



export default App
