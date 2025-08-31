"use client";
import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { UserCheck, FileText } from "lucide-react";
import { FaUpload } from "react-icons/fa";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResumes = resumes?.map((resume) =>
        JSON.parse(resume.value)
      ) as Resume[];
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen text-gray-800 font-ovo">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero / Tagline */}
        <div className="text-center mb-16">
          <h2 className="text-lg text-gray-600 mb-2">Analyze. Optimize. Impress.</h2>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Smart Resume Feedback for Your Dream Job
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your resume and get actionable insights to make your application stand out. Track submissions and review feedback in one place.
          </p>
        </div>

        {/* Review Submissions */}
        <div id="review-submissions" className="mb-8 text-center">
          {!loadingResumes && resumes?.length === 0 ? (
            <h2 className="flex items-center justify-center gap-2 text-gray-600 text-lg">
              <FileText className="w-5 h-5 text-gray-400" /> No resumes found
            </h2>
          ) : (
            <h2 className="flex items-center justify-center gap-2 text-gray-600 text-lg">
              <UserCheck className="w-5 h-5 text-gray-400" /> Review submissions
            </h2>
          )}
        </div>

        {/* Loading */}
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img
              src="/images/resume-scan-2.gif"
              alt="Loading resumes"
              className="w-32 animate-pulse"
            />
          </div>
        )}

        {/* Resumes Grid */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4"
              >
                <ResumeCard resume={resume} />
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-all duration-300"
            >
              <FaUpload /> Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
