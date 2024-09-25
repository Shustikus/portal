window.addEventListener('DOMContentLoaded', () => {
    jsFilterCase.init();
});

var jsFilterCase = {
    'init': function () {

        $("#form-media-filter").submit(function (event) {
            event.preventDefault();
        });

        //Пагинация по дефолту
        window.casePagen = 1;


        //Применить фильтр
        $('#form-media-filter .select').on('change', function (el) {
            var $el = this;
            jsFilterCase.delay(function () {
                jsFilterCase.filterApply(false, $el);
            }, 1000);
        });



        //Скрываем кнопку Сборсить фильтр
        var formData = JSON.stringify($('#form-media-filter').serializeArray());
        console.log(formData);
        if (formData == '[{"name":"IBLOCK_SECTION_ID","value":""}]') {
            $("#data-form-clear").hide();
        }

        if (model_filter_global) {
            $html = '';
            window.leftBlock = !window.leftBlock;
            //$("#PROPERTY_MODELS").val(null).trigger('change');
            for (var i = 0; i < model_filter_global.length; i++) {
                var item = model_filter_global[i];
                $html += '<option value="'
                    + item['value'] +
                    '"';
                if(item['selected']) {
                    $html += ' selected ';
                }
                $html += '>' + item['text'] + '</option>'
            }
            $('select#PROPERTY_MODELS').html($html);
        }

        // устанавливаем обработчики для элемента
        jsFilterCase.onVisibleSpaceListener("lazyload_check",
            el => {
                // функция вызываемая при попадании элемента в зону видимости
                jsFilterCase.loadElemenl(++window.casePagen);
            },
            el => {
                // функция вызываемая при выпадении элемента из зоны видимости
            }
        );

        // устанавливаем обработчики для поисковой строки
        // запуск поиска с задержкой при вводе
        $('input[name ="SEARCH"]').on('keyup', function (e) {

            if (e.which === 13) {
                e.preventDefault();
                if ($(this).val() !== '') {
                    jsFilterCase.filterApply();
                }
            } else {
                jsFilterCase.delay(function () {
                    jsFilterCase.filterApply();
                }, 1000);
            }

        });

        /*
        * обработчик события прокрутки экрана. Проверяет все элементы добавленные в listenedElements
        * на предмет попадания(выпадения) в зону видимости
        * */
        window.onscroll = function () {
            jsFilterCase.listenedElements.forEach(item => {
                // проверяем находится ли элемент в зоне видимости
                var result = jsFilterCase.isOnVisibleSpace(item.el);

                // если элемент находился в зоне видимости и вышел из нее
                // вызываем обработчик выпадения из зоны видимости
                if (item.el.isOnVisibleSpace && !result) {
                    item.el.isOnVisibleSpace = false;
                    item.outVisibleSpace(item.el);
                    return;
                }
                // если элемент находился вне зоны видимости и вошел в нее
                // вызываем обработчик попадания в зону видимости
                if (!item.el.isOnVisibleSpace && result) {
                    item.el.isOnVisibleSpace = true;
                    item.inVisibleSpace(item.el);

                }
            });
        };

        //jsFilterCase.filterApply();
    },

    /* глобальный объект с элементами, для которых отслеживаем их положение в зоне видимости */
    'listenedElements': [],

    /*
    * Нажали на удаление тэга фильтра
    */
    'removeTag': function (elm) {

        if ($(elm).data('prop') === 'IBLOCK_SECTION_ID') {
            //Снимаем выбранное значение у select
            $("#IBLOCK_SECTION_ID").empty().trigger('change');
        } else {
            //Снимаем выбранное значение у select
            $("#" + $(elm).data('prop') + " option[value='" + $(elm).data('id') + "']").prop("selected", false).trigger('change');
        }

        //Удаляем тег
        $(elm).closest(".filter-tag-list__item").remove();
        jsFilterCase.filterApply();
    },

    /*
    * Нажали на сброс
    */
    'clearFilter': function () {
        $("#SEARCH").val(null).trigger('input');
        $("#IBLOCK_SECTION_ID").prop('selectedIndex', 0).trigger('change');
        $("#PROPERTY_MODELS").val(null).trigger('change');
        $("#SORT").val('').trigger('change');
        $("#PROPERTY_TYPE_TECHNIC").val(null).trigger('change');
    },

    /*
    * Собрать данные с формы фильтра и применить его
    */
    'filterApply': function (clearAll = false, $el) {

        window.casePagen = 1;

        var $typeSelect = ($($el).attr('name') == 'PROPERTY_TYPE_TECHNIC') || ($($el).attr('name') == 'IBLOCK_SECTION_ID');
        var formData = JSON.stringify($('#form-media-filter').serializeArray());

        $('#lazyload_case').show();

        //Отправляем данные в компонент для формирования массива фильтра
        BX.ajax.runComponentAction('uplab.production:filter.media',
            'sendForm', {
                mode: 'class',
                data: {
                    post: {
                        field: formData,
                    },
                    typeSelect: {
                        selected: $typeSelect
                    }
                },
            })
            .then(function (response) {

                    if (
                        Object.keys(response.data.filter).length > 0 ||
                        Object.keys(response.data.sort).length > 0 ||
                        response.data.search !== ''
                    ) {
                        $("#data-form-clear").show();
                    } else {
                        $("#data-form-clear").hide();
                    }

                    jsFilterCase.renderTags(response.data.tags);

                    window.casefilter = response.data.filter;
                    window.casesort = response.data.sort;
                    window.casesearch = response.data.search;

                    window.leftBlock = true;

                    if ($typeSelect && (response.data.filter.model_filter !== undefined)) {
                        $html = '';
                        window.leftBlock = !window.leftBlock;
                        $("#PROPERTY_MODELS").val(null).trigger('change');
                        for (var i = 0; i < response.data.filter.model_filter.length; i++) {
                            var item = response.data.filter.model_filter[i];
                            $html += '<option value="' + item['value'] + '">' + item['text'] + '</option>'
                        }
                        $('select#PROPERTY_MODELS').html($html);
                    }

                    if (window.leftBlock) {
                        BX.showWait();
                    }

                    //Обновляем список элементов с учетом фильтра
                    BX.ajax.post(//Выполняем POST запрос
                        '?PAGEN_1=' + window.casePagen,
                        {
                            filter: response.data.filter,
                            sort: response.data.sort,
                            search: response.data.search,
                        },
                        function (data) {
                            if (window.leftBlock) {
                                $('.case_reload_area').html(data);
                                BX.closeWait();
                            }
                            $('#lazyload_case').hide();
                            window.dispatchEvent(new CustomEvent('init.lazyload'));
                            window.dispatchEvent(new CustomEvent('init.modals'));
                            window.dispatchEvent(new CustomEvent('init.scrollAnimationAjax'));
                            window.UPB.scroll_animation.enable();

                            if (Object.keys(response.data.filter).length === 2) {
                                if (Object.keys(response.data.filter)[0] === 'IBLOCK_SECTION_ID') {
                                    if (response.data.filter.IBLOCK_SECTION_ID.length === 1) {
                                        if (window.location.pathname != '/media/mediabank/type-' + mediabank_paths.SECTS[response.data.filter.IBLOCK_SECTION_ID[0]] + '/') {
                                            window.history.replaceState(null, document.title, '/media/mediabank/type-' + mediabank_paths.SECTS[response.data.filter.IBLOCK_SECTION_ID[0]] + '/')
                                            //window.location = '/media/mediabank/type-' + mediabank_paths.SECTS[response.data.filter.IBLOCK_SECTION_ID[0]] + '/';
                                        }
                                    } else if (window.location.pathname != '/media/mediabank/') {
                                        window.history.replaceState(null, document.title, '/media/mediabank/')
                                        //window.location = '/media/mediabank/';
                                    }
                                }
                                if (Object.keys(response.data.filter)[0] === 'PROPERTY_TYPE_TECHNIC') {
                                    if (response.data.filter.PROPERTY_TYPE_TECHNIC.length === 1) {
                                        if (window.location.pathname != '/media/mediabank/technic-' + mediabank_paths.TECH[response.data.filter.PROPERTY_TYPE_TECHNIC[0]] + '/') {
                                            window.history.replaceState(null, document.title, '/media/mediabank/technic-' + mediabank_paths.TECH[response.data.filter.PROPERTY_TYPE_TECHNIC[0]] + '/')
                                            //window.location = '/media/mediabank/technic-' + mediabank_paths.TECH[response.data.filter.PROPERTY_TYPE_TECHNIC[0]] + '/';
                                        }
                                    } else if (window.location.pathname != '/media/mediabank/') {
                                        window.history.replaceState(null, document.title, '/media/mediabank/')
                                        //window.location = '/media/mediabank/';
                                    }
                                }
                                if (Object.keys(response.data.filter)[0] === 'PROPERTY_MODELS') {
                                    if (response.data.filter.PROPERTY_MODELS.length === 1) {
                                        if (window.location.pathname != '/media/mediabank/model-' + mediabank_paths.MODELS[response.data.filter.PROPERTY_MODELS[0]] + '/') {
                                            window.history.replaceState(null, document.title, '/media/mediabank/model-' + mediabank_paths.MODELS[response.data.filter.PROPERTY_MODELS[0]] + '/')
                                            //window.location = '/media/mediabank/model-' + mediabank_paths.MODELS[response.data.filter.PROPERTY_MODELS[0]] + '/';
                                        }
                                    } else if (window.location.pathname != '/media/mediabank/') {
                                        window.history.replaceState(null, document.title, '/media/mediabank/')
                                        //window.location = '/media/mediabank/';
                                    }
                                }

                            } else if (window.location.pathname != '/media/mediabank/') {
                                window.history.replaceState(null, document.title, '/media/mediabank/')
                                //window.location = '/media/mediabank/';
                            }
                        });
                }
            );
    },

    /*
    * Нажали на кнопку применить
    */
    'closeModal': function () {
        $(".mfp-close").trigger('click');
    },

    /*
    * Отрисовываем тэги указанные в фильтре
    * */
    'renderTags': function (tags) {
        var tagsStr = '';
        for (var key in tags) {

            var buttonDelete = 'onclick="jsFilterCase.removeTag(this);return false;"';
            tagsStr += `
                        <div class="filter-tag-list__item">
                            <div class="filter-tag">
                                <div class="filter-tag__inner">
                                    <div class="filter-tag__text">` + tags[key].text + `</div>
                                    <div class="filter-tag__close">
                                        <button type="button" class="link-action"  data-id="` + tags[key].value + `" data-prop="` + tags[key].prop + `" ` + buttonDelete + `>
                                            <i class="icon is-small link-action__icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 18L18.7279 5.27211" stroke-width="2"></path>
                                            <path d="M6 5L18.7279 17.7279" stroke-width="2"></path>
                                            </svg>
                                            </i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
        }
        $(".filter-tag-list").html(tagsStr);
    },
    /*
    * Функция задержки перед выполнением
    */
    'delay': (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })(),
    /*
    * Подгрузка новых элементов при скролинге
    */
    'loadElemenl': function (pagen) {
        //Остановить подгрузку еслиэто последняя страница
        if (window.pagenav.nEndPage < pagen) {
            return;
        }

        $('#lazyload_case').show();
        //Подгружаем элементы с учетом пагинации
        BX.ajax.post(
            '?PAGEN_1=' + pagen,
            {
                filter: window.casefilter,
                sort: window.casesort,
                search: window.casesearch,
            },
            function (data) {
                $('.case_reload_area').append(data);
                $('#lazyload_case').hide();
                window.dispatchEvent(new CustomEvent('init.lazyload'));
                window.dispatchEvent(new CustomEvent('init.modals'));
                window.dispatchEvent(new CustomEvent('init.scrollAnimationAjax'));
                window.UPB.scroll_animation.enable();
            });
    },
    /*
    * функция устанавливает обработчики событий появления элемента в зоне видимости и выхода из нее
    */
    'onVisibleSpaceListener': function (elementId, cbIn, cbOut) {
        // получаем ссылку на объект элемента
        var el = document.getElementById(elementId);
        // добавляем элемент и обработчики событий
        // в массив отслеживаемых элементов
        jsFilterCase.listenedElements.push({
            el: el,
            inVisibleSpace: cbIn,
            outVisibleSpace: cbOut
        });
    },
    /*
    * функция определяет нахождение элемента в области видимости если элемент видно - возвращает true
    * если элемент невидно - возвращает false
    * */
    'isOnVisibleSpace': function (element) {
        var bodyHeight = window.innerHeight;
        var elemRect = element.getBoundingClientRect();
        var offset = elemRect.top;// - bodyRect.top;
        if (offset < 0) return false;
        if (offset > bodyHeight) return false;
        return true;
    }
};










