window.addEventListener('DOMContentLoaded', () => {
    jsFilterCase.init();
});

var jsFilterCase = {
    'init': function () {

        //Пагинация по дефолту
        window.casePagen = 1;

        //Переключение табов Кейсы и Отзывы
        $(".tabs-list__wrap .tabs-list__el").on('click', function () {
            $(".tabs-list__wrap .tabs-list__el").removeClass('active');
            $(this).addClass('active');
            jsFilterCase.filterApply();
        });

        //Применить фильтр
        $('#form-case-filter .select').on('change', function () {
            jsFilterCase.filterApply();
        });

        //Скрываем кнопку Сборсить фильтр
        $("#data-form-clear").hide();

        // устанавливаем обработчики для элемента
        jsFilterCase.onVisibleSpaceListener("lazyload_check",
            el=>{
                // функция вызываемая при попадании элемента в зону видимости
                jsFilterCase.loadElemenl(++window.casePagen);
            },
            el=>{
                // функция вызываемая при выпадении элемента из зоны видимости
            }
        );

        /*
        * обработчик события прокрутки экрана. Проверяет все элементы добавленные в listenedElements
        * на предмет попадания(выпадения) в зону видимости
        * */
        window.onscroll = function() {
            jsFilterCase.listenedElements.forEach(item=>{
                // проверяем находится ли элемент в зоне видимости
                var result = jsFilterCase.isOnVisibleSpace(item.el);

                // если элемент находился в зоне видимости и вышел из нее
                // вызываем обработчик выпадения из зоны видимости
                if(item.el.isOnVisibleSpace && !result){
                    item.el.isOnVisibleSpace = false;
                    item.outVisibleSpace(item.el);
                    return;
                }
                // если элемент находился вне зоны видимости и вошел в нее
                // вызываем обработчик попадания в зону видимости
                if(!item.el.isOnVisibleSpace && result){
                    item.el.isOnVisibleSpace = true;
                    item.inVisibleSpace(item.el);
                    return;
                }
            });
        };
    },

    /* глобальный объект с элементами, для которых отслеживаем их положение в зоне видимости */
    'listenedElements': [],

    /*
    * Нажали на кнопку применить
    */
    'closeModal' : function () {
        $(".mfp-close").trigger('click');
    },


    /*
    * Нажали на удаление тэга фильтра
    */
    'removeTag' : function (elm) {
        //Снимаем выбранное значение у select
        $("#"+$(elm).data('prop') + " option[value='"+$(elm).data('id')+"']").prop("selected", false).trigger('change');
        //Удаляем тег
        $(elm).closest(".filter-tag-list__item").remove();
        jsFilterCase.filterApply(false);
    },

    /*
    * Нажали на сброс фильтра
    */
    'clearFilter' : function () {
        $("#SECTION_ID").val(null).trigger('change');
    },

    /*
    * Собрать данные с формы фильтра и применить его
    */
    'filterApply': function (clearAll = false) {
        window.casePagen = 1;

        //Если нужно сбросить фильтр
        var formData = JSON.stringify($('#form-case-filter').serializeArray());

        $('#lazyload_case').show();
        //Отправляем данные в компонент для формирования массива фильтра
        BX.ajax.runComponentAction('uplab.production:filter.news',
            'sendForm', {
                mode: 'class',
                data: {
                    post: {
                        field: formData,
                    }
                },
            })
            .then(function(response) {

                jsFilterCase.renderTags(response.data.tags);
                window.casefilter = response.data.filter;

                    //Обновляем список элементов с учетом фильтра
                    BX.ajax.post (//Выполняем POST запрос
                        '?PAGEN_1='+window.casePagen,
                        {filter: response.data.filter},
                        function (data) {
                            $('.case_reload_area').html(data);
                            $('#lazyload_case').hide();
                            window.dispatchEvent(new CustomEvent('init.lazyload'));
                            window.dispatchEvent(new CustomEvent('init.modals'));
                            window.dispatchEvent(new CustomEvent('init.scrollAnimationAjax'));
                            window.UPB.scroll_animation.enable();
                        });
                }
            );
    },
    /*
    * Отрисовываем тэги указанные в фильтре
    * */
    'renderTags': function (tags) {
        var tagsStr = '';

        if(Object.keys(tags).length > 0){
            $("#data-form-clear").show();
        }else {
            $("#data-form-clear").hide();
        }

        for (var key in tags) {
            tagsStr += `
                        <div class="filter-tag-list__item">
                            <div class="filter-tag">
                                <div class="filter-tag__inner">
                                    <div class="filter-tag__text">`+tags[key].text+`</div>
                                    <div class="filter-tag__close">
                                        <button type="button" class="link-action"  data-id="`+tags[key].value+`" data-prop="`+tags[key].prop+`" onclick="jsFilterCase.removeTag(this);return false;">
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
    * Подгрузка новых элементов при скролинге
    */
    'loadElemenl': function (pagen) {
        //Остановить подгрузку еслиэто последняя страница
        if(window.pagenav.nEndPage < pagen){
            return;
        }
        $('#lazyload_case').show();
        //Подгружаем элементы с учетом пагинации
        BX.ajax.post (
            '?PAGEN_1='+pagen,
            {filter: window.casefilter},
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
        var offset   = elemRect.top;// - bodyRect.top;
        if(offset<0) return false;
        if(offset>bodyHeight) return false;
        return true;
    }
};










