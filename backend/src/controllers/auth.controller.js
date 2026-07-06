const userModel = require("../models/user.model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const blacklistTokenModel = require("../models/blacklist.model")
const sessionModel = require('../models/session.model')
const mongoose = require('mongoose')
const sendEmail = require('../services/email.service')
const { generateOTP, getOtpHtml } = require('../utils/utils')
const otpModel = require('../models/otp.model')
const config = require('../config/config')

/**
 * @name registerUserController
 * @description register a new user, expects username,email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username,email and password"
            })
        }
        const isUserAlreadyExits = await userModel.findOne({
            $or: [{ email }, { username }]
        })
        if (isUserAlreadyExits) {

            return res.status(400).json({
                message: "Account already exits with this email address or username"
            })
        }
        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash,
        })

        const otp = generateOTP()
        const html = getOtpHtml(otp)
        const otpHash = await bcrypt.hash(otp, 10)

        await otpModel.create({
            email,
            user: user._id,
            otpHash
        })

        await sendEmail(email, 'OTP Verification', `Your OTP code is ${otp}`, html)

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error during registration",
            error: err.message
        })
    }
}

/**
 * @name loginUserController
 * @description login a user,expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }
        if (!user.verified) {
            return res.status(401).json({
                message: "Email not verified"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const sessionId = new mongoose.Types.ObjectId()

        const refreshToken = jwt.sign({
            id: user._id,
            sessionid: sessionId
        }, config.JWT_SECRET,
            {
                expiresIn: '7d'
            })

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10)

        const session = await sessionModel.create({
            _id: sessionId,
            user: user._id,
            refreshTokenHash: refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        })

        const accessToken = jwt.sign({
            id: user._id,
            sessionid: session._id,
        }, config.JWT_SECRET, {
            expiresIn: "15m"
        })

        res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            accessToken
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error during login",
            error: err.message
        })
    }
}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add token in blacklist
 * @access Public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token

    if (token) {
        try {
            await blacklistTokenModel.create({
                token
            })
        } catch (e) {
            console.error("Failed to blacklist token:", e)
        }

        res.clearCookie('token')
    }

    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }

    try {
        const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

        const session = await sessionModel.findOne({
            _id: decoded.sessionid,
            revoked: false
        })
        if (session) {
            session.revoked = true
            await session.save()
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })

        res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (err) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }
}

/**
 * @name getMeController
 * @description get the current logged in user details
 * @access
 */
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id)
    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function verifyEmailController(req, res) {
    try {
        const { otp, email } = req.body

        // 1. Find OTP document by email (get the latest one)
        const otpDoc = await otpModel.findOne({ email }).sort({ createdAt: -1 })

        if (!otpDoc) {
            return res.status(400).json({
                message: "Invalid or expired OTP"
            })
        }

        // 2. Compare user's OTP input with stored bcrypt hash
        const isMatch = await bcrypt.compare(otp, otpDoc.otpHash)
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid OTP"
            })
        }

        // 3. Update the user and get the updated document
        const user = await userModel.findByIdAndUpdate(
            otpDoc.user,
            { verified: true },
            { new: true }
        )

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        // 4. Clean up OTP records for this user
        await otpModel.deleteMany({
            user: otpDoc.user
        })

        // 5. Send successful response
        return res.status(200).json({
            message: "Email verified successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error during email verification",
            error: err.message
        })
    }
}

async function refreshTokenController(req, res) {
    const token = req.cookies.refreshToken

    if (!token) {
        return res.status(401).json({
            message: "refresh token not found"
        })
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET)
        const session = await sessionModel.findOne({
            _id: decoded.sessionid, revoked: false
        })
        if (!session) {
            return res.status(401).json({
                message: "Invalid refresh token"
            })
        }
        const isMatch = await bcrypt.compare(token, session.refreshTokenHash)
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid token"
            })
        }
        const accessToken = jwt.sign({
            id: decoded.id,
            sessionid: session._id
        }, config.JWT_SECRET, {
            expiresIn: '15m'
        })

        const newRefreshToken = jwt.sign({
            id: decoded.id,
            sessionid: session._id
        }, config.JWT_SECRET, {
            expiresIn: '7d'
        })

        const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10)
        session.refreshTokenHash = newRefreshTokenHash
        await session.save()

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000  //7days
        })
        res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken
        })
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired refresh token"
        })
    }
}

async function logoutAllUserController(req, res) {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh token not found"
        })
    }

    try {
        const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

        await sessionModel.updateMany({
            user: decoded.id,
            revoked: false
        }, {
            revoked: true
        })

        res.clearCookie('refreshToken')
        res.status(200).json({
            message: "Logged out from all devices successfully"
        })
    } catch (err) {
        res.clearCookie('refreshToken')
        return res.status(401).json({
            message: "Invalid or expired refresh token"
        })
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    verifyEmailController,
    refreshTokenController,
    logoutAllUserController
}