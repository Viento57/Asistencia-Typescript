"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const pass = require('./auth/passport');
const dotenv_1 = __importDefault(require("dotenv"));
const JwtStrategy = require('passport-strategy');
const ExtractJwt = require('passport-jwt').ExtractJwt;
//const app: Application = express();
class Server {
    constructor() {
        dotenv_1.default.config();
        //console.log(process.env.TOKEN_SECRET)
        this.app = express_1.default();
        require('./auth/passport');
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan_1.default('dev'));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(passport_1.default.initialize());
        this.app.use(passport_1.default.session());
        this.app.use(cors_1.default());
    }
    routes() {
        this.app.use('/', userRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Servidor en el puerto', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
