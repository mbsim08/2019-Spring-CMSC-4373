//since admin is not working, i added role in database, so i need to add an if statement
// that if your role is not admin, you cannot access to certain pages

const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000;

const session = require('express-session')

app.use(express.urlencoded({ extended: false }))
app.use(session(
    {
        secret: 'secretcodrrew',
        resave: false,
        saveUninitialized: false,
    }
));

const ShoppingCart = require('./model/ShoppingCart.js')

const utils = require('./utils.js');

app.set('view engine', 'ejs')
app.set('views', './views')
app.use('/public', express.static(__dirname + '/public'));


//database setup
const database = require('./database.js');
database.startDBandApp(app, PORT);

const flash = require('connect-flash')
app.use(flash())

const passConfig = require('./passConfig.js')
passConfig.config(app)

/*app.listen(PORT, () =>{
    console.log(`Server is running at port ${PORT}`)
})*/

app.get('/', (req, res) => {
    res.render('login', {flash_message: req.flash('flash_message')})
})

app.post('/login', passConfig.passport.authenticate(
    'localLogin',
    { successRedirect: '/clothing', failureRedirect: '/' , failureFlash: true}
));

app.get('/clothing', (req, res)=>{
    app.locals.productCollection.find({}).toArray()
    .then(product =>{
        res.render('clothing', {product, utils})
    })
    .catch(error =>{
        res.send(error);
    })
    
    //res.render('clothing',{nav: 'clothing'});
})

app.get('/shoes', (req, res)=>{
    app.locals.shoesCollection.find({}).toArray()
    .then(shoes =>{
        res.render('shoes', {shoes, utils})
    })
    .catch(error =>{
        res.send(error);
    })
})

app.post('/add2cart',(req,res)=>{
    let sc;
    if(!req.session.sc){
        sc = new ShoppingCart();
    } else{
        sc = ShoppingCart.deserialize(req.session.sc);
    }
    const _id = req.body._id;
    const title = req.body.title;
    const price = req.body.price;
    sc.add({_id, title, price});

    req.session.sc = sc.serialize();
    console.log(sc)

    res.redirect('/showcart');
})

app.get('/showcart', (req, res)=>{
    let sc;
    if(!req.session.sc){
        sc = new ShoppingCart();
    }else {
        sc = ShoppingCart.deserialize(req.session.sc);
    }
    res.render('showcart',{sc,utils})
})


app.get('/revenue', (req, res) => {
    let sc;
    if(!req.session.sc){
        sc = new ShoppingCart();
    }else {
        sc = ShoppingCart.deserialize(req.session.sc);
    }
    res.render('revenue',{sc,utils})    })



app.get('/signup', (req, res)=>{
    res.render('signup', {flash_message: req.flash('flash_message')});
})

app.post('/signup', passConfig.passport.authenticate(
    'signupStrategy',
    {successRedirect: '/', failureRedirect: '/signup', failureFlash: true}
));

app.get('/home',(req, res) => {
    res.render('home', {user: req.user})
})

app.get('/checkout', auth, (req, res)=>{
    res.render('checkout', {user: req.user} )
})

app.get('/succeed', auth, (req, res)=>{
    res.render('succeed', {user: req.user} )
})


app.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
})

app.get('/profile', auth, (req, res) => {
    res.render('profile', {user: req.user})
})

function auth(req, res, next) {
    const user = req.user;
    // const user = req.session.user;
    if (!user) {
        res.render('401')
    } else {
        next();
    }
}