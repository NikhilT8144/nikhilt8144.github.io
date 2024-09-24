        document.getElementById('go-btn').addEventListener('click', function() {
            var url = document.getElementById('url-input').value;
            if (!url.startsWith('http')) {
                url = 'http://' + url;  // Ensure http or https
            }
            var proxyUrl = 'https://nikhilt8144.serv00.net/proxy.php?url=' + encodeURIComponent(url);
            document.getElementById('proxy-frame').src = proxyUrl;
        });
