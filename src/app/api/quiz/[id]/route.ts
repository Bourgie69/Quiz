import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (
    request: Request,
    context: { params: { id: string } }
) => {
    try {
        const {params} = context
        const articleId = params.id
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
