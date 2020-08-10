import express, { Application } from 'express';
import userRoutes from './routes/userRoutes';
import bodyParser from 'body-parser';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';
const pass = require('./auth/passport');
import dotenv from 'dotenv';

const JwtStrategy = require('passport-strategy');
const ExtractJwt = require('passport-jwt').ExtractJwt;

//const app: Application = express();

class Server {
    public app: Application;
    constructor(){
        dotenv.config();
        //console.log(process.env.TOKEN_SECRET)
        this.app = express();
        require('./auth/passport');
        this.config();
        this.routes();
    }

    config(): void{
        this.app.set('port',process.env.PORT || 3000); 
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(cors());
    }

    routes(): void{
        this.app.use('/',userRoutes);
    }

    start(): void{
        this.app.listen(this.app.get('port'), () =>{
            console.log('Servidor en el puerto', this.app.get('port'));
        })
    }
}

const server = new Server();
server.start();