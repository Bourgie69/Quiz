"use client"

import { useParams } from "next/navigation"

const Article = () => {

    const params = useParams()

    return(
        <div>{params.id}</div>
    )
}
export default Article