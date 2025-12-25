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

type QuizSingles = {
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
  };

  const handleAnswer = (index: number) => {
    const correct = geminiResponse?.quiz[quizQuestion].answer;
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
              <p>{geminiResponse?.summary}</p>
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
        <div className="flex flex-col gap-3 mt-20  mx-auto p-5 h-fit w-[800]">
          <div className="flex items-center gap-1">
            <StarIcon />
            <p className="text-lg font-bold">Quick test</p>
          </div>
          <p className=" text-gray-500">
            Take a quick test about your knowledge from your content{" "}
          </p>

          <div className="bg-white border rounded-2xl p-5 w-full mx-auto">
            <div className="flex gap-5 justify-between text-center font-semibold text-lg mb-2">
              <p>{geminiResponse?.quiz[quizQuestion].question}</p>
              <p>{quizQuestion}/5</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {geminiResponse?.quiz[quizQuestion].options.map((item, index) => (
                <p
                  onClick={() => handleAnswer(index)}
                  key={index}
                  className="border flex justify-center items-center text-center p-2 h-20 rounded-lg text-black bg-white overflow-x-auto cursor-pointer"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-20 flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <StarIcon />
            <p className="text-lg font-bold">Quiz completed</p>
          </div>
          <p className=" text-gray-500">Let's see how you did! </p>
          <div className="w-100 bg-white border border-violet-500 rounded-lg p-2">
            <p>
              <span className="text-2xl font-semibold">
                Your Score : {tally}
              </span>{" "}
              / 5
            </p>

            <div className="flex flex-col gap-5 mt-5">
              {geminiResponse?.quiz.map((item, index) => (
                <div key={index} className="flex gap-2">
                  {yourAnswers[index] == rightAnswers[index] ? (
                    <div className="w-10 h-10">
                      <CorrectIcon />
                    </div>
                  ) : (
                    <div className="w-10 h-10">
                      <IncorrectIcon />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">
                      {index + 1}. {item.question}
                    </p>

                    <p className="text-xs">
                      Your answer: {item.options[yourAnswers[index]]}
                    </p>
                    {yourAnswers[index] != rightAnswers[index] && (
                      <p className="text-xs text-green-500">
                        Correct : {item.options[rightAnswers[index]]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setQuizQuestion(0);
                  setTally(0);
                }}
              >
                <RestartIcon />
                Restart quiz
              </Button>

              <Button
                onClick={() => {
                  handleSendQuiz();
                  setIsSummarized(0);
                }}
              >
                <SaveIcon />
                Save and Leave
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuizGen;
