import { Post } from '@/lib/types/posts';

import styles from './post-card.module.scss';

export const PostCard = ({ title, body }: Omit<Post, 'id'>) => {
	return (
		<div className={styles.container}>
			<h3 className={styles.title}>{title}</h3>
			<div className={styles.bodyContainer}>
				{body.split('\n').map((el, idx) => (
					<p className={styles.paragraph} key={idx}>
						{body}
					</p>
				))}
			</div>
		</div>
	);
};
