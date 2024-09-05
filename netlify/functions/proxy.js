exports.handler = async function(event, context) {
    const fetch = (await import('node-fetch')).default;

    // Define the allowed origins
    const allowedOrigins = ['https://nikhilt8144.github.io', 'https://b-r-o-s.github.io'];

    // Get the origin of the request
    const origin = event.headers.origin;

    // Check if the request's origin is allowed
    let corsOrigin = '';
    if (allowedOrigins.includes(origin)) {
        corsOrigin = origin; // Allow the origin if it's in the allowed list
    } else {
        return {
            statusCode: 403, // Forbidden status
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Allow all origins to see the error message
            },
            body: JSON.stringify({ error: "Error: Not Allowed" }),
        };
    }

    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': corsOrigin,  // Dynamically set the allowed origin
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };

    // Handle CORS preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "CORS preflight success" }),
        };
    }

    const method = event.httpMethod;
    const { targetUrl, body: requestBody } = JSON.parse(event.body || '{}');
    const target = targetUrl || event.queryStringParameters.targetUrl;

    if (!target) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "Missing 'targetUrl' in request." }),
        };
    }

    try {
        let response;

        if (method === 'POST') {
            response = await fetch(target, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody || {}),
            });
        } else if (method === 'GET') {
            response = await fetch(target);
        } else {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: "Method not allowed. Only GET and POST are supported." }),
            };
        }

        const data = await response.json();
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
