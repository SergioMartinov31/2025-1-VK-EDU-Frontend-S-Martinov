import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import './index.css'

import { PageChatList } from '../pages/PageChatList';
import { PageChat } from '../pages/PageChat';
import { PageLogin } from '../pages/PageLogin';
import { ChatPriofile } from '../widgets/ChatProfile';
import { useAuthSession } from '../shared/hooks/useAuthSession';
import { useChats } from '../shared/hooks/useChats';
import { useChatsPolling } from '../shared/hooks/useChatsPolling';

function App() {
  const [showProfile, setShowProfile] = useState(false);

  const {
    isAuthenticated,
    setIsAuthenticated,
    currentUser,
    setCurrentUser,
    authChecking,
  } = useAuthSession();

  const { chats, setChats } = useChats({ isAuthenticated, currentUser });

  useChatsPolling({ isAuthenticated, setChats, interval: 5000 });

  if (authChecking) {
    return <div className="loading-screen">Проверка авторизации...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className='pagesContainer'>
        <Routes>
          <Route
            path='/login'
            element={
              <PageLogin
                setIsAuthenticated={setIsAuthenticated}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <main>
      <div className='pagesContainer'>
        <Routes>
          <Route
            path='/'
            element={
              <>
                <PageChatList ChatsLog={chats} currentUser={currentUser} />
                <div className='Chat-container'>
                  <h2 className='Chat-container__selectTitle'>Выберите чат слева</h2>
                </div>
              </>
            }
          />
          <Route
            path='/chat/:chatId'
            element={
              <>
                <PageChatList
                  ChatsLog={chats}
                  currentUser={currentUser}
                  setIsAuthenticated={setIsAuthenticated}
                  setCurrentUser={setCurrentUser}
                />
                <PageChat
                  selectChatAPI={chats}
                  setChats={setChats}
                  setShowProfile={setShowProfile}
                />
                <ChatPriofile
                  selectChatAPI={chats}
                  showProfile={showProfile}
                  setShowProfile={setShowProfile}
                />
              </>
            }
          />

          <Route path='/login' element={<Navigate to='/' replace />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
