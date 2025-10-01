import z from 'zod';

export const MAX_TEXTAREA_VALUE_LENGTH = 100;
export const MAX_BYTES = 4 * 1024 * 1024;
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const messageSchema = z
	.object({
		text: z
			.string()
			.trim()
			.max(MAX_TEXTAREA_VALUE_LENGTH, { message: 'message too long' })
			.optional(),
		fileUrl: z.url({ message: 'invalid url' }).optional(),
	})
	.superRefine((val, ctx) => {
		if (!val.text?.length && !val.fileUrl) {
			ctx.addIssue({
				code: 'custom',
				message: 'empty form',
			});
		}
	});
