"use server"

import nodemailer from 'nodemailer'

export async function submitEmail(formData: FormData) {
  const email = formData.get('email') as string

  if (!email || !email.includes('@')) {
    return { success: false, message: 'Некорректный email' }
  }


  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const chatUrl = process.env.NEXT_PUBLIC_CHAT_URL ?? 'http://192.168.1.113:5173/';

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,  
      to: email,                 
      subject: 'Добро пожаловать в SimpleChat!',
      html: `
        <h2>Привет! 👋</h2>
        <p>Ты оставил email на лендинге SimpleChat.</p>
        <p>Вот ссылка на чат: <a href="${chatUrl}">Открыть SimpleChat</a></p>
      `,
    })

    console.log('📧 Письмо отправлено на:', email)
    return { success: true, message: email }

  } catch (error) {
    console.error('Ошибка отправки:', error)
    return { success: false, message: 'Не удалось отправить письмо' }
  }

}