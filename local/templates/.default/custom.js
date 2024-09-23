function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}

$(window).load(function () {
    $('.video-custom-block-js .video-block-list__el.js-pagination-item').click(function (e) {
        e.preventDefault();
        $('.plyr__control,.plyr__poster').hide();
        $('.js-pagination-item').removeClass('active');
        $(this).addClass('active');
        var video_id = $(this).data('id');
        video_id = video_id.replace('https://youtu.be/', '');

        var $markup = 'https://www.youtube.com/embed/' + video_id + '?autoplay=1&amp;controls=1&amp;disablekb=0'
        $('.plyr__video-embed iframe').attr('src', $markup);


    })
})
var isStarted = false;
$(document).on('click',
    '.video-custom-block-js .video-block-video__player .plyr__control, .video-custom-block-js .video-block-video__player .plyr__poster',
    function (e) {
        //alert('start');
        if (isStarted === false) {
            e.preventDefault();

            $('.plyr__control,.plyr__poster,.plyr__controls').hide();
            var video_id = '';
            if ($('.js-pagination-item.active').length) {
                video_id = $('.js-pagination-item.active').data('id');
            } else {
                video_id = $('.video-block-video__player').data('id');
            }
            video_id = video_id.replace('https://youtu.be/', '');


            var $markup = 'https://www.youtube.com/embed/' + video_id + '?autoplay=1&amp;controls=1&amp;disablekb=0'
            $('.plyr__video-embed iframe').attr('src', $markup);

            isStarted = true;


            //alert('TEST');
        }
    });

var myMap;
var myMapAbout;
var myMapAboutCountries;
var myMapContacts;

jQuery(document).ready(function () {
    jQuery('.tech-list__side').stick_in_parent(
        {
            offset_top: 100
        }).on("sticky_kit:bottom", function (e) {
        jQuery('.tech-list__side').addClass('s-bottom');
    }).on("sticky_kit:unbottom", function (e) {
        jQuery('.tech-list__side').removeClass('s-bottom');
    });


    if ($('#rt-yandex-map:not(.skip-map)').length) {
        console.log('test yandex map');
        ymaps.ready(init);

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

    if ($('#rt-yandex-map-about').length) {
        console.log('test yandex map about');
        ymaps.ready(init);

        function init() {
            console.log('Init map')
            // Создание карты.
            myMapAbout = new ymaps.Map("rt-yandex-map-about", {
                // Координаты центра карты.
                // Порядок по умолчанию: «широта, долгота».
                // Чтобы не определять координаты центра карты вручную,
                // воспользуйтесь инструментом Определение координат.
                center: [55.76, 37.64],
                // Уровень масштабирования. Допустимые значения:
                // от 0 (весь мир) до 19.
                zoom: 5,
                controls: ['zoomControl'],
            });

            updateYandexMapAbout();
        }
    }

    if ($('#rt-yandex-map-contacts').length) {
        console.log('test yandex map contacts');
        ymaps.ready(init);

        function init() {
            console.log('Init map')
            // Создание карты.
            myMapContacts = new ymaps.Map("rt-yandex-map-contacts", {
                // Координаты центра карты.
                // Порядок по умолчанию: «широта, долгота».
                // Чтобы не определять координаты центра карты вручную,
                // воспользуйтесь инструментом Определение координат.
                center: [55.76, 37.64],
                // Уровень масштабирования. Допустимые значения:
                // от 0 (весь мир) до 19.
                zoom: 14,
                controls: ['zoomControl'],
            });

            updateYandexMapContacts();
        }
    }

    if ($('#rt-yandex-map-about-countries').length) {
        console.log('test yandex map about countries');
        ymaps.ready(init);

        function init() {
            console.log('Init map')
            // Создание карты.
            myMapAboutCountries = new ymaps.Map("rt-yandex-map-about-countries", {
                // Координаты центра карты.
                // Порядок по умолчанию: «широта, долгота».
                // Чтобы не определять координаты центра карты вручную,
                // воспользуйтесь инструментом Определение координат.
                center: [55.76, 37.64],
                // Уровень масштабирования. Допустимые значения:
                // от 0 (весь мир) до 19.
                zoom: 5,
                controls: ['zoomControl'],
            });

            updateYandexMapAboutCountries();
        }
    }
})

function updateYandexMapAboutCountries() {
    $.getJSON('/local/templates/.default/components/bitrix/news.list/map-countries-box/countriesMapData.json', {}, function (data) {

        myMapAboutCountries.geoObjects.removeAll();

        let index = 0;
        for (let i in data.data) {
            index++;
            let item = data.data[i];
            console.log(item);
            let myGeoObject = new ymaps.Placemark([item.coords[0], item.coords[1]], {
                //iconContent: '<div style="color: white; padding: 11px 2px; width: 30px; text-align: center">'+index+'</div>',
                balloonContentHeader: item.label,
                //balloonContentBody: address,
            }, {
                iconLayout: 'default#imageWithContent',
                iconImageHref: item.exist ? '/dist/img/dot-marker-red.svg' : '/dist/img/dot-marker.svg',
                iconImageSize: [8, 8],
                iconImageOffset: [-4, -4],
                rawIdItem: item.id,
            });

            myMapAboutCountries.geoObjects.add(myGeoObject);
        }
    })
}

function updateYandexMapAbout() {
    $.getJSON('/local/templates/.default/components/bitrix/news.list/map-countries-box/networkMapData.json', {}, function (data) {

        myMapAbout.geoObjects.removeAll();

        let index = 0;
        for (let i in data.data) {
            index++;
            let item = data.data[i];

            let myGeoObject = new ymaps.Placemark([item.coords[0], item.coords[1]], {
                iconContent: '<div style="color: white; padding: 11px 2px; width: 30px; text-align: center">' + index + '</div>',
                balloonContentHeader: item.label,
                //balloonContentBody: address,
            }, {
                iconLayout: 'default#imageWithContent',
                iconImageHref: '/dist/img/marker.svg',
                iconImageSize: [30, 42],
                iconImageOffset: [-3, -42],
                rawIdItem: item.id,
            });

            myGeoObject.events
                .add('mouseenter', function (e) {
                    // Ссылку на объект, вызвавший событие,
                    // можно получить из поля 'target'.
                    e.get('target').options.set('iconImageHref', '/dist/img/marker-active.svg');
                })
                .add('mouseleave', function (e) {
                    let rawIdItem = e.get('target').options.get('rawIdItem');

                    if ($('#' + rawIdItem).hasClass('active')) {
                        e.get('target').options.set('iconImageHref', '/dist/img/marker-active.svg');
                    } else {
                        e.get('target').options.set('iconImageHref', '/dist/img/marker.svg');
                    }
                })
                .add('click', function (e) {

                    clearAboutMapMarksIcon();
                });

            myMapAbout.geoObjects.add(myGeoObject);
        }

        if (index) {
            /*myMapAbout.setBounds(myMapAbout.geoObjects.getBounds()); //Установить границы карты по объектам
            let zoom = myMapAbout.getZoom() - 1;
            if(zoom > 12) zoom = 12;
            myMapAbout.setZoom(zoom); //Чуть-чуть уменьшить зум для красоты*/
        }
    })
}

function updateYandexMapContacts() {
    $.getJSON('/local/templates/.default/components/bitrix/news.list/map-box-contacts/contactsMapData_' + siteId + '.json', {}, function (data) {

        // console.log('/local/templates/.default/components/bitrix/news.list/map-box-contacts/contactsMapData_' + siteId + '.json')
        // console.log(siteId)
        myMapContacts.geoObjects.removeAll();

        let index = 0;
        for (let i in data.data) {
            index++;
            let item = data.data[i];



            let myGeoObject = new ymaps.Placemark([item.coords[0], item.coords[1]], {
                iconContent: '<div style="color: white; padding: 11px 2px; width: 30px; text-align: center">' + index + '</div>',
                balloonContentHeader: item.name,
                balloonContentBody: item.address,
            }, {
                iconLayout: 'default#imageWithContent',
                iconImageHref: '/dist/img/marker.svg',
                iconImageSize: [30, 42],
                iconImageOffset: [-3, -42],
                rawIdItem: item.id,
            });

            myGeoObject.events
                .add('mouseenter', function (e) {
                    // Ссылку на объект, вызвавший событие,
                    // можно получить из поля 'target'.
                    e.get('target').options.set('iconImageHref', '/dist/img/marker-active.svg');
                })
                .add('mouseleave', function (e) {
                    let rawIdItem = e.get('target').options.get('rawIdItem');

                    if ($('#' + rawIdItem).hasClass('active')) {
                        e.get('target').options.set('iconImageHref', '/dist/img/marker-active.svg');
                    } else {
                        e.get('target').options.set('iconImageHref', '/dist/img/marker.svg');
                    }
                })
                .add('click', function (e) {

                    clearContactsMapMarksIcon();
                });

            myMapContacts.geoObjects.add(myGeoObject);
        }

        if (index) {
            myMapContacts.setBounds(myMapContacts.geoObjects.getBounds()); //Установить границы карты по объектам
            let zoom = myMapContacts.getZoom() - 1;
            if (zoom > 7) zoom = 14;
            if (zoom < 6) zoom = 6;
            myMapContacts.setZoom(zoom); //Чуть-чуть уменьшить зум для красоты*/
        }
    })
}

function updateYandexMap() {

    myMap.geoObjects.removeAll();
    let index = 0;

    $('.dealer_item_yandex_js').each(function (i, item) {
        index++;
        let lat = $(item).attr('data-lat');
        let lng = $(item).attr('data-lng');
        let title = $(item).attr('data-title');
        let url = $(item).attr('data-url');
        let num = $(item).attr('data-num');
        let address = $(item).attr('data-address');
        let id = $(item).attr('id');
        let isHeadOffice = $(item).attr('data-is-main');
        let iconPath = $(item).attr('data-map-icon');
        let iconPathRaw = $(item).attr('data-map-icon');

        if (url) {
            title = '<a href="' + url + '">' + title + '</a>';
        }

        let sizes = [30, 30];
        if(!iconPath) {
            iconPath = isHeadOffice == '1'
                ? '/dist/img/marker-active.svg'
                : '/dist/img/marker-gray.svg';
            sizes = [30, 42];
        } else {
            num = '';
        }

        console.log(iconPath)
        if(iconPath == '/dist/img/map-icon/001.svg') {
            sizes = [76, 43];
        }
        if(iconPath == '/dist/img/map-icon/002.svg') {
            sizes = [54, 30];
        }

        let myGeoObject = new ymaps.Placemark([lat, lng], {
            iconContent: '<div style="color: white; padding: 11px">' + num + '</div>',
            //balloonContentHeader: title,
            //balloonContentBody: address,
        }, {
            iconLayout: 'default#imageWithContent',
            iconImageHref: iconPath,
            iconImageSize: sizes,
            iconImageOffset: [-3, -42],
            rawIdItem: id,
            isHeadOffice: isHeadOffice,
            iconPathRaw: iconPathRaw,
            zIndex: isHeadOffice == '1' ? 100 : 10,
            zIndexActive: isHeadOffice == '1' ? 10000 : 1000,
            zIndexDrag: isHeadOffice == '1' ? 10000 : 1000,
            zIndexHover: isHeadOffice == '1' ? 10000 : 1000,
            interactiveZIndex: true,
        });

        myGeoObject.events
            .add('mouseenter', function (e) {
                // Ссылку на объект, вызвавший событие,
                // можно получить из поля 'target'.
                //e.get('target').options.set('iconImageHref', '/dist/img/marker-active.svg');
            })
            .add('mouseleave', function (e) {
                let rawIdItem = e.get('target').options.get('rawIdItem');
                let isHeadOffice = e.get('target').options.get('isHeadOffice');

                if ($('#' + rawIdItem).hasClass('active') || isHeadOffice == '1') {
                    //e.get('target').options.set('iconImageHref', '/dist/img/marker-active.svg');
                } else {
                    //e.get('target').options.set('iconImageHref', '/dist/img/marker-gray.svg');
                }
            })
            .add('click', function (e) {
                clearMapMarksIcon();
                let rawIdItem = e.get('target').options.get('rawIdItem');
                $('.dealer_item_yandex_js').removeClass('active').hide();
                $('.map-dealers-list-back-btn').show();
                $('#' + rawIdItem).addClass('active').show();
                //e.get('target').options.set('iconImageHref', '/dist/img/marker-active.svg');
            });

        myMap.geoObjects.add(myGeoObject);
    });

    if (index) {
        myMap.setBounds(myMap.geoObjects.getBounds()); //Установить границы карты по объектам
        let zoom = myMap.getZoom() - 1;
        if (zoom > 14) zoom = 14;
        myMap.setZoom(zoom); //Чуть-чуть уменьшить зум для красоты
    }
}

$(document).on('click', '.map-dealers-list-back-btn', function (e) {
    e.preventDefault();

    $('.dealer_item_yandex_js').removeClass('active').show();
    $('.map-dealers-list-back-btn').hide();
    clearMapMarksIcon();
})
$(document).on('click', '.map-dealers-list-item-title', function (e) {
    e.preventDefault();

    let $this = $(this);
    let $parent = $this.parents('.dealer_item_yandex_js');

    if ($parent.hasClass('active')) {
        $('.dealer_item_yandex_js').removeClass('active').show();
        $('.map-dealers-list-back-btn').hide();
        clearMapMarksIcon();
    } else {
        $('.dealer_item_yandex_js').removeClass('active').hide();
        $('.map-dealers-list-back-btn').show();
        $parent.addClass('active').show();

        myMap.geoObjects.each(function (geoObject) {
            let isHeadOffice = geoObject.options.get('isHeadOffice');
            let iconPath = geoObject.options.get('iconPathRaw');
            if(iconPath) {
                geoObject.options.set('iconImageHref', iconPath);
            } else if (/*geoObject.options.get('rawIdItem') === $parent.attr('id') || */isHeadOffice == '1') {
                geoObject.options.set('iconImageHref', '/dist/img/marker-active.svg');
            } else {
                geoObject.options.set('iconImageHref', '/dist/img/marker-gray.svg');
            }
        });
    }
})

function clearMapMarksIcon() {
    myMap.geoObjects.each(function (geoObject) {
        let isHeadOffice = geoObject.options.get('isHeadOffice');
        let iconPath = geoObject.options.get('iconPathRaw');
        if(iconPath) {
            geoObject.options.set('iconImageHref', iconPath);
        } else if(isHeadOffice != '1') {
            geoObject.options.set('iconImageHref', '/dist/img/marker-gray.svg');
        }
    });
}

function clearAboutMapMarksIcon() {

    myMapAbout.geoObjects.each(function (geoObject) {
        let isHeadOffice = geoObject.options.get('isHeadOffice');
        if(isHeadOffice != '1') {
            geoObject.options.set('iconImageHref', '/dist/img/marker-gray.svg');
        }
    });
}

function clearContactsMapMarksIcon() {

    myMapContacts.geoObjects.each(function (geoObject) {
        let isHeadOffice = geoObject.options.get('isHeadOffice');
        if(isHeadOffice != '1') {
            geoObject.options.set('iconImageHref', '/dist/img/marker.svg');
        }
    });
}

if ($(window).width() < 990) {
    $('.modal-card').removeClass('js-perfect-scrollbar');
    $('.modal-card').removeClass('ps');
    $('.modal__scroll-wrapper').removeClass('js-perfect-scrollbar');
    $('.modal__scroll-wrapper').removeClass('ps');
}
var multiRoute;
$(document).on('click', '.js-detail-route-btn', function (e) {
    console.log('Route start');
    e.preventDefault();

    multiRoute = new ymaps.multiRouter.MultiRoute({
        // Описание опорных точек мультимаршрута.
        referencePoints: [
            "Москва, ул. Мясницкая",
            [55.734876, 37.59308]
        ],
        // Параметры маршрутизации.
        params: {
            // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
            results: 1
        }
    }, {
        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
        boundsAutoApply: true
    });

    myMap.geoObjects.add(multiRoute);
})


/** FORMS */
function getFormData($form) {
    let data = {};
    let name = '';
    let dataArray = $form.serializeArray();
    for (var i = 0; i < dataArray.length; i++) {
        if(dataArray[i].name.indexOf('[]') !== -1) {
            name = dataArray[i].name.substr(0, dataArray[i].name.indexOf('[]'));
            if( ! (name in data) ) {
                data[name] = [];
            }
            data[name].push(dataArray[i].value);
        } else {
            data[dataArray[i].name] = dataArray[i].value;
        }
    }
    return data;
}

function bindFormHandler(formClass) {
    let $form = $(formClass);
    let method = $form.attr('method');
    let url = $form.attr('action');

    $form.on('submit', function (e) {
        e.preventDefault();

        let formData = getFormData($form);
        console.log(formData);

        if (method === 'post') {
            $.post(url, formData, function (data) {
                handleFormResponse(data, $form);
            })
        } else {
            $.get(url, formData, function (data) {
                handleFormResponse(data, $form);
            })
        }

    })
}

function handleFormResponse(data, $form) {
    let formSuccessShowMessage = $form.hasClass('js-form-success-show-message-js');
    let formSuccessAutoPageRefresh = $form.hasClass('js-form-success-auto-page-refresh-js');
    let formSuccessClearForm = $form.hasClass('js-form-success-clear-form-js');
    let formSuccessAutoClose = $form.hasClass('js-form-success-auto-close-js');
    let formSuccessShowStatusTitle = $form.hasClass('js-form-success-show-status-title-js');
    let formSuccessShowStatusCustomTitle = $form.hasClass('js-form-success-show-status-custom-title-js');

    console.log(data);
    if (data.status === 'success') {
        if (formSuccessShowMessage) {
            showDefaultPopupMessage(data.payload.title, data.payload.text, data.payload.btn)
        }

        if (formSuccessAutoPageRefresh) {
            window.location.reload();
        }

        if (formSuccessClearForm) {
            $form.trigger('reset');
        }

        if(formSuccessShowStatusTitle) {
            $form.parent().parent().parent().find('h3').text(data.payload.title);
            $form.parent().parent().parent().find('.modal__body').html('');
        }

        if(formSuccessShowStatusCustomTitle) {
            $form.find('.js-form-title-js').text(data.payload.title);
            $form.find('.js-form-title-js').parent().css({'margin-bottom': '0'});
            $form.find('.js-form-body-js').html('');
        }

        if(formSuccessAutoClose) {
            $.magnificPopup.close();
        }
    }

    let formErrorShowMessage = $form.hasClass('js-form-error-show-message-js');
    let formErrorAutoPageRefresh = $form.hasClass('js-form-error-auto-page-refresh-js');
    let formErrorClearForm = $form.hasClass('js-form-error-clear-form-js');
    let formErrorAutoClose = $form.hasClass('js-form-error-auto-close-js');

    if (data.status === 'error') {
        if (formErrorShowMessage) {
            showDefaultPopupMessage(data.payload.title, data.payload.text, data.payload.btn)
        }

        if (formErrorAutoPageRefresh) {
            window.location.reload();
        }

        if (formErrorClearForm) {
            $form.trigger('reset');
        }

        if(formErrorAutoClose) {
            $.magnificPopup.close();
        }
    }
}

function showDefaultPopupMessage(title, text, closeBtn) {
    $.magnificPopup.open({
        items: {
            src: '#modal-form-succes',
            type: 'inline'
        }
    });
}


$(document).on("change", '.search-form__form input[name="radio-search"]', function(){
    BX.showWait();
    $('.search-form__form').trigger("submit");
})

BX.showWait = function () {
    var loader = '<div class="bx-loader"><div class="cssload-clock"></div></div>';
    $('body').append(loader);
};

BX.closeWait = function () {
    $('body').find('.bx-loader').remove();
};


$(document).ready(function(){
    $(document).on("change", ".tabs-list .js-select2", function(){
        let link = $(this).val();
        window.location =link;
    })
})