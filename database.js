const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const username = 'user'
const password = 'password'
const dbName='wsp'
const dbHost = 'localhost'
const dbPort = 27017;
const collectionName = 'mycustomers';
const productCollectionName = 'product';
const shoesCollectionName = 'shoes';


const dbUrl= `mongodb://${username}:${password}@${dbHost}:${dbPort}?authSource=${dbName}`;

let dbclient;
let customerCollection;
let productCollection;
let shoesCollection;

function startDBandApp(app, PORT){
    MongoClient.connect(dbUrl, {poolSize:30, useNewUrlParser: true})
        .then(client =>{
            dbclient = client;
            customerCollection = client.db(dbName).collection(collectionName);
            productCollection = client.db(dbName).collection(productCollectionName);
            shoesCollection = client.db(dbName).collection(shoesCollectionName);
            app.locals.customerCollection = customerCollection;
            app.locals.productCollection = productCollection;
            app.locals.shoesCollection = shoesCollection; 
            app.locals.imageCollection = client.db(dbName).collection('image');
            app.locals.ObjectID = ObjectID;
            app.listen(PORT, ()=>{
                console.log(`Server is running at port ${PORT}`)
            })
        })
        .catch(error =>{
            console.log(`Server is not running at port ${PORT}`)
        })
}

process.on('SIGNIT', () =>{
    dbclient.close();
    console.log('db connection closed by SIGINT')
    process.exit();
})

module.exports = {startDBandApp, ObjectID, customerCollection, productCollection, shoesCollection}