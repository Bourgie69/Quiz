"use client";

import StarIcon from "@/app/_icons/StarIcon";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SummaryIcon from "@/app/_icons/SummaryIcon";
import { Spinner } from "@/components/ui/spinner";
import { raw } from "@prisma/client/runtime/library";
import CorrectIcon from "@/app/_icons/CorrectIcon";
import IncorrectIcon from "@/app/_icons/IncorrectIcon";

type Quiz = {
  question: string;
  options: string[];
  answer: string;
}[];

const QuizGen = () => {
  const [title, setTitle] = useState("");
  const [article, setArticle] = useState("");

  const [loading, setLoading] = useState(false);

  const [isSummarized, setIsSummarized] = useState(2);
  const [geminiResponse, setGeminiResponse] = useState({
    summary:
      "The article critiques League of Legends for its current staleness, attributing it primarily to \"feature creep\" in roles like the jungle, which overburdens players with too many permanent responsibilities, and a lack of meaningful item changes. The author contrasts LoL's approach with Teamfight Tactics, which successfully rotates features seasonally, arguing that LoL's features are added with the intention of permanence, contributing to complexity and an unengaging meta. The author dismisses Riot's justification of slow change to protect new players, contending it alienates the active player base. The proposed solution is for League of Legends to adopt TFT's seasonal rotation philosophy for both features and items, allowing for fresh gameplay dynamics and making permanence conditional on a feature's long-term health for the game.",
    quiz: [
      {
        question:
          'According to the article, what is "feature creep" in the context of League of Legends?',
        options: [
          "When the game's graphics become outdated due to constant updates.",
          "The continuous addition of features that slowly make the game too complex and pressure gameplay.",
          "A bug that causes champions to move slowly across the map.",
          "The increasing number of playable champions in the game.",
        ],
        answer: 1,
      },
      {
        question:
          'The author states that the "amount of responsibility" in the jungle role is "simply not fun." What specific element does the author suggest is *not* the primary cause of players dropping the role?',
        options: [
          "Keeping an eye on the state of 3 lanes.",
          "Calculating which objective to play for.",
          "The fear of miscalculating and causing the team to fall behind.",
          "Camp management.",
        ],
        answer: 3,
      },
      {
        question:
          "How does the article contrast Riot's approach to new features in Teamfight Tactics (TFT) compared to League of Legends (LoL)?",
        options: [
          "TFT features are more complex, while LoL features are simpler.",
          "TFT features are designed to be permanent additions from the start, unlike LoL.",
          "TFT features are introduced with the intention of being rotated out after a set, while LoL features tend to be permanent.",
          "TFT focuses solely on balance changes, not new features, whereas LoL frequently adds new content.",
        ],
        answer: 2,
      },
      {
        question:
          "What reason did Riot's Phroxzon give for not implementing large game shakeups outside of season starts?",
        options: [
          "Active players prefer a consistent meta.",
          "Developers lack the resources for frequent major updates.",
          "A high rate of change is particularly damaging to new and reviving players.",
          "Esports events require a stable game environment.",
        ],
        answer: 2,
      },
      {
        question:
          "What is the author's primary proposed solution to combat the staleness in League of Legends?",
        options: [
          "Revert all recent feature additions to simplify the game.",
          "Introduce a new role to distribute jungle responsibility.",
          "Adopt Teamfight Tactics' philosophy of rotating features and items seasonally.",
          "Buff underperforming champions and nerf overpowered ones more frequently.",
        ],
        answer: 2,
      },
    ],
  });

  const [quizQuestion, setQuizQuestion] = useState(0);

  const [tally, setTally] = useState(0);

  const [rightAnswers, setRightAnswers] = useState([0, 0, 0, 0, 0]);
  const [yourAnswers, setYourAnswers] = useState([0, 0, 0, 0, 0]);

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

  const handleAnswer = (index: number) => {
    const correct = geminiResponse.quiz[quizQuestion].answer;
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
              <p>{geminiResponse.quiz[quizQuestion].question}</p>
              <p>{quizQuestion}/5</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {geminiResponse.quiz[quizQuestion].options.map((item, index) => (
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
              {geminiResponse.quiz.map((item, index) => (
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
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setQuizQuestion(0);
                  setTally(0);
                }}
              >
                Restart quiz
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuizGen;
