"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var items_routes_1 = __importDefault(require("./items.routes"));
var locations_routes_1 = __importDefault(require("./locations.routes"));
var users_routes_1 = __importDefault(require("./users.routes"));
var sessions_routes_1 = __importDefault(require("./sessions.routes"));
var routes = express_1.Router();
routes.use('/items', items_routes_1.default);
routes.use('/locations', locations_routes_1.default);
routes.use('/users', users_routes_1.default);
routes.use('/sessions', sessions_routes_1.default);
exports.default = routes;
