import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import { UsernameSchema } from "@/validation/signUpSchema";
import { logger } from "@/lib/logger";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");
        //validate with zod
        const result = UsernameSchema.safeParse(username);
        if (!result?.success) {
            return Response.json(
                {
                    success: false,
                    message: result?.error.format()._errors.join(", "),
                },
                { status: 400 }
            );
        }
        const parsedUsername = result.data;
        const existingVerifiedUser = await userModel.findOne({
            username: parsedUsername,
            isVerified: true,
        });
        if (existingVerifiedUser) {
            return Response.json(
                { success: false, message: "Username already exists" },
                { status: 405 }
            );
        }
        return Response.json(
            { success: true, message: "username is unique" },
            { status: 200 }
        );
    } catch (error) {
        logger.error({ error }, "Error checking username availability");
        return Response.json(
            { success: false, message: "Error checking username availability" },
            { status: 500 }
        );
    }
}
