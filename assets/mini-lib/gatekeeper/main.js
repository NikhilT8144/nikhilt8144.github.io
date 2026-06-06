/*
 - Gatekeeper.js - A lightweight client validation and device identification library
*/

(function (window, document) {
    'use strict';

    const Gatekeeper = {
        /*
         - Initialize the validation sequence
         - @param {Object} config - Configuration options
        */
        init: function (config) {
            const endpoint = config.endpoint || 'gatekeeper.php';
            const honeypotId = config.honeypotId || null;

            // 1. Run Integrity Checks
            const isAutomated = navigator.webdriver; 
            const hasNoPlugins = navigator.plugins && navigator.plugins.length === 0;
            
            let isHoneypotTriggered = false;
            if (honeypotId) {
                const honeypotField = document.getElementById(honeypotId);
                if (honeypotField && honeypotField.value !== "") {
                    isHoneypotTriggered = true;
                }
            }

            // 2. Route Invalid Entities
            if (isAutomated || hasNoPlugins || isHoneypotTriggered) {
                this.isolateLocalDevice();
                return;
            }

            // 3. Persistent Unique Identification for Valid Devices
            let deviceUID = localStorage.getItem('device_uid');
            if (!deviceUID) {
                // Generate a highly distinct client-side token string
                deviceUID = 'dev_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
                localStorage.setItem('device_uid', deviceUID);
            }

            // 4. Background Sync with Server Log (Asynchronous, non-blocking)
            if (window.fetch) {
                fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ uid: deviceUID })
                }).catch(function () {
                    // Fail silently in the background if network is offline
                });
            }
        },

        /**
         * Safely isolate invalid entities locally without saving data
         */
        isolateLocalDevice: function () {
            // Remove any existing valid identification remnants
            localStorage.removeItem('device_uid');

            // Forcefully overwrite the document body locally with a customized GUI
            document.open();
            document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verification Required</title>
                    <style>
                        body {
                            background-color: #0f1115;
                            color: #e2e8f0;
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                        }
                        .container {
                            text-align: center;
                            max-width: 440px;
                            padding: 40px;
                            background: #1a1f2c;
                            border: 1px solid #2d3748;
                            border-radius: 12px;
                            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
                        }
                        h2 { margin-top: 0; color: #f56565; font-size: 1.5rem; }
                        p { color: #a0aec0; line-height: 1.5; font-size: 0.95rem; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Access Denied</h2>
                        <p>Our network security layer identified this request as an automated or invalid device environment.</p>
                        <p style="font-size: 0.85rem; color: #718096; margin-top: 20px;">If you are experiencing this in error, please try again later using a standard browser configuration.</p>
                    </div>
                </body>
                </html>
            `);
            document.close();
        }
    };

    // Expose the library globally
    window.Gatekeeper = Gatekeeper;

})(window, document);
