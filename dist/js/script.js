/*
clear - записывать информацию в конец или писать заново
*/

function search(name) {
    if (name.length > 1) {
        $.ajax({
            url: "/local/ajax/ajax_dealers.php?SEARCH=" + name,
            dataType: 'html'
        }).done(function (data) {
            var $items = $(data).find('.dealer_item_yandex_js');
            var $conteiner = $(".map-dealers-list");
            var $lost = $conteiner.find('.dealer_lost');
            //$items.toggle()
            $conteiner.find('.dealer_item_yandex_js').remove()
            if ($items.length > 0) {
                $items.each(function (i, item) {
                    $conteiner.append($(item).fadeIn(800));
                })
                $lost.fadeOut(0);
            } else {
                $lost.fadeIn(800);
            }

            let $itemsList = $(data).find('.dealer-map-list-item-js');
            let $wrapper = $("#map-cards-list-content");
            if($wrapper.length) {
                $wrapper.find('.dealer-map-list-item-js').remove();
                if ($itemsList.length > 0) {
                    $itemsList.each(function (i, item) {
                        $wrapper.append($(item).fadeIn(800));
                    })
                }
            }


            updateYandexMap();
            marginTopCalc();
        });

    } else {
        $.ajax({
            url: "/local/ajax/ajax_dealers_default.php",
            dataType: 'html'
        }).done(function (data) {
            var $items = $(data).find('.dealer_item_yandex_js');
            var $conteiner = $(".map-dealers-list");
            var $lost = $conteiner.find('.dealer_lost');
            //$items.toggle()
            $conteiner.find('.dealer_item_yandex_js').remove()
            if ($items.length > 0) {
                $items.each(function (i, item) {
                    $conteiner.append($(item).fadeIn(800));
                })
                $lost.fadeOut(0);
            } else {
                $lost.fadeIn(800);
            }

            let $itemsList = $(data).find('.dealer-map-list-item-js');
            let $wrapper = $("#map-cards-list-content");
            if($wrapper.length) {
                $wrapper.find('.dealer-map-list-item-js').remove();
                if ($itemsList.length > 0) {
                    $itemsList.each(function (i, item) {
                        $wrapper.append($(item).fadeIn(800));
                    })
                }
            }

            updateYandexMap();
            marginTopCalc();
        });
    }
}

function loadShares(clear = false) {
    return false;
    var onPage = 5;
    var countOld = $('.map-dealers-list').attr('data-count')
    var countElements = $(".map-dealers-list-item").length
    var pageNumber = (countElements / onPage + 1);
    if (clear && countElements < countOld) {
        $.post(
            "/local/ajax/ajax_dealers.php?PAGEN_1=" + pageNumber,
            {
                on_page: onPage,
                clear: true
            },
            function (data) {
                if (clear && $(".map-dealers-list-item").length > onPage) {
                    $(".map-dealers-list-item").append($(data).find('.dealer_item_yandex_js'));
                }
            }
        );
    }
    return false;
}

$(document).ready(function () {
    var $query = $('input.dealer_search');

    $(document).on('submit', '.search_dealers', function (e) {
        e.preventDefault();
        search($query.val());
    })
    $(document).on('click', '.js-rt-show-all-dealers', function (e) {
        e.preventDefault();
        search('old');
    })
    var $element = $('.map-dealers-list');
    if ($element.length) {
        $(window).scroll(function () {
            let counter = 0;
            var scroll = $(window).scrollTop() + $(window).height();
            var offset = $element.offset().top + $element.height();
            if (scroll > offset && counter == 0) {
                // loadShares(true)
                counter = 1;
            }
        });
    }

});

$(document).on('focus', '.dealer_search_js', function () {
    let val = $(this).val();
    val = val.trim();
    if (val.length > 0) {
        $('.input__search-results.input__search-results--dealers').show();
    }
})

$(window).click(function() {
  $('.input__search-results.input__search-results--dealers').hide();
});

$(document).on('click', '.RT_input', function(event){
  event.stopPropagation();
});
$(document).on('click', '.input__search-results.input__search-results--dealers', function(event){
  event.stopPropagation();
});

$(document).on('click', '.dealer_search_js', function () {
    let val = $(this).val();
    val = val.trim();
    if (val.length > 0) {
        $('.input__search-results.input__search-results--dealers').show();
    } else {
        $('.input__search-results.input__search-results--dealers').hide();
    }
})
$(document).on('input', '.dealer_search_js', function () {
    let val = $(this).val();
    val = val.trim();

    if (val.length === 0) {
        $('.input__search-results.input__search-results--dealers').hide();

        return;
    }

    $.post(
        "/local/ajax/ajax_cities.php?SEARCH=" + val,
        {},
        function (data) {
            if(data.trim()) {
                $('.search-result-row-js').remove();
                $('.search-preshow-js').prepend(data);
                $('.input__search-results.input__search-results--dealers').show();
            } else {
                $('.input__search-results.input__search-results--dealers').hide();
            }
        }
    );
})

$(document).on('click', '.search-result-row-js', function(e) {
    e.preventDefault();

    let text = $(this).find('.search-result-text-js').text();
    console.log('TEST', text)
    $('.dealer_search_js').trigger('blur');
    $('.dealer_search_js').val(text);
    $('.input__search-results.input__search-results--dealers').hide();
    search(text);
})
