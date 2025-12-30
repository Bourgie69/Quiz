import StarIcon from "@/app/_icons/StarIcon";

const Quiz = (props: any) => {
  const { articleQuiz, quizQuestion, handleAnswer } = props;

  return (
    <div className="flex flex-col gap-3 mt-20  mx-auto p-5 h-fit w-[800]">
      <div className="flex items-center gap-2">
        <StarIcon />
        <p className="text-lg font-bold">Quick test</p>
      </div>
      <p className=" text-gray-500">
        Take a quick test about your knowledge from your content{" "}
      </p>

      <div className="bg-white border rounded-2xl p-5 w-full mx-auto">
        <div className="flex gap-5 justify-between text-center font-semibold text-lg mb-2">
          <p>{articleQuiz[quizQuestion].question}</p>
          <p>{quizQuestion}/5</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {articleQuiz[quizQuestion].options.map(
            (item: number, index: number) => (
              <p
                onClick={() => handleAnswer(index)}
                key={index}
                className="border flex justify-center items-center text-center p-2 h-20 rounded-lg text-black bg-white overflow-x-auto cursor-pointer"
              >
                {item}
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
