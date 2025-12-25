import prisma from "@/lib/prisma";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

type Quiz = {
    question: string,
    options: string[],
    answer: number
};

export const POST = async (request: NextRequest) => {
    try {
        const { quizArray, articleId } = await request.json()

        if (!articleId || !quizArray) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            )
        }

        const quizResponse = await prisma.quiz.createMany({
            data: quizArray.map((q: any) => ({
                question: q.question,
                options: q.options,
                answer: q.answer,
                articleId
            })),
        })

        return new NextResponse(JSON.stringify(quizResponse), { status: 200 })

    } catch (err) {
        return NextResponse.json({ err }, { status: 400 });
    }
};


export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {

        const quiz = await prisma.quiz.findMany({
            where: {
                articleId: params.id
            }
        })

        return new NextResponse(JSON.stringify(quiz), { status: 200 })

    } catch (err) {
        return NextResponse.json({ err }, { status: 400 })
    }
}