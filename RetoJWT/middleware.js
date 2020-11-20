const jwt = require("jsonwebtoken");
const config = require("./config");

const checkJWT = (req, res, next) => {
    let tk = req.headers["x-access-token"] || req.headers["authorization"];
    if (tk) {
        if (tk.startsWith("Bearer ")) {
            tk = tk.slice(7, tk.length);
            jwt.verify(tk, config.secret, (err, decoded) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: "Auth token is invalid",
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.send({
                success: true,
                message: "Auth token is incorrect!",
            });
        }
    } else {
        req.decoded = {
            username: undefined,
            rol: "none",
        };
        
        // res.json({
        //     success: false,
        //     message: "Auth token was not sent",
        // });

        next();
    }
};

module.exports = {
    checkJWT,
};
