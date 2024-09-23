window.addEventListener('DOMContentLoaded', () => {

    // Цели на кнопках
    if (window.location.pathname == '/financing/leasing/') {
        $("a.btn[href='#leasing']").on('click', function() {
            if (typeof yaCounter7398946 !== 'undefined') {
                yaCounter7398946.reachGoal('financing%2Bleasing%2BZayavka');
            }
        })
        $("#form_leasing").on('submit', function() {
            if (typeof yaCounter7398946 !== 'undefined') {
                yaCounter7398946.reachGoal('financing%2Bleasing%2Botpravit');
            }
        })
    }

function timedisabled(){
	$('form[action="/qr/"] button').attr("disabled",true);
}
$(document).on('click','form[action="/qr/"] button',function(){
	if($('form[action="/qr/"] input[name="SERIAL_NUM"]').val()!='' && $('form[action="/qr/"] textarea[name="DESCRIPTION"]').val()!=''  && $('form[action="/qr/"] input[name="PHONE"]').val()!=''  && $('form[action="/qr/"] input[name="EMAIL"]').val()!='' && $('form[action="/qr/"] input[name="FIO"]').val()!=''){
		setTimeout(timedisabled, 1000);
	}
});



    //Ниже перечисленны обработчики для форм компонента (form.univers)
    //по некоторым причинам все обрабтчики пришлось вынести из шаблонов сюда
    //Причина, сроки сильноподжимали, а формы отказывались рабтать с кэшем или из за ошибок в скриптах верстки
    $("form").submit(function(event) {

        /*Подтвердили форму отправки на получение презентации, шаблон (get-presentation) START*/
        if ($(this).data('presentation') === 'Y') {

            event.preventDefault();

            var arForm = $(this).serializeArray();
            var formData = JSON.stringify(arForm);

            $(this).closest(".modal__body").find('.modal__left-heading').html(BX.message("FORM_SEND_SUCCESS"));

            var productId = '';
            arForm.forEach(function(item, i, arr) {
                if (item.name === 'PROP_PRODUCT') {
                    productId = item.value;
                }
            });

            $(this).closest(".mfp-content").find(".mfp-close").trigger('click');

            //Отправляем форму в компонет где емайл будет занесен в подписки а id текущего товара добавится в cookie
            //На основе товаров установленных в куки будут скрываться кнопки получния презентаци или повторный вывод формы подписки
            //часть скрипта отвечающая завывод кнопок презентации находится в шаблоне компонента catalog/products/element.php
            //Данный функционал вынесен туда, для того, чтобы лишний раз не тягать кэш
            BX.ajax.runComponentAction('uplab.production:form.univers',
                    'subscription', {
                        mode: 'class',
                        data: {
                            post: {
                                field: formData,
                                productId: productId
                            }
                        },
                    })
                .then(function(response) {
                    $('a[data-presentid="' + productId + '"]').remove();
                    $("[data-present]").each(function(index, el) {
                        var id = $(el).attr('data-presentid');
                        $(el).attr('onclick', 'getPresentaton(' + id + ');return false;');
                        $(el).removeAttr('data-modal');
                        $(el).attr('href', '#');
                    });
                    if (productId !== '') {
                        window.location = '/local/components/uplab.production/form.univers/get-presentation.php?product_id=' + productId;
                    }

                });

        }
        /*Подтвердили форму отправки на получение презентации END*/

        /*Форма заявки на кредит, шаблон (credit-form) START*/

        if ($(this).data('modalform') === 'Y') {
            event.preventDefault();
            var formData = JSON.stringify($(this).serializeArray());

            $(this).closest('.modal--application').find('.modal__head').html(BX.message('FORM_SEND_SUCCESS'));
            $(this).closest(".modal__body").find(".modal__left").remove();
            $(this).closest(".modal__body").find(".modal__left").remove();

            BX.ajax.runComponentAction('uplab.production:form.univers',
                    'sendForm', {
                        mode: 'class',
                        data: {
                            post: {
                                field: formData,
                                url: window.location.href
                            }
                        },
                    })
                .then(function(response) {

                });
        }

        /*Форма заявки на кредит, шаблон (credit-form) START*/

    });



    /*Форма демпоказа шаблон (appointment-form) START*/

    $("#appointment-form-event").submit(function(event) {
        event.preventDefault();

        var formData = JSON.stringify($(this).serializeArray());
        // window.dispatchEvent(new CustomEvent('open:formSusses'));

        $(this).closest(".appointment-form").find(".appointment-form__title").html(BX.message('FORM_SEND_SUCCESS'));
        $(this).closest(".appointment-form__content").html('<span class="mt-16">' + BX.message('FORM_SEND_SUCCESS_MESSAGE_APPOINTMENT') + '</span>');

        BX.ajax.runComponentAction('uplab.production:form.univers',
                'sendForm', {
                    mode: 'class',
                    data: {
                        post: {
                            field: formData,
                            url: window.location.href
                        }
                    },
                })
            .then(function(response) {
                // console.log(response);
            });
    });

    $('#appointment-form-event #PROP_REGION_SELECT').on('change', function() {

        var regionName = $("#appointment-form-event #PROP_REGION_SELECT option[value='" + $(this).val() + "']").text().trim();

        $('#appointment-form-event #PROP_REGION').val(regionName);

        BX.ajax.runComponentAction('uplab.production:form.univers',
                'getData', {
                    mode: 'class',
                    data: {
                        post: {
                            reginId: $(this).val(),
                        }
                    },
                })
            .then(function(response) {
                if (Object.keys(response.data).length > 0) {
                    var updateSelect = '<option label="' + BX.message('SELECT_DEMPOKAZ') + '"></option>';
                    for (var key in response.data) {
                        updateSelect += '<option value="' + response.data[key].text + '">' + response.data[key].text + '</option>';
                    }
                    $('#appointment-form-event #PROP_DEM_POKAZ').html(updateSelect);
                } else {
                    $('#appointment-form-event #PROP_DEM_POKAZ').html('');
                }
            });

    });

    /*Форма демпоказа END*/


    /*Связаться с нами на всех страницах, шаблон (contact-us) START*/
    $("#contact-us-form").submit(function(event) {
        event.preventDefault();

        var formData = JSON.stringify($('#contact-us-form').serializeArray());
        $(this).closest('.modal--feedback').find('.modal__head').html(BX.message('FORM_SEND_SUCCESS'));
        $(this).closest(".modal__body").find(".modal__left").remove();

        BX.ajax.runComponentAction('uplab.production:form.univers',
                'sendForm', {
                    mode: 'class',
                    data: {
                        post: {
                            field: formData,
                            url: window.location.href
                        }
                    },
                })
            .then(function(response) {
                console.log(response);
            });
    });
    /*Связаться с нами на всех страницах END*/

    /*Предложение о сотрудничестве (cooperation-with-us) START*/
    $("#cooperation-with-us").submit(function(event) {
        event.preventDefault();

        var formData = JSON.stringify($('#cooperation-with-us').serializeArray());
        $(this).closest('.modal--feedback').find('.modal__head').html(BX.message('FORM_SEND_SUCCESS'));
        $(this).closest(".modal__body").find(".modal__left").remove();

        BX.ajax.runComponentAction('uplab.production:form.univers',
                'sendForm', {
                    mode: 'class',
                    data: {
                        post: {
                            field: formData,
                            url: window.location.href
                        }
                    },
                })
            .then(function(response) {
                console.log(response);
            });
    });
    /*Предложение о сотрудничестве (cooperation-with-us) END*/


    /*Связаться с нами на странице контактов, шаблон (contacts-form) START*/
    $("#contacts-form").submit(function(event) {
        event.preventDefault();

        var formData = JSON.stringify($("#contacts-form").serializeArray());

        //window.dispatchEvent(new CustomEvent('open:formSusses'));
        $(this).closest(".appointment-form").find(".appointment-form__title").html(BX.message('FORM_SEND_SUCCESS'));
        $(this).closest(".appointment-form__content").find(".appointment-form__left").remove();
        $(this).closest(".appointment-form__content").find(".appointment-form__right").remove();


        BX.ajax.runComponentAction('uplab.production:form.univers',
                'sendForm', {
                    mode: 'class',
                    data: {
                        post: {
                            field: formData,
                            url: window.location.href
                        }
                    },
                })
            .then(function(response) {
                //console.log(response);
            });
    });
    /*Связаться с нами на странице контактов END*/


    /*Фрма подписки на новости, шаблон (form-subscribe) START*/
    $("#subscribe-form").submit(function(event) {
        event.preventDefault();

        var formData = JSON.stringify($('#subscribe-form').serializeArray());

        $(this).closest('.modal--feedback').find('.modal__head').html(BX.message('FORM_SEND_SUCCESS_SUBSCRIBE'));
        $(this).closest(".modal__body").html(BX.message('FORM_SEND_SUCCESS_MESSAGE_SUBSCRIBE'));


        BX.ajax.runComponentAction('wf:form.univers',
                'subscription', {
                    mode: 'class',
                    data: {
                        post: {
                            field: formData,
                            url: window.location.href
                        }
                    },
                })
            .then(function(response) {});
    });
    /*Фрма подписки на новости END*/


    /*Форма - Остались вопросы, шаблон (has-questions) START*/
    $("#get-consult-form").submit(function(event) {
        event.preventDefault();

        var formData = JSON.stringify($('#get-consult-form').serializeArray());
        //window.dispatchEvent(new CustomEvent('open:formSusses'));
        $(this).closest(".appointment-form").find(".appointment-form__title").html(BX.message('FORM_SEND_SUCCESS'));
        $(this).closest(".appointment-form__content").find(".appointment-form__left").remove();
        $(this).closest(".appointment-form__content").find(".appointment-form__right").remove();


        BX.ajax.runComponentAction('uplab.production:form.univers',
                'sendForm', {
                    mode: 'class',
                    data: {
                        post: {
                            field: formData,
                            url: window.location.href
                        }
                    },
                })
            .then(function(response) {

            });
    });
    /*Форма - Остались вопросы END*/


    /*Форма - Заявка на ТО, шаблон (request-for-to) START*/
    $("#request-for-to").submit(function(event) {
        event.preventDefault();

        var formData = JSON.stringify($(this).serializeArray());
        // window.dispatchEvent(new CustomEvent('open:formSusses'));
        $(this).closest(".appointment-form").find(".appointment-form__title").html(BX.message('FORM_SEND_SUCCESS'));
        $(this).closest(".appointment-form__content").find(".appointment-form__left").remove();
        $(this).closest(".appointment-form__content").find(".appointment-form__right").remove();


        BX.ajax.runComponentAction('uplab.production:form.univers',
                'sendForm', {
                    mode: 'class',
                    data: {
                        post: {
                            field: formData,
                            url: window.location.href
                        }
                    },
                })
            .then(function(response) {
                //console.log(response);
            });
    });
    /*Форма - Заявка на ТО END*/


    /*Форма - Запись на экскурсию модальная, шаблон (sign-up-for-excursion) START*/
    $("#sign-up-for-excursion-modal").submit(function(event) {
        event.preventDefault();

        var formData = JSON.stringify($(this).serializeArray());

        $(this).closest('.modal--feedback').find('.modal__head').html(BX.message('FORM_SEND_SUCCESS'));
        $(this).closest(".modal__body").html(BX.message('FORM_SEND_SUCCESS_MESSAGE_EXCURSION'));

        BX.ajax.runComponentAction('uplab.production:form.univers',
                'sendForm', {
                    mode: 'class',
                    data: {
                        post: {
                            field: formData,
                            url: window.location.href
                        }
                    },
                })
            .then(function(response) {

            });
    });
    /*Форма - Запись на экскурсию модальная END*/


    /*Форма - Запись на экскурсию, шаблон (sign-up-for-excursion-form) START*/
    $("#sign-up-for-excursion-form").submit(function(event) {
        event.preventDefault();

        var formData = JSON.stringify($(this).serializeArray());
        // window.dispatchEvent(new CustomEvent('open:formSusses'));
        $(this).closest(".appointment-form").find(".appointment-form__title").html(BX.message('FORM_SEND_SUCCESS'));
        $(this).closest(".appointment-form__content").find(".appointment-form__left").remove();
        $(this).closest(".appointment-form__content").find(".appointment-form__right").remove();

        BX.ajax.runComponentAction('uplab.production:form.univers',
                'sendForm', {
                    mode: 'class',
                    data: {
                        post: {
                            field: formData,
                            url: window.location.href
                        }
                    },
                })
            .then(function(response) {
                //console.log(response);
            });
    });
    /*Форма - Запись на экскурсию END*/


    /*Форма - Заявка на технику, шаблон (technic-invite) START*/
    $("#application-form-modal").submit(function(event) {
        event.preventDefault();

        var formData = JSON.stringify($('#application-form-modal').serializeArray());

        $('#technic-invite .modal__head').html(BX.message("FORM_SEND_SUCCESS"));
        $(this).closest(".modal__body").find(".modal__left").remove();

        BX.ajax.runComponentAction('uplab.production:form.univers',
                'sendForm', {
                    mode: 'class',
                    data: {
                        post: {
                            field: formData,
                            url: window.location.href
                        }
                    },
                })
            .then(function(response) {

            });
    });
    /*Форма - Заявка на технику END*/


    /*Форма - Заявка техническую поддержку, шаблон (technical-support) START*/
    $("#technical-support-form").submit(function(event) {
        event.preventDefault();

        var formData = JSON.stringify($('#technical-support-form').serializeArray());

        $('#modal-form-1 .modal__head').html(BX.message("FORM_SEND_SUCCESS"));
        $(this).closest(".modal__body").find(".modal__left").remove();

        BX.ajax.runComponentAction('uplab.production:form.univers',
                'sendForm', {
                    mode: 'class',
                    data: {
                        post: {
                            field: formData,
                            url: window.location.href
                        }
                    },
                })
            .then(function(response) {

            });
    });


    //Установка поля региона пользователя у форм заявки на технику, точное земледелие или хочу так же
    $("#PROP_REGION_SELECT option[value='" + window.regionId + "']").prop("selected", true).trigger('change');
    $("#245782PROP_DIRECTION option[value='" + window.regionName + "']").prop("selected", true).trigger('change');
    $("#PROP_DIRECTION option[value='" + window.regionName + "']").prop("selected", true).trigger('change');

    //Установка поля региона пользователя в форме заявки на кредит, лизин, страхование.
    $("#824568PROP_REGION option[value='" + window.regionName + "']").prop("selected", true).trigger('change');
    $("#935353PROP_REGION option[value='" + window.regionName + "']").prop("selected", true).trigger('change');
    $("#722456PROP_REGION option[value='" + window.regionName + "']").prop("selected", true).trigger('change');

    /*Форма - Заявка техническую поддержку END*/






    //Управление всплывающим окном с вопросом о местоположении
    $("button.location__closer").on('click', function() {
        $('div.location').remove();
    });
    $(".location__closer button").on('click', function() {
        $('div.location').remove();
    });
    $("div.location__button").on('click', function() {
        $('div.location').remove();
    });

});


//Запусить скачивание презетации, установить куки и удалить кнопки полученых презентаций
function getPresentaton(productId) {
    BX.ajax.runComponentAction('uplab.production:form.univers',
            'presentation', {
                mode: 'class',
                data: {
                    post: {
                        productId: productId
                    }
                },
            })
        .then(function(response) {
            $('a[data-presentid="' + productId + '"]').remove();
            $("[data-present]").each(function(index, el) {
                var id = $(el).attr('data-presentid');
                $(el).attr('onclick', 'getPresentaton(' + id + ');return false;');
                $(el).removeAttr('data-modal');
                $(el).attr('href', '#');
            });
            if (productId !== '') {
                window.location = '/local/components/uplab.production/form.univers/get-presentation.php?product_id=' + productId;
            }
        });

}


//При выборе роли пользоватля перенаправим его на страницу указанную в админке (Инфоблок настроек)
function selectUserType(userType) {
    BX.ajax.runComponentAction('uplab.production:user.selector',
            'sendForm', {
                mode: 'class',
                data: {
                    post: {
                        userTypeS: userType,
                    }
                },
            })
        .then(function(response) {
            if (response.data.target === 'blank') {
                window.open(response.data.link, '_blank')
            } else {
                window.location = response.data.link;
            }
            $('.client-role__role button').trigger('click');
        });
}


/*Скрипт для управления региональностью START*/
//Нажали на копку определения местоположения при выборе региона
function getUserLocation(el) {
    navigator.geolocation.getCurrentPosition(function(position) {
        if (window.timer) {
            clearTimeout(window.timer);
        }
        var $this = $(el);
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        $this.prop('disabled', true);
        BX.ajax.get( //Выполняем POST запрос
            'https://geocode-maps.yandex.ru/1.x?geocode=' + lng + ',' + lat + '&apikey=f249074e-51a8-4a1c-94d3-a164e1005132&format=json', {},
            //'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&types=(regions)&key=AIzaSyDTh56MmB5t_mAoAwWI_uhqQI0vHo4SPKw', {},
            function(data) {
                let dataRrsult = JSON.parse(data);
                console.log(dataRrsult);

                var region = dataRrsult.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.Components;

                console.log(region);
                let title = '';
                if (region !== undefined) {
                    region.forEach(function(dataRegion, i, arr) {
                        if (dataRegion.kind !== undefined) {
                            if (dataRegion.kind === 'country') {
                                title = dataRegion.name;
                            } else if (dataRegion.kind === 'province') {
                                title = dataRegion.name;
                            }
                        }
                    });

                    if(title) {
                        window.timer = setTimeout(function () {
                            $("#region-form-1").val(title).trigger('keyup');
                        }, 300);
                    }
                }
                window.timer = setTimeout(function() {
                    $this.prop('disabled', false);
                }, 1500);

            });

    });
}


//При выборе языка, производим ajax запрос на проверку существования страницы
//Если страницы нет то переходим на главную выбранного языка
function selectLang(lang, defLang) {
    if (isThere(lang)) {
        window.location = lang;
    } else {
        window.location = defLang;
    }
}


//При выборе региона, переходим на ту языковую версию сайта, которая устаовленна у этого региона по умолчанию
//Если страницы с которой перешли на другой язык нету, то переходим на главную выбранного языка
function selectLangAndCountry(lang, country, defLang) {
    BX.ajax.runComponentAction('uplab.production:region.selector',
            'sendForm', {
                mode: 'class',
                data: {
                    post: {
                        contryId: country,
                        langId: lang,
                    }
                },
            })
        .then(function() {

            if (isThere(lang)) {
                window.location = lang;
            } else {
                window.location = defLang;
            }

        });
}


//Поверка существования страницы
function isThere(url) {
    var req = new AJAX(); // XMLHttpRequest object
    try {
        req.open("HEAD", url, false);
        req.send(null);
        return req.status == 200 ? true : false;
    } catch (er) {
        return false;
    }
}


function AJAX() {
    var obj;
    if (window.XMLHttpRequest) obj = new XMLHttpRequest();
    else if (window.ActiveXObject) {
        try {
            obj = new ActiveXObject('MSXML2.XMLHTTP.3.0');
        } catch (er) {
            try {
                obj = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (er) {
                obj = false;
            }
        }
    }
    return obj;
}

/*Скрипт для управления региональностью END*/




/*=== Костыль для мобильного таба "" на странице /products/combine ===*/
let productCatalogTabLink = $('a.tabs-list__el');
$('body').on('click', '[data-select2-id="4"]', function() {
    
  let currentListHtml = $('ul.select2-results__options').html();
  $('ul.select2-results__options').html(currentListHtml + `<li class="select2-results__option" role="option"><a href="${productCatalogTabLink.attr('href')}">${productCatalogTabLink.text()}</a></li>`);
});
/*=== конец костыля ===*/
