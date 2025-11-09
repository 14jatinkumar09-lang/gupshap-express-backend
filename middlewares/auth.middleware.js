import jwt from 'jsonwebtoken'

export async function auth (req,res,next) {


    const token = req.headers.authorization ;

    if(!token.split(" ")[0] === "Bearer") {
        return res.json({
            message : "invalid token"
        })
    }

    const validate = await jwt.verify(token.split(" ")[1] , process.env.JWT_SECRET) ;

    req._id = validate._id ;

    if(!validate) {
        return res.status(402).json({
            message : "session expired"
        })
    }
    next () ;

}




