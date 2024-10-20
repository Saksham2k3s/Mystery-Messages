import dbConnect from "@/lib/dbConntect";
import UserModal from "@/model/User";
import bcryptjs from "bcryptjs";

export async function POST(request: Request) {
    console.log("Inside login backend");
    try {
        const { email, password } = await request.json();
        console.log("email and pass", email, password);
        // Connect to the database
        await dbConnect();

        // Find the user by email
        const userWithEmail = await UserModal.findOne({ email });
        console.log("This is find user", userWithEmail);
        // Check if user exists
        if (!userWithEmail) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found with these credentials",
                }),
                { status: 404 }
            );
        }

        console.log("This is user", userWithEmail);

        // Compare passwords
        const comparePassword = await bcryptjs.compare(password, userWithEmail.password);

        if (!comparePassword) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Invalid password",
                }),
                { status: 401 }
            );
        }

        // Successful login response
        return new Response(
            JSON.stringify({
                success: true,
                message: `Welcome back`,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error during login:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Something went wrong. Please try again later.",
            }),
            { status: 500 }
        );
    }
}
