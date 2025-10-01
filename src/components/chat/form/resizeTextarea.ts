import { RefObject } from 'react';

export const resizeTextarea = (textareaRef: RefObject<HTMLTextAreaElement | null>) => {
	const textarea = textareaRef.current;
	if (!textarea) return;

	textarea.style.height = 'auto';

	const styles = window.getComputedStyle(textarea);

	const lineHeight = parseFloat(styles.lineHeight);
	const paddingVertical = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);

	const minHeight = lineHeight * 1 + paddingVertical;
	const maxHeight = lineHeight * 5 + paddingVertical;

	textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)}px`;

	textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
};
