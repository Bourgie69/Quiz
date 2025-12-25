import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }) => {
    try {
        const resolvedParams = await params
        const articleId = resolvedParams.id
        const quiz = await prisma.quiz.findMany({
            where: {
                articleId
            },
        });

        return NextResponse.json({ quiz }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
    }
};
