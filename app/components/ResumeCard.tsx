import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };
    loadResume();
  }, [imagePath]);

  return (
    <Link
      to={`/resume/${id}`}
      className="transition transform hover:scale-105 shadow-md rounded-2xl bg-white p-4 animate-in fade-in duration-1000"
    >
      <div className="flex flex-col gap-4">
        {/* Header: Company & Job with Score */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg break-words">
              {companyName || "Resume"}
            </h2>
            {jobTitle && (
              <h3 className="text-gray-500 text-sm break-words">{jobTitle}</h3>
            )}
          </div>
          <div className="flex-shrink-0">
            <ScoreCircle score={feedback.overallScore} size={60} />
          </div>
        </div>

        {/* Resume Image with scroll */}
        {resumeUrl && (
          <div className="border border-black rounded-lg overflow-y-auto max-h-[400px]">
            <img
              src={resumeUrl}
              alt="resume"
              className="w-full h-auto object-contain"
            />
          </div>
        )}
      </div>
    </Link>
  );
};

export default ResumeCard;
