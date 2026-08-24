import * as z from "zod";

export const MessageSchema = z.object({
    title: z.string().max(50, "Title must be at most 50 characters long").optional(),
    content: z
        .string()
        .min(10, "Message must be at least 10 characters long")
        .max(300, "Message must be at most 300 characters long"),
});
