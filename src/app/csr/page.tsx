'use client';

import { useEffect, useState } from 'react';

import { Post } from '@/lib/types/posts';
import { FetchingError } from '@/components/fetching-error/fetching-error';
import { PostCard } from '@/components/post-card/post-card';

import styles from './page.module.scss';

export default function CSR() {
	const [data, setData] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<{ code: number; message: string } | null>(null);

	useEffect(() => {
		(async () => {
			const res = await fetch('https://jsonplaceholder.typicode.com/posts');

			if (!res.ok) {
				setError({
					code: res.status,
					message: res.statusText,
				});
				return;
			}

			setData(await res.json());
		})();
	}, []);

	return (
		<main className={styles.main}>
			{error ? (
				<FetchingError code={error.code} message={error.message} />
			) : (
				<div className={styles.container}>
					{data.map((el) => (
						<PostCard title={el.title} body={el.body} userId={el.userId} key={el.id} />
					))}
				</div>
			)}
		</main>
	);
}
