const crypto = require ('crypto')

function hashPassword(tpassword){
    //random string as chars for salf (length = 16)
    const len = 16;
    const salt = crypto.randomBytes(len/2).toString('hex');

    //SHA512 hash algorithm
    const hash = crypto.createHmac('sha512', salt)
    hash.update(tpassword);
    const hashed = hash.digest('hex')

    return {salt, hashed}
}

function verifyPassword(tpassword, user){
    const hash = crypto.createHmac('sha512', user.password.salt)
    hash.update(tpassword);
    const tpasswordHashed = hash.digest('hex')

    return tpasswordHashed == user.password.hashed;
}


module.exports = {hashPassword, verifyPassword}


//const p1 = 'password';
 //const hp1 = hashPassword(p1);
 //console.log(hp1);

 //const salt = 'e5585a7c5318586c'
//const hashed ='d06ca370ea25832de36d05200ca792d05a103b7f776013e9747bda24a303b91ab7592befbfa20f4e9b1ee962f3c4fee176dd0fa27453112f6264c11cf0fc05b7'
//const user = {password: {salt, hashed}}

//console.log('verify', verifyPassword('password', user))