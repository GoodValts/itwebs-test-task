'use client';

import styles from './button.module.scss';

type Variants = 'default' | 'destructive';

export const Button = ({
	className,
	variant = 'default',
	...props
}: React.ComponentProps<'button'> & {
	className?: string;
	variant?: Variants;
}) => {
	const decorator: Record<Variants, string | undefined> = {
		default: undefined,
		destructive: styles.buttonDestructive,
	};

	return (
		<button
			className={[styles.button, decorator[variant], className].filter(Boolean).join(' ')}
			{...props}
		/>
	);
};
