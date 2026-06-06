/*
 - Gatekeeper.js - Zero-Configuration Plug & Play Edition
*/

(function (window, document) {
    'use strict';

    // 1. Hardcoded configuration for instant deployment
    const BACKEND_ENDPOINT = 'https://nikhilt8144.serv00.net/api/gatekeeper/';
    const HONEYPOT_NAME = 'bg_security_verification_token';

    const Gatekeeper = {
        init: function () {
            // 2. Automatically discover forms and inject security layers
            this.injectHoneypots();

            // 3. Run Integrity Checks
            const isAutomated = navigator.webdriver; 
            const isHoneypotTriggered = this.checkHoneypots();

            // 4. Route Invalid Entities
            if (isAutomated || isHoneypotTriggered) {
                this.isolateLocalDevice();
                return;
            }

            // 5. Persistent Unique Identification for Valid Devices
            let deviceUID = localStorage.getItem('device_uid');
            if (!deviceUID) {
                deviceUID = 'dev_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
                localStorage.setItem('device_uid', deviceUID);
            }

            // 6. Background Sync with Server Log
            if (window.fetch) {
                fetch(BACKEND_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ uid: deviceUID })
                })
                .then(response => response.json())
                .then(data => console.log("Gatekeeper Protection Active."))
                .catch(function () {
                    // Fail silently in the background if network is offline
                });
            }
        },

        /**
         * Automatically finds every HTML form on your page and embeds an invisible trap field
         */
        injectHoneypots: function () {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                // Prevent duplicate injections if the script is loaded twice
                if (!form.querySelector(`input[name="${HONEYPOT_NAME}"]`)) {
                    const honeyInput = document.createElement('input');
                    honeyInput.type = 'text';
                    honeyInput.name = HONEYPOT_NAME;
                    
                    // Style it securely so humans never see it, but bots find it in the DOM source
                    honeyInput.style.position = 'absolute';
                    honeyInput.style.left = '-9999px';
                    honeyInput.style.display = 'none';
                    honeyInput.setAttribute('tabindex', '-1');
                    honeyInput.setAttribute('autocomplete', 'off');
                    
                    form.appendChild(honeyInput);
                }
            });
        },

        /**
         * Checks if a bot auto-filled any of our injected fields
         */
        checkHoneypots: function () {
            const honeypots = document.querySelectorAll(`input[name="${HONEYPOT_NAME}"]`);
            for (let i = 0; i < honeypots.length; i++) {
                if (honeypots[i].value !== '') {
                    return true; // Honeypot triggered! This entity is a spam-bot
                }
            }
            return false;
        },

        /**
         * Safely isolate invalid entities locally
         */
        isolateLocalDevice: function () {
            localStorage.removeItem('device_uid');
            document.open();
            document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verification Required</title>
                    <style>
                        body { background-color: #0f1115; color: #e2e8f0; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                        .container { text-align: center; max-width: 440px; padding: 40px; background: #1a1f2c; border: 1px solid #2d3748; border-radius: 12px; }
                        h2 { margin-top: 0; color: #f56565; }
                        p { color: #a0aec0; line-height: 1.5; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Access Denied</h2>
                        <p>Our security layers identified this request as an automated or invalid environment.</p>
                    </div>
                </body>
                </html>
            `);
            document.close();
        }
    };

    // Self-execute automatically based on page loading state
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Gatekeeper.init());
    } else {
        Gatekeeper.init();
    }

    // Still expose it globally just in case you want to access it via console
    window.Gatekeeper = Gatekeeper;

})(window, document);
