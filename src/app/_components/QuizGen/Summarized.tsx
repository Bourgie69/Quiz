import SummaryIcon from "@/app/_icons/SummaryIcon";
import { Spinner } from "@/components/ui/spinner";

const Summarized = (props: any) => {
  const { loading, summary, title } = props;

  return (
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
      <p>{summary}</p>
    </div>
  );
};

export default Summarized;
