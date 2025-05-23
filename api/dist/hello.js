"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
function handler(request, response) {
    const { name = 'World' } = request.query;
    response.status(200).json({
        message: `Hello today , ${name}!`,
        timestamp: new Date().toISOString(),
        platform: process.platform,
    });
}
