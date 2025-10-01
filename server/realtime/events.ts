import { EventEmitter } from 'events';

type ChatEvents = {
	'message:new': (payload: unknown) => void;
};

class TypedEventEmitter extends EventEmitter {
	emit<T extends keyof ChatEvents>(event: T, ...args: Parameters<ChatEvents[T]>): boolean {
		return super.emit(event as string, ...args);
	}
	on<T extends keyof ChatEvents>(event: T, listener: ChatEvents[T]): this {
		return super.on(event as string, listener);
	}
	off<T extends keyof ChatEvents>(event: T, listener: ChatEvents[T]): this {
		return super.off(event as string, listener);
	}
}

export const chatEvents = new TypedEventEmitter();
