import dbConnect from "@/lib/dbConntect";
import UserModal from "@/model/User";
import bcryptjs from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModal.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken!",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModal.findOne({
      email,
    });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exits with this email",
          },
          { status: 400 }
        );
      } else {
        const hasedPassword = await bcryptjs.hash(password, 10);
        const verifyCode = Math.floor(10000 + Math.random() * 9000).toString();
        existingUserByEmail.password = hasedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }
    } else {
      const hasedPassword = await bcryptjs.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const verifyCode = Math.floor(10000 + Math.random() * 9000).toString();
      const newUser = new UserModal({
        username,
        email,
        password: hasedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();

      //send verification email
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      );

      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          { status: 500 }
        );
      }
    }

    return Response.json(
      {
        success: true,
        message: "User registerd successfully. Please verified your email!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error registring user", error);
    return Response.json(
      {
        success: false,
        message: "Error registring user!",
      },
      {
        status: 500,
      }
    );
  }
}
