import { db } from '@server/db';
import { tableMessage } from '@server/db/tables';
import { messageSchema } from '@server/validatiion/message.schema';

import { publicProcedure } from '../trpc';

export const messageRouter = {
	insert: publicProcedure.input(messageSchema).mutation(async (opts) => {
		const input = opts.input;

		const res = await db
			.insert(tableMessage)
			.values({
				text: input.text,
				fileUrl: input.fileUrl,
				name: input.name,
			})
			.returning();
		return res;
	}),
};
