"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
class UserRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/register', userController_1.default.create);
        this.router.post('/login', userController_1.default.login);
        this.router.post('/logout', userController_1.default.salir);
        this.router.post('refresh', userController_1.default.refresh);
        this.router.get('/home', userController_1.default.inicio);
    }
}
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
