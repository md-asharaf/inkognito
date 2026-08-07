import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import { AcceptMessageSchema } from "@/validation/AcceptMessageSchema";
import mongoose from "mongoose";

export async function POST(req: Request) {
  await dbConnect();
  const session = await auth.api.getSession({ headers: req.headers });
  const user = session?.user;
  if (!session || !user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = user.id;
  const { acceptMessage } = await req.json();
  const result = AcceptMessageSchema.safeParse({ acceptMessage });
  if (!result.success) {
    return Response.json(
      {
        success: false,
        message: "Invalid data",
        errors: result.error.issues,
      },
      { status: 400 }
    );
  }
  try {
    const updatedUser = await userModel.findOneAndUpdate(
      {
        $or: [
          { _id: userId },
          { _id: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null }
        ]
      },
      {
        isAcceptingMessages: result.data.acceptMessage,
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message settings updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("POST Error in accept-message route: ", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();
  const session = await auth.api.getSession({ headers: req.headers });
  const user = session?.user;
  if (!session || !user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = user.id;
  try {
    const user = await userModel.findOne({
      $or: [
        { _id: userId },
        { _id: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null }
      ]
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "fetched isAcceptingMessage successfully",
        isAcceptingMessages: user.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("GET Error in accept-message route: ", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
