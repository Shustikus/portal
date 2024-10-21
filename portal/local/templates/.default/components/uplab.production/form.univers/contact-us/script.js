window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('contact-us-form').onsubmit = async function (event) {
        event.preventDefault(); // Остановить стандартную отправку формы

        const formData = new URLSearchParams(new FormData(this));

        try {
            const response = await fetch(this.action, {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: formData.toString()
            });

            // Обработка ответа сервера, но без вывода сообщений
            if (!response.ok) {
                console.error('Ошибка при отправке. Код:', response.status);
            }
        } catch (error) {
            console.error('Не удалось отправить заявку:', error);
        }
    };
});

