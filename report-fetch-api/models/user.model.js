export const get_user_by_email = {
    name: 'get_user_by_email',
    text: 'SELECT user_id, first_name, last_name, email, password, verified from "user" WHERE email = $1',
    values: null
}

export const get_user_otp = {
    name: 'get_user_otp',
    text: 'SELECT user_id, otp, created_at FROM "user_otp" WHERE user_id = $1',
    values: null
}

export const delete_user_otp = {
    name: 'delete_user_otp',
    text: 'DELETE FROM "user_otp" WHERE user_id = $1',
    values: null
}

export const insert_new_user = {
    name: 'insert_new_user',
    text: 'INSERT INTO "user" (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING user_id',
    values: null
}

export const insert_new_user_otp = {
    name: 'insert_new_user_otp',
    text: 'INSERT INTO "user_otp" (user_id, otp) VALUES ($1, $2)',
    values: null
}


export const update_user_verified = {
    name: 'update_user_verified',
    text: 'UPDATE "user" SET verified = true WHERE user_id = $1 RETURNING user_id, first_name, last_name, email, verified',
    values: null
}

export const insert_new_user_session = {
    name: 'insert_new_user_session',
    text: 'INSERT INTO "user_session" (user_id) VALUES ($1) RETURNING us_id',
    values: null
}

export const delete_user_session = {
    name: 'delete_user_session',
    text: 'DELETE FROM "user_session" WHERE us_id = $1',
    values: null,
}
