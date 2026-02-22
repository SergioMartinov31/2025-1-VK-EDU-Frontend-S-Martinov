import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import './App.css';
import './index.css';

import { PageChatList } from '../pages/PageChatList';
import { PageChat } from '../pages/PageChat';
import { PageLogin } from '../pages/PageLogin';
import { ChatProfilePanel } from '../widgets/chat-profile-panel';
import { useAuthSession } from './model/useAuthSession';
import { useChats } from './model/useChats';
import { useChatsPolling } from './model/useChatsPolling';

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
    return <div className='loading-screen'>Проверка авторизации...</div>;
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
                <PageChatList
                  ChatsLog={chats}
                  currentUser={currentUser}
                  setIsAuthenticated={setIsAuthenticated}
                  setCurrentUser={setCurrentUser}
                />
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
                <ChatProfilePanel
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
