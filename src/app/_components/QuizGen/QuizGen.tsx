"use client";

import StarIcon from "@/app/_icons/StarIcon";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SummarizedContent from "./SummarizedContent";

const QuizGen = () => {
  const [title, setTitle] = useState("");
  const [article, setArticle] = useState("");
  const [isSummarized, setIsSummarized] = useState(false);
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    const userMessage = article.trim();
    setIsSummarized(true);

    const response = await fetch("/api/article-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userMessage }),
    });

    const data = await response.json();

    setResponse(data.text);
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-3 mt-20 mx-auto border border-gray-500 rounded-2xl p-5 h-fit w-[800]">
      <div className="flex items-center">
        <StarIcon />
        <p>Article Quiz Generator</p>
      </div>
      {isSummarized ? (
        <SummarizedContent
          title={title}
          article={article}
          response={response}
        />
      ) : (
        <div>
          <p>
            Paste your article below to generate a summarize and quiz question.
            Your articles will saved in the sidebar for future reference.
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
        </div>
      )}

      <div className="flex justify-between">
        <span>
          <Button
            className={`${!isSummarized ? "hidden" : "block"} `}
            onClick={() => setIsSummarized(false)}
          >
            See Content
          </Button>
        </span>
        {isSummarized ? (
          <Button>Generate quiz</Button>
        ) : (
          <Button
            className="w-fit"
            disabled={!article || !title}
            onClick={handleSend}
          >
            See summary
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizGen;
