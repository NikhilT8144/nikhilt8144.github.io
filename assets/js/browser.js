$(document).ready(function() {
    $('#browse-btn').click(function() {
        const urlToFetch = $('#url-input').val();
        if (urlToFetch) {
            // Clear previous content and input
            $('#browser-content').html('<p>Loading...</p>');
            $('#url-input').val('');

            // Make a request to the Serv00 backend
            const proxyURL = 'https://nikhilt8144.serv00.net/proxy.php';  // Serv00 backend URL
            $.get(proxyURL + '?url=' + encodeURIComponent(urlToFetch), function(data) {
                $('#browser-content').html(data);
            }).fail(function() {
                $('#browser-content').html('<p>Error: Unable to load the page.</p>');
            });
        } else {
            alert('Please enter a URL.');
        }
    });

    // Allow pressing 'Enter' to browse
    $('#url-input').keypress(function(e) {
        if (e.which === 13) {
            $('#browse-btn').click();
        }
    });
});
