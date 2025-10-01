import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const getDbUrl = () => {
	const dbUrl = process.env.DATABASE_URL;

	if (!dbUrl) throw new Error('no database url');

	return dbUrl;
};

const pool = new Pool({
	connectionString: getDbUrl(),
});

export const db = drizzle(pool);
