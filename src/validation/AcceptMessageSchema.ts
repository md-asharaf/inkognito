import * as z from "zod";

export const AcceptMessageSchema = z.object({
  acceptMessage: z.boolean(),
});
