import Image from 'next/image';
import { AppRouter } from '@server/router';
import { inferRouterOutputs } from '@trpc/server';
import { format } from 'date-fns';

import { useName } from '@/lib/name-provider';

import styles from './message.module.scss';

export const Message = ({
	message,
}: {
	message: inferRouterOutputs<AppRouter>['message']['list'][number];
}) => {
	const { name } = useName();

	return (
		<div className={`${styles.container} ${name === message.name && styles.right}`.trim()}>
			{name !== message.name && <p className={styles.name}>{message.name}</p>}
			{message.text?.split('\n').map((el, idx) => (
				<p className={`${styles.text} ${name === message.name && styles.right}`.trim()} key={idx}>
					{el}
				</p>
			))}
			{message.fileUrl && (
				<Image
					src={message.fileUrl}
					alt="image"
					width={300}
					height={500}
					sizes="100vw"
					className={styles.image}
				/>
			)}
			<p className={styles.date}>{format(message.created, 'hh:mm dd:MM:yyyy')}</p>
			{message.updated && (
				<p className={styles.date}>{`(updated) ${format(message.updated, 'hh:mm dd:MM:yyyy')}`}</p>
			)}
		</div>
	);
};
