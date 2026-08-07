import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import { auth } from "@/lib/auth";
import { UsernameSchema } from "@/validation/signUpSchema";
import * as z from "zod";
import mongoose from "mongoose";

const ChangeUsernameSchema = z.object({
  username: UsernameSchema
});

export async function POST(req: Request) {
  await dbConnect();
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
      return new Response(JSON.stringify({ success: false, message: "Not Authenticated" }), { status: 401 });
    }

    const { username } = await req.json();

    // Validate username
    const parsed = ChangeUsernameSchema.safeParse({ username });
    if (!parsed.success) {
      return new Response(JSON.stringify({ success: false, message: "Invalid username format" }), { status: 400 });
    }

    // Check if username is already taken by someone else
    const existingUser = await userModel.findOne({ username });
    if (existingUser && existingUser.id.toString() !== session.user.id.toString()) {
      return new Response(JSON.stringify({ success: false, message: "Username is already taken" }), { status: 400 });
    }

    // Update the user
    const updatedUser = await userModel.findOneAndUpdate(
      {
        $or: [
          { _id: session.user.id },
          { _id: mongoose.Types.ObjectId.isValid(session.user.id) ? new mongoose.Types.ObjectId(session.user.id) : null }
        ]
      },
      { username },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, message: "Username updated successfully" }), { status: 200 });

  } catch (error) {
    console.error("Error updating username", error);
    return new Response(JSON.stringify({ success: false, message: "Error updating username" }), { status: 500 });
  }
}
