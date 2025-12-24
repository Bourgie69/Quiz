import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Not signed in", { status: 401 });
  }

  const user = await currentUser();
  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName,
      clerkId: user.id
    },
  });

  return NextResponse.json({ ok: true });
}
