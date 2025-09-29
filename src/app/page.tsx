import Link from 'next/link';

import styles from './page.module.scss';

export default function Home() {
	const links = ['CSR', 'SSR', 'SSG', 'ISR'];

	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<div className={styles.container}>
					{links.map((el) => (
						<Link href={el.toLowerCase()} className={styles.link} key={el}>
							{el}
						</Link>
					))}
				</div>
			</main>
		</div>
	);
}
