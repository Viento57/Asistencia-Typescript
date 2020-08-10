import { Request, Response } from 'express';
//import SECRET from '../auth/ultra';
import poolDB from '../database';
import helper from '../auth/helpers';
const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');

const refreshTokens = {};

class UserController {
    public async list(req: Request, res: Response): Promise<void>{
        const users = await poolDB.query('SELECT *FROM usuario');
        res.json(users);
    }

    public async login(req: Request, res: Response, done: any): Promise<any>{
        const { username, password } = req.body;
        const usuario = await poolDB.query('SELECT * FROM usuario WHERE usuaUsua = ?',[username]);
        console.log(usuario.length);
        const user = usuario[0];
        console.log(user);
        if (user === undefined) {
            console.log('Usuario no existe')
            return done(undefined, false,{
                message: `username ${username} no encontrado`
            });
        }else{
            const equals = await helper.matchPassword(password,user.passUsua);
            if (!equals) {
                return done({message: `password ${user.password} incorrecto`});
            }else{
                const token = jwt.sign( {user} , process.env.TOKEN_SECRET, { expiresIn: 600 });
                const refreshToken = randtoken.uid(256);
                refreshTokens[refreshToken] = username;
                res.json({ jwt: token, refreshToken: refreshToken });
            }
        }
        
    }

    public async create(req: Request, res: Response): Promise<void>{
        const {username, password, estado, tipo} = req.body;
        const encriptada = await helper.encryptPassword(password);
        const result =await poolDB.query('INSERT INTO usuario(usuaUsua, estaUsua, tipoUsua, passUsua) values(?,?,?,?)', [username, estado, tipo,encriptada]);
        //res.json({message : 'Usuario guardado'});
    }

    public async actualizar(req: Request, res: Response): Promise<void>{
        const {id} = req.params;
        await poolDB.query('UPDATE usuario set ? WHERE id = ?',[req.body, id]);
        res.json({message: 'Usuario actualizado'});
    }

    public async aliminar(req: Request, res: Response): Promise<void>{
        const { id } = req.params;
        await poolDB.query('DELETE FROM usuario WHERE id=?', [id]);
        res.json({message: 'Usuario eliminado'});
    }

    public salir(req: Request, res: Response){
        const refreshToken = req.body.refreshToken;
        if(refreshToken in refreshTokens){
            delete refreshTokens[refreshToken];
        }
        res.sendStatus(204);
    }

    public refresh(req: Request, res: Response){
        const refreshToken = req.body.refreshToken;

        if (refreshToken in refreshTokens) {
            const user = {
                username: refreshTokens[refreshToken],
                role: 'admin',
            };
            const token = jwt.sign(user, process.env.TOKEN_SECRET, {expiresIn: 600});
            res.json({jwt: token});
        } else {
            res.sendStatus(401);
        }
    }

    public inicio(req: Request, res: Response){
        res.json({value: Math.floor(Math.random()*100)});
    }
}

const userController = new UserController;
export default userController;