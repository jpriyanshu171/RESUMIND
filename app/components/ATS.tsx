import React from "react";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Determine background gradient based on score
  const gradientClass =
    score > 69 ? "from-green-100" : score > 49 ? "from-yellow-100" : "from-red-100";

  // Determine icon based on score
  const iconSrc =
    score > 69 ? "/icons/ats-good.svg" : score > 49 ? "/icons/ats-warning.svg" : "/icons/ats-bad.svg";

  // Determine subtitle based on score
  const subtitle = score > 69 ? "Great Job!" : score > 49 ? "Good Start" : "Needs Improvement";

  return (
    <div className={`bg-gradient-to-b ${gradientClass} to-white rounded-xl shadow-sm w-full p-4 flex flex-col gap-4`}>
      
      {/* Top section with icon and headline */}
      <div className="flex items-center gap-3">
        <img src={iconSrc} alt="ATS Score Icon" className="w-8 h-8" />
        <div>
          <h2 className="text-xl font-bold">{score}/100 ATS Score</h2>
          <h3 className="text-sm font-medium text-gray-600">{subtitle}</h3>
        </div>
      </div>

      {/* Suggestions section */}
      <div className="flex flex-col gap-2">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-start gap-2">
            <img
              src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
              alt={suggestion.type === "good" ? "Check" : "Warning"}
              className="w-4 h-4 mt-1"
            />
            <p className={suggestion.type === "good" ? "text-green-700 text-sm" : "text-amber-700 text-sm"}>
              {suggestion.tip}
            </p>
          </div>
        ))}
      </div>

      {/* Closing encouragement */}
      <p className="text-gray-700 italic text-sm mt-2">
        Keep refining your resume to improve your chances of passing ATS filters.
      </p>
    </div>
  );
};

export default ATS;
