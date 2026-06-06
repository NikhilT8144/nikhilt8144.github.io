/*
 - Gatekeeper.js
*/

(function (window, document) {
    'use strict';

    const BACKEND_ENDPOINT = 'https://nikhilt8144.serv00.net/api/gatekeeper/';

    const HONEYPOT_NAME = 'bg_security_verification_token';

    const Gatekeeper = {
        init: function () {
            console.log("[Gatekeeper] 🚀 Initialization started...");

            // 1. Inject Honeypots
            const formsFound = this.injectHoneypots();
            console.log(`[Gatekeeper] 🔍 Found and injected honeypot into ${formsFound} form(s).`);

            // 2. Integrity Checks
            const isAutomated = navigator.webdriver; 
            const isHoneypotTriggered = this.checkHoneypots();
            
            console.log(`[Gatekeeper] 🤖 Automated Bot Detected? ${!!isAutomated}`);
            console.log(`[Gatekeeper] 🍯 Honeypot Triggered? ${isHoneypotTriggered}`);

            if (isAutomated || isHoneypotTriggered) {
                console.warn("[Gatekeeper] 🛑 THREAT DETECTED. Isolating device...");
                this.isolateLocalDevice();
                return;
            }

            // 3. Identification
            let deviceUID = localStorage.getItem('device_uid');
            if (!deviceUID) {
                deviceUID = 'dev_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
                localStorage.setItem('device_uid', deviceUID);
                console.log(`[Gatekeeper] 🆕 New Device UID generated: ${deviceUID}`);
            } else {
                console.log(`[Gatekeeper] 👤 Returning Device UID found: ${deviceUID}`);
            }

            // 4. Server Sync
            console.log(`[Gatekeeper] 📡 Attempting to sync with backend: ${BACKEND_ENDPOINT}`);
            if (window.fetch) {
                fetch(BACKEND_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ uid: deviceUID })
                })
                .then(response => {
                    console.log(`[Gatekeeper] 📥 Server responded with HTTP Status: ${response.status}`);
                    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    console.log("[Gatekeeper] ✅ Sync SUCCESS! Server says:", data);
                })
                .catch(err => {
                    console.error("[Gatekeeper] ❌ Sync FAILED! The browser blocked the request or the server is down.", err);
                });
            }
        },

        injectHoneypots: function () {
            const forms = document.querySelectorAll('form');
            let count = 0;
            forms.forEach(form => {
                if (!form.querySelector(`input[name="${HONEYPOT_NAME}"]`)) {
                    const honeyInput = document.createElement('input');
                    honeyInput.type = 'text';
                    honeyInput.name = HONEYPOT_NAME;
                    honeyInput.style.position = 'absolute';
                    honeyInput.style.left = '-9999px';
                    honeyInput.setAttribute('tabindex', '-1');
                    honeyInput.setAttribute('autocomplete', 'off');
                    form.appendChild(honeyInput);
                    count++;
                }
            });
            return count;
        },

        checkHoneypots: function () {
            const honeypots = document.querySelectorAll(`input[name="${HONEYPOT_NAME}"]`);
            for (let i = 0; i < honeypots.length; i++) {
                if (honeypots[i].value !== '') return true;
            }
            return false;
        },

        isolateLocalDevice: function () {
            localStorage.removeItem('device_uid');
            document.open();
            document.write(`<div style="color:red; background:black; padding:20px; text-align:center;"><h2>Access Denied</h2><p>Security block triggered.</p></div>`);
            document.close();
        }
    };

    // Execution with a slight delay to allow other scripts to build the page first
    window.addEventListener('load', () => {
        setTimeout(() => Gatekeeper.init(), 500);
    });

})(window, document);
