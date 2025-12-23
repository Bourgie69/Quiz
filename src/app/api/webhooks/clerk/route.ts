import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export const POST = async () => {

    console.log('123')

    const { userId } = await auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
        return new Response("User not found", { status: 404 });
    }

    await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
            id: userId,
            email: user.emailAddresses[0].emailAddress,
            name: user.firstName,
        },
    });

    return Response.json({ ok: true });
}
