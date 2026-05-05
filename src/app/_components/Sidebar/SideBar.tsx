"use client";

import SideBarIcon from "@/app/_icons/SideBarIcon";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SideBar = () => {

  const { isSignedIn, isLoaded } = useAuth()
  const [openBar, setOpenBar] = useState(false);
  const [articles, setArticles] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return
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

    const getDemoArticles = async () => {
      const response = await fetch("/api/articles/forDemo", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      const data = await response.json()
      setArticles(data.articles)
      console.log(data.articles)
    }


    if (isSignedIn) {
      getArticles();

    } else if (!isSignedIn) {
      getDemoArticles()
    }


  }, [isLoaded, isSignedIn]);

  return (
    <div className="bg-white border-r h-screen">
      <div className="  w-20 flex flex-col">
        {articles.map((article: any) => (
          <button
            key={article.id}
            className="text-sm text-center cursor-pointer my-1 p-2 hover:bg-gray-200 rounded"
            onClick={() => router.push(`/article/${article.id}`)}
          >
            {article.title}
          </button>
        ))}
      </div>
    </div>
  );
};
export default SideBar;
