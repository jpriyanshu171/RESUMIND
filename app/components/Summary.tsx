import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string; score: number }) => {
  const textColor =
    score > 70
      ? "text-green-600"
      : score > 49
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 rounded-xl p-3 md:p-4 mt-3 shadow-sm">
      <p className="text-base md:text-lg font-semibold">{title}</p>
      <div className="flex items-center gap-2 md:gap-3 mt-2 md:mt-0">
        <ScoreBadge score={score} />
        <span className={`text-lg md:text-xl font-bold ${textColor}`}>
          {score}/100
        </span>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md w-full p-4 md:p-6 flex flex-col gap-4 md:gap-6">
      {/* Header with Overall Score */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <ScoreGauge score={feedback.overallScore} />
        <div className="flex flex-col gap-1 text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold">Your Resume Score</h2>
          <p className="text-sm text-gray-500">
            Calculated based on the categories listed below.
          </p>
        </div>
      </div>

      {/* Category Scores */}
      <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
      <Category title="Content" score={feedback.content.score} />
      <Category title="Structure" score={feedback.structure.score} />
      <Category title="Skills" score={feedback.skills.score} />
    </div>
  );
};

export default Summary;
