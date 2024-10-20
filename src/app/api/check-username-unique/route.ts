import dbConnect from "@/lib/dbConntect";
import UserModal from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  //query schema
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  //Get username from query from url
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    //Validate with zod
    const result = UsernameQuerySchema.safeParse(queryParams);

    //if username not follow the formate rules
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "Invlide query paremeters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    //If we have the user already and veryfied then we can't give this username to any other
    const exiestingVerifyedUser = await UserModal.findOne({
      username,
      isVerified: true,
    });

    if (exiestingVerifyedUser) {
      return Response.json(
        {
          success: false,
          message: "User name is already taken",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: `${username} is available`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error while checking username",
      },
      { status: 500 }
    );
  }
}
