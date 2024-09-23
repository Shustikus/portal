window.addEventListener('DOMContentLoaded', () => {
    jsSearcLazy.init();
});

var jsSearcLazy = {
    'init': function () {

    },

    /*
    * Подгрузка новых элементов при скролинге
    */
    'loadElemenl': function (nextLink) {

        if(window.nextLazyLoad !== false){
            BX.ajax.post (
                nextLink,
                {startPageS:window.startPage,nowPageS:window.nowPage},
                function (data) {

                    $('#lazyload_temp').html(data);

                    var result = $("#lazyload_temp .search-results__list").html();

                    var navResult = $("#lazyload_temp .paginator").html();

                    $('#lazyload_temp').html('');

                    $('.paginator').html(navResult);
                    $('.search-results__list').append(result);

                    window.dispatchEvent(new CustomEvent('init.lazyload'));
                    window.dispatchEvent(new CustomEvent('init.modals'));
                    // window.dispatchEvent(new CustomEvent('init.scrollAnimationAjax'));
                    window.UPB.scroll_animation.enable();
                });
        }
    },
};










