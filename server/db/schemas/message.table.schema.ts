import { bigserial, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const pgMessagesSchema = pgTable('messages', {
	messageId: bigserial('message_id', { mode: 'bigint' }).primaryKey(),
	name: text().notNull(),
	text: text(),
	fileUrl: text('file_url'),
	created: timestamp().notNull().defaultNow(),
	updated: timestamp(),
});
