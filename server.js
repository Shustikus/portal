const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const sendMail = require('./mailer');  // Импортируем функцию отправки почты

const app = express();
const PORT = 3000;

const sectionsData = require('./sectionsData');  // Импортируем файл с данными

// Включаем CORS для всех маршрутов
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));  // Парсинг данных формы

// Настраиваем шаблонизатор EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'portal'));

// Статические файлы
app.use(express.static(path.join(__dirname, 'portal')));
app.use('/upload', express.static(path.join(__dirname, 'portal', 'upload')));

// Создаем директорию для загрузки изображений, если её нет
const UPLOAD_DIR = path.join(__dirname, 'portal', 'upload');
fs.mkdirSync(UPLOAD_DIR, {recursive: true});

// Middleware для получения фида
app.use(async (req, res, next) => {
    try {
        const response = await axios.get('https://rostselmash.com/feed/for-dealers/file.json');
        req.feedData = response.data; // Сохраняем данные в объект запроса
        req.apiUrl = 'http://localhost:3000'; // Установите API_URL
    } catch (error) {
        console.error('Ошибка при получении фида:', error);
    }
    next();
});

// Главная страница
app.get('/', (req, res) => {
    res.render('index', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Страница "О дилере"
app.get('/about', (req, res) => {
    res.render('about', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Страница "Контакты"
app.get('/contacts', (req, res) => {
    res.render('contacts', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Страница "Точное земледелие"
app.get('/electronic-systems', (req, res) => {
    res.render('tocnoe-zemledelie', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Страница "Продукты"
app.get('/products', (req, res) => {
    res.render('products', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Страница "Запчасти и сервис"
app.get('/services', (req, res) => {
    res.render('spare-parts', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Страница "Оригинальные запчасти и сервис"
app.get('/services/spares/', (req, res) => {
    res.render('spares', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Страница "Заявка на ремонт"
app.get('/services/request/', (req, res) => {
    res.render('qr', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Страница "Масло Ростсельмаш G-PROFI"
app.get('/services/g-profi-oil/', (req, res) => {
    res.render('g-profi-oil', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Страница "Акции"
app.get('/specials', (req, res) => {
    res.render('specials', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Страница "Финансирование"
app.get('/finance', (req, res) => {
    res.render('finance', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Страница "Где купить"
app.get('/where-buy', (req, res) => {
    res.render('where-buy', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Страница "Лизинг"
app.get('/finance/leasing', (req, res) => {
    res.render('lizing', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Страница "Кредитование"
app.get('/finance/credit', (req, res) => {
    res.render('kreditovanie', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Страница "Страхование"
app.get('/finance/insurance', (req, res) => {
    res.render('sterahovanie', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Страница "Программа лизинга Ростсельмаш Финанс"
app.get('/finance/leasing-rostselmash', (req, res) => {
    res.render('rsm-finance', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Страница "Политика конфиденциальности"
app.get('/policy', (req, res) => {
    res.render('policy', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Страница "Пользовательское соглашение"
app.get('/terms-of-use', (req, res) => {
    res.render('terms-of-use', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Динамическая страница для любого раздела продуктов или Точного земледелия
app.get(['/:category(products|electronic-systems)/:sectionCode'], (req, res) => {
    const {category, sectionCode} = req.params; // Получаем категорию и код секции из URL

    // Определяем, какой раздел данных использовать
    const sectionDataPath = category === 'products' ? req.feedData?.catalog?.sections : req.feedData?.['electronic-systems']?.sections;
    const section = sectionDataPath ? Object.values(sectionDataPath).find(s => s.code === sectionCode) : null;

    // Если раздел найден
    if (section) {
        // Используем данные из sectionsData.js
        const sectionData = sectionsData[sectionCode];

        // Определяем, какую страницу рендерить
        const templateName = category === 'products' ? 'combine' : 'zemledelie';

        // Рендерим страницу
        res.render(templateName, {
            section: section,
            sectionCode: sectionCode,
            sectionTitle: sectionData?.title || '',
            sectionDescription: sectionData?.description || '',
            sectionFullDescription: sectionData?.fullDescription || '',
            sectionDescriptionFooter: sectionData?.descriptionFooter || '',
            feedData: req.feedData,
            rootPath: '/',
            apiUrl: req.apiUrl
        });
    } else {
        // Если раздел не найден, отправляем 404
        res.status(404).send('Страница не найдена');
    }
});

// Динамическая страница для карточки товара по пути вида /:category/:sectionCode/:productCode
app.get('/:category(products|electronic-systems)/:sectionCode/:productCode?', (req, res) => {
    const {category, sectionCode, productCode} = req.params;

    // Проверка для редиректа
    if (category === 'electronic-systems' && sectionCode === 'agrotronik-i-agronomicheskie-servisy' && productCode === 'agrotronik') {
        return res.redirect('/agrotronic/');
    }

    // Определяем путь к секциям в зависимости от категории
    const sectionDataPath = category === 'products' ? req.feedData?.catalog?.sections : req.feedData?.['electronic-systems']?.sections;
    const section = sectionDataPath ? Object.values(sectionDataPath).find(s => s.code === sectionCode) : null;

    // Функция для поиска родительской цепочки секций
    function getParentSections(section, allSections) {
        let parentSections = [];
        let currentSection = section;

        while (currentSection && currentSection.parent_id) {
            const parentSection = allSections.find(s => s.id === currentSection.parent_id);
            if (parentSection) {
                parentSections.unshift(parentSection); // Добавляем в начало массива
                currentSection = parentSection;
            } else {
                break; // Выход из цикла, если родительская секция не найдена
            }
        }
        return parentSections;
    }

    if (section) {

        // Изменяем доступ к элементам для категории "electronic-systems"
        const elements = category === 'products'
            ? (req.feedData?.catalog?.elements ? Object.values(req.feedData.catalog.elements) : [])
            : (req.feedData?.['electronic-systems']?.elements ? Object.values(req.feedData['electronic-systems'].elements) : []);

        if (elements.length === 0) {
            console.log('Нет доступных элементов.');
            return res.status(404).send('Нет доступных товаров.');
        }

        // Поиск продукта по section_id и productCode
        const product = elements.find(e => e.code === productCode && e.section_id === section.id);

        if (product) {
            const allSections = Object.values(sectionDataPath);
            const parentSections = getParentSections(section, allSections);

            const template = category === 'products' ? 'tractor-single' : 'agrotronik';

            return res.render(template, {
                category,
                product,
                section,
                sectionCode,
                parentSections,
                feedData: req.feedData,
                rootPath: '/',
                apiUrl: req.apiUrl
            });
        } else {
            console.log('Товар не найден для productCode:', productCode, 'в секции:', section.id);
            return res.status(404).redirect('/');
        }
    } else {
        console.log('Секция не найдена для sectionCode:', sectionCode);
        return res.status(404).redirect('/');
    }
});

// Редирект на rsm_agrotronic по пути /agrotronik/
app.get('/agrotronic/', (req, res) => {
    res.render('rsm_agrotronik', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Маршрут для обработки формы
app.post('/services/request/', async (req, res) => {
    const {SERIAL_NUM, PHONE, FIO, EMAIL, DESCRIPTION} = req.body;

    // Используем функцию для отправки почты
    const result = await sendMail.serviceRequest(SERIAL_NUM, PHONE, FIO, EMAIL, DESCRIPTION);

    if (result.success) {
        return res.status(200).send(result.message);
    } else {
        return res.status(500).send(result.message);
    }
});

// Маршрут для обработки формы c id = contact-us-form
app.post('/write_us/', async (req, res) => {
    const {PROP_NAME, PROP_EMAIL, PROP_PHONE, PROP_DIRECTION, PROP_QUESTION} = req.body;

    // Используем функцию для отправки почты
    const result = await sendMail.writeUs(PROP_NAME, PROP_EMAIL, PROP_PHONE, PROP_DIRECTION, PROP_QUESTION);

    if (result.success) {
        return res.status(200).send(result.message);
    } else {
        return res.status(500).send(result.message);
    }
});

// Маршрут для обработки формы c id = technic-invite
app.post('/technic_invite/', async (req, res) => {
    const {PROP_NAME, PROP_PHONE, PROP_PRODUCT_NAME} = req.body;

    // Используем функцию для отправки почты
    const result = await sendMail.technicInvite(PROP_NAME, PROP_PHONE, PROP_PRODUCT_NAME);

    if (result.success) {
        return res.status(200).send(result.message);
    } else {
        return res.status(500).send(result.message);
    }
});

// Маршрут для обработки формы c id = leasing
app.post('/credit/', async (req, res) => {
    const {
        FORM_NAME,
        PROP_TYPE,
        PROP_NAME,
        PROP_PHONE,
        PROP_BANK,
        PROP_EMAIL,
        PROP_MESSAGE,
        PROP_PRODUCT_NAME
    } = req.body;

    // Используем функцию для отправки почты
    const result = await sendMail.credit(FORM_NAME, PROP_TYPE, PROP_NAME, PROP_PHONE, PROP_BANK, PROP_EMAIL, PROP_MESSAGE, PROP_PRODUCT_NAME);

    if (result.success) {
        return res.status(200).send(result.message);
    } else {
        return res.status(500).send(result.message);
    }
});

// Маршрут для обработки формы c id = leasing
app.post('/dem_pokaz/', async (req, res) => {
    const {PROP_NAME, PROP_PHONE, PROP_DEM_POKAZ} = req.body;

    // Используем функцию для отправки почты
    const result = await sendMail.demoEvent(PROP_NAME, PROP_PHONE, PROP_DEM_POKAZ);

    if (result.success) {
        return res.status(200).send(result.message);
    } else {
        return res.status(500).send(result.message);
    }
});

// Маршрут для обработки формы c id = leasing
app.post('/request/', async (req, res) => {
    const {PROP_NAME, PROP_PHONE, PROP_MAIL, PROP_PRODUCT_NAME} = req.body;

    // Используем функцию для отправки почты
    const result = await sendMail.requestForTo(PROP_NAME, PROP_PHONE, PROP_MAIL, PROP_PRODUCT_NAME);

    if (result.success) {
        return res.status(200).send(result.message);
    } else {
        return res.status(500).send(result.message);
    }
});

// Маршрут для обработки формы c id = leasing
app.post('/support/', async (req, res) => {
    const {PROP_NAME, PROP_PHONE, PROP_QUESTION, PROP_PRODUCT_NAME} = req.body;

    // Используем функцию для отправки почты
    const result = await sendMail.technicalSupport(PROP_NAME, PROP_PHONE, PROP_QUESTION, PROP_PRODUCT_NAME);

    if (result.success) {
        return res.status(200).send(result.message);
    } else {
        return res.status(500).send(result.message);
    }
});

// Прокси-маршрут для поиска по запросу
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    try {
        const response = await axios.get(`https://rostselmash.com/search/serch-ajax.php?q=${encodeURIComponent(query)}`);
        await saveImages(response.data); // Сохраняем изображения
        res.json(response.data); // Возвращаем данные на фронтенд
    } catch (error) {
        console.error('Ошибка при запросе поиска:', error);
        res.status(500).json({message: 'Ошибка при запросе поиска'});
    }
});

// Функция для сохранения изображений
async function saveImages(data) {
    const $ = cheerio.load(data); // Загружаем HTML в cheerio
    const imgElements = $('img'); // Находим все <img> элементы

    // Проверяем, что imgElements является массивом
    if (!imgElements.length) {
        console.error('Ожидались изображения, но ничего не найдено.');
        return;
    }

    // Создаем массив промисов для загрузки и сохранения всех изображений
    const imgPromises = imgElements.map(async (index, element) => {
        const imgUrl = $(element).attr('src');
        if (imgUrl && imgUrl.startsWith('/upload')) {
            const fullUrl = `https://rostselmash.com${imgUrl}`;
            return await saveImage(fullUrl);
        }
    }).get();

    await Promise.all(imgPromises); // Ожидаем завершения всех промисов
}

// Функция для загрузки и сохранения изображения
async function saveImage(url) {
    try {
        const response = await axios.get(url, {responseType: 'arraybuffer'});
        if (response.status === 200) {
            const relativePath = url.replace('https://rostselmash.com/upload/', '');
            const imageDir = path.dirname(relativePath);
            const imageName = path.basename(relativePath);
            const fullDirPath = path.join(UPLOAD_DIR, imageDir);
            fs.mkdirSync(fullDirPath, {recursive: true});
            const imagePath = path.join(fullDirPath, imageName);
            fs.writeFileSync(imagePath, response.data);
        } else {
            console.error(`Ошибка при загрузке изображения: ${url}, статус: ${response.status}`);
        }
    } catch (error) {
        console.error(`Ошибка при загрузке изображения: ${url}`, error.message);
    }
}

// Обработка ошибок 404
app.use((req, res) => {
    res.status(404).redirect('/'); // Перенаправляем на главную страницу
});

// Обработка других ошибок (например, 500)
app.use((err, req, res) => {
    console.error(err.stack); // Логируем ошибку на сервере
    res.status(500).send('Что-то пошло не так!'); // Можно настроить это сообщение по вашему усмотрению
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
