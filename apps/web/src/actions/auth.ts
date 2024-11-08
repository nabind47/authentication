"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createSession } from "@/lib/sessions";

type FormState = {
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
const SigninSchema = z.object({
    email: z.string().email({ message: "Invalid email" }).trim(),
    password: z.string().min(1, { message: "Password is required" }).trim(),
})

export async function signupAction(state: FormState, formData: FormData): Promise<FormState> {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const validationResult = SignupSchema.safeParse({
        name,
        email,
        password,
    });

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

export async function signinAction(state: FormState, formData: FormData): Promise<FormState> {
    const email = formData.get("email");
    const password = formData.get("password");

    const validationResult = SigninSchema.safeParse({
        email,
        password,
    });
    if (!validationResult.success) {
        return {
            error: validationResult.error.flatten().fieldErrors,
        };
    }

    const response = await fetch("http://localhost:3001/auth/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
    })
    if (response.ok) {
        const result = await response.json();
        await createSession({
            user: {
                id: result.id,
                name: result.name,
            },
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });

        redirect("/");
    } else {
        return {
            message: response.status === 401 ? "Invalid credentials" : response.statusText,
        }
    }

}


export async function refreshAction(refreshToken: string) {
    try {
        const response = await fetch("http://localhost:3001/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        })
        if (!response.ok) {
            throw new Error("Failed to refresh token");
        }

        const result = await response.json();
        const updateResponse = await fetch("http://localhost:3000/api/auth/update", {
            method: "POST",
            body: JSON.stringify({ accessToken: result.accessToken, refreshToken: result.refreshToken }),
        })
        if (!updateResponse.ok) {
            throw new Error("Failed to update session");
        }
        return result.accessToken;
    } catch (error) {
        return null
    }
}
