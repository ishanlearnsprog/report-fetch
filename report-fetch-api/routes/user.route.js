import express from 'express'

import {
    userSignIn
} from '../controllers/user.controller.js'

const router = express.Router()

router.post('/', userSignIn)

export default router
