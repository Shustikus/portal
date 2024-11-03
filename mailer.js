const nodemailer = require('nodemailer');

// Создаем транспорт для отправки почты
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'info@smolagrosnab.ru', // Ваша почта
        pass: 'PXtSRhyXTrqsMmy5zn93'   // Пароль от почты или пароль приложения
    }
});

// Универсальная функция для отправки почты
async function sendMail({subject, text}) {
    const mailOptions = {
        from: 'info@smolagrosnab.ru', // Отправитель
        to: 'info@smolagrosnab.ru',    // Адресат
        subject,
        text
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return {success: true, message: 'Заявка успешно отправлена!'};
    } catch (error) {
        console.error('Ошибка при отправке почты:', error);
        return {success: false, message: 'Ошибка при отправке заявки.'};
    }
}

const site = 'с сайта smolagrosnab.ru';

// Функция для отправки заявки на сервисное обслуживание
async function serviceRequest(serialNum, phone, fio, email, description) {
    const text = `Серийный номер: ${serialNum}\nТелефон: ${phone}\nФИО: ${fio}\nE-mail: ${email}\nОписание проблемы: ${description}`;
    return await sendMail({
        subject: `Новая заявка на сервисное обслуживание ${site}`,
        text
    });
}

// Функция для отправки вопроса
async function writeUs(name, email, phone, direction, question) {
    const text = `Имя: ${name}\nE-mail: ${email}\nТелефон: ${phone}\nНаправление: ${direction}\nВопрос: ${question}`;
    return await sendMail({
        subject: `Новый вопрос ${site}`,
        text
    });
}

// Функция для отправки вопроса
async function technicInvite(name, phone, product) {
    const text = `Имя: ${name}\nТелефон: ${phone}\nПродукт: ${product}`;
    return await sendMail({
        subject: `Новая заявка ${site}`,
        text
    });
}

// Функция для отправки вопроса
async function credit(form_name, type, name, phone, bank, email, message, product) {
    let text = `Имя: ${name}\nТелефон: ${phone}\nТип заявки: ${type}\nE-mail: ${email}\nСообщение: ${message}`;

    // Проверяем, существует ли product, если да — добавляем его в текст
    if (product) {
        text += `\nПродукт: ${product}`;
    }
    if (bank) {
        text += `\nБанк: ${bank}`
    }
    return await sendMail({
        subject: `Новая заявка на ${form_name} ${site}`,
        text
    });
}

// Функция для отправки вопроса
async function demoEvent(name, phone, dem_pokaz) {
    const text = `Имя: ${name}\nТелефон: ${phone}\nТип демопоказа: ${dem_pokaz}`;
    return await sendMail({
        subject: `Новая заявка на демопоказ ${site}`,
        text
    });
}

// Функция для отправки заявки на сервисное обслуживание
async function requestForTo(phone, name, email, product) {
    const text = `\nТелефон: ${phone}\nИмя: ${name}\nE-mail: ${email}\nПродукт: ${product}`;
    return await sendMail({
        subject: `Новая заявка на сервисное обслуживание ${site}`,
        text
    });
}

// Функция для отправки заявки на сервисное обслуживание
async function technicalSupport(phone, name, question, product) {
    const text = `\nТелефон: ${phone}\nИмя: ${name}\nВопрос: ${question}\nПродукт: ${product}`;
    return await sendMail({
        subject: `Новая заявка на техническое обслуживание ${site}`,
        text
    });
}

module.exports = {
    serviceRequest,
    writeUs,
    technicInvite,
    credit,
    demoEvent,
    requestForTo,
    technicalSupport
};