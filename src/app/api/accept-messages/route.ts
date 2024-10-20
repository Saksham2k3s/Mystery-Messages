import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConntect";
import UserModal from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
     await dbConnect()

     const session = await getServerSession(authOptions);
     const user: User = session?.user;
     
     if(!session || !session.user){
        return Response.json(
            {
              success: false,
              message: "Not Authenticated",
            },
            { status: 401 }
          );
     }

     const userId = user._id;
     const { acceptMessages } = await request.json();

     try {
        const updatedUser = await UserModal.findByIdAndUpdate(userId, 
            {isAcceptingMessage : acceptMessages},
            {new : true}
        );

        if(!updatedUser){
            return Response.json(
                {
                  success: false,
                  message: "Fail to update!",
                },
                { status: 401 }
              ); 
        }

        return Response.json(
            {
              success: true,
              message: "Message Accepting status updated successfully!",
            },
            { status: 200 }
          );
     } catch (error) {
        console.log("Error in accepting messages!", error);
        return Response.json(
            {
              success: false,
              message: "Error in accepting messages!",
            },
            { status: 500 }
          );
     }
}

export async function GET(request:Request) {
    await dbConnect()

     const session = await getServerSession(authOptions);
     const user: User = session?.user;
     
     if(!session || !session.user){
        return Response.json(
            {
              success: false,
              message: "Not Authenticated",
            },
            { status: 401 }
          );
     }

     const userId = user._id;

    try {
        const foundUser =  await UserModal.findById(userId);

        if(!foundUser){
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
              isAcceptingMessages : foundUser.isAcceptingMessage,
            },
            { status: 200 }
          ); 
    } catch (error) {
        console.log("Error in accepting messages!", error);
        return Response.json(
            {
              success: false,
              message: "Error in accepting messages!",
            },
            { status: 500 }
          );
      }
}

