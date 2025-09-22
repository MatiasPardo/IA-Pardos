const crypto = require('crypto');

const SECRET_KEY = 'secret-key';

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function createToken(payload) {
    const header = Buffer.from(JSON.stringify({typ: 'JWT', alg: 'HS256'})).toString('base64');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64');
    const signature = crypto.createHmac('sha256', SECRET_KEY).update(`${header}.${body}`).digest('base64');
    return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
    try {
        const [header, body, signature] = token.split('.');
        const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(`${header}.${body}`).digest('base64');
        if (signature !== expectedSignature) return null;
        return JSON.parse(Buffer.from(body, 'base64').toString());
    } catch { 
        return null; 
    }
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

module.exports = {
    generateId,
    createToken,
    verifyToken,
    hashPassword
};