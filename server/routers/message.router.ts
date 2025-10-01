import { messageSchema } from '@server/validatiion/message.schema';

import { publicProcedure } from '../trpc';

export const messageRouter = {
	insert: publicProcedure.input(messageSchema).mutation(async (opts) => {
		return opts.input;
	}),
};
