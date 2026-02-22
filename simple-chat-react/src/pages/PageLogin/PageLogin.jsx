import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../features/auth'
import './PageLogin.scss';

export const PageLogin = ({ setIsAuthenticated, setCurrentUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { user } = await auth({ isLogin, username, password });
      setCurrentUser(user);
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <div className="auth-container">
        {isLogin ? (
          <>
            <h1>Вход в чат</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Логин"
                  className="login-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль"
                  className="login-input"
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Войти
              </button>
              {error && <div className="error-message">{error}</div>}
              <div className="auth-switch">
                <button 
                  type="button"
                  className="switch-button"
                  onClick={() => setIsLogin(false)}
                >
                  Нет аккаунта? Создать
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h1>Создать аккаунт</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Логин"
                  className="login-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль"
                  className="login-input"
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Создать аккаунт
              </button>
              {error && <div className="error-message">{error}</div>}
              <div className="auth-switch">
                <button 
                  type="button"
                  className="switch-button"
                  onClick={() => setIsLogin(true)}
                >
                  Уже есть аккаунт? Войти
                </button>
              </div>
            </form>
          </>
        )}
        
      </div>
    </div>
  )
}