"use client";

import SideBarIcon from "@/app/_icons/SideBarIcon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SideBar = () => {
  const [openBar, setOpenBar] = useState(false);
  const [articles, setArticles] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const getArticles = async () => {
      const response = await fetch("/api/articles/byUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setArticles(data.articles);
      console.log(data.articles);
    };

    getArticles();
  }, []);

  return (
    <div className="bg-white border-r h-screen">
      <div className="  w-20 flex flex-col">
        {articles.map((article: any) => (
          <button
            key={article.id}
            className="font-bold text-center cursor-pointer my-1 p-2 hover:bg-gray-200 rounded"
            onClick={() => router.push(`article/${article.id}`)}
          >
            {article.title}
          </button>
        ))}
      </div>
    </div>
  );
};
export default SideBar;
