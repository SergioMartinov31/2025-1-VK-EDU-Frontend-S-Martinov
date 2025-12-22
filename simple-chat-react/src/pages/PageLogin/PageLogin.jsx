// PageLogin.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PageLogin.scss';

export const PageLogin = ({ setIsAuthenticated, setCurrentUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // Простая валидация
    if (!username.trim() || !password.trim()) {
      setError('Введите логин и пароль')
      setLoading(false)
      return
    }

    try {
      // Определяем endpoint в зависимости от режима
      const endpoint = isLogin ? '/api/login' : '/api/register'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      const data = await response.json()

      if (response.ok && data.success) {

        localStorage.setItem('token', data.token)

        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
          setCurrentUser(data.user) // передаём в App
        }

        setIsAuthenticated(true)
        navigate('/')

        console.log('✅ Авторизация успешна, токен сохранён')
      } else {
        setError(data.error || 'Произошла ошибка')
      }
      
    } catch (err) {
      // console.error('Ошибка запроса:', err)
      setError('Ошибка соединения с сервером')
    } finally {
      setLoading(false)
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