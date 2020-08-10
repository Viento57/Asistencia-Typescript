"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import SECRET from '../auth/ultra';
const database_1 = __importDefault(require("../database"));
const helpers_1 = __importDefault(require("../auth/helpers"));
const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');
const refreshTokens = {};
class UserController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield database_1.default.query('SELECT *FROM usuario');
            res.json(users);
        });
    }
    login(req, res, done) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            const usuario = yield database_1.default.query('SELECT * FROM usuario WHERE usuaUsua = ?', [username]);
            console.log(usuario.length);
            const user = usuario[0];
            console.log(user);
            if (user === undefined) {
                console.log('Usuario no existe');
                return done(undefined, false, {
                    message: `username ${username} no encontrado`
                });
            }
            else {
                const equals = yield helpers_1.default.matchPassword(password, user.passUsua);
                if (!equals) {
                    return done({ message: `password ${user.password} incorrecto` });
                }
                else {
                    const token = jwt.sign({ user }, process.env.TOKEN_SECRET, { expiresIn: 600 });
                    const refreshToken = randtoken.uid(256);
                    refreshTokens[refreshToken] = username;
                    res.json({ jwt: token, refreshToken: refreshToken });
                }
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password, estado, tipo } = req.body;
            const encriptada = yield helpers_1.default.encryptPassword(password);
            const result = yield database_1.default.query('INSERT INTO usuario(usuaUsua, estaUsua, tipoUsua, passUsua) values(?,?,?,?)', [username, estado, tipo, encriptada]);
            //res.json({message : 'Usuario guardado'});
        });
    }
    actualizar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('UPDATE usuario set ? WHERE id = ?', [req.body, id]);
            res.json({ message: 'Usuario actualizado' });
        });
    }
    aliminar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('DELETE FROM usuario WHERE id=?', [id]);
            res.json({ message: 'Usuario eliminado' });
        });
    }
    salir(req, res) {
        const refreshToken = req.body.refreshToken;
        if (refreshToken in refreshTokens) {
            delete refreshTokens[refreshToken];
        }
        res.sendStatus(204);
    }
    refresh(req, res) {
        const refreshToken = req.body.refreshToken;
        if (refreshToken in refreshTokens) {
            const user = {
                username: refreshTokens[refreshToken],
                role: 'admin',
            };
            const token = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: 600 });
            res.json({ jwt: token });
        }
        else {
            res.sendStatus(401);
        }
    }
    inicio(req, res) {
        res.json({ value: Math.floor(Math.random() * 100) });
    }
}
const userController = new UserController;
exports.default = userController;
