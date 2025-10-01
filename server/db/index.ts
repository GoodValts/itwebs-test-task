import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
	connectionString: getDbUrl(),
});

export const db = drizzle(pool);
