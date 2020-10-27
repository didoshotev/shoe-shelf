const env = process.env.NODE_ENV || 'development';

const User = require('../models/user');
const crudAPI = require('./crudAPI');
const jwt = require('jsonwebtoken');
const config = require('../config/config')[env];
const bcrypt = require('bcrypt');


const generateToken = (data) => {
    const token = jwt.sign(data, config.privateKey);
    return token;
}

const registerUser = async (req, res) => {
    const { email, fullName, password, rePassword } = req.body;
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const user = new User({
        email,
        fullName,
        password: hashedPassword
    })
    const userObject = await user.save();
    try {
        if (!user) {
            return
        }
    } catch (err) {
        return {
            message: 'Invalid credentialssss',
            fullErrorMsg: err.message,
            status: false
        }
    }
    const token = generateToken({
        fullName: userObject.fullName,
        userID: userObject._id
    });
    res.cookie('aid', token);
    return {
        status: true
    }
};

const verifyUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userObject = await User.findOne({ email: email });
        if (!userObject) {
            throw new TypeError('No such User')
        }
        // bvrypt compate here
        const passwordStatus = await bcrypt.compare(password, userObject.password)
        console.log(passwordStatus);
        if (passwordStatus === false) {
            throw new TypeError('Invalid Password')
        }
        const token = generateToken({
            fullName: userObject.fullName,
            userID: userObject._id,
        });
        res.cookie('aid', token);

    } catch (err) {
        return {
            message: err.message,
            status: false
        }
    }
    return {
        status: true,
    }
}

const getUserStatus = (req, res, next) => {
    try {
        const token = req.cookies['aid'];
        if (!token) {
        }
        const tokenStatus = jwt.verify(token, config.privateKey)
        if (!tokenStatus) {
            req.isLoggedIn = false;
        } else {
            req.isLoggedIn = true;
            req.userFullName = tokenStatus.fullName
        }
    } catch (err) {
        req.isLoggedIn = false;
    }
    next();
}

const authAccess = (req, res, next) => {
    const token = req.cookies['aid'];
    if (!token) {
        return res.redirect('/');
    }

    try {
        jwt.verify(token, config.privateKey);
        next()
    } catch (err) {
        res.redirect('/');
    };
};

const guestAccess = (req, res, next) => {
    const token = req.cookies['aid'];
    if (token) {
        return res.redirect('/')
    }
    next();
};



module.exports = {
    registerUser,
    verifyUser,
    getUserStatus,
    authAccess,
    guestAccess,
}