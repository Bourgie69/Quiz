"use client";

import SideBar from "@/app/_components/Sidebar/SideBar";
import { useParams } from "next/navigation";
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

  const [articleLoading, setArticleLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);

  const [articleContent, setArticleContent] = useState<ArticleType | null>(
    null
  );
  const [quiz, setQuiz] = useState([]);

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

  return (
    <div className="flex">
      <div className="px-2">
        {articleLoading && <p>Loading Content</p>}
        <p className="text-2xl font-bold">{articleContent?.title}</p>
        <p>{articleContent?.summary}</p>
        <div className="mt-5 border-t flex flex-col gap-10">
          {quiz.map((q: QuizSingles) => (
            <p key={q.id}>{q.question}</p>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Article;
