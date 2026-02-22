export const auth = async ({ isLogin, username, password }) => {
  if (!username?.trim() || !password?.trim()) {
    throw new Error('Введите логин и пароль');
  }

  const endpoint = isLogin ? '/api/login' : '/api/register';

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new Error('Ошибка соединения с сервером');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Некорректный ответ от сервера');
  }

  if (!response.ok || !data?.success) {
    throw new Error(data?.error || 'Произошла ошибка');
  }

  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return { user: data.user || null, token: data.token || null };
};
