import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { createSession } from "@/lib/sessions";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userId = searchParams.get('userId');
    const name = searchParams.get('name');
    const role = searchParams.get('role');

    if (!accessToken || !refreshToken || !userId || !name || !role) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    await createSession({
        user: {
            id: userId,
            name,
            role
        },
        accessToken,
        refreshToken
    })

    redirect("/")
}   