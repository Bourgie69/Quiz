"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SideBar = () => {
  const [openBar, setOpenBar] = useState(false);
  const [articles, setArticles] = useState([]);

  const router = useRouter()

  useEffect(() => {
    const getArticles = async () => {
      const response = await fetch("/api/articles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setArticles(data.articles);
      console.log(data.articles)
    };

    getArticles();
  }, []);

  return (
    <div className="bg-white border-r w-20 h-screen flex flex-col">
      {articles.map((article: any) => (
        <button key={article.id} className="font-bold text-center"
        onClick={() => router.push(`article/${article.id}`)}
        >
          {article.title}
        </button>
      ))}
    </div>
  );
};
export default SideBar;
