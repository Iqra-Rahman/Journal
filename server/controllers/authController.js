import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const register = async(req, res) => {
    const{name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.json({success: false, message: 'All fields are required'});
    }

    try {
        const existingUser = await userModel.findOne({email});
        if(existingUser) {
            return res.json({success: false, message: 'User already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({name, email, password: hashedPassword});

        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Daily Journal',
            text: `Hello ${name},\n\nThank you for registering at Daily Journal! We're excited to have you on board.\n\nBest regards,\nThe Daily Journal Team`
        };

        await transporter.sendMail(mailOptions);

        res.cookie('token', token, {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none':'strict', maxAge: 7*24*60*60*1000});

        return res.json({success: true});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const login = async(req, res) => {
    const{email, password} = req.body;
    if(!email || !password) {
        return res.json({success: false, message: 'All fields are required'});
    }

    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success: false, message: 'User does not exist'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.json({success: false, message: 'Incorrect password'});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none':'strict', maxAge: 7*24*60*60*1000});
        return res.json({success: true, message: 'Login successful'});
        // localStorage.setItem("token", data.token);
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const logout = async(req, res) => {
    try {
        res.clearCookie('token', {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none':'strict'});
        return res.json({success: true, message: 'Logout successful'});
    } catch (error) {
        res.json({success: false, message: error.message});
    } 
}

export const sendVerifyOtp = async(req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if(user.isAccountVerified){
            return res.json({success: false, message: 'Account is already verified'});
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day from now
        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Your Verification OTP',
            // text: `Hello ${user.name},\n\nYour OTP for account verification is: ${otp}\nThis OTP is valid for 24 hours.\n\nBest regards,\nThe Daily Journal Team`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}")
        };
        await transporter.sendMail(mailOptions);
        res.json({success: true, message: 'OTP sent to your email'});


    } catch (error) {
       res.json({success: false, message: error.message}); 
    }
}


export const verifyEmail = async(req, res) => {
    const {otp} = req.body;
    const userId = req.userId;
    if(!userId || !otp) {
        return res.json({success: false, message: 'All fields are required'});
    }
    try {
        const user = await userModel.findById(userId);
        if(!user) {
            return res.json({success: false, message: 'User does not exist'});
        }
        if(user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({success: false, message: 'Invalid OTP'});
        }
        if(user.verifyOtpExpireAt < Date.now()) {
            return res.json({success: false, message: 'OTP has expired'});
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();
        return res.json({success: true, message: 'Email verified successfully'});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }

}

export const isAuthenticated = async(req, res) => {
    try {
        return res.json({success: true});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const sendResetOtp = async(req, res) => {
    const {email} = req.body;
    if(!email) {
        return res.json({success: false, message: 'Email is required'});
    }

    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success: false, message: 'User does not exist'});
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Your Password Reset OTP',
            // text: `Hello ${user.name},\n\nYour OTP for password reset is: ${otp}\nThis OTP is valid for 15 minutes.\n\nBest regards,\nThe Daily Journal Team`,
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}")
        };
        await transporter.sendMail(mailOptions);
        return res.json({success: true, message: 'OTP sent to your email'});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}


export const resetPassword = async(req, res) => {
    const {email, otp, newPassword} = req.body;
    if(!email || !otp || !newPassword) {
        return res.json({success: false, message: 'All fields are required'});
    }

    try {
        
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success: false, message: 'User does not exist'});
        }
        if(user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({success: false, message: 'Invalid OTP'});
        }

        if(user.resetOtpExpireAt < Date.now()) {
            return res.json({success: false, message: 'OTP has expired'});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();
        return res.json({success: true, message: 'Password reset successful'});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}
    

