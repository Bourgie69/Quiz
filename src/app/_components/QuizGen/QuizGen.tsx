"use client";

import  StarIcon  from "@/app/_icons/StarIcon";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const QuizGen = () => {
  const [title, setTitle] = useState("");
  const [article, setArticle] = useState("");

  const handleSend = async () => {
    const userMessage = article.trim();

    const response = await fetch("/api/article-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userMessage }),
    });

    const data = await response.json();

    console.log(data);
  };

  return (
    <div className="flex flex-col gap-3 mt-20 mx-auto border border-gray-500 rounded-2xl p-5 h-fit w-[800]">
      <div className="flex items-center">
        <StarIcon />
        <p>Article Quiz Generator</p>
      </div>
      <p>
        Paste your article below to generate a summarize and quiz question. Your
        articles will saved in the sidebar for future reference.
      </p>

      <div>
        <p>Article Title</p>
        <textarea
          className="border h-10 w-full px-1"
          placeholder="Enter a title for your article"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <p>Article Content</p>
        <textarea
          className="border h-30 w-full px-1"
          placeholder="Paste your article content here..."
          value={article}
          onChange={(e) => setArticle(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button className="w-fit" disabled={!article || !title}
        onClick={handleSend}>
          Generate Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizGen;
