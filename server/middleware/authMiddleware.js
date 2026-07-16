const jwt = require('jsonwebtoken');
const authMiddleware =  (req, res, next) =>{
    const authHead = req.headers.authorization;
    // console.log(req.headers);
    if (!authHead || !authHead.startsWith("Bearer ")) {
        return res.status(401).json({
            message:"Acess denied, No token provided"
        })
    }
    const token = authHead.split(" ")[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch (err){
        return res.status(401).json({
            message:"Acess denied, Invalid token"
        });
    }
};
module.exports = authMiddleware