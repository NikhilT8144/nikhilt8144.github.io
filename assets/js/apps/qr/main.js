      (function() {
        // --- 1. TRANSLATION (i18n) LOGIC ---
        const TRANSLATIONS = {
            "en-IN": {
                "appTitle": "QR Code Generator",
                "appDescription": "Generate QR codes for URLs, text, and contact information",
                "urlTab": "URL",
                "textTab": "Text",
                "contactTab": "Contact",
                "enterUrl": "Enter URL",
                "enterText": "Enter Text",
                "contactInformation": "Contact Information",
                "websiteUrl": "Website URL",
                "urlPlaceholder": "example.com or https://example.com",
                "urlHelp": "Enter a website URL. If you don't include http://, we'll add https:// automatically.",
                "textContent": "Text Content",
                "textPlaceholder": "Enter any text to generate QR code...",
                "firstName": "First Name",
                "firstNamePlaceholder": "John",
                "lastName": "Last Name",
                "lastNamePlaceholder": "Doe",
                "phoneNumber": "Phone Number",
                "phonePlaceholder": "+1 (555) 123-4567",
                "emailAddress": "Email Address",
                "emailPlaceholder": "john.doe@example.com",
                "organization": "Organization",
                "organizationPlaceholder": "Company Name",
                "website": "Website",
                "websitePlaceholder": "https://example.com",
                "clearAllFields": "Clear All Fields",
                "generatedQrCode": "Generated QR Code",
                "scanQrCode": "Scan this QR code with your device",
                "fillFormPrompt": "Fill in the form to generate your QR code",
                "download": "Download",
                "copyData": "Copy Data",
                "copied": "Copied!",
                "qrCodeData": "QR Code Data:",
                "footerText": "Generate QR codes instantly • No data stored • Free to use",
                "qrCodeAlt": "Generated QR Code"
            },
            "hi-IN": {
                "appTitle": "QR कोड जेनरेटर",
                "appDescription": "URL, टेक्स्ट और संपर्क जानकारी के लिए QR कोड जेनरेटर करें",
                "urlTab": "यूआरएल",
                "textTab": "टेक्स्ट",
                "contactTab": "संपर्क",
                "enterUrl": "यूआरएल दर्ज करें",
                "enterText": "टेक्स्ट दर्ज करें",
                "contactInformation": "संपर्क जानकारी",
                "websiteUrl": "वेबसाइट यूआरएल",
                "urlPlaceholder": "example.com या https://example.com",
                "urlHelp": "एक वेबसाइट यूआरएल दर्ज करें। यदि आप http:// शामिल नहीं करते हैं, तो हम https:// स्वचालित रूप से जोड़ देंगे।",
                "textContent": "टेक्स्ट सामग्री",
                "textPlaceholder": "QR कोड जेनरेट करने के लिए कोई भी टेक्स्ट दर्ज करें...",
                "firstName": "पहला नाम",
                "firstNamePlaceholder": "जॉन",
                "lastName": "अंतिम नाम",
                "lastNamePlaceholder": "डो",
                "phoneNumber": "फ़ोन नंबर",
                "phonePlaceholder": "+1 (555) 123-4567",
                "emailAddress": "ईमेल पता",
                "emailPlaceholder": "john.doe@example.com",
                "organization": "संगठन",
                "organizationPlaceholder": "कंपनी का नाम",
                "website": "वेबसाइट",
                "websitePlaceholder": "https://example.com",
                "clearAllFields": "सभी फ़ील्ड साफ़ करें",
                "generatedQrCode": "जेनरेट किया गया QR कोड",
                "scanQrCode": "इस QR कोड को अपने डिवाइस से स्कैन करें",
                "fillFormPrompt": "अपना QR कोड जेनरेट करने के लिए फ़ॉर्म भरें",
                "download": "डाउनलोड करें",
                "copyData": "डेटा कॉपी करें",
                "copied": "कॉपी किया गया!",
                "qrCodeData": "QR कोड डेटा:",
                "footerText": "तुरंत QR कोड जेनरेट करें • कोई डेटा संग्रहीत नहीं • उपयोग करने के लिए निःशुल्क",
                "qrCodeAlt": "जेनरेट किया गया QR कोड"
            }
        };

        const browserLocale = navigator.languages?.[0] || navigator.language || 'en-IN';
        const findMatchingLocale = (locale) => {
            if (TRANSLATIONS[locale]) return locale;
            const lang = locale.split('-')[0];
            const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
            return match || 'en-IN';
        };
        const locale = findMatchingLocale(browserLocale);
        const t = (key) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-IN'][key] || key;

        // --- 2. SVG ICONS (for dynamic changes) ---
        // Removed: Now handled by Lucide

        // --- 3. STATE & DOM REFERENCES ---
        let activeTab = 'url';
        let qrData = '';
        let domElements = {};
        let qrCodeInstance = null; // Store the QR code instance

        // --- 4. CORE FUNCTIONS ---

        /**
         * Applies all translations to the DOM.
         */
        function applyTranslations() {
            // Translate text content
            document.querySelectorAll('[data-tkey]').forEach(el => {
                el.textContent = t(el.dataset.tkey);
            });
            // Translate placeholders
            document.querySelectorAll('[data-tkey-placeholder]').forEach(el => {
                el.placeholder = t(el.dataset.tkeyPlaceholder);
            });
        }

        /**
         * Sets the active tab and updates the UI.
         */
        function setActiveTab(tabId) {
            activeTab = tabId;

            // Update tab buttons
            domElements.tabs.forEach(tab => {
                if (tab.id === `tab-${tabId}`) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });

            // Move the glider
            const tabIndex = { 'url': 0, 'text': 1, 'contact': 2 }[tabId];
            const percentTranslate = tabIndex * 100;
            // NEW: Use GSAP for smooth, hardware-accelerated animation
            gsap.to(domElements.tabGlider, { duration: 0.3, x: `${percentTranslate}%`, ease: "power2.out" });


            // Update content blocks
            domElements.contents.forEach(content => {
                if (content.id === `content-${tabId}`) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });

            // Update heading
            const headingKey = {
                'url': 'enterUrl',
                'text': 'enterText',
                'contact': 'contactInformation'
            }[tabId];
            domElements.inputHeading.textContent = t(headingKey);

            // Regenerate QR code for the new tab
            updateQRCode();
        }

        /**
        * Primary function to get form data, generate QR data string, and update the UI.
        */
        function updateQRCode() {
            let data = '';
            
            switch (activeTab) {
                case 'url':
                    data = formatUrl(domElements.urlInput.value);
                    break;
                case 'text':
                    data = domElements.textInput.value;
                    break;
                case 'contact':
                    const contact = {
                        firstName: domElements.contactFirstName.value,
                        lastName: domElements.contactLastName.value,
                        phone: domElements.contactPhone.value,
                        email: domElements.contactEmail.value,
                        organization: domElements.contactOrganization.value,
                        url: domElements.contactUrl.value
                    };
                    if (contact.firstName || contact.lastName || contact.phone || contact.email) {
                        data = generateVCard(contact);
                    }
                    break;
                default:
                    data = '';
            }
            
            qrData = data;
            
            // NEW: Loading Animation Logic
            if (qrData) {
                // 1. Show loader, hide everything else
                domElements.qrPlaceholder.classList.add('hidden');
                domElements.qrLoader.classList.remove('hidden');
                domElements.qrContainerWrapper.classList.add('hidden');
                domElements.actionButtons.classList.add('hidden');
                domElements.qrDataContainer.classList.add('hidden');

                // 2. Generate QR code (defer to next tick to let loader show)
                setTimeout(() => {
                    generateQRCode(data); // This does the heavy lifting
                    
                    // 3. Show QR, hide loader
                    domElements.qrLoader.classList.add('hidden');
                    domElements.qrContainerWrapper.classList.remove('hidden');
                    domElements.actionButtons.classList.remove('hidden');
                    domElements.qrDataContainer.classList.remove('hidden');
                    domElements.qrDataDisplay.textContent = qrData;
                    
                    // NEW: GSAP Animation for the QR code
                    gsap.fromTo(domElements.qrContainerWrapper, 
                        { opacity: 0, scale: 0.9 }, 
                        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
                    );
                }, 50); // 50ms delay to ensure loader renders

            } else {
                // No data, show placeholder
                domElements.qrPlaceholder.classList.remove('hidden');
                domElements.qrLoader.classList.add('hidden');
                domElements.qrContainerWrapper.classList.add('hidden');
                domElements.actionButtons.classList.add('hidden');
                domElements.qrDataContainer.classList.add('hidden');
                domElements.qrDataDisplay.textContent = '';
                if (domElements.qrContainer) {
                    domElements.qrContainer.innerHTML = ''; // Clear canvas/img
                }
            }
        }

        /**
         * Formats a URL, adding 'https://' if no protocol is present.
         */
        function formatUrl(url) {
            if (!url.trim()) return '';
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                return 'https://' + url;
            }
            return url;
        }

        /**
         * Generates a vCard string from contact info.
         */
        function generateVCard(contact) {
            return `BEGIN:VCARD
VERSION:3.0
FN:${contact.firstName} ${contact.lastName}
N:${contact.lastName};${contact.firstName};;;
ORG:${contact.organization}
TEL:${contact.phone}
EMAIL:${contact.email}
URL:${contact.url}
END:VCARD`;
        }
        
        /**
         * Main QR generation function, decides between QRious and fallback.
         */
        function generateQRCode(text) {
            const container = domElements.qrContainer;
            if (!container) {
                return; // Guard clause
            }

            if (!text.trim()) {
                container.innerHTML = '';
                qrCodeInstance = null; // Clear the instance
                return;
            }

            if (typeof window.QRCodeStyling === 'undefined') {
                console.error("QRCodeStyling library not loaded.");
                container.innerHTML = '<p class="text-red-500 text-sm">Error: Could not load QR Code library.</p>';
                return;
            }
            
            // Styling options to match the user's image
            const options = {
                width: 4000, // 4K Resolution for ultra-sharp downloads
                height: 4000, // 4K Resolution
                type: "svg", // CHANGED: Switched to SVG for perfect on-screen rendering
                data: text,
                margin: 100, // Increased margin to keep proportions correct at 4K
                dotsOptions: {
                    color: "#000000",
                    type: "rounded"
                },
                backgroundOptions: {
                    color: "#ffffff",
                },
                cornersSquareOptions: {
                    color: "#000000",
                    type: "extra-rounded"
                },
                cornersDotOptions: {
                    color: "#000000",
                    type: "rounded"
                }
            };

            try {
                if (qrCodeInstance) {
                    qrCodeInstance.update(options);
                } else {
                    qrCodeInstance = new window.QRCodeStyling(options);
                    container.innerHTML = '';
                    qrCodeInstance.append(container);
                }
            } catch (e) {
                console.error("Error creating or updating QR Code:", e);
                console.log("window.QRCodeStyling at time of error:", window.QRCodeStyling);
            }
        }

        /**
         * Handles downloading the generated QR code.
         */
        function downloadQRCode() {
            if (!qrCodeInstance) return;
            
            qrCodeInstance.download({
                name: `qr-code-${activeTab}`,
                extension: "png"
            });
        }

        /**
         * Copies the raw QR data to the clipboard.
         */
        function copyToClipboard() {
            if (!qrData) return;
            
            const textarea = document.createElement('textarea');
            textarea.value = qrData;
            textarea.style.position = 'fixed'; 
            textarea.style.opacity = 0;
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                document.execCommand('copy');
                
                // NEW: Update button UI with Lucide
                domElements.copyBtnIcon.innerHTML = '<i data-lucide="check" class="lucide lucide-sm text-green-600"></i>';
                domElements.copyBtnText.textContent = t('copied');
                lucide.createIcons({ nodes: [domElements.copyBtnIcon] }); // Re-render the new icon
                
                setTimeout(() => {
                    domElements.copyBtnIcon.innerHTML = '<i data-lucide="copy" class="lucide lucide-sm"></i>';
                    domElements.copyBtnText.textContent = t('copyData');
                    lucide.createIcons({ nodes: [domElements.copyBtnIcon] }); // Re-render the original icon
                }, 2000);
                
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
            
            document.body.removeChild(textarea);
        }
        
        /**
         * Clears all form inputs and resets the QR code.
         */
        function resetForm() {
            domElements.urlInput.value = '';
            domElements.textInput.value = '';
            domElements.contactFirstName.value = '';
            domElements.contactLastName.value = '';
            domElements.contactPhone.value = '';
            domElements.contactEmail.value = '';
            domElements.contactOrganization.value = '';
            domElements.contactUrl.value = '';
            
            updateQRCode(); // This will clear qrData and reset the UI
        }

        // --- 5. INITIALIZATION ---
        window.addEventListener('load', () => {
            // Store all DOM references
            domElements = {
                // Tabs
                tabs: document.querySelectorAll('.tab-button'),
                tabUrl: document.getElementById('tab-url'),
                tabText: document.getElementById('tab-text'),
                tabContact: document.getElementById('tab-contact'),
                tabGlider: document.getElementById('tab-glider'),
                // Content Blocks
                contents: document.querySelectorAll('.tab-content'),
                contentUrl: document.getElementById('content-url'),
                contentText: document.getElementById('content-text'),
                contentContact: document.getElementById('content-contact'),
                inputHeading: document.getElementById('input-heading'),
                // Inputs
                urlInput: document.getElementById('url-input'),
                textInput: document.getElementById('text-input'),
                contactFirstName: document.getElementById('contact-firstName'),
                contactLastName: document.getElementById('contact-lastName'),
                contactPhone: document.getElementById('contact-phone'),
                contactEmail: document.getElementById('contact-email'),
                contactOrganization: document.getElementById('contact-organization'),
                contactUrl: document.getElementById('contact-url'),
                // QR Display
                qrContainer: document.getElementById('qr-container'),
                qrPlaceholder: document.getElementById('qr-placeholder'),
                qrLoader: document.getElementById('qr-loader'), // New loader
                qrContainerWrapper: document.getElementById('qr-container-wrapper'),
                // Action Buttons
                actionButtons: document.getElementById('action-buttons'),
                downloadBtn: document.getElementById('download-btn'),
                copyBtn: document.getElementById('copy-btn'),
                copyBtnIcon: document.getElementById('copy-btn-icon'),
                copyBtnText: document.getElementById('copy-btn-text'),
                clearBtn: document.getElementById('clear-btn'),
                // Data Display
                qrDataContainer: document.getElementById('qr-data-container'),
                qrDataDisplay: document.getElementById('qr-data-display')
            };

            // 1. Apply translations
            applyTranslations();

            // 2. Set up event listeners
            domElements.tabUrl.onclick = () => setActiveTab('url');
            domElements.tabText.onclick = () => setActiveTab('text');
            domElements.tabContact.onclick = () => setActiveTab('contact');
            
            domElements.clearBtn.onclick = resetForm;
            domElements.downloadBtn.onclick = downloadQRCode;
            domElements.copyBtn.onclick = copyToClipboard;

            document.querySelectorAll('.qr-input').forEach(input => {
                input.oninput = updateQRCode;
            });
            
            // 3. Set initial state
            setActiveTab('url');

            // 4. Activate all Lucide icons
            lucide.createIcons();

            // 5. Initial GSAP Animations
            // Animate the main card and header
            gsap.from(".max-w-4xl > div", { // Selects header and main card
                duration: 0.8, 
                opacity: 0, 
                y: 30, 
                ease: "power2.out",
                stagger: 0.1
            });
            // Animate the nav elements
            gsap.from("nav .tab-button", { 
                duration: 0.5, 
                opacity: 0, 
                y: -20, 
                stagger: 0.1, 
                ease: "power2.out", 
                delay: 0.4 
            });
            // Animate the footer
            gsap.from(".text-center.mt-8", {
                duration: 0.5,
                opacity: 0,
                delay: 0.8
            });
        });
      })();
