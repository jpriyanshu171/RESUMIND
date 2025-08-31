"use client";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/resume/${id}`);
  }, [isLoading, auth]);

  // Load resume and feedback
  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;
      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;
      setResumeUrl(URL.createObjectURL(new Blob([resumeBlob], { type: "application/pdf" })));

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      setImageUrl(URL.createObjectURL(imageBlob));

      setFeedback(data.feedback);
    };

    loadResume();
  }, [id]);

  return (
    <main className="bg-gray-50 min-h-screen font-ovo px-6 py-12 flex flex-col items-center relative">

      {/* Top-left Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-6"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 bg-white shadow-md rounded-full hover:bg-amber-100 transition-colors font-semibold text-gray-800"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <div className="mt-4" />
      </motion.div>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Detailed Insights for Your Dream Job
        </h1>
        <p className="text-gray-600 text-center">
          Get ATS score, feedback & improvement tips for your resume.
        </p>
      </motion.div>

      {/* Resume Preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 w-full flex justify-center"
      >
        {imageUrl && resumeUrl ? (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-3xl shadow-lg overflow-hidden max-w-md hover:scale-105 transition-transform bg-white border border-gray-300" // thin gray border
          >
            <img
              src={imageUrl}
              alt="resume preview"
              className="w-full h-full object-contain"
            />
          </a>
        ) : (
          <div className="flex justify-center items-center w-full max-w-md h-96 bg-white rounded-3xl shadow-lg animate-pulse border border-gray-300" /> // placeholder with same border
        )}
      </motion.div>

      {/* Full-width Summary & ATS */}
      {feedback && (
        <motion.div
          className="w-full max-w-6xl flex flex-col gap-8 mb-12"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-md p-8"
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          >
            <h2 className="text-2xl font-semibold mb-4">Summary</h2>
            <Summary feedback={feedback} />
          </motion.div>

          <motion.div
            className="bg-white rounded-3xl shadow-md p-8"
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          >
            <h2 className="text-2xl font-semibold mb-4">ATS Feedback</h2>
            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
          </motion.div>
        </motion.div>
      )}

      {/* Grid-style Single Cards */}
      {feedback && (
        <motion.div
          className="w-full max-w-6xl flex flex-col gap-8"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-md p-8"
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          >
            <h2 className="text-xl font-semibold mb-4">Others</h2>
            <Details feedback={feedback} section="tone_style" />
          </motion.div>
        </motion.div>
      )}
    </main>
  );
};

export default Resume;
