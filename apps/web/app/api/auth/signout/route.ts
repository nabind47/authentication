import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/rotation";
import { deleteSession } from "@/lib/sessions";

export async function GET(req: NextRequest) {
    const response = await fetchWithAuth("http://localhost:3001/auth/signout", { method: "POST" });

    if (response.ok) {
        await deleteSession();
    }

    revalidatePath("/", "layout");
    revalidatePath("/", "page");
    // redirect("/auth/signin");
    return NextResponse.redirect(new URL("/", req.nextUrl));
}
