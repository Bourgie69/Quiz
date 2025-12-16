"use client";

import { useEffect, useState } from "react";

const SideBar = () => {
  const [openBar, setOpenBar] = useState(false);
  const [articles, setArticles] = useState([]);

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
    };

    getArticles();
  }, []);

  return (
    <div className="bg-white border-r w-20 h-screen">
      {articles.map((article: any) => (
        <p key={article.id} className="font-bold text-center">{article.title}</p>
      ))}
    </div>
  );
};
export default SideBar;
