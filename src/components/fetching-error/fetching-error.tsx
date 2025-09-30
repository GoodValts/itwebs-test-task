import { Button } from '../ui/button/button';
import styles from './fetching-error.module.scss';

export const FetchingError = ({ code, message }: { code: number; message?: string }) => (
	<div className={styles.container}>
		<h2 className={styles.header}>Error {code}</h2>
		{message && <p className={styles.text}>{message}</p>}
		<Button variant="destructive" onClick={() => window.location.reload()}>
			Reload
		</Button>
	</div>
);
