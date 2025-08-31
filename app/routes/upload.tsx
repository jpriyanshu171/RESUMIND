"use client";
import { type FormEvent, useState, useRef } from "react";
import Navbar from "~/components/Navbar";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";
import { convertPdfToImage } from "~/lib/pdf2image";
import { motion } from "framer-motion";
// import { Upload as UploadIcon } from "lucide-react";
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
    setIsProcessing(true);

    setStatusText("Uploading the file...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText("Error: Failed to upload file");

    setStatusText("Converting to image...");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file)
      return setStatusText("Error: Failed to convert PDF to image");

    setStatusText("Uploading the image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText("Error: Failed to upload image");

    setStatusText("Preparing data...");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analyzing...");
    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );
    if (!feedback) return setStatusText("Error: Failed to analyze resume");

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analysis complete, redirecting...");
    navigate(`/resume/${uuid}`);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  return (
    <main className="bg-gray-50 min-h-screen flex flex-col items-center font-ovo">
      <Navbar />

      <section className="max-w-3xl w-full px-6 py-20 flex flex-col items-center">
        {/* Heading */}
        <h1 className="text-4xl font-bold mb-3 text-center">
          Smart Feedback for Your Dream Job
        </h1>

        {/* Subtitle / Status */}
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

        {/* Upload Form */}
        {!isProcessing && (
          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-6 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg items-center"
          >
            {/* Company Name */}
            <div className="w-full flex flex-col">
              <label
                htmlFor="company-name"
                className="text-gray-700 font-medium text-sm mb-1"
              >
                Company Name
              </label>
              <input
                type="text"
                name="company-name"
                id="company-name"
                placeholder="Company Name"
                className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 outline-none w-full"
                required
              />
            </div>

            {/* Job Title */}
            <div className="w-full flex flex-col">
              <label
                htmlFor="job-title"
                className="text-gray-700 font-medium text-sm mb-1"
              >
                Job Title
              </label>
              <input
                type="text"
                name="job-title"
                id="job-title"
                placeholder="Job Title"
                className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 outline-none w-full"
                required
              />
            </div>

            {/* Job Description */}
            <div className="w-full flex flex-col">
              <label
                htmlFor="job-description"
                className="text-gray-700 font-medium text-sm mb-1"
              >
                Job Description
              </label>
              <textarea
                rows={6}
                name="job-description"
                id="job-description"
                placeholder="Job Description"
                className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 outline-none resize-none w-full"
                required
              />
            </div>

            {/* Upload Resume */}
            {/* Upload Resume */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center gap-2 w-full cursor-pointer"
              onClick={!file ? handleFileClick : undefined} // only open picker if no file
            >
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-8 w-full hover:border-amber-400 transition-all bg-gray-50 relative">
                {file ? (
                  // ✅ Show file name + remove option with icon
                  <div className="flex flex-col items-center">
                    <UploadIcon className="w-10 h-10 text-green-600 mb-3" />
                    <span className="text-gray-800 font-medium text-center mb-3">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent triggering fileInput click
                        setFile(null);
                      }}
                      className="flex items-center gap-1 text-red-500 text-sm font-medium hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <X size={16} /> Remove
                    </button>
                  </div>
                ) : (
                  // Default message
                  <>
                    <UploadIcon className="w-10 h-10 text-amber-500 mb-2" />
                    <span className="text-gray-500 text-sm text-center">
                      Click or drag file to upload
                    </span>
                  </>
                )}
              </div>

              <input
                title="Select your resume file to upload"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </motion.div>

            {/* Submit Button */}
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
