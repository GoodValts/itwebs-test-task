'use client';

import { useState } from 'react';
import { MessageCircleMore, MessageCircleX } from 'lucide-react';

import { Button } from '../ui/button/button';
import styles from './chat.module.scss';

export const Chat = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={styles.container}>
			<Button className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
				{isOpen ? <MessageCircleX size={16} /> : <MessageCircleMore size={16} />}
				<p>{isOpen ? 'Close' : 'Chat'}</p>
			</Button>
			{isOpen && <div className={styles.content}>content</div>}
		</div>
	);
};
