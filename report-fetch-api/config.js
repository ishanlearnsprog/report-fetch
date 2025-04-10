import dotenv from 'dotenv'
dotenv.config()

import pg from 'pg'

import {
    envRequiredVars,
    databaseTypes,
    roleTypes } from './constants.js'

import {
    table_role_type,
    default_role_type,
    get_role_types,
    table_db_type,
    default_db_type,
    get_db_types,
    table_user,
    table_project,
    table_access,
    table_connection,
    table_report } from './models/index.js'

// environment variables
export function checkRequiredEnvVars() {
    const notFoundVars = envRequiredVars.filter(envVar => !process.env[envVar])

    if (notFoundVars.length != 0) {
        throw new Error(`Missing environment variables: ${notFoundVars.join(' ')}`)
    }
}

// postgres database
const { Pool } = pg

export const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
})

export async function checkPgConnection() {
    const result = await pool.query('SELECT $1::text as name', ['report_fetch'])
    if (result.rows[0].name !== 'report_fetch') {
        throw new Error('Cannot connect to PG database')
    }
}

export async function setupRFDatabase() {
    try {
        await pool.query(table_role_type)

        // check for default role types in role_type
        const res_get_role_types = await pool.query(get_role_types)
        const existingRoleTypes = res_get_role_types.rows

        let run_default_role_type = false
        for (let role of existingRoleTypes) {
            if (roleTypes.includes(role.role_type_id) === false) {
                run_default_role_type = true
                break
            }
        }

        if (run_default_role_type === true) {
            await pool.query(default_role_type)
        }

        await pool.query(table_db_type)

        // check for default database types in db_type
        const res_get_db_types = await pool.query(get_db_types)
        const existingDatabaseTypes = res_get_db_types.rows

        let run_default_db_type = false
        for (let database of existingDatabaseTypes) {
            if (databaseTypes.includes(database.db_type_id) === false) {
                run_default_db_type = true
                break
            }
        }

        if (run_default_db_type === true) {
            await pool.query(default_db_type)
        }

        await pool.query(table_user)
        await pool.query(table_project)
        await pool.query(table_access)
        await pool.query(table_connection)
        await pool.query(table_report)
        console.log('DB Setup Complete')
    } catch (err) {
        console.log(err)
    }
}
