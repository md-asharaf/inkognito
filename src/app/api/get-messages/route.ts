import dbConnect from "@/lib/dbConnect";
import { auth } from "@/lib/auth";
import userModel from "@/models/user.model";

export async function GET(req: Request) {
  await dbConnect();
  const session = await auth.api.getSession({ headers: req.headers });
  const user = session?.user;
  if (!user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = user.id;
  try {
    const foundUser = await userModel.aggregate([
      {
        $match: {
          $or: [
            { _id: userId },
            { _id: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null }
          ]
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "messages",
          foreignField: "id",
          as: "messages",
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);
    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    if (foundUser.length === 0) {
      return Response.json(
        { success: true, messages: [] },
        { status: 200 }
      );
    }
    return Response.json(
      { success: true, messages: foundUser[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.log("GET Error in get-messages route: ", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
