/*
window.addEventListener('DOMContentLoaded', () => {
    $( "#contact-us-form" ).submit(function( event ) {
        event.preventDefault();

        var formData = JSON.stringify($('#contact-us-form').serializeArray());

        $('#modal-form-1 .modal__head').html('Форма успешно отпрвлена');

        BX.ajax.runComponentAction('uplab.production:form.univers',
            'sendForm', {
                mode: 'class',
                data: {post: {
                        field: formData,
                    }},
            })
            .then(function(response) {
                console.log(response);
            });
    });
});
*/