"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

type SignupFormState = {
    error?: {
        name?: string[];
        email?: string[];
        password?: string[];
    };
    message?: string
} | undefined;

const SignupSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).trim(),
    email: z.string().email({ message: "Invalid email" }).trim(),
    password: z.string().min(1, { message: "Password is required" }).trim(),
})

export async function signupAction(state: SignupFormState, formData: FormData): Promise<SignupFormState> {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    console.log(name, email, password)

    const validationResult = SignupSchema.safeParse({
        name,
        email,
        password,
    });

    console.log(validationResult)
    if (!validationResult.success) {
        return {
            error: validationResult.error.flatten().fieldErrors,
        };
    }
    const response = await fetch("http://localhost:3001/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
    })
    if (response.ok) {
        redirect("/auth/signin");
    } else {
        return {
            message: response.status === 409 ? "User already exists with this email" : response.statusText,
        }
    }
}
