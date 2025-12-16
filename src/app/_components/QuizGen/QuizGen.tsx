"use client";

import StarIcon from "@/app/_icons/StarIcon";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SummaryIcon from "@/app/_icons/SummaryIcon";
import { Spinner } from "@/components/ui/spinner";

const QuizGen = () => {
  const [title, setTitle] = useState("");
  const [article, setArticle] = useState("");

  const [loading, setLoading] = useState(false);

  const [isSummarized, setIsSummarized] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState("");
  const [quiz, setquiz] = useState({});

  const handleSend = async () => {
    const userMessage = article.trim();
    setIsSummarized(true);

    if (geminiResponse && loading) return;
    setLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `Please provide a concise summary of the following article: ${userMessage}`,
      }),
    });

    const data = await response.json();

    setGeminiResponse(data.text);
    setLoading(false);
    console.log(data);
  };

  const postArticle = async () => {
    // const response = await fetch("api/articles", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     title: title,
    //     content: article,
    //     summary: geminiResponse,
    //   }),
    // });

    // const data = await response.json();
    // console.log(data);

    const quizResponse = await fetch("api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `Generate 5 multiple choice questions based on this article: ${geminiResponse}. Return the response in this exact JSON format:
      [
        {
          "question": "Question text here",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "answer": "0"
        }
      ]
      Make sure the response is valid JSON and the answer is the index (0-3) of the correct option.`,
      }),
    });
    const quizJSON = await quizResponse.json();
    console.log(quizJSON);
  };

  return (
    <div className="flex flex-col gap-3 mt-20 mx-auto border border-gray-500 rounded-2xl p-5 h-fit w-[800]">
      <div className="flex items-center">
        <StarIcon />
        <p>Article Quiz Generator</p>
      </div>
      {isSummarized ? (
        <div>
          <div className="flex items-center gap-2">
            <SummaryIcon />
            <p className="text-sm text-gray-500">Summarized content</p>
          </div>
          <p className="text-2xl font-bold">{title}</p>
          {loading && (
            <div className="flex items-center gap-2">
              <p className="text-gray-500">Generating Summary</p>
              <Spinner />
            </div>
          )}
          <p>{geminiResponse}</p>
        </div>
      ) : (
        <div>
          <p>
            Paste your article below to generate a summarize and quiz question.
            Your articles will be saved in the sidebar for future reference.
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
          <Button onClick={postArticle} disabled={!geminiResponse}>
            Generate quiz
          </Button>
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
