const nodemailer = require('nodemailer');

// Создаем транспорт для отправки почты
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'miska.channel@mail.ru', // Ваша почта
        pass: 'haw7m2VKxfPpuz0uGiJM'   // Пароль от почты или пароль приложения
    }
});

// Универсальная функция для отправки почты
async function sendMail({ subject, text }) {
    const mailOptions = {
        from: 'miska.channel@mail.ru', // Отправитель
        to: 'miska.channel@mail.ru',    // Адресат
        subject,
        text
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return { success: true, message: 'Заявка успешно отправлена!' };
    } catch (error) {
        console.error('Ошибка при отправке почты:', error);
        return { success: false, message: 'Ошибка при отправке заявки.' };
    }
}

// Функция для отправки заявки на сервисное обслуживание
async function serviceRequest(serialNum, phone, fio, email, description) {
    const text = `Серийный номер: ${serialNum}\nТелефон: ${phone}\nФИО: ${fio}\nE-mail: ${email}\nОписание проблемы: ${description}`;
    return await sendMail({
        subject: 'Заявка на сервисное обслуживание',
        text
    });
}

// Функция для отправки вопроса
async function writeUs(name, email, phone, direction, question) {
    const text = `Имя: ${name}\nE-mail: ${email}\nТелефон: ${phone}\nНаправление: ${direction}\nВопрос: ${question}`;
    return await sendMail({
        subject: 'Новый вопрос от пользователя',
        text
    });
}

module.exports = {
    serviceRequest,
    writeUs
};