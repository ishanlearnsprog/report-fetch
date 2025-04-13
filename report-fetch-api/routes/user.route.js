import express from 'express'

import {
    userSignUp,
    userVerifyEmail,
    userSignIn,
    userSignOut
} from '../controllers/user.controller.js'

import {
    validateEmail,
    validatePassword } from '../utils.js'

const router = express.Router()

router.post('/signup', (req, res, next) => {
    const {email, password} = req.body

    if (!validateEmail(email)) {
        return res.status(400).json({
            status: 'fail',
            data: {
                msg: 'Invalid email'
            }
        })
    }

    if (!validatePassword(password)) {
        return res.status(400).json({
            status: 'fail',
            data: {
                msg: 'Invalid password, please check the rules'
            }
        })
    }

    next()
}, userSignUp)

router.post('/verify', (req, res, next) => {
    const {otp} = req.body

    if (otp.length !== 6) {
        return res.status(400).json({
            status: 'fail',
            data: {
                msg: 'OTP should have 6 characters'
            }
        })
    }
    
    next()
}, userVerifyEmail)

router.post('/signin', (req, res, next) => {
    const {email, password} = req.body

    if (!validateEmail(email)) {
        return res.status(400).json({
            status: 'fail',
            data: {
                msg: 'Invalid email'
            }
        })
    }

    if (!validatePassword(password)) {
        return res.status(400).json({
            status: 'fail',
            data: {
                msg: 'Invalid password'
            }
        })
    }

    next()
}, userSignIn)
router.post('/signout', userSignOut)

export default router
