"use client";

import StarIcon from "@/app/_icons/StarIcon";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SummaryIcon from "@/app/_icons/SummaryIcon";
import { Spinner } from "@/components/ui/spinner";
import { raw } from "@prisma/client/runtime/library";

type Quiz = {
  question: string;
  options: string[];
  answer: string;
}[];

const QuizGen = () => {
  const [title, setTitle] = useState("");
  const [article, setArticle] = useState("");

  const [loading, setLoading] = useState(false);

  const [isSummarized, setIsSummarized] = useState(0);
  const [geminiResponse, setGeminiResponse] = useState({});

  const [quizQuestion, setQuizQuestion] = useState(0);

  const [questionAnswer, setQuestionAnswer] = useState(0);
  const [rightAnswers, setRightAnswers] = useState(0);

  const handleSend = async () => {
    const userMessage = article.trim();

    setIsSummarized(1);

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

    if (geminiResponse && loading) return;
    setLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `Generate 5 multiple choice questions based on this article: ${userMessage}. 
        Then generate 5 multiple-choice questions.

        Return ONLY valid JSON in this format:
        {
          "summary": "text",
          "quiz": [
                {
                  "question": "Question text here",
                  "options": ["A", "B", "C", "D"],
                  "answer": "0"
                }
              ]
        }
      Make sure the answer is the index (0-3) of the correct option.`,
      }),
    });
    setLoading(false);

    if (!response.ok) {
      console.error("API Error", await response.json());
      return;
    }

    const data = await response.json();

    console.log(data.text);

    const text = data.text;

    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No JSON found");
    }

    const rawJSON = JSON.parse(match[0]);

    console.log(rawJSON);

    setGeminiResponse(rawJSON);
  };

  const handleAnswer = (index) => {
    setQuestionAnswer(index);
    if (questionAnswer == geminiResponse.quiz[quizQuestion].answer) {
      setRightAnswers(prev => prev + 1);
    }
    setQuizQuestion(quizQuestion < 4 ? quizQuestion + 1 : 0);
    console.log(rightAnswers)
  };

  return (
    <>
      {isSummarized != 2 ? (
        <div className="flex flex-col gap-3 mt-20 mx-auto border border-gray-500 bg-white rounded-2xl p-5 h-fit w-[800]">
          <div className="flex items-center">
            <StarIcon />

            <p>Article Quiz Generator</p>
          </div>
          {isSummarized == 1 ? (
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
              <p>{geminiResponse.summary}</p>
            </div>
          ) : (
            <div>
              <p>
                Paste your article below to generate a summarize and quiz
                question. Your articles will be saved in the sidebar for future
                reference.
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
                onClick={() => setIsSummarized(0)}
              >
                See Content
              </Button>
            </span>
            {isSummarized == 1 ? (
              <Button
                onClick={() => setIsSummarized(2)}
                disabled={!geminiResponse}
              >
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
      ) : (
        <div className="flex flex-col gap-3 mt-20  mx-auto p-5 h-fit w-[800]">
          <div className="flex items-center gap-1">
            <StarIcon />
            <p className="text-lg font-bold">Quick test</p>
          </div>
          <p className=" text-gray-500">
            Take a quick test about your knowledge from your content{" "}
          </p>

          <div className="bg-white border rounded-2xl p-5 w-full mx-auto">
            <div className="text-center font-semibold text-lg mb-2">
              {geminiResponse.quiz[quizQuestion].question}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {geminiResponse.quiz[quizQuestion].options.map((item, index) => (
                <Button
                  onClick={() => handleAnswer(index)}
                  key={item.index}
                  className="border flex justify-center items-center text-center p-2 h-20 rounded-lg text-black bg-white overflow-x-auto"
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuizGen;
