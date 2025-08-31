"use client";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserCheck,
  FileText,
  Upload,
  Sparkles,
  BarChart3,
  Clock,
  Mail,
  Github,
  Linkedin,
  User,
  Star,
  Cpu,
} from "lucide-react";

import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";

// Define the types to ensure type safety in TypeScript
type Resume = {
  id: string;
  // Add other properties of the resume object here if needed
};

type KVItem = {
  key: string;
  value: string;
};

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
      const kvItems = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResumes = kvItems?.map((item) =>
        JSON.parse(item.value)
      ) as Resume[];
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, []);

  const faqs = [
    {
      q: "How quickly can I get feedback?",
      a: "Instant analysis is provided as soon as you upload your resume.",
    },
    {
      q: "Is my data secure?",
      a: "Absolutely. We never share your data with third parties.",
    },
    {
      q: "Can I track multiple resumes?",
      a: "Yes, manage and compare multiple resumes easily in your dashboard.",
    },
    {
      q: "Does it work for all industries?",
      a: "Yes! Resumind provides insights for tech, design, marketing, and more.",
    },
    {
      q: "Can I edit resumes after feedback?",
      a: "You can download suggestions and upload improved versions anytime.",
    },
  ];

  const testimonials = [
    {
      name: "Priya S.",
      review: "Resumind helped me land my dream job! Super intuitive.",
      rating: 5,
    },
    {
      name: "Rohan K.",
      review: "The AI suggestions are really smart. My resume improved drastically.",
      rating: 4,
    },
    {
      name: "Anita P.",
      review: "Easy to use, clean interface, and very helpful.",
      rating: 5,
    },
  ];

  const stats = [
    { label: "Resumes Analyzed", value: 12457 },
    { label: "Users Helped", value: 8932 },
    { label: "Skills Improved", value: 5600 },
  ];

  return (
    <main className="bg-gradient-to-b from-gray-50 to-white min-h-screen font-lato text-gray-800">
      <Navbar className="bg-white text-gray-800 shadow-sm flex justify-between items-center px-6 py-4" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-32 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Cpu className="w-16 h-16 text-purple-600 animate-pulse" />
            <h1 className="text-6xl font-extrabold font-oswald text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-green-500 animate-textGlow">
              Resumind
            </h1>
          </div>
          <h2 className="text-lg text-gray-600 mb-4 animate-fadeIn">
            Analyze. Optimize. Impress.
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-10 text-lg">
            Upload your resume & get{" "}
            <strong className="text-purple-600">AI-powered insights instantly</strong>.
            Track submissions, see analytics, and dominate interviews.
          </p>
          <Link
            to="/upload"
            className="inline-block px-12 py-5 font-semibold text-white rounded-full bg-gradient-to-r from-green-500 to-green-700 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold font-oswald mb-12">Resumind in Numbers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-transform"
              >
                <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-green-500 mb-2">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-gray-600 font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold font-oswald mb-16">Why Choose Resumind?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Insights",
                text: "Smart suggestions to make your resume stand out.",
              },
              {
                icon: BarChart3,
                title: "ATS Compatible",
                text: "Optimized for Applicant Tracking Systems to get noticed.",
              },
              {
                icon: Clock,
                title: "Save Time",
                text: "Instant analysis to improve your resume quickly.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="bg-gray-800 text-white rounded-3xl p-8 shadow-lg transform hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
              >
                <feature.icon className="w-12 h-12 mb-4 text-purple-400" />
                <h3 className="text-2xl font-bold font-oswald mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold font-oswald mb-12">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          {[
            { step: "1", text: "Upload your resume" },
            { step: "2", text: "Get instant AI analysis" },
            { step: "3", text: "Improve & impress recruiters" },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-green-500 transform hover:translate-y-2 transition-transform"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              <div className="text-4xl font-extrabold text-green-500 mb-4">
                {item.step}
              </div>
              <p className="text-gray-700 text-lg">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Resume Submissions */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl font-bold font-oswald">Your Resume Submissions</h2>
          <p className="text-gray-600 mt-2">
            Track all your uploads and feedback in one place
          </p>
        </div>

        {loadingResumes && (
          <div className="flex justify-center">
            <img
              src="/images/resume-scan-2.gif"
              alt="Loading"
              className="w-32 animate-pulse"
            />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
            {resumes.map((resume) => (
              <motion.div
                key={resume.id}
                className="bg-white rounded-2xl shadow hover:shadow-xl p-6 transition-shadow"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ResumeCard resume={resume} />
              </motion.div>
            ))}
          </div>
        )}

        {!loadingResumes && resumes.length === 0 && (
          <div className="flex justify-center mt-10">
            <Link
              to="/upload"
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              <Upload /> Upload Resume
            </Link>
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold font-oswald text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-3xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow border-l-4 border-purple-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
            >
              <h3 className="font-semibold text-gray-800 mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-100">
        <h2 className="text-4xl font-bold font-oswald text-center mb-12">What Users Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <User className="w-10 h-10 text-green-500" />
                <span className="font-semibold text-lg">{t.name}</span>
              </div>
              <p className="text-gray-600 mb-2 italic">"{t.review}"</p>
              <div className="flex gap-1 text-yellow-400">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="w-5 h-5 fill-current" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section with Image */}
      <section className="bg-gradient-to-b from-purple-50 to-pink-50 py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold font-oswald mb-6 text-purple-700">
              Get in Touch
            </h2>
            <div className="flex justify-center mb-6">
              <img
                src="/image_e62d7d.jpg"
                alt="Contact Us"
                className="w-full max-w-sm h-auto rounded-xl shadow-lg"
              />
            </div>
            <p className="text-gray-600">
              Have questions or suggestions? Send us a message and we'll get back
              to you promptly!
            </p>
          </motion.div>

          <form className="space-y-6 bg-white p-8 rounded-3xl shadow-xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="flex-1 p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="flex-1 p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              />
            </div>

            <textarea
              placeholder="Your Message"
              className="w-full p-4 h-36 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-gradient-to-r from-purple-500 to-green-500 text-white font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p>
            &copy; {new Date().getFullYear()} Resumind. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="https://github.com/" target="_blank" rel="noreferrer">
              <Github className="w-6 h-6 hover:text-green-500 transition-colors" />
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noreferrer">
              <Linkedin className="w-6 h-6 hover:text-green-500 transition-colors" />
            </a>
            <a href="mailto:hello@resumind.com">
              <Mail className="w-6 h-6 hover:text-green-500 transition-colors" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}