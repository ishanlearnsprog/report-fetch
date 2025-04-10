import express from 'express'

import userRouter from './user.route.js'

export const router = express.Router()

router.use('/user', userRouter)

router.get('/', (req, res) => {
    return res.status(200).json({'message': 'you have reached report-fetch-api-v0'})
})
