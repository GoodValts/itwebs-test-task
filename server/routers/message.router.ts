import { on } from 'events';
import { db } from '@server/db';
import { tableMessage } from '@server/db/tables';
import { chatEvents } from '@server/realtime/events';
import { messageSchema } from '@server/validatiion/message.schema';
import { asc } from 'drizzle-orm';

import { createTRPCRouter, publicProcedure } from '../trpc';

export const messageRouter = createTRPCRouter({
	list: publicProcedure.query(async () => {
		return db.select().from(tableMessage).orderBy(asc(tableMessage.created));
	}),

	insert: publicProcedure.input(messageSchema).mutation(async ({ input }) => {
		const res = await db
			.insert(tableMessage)
			.values({
				text: input.text,
				fileUrl: input.fileUrl,
				name: input.name,
			})
			.returning();
		const inserted = res?.[0];
		if (inserted) chatEvents.emit('message:new', inserted);
		return res;
	}),

	onMessage: publicProcedure.subscription(async function* (opts) {
		for await (const [payload] of on(chatEvents, 'message:new', { signal: opts.signal })) {
			yield payload;
		}
	}),
});
