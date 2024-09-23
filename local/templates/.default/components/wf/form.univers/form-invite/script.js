window.addEventListener('DOMContentLoaded', () => {
    $( "#invite-form" ).submit(function( event ) {
        event.preventDefault();

        var formData = JSON.stringify($('#invite-form').serializeArray());
       
        $('#form-invite .modal__head').html(BX.message("FORM_SEND_SUCCESS"));
        $('#form-invite .modal__body').html(BX.message("FORM_SEND_LINK"));

        BX.ajax.runComponentAction('wf:form.univers',
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

