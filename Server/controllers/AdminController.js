const Admin =require('../models/AdminModel')
const login = (req, res) => {
    
    const { userid, password } = req.body;

    if (userid === "admin@123") {
        if (password === "admin@123") {
            return res.json({ status: 200, msg: "Login Successful" });
        }
        return res.json({ status: 405, msg: "Password Mismatch" });
    }

    Admin.findOne({ userid })
        .then(user => {
            if (!user) {
                return res.json({ status: 405, msg: "invalid User" });
            }
        })
        .catch(err => {
            console.error(err);
            res.json({ status: 500, msg: "Something went wrong" });
        });
};


module.exports = { login };