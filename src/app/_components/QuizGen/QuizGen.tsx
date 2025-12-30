"use client";

import StarIcon from "@/app/_icons/StarIcon";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SummaryIcon from "@/app/_icons/SummaryIcon";
import { Spinner } from "@/components/ui/spinner";
import CorrectIcon from "@/app/_icons/CorrectIcon";
import IncorrectIcon from "@/app/_icons/IncorrectIcon";
import RestartIcon from "@/app/_icons/RestartIcon";
import SaveIcon from "@/app/_icons/SaveIcon";
import Summarized from "./Summarized";
import Quiz from "./Quiz";
import QuizResult from "./QuizResult";

export type QuizSingles = {
  question: string;
  options: string[];
  answer: number;
};

type GeminiResponse = {
  summary: string;
  quiz: QuizSingles[];
};

const QuizGen = () => {
  const [title, setTitle] = useState("");
  const [article, setArticle] = useState("");
  const [articleId, setArticleId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [isSummarized, setIsSummarized] = useState(0);
  const [geminiResponse, setGeminiResponse] = useState<GeminiResponse | null>(
    null
  );

  const [quizQuestion, setQuizQuestion] = useState(0);

  const [tally, setTally] = useState(0);

  const [rightAnswers, setRightAnswers] = useState([0, 0, 0, 0, 0]);
  const [yourAnswers, setYourAnswers] = useState([0, 0, 0, 0, 0]);

  const handleSendArticle = async () => {
    const userMessage = article.trim();

    setIsSummarized(1);

    if (geminiResponse && loading) return;
    setLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `Generate 5 multiple choice questions based on this article: ${userMessage}. 
        Then generate exactly 5 multiple-choice questions.

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

    const text = data.text;

    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No JSON found");
    }

    const rawJSON = JSON.parse(match[0]);

    console.log(rawJSON);

    setGeminiResponse(rawJSON);
  };

  const postArticle = async () => {
    const articleResponse = await fetch("api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        content: article,
        summary: geminiResponse?.summary,
      }),
    });

    const articleData = await articleResponse.json();
    setArticleId(articleData.articleId);

    console.log(articleData);
  };

  const handleSendQuiz = async () => {
    if (!articleId) {
      console.log("no Article Id", articleId);
      return;
    }

    const response = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        quizArray: geminiResponse?.quiz,
        articleId,
      }),
    });

    const data = await response.json();

    setTitle("");
    setArticle("");
    setIsSummarized(0)
  };

  const handleAnswer = (index: number) => {
    const correct: any = geminiResponse?.quiz[quizQuestion].answer;
    if (index == correct) {
      setTally((prev) => prev + 1);
    }
    setQuizQuestion(quizQuestion < 5 ? quizQuestion + 1 : 0);

    setYourAnswers((prev) => {
      const next = [...prev];
      next[quizQuestion] = index;
      return next;
    });

    setRightAnswers((prev) => {
      const next = [...prev];
      next[quizQuestion] = correct;
      return next;
    });
  };

  return (
    <>
      {isSummarized != 2 ? (
        <div className="flex flex-col gap-3 mt-20 mx-auto border border-gray-500 bg-white rounded-2xl p-5 h-fit w-[800]">
          <div className="flex gap-2 items-center">
            <StarIcon />
            <p>Article Quiz Generator</p>
          </div>
          {isSummarized == 1 ? (
            <Summarized
              title={title}
              summary={geminiResponse?.summary}
              loading={loading}
            />
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
                onClick={() => {
                  setIsSummarized(2);
                  postArticle();
                }}
                disabled={!geminiResponse}
              >
                Generate quiz
              </Button>
            ) : (
              <Button
                className="w-fit"
                disabled={!article || !title}
                onClick={handleSendArticle}
              >
                See summary
              </Button>
            )}
          </div>
        </div>
      ) : quizQuestion != 5 ? (
        <Quiz
          articleQuiz={geminiResponse?.quiz}
          handleAnswer={handleAnswer}
          quizQuestion={quizQuestion}
        />
      ) : (
        <QuizResult
          quiz={geminiResponse?.quiz}
          yourAnswers={yourAnswers}
          rightAnswers={rightAnswers}
          setQuizQuestion={setQuizQuestion}
          tally={tally}
          setTally={setTally}
          handleSendQuiz={handleSendQuiz}
          isOld={false}
          setIsSummarized={setIsSummarized}
        />
      )}
    </>
  );
};

export default QuizGen;
