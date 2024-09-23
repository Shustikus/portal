window.addEventListener('DOMContentLoaded', () => {

    $('.tabs-link .js-select2').on('change', function () {
        window.location = $(this).val();
    });

});