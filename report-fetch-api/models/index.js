export const table_role_type = `
    CREATE TABLE IF NOT EXISTS "role_type" (
        role_type_id TEXT PRIMARY KEY
    );`

export const get_role_types = `SELECT * FROM "role_type";`

export const default_role_type = `
    INSERT INTO "role_type" (role_type_id)
    VALUES
    ('ADMIN'),
    ('CREATOR'),
    ('VIEWER');`

export const table_db_type = `
    CREATE TABLE IF NOT EXISTS "db_type" (
        db_type_id TEXT PRIMARY KEY
    );`

export const get_db_types = `SELECT * FROM "db_type";`

export const default_db_type = `
    INSERT INTO "db_type" (db_type_id)
    VALUES
    ('POSTGRES');`

export const table_user = `
    CREATE TABLE IF NOT EXISTS "user" (
        user_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        first_name varchar(100) NOT NULL,
        last_name varchar(50) NOT NULL,
        email varchar(254) NOT NULL UNIQUE,
        password varchar(60) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`

export const table_project = `
    CREATE TABLE IF NOT EXISTS "project" (
        project_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        name varchar(50) NOT NULL,
        created_by uuid REFERENCES "user" (user_id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`

export const table_access = `
    CREATE TABLE IF NOT EXISTS "access" (
        user_id uuid REFERENCES "user" (user_id),
        project_id uuid REFERENCES "project" (project_id),
        role_type_id TEXT REFERENCES "role_type" (role_type_id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(user_id, project_id)
    );`

export const table_connection = `
    CREATE TABLE IF NOT EXISTS "connection" (
        connection_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        project_id uuid REFERENCES "project" (project_id),
        db_type_id TEXT REFERENCES "db_type" (db_type_id),
        name varchar(30) NOT NULL UNIQUE,
        connection_uri TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`

export const table_report = `
    CREATE TABLE IF NOT EXISTS "report" (
        report_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        project_id uuid REFERENCES "project" (project_id),
        connection_id uuid REFERENCES "connection" (connection_id),
        name varchar(50) NOT NULL UNIQUE,
        query TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
