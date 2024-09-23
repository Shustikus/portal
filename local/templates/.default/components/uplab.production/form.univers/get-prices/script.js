window.addEventListener('DOMContentLoaded', () => {
    $(document).on('submit', '#application-form-modal', function () {
        let src = $('.download-link').data('src');
        
        downloadURI(src, '');
    });
});

function downloadURI(uri, name)
{
    var link = document.createElement("a");
    // If you don't know the name or want to use
    // the webserver default set name = ''
    link.setAttribute('download', name);
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
}
