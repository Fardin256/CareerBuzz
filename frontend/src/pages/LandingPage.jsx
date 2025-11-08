// frontend/src/pages/LandingPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/client"; // axios instance (baseURL to backend)
import { FiMoon, FiSun, FiSend, FiMessageCircle } from "react-icons/fi";

/**
 * LandingPage.jsx
 * - Requires: framer-motion, react-icons, axios client at ../api/client
 * - Tailwind CSS must be configured (dark mode: class)
 *
 * Usage:
 * Add route: <Route path="/" element={<LandingPage />} />
 */

function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg border hover:shadow-md transition"
    >
      {theme === "dark" ? <FiSun /> : <FiMoon />}
    </button>
  );
}

export default function LandingPage() {
  // theme
  const [theme, setTheme] = useState(
    () =>
      (typeof window !== "undefined" && localStorage.getItem("cb_theme")) ||
      "dark"
  );

  useEffect(() => {
    localStorage.setItem("cb_theme", theme);
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // mini skill analyzer demo
  const [demoInput, setDemoInput] = useState("");
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState(null);
  const handleAnalyze = async () => {
    if (!demoInput.trim()) return;
    setDemoLoading(true);
    try {
      const res = await API.post("/api/analyze", {
        skills: demoInput.split(",").map((s) => s.trim()),
      });
      setDemoResult(res.data);
    } catch (e) {
      setDemoResult({ error: "Server error. Try later." });
    } finally {
      setDemoLoading(false);
    }
  };

  // feedback form
  const [feedback, setFeedback] = useState({ name: "", email: "", msg: "" });
  const [fbStatus, setFbStatus] = useState(null);
  const sendFeedback = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/feedback", feedback); // backend route to store message
      setFbStatus("sent");
      setFeedback({ name: "", email: "", msg: "" });
    } catch (err) {
      setFbStatus("error");
    }
  };

  // Chatbot drawer
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: "bot", text: "Hi! I'm CareerBuzz assistant — how can I help?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const sendChat = async () => {
    if (!chatInput.trim()) return;
    // append
    const userMsg = { from: "user", text: chatInput };
    setChatMessages((m) => [...m, userMsg]);
    setChatInput("");
    // send to backend (or store) - /api/chat/send
    try {
      const res = await API.post("/api/chat/send", { message: userMsg.text });
      // backend will respond with placeholder or store for team to reply
      setChatMessages((m) => [...m, { from: "bot", text: res.data.reply || "Thanks — we'll reply soon." }]);
    } catch (e) {
      setChatMessages((m) => [...m, { from: "bot", text: "Failed to send message. Try again later." }]);
    }
  };

  // animations
  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* NAV */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-xl">
            CB
          </div>
          <div>
            <div className="font-extrabold text-lg">Career<span className="text-indigo-400">Buzz</span></div>
            <div className="text-xs text-slate-500 dark:text-slate-300">Smart career suggestions</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <Link to="/login" className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-slate-800 transition">Login</Link>
          <Link to="/register" className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-400 transition">Register</Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Design your <span className="text-indigo-500 dark:text-indigo-400">career roadmap</span> with confidence
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Enter your skills, discover matching careers, and follow an animated, personalized roadmap — CareerBuzz helps you become job-ready faster.
          </p>

          <div className="flex gap-3 items-center">
            <input
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              placeholder="Try demo: python, sql, pandas"
              className="px-4 py-3 rounded-lg w-72 text-black"
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAnalyze}
              className="px-4 py-3 rounded-lg bg-indigo-500 text-white shadow hover:bg-indigo-400"
            >
              {demoLoading ? "Analyzing..." : "Try Demo"}
            </motion.button>
          </div>

          {demoResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border">
              <div className="text-sm text-slate-500 dark:text-slate-300">Suggested Careers</div>
              {Array.isArray(demoResult) ? (
                <ul className="mt-2 list-disc list-inside">
                  {demoResult.map((r, i) => (
                    <li key={i} className="font-semibold">{r.title || r}</li>
                  ))}
                </ul>
              ) : demoResult.error ? (
                <div className="text-sm text-rose-400">{demoResult.error}</div>
              ) : (
                <div className="mt-2">{JSON.stringify(demoResult)}</div>
              )}
            </motion.div>
          )}
        </motion.div>

        <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} className="relative">
          <div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 shadow-2xl">
            <div className="text-sm text-slate-500 dark:text-slate-300 mb-3">Animated Roadmap Preview</div>

            {/* simple roadmap mock */}
            <div className="space-y-4">
              {["Basics", "Intermediate", "Projects", "Portfolio", "Apply"].map((s, i) => (
                <motion.div key={s} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.12 }} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i===0 ? 'bg-indigo-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>{i+1}</div>
                  <div>
                    <div className="font-semibold">{s}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{s === "Projects" ? "Build 2 demo projects" : "Learn core concepts"}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* decorative floating card */}
          <motion.div className="absolute -right-8 -bottom-10 w-40 h-56 rounded-3xl bg-gradient-to-tr from-indigo-500/30 to-pink-400/20 blur-lg opacity-60" animate={{ rotate: [0, 4, -2, 0] }} transition={{ duration: 6, repeat: Infinity }} />
        </motion.div>
      </header>

      <main className="max-w-6xl mx-auto px-6 space-y-16">
        {/* FEATURES */}
        <section>
          <motion.h3 initial="hidden" animate="show" variants={fadeUp} className="text-2xl font-bold mb-6">Features</motion.h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Skill Gap Analysis", desc: "Find what you need to learn next." },
              { title: "Personalized Roadmaps", desc: "Step-by-step learning paths." },
              { title: "Progress Tracker", desc: "Track progress and earn badges." },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.08 }} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl shadow hover:shadow-lg transition">
                <div className="font-semibold text-lg mb-2">{f.title}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ABOUT + TESTIMONIALS */}
        <section className="grid md:grid-cols-2 gap-6">
          <motion.div initial={fadeUp.hidden} animate={fadeUp.show} transition={{ duration: 0.5 }} className="p-6 rounded-xl bg-gradient-to-tr from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 shadow">
            <h4 className="text-xl font-bold mb-2">About CareerBuzz</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              CareerBuzz is an AI-assisted platform that converts your skills into actionable career pathways.
              Our mission is to make career planning accessible, data-driven, and motivating.
            </p>
          </motion.div>

          <motion.div initial={fadeUp.hidden} animate={fadeUp.show} transition={{ duration: 0.5, delay: 0.08 }} className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800 shadow">
            <h4 className="text-xl font-bold mb-4">What users say</h4>
            <div className="space-y-3">
              <div className="rounded-lg p-3 bg-white dark:bg-slate-700 shadow">
                <div className="font-semibold">Aisha — Student</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">"The roadmap helped me land my internship!"</div>
              </div>
              <div className="rounded-lg p-3 bg-white dark:bg-slate-700 shadow">
                <div className="font-semibold">Ravi — Junior Dev</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">"Simple and actionable guidance."</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* FOOTER + FEEDBACK */}
        <section className="p-6 rounded-xl bg-slate-100 dark:bg-slate-900 shadow">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-bold text-lg">Send Feedback</h5>
              <form onSubmit={sendFeedback} className="mt-4 space-y-3">
                <input required value={feedback.name} onChange={(e) => setFeedback({...feedback, name: e.target.value})} placeholder="Your name" className="w-full p-3 rounded-lg text-black" />
                <input required value={feedback.email} onChange={(e) => setFeedback({...feedback, email: e.target.value})} placeholder="Email" className="w-full p-3 rounded-lg text-black" />
                <textarea required value={feedback.msg} onChange={(e) => setFeedback({...feedback, msg: e.target.value})} placeholder="Message" className="w-full p-3 rounded-lg text-black h-24" />
                <div className="flex items-center gap-3">
                  <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-500 text-white">Send</button>
                  {fbStatus === "sent" && <div className="text-green-500">Thanks — we received your feedback.</div>}
                  {fbStatus === "error" && <div className="text-rose-400">Failed to send. Try later.</div>}
                </div>
              </form>
            </div>

            <div>
              <h5 className="font-bold text-lg">Contact & Chat</h5>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">Use our AI assistant for quick queries or leave a message — we'll reply in your dashboard messages/email.</p>
              <div className="flex gap-3">
                <button onClick={() => setChatOpen(true)} className="px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border">Open Chat <FiMessageCircle className="inline ml-2" /></button>
                <Link to="/register" className="px-4 py-2 rounded-lg bg-indigo-500 text-white">Get Started</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* CHAT DRAWER */}
      <AnimatePresence>
        {chatOpen && (
          <motion.aside initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} transition={{ type: "spring" }} className="fixed right-6 bottom-6 w-96 h-5/6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 z-50">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold">CareerBuzz Chat</div>
              <div className="flex gap-2 items-center">
                <button onClick={() => setChatOpen(false)} className="px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700">Close</button>
              </div>
            </div>

            <div className="flex-1 overflow-auto space-y-3 p-2">
              {chatMessages.map((m, i) => (
                <div key={i} className={`max-w-[85%] p-3 rounded-lg ${m.from === "bot" ? "bg-slate-100 dark:bg-slate-700 self-start" : "bg-indigo-500 text-white self-end ml-auto"}`}>
                  {m.text}
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Send a message..." className="flex-1 p-3 rounded-lg text-black" />
              <button onClick={sendChat} className="px-4 py-3 rounded-lg bg-indigo-500 text-white"><FiSend /></button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <button onClick={() => setChatOpen(true)} className="fixed right-6 bottom-6 md:hidden lg:block p-4 rounded-full bg-indigo-500 text-white shadow-2xl z-40">
        <FiMessageCircle />
      </button>
    </div>
  );
}