

$(document).ready(function() {

    $(document).on('click', '.js-hide-all-dealers-link-js', function(e) {
        $('.js-rt-show-all-dealers').hide();
    })

    $(document).on('click', '.jsInitYmapMainBottom', function(event) {
        $('.js-rt-show-all-dealers').show();

        if ($('#rt-yandex-map').length) {
            console.log('test yandex map');
            function initYandexMap () {
                if (window.yandexMapDidInit) {
                    return false;
                }
                window.yandexMapDidInit = true;

                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.async = true;

                script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';

                $('body')[0].appendChild(script);
            }

            initYandexMap();
            setTimeout(() => {
                ymaps.ready(init);
                $(this).addClass('is-active');

            }, 800);



            function init() {
                console.log('Init map')
                // Создание карты.
                myMap = new ymaps.Map("rt-yandex-map", {
                    // Координаты центра карты.
                    // Порядок по умолчанию: «широта, долгота».
                    // Чтобы не определять координаты центра карты вручную,
                    // воспользуйтесь инструментом Определение координат.
                    center: [55.76, 37.64],
                    // Уровень масштабирования. Допустимые значения:
                    // от 0 (весь мир) до 19.
                    zoom: 7,
                    controls: ['zoomControl'],
                });

                updateYandexMap();
            }
        }
    });


    $(document).on('change', '.map-search-box select.js-select2', function(event) {

        if(window.location.hash === '#tb-m-2') {
            $('.js-rt-show-all-dealers').show();
            if ($('#rt-yandex-map').length) {
                console.log('test yandex map');
                function initYandexMap () {
                    if (window.yandexMapDidInit) {
                        return false;
                    }
                    window.yandexMapDidInit = true;

                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.async = true;

                    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';

                    $('body')[0].appendChild(script);
                }

                initYandexMap();
                setTimeout(() => {
                    ymaps.ready(init);
                    $(this).addClass('is-active');

                }, 1600);



                function init() {
                    console.log('Init map')
                    // Создание карты.
                    myMap = new ymaps.Map("rt-yandex-map", {
                        // Координаты центра карты.
                        // Порядок по умолчанию: «широта, долгота».
                        // Чтобы не определять координаты центра карты вручную,
                        // воспользуйтесь инструментом Определение координат.
                        center: [55.76, 37.64],
                        // Уровень масштабирования. Допустимые значения:
                        // от 0 (весь мир) до 19.
                        zoom: 7,
                        controls: ['zoomControl'],
                    });

                    updateYandexMap();
                }
            }
        } else {
            $('.js-rt-show-all-dealers').hide();
        }
        console.log(window.location.hash)

    });
    console.log(window.location.hash)
    if(window.location.hash === '#tb-m-2') {
        $('.js-rt-show-all-dealers').show();
        if ($('#rt-yandex-map').length) {
            console.log('test yandex map');
            function initYandexMap () {
                if (window.yandexMapDidInit) {
                    return false;
                }
                window.yandexMapDidInit = true;

                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.async = true;

                script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';

                $('body')[0].appendChild(script);
            }

            initYandexMap();
            setTimeout(() => {
                ymaps.ready(init);
                $(this).addClass('is-active');

            }, 1600);



            function init() {
                console.log('Init map')
                // Создание карты.
                myMap = new ymaps.Map("rt-yandex-map", {
                    // Координаты центра карты.
                    // Порядок по умолчанию: «широта, долгота».
                    // Чтобы не определять координаты центра карты вручную,
                    // воспользуйтесь инструментом Определение координат.
                    center: [55.76, 37.64],
                    // Уровень масштабирования. Допустимые значения:
                    // от 0 (весь мир) до 19.
                    zoom: 7,
                    controls: ['zoomControl'],
                });

                updateYandexMap();
            }
        }
    } else {
        $('.js-rt-show-all-dealers').hide();
        // Fragment doesn't exist
    }
});
