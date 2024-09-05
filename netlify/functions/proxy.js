const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const method = event.httpMethod;
    const { targetUrl } = JSON.parse(event.body || '{}'); // Expecting 'targetUrl' in the request body for POST requests

    // If targetUrl is not provided or it's a GET request, use the query string for the target URL
    const target = targetUrl || event.queryStringParameters.targetUrl;

    if (!target) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing 'targetUrl' in request." })
        };
    }

    try {
        let response;

        if (method === 'POST') {
            // For POST requests
            const bodyData = JSON.parse(event.body).body || {}; // Get the 'body' object from request if it exists

            response = await fetch(target, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData)
            });
        } else if (method === 'GET') {
            // For GET requests
            response = await fetch(target);
        } else {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: "Method not allowed. Only GET and POST are supported." })
            };
        }

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
