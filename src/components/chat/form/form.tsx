import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { upload } from '@vercel/blob/client';
import { CircleX, Paperclip, SendHorizonal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { Button } from '@/components/ui/button/button';
import { Loader } from '@/components/ui/loader/loader';

import styles from './form.module.scss';
import { resizeTextarea } from './resizeTextarea';
import { ALLOWED_TYPES, chatSchema, MAX_BYTES, MAX_TEXTAREA_VALUE_LENGTH } from './schema';

export const ChatForm = () => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const [fileLoading, setFileLoading] = useState(false);

	const [fileName, setFileName] = useState('');

	const form = useForm<z.infer<typeof chatSchema>>({
		resolver: zodResolver(chatSchema),
		defaultValues: {
			text: '',
			fileUrl: undefined,
		},
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.currentTarget.files;
		if (!files || files.length === 0) return;

		const file = files[0];

		if (!ALLOWED_TYPES.includes(file.type)) {
			form.setError('fileUrl', {
				type: 'validate',
				message: 'unsupported file type',
			});
			event.currentTarget.value = '';
			return;
		}

		if (file.size > MAX_BYTES) {
			form.setError('fileUrl', { type: 'validate', message: 'file size over 4 MB' });
			event.currentTarget.value = '';
			return;
		}

		setFileLoading(true);

		const blob = await upload(`chat-images/${file.name}`, file, {
			access: 'public',
			handleUploadUrl: '/api/blob',
		});

		setFileLoading(false);
		setFileName(file.name);
		form.setValue('fileUrl', blob.downloadUrl);

		form.trigger();
	};

	const onSubmit = async (data: z.infer<typeof chatSchema>) => {
		console.log(data);
	};

	const textFieldRegistration = form.register('text', {
		onChange: () => resizeTextarea(textareaRef),
	});

	useEffect(() => {
		textareaRef.current?.focus();
		resizeTextarea(textareaRef);
	}, []);

	return (
		<form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
			<textarea
				rows={1}
				placeholder="Message..."
				{...form.register('text')}
				className={styles.textarea}
				ref={(element) => {
					textFieldRegistration.ref(element);
					textareaRef.current = element;
				}}
			/>
			{form.formState.errors.text && !fileLoading && (
				<p className={`${styles.error} ${styles.errorText}`}>
					{MAX_TEXTAREA_VALUE_LENGTH - (form.watch('text')?.length ?? 0)}
				</p>
			)}
			<input
				className={styles.downloadInput}
				type="file"
				accept={ALLOWED_TYPES.join(',')}
				ref={fileInputRef}
				onClick={(e) => {
					e.currentTarget.value = '';
					form.clearErrors('fileUrl');
				}}
				onChange={async (event) => handleUpload(event)}
			/>
			<Button
				type="button"
				variant="ghost"
				className={styles.downloadBtn}
				onClick={() => fileInputRef.current?.click()}
			>
				<Paperclip size={16} />
			</Button>
			{(form.formState.errors.fileUrl || form.formState.errors.text) && (
				<div className={styles.error}>
					{form.formState.errors.fileUrl && (
						<Button
							type="button"
							variant="ghost"
							className={styles.errorButton}
							onClick={() => {
								form.setValue('fileUrl', undefined);
								form.clearErrors('fileUrl');
								form.trigger();
							}}
						>
							<CircleX size={12} />
						</Button>
					)}
					<p className={styles.errorMessage}>
						{form.formState.errors.fileUrl?.message ?? form.formState.errors.text?.message}
					</p>
				</div>
			)}
			{fileName && (
				<div className={styles.file}>
					<Button
						type="button"
						variant="ghost"
						className={styles.fileButton}
						onClick={() => {
							form.setValue('fileUrl', undefined);
							setFileName('');
							form.trigger();
						}}
					>
						<CircleX size={12} />
					</Button>

					<p className={styles.fileMessage}>{fileName} </p>
				</div>
			)}
			{fileLoading && (
				<div className={styles.loaderContainer}>
					<Loader />
				</div>
			)}
			{form.formState.isValid && !fileLoading && (
				<Button type="submit" variant="ghost" className={styles.submitBtn}>
					<SendHorizonal size={16} />
				</Button>
			)}
		</form>
	);
};
