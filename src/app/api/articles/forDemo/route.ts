import prisma from "@/lib/prisma"

export const GET = async () => {
    try {
        const articles = await prisma.article.findMany({
            where: {
                userId: "demo-user"
            }
        })
        
        return Response.json({ articles })
    } catch (err) {
        console.log(err)
        return new Response("Failed to fetch articles", { status: 500 })
    }
}
