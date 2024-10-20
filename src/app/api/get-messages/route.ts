import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConntect";
import UserModal from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    // Use aggregation to fetch and sort messages
    const userMessages = await UserModal.aggregate([
      { $match: { _id: userId } }, // Match the user by _id
      { $unwind: "$messages" }, // Unwind messages array
      { $sort: { "messages.createdAt": -1 } }, // Sort messages by createdAt in descending order
      {
        $group: {
          _id: "$_id", // Group back to user _id
          messages: { $push: "$messages" }, // Push sorted messages back into an array
        },
      },
    ]);

    // Check if user has messages
    if (userMessages.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No messages found",
        },
        { status: 404 }
      );
    }

    // Return sorted messages
    return Response.json(
      {
        success: true,
        message: "Messages fetched successfully",
        messages: userMessages[0].messages, // Return the messages array
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in getting messages", error);
    return Response.json(
      {
        success: false,
        message: "Unexpected network error",
      },
      { status: 500 }
    );
  }
}
