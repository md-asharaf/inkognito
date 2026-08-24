import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import { logger } from "@/lib/logger";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return Response.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }

    const user = await userModel.findOne({ username });
    
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: user.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error({ error }, "Error in check-user-status");
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
