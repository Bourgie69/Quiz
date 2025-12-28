import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"


export const GET = async (req: Request) => {
    try {
    const {userId} = await auth()

    if(!userId) return new Response("Unauthorized", {status: 401})

        const articles = await prisma.article.findMany({
            where: {
                userId
            }
        })
        return new Response(JSON.stringify({ articles }), { status: 200 })
    } catch (err) {
        console.log(err)
        return new Response("Failed to fetch articles", { status: 500 })
    }
}