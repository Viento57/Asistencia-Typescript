import { Router } from 'express';
import userController from '../controllers/userController';


class UserRoutes {

    public router: Router = Router();

    constructor(){
        this.config();
    }
    config(): void{
        this.router.post('/register', userController.create);
        this.router.post('/login', userController.login);
        this.router.post('/logout', userController.salir);
        this.router.post('refresh', userController.refresh);
        this.router.get('/home', userController.inicio);
    }
}

const userRoutes = new UserRoutes();

export default userRoutes.router;
