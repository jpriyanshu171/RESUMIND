"use client";
import { type FormEvent, useState, useRef } from "react";
import Navbar from "~/components/Navbar";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";
import { convertPdfToImage } from "~/lib/pdf2image";
import { motion } from "framer-motion";
import { Upload as UploadIcon, X } from "lucide-react";

const Upload = () => {
  const { fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    try {
      setIsProcessing(true);
      setStatusText("Uploading resume file...");
      const uploadedFile = await fs.upload([file]);
      if (!uploadedFile) throw new Error("Failed to upload resume");

      setStatusText("Converting PDF to image...");
      const imageFile = await convertPdfToImage(file);
      if (!imageFile || !imageFile.file) throw new Error("Failed to convert PDF");

      setStatusText("Uploading preview image...");
      const uploadedImage = await fs.upload([imageFile.file]);
      if (!uploadedImage) throw new Error("Failed to upload image");

      setStatusText("Preparing AI analysis...");
      const uuid = generateUUID();
      const resumeData = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: null,
      };
      await kv.set(`resume:${uuid}`, JSON.stringify(resumeData));

      setStatusText("Analyzing with AI...");
      const aiResponse = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({ jobTitle, jobDescription })
      );

      if (!aiResponse) throw new Error("AI analysis failed");

      const feedbackText =
        typeof aiResponse.message.content === "string"
          ? aiResponse.message.content
          : aiResponse.message.content?.[0]?.text;

      let parsedFeedback = null;
      try {
        parsedFeedback = JSON.parse(feedbackText);
      } catch {
        parsedFeedback = feedbackText; // fallback if not JSON
      }

      resumeData.feedback = parsedFeedback;
      await kv.set(`resume:${uuid}`, JSON.stringify(resumeData));

      setStatusText("Analysis complete! Redirecting...");
      navigate(`/resume/${uuid}`);
    } catch (err: any) {
      console.error(err);
      setStatusText(`Error: ${err.message || "Unknown error occurred"}`);
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return setStatusText("Please select a file to upload.");

    const form = e.currentTarget;
    const formData = new FormData(form);

    handleAnalyze({
      companyName: formData.get("company-name") as string,
      jobTitle: formData.get("job-title") as string,
      jobDescription: formData.get("job-description") as string,
      file,
    });
  };

  const handleFileClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  return (
    <main className="bg-gray-50 min-h-screen flex flex-col items-center font-ovo">
      <Navbar />
      <section className="max-w-3xl w-full px-6 py-20 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-3 text-center">
          Smart Feedback for Your Dream Job
        </h1>

        {!isProcessing ? (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-center mb-10"
          >
            Drop your resume for an ATS score and improvement tips
          </motion.h2>
        ) : (
          <>
            <h2 className="text-gray-600 text-center mb-6">{statusText}</h2>
            <img
              src="/images/resume-scan.gif"
              alt="Scanning Resume"
              className="w-28 animate-pulse mb-8"
            />
          </>
        )}

        {!isProcessing && (
          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-6 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg items-center"
          >
            {/** Company Name */}
            <input
              type="text"
              name="company-name"
              placeholder="Company Name"
              className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 outline-none w-full"
              required
            />

            {/** Job Title */}
            <input
              type="text"
              name="job-title"
              placeholder="Job Title"
              className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 outline-none w-full"
              required
            />

            {/** Job Description */}
            <textarea
              name="job-description"
              placeholder="Job Description"
              rows={6}
              className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 outline-none resize-none w-full"
              required
            />

            {/** Upload Resume */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center gap-2 w-full cursor-pointer"
              onClick={!file ? handleFileClick : undefined}
            >
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-8 w-full hover:border-amber-400 transition-all bg-gray-50 relative">
                {file ? (
                  <div className="flex flex-col items-center">
                    <UploadIcon className="w-10 h-10 text-green-600 mb-3" />
                    <span className="text-gray-800 font-medium text-center mb-3">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="flex items-center gap-1 text-red-500 text-sm font-medium hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <X size={16} /> Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadIcon className="w-10 h-10 text-amber-500 mb-2" />
                    <span className="text-gray-500 text-sm text-center">
                      Click or drag file to upload
                    </span>
                  </>
                )}
              </div>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </motion.div>

            {/** Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-amber-500 text-white px-10 py-3 rounded-2xl font-semibold shadow-md hover:bg-amber-600 transition-colors mt-4 self-center"
            >
              Analyze Resume
            </motion.button>
          </motion.form>
        )}
      </section>
    </main>
  );
};

export default Upload;
