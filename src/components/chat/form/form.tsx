import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@server/client';
import {
	ALLOWED_TYPES,
	MAX_BYTES,
	MAX_TEXTAREA_VALUE_LENGTH,
	messageSchema,
} from '@server/validatiion/message.schema';
import { TRPCClientErrorBase } from '@trpc/react-query';
import { DefaultErrorShape } from '@trpc/server/unstable-core-do-not-import';
import { upload } from '@vercel/blob/client';
import { CircleArrowRight, CircleX, Paperclip, SendHorizonal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { useName } from '@/lib/name-provider';
import { Button } from '@/components/ui/button/button';
import { Loader } from '@/components/ui/loader/loader';

import styles from './form.module.scss';
import { resizeTextarea } from './resizeTextarea';

export const ChatForm = () => {
	const { name, setName } = useName();

	const fileInputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const [fileLoading, setFileLoading] = useState(false);
	const [fileName, setFileName] = useState('');

	const insertMessage = trpc.message.insert.useMutation();

	const form = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
		defaultValues: {
			text: '',
			fileUrl: undefined,
			name: name,
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

	const onSubmit = async (data: z.infer<typeof messageSchema>) => {
		const clearForm = () => {
			form.resetField('text');
			form.resetField('fileUrl');
			setFileName('');
		};

		insertMessage.mutateAsync(data, {
			onSuccess: clearForm,
			onError: (err: TRPCClientErrorBase<DefaultErrorShape>) => {
				form.setError('fileUrl', {
					type: 'server',
					message: `Error: ${err.data?.httpStatus}: upload error`,
				});

				setTimeout(() => clearForm(), 5000);
			},
		});
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
			{!name ? (
				<>
					<input
						className={styles.input}
						placeholder="Name..."
						{...form.register('name')}
						type="text"
					/>
					{form.watch('name').trim() && (
						<Button
							type="button"
							variant="ghost"
							className={styles.submitBtn}
							onClick={() => {
								const name = form.watch('name').trim();
								setName(name);
								form.setValue('name', name);
							}}
						>
							<CircleArrowRight size={16} />
						</Button>
					)}
				</>
			) : (
				<>
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
					{form.formState.errors.text && !(fileLoading || insertMessage.isPending) && (
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
					{(fileLoading || insertMessage.isPending) && (
						<div className={styles.loaderContainer}>
							<Loader />
						</div>
					)}
					{form.formState.isValid && !(fileLoading || insertMessage.isPending) && (
						<Button type="submit" variant="ghost" className={styles.submitBtn}>
							<SendHorizonal size={16} />
						</Button>
					)}
				</>
			)}
		</form>
	);
};
