const bcrypt = require('bcryptjs');

class Helpers{

    public async encryptPassword(password: string): Promise<string>{
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    public async matchPassword (password: string, savedPassword: string){
        try {
            return await bcrypt.compare(password, savedPassword);
        } catch (e) {
            console.log(e);
        }
    }
}

const helpers = new Helpers;
export default helpers;