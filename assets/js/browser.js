$(document).ready(function() {
    $('#browse-btn').click(function() {
        const urlToFetch = $('#url-input').val();
        if (urlToFetch) {
            const proxyURL = 'https://nikhilt8144.serv00.net/proxy.php';
            $.get(proxyURL + '?url=' + encodeURIComponent(urlToFetch), function(data) {
                $('#browser-content').html(data);
            }).fail(function() {
                $('#browser-content').html('<p>Error: Unable to load the page.</p>');
            });
        } else {
            alert('Please enter a URL.');
        }
    });

    $('#url-input').keypress(function(e) {
        if (e.which === 13) {
            $('#browse-btn').click();
        }
    });
});
