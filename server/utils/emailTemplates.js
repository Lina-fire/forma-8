// Шаблон письма об изменении статуса заказа
const getOrderStatusTemplate = (orderId, status, username, totalAmount) => {
  const statusMessages = {
    'новый': '✅ Ваш заказ принят и ожидает обработки',
    'в обработке': '🔄 Ваш заказ передан в обработку',
    'отправлен': '📦 Ваш заказ отправлен!',
    'доставлен': '🎉 Ваш заказ доставлен! Спасибо за покупку!',
    'отменен': '❌ Ваш заказ был отменен'
  };

  const statusDetails = {
    'новый': 'Мы уже начали его обрабатывать. Ожидайте подтверждения.',
    'в обработке': 'Наши менеджеры проверяют наличие товаров и готовят заказ к отправке.',
    'отправлен': 'Трек-номер для отслеживания будет отправлен дополнительно.',
    'доставлен': 'Надеемся, вам понравилась наша продукция! Ждем вас снова.',
    'отменен': 'Если вы не отменяли заказ, пожалуйста, свяжитесь с нами.'
  };

  const statusColors = {
    'новый': '#ffc107',
    'в обработке': '#17a2b8',
    'отправлен': '#007bff',
    'доставлен': '#28a745',
    'отменен': '#dc3545'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #c41e3a; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .status { display: inline-block; padding: 8px 16px; background: ${statusColors[status]}; color: white; border-radius: 20px; font-weight: bold; }
        .order-details { background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #888; }
        .button { display: inline-block; padding: 10px 20px; background: #c41e3a; color: white; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🛍️ Форма №8</h2>
          <p>Ателье спецодежды</p>
        </div>
        <div class="content">
          <h3>Здравствуйте, ${username}!</h3>
          <p>Статус вашего заказа <strong>№${orderId}</strong> изменился:</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <span class="status">${status.toUpperCase()}</span>
          </div>
          
          <p style="font-size: 18px;">${statusMessages[status] || 'Статус заказа обновлен'}</p>
          <p>${statusDetails[status] || 'Подробную информацию вы можете посмотреть в личном кабинете.'}</p>
          
          <div class="order-details">
            <p><strong>📋 Информация о заказе:</strong></p>
            <p>Номер заказа: <strong>${orderId}</strong></p>
            <p>Сумма заказа: <strong>${totalAmount} ₽</strong></p>
            <p>Дата: ${new Date().toLocaleDateString('ru-RU')}</p>
          </div>
          
          <div style="text-align: center;">
            <a href="http://localhost:3000/profile" class="button">Перейти в личный кабинет</a>
          </div>
        </div>
        <div class="footer">
          <p>© 2025 Ателье спецодежды "Форма №8"</p>
          <p>г. Ковров, ул. Ленина, д. 10 | +7 (900) 123-45-67</p>
          <p>Это письмо было отправлено автоматически, пожалуйста, не отвечайте на него.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Шаблон письма об изменении статуса заявки в ателье
const getRequestStatusTemplate = (requestId, status, username, serviceType, description) => {
  const statusMessages = {
    'новая': '📝 Ваша заявка принята!',
    'в работе': '👨‍🔧 Ваша заявка взята в работу',
    'выполнена': '✅ Ваша заявка выполнена!',
    'отменена': '❌ Ваша заявка была отменена'
  };

  const statusDetails = {
    'новая': 'Мы рассмотрим вашу заявку и свяжемся с вами в ближайшее время.',
    'в работе': 'Мастер приступил к выполнению вашего заказа. Следите за обновлениями.',
    'выполнена': 'Ваш заказ готов! Вы можете забрать его в нашем ателье.',
    'отменена': 'Если у вас есть вопросы, пожалуйста, свяжитесь с нами.'
  };

  const statusColors = {
    'новая': '#ffc107',
    'в работе': '#17a2b8',
    'выполнена': '#28a745',
    'отменена': '#dc3545'
  };

  const serviceTypeText = {
    'ремонт': 'Ремонт одежды',
    'пошив': 'Индивидуальный пошив',
    'подгонка': 'Подгонка по фигуре'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #c41e3a; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .status { display: inline-block; padding: 8px 16px; background: ${statusColors[status]}; color: white; border-radius: 20px; font-weight: bold; }
        .request-details { background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #888; }
        .button { display: inline-block; padding: 10px 20px; background: #c41e3a; color: white; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>✂️ Форма №8 - Ателье</h2>
          <p>Индивидуальный подход к каждому клиенту</p>
        </div>
        <div class="content">
          <h3>Здравствуйте, ${username}!</h3>
          <p>Статус вашей заявки <strong>№${requestId}</strong> изменился:</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <span class="status">${status.toUpperCase()}</span>
          </div>
          
          <p style="font-size: 18px;">${statusMessages[status] || 'Статус заявки обновлен'}</p>
          <p>${statusDetails[status] || 'Подробную информацию вы можете посмотреть в личном кабинете.'}</p>
          
          <div class="request-details">
            <p><strong>📋 Информация о заявке:</strong></p>
            <p>Номер заявки: <strong>${requestId}</strong></p>
            <p>Тип услуги: <strong>${serviceTypeText[serviceType] || serviceType}</strong></p>
            <p>Описание: <strong>${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</strong></p>
            <p>Дата: ${new Date().toLocaleDateString('ru-RU')}</p>
          </div>
          
          <div style="text-align: center;">
            <a href="http://localhost:3000/profile" class="button">Перейти в личный кабинет</a>
          </div>
        </div>
        <div class="footer">
          <p>© 2025 Ателье спецодежды "Форма №8"</p>
          <p>г. Ковров, ул. Ленина, д. 10 | +7 (900) 123-45-67</p>
          <p>Это письмо было отправлено автоматически, пожалуйста, не отвечайте на него.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = { getOrderStatusTemplate, getRequestStatusTemplate };