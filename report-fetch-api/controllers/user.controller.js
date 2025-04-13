import bcrypt from 'bcrypt'

import {
    pool } from '../config.js'

import {
    get_user_by_email,
    get_user_otp,
    delete_user_otp,
    insert_new_user,
    insert_new_user_otp,
    update_user_verified,
    insert_new_user_session,
    delete_user_session } from '../models/user.model.js'

export async function userSignIn(req, res) {
    const {email, password} = req.body

    let user
    try {
        get_user_by_email.values = [email]
        const res_get_user_by_email = await pool.query(get_user_by_email)
        user = res_get_user_by_email.rows[0]
    } catch(err) {
        return res.status(500).json({
            status: 'error',
            data: {
                msg: 'Unable to fetch user'
            }
        })
    }

    if (!user) {
        return res.status(400).json({
            status: 'fail',
            data: {
                msg: 'User not found'
            }
        })
    }

    const checkPass = await bcrypt.compare(password, user.password)
    if (!checkPass) {
        return res.status(400).json({
            status: 'fail',
            data: {
                msg: 'Incorrect password'
            }
        })
    }

    let newUSId
    try {
        // create new user session
        insert_new_user_session.values = [user.user_id]
        const res_insert_new_user_session = await pool.query(insert_new_user_session)
        newUSId = res_insert_new_user_session.rows[0]['us_id']
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            status: 'error',
            data: {
                msg: 'Session not created'
            }
        })
    }

    res.cookie('us_id', newUSId, {
        maxAge: 60000 * 60 * 24,
        httpOnly: true,
        secure: true,
        sameSite: true,
    })

    return res.status(200).json({
        status: 'success',
        data: {
            msg: 'User verified successfully!',
            user: { 
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                verified: user.verified
            }
        }
    })
}

export async function userSignUp(req, res) {
    const {first_name: firstName, last_name: lastName, email, password} = req.body

    try {
        get_user_by_email.values = [email]
        const res_get_user_by_email = await pool.query(get_user_by_email)
        const user = res_get_user_by_email.rows[0]
        if (user) {
            return res.status(403).json({
                status: 'fail',
                data: {
                    msg: 'User already exists'
                }
            })
        }
    } catch(err) {
        return res.status(500).json({
            status: 'error',
            data: {
                msg: 'Unable to validate user'
            }
        })
    }

    // capitalize first letters of the name
    const newFirstName = firstName.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    const newLastName = lastName.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    const hashedPassword = await bcrypt.hash(password, 13)

    let newUser
    const otp = Math.random().toString().slice(3,9)
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        // create user record
        insert_new_user.values = [newFirstName, newLastName, email, hashedPassword]
        const res_insert_new_user = await client.query(insert_new_user)
        newUser = res_insert_new_user.rows[0]

        // create otp record for email verification
        insert_new_user_otp.values = [newUser.user_id, otp]
        await client.query(insert_new_user_otp)

        // mail service
        console.log(newUser.user_id, otp)

        await client.query('COMMIT')
    } catch(err) {
        console.log(err)
        await client.query('ROLLBACK')

        return res.status(500).json({
            status: 'error',
            data: {
                msg: 'Unable to create user'
            }
        })
    } finally {
        client.release()
    }


    return res.status(200).json({
        status: 'success',
        data: {
            msg: 'User created successfully!',
            user: newUser 
        }
    })
}

export async function userVerifyEmail(req, res) {
    const {user_id: userId, otp} = req.body

    let userOTP
    try {
        get_user_otp.values = [userId]
        const res_get_user_otp = await pool.query(get_user_otp)
        userOTP = res_get_user_otp.rows[0]

        // otp verification
        if (!userOTP) {
            return res.status(400).json({
                status: 'fail',
                data: {
                    msg: 'User OTP not found'
                }
            })
        }

        if ((new Date().getTime - new Date(userOTP.created_at).getTime) <  60000 * 10) {
            return res.status(400).json({
                status: 'fail',
                data: {
                    msg: 'Invalid OTP'
                }
            })
        }

        if (userOTP.otp !== otp) {
            return res.status(400).json({
                status: 'fail',
                data: {
                    msg: 'Incorrect OTP'
                }
            })
        }

        delete_user_otp.values = [userId]
        await pool.query(delete_user_otp)
    } catch(err) {
        return res.status(500).json({
            status: 'error',
            data: {
                msg: 'Unable to verify OTP'
            }
        })
    }

    let user
    let newUSId
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        // verify user email
        update_user_verified.values = [userId]
        const res_update_user_verified = await client.query(update_user_verified)
        user = res_update_user_verified.rows[0]
        if (!user) {
            return res.status(400).json({
                status: 'fail',
                data: {
                    msg: 'User not found',
                }
            })
        }

        // create new user session
        insert_new_user_session.values = [user.user_id]
        const res_insert_new_user_session = await client.query(insert_new_user_session)
        newUSId = res_insert_new_user_session.rows[0]['us_id']

        await client.query('COMMIT')
    } catch(err) {
        console.log(err)
        await client.query('ROLLBACK')

        return res.status(500).json({
            status: 'error',
            data: {
                msg: 'Unable to verify user'
            }
        })
    } finally {
        client.release()
    }

    res.cookie('us_id', newUSId, {
        maxAge: 60000 * 60 * 24,
        httpOnly: true,
        secure: true,
        sameSite: true,
    })

    return res.status(200).json({
        status: 'success',
        data: {
            msg: 'User verified successfully!',
            user: { 
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                verified: user.verified
            }
        }
    })
}

export async function userSignOut(req, res) {
    const {us_id: usId} = req.cookies

    try{
        delete_user_session.values = [usId]
        await pool.query(delete_user_session)
    } catch {
        return res.status(500).json({
            status: 'error',
            data: {
                'msg': 'Sign out failed'
            }
        })
    }

    res.clearCookie('us_id')
    
    return res.status(200).json({
        status: 'success',
        data: {
            msg: 'Signed out successfully!'
        }
    })
}
