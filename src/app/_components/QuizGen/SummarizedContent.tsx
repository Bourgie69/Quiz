import SummaryIcon from "@/app/_icons/SummaryIcon";

const SummarizedContent = (props) => {
  const { title, article, response } = props;

  return (
    <div>
      <div className="flex items-center gap-2">
        <SummaryIcon/>
        <p className="text-sm text-gray-500">Summarized content</p>
      </div>
      <p className="text-2xl font-bold">
        {title}
      </p>
      <p>{response}</p>
    </div>
  );
};

export default SummarizedContent