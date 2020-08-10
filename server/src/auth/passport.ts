import passport from 'passport';
import {IUser} from '../models/user'
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const passportOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET || 'hellobeibetoken',
};


passport.use(
    new JwtStrategy(passportOpts, function(jwtPayload: any, done: any){
        const expirationDate = new Date(jwtPayload.exp * 1000);
        if (expirationDate < new Date()) {
          return done(null, false);
        }
        done(null, jwtPayload);
    })
);

passport.serializeUser(function (user: IUser, done: any) {
    done(null, user.username);
});


// class PassportOpts{
//     public SECRET = 'ULTRASECRET_VIVE';

//     public constructor(){
//         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken();
//         secretOrKey: this.SECRET;
//     }
// }

// const passport =new PassportOpts;
// export default passport;