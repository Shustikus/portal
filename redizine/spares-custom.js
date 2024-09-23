


$( document ).ready(function() {
    
    $.each($('.js-content-with-slider'), function (indexInArray, valueOfElement) {

        let $slider = $(this).addClass('js-content-with-slider-'+indexInArray);
        let $pag = $(this).find('.swiper-pagination').addClass('swiper-pagination-'+indexInArray);
        let $tabs = $(this).closest('.tabs').find('.tabs-list__el').addClass('tabs-list__el-t-'+indexInArray);

        const swiper = new Swiper('.js-content-with-slider-'+indexInArray, {
            speed: 400,
            spaceBetween: 10,
            preloadImages: false,
            // Enable lazy loading
            lazy: true,
            pagination: {el: '.swiper-pagination-'+indexInArray, clickable: true, dynamicBullets: false, dynamicMainBullets: 1},
        });

        $('.tabs-list__el-t-'+indexInArray).on('click', function() {
            let indexEl = $(this).attr('data-hash-link-slide');
            $(this).addClass('asdasdasdasdasd')
            swiper.slideTo(indexEl);
            // console.log('click ', indexEl);
        });
        swiper.on('slideChange', function () {
            $('.tabs-list__el-t-'+indexInArray).removeClass('active')
            $('.tabs-list__el-t-'+indexInArray).eq(swiper.realIndex).addClass('active')
            // console.log('change ', swiper.realIndex)
        });



    });

});