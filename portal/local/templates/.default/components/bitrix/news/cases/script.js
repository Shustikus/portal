window.addEventListener('DOMContentLoaded', function() {
    if(window.location.hash) {
        var els = $('a[href="'+window.location.hash+'"]');
        if(els.length) {
            els.each(function () {
                var tab = $(this);
                if(tab.hasClass('tabs-list__el')) {
                    setTimeout(function () {
                        tab.click();
                    }, 100);
                    return false;
                }
            });
        }
    }
});










