import { applyCors } from '@server/cors';
import { appRouter } from '@server/router';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = async (req: Request) => {
	console.log(`incoming request ${req.url}`);

	const res = await fetchRequestHandler({
		endpoint: '/api/trpc',
		req,
		router: appRouter,
	});

	applyCors(res);

	return res;
};

const preflightHandler = async () => {
	const res = new Response(null, { status: 204 });

	applyCors(res);
	return res;
};

export { handler as GET, handler as POST, preflightHandler as OPTIONS };
