import prisma from "@/lib/prisma"

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const resolvedParams = await params
        const article = await prisma.article.findFirst({
            where: {
                id: resolvedParams.id
            }
        })
        return new Response(JSON.stringify({ article }), { status: 200 })
    } catch (err) {
        console.log(err)
        return new Response("Failed to fetch articles", { status: 500 })
    }
}