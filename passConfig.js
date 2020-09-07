const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passwordcrypto = require('./passwordcrypto.js')

function config(app){
    app.use(passport.initialize())
    app.use(passport.session()); //must be after app session

    userSerialDeserial(app);

    //user = {email, fullname, password: {salt, hashed}}
    const localLogin = new LocalStrategy(
        {usernameField: 'email', passwordField: 'password', passReqToCallback: true},
        (req, email, password, done)=>{
            console.log('passport strategy is called')
            app.locals.customerCollection.find({email}).toArray()
                .then(users => {
                    console.log("user: ", users)
                    if(users.length != 1){
                        console.log('passport invalid email !=1');
                        return done(null, false, req.flash('flash_message', 'Invalid Email'));
                    } else{
                        const user = users[0]
                        if(passwordcrypto.verifyPassword(password, user)){
                            console.log('passport user validated')
                            return done(null, user);
                    } else{
                        console.log('passport invalid password')
                        return done(null,false, req.flash('flash_message', 'Invalid password'))
                        }
                    }
                })
                .catch(error=> {
                    console.log('find() db error')
                    return done(error)
                })
        }
    );

    passport.use('localLogin', localLogin);

    const signupStrategy = new LocalStrategy(
        {usernameField: 'email', passwordField: 'password', passReqToCallback: true},
        (req, email, password, done)=>{
            app.locals.customerCollection.find({email}).toArray()
                    .then(users =>{
                        
                        if (users.length != 0){
                            return done(null, false, req.flash('flash message', 'Email already in use'));
                        } else {
                            const hashedPassword = passwordcrypto.hashPassword(password);
                            const user = {email, fullname: req.body.fullname, password: hashedPassword}
                            app.locals.customerCollection.insertOne(user)
                                .then(result => {
                                    return done(null, user,
                                        req.flash('flash_message', 'Your account is created. Login now'))
                                })
                                .catch(error => {
                                    return done(error)
                                })
                        }
                    })
                    .catch(error => {
                        return done(error)
                    })
        }
    );
    passport.use('signupStrategy', signupStrategy);
}

    //user = {_id, email, fullname, password: {salt, hashed}}
function userSerialDeserial(app){  
    passport.serializeUser((user, done)=>{
       done(null, user._id);
        //done(null, user)
    })
    passport.deserializeUser((serial_user, done)=>{
        app.locals.customerCollection.find({_id: app.locals.ObjectID (serial_user)}).toArray()
            .then(users => {
                if(users.length != 1){
                    throw `Error: found ${users.length} users`
                }else{
                    done(null, users[0])
                }
            })
            .catch(error=>{
                return done(error)
            })
       // done(null, serial_user)
    })

}

module.exports = {config, passport}