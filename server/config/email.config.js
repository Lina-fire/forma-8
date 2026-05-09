const nodemailer = require('nodemailer');

// Настройки для Mail.ru (можно использовать и другие почтовые сервисы)
const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: 'polinatoropova1212@mail.ru',
    pass: 'Polina@12121020'
  }
});

// Функция отправки письма
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Форма №8" <${process.env.EMAIL_USER || 'your-email@mail.ru'}>`,
      to: to,
      subject: subject,
      html: html
    });
    console.log(`✅ Письмо отправлено на ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Ошибка отправки письма:', error);
    return false;
  }
};

module.exports = { sendEmail };