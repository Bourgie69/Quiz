"use client";

import Quiz from "@/app/_components/QuizGen/Quiz";
import QuizResult from "@/app/_components/QuizGen/QuizResult";
import Summarized from "@/app/_components/QuizGen/Summarized";
import SideBar from "@/app/_components/Sidebar/SideBar";
import ArticleIcon from "@/app/_icons/ArticleIcon";
import StarIcon from "@/app/_icons/StarIcon";
import SummaryIcon from "@/app/_icons/SummaryIcon";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ArticleType = {
  title: string;
  content: string;
  summary: string;
};

type QuizSingles = {
  id: string;
  question: string;
  answer: number;
  options: string[];
};

const Article = () => {
  const params = useParams();
  const router = useRouter();

  const [articleLoading, setArticleLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);

  const [takeQuiz, setTakeQuiz] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState(0);

  const [articleContent, setArticleContent] = useState<ArticleType | null>(
    null
  );
  const [quiz, setQuiz] = useState<QuizSingles[]>([]);

  const [tally, setTally] = useState(0);

  const [rightAnswers, setRightAnswers] = useState([0, 0, 0, 0, 0]);
  const [yourAnswers, setYourAnswers] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    const getArticle = async () => {
      setArticleLoading(true);

      const response = await fetch(`/api/articles/${params.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      console.log(data);

      setArticleContent(data.article);

      setArticleLoading(false);
    };

    const getQuiz = async () => {
      setQuizLoading(true);
      const response = await fetch(`/api/quiz/${params.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      console.log(data);

      setQuiz(data.quiz);
      setQuizLoading(false);
    };

    getArticle();
    getQuiz();
  }, []);

  const handleAnswer = (index: number) => {
    const correct: any = quiz[quizQuestion].answer;
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

  const handleLeave = () => {
    router.push("/");
  };

  return (
    <>
      {!takeQuiz ? (
        <div className="flex flex-col gap- mt-20 mx-auto border border-gray-500 bg-white rounded-2xl p-5 h-fit w-[800]">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <StarIcon />
              <p>Article Quiz Generator</p>
            </div>
            <Summarized
              loading={articleLoading}
              summary={articleContent?.summary}
              title={articleContent?.title}
            />
            <div className="flex gap-2 items-center">
              <ArticleIcon />
              <p className="text-sm text-gray-500">Article Content</p>
            </div>
            {/* <p>{articleContent?.content}</p> */}
            <div className="flex w-full justify-between">
              <Button onClick={() => setTakeQuiz(!takeQuiz)}>Take Quiz</Button>
            </div>
          </div>
        </div>
      ) : quizQuestion != 5 ? (
        <Quiz
          articleQuiz={quiz}
          handleAnswer={handleAnswer}
          quizQuestion={quizQuestion}
        />
      ) : (
        <div className="flex mx-auto">
          <QuizResult
            quiz={quiz}
            yourAnswers={yourAnswers}
            rightAnswers={rightAnswers}
            setQuizQuestion={setQuizQuestion}
            tally={tally}
            setTally={setTally}
            isOld={true}
            handleLeave={handleLeave}
          />
        </div>
      )}
    </>
  );
};
export default Article;
