import dbConnect from "@/lib/dbConntect";
import UserModal from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();
        console.log("This is username and code", username, code);
        //use => http://localhost:3000?username=Ram%20Sign
        // so it will give yor username = Ram Sign remove %20

       const decodedUsername = decodeURIComponent(username);

       const user = await UserModal.findOne({
        username : decodedUsername
       });

       if(!user){
        return Response.json(
            {
              success: false,
              message: "User not found",
            },
            { status: 500 }
          );
       }

       const isCodeValid = user.verifyCode === code;
       const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date;

       if (isCodeNotExpired && isCodeValid) {
         user.isVerified = true;
         await user.save();
         return Response.json(
            {
              success: true,
              message: "User verified successfully!",
            },
            { status: 200 }
          );
       }else if(!isCodeNotExpired){
        return Response.json(
            {
              success: false,
              message: "Verification code expired please, sigup again to get new code",
            },
            { status: 500 }
          );
       }else{
        return Response.json(
            {
              success: false,
              message: "incorrect verification code",
            },
            { status: 500 }
          );
       }
    } catch (error) {
        console.log("Error Verifying User", error);

        return Response.json(
            {
              success: false,
              message: "Error Verifying User",
            },
            { status: 500 }
          );
    }
}