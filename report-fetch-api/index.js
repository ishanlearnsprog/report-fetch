import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { 
    checkRequiredEnvVars,
    checkPgConnection,
    setupRFDatabase
} from './config.js'

import { router } from './routes/index.js'

// checks before server start
checkRequiredEnvVars()
checkPgConnection()
setupRFDatabase()

const app = express()

app.use(bodyParser.json({extended: true, limit: '50mb'}))
app.use(bodyParser.urlencoded({}))
app.use(cors())

app.use('/', router)

const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`API running on port: ${port}`)
})
