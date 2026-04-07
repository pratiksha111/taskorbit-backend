const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
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

exports.loginUser = async (req, res)=> {
    {
        try {
            const {email, password} = req.body;

            //check user exsists
            const user = await User.findOne({ email});
            if(!user){
                return res.status(400).json({ message: "User not found."});
            }

            //compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(400).json({ message: "Invalid Credentials"});
            }

            //Generate Token
            const token = jwt.sign(
                { id: user._id, companyId: user.companyId},
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.json( { message:"Login Successful.", token});


        } catch(error){
            res.status(500).json({ message:error.message});
        }
    }
};