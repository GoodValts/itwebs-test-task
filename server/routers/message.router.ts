import { messageSchema } from '@server/schemas/message.schema';

import { publicProcedure } from '../trpc';

export const messageRouter = {
	insert: publicProcedure.input(messageSchema).mutation(async (opts) => {
		return opts.input;
	}),
};
