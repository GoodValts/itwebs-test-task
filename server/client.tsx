'use client';

import { useState } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCReact, createWSClient, wsLink } from '@trpc/react-query';
import superjson from 'superjson';

import { makeQueryClient } from './query-client';
import type { AppRouter } from './router';

export const trpc = createTRPCReact<AppRouter>();

let clientQueryClientSingleton: QueryClient;

function getQueryClient() {
	if (typeof window === 'undefined') {
		return makeQueryClient();
	}

	return (clientQueryClientSingleton ??= makeQueryClient());
}

function getWsUrl() {
	if (typeof window !== 'undefined') {
		const env = process.env.NEXT_PUBLIC_WS_URL;
		if (env) return env;
		const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
		return `${protocol}://${location.hostname}:3001`;
	}

	const env = process.env.NEXT_PUBLIC_WS_URL ?? process.env.WS_URL;
	return env ?? 'ws://localhost:3001';
}

export function TRPCProvider(
	props: Readonly<{
		children: React.ReactNode;
	}>
) {
	const queryClient = getQueryClient();

	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				wsLink({
					client: createWSClient({ url: getWsUrl() }),
					transformer: superjson,
				}),
			],
		})
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
		</trpc.Provider>
	);
}
