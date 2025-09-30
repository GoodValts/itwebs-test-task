import { Post } from '@/lib/types/posts';
import { PostCard } from '@/components/post-card/post-card';

import styles from './page.module.scss';

export const dynamic = 'force-static';

export default async function SSGPage() {
	const res = await fetch('https://jsonplaceholder.typicode.com/posts');
	if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

	const posts: Post[] = await res.json();

	return (
		<main className={styles.main}>
			<div className={styles.container}>
				{posts.map((el) => (
					<PostCard title={el.title} body={el.body} userId={el.userId} key={el.id} />
				))}
			</div>
		</main>
	);
}
