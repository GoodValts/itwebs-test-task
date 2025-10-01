import { headers } from 'next/headers';

const allowedOrigins: RegExp[] = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000')
	.split(';')
	.map((regex: string) => new RegExp(regex));

export const applyCors = async (res: Response) => {
	const headersList = await headers();

	const originHeader = headersList.get('origin');
	const fallbackDevOrigin =
		process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : false;

	const origin = originHeader ?? fallbackDevOrigin;

	const match = origin && allowedOrigins.some((regex) => regex.test(origin));
	console.log(`applyCors: origin ${origin}, match ${match}`);

	if (match) res.headers.set('Access-Control-Allow-Origin', origin);

	res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.headers.set('Access-Control-Allow-Headers', 'content-type, user-agent');
	res.headers.set('Access-Control-Allow-Credentials', 'true');
};
