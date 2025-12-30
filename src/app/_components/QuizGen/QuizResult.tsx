"use client";

import CorrectIcon from "@/app/_icons/CorrectIcon";
import IncorrectIcon from "@/app/_icons/IncorrectIcon";
import RestartIcon from "@/app/_icons/RestartIcon";
import SaveIcon from "@/app/_icons/SaveIcon";
import StarIcon from "@/app/_icons/StarIcon";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { QuizSingles } from "./QuizGen";

const QuizResult = (props: any) => {
  const {
    quiz,
    yourAnswers,
    rightAnswers,
    setQuizQuestion,
    tally,
    setTally,
    handleSendQuiz,
    handleLeave,
    isOld
  } = props;
  return (
    <div className="mx-auto mt-20 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <StarIcon />
        <p className="text-lg font-bold">Quiz completed</p>
      </div>
      <p className=" text-gray-500">Let's see how you did! </p>
      <div className="w-100 bg-white border border-violet-500 rounded-lg p-2">
        <p>
          <span className="text-2xl font-semibold">Your Score : {tally}</span> /
          5
        </p>

        <div className="flex flex-col gap-5 mt-5">
          {quiz.map((item: QuizSingles, index: number) => (
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
            onClick={() => {isOld === false ?
              handleSendQuiz() : 
              handleLeave()
            }}
          >
            <SaveIcon />
            Save and Leave  
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
