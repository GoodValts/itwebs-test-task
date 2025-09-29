import styles from './loader.module.scss';

export const Loader = () => {
	return (
		<div className={styles.container}>
			{Array.from({ length: 5 }).map((_, idx) => (
				<span
					key={idx}
					className={styles.dot}
					style={{
						scale: 1 - idx / 10,
						opacity: 1 - idx / 10,
						transform: `translate(${16 / (1 - idx / 10)}px)`,
						rotate: `${idx * 45}deg`,
					}}
				/>
			))}
		</div>
	);
};
