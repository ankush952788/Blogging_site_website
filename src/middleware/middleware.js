const jwt =require ("jsonwebtoken");

let mid1 = function (req, res, next){

    let token = req.headers["x-Auth-token"];
    console.log(token)

    if (!token) token = req.headers["x-auth-token"];

    if(!token) return res.send({status:false , msg:"Token must be present"})

    let decodedToken = jwt.verify(token,"Project-1")

    if(!decodedToken) return res.send({msg:"Token is invalid"})

    console.log(decodedToken)

    next()

}

module.exports.mid1 = mid1
