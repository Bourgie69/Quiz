import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


export const POST = async (req: Request) => {
    const {userId} = await auth()
    if(!userId) return new NextResponse("Unauthorized", {status: 401})

    const {title, content, summary} = await req.json()
    const article = await prisma.article.create({
        data: {
            title,
            summary,
            content,
            userId
        }
    })

    return NextResponse.json({articleId: article.id})
}


export const GET = async (req: Request) => {
    try {
        const articles = await prisma.article.findMany()    
        return new Response(JSON.stringify({articles}), {status: 200})
    } catch(err){
        console.log(err)
        return new Response("Failed to fetch articles", {status: 500})
    }
}