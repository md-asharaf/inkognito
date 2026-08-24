import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import messageModel from "@/models/message.model";
import { logger } from "@/lib/logger";
export async function POST(req: Request) {
  await dbConnect();
  const { title, content, username } =
    await req.json();

  try {
    const existingUser = await userModel.findOne({ username });
    if (!existingUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (!existingUser.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not currently accepting messages",
        },
        { status: 403 }
      );
    }

    const newMessage = await messageModel.create({
      content,
      title
    });

    await userModel.findByIdAndUpdate(existingUser._id, {
      $push: { messages: newMessage._id }
    });

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error({ error }, "Error sending message");
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
