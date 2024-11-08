"use server"

import { getSession } from "@/lib/sessions";

export async function getProfile() {
    const session = await getSession()

    const res = await fetch(`http://localhost:3001/auth/profile`, {
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        }
    });

    const data = await res.json();
    return data;
}