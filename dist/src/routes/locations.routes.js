"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multer_1 = __importDefault(require("multer"));
var celebrate_1 = require("celebrate");
var connection_1 = __importDefault(require("../database/connection"));
var multer_2 = __importDefault(require("../config/multer"));
var isAuthenticated_1 = __importDefault(require("../middlewares/isAuthenticated"));
var locationsRouter = express_1.Router();
var upload = multer_1.default(multer_2.default);
locationsRouter.use(isAuthenticated_1.default);
locationsRouter.get('/', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, city, uf, itemIds, parsedItems, locations, locations;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = request.query, city = _a.city, uf = _a.uf, itemIds = _a.itemIds;
                if (!(city && uf && itemIds)) return [3 /*break*/, 2];
                parsedItems = String(itemIds).split(',').map(function (item) { return Number(item.trim()); });
                return [4 /*yield*/, connection_1.default('locations')
                        .join('location_items', 'locations.id', '=', 'location_items.location_id')
                        .whereIn('location_items.item_id', parsedItems)
                        .where('city', String(city))
                        .where('uf', String(uf))
                        .distinct()
                        .select('locations.*')];
            case 1:
                locations = _b.sent();
                return [2 /*return*/, response.json(locations)];
            case 2: return [4 /*yield*/, connection_1.default('locations').select('*')];
            case 3:
                locations = _b.sent();
                return [2 /*return*/, response.json(locations)];
        }
    });
}); });
locationsRouter.get('/:id', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, location, items;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = request.params.id;
                return [4 /*yield*/, connection_1.default('locations').where('id', id).first()];
            case 1:
                location = _a.sent();
                if (!location) {
                    return [2 /*return*/, response.status(400).json({ message: 'Location not found.' })];
                }
                return [4 /*yield*/, connection_1.default('items')
                        .join('location_items', 'items.id', '=', 'location_items.item_id')
                        .where('location_items.location_id', id)
                        .select('items.title')];
            case 2:
                items = _a.sent();
                return [2 /*return*/, response.json({ location: location, items: items })];
        }
    });
}); });
locationsRouter.post('/', celebrate_1.celebrate({
    body: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required(),
        email: celebrate_1.Joi.string().required().email().label('e-mail'),
        whatsapp: celebrate_1.Joi.string().required(),
        latitude: celebrate_1.Joi.number().required(),
        longitude: celebrate_1.Joi.number().required(),
        city: celebrate_1.Joi.string().required(),
        uf: celebrate_1.Joi.string().required().max(2).min(2).messages({
            'string.base': "\"uf\" should be a type of 'text'",
            'string.empty': "\"uf\" cannot be an empty field",
            'string.min': "\"uf\" should have a minimum length of {#limit}",
            'string.max': "\"uf\" should have a maximum length of {#limit}",
            'any.required': "\"uf\" is a required field"
        }),
        items: celebrate_1.Joi.array().items(celebrate_1.Joi.number()).required(),
        image: celebrate_1.Joi.string().required(),
    })
}, {
    abortEarly: false
}), function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, whatsapp, latitude, longitude, city, uf, items, location, transaction, newIds, location_id, locationItems;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = request.body, name = _a.name, email = _a.email, whatsapp = _a.whatsapp, latitude = _a.latitude, longitude = _a.longitude, city = _a.city, uf = _a.uf, items = _a.items;
                location = {
                    image: "fake_image.jpg",
                    name: name,
                    email: email,
                    whatsapp: whatsapp,
                    latitude: latitude,
                    longitude: longitude,
                    city: city,
                    uf: uf
                };
                return [4 /*yield*/, connection_1.default.transaction()];
            case 1:
                transaction = _b.sent();
                return [4 /*yield*/, transaction('locations').insert(location)];
            case 2:
                newIds = _b.sent();
                location_id = newIds[0];
                locationItems = items.map(function (item_id) {
                    return {
                        item_id: item_id,
                        location_id: location_id
                    };
                });
                return [4 /*yield*/, transaction('location_items').insert(locationItems)];
            case 3:
                _b.sent();
                return [4 /*yield*/, transaction.commit()];
            case 4:
                _b.sent();
                return [2 /*return*/, response.json(__assign({ id: location_id }, location))];
        }
    });
}); });
locationsRouter.put('/:id', upload.single('image'), function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, image, location, locationUpdate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = request.params.id;
                image = request.file.filename;
                return [4 /*yield*/, connection_1.default('locations').where('id', id).first()];
            case 1:
                location = _a.sent();
                if (!location) {
                    return [2 /*return*/, response.status(400).json({ message: 'Location not found.' })];
                }
                locationUpdate = __assign(__assign({}, location), { image: image });
                return [4 /*yield*/, connection_1.default('locations').update(locationUpdate).where('id', id)];
            case 2:
                _a.sent();
                return [2 /*return*/, response.json(locationUpdate)];
        }
    });
}); });
exports.default = locationsRouter;
