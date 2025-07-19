import https from 'https';
import fs from 'fs';
import app from './app.js';

const port = process.env.PORT || 3000;

// HTTPS for development, HTTP for production (behind reverse proxy)
if (process.env.NODE_ENV === 'development') {
    const server = https.createServer(
        {
            key: fs.readFileSync('key.pem'),
            cert: fs.readFileSync('cert.pem')
        },
        app
    );
    server.listen(port, () => console.log(`Server running on https://localhost:${port}`));
} else {
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}