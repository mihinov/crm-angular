const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const keys = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
    secretOrKey: keys.jwt
};

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, async (payload, done) => {
            try {
                const user = await User.findById(payload.userId).select('email id');

                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch(e) {
                console.error(e);
                done(e, false);
            }
        })
    )
};