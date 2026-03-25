const User = require("../models/User");
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    try {
        const {name, email, password, companyId} = req.body;

        const userExit = await User.findOne({ email });

        if(userExit){
            return res.status(400).json({ message:"User already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const user = await User.create({name, email, password : hashedPass, companyId});

        res.status(201).json({
            message:"User created successfully.",
            data:user
        });
    } catch(error){
        res.status(500).json({error:error.message});
    }
};

module.exports = { registerUser}