import { z } from 'zod';

import { messageRouter } from './routers/message.router';
import { createTRPCRouter, publicProcedure } from './trpc';

export const appRouter = createTRPCRouter({
	test: publicProcedure
		.input(
			z.object({
				text: z.string(),
			})
		)
		.query((opts) => {
			return `test ${opts.input.text}`;
		}),
	message: messageRouter,
});

export type AppRouter = typeof appRouter;
