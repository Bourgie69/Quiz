
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    const user = await currentUser()
    if (!user) return new Response("User not found", { status: 401 })

    await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
            id: userId,
            email: user.emailAddresses[0].emailAddress,
            name: user.fullName
        }
    });

    return NextResponse.json({ ok: true })
}