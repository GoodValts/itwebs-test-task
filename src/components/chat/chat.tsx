'use client';

import { useEffect, useRef, useState } from 'react';
import { trpc } from '@server/client';
import { MessageCircleMore, MessageCircleX } from 'lucide-react';

import { useName } from '@/lib/name-provider';

import { Button } from '../ui/button/button';
import styles from './chat.module.scss';
import { ChatForm } from './form/form';
import { Message } from './message/message';

export const Chat = () => {
	const { name } = useName();
	const [isOpen, setIsOpen] = useState(false);

	const lastRef = useRef<HTMLDivElement>(null);

	const listMessages = trpc.message.list.useQuery();
	const utils = trpc.useUtils();

	trpc.message.onMessage.useSubscription(undefined, {
		onData(newMsg) {
			utils.message.list.setData(undefined, (prev) => (prev ? [...prev, newMsg] : [newMsg]));
		},
	});

	useEffect(() => {
		if (!(isOpen && lastRef.current)) return;

		lastRef.current?.focus({ preventScroll: true });
		lastRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
	}, [isOpen, name]);

	return (
		<div className={styles.container}>
			<Button className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
				{isOpen ? <MessageCircleX size={16} /> : <MessageCircleMore size={16} />}
				<p>{isOpen ? 'Close' : 'Chat'}</p>
			</Button>

			{isOpen && (
				<div className={styles.content}>
					{name && !!listMessages.data?.length && (
						<div className={styles.messages}>
							{(listMessages.data ?? []).map((el) => (
								<Message key={el.messageId} message={el} />
							))}
							<span ref={lastRef} />
						</div>
					)}

					{listMessages.error && <div className={styles.error}>failed to load</div>}

					<ChatForm />
				</div>
			)}
		</div>
	);
};
