

export const POST = async (req: Request) => {
    const article = await prisma.article.create({
        data: await req.json()
    })

    return new Response(JSON.stringify({article}), {status: 201})
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