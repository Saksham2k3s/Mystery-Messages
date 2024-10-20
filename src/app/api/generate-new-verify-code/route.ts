import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConntect";
import UserModal from "@/model/User";
import { NextResponse } from "next/server"; // Import NextResponse for JSON response

export async function PUT(request: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Extract the username from the request body
    const { username } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    // Find the user by username
    const user = await UserModal.findOne({
      username: decodedUsername,
    });

    // If the user does not exist, return an error response
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 } // Changed to 404 as it's more appropriate for 'not found'
      );
    }

    // Generate new verification code and expiry time
    const newVerifyCode = Math.floor(10000 + Math.random() * 9000).toString();
    const newExpiryTime = new Date(Date.now() + 3600000); // 1 hour expiration

    // Update user with new verification code and expiry time
    user.verifyCode = newVerifyCode;
    user.verifyCodeExpiry = newExpiryTime;

    // Save the updated user information
    await user.save();

    console.log("This is user inside lksgj",user.username);
    const {email} = user
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      newVerifyCode
    )

    console.log("Email Response", emailResponse)

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "New verify code generated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    // Log the error for debugging
    console.error("Error during verification code generation:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while generating the verify code",
      },
      { status: 500 } // Internal Server Error
    );
  }
}
