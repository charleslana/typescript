"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = require("jsonwebtoken");
var auth_1 = __importDefault(require("../config/auth"));
function isAuthenticated(request, response, next) {
    var authHeader = request.headers.authorization;
    if (!authHeader) {
        return response.status(401).json({ message: 'JWT Token is missing.' });
    }
    // const [type, token] = authHeader.split(' ');
    var token = authHeader.split(' ')[1];
    try {
        var decodedToken = jsonwebtoken_1.verify(token, auth_1.default.jwt.secret);
        console.log(decodedToken);
        return next();
    }
    catch (error) {
        return response.status(401).json({ message: 'Invalid JWT Token.' });
    }
}
exports.default = isAuthenticated;
