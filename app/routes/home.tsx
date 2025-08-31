"use client";
import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  UserCheck,
  FileText,
  Sparkles,
  BarChart3,
  Clock,
  Mail,
  Plus,
  Minus,
} from "lucide-react";
import {
  FaUpload,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";

// FAQItem Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className="bg-white rounded-3xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{question}</h3>
        {isOpen ? (
          <Minus className="w-6 h-6 text-amber-500" />
        ) : (
          <Plus className="w-6 h-6 text-amber-500" />
        )}
      </div>
      {isOpen && <p className="text-gray-700 mt-4">{answer}</p>}
    </div>
  );
}

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
    <main className="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-ovo">
      <Navbar />

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 py-28 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-purple-50 to-white opacity-30 rounded-3xl -z-10"></div>
        <h4 className="text-lg text-gray-600 mb-3 tracking-wide">
          Analyze. Optimize. Impress.
        </h4>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          Smart Resume Feedback for Your Dream Job
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto mb-8 text-lg">
          Upload your resume and get actionable insights to make your
          application stand out. Track submissions and review feedback in one
          place.
        </p>
        <img
          src="/images/five.jpeg"
          alt="Hero Image"
          className="mx-auto w-80 sm:w-96 md:w-[28rem] rounded-3xl object-cover shadow-2xl"
        />
      </section>

      {/* Why Choose Resumind */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-purple-700">
          Why Choose Resumind?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
            <Sparkles className="w-16 h-16 text-amber-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">AI-Powered Feedback</h3>
            <p className="text-gray-700">
              Our AI analyzes your resume instantly and provides actionable
              insights so you can impress recruiters.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
            <BarChart3 className="w-16 h-16 text-amber-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">
              Skill Score & Formatting
            </h3>
            <p className="text-gray-700">
              We evaluate your skills, formatting, and structure to ensure your
              resume meets industry standards.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
            <Clock className="w-16 h-16 text-amber-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Fast & Easy</h3>
            <p className="text-gray-700">
              Get your resume analyzed in minutes and receive a detailed report
              without wasting any time.
            </p>
          </div>
        </div>
      </section>

      {/* How Resumind Works */}
      <section className="max-w-6xl mx-auto px-6 py-24 space-y-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          How Resumind Works
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-10">
          <img
            src="/images/three.jpeg"
            alt="Upload Resume"
            className="w-64 md:w-96 rounded-2xl object-cover shadow-lg"
          />
          <div className="md:w-1/2 text-center md:text-left">
            <h3 className="text-2xl font-semibold mb-4">Upload Your Resume</h3>
            <p className="text-gray-700">
              Upload your resume in PDF or DOCX format. Our system immediately
              starts analyzing your document to give actionable insights.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-10 md:flex-row-reverse">
          <img
            src="/images/feedback.jpeg"
            alt="Get Feedback"
            className="w-64 md:w-96 rounded-2xl object-cover shadow-lg"
          />
          <div className="md:w-1/2 text-center md:text-left">
            <h3 className="text-2xl font-semibold mb-4">Get Smart Feedback</h3>
            <p className="text-gray-700">
              Our AI-powered system evaluates your resume sections, highlighting
              strengths and weaknesses. You’ll get precise suggestions to
              improve formatting and skills.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-10">
          <img
            src="/images/six.jpeg"
            alt="Stand Out"
            className="w-64 md:w-96 rounded-2xl object-cover shadow-lg"
          />
          <div className="md:w-1/2 text-center md:text-left">
            <h3 className="text-2xl font-semibold mb-4">Stand Out & Impress</h3>
            <p className="text-gray-700">
              Your improved resume now stands out to recruiters. Apply with
              confidence knowing you’ve optimized your skills and experience.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-6 py-20 space-y-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-purple-700">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              question: "What resume formats are supported?",
              answer:
                "We support PDF and DOCX formats. Make sure your resume is properly formatted before uploading.",
            },
            {
              question: "How fast is the feedback?",
              answer:
                "Feedback is instant after upload! You can view detailed analysis in seconds.",
            },
            {
              question: "Is my resume private?",
              answer:
                "Absolutely. Your data is secure and never shared with third parties.",
            },
            {
              question: "Can I re-upload my resume?",
              answer:
                "Yes! You can upload multiple versions and track improvements over time.",
            },
            {
              question: "Does Resumind work on mobile?",
              answer:
                "Yes! The platform is fully responsive and works on all devices.",
            },
          ].map((faq, idx) => (
            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>

      {/* Contact Us */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-purple-700">
          Contact Us
        </h2>
        <div className="flex flex-col md:flex-row items-start gap-16">
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <h3 className="text-2xl font-semibold mb-2">Get in Touch</h3>
            <p className="text-gray-700">
              Have questions, feedback, or want to work with us? Fill out the
              form and our team will get back to you as soon as possible.
            </p>
            <p className="text-gray-700">
              Email:{" "}
              <a href="mailto:jpriyanshu171@gmail.com" className="text-amber-600">
                support@resumind.com
              </a>
            </p>
            <p className="text-gray-700">
              Phone:{" "}
              <a href="tel:+91 8368267807" className="text-amber-600">
                +91 8368267807
              </a>
            </p>
          </div>
          <form className="md:w-1/2 flex flex-col items-center gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="bg-amber-600 text-white px-8 py-3 rounded-xl hover:bg-amber-700 transition-all duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          {/* Left: Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-amber-500">ResuMind</h3>
            <p className="text-gray-300">
              Smart resume analyzer to help you stand out. Upload your resume
              and get actionable feedback instantly.
            </p>
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Resumind. All rights reserved.
            </p>
          </div>

          {/* Right: Social Links */}
          <div className="space-y-4 text-center md:text-right">
            <h3 className="text-xl font-semibold text-amber-500">Follow Us</h3>
            <div className="flex justify-center md:justify-end gap-6 text-2xl">
              <a
                href="https://github.com/jpriyanshu171"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-500 transition-colors"
              >
                <FaGithub />
              </a>
              <a
                href="https://instagram.com/jpriyanshu171"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-500 transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com/in/priyanshujaiswal171"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-500 transition-colors"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://twitter.com/jpriyanshu171"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-500 transition-colors"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
