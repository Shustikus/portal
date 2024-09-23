window.addEventListener('DOMContentLoaded', () => {

    $( "#technical-support-form" ).submit(function( event ) {
        event.preventDefault();

        var formData = JSON.stringify($('#technical-support-form').serializeArray());

        $('#modal-form-1 .modal__head').html(BX.message("FORM_SEND_SUCCESS"));

        BX.ajax.runComponentAction('uplab.production:form.univers',
            'sendForm', {
                mode: 'class',
                data: {post: {
                        field: formData,
                    }},
            })
            .then(function(response) {

            });
    });

});

