export const config = {
  // Автоматически определяем URL сервера
  API_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3001'
    : `http://${window.location.hostname}:3001`, // Тот же хост, что и фронтенд
  
  // Или хардкодим ваш IP
  // API_URL: 'http://192.168.1.113:3001',
};

