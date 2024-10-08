const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

const sectionsData = require('./sectionsData');  // Импортируем файл с данными

// Включаем CORS для всех маршрутов
app.use(cors());

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

// Страница "Агротроник"
app.get('/products/models-zuk/torum-785', (req, res) => {
    res.render('tractor-single', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
});

// Страница "Агротроник"
app.get('/electronic-systems/agrotronik-i-agronomicheskie-servisy/agrotronik', (req, res) => {
    res.render('agrotronik', {
        feedData: req.feedData,
        rootPath: '/',
        apiUrl: req.apiUrl
    });
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

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
