const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

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

// Middleware для получения фида и сохранения изображений
app.use(async (req, res, next) => {
    try {
        const response = await axios.get('https://rostselmash.com/feed/for-dealers/file.json');
        req.feedData = response.data; // Сохраняем данные в объект запроса
        await saveImages(req.feedData); // Сохраняем изображения
    } catch (error) {
        console.error('Ошибка при получении фида:', error);
    }
    next();
});

// Главная страница
app.get('/', (req, res) => {
    res.render('index', {
        feedData: req.feedData,
        rootPath: '/'
    });
});

// Страница "О дилере"
app.get('/about', (req, res) => {
    res.render('about', {
        feedData: req.feedData,
        rootPath: '/'
    });
});

// Страница "Контакты"
app.get('/contacts', (req, res) => {
    res.render('contacts', {
        feedData: req.feedData,
        rootPath: '/'
    });
});

// Страница "Точное земледелие"
app.get('/electronic-systems', (req, res) => {
    res.render('tocnoe-zemledelie', {
        feedData: req.feedData,
        rootPath: '/'
    });
});

// Страница "Продукты"
app.get('/products', (req, res) => {
    res.render('products', {
        feedData: req.feedData,
        rootPath: '/'
    });
});

// Страница "Запчасти и сервис"
app.get('/services', (req, res) => {
    res.render('spare-parts', {
        feedData: req.feedData,
        rootPath: '/'
    });
});

// Страница "Акции"
app.get('/specials', (req, res) => {
    res.render('specials', {
        feedData: req.feedData,
        rootPath: '/'
    });
});

// Страница "Финансирование"
app.get('/finance', (req, res) => {
    res.render('finance', {
        feedData: req.feedData,
        rootPath: '/'
    });
});

// Страница "Где купить"
app.get('/where-buy', (req, res) => {
    res.render('where-buy', {
        feedData: req.feedData,
        rootPath: '/'
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
    const $ = cheerio.load(data);
    const imgPromises = $('img').map(async (index, element) => {
        const imgUrl = $(element).attr('src');
        if (imgUrl && imgUrl.startsWith('/upload')) {
            const fullUrl = `https://rostselmash.com${imgUrl}`;
            return saveImage(fullUrl);
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
