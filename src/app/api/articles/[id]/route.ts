import prisma from "@/lib/prisma"


export const GET = async (req: Request, context: { params: { id: string } }) => {
    try {
        const { params } = context
        const id = params.id
        const article = await prisma.article.findFirst({
            where: {
                id
            }
        })
        return new Response(JSON.stringify({ article }), { status: 200 })
    } catch (err) {
        console.log(err)
        return new Response("Failed to fetch articles", { status: 500 })
    }
}