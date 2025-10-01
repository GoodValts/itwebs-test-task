import 'dotenv/config';

import { defineConfig } from 'drizzle-kit';

export const getDbUrl = () => {
	const dbUrl = process.env.DATABASE_URL;

	if (!dbUrl) throw new Error('no database url');

	return dbUrl;
};

export default defineConfig({
	out: './server/db/migrations',
	schema: './server/db/tables.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: getDbUrl(),
	},
});
