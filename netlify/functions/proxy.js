exports.handler = async function(event, context) {
    const fetch = (await import('node-fetch')).default;

    const method = event.httpMethod;
    const { targetUrl, body: requestBody } = JSON.parse(event.body || '{}');
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
            response = await fetch(target, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody || {})
            });
        } else if (method === 'GET') {
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
