import dbConnect from "@/lib/dbConntect";
import UserModal from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
   await dbConnect();
   
   const { username, content } = await request.json();
   try {
      const user = await UserModal.findOne({username});

      // Find User with the username
      if(!user){
        return Response.json({
           success: false,
           message: "User not found"
        }, {status: 404})
      }
     
      //Check user is accepting messages

      if (!user.isAcceptingMessage) {
        return Response.json({
            success: false,
            message: "User not accepting messages"
         }, {status: 403})
      }

      const newMessage = { content, createdAt: new Date() }
      user.messages.push(newMessage as Message);
      await user.save();
 
      return Response.json({
        success: true,
        message: "Message save successfully!"
     }, {status: 200})

   } catch (error) {
    console.log("Error in adding messages", error);
    return Response.json({
        success: false,
        message: "Unable to save message"
     }, {status: 500})
   }
}
