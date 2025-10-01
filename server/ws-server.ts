import { createServer } from 'http';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';

import { appRouter } from './router';

const port = Number(process.env.WS_PORT ?? 3001);

const server = createServer();
const wss = new WebSocketServer({ server });

const handler = applyWSSHandler({ wss, router: appRouter });

server.listen(port, () => {
	console.log(`🚀 tRPC WebSocket server listening on ws://localhost:${port}`);
});

process.on('SIGTERM', () => {
	console.log('SIGTERM');
	handler.broadcastReconnectNotification();
	wss.close();
	server.close();
});
