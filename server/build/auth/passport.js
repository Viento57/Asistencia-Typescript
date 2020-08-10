"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passportOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.TOKEN_SECRET || 'hellobeibetoken',
};
passport_1.default.use(new JwtStrategy(passportOpts, function (jwtPayload, done) {
    const expirationDate = new Date(jwtPayload.exp * 1000);
    if (expirationDate < new Date()) {
        return done(null, false);
    }
    done(null, jwtPayload);
}));
passport_1.default.serializeUser(function (user, done) {
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
