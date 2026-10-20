import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cloudinaryAsset } from "../../lib/cloudinary";
import ClockPicker from "./components/ClockPicker";

import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flower2,
  Headphones,
  Moon,
  NotebookPen,
  Send,
  Sunrise,
  Users,
  Waves,
  Share2,
  X,
  LoaderCircle,
} from "lucide-react";

import {
  createSadhana,
  getMarksGraph,
  getMarksSummary,
  getSadhanaByDate,
  updateSadhana,
  getAllAdmins,
  connectToAdmin,
  getMyConnectedAdmins
} from "./services/sadhanaApi";

const avatar = cloudinaryAsset("avatar.png");
/* ------------------------------------------------------------------ */
/* Shared tailwind strings (constants, not CSS classes)                */
/* ------------------------------------------------------------------ */
const serif = "font-serif";
const fieldBase =
  "w-full rounded-xl border border-orange-900/10 bg-white text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15";
const goldButton =
  "inline-flex items-center justify-center gap-2.5 rounded-full bg-linear-to-r from-orange-500 to-amber-400 px-7 py-3.5 text-sm font-semibold tracking-wide text-emerald-950 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(245,158,11,0.4)] disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none";

const particles = [
  { left: "6%", top: "20%", size: 4, delay: 0 },
  { left: "22%", top: "70%", size: 6, delay: 1 },
  { left: "40%", top: "28%", size: 4, delay: 2 },
  { left: "58%", top: "75%", size: 4, delay: 0.5 },
  { left: "74%", top: "22%", size: 6, delay: 1.5 },
  { left: "90%", top: "60%", size: 4, delay: 2.5 },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const getToday = () => new Date().toISOString().split("T")[0];

const getStoredUserName = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem("user"));
    return parsed?.name || "User";
  } catch {
    return "User";
  }
};

function createActivityArray(name, duration) {
  if (!name && (!duration || Number(duration) === 0)) return [];
  return [{ activityName: name || "", durationMinutes: Number(duration) || 0 }];
}

function formatDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatShortDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function Sadhna() {
  const today = getToday();
  const [selectedDate, setSelectedDate] = useState(today);

  const [sadhana, setSadhana] = useState(null);
  const [username, setUsername] = useState(getStoredUserName);
  const [graphData, setGraphData] = useState([]);
  const [summary, setSummary] = useState({
    totalDays: 0,
    totalMarks: 0,
    averageMarks: 0,
    highestMarks: 0,
    lowestMarks: 0,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      const [graphResponse, summaryResponse] = await Promise.all([
        getMarksGraph(),
        getMarksSummary(),
      ]);
      setGraphData(graphResponse);
      setSummary(summaryResponse);
      setUsername(getStoredUserName());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadSadhanaForDate(selectedDate);
  }, [selectedDate]);

  const loadSadhanaForDate = async (date) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");
      const response = await getSadhanaByDate(date);
      setSadhana(response);
    } catch {
      // 404 means nothing submitted for this date yet
      setSadhana(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setMessage("");
      setError("");

      const payload = {
        date: selectedDate,
        sleepWake: {
          wakeUpTime: formData.wakeUpTime,
          sleepTime: formData.sleepTime,
        },
        morningProgram: {
          chantStartTime: formData.chantStartTime,
          chantEndTime: formData.chantEndTime,
          attendance: formData.morningProgramAttendance,
          durationMinutes: Number(formData.morningProgramDuration) || 0,
        },
        chantingRounds: Number(formData.rounds) || 0,
        activities: {
          hearing: createActivityArray(formData.hearing, formData.hearingDuration),
          reading: createActivityArray(formData.reading, formData.readingDuration),
          preaching: createActivityArray(formData.preaching, formData.preachingDuration),
          devotionalServices: createActivityArray(formData.services, formData.servicesDuration),
        },
        miscellaneous: {
          restDurationMinutes: Number(formData.rest) || 0,
          specialEvents: createActivityArray(formData.event, formData.eventDuration),
          otherActivities: createActivityArray(formData.other, formData.otherDuration),
        },
        reflectionNotes: formData.notes,
      };

      let response;
      if (sadhana) response = await updateSadhana(selectedDate, payload);
      else response = await createSadhana(payload);

      setSadhana(response.sadhana);
      setMessage(
        sadhana
          ? `Sadhana for ${formatDate(selectedDate)} updated successfully.`
          : `Sadhana for ${formatDate(selectedDate)} submitted successfully.`
      );

      await loadReportData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------------------- connectToAdmin --------------------------- */
  const [showConnectModal, setShowConnectModal] = useState(false);
  
  /* ---------------------------- sharing --------------------------- */
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareStartDate, setShareStartDate] = useState(today);
  const [shareEndDate, setShareEndDate] = useState(today);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  const handleShareSadhana = async () => {
    try {
      setShareLoading(true);
      setShareMessage("");

      const start = new Date(shareStartDate);
      const end = new Date(shareEndDate);

      if (start > end) {
        setError("Start date cannot be after end date.");
        setShareLoading(false);
        return;
      }

      const currentDate = new Date(start);
      const dateList = [];
      while (currentDate <= end) {
        dateList.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const results = await Promise.all(
        dateList.map(async (date) => {
          try {
            return { date, data: await getSadhanaByDate(date) };
          } catch {
            return { date, data: null };
          }
        })
      );

      let reportText = `🦚 *Sadhana Report (${formatDate(shareStartDate)} to ${formatDate(shareEndDate)})* 🦚\n\n`;

      results.forEach(({ date, data }) => {
        reportText += `📅 *Date: ${formatDate(date)}*\n`;
        if (!data) {
          reportText += `_No sadhana submitted for this date._\n\n`;
          return;
        }

        const sleep = data.sleepWake || {};
        const mp = data.morningProgram || {};
        const acts = data.activities || {};
        const marks = data.marks || {};

        reportText += `⏰ Sleep: Wake ${sleep.wakeUpTime || "—"} | Sleep ${sleep.sleepTime || "—"}\n`;
        reportText += `📿 Chanting: ${data.chantingRounds || 0} rounds (${mp.chantStartTime || "—"} - ${mp.chantEndTime || "—"})\n`;
        reportText += `🌅 Morning Program: ${mp.durationMinutes || 0} mins (Attended: ${mp.attendance ? "Yes" : "No"})\n`;

        if (acts.hearing?.length && acts.hearing[0].activityName) {
          reportText += `🎧 Hearing: ${acts.hearing[0].activityName} (${acts.hearing[0].durationMinutes}m)\n`;
        }
        if (acts.reading?.length && acts.reading[0].activityName) {
          reportText += `📖 Reading: ${acts.reading[0].activityName} (${acts.reading[0].durationMinutes}m)\n`;
        }
        if (acts.preaching?.length && acts.preaching[0].activityName) {
          reportText += `👥 Preaching: ${acts.preaching[0].activityName} (${acts.preaching[0].durationMinutes}m)\n`;
        }
        if (acts.devotionalServices?.length && acts.devotionalServices[0].activityName) {
          reportText += `🌸 Service: ${acts.devotionalServices[0].activityName} (${acts.devotionalServices[0].durationMinutes}m)\n`;
        }
        if (marks.obtained !== undefined) {
          reportText += `🏆 Score: ${marks.obtained}/${marks.maximum}\n`;
        }
        if (data.reflectionNotes) {
          reportText += `📝 Notes: ${data.reflectionNotes}\n`;
        }
        reportText += `-----------------------------------\n\n`;
      });

      await navigator.clipboard.writeText(reportText);
      setShareMessage("Report copied to clipboard successfully!");

      setTimeout(() => {
        setShowShareModal(false);
        setShareMessage("");
      }, 2000);
    } catch {
      setError("Failed to generate share report.");
    } finally {
      setShareLoading(false);
    }
  };

  /* ------------------------- initial form data -------------------- */
  const initialData = useMemo(() => {
    if (!sadhana) {
      return {
        wakeUpTime: "04:30",
        sleepTime: "22:00",
        chantStartTime: "05:00",
        chantEndTime: "06:00",
        morningProgramAttendance: false,
        morningProgramDuration: 60,
        rounds: 0,
        hearing: "",
        hearingDuration: 0,
        reading: "",
        readingDuration: 0,
        preaching: "",
        preachingDuration: 0,
        services: "",
        servicesDuration: 0,
        rest: 0,
        event: "",
        eventDuration: 0,
        other: "",
        otherDuration: 0,
        notes: "",
      };
    }

    return {
      wakeUpTime: sadhana.sleepWake?.wakeUpTime || "",
      sleepTime: sadhana.sleepWake?.sleepTime || "",
      chantStartTime: sadhana.morningProgram?.chantStartTime || "",
      chantEndTime: sadhana.morningProgram?.chantEndTime || "",
      morningProgramAttendance: sadhana.morningProgram?.attendance || false,
      morningProgramDuration: sadhana.morningProgram?.durationMinutes || 0,
      rounds: sadhana.chantingRounds || 0,
      hearing: sadhana.activities?.hearing?.[0]?.activityName || "",
      hearingDuration: sadhana.activities?.hearing?.[0]?.durationMinutes || 0,
      reading: sadhana.activities?.reading?.[0]?.activityName || "",
      readingDuration: sadhana.activities?.reading?.[0]?.durationMinutes || 0,
      preaching: sadhana.activities?.preaching?.[0]?.activityName || "",
      preachingDuration: sadhana.activities?.preaching?.[0]?.durationMinutes || 0,
      services: sadhana.activities?.devotionalServices?.[0]?.activityName || "",
      servicesDuration: sadhana.activities?.devotionalServices?.[0]?.durationMinutes || 0,
      rest: sadhana.miscellaneous?.restDurationMinutes || 0,
      event: sadhana.miscellaneous?.specialEvents?.[0]?.activityName || "",
      eventDuration: sadhana.miscellaneous?.specialEvents?.[0]?.durationMinutes || 0,
      other: sadhana.miscellaneous?.otherActivities?.[0]?.activityName || "",
      otherDuration: sadhana.miscellaneous?.otherActivities?.[0]?.durationMinutes || 0,
      notes: sadhana.reflectionNotes || "",
    };
  }, [sadhana]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#123b5d]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: [45, 135, 45], scale: [1, 1.3, 1] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="mx-auto mb-6 h-3 w-3 bg-orange-500"
          />
          <p className={`${serif} text-2xl font-light italic text-orange-300`}>
            Loading Sadhana...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(135deg,#eaf7ff_0%,#ffffff_48%,#dff2ff_100%)] font-sans text-stone-900 lg:flex-row">
      {/* ============================ SIDEBAR ============================ */}
      <aside className="relative z-20 flex w-full shrink-0 flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.28),transparent_42%),linear-gradient(180deg,#123b5d,#08243d)] p-6 text-white lg:sticky lg:top-0 lg:h-screen lg:w-80">
        {particles.slice(0, 4).map((p, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute rounded-full bg-orange-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            animate={{ y: [0, -14, 0], opacity: [0.15, 0.7, 0.15] }}
            transition={{ duration: 3 + i * 0.4, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        <div className="relative space-y-7">
          <div className="flex items-center gap-3.5 border-b border-white/10 pb-6">
            <img
              src={avatar}
              alt={username}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-orange-500/70 ring-offset-2 ring-offset-[#123b5d]"
            />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.28em] text-orange-300">
                Hare Krishna
              </p>
              <h1 className={`${serif} truncate text-2xl font-normal`}>
                {username}
              </h1>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
              Sadhana Date
            </label>
            <div className="relative flex items-center">
              <CalendarDays size={17} className="pointer-events-none absolute left-3.5 text-orange-300" />
              <input
                type="date"
                value={selectedDate}
                max={today}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full scheme-dark rounded-xl border border-white/15 bg-white/5 py-3 pl-10 pr-3 text-sm font-medium text-white outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-400/15"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setShareStartDate(selectedDate);
              setShareEndDate(selectedDate);
              setShowShareModal(true);
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-orange-400/50 bg-orange-400/10 px-4 py-3 text-sm font-semibold text-orange-300 transition duration-300 hover:bg-orange-400 hover:text-emerald-950"
          >
            <Share2 size={16} />
            Share Sadhana Report
          </button>

          <div>
            <button
            onClick={() => {
              setShowConnectModal(true);
              
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded border border-blue-400/50 bg-blue-400/10 px-4 py-3 text-sm font-semibold text-orange-300 transition duration-300 hover:bg-blue-200 hover:text-emerald-950"
          >
            <Share2 size={16} />
            + Connect to Admin
          </button>
          </div>
        </div>

        <div className="relative mt-8 hidden border-t border-white/10 pt-6 text-center lg:block">
          <p className="text-xl text-white/70" style={{ fontFamily: "Caveat, cursive" }}>
            Daily Sadhana Portal
          </p>
        </div>
      </aside>

      {/* ============================== MAIN ============================= */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 lg:py-8">
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              <CheckCircle2 size={18} />
              {message}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ------------------------------ HERO ------------------------------ */}
        <section className="relative mb-7 overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.34),transparent_42%),linear-gradient(135deg,#123b5d,#1e638d)] p-7 text-white shadow-[0_30px_60px_-30px_rgba(18,59,93,0.38)] sm:p-10">
          <motion.div
            animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.15, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-16 -top-10 h-64 w-64 rounded-full bg-orange-400/25 blur-[90px]"
          />

          {particles.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-orange-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
              animate={{ y: [0, -16, 0], opacity: [0.2, 0.9, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 3 + i * 0.3, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}

          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-4 flex items-center gap-3"
            >
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="block h-0.5 bg-orange-400"
              />
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-orange-300 sm:text-xs">
                Daily Sadhana · {formatDate(selectedDate)}
              </p>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className={`${serif} text-4xl font-light leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl`}
            >
              Small steps every day,
              <br />
              <span className="italic text-orange-500">lead to a bigger you.</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.7 }}
              className="my-5 flex origin-left items-center gap-3"
            >
              <div className="h-px w-16 bg-white/50" />
              <motion.div
                animate={{ rotate: [45, 135, 45], scale: [1, 1.25, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="h-2 w-2 rotate-45 bg-orange-400"
              />
              <div className="h-px w-8 bg-white/30" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="max-w-xl text-base font-light leading-relaxed text-white/80 sm:text-lg"
            >
              Record your daily spiritual activities, reflect on your practice,
              and keep growing.
            </motion.p>
          </div>

          <div className="pointer-events-none absolute -bottom-3 right-6 text-8xl opacity-20 sm:text-9xl">
            🦚
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-linear-to-r from-transparent via-orange-400 to-transparent"
          />
        </section>

        {/* ------------------------- SCORE SUMMARY ------------------------- */}
        <section className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <SummaryCard index={0} icon={<Waves size={20} />} label="Average Marks" value={summary.averageMarks} suffix="/100" />
          <SummaryCard index={1} icon={<CheckCircle2 size={20} />} label="Highest Marks" value={summary.highestMarks} suffix="/100" />
          <SummaryCard index={2} icon={<CalendarDays size={20} />} label="Days Completed" value={summary.totalDays} />
          <SummaryCard
            index={3}
            icon={<NotebookPen size={20} />}
            label="Selected Date Score"
            value={sadhana?.marks?.obtained ?? "—"}
            suffix={sadhana?.marks ? `/${sadhana.marks.maximum}` : ""}
          />
        </section>

        <MarksChart data={graphData} />

        <SadhanaForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitting={submitting}
          editing={!!sadhana}
          marks={sadhana?.marks}
        />
      </main>

      {/* ============================ SHARE MODAL ======================== */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <motion.button
              type="button"
              aria-label="Close share dialog"
              onClick={() => setShowShareModal(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#071b2c]/70 backdrop-blur-md"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md space-y-5 rounded-[26px] border border-orange-500/35 bg-white/95 p-7 shadow-[0_50px_100px_-30px_rgba(7,27,44,0.35)]"
            >
              <button
                onClick={() => setShowShareModal(false)}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-slate-900/10 text-[#123b5d] transition duration-300 hover:rotate-90 hover:bg-[#123b5d] hover:text-white"
              >
                <X size={16} />
              </button>

              <div className="text-center">
                <div className="text-xl text-orange-500">✦</div>
                <p className="mb-1 mt-1 text-[11px] uppercase tracking-[0.28em] text-orange-700">
                  Share
                </p>
                <h3 className={`${serif} text-3xl font-normal text-[#123b5d]`}>
                  Sadhana Report
                </h3>
              </div>

              <p className="text-center text-xs leading-relaxed text-slate-500">
                Select a date range to compile your spiritual activity summary
                into formatted text, ready to paste on WhatsApp or messaging
                apps.
              </p>

              {shareMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                  <CheckCircle2 size={16} />
                  {shareMessage}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={shareStartDate}
                    max={today}
                    onChange={(e) => setShareStartDate(e.target.value)}
                    className={`${fieldBase} px-3 py-2.5`}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={shareEndDate}
                    max={today}
                    onChange={(e) => setShareEndDate(e.target.value)}
                    className={`${fieldBase} px-3 py-2.5`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="rounded-full border border-slate-900/15 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={shareLoading}
                  onClick={handleShareSadhana}
                  className={`${goldButton} px-6! py-2.5!`}
                >
                  {shareLoading ? "Generating..." : "Copy as Text"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      
      <AnimatePresence>
        {showConnectModal && (
          <ConnectModal setShowConnectModal={setShowConnectModal} />
          )}
      </AnimatePresence>
    </div>
  );
}

function ConnectModal({ setShowConnectModal }) {
  const [admins, setAdmins] = useState([]);
  const [connectedAdminIds, setConnectedAdminIds] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const [connectionMessage, setConnectionMessage] = useState("");

  useEffect(() => {
    async function getAdminsData() {
      try {
        setLoading(true);
        setError("");
        let user;
        try {
          user = JSON.parse(localStorage.getItem("user"));
        } catch {
          user = null;
        }

        const userId = user?.id || user?._id;
        if (!userId) {
          throw new Error("Unable to identify your account. Please log in again.");
        }

        const [response, connectedResponse] = await Promise.all([
          getAllAdmins(),
          getMyConnectedAdmins(userId),
        ]);
        const adminList = Array.isArray(response)
          ? response
          : Array.isArray(response?.admins)
            ? response.admins
            : [];
        const connectedIds = Array.isArray(connectedResponse)
          ? connectedResponse
          : Array.isArray(connectedResponse?.admins)
            ? connectedResponse.admins
            : [];
        setAdmins(adminList);
        setConnectedAdminIds(
          connectedIds
            .map((admin) => admin?._id || admin?.id || admin)
            .filter(Boolean)
            .map(String),
        );
      } catch (err) {
        setError(err.message || "Unable to load admins.");
      } finally {
        setLoading(false);
      }
    }

    getAdminsData();
  }, []);

  const connectedAdmins = admins.filter((admin) =>
    connectedAdminIds.includes(String(admin?._id || admin?.id)),
  );
  const availableAdmins = admins.filter(
    (admin) => !connectedAdminIds.includes(String(admin?._id || admin?.id)),
  );

  const getAdminName = (admin) =>
    admin?.name ||
    [admin?.firstName, admin?.lastName].filter(Boolean).join(" ") ||
    "Unnamed admin";

  const handleConnect = async () => {
    if (!selectedAdminId || connecting) return;

    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch {
      user = null;
    }

    const userId = user?.id || user?._id;
    if (!userId) {
      setConnectionMessage("Unable to identify your account. Please log in again.");
      return;
    }

    try {
      setConnecting(true);
      setConnectionMessage("");
      await connectToAdmin(selectedAdminId, [userId]);
      setConnectionMessage("Connection request sent successfully.");
      setConnectedAdminIds((currentIds) => [
        ...currentIds,
        String(selectedAdminId),
      ]);
      setSelectedAdminId("");
    } catch (err) {
      setConnectionMessage(err.message || "Unable to connect to this admin.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <motion.button
              type="button"
              aria-label="Close share dialog"
              onClick={() => setShowConnectModal(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#071b2c]/70 backdrop-blur-md"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md space-y-5 rounded-[26px] border border-orange-500/35 bg-white/95 p-7 shadow-[0_50px_100px_-30px_rgba(7,27,44,0.35)]"
            >
              <button
                onClick={() => setShowConnectModal(false)}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-slate-900/10 text-[#123b5d] transition duration-300 hover:rotate-90 hover:bg-[#123b5d] hover:text-white"
              >
                <X size={16} />
              </button>

              <div className="text-center">
                <div className="text-xl text-orange-500">✦</div>
                <p className="mb-1 mt-1 text-[11px] uppercase tracking-[0.28em] text-orange-700">
                  Connect
                </p>
                <h3 className={`${serif} text-3xl font-normal text-[#123b5d]`}>
                  Select Admin
                </h3>
              </div>

              <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                {loading && (
                  <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
                    <LoaderCircle size={18} className="animate-spin text-orange-500" />
                    Loading admins...
                  </div>
                )}

                {!loading && error && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                    {error}
                  </p>
                )}

                {!loading && !error && connectedAdmins.length > 0 && (
                  <div className="space-y-2">
                    <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Current admins
                    </p>
                    {connectedAdmins.map((admin) => (
                      <div
                        key={admin?._id || admin?.id}
                        className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
                      >
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-600 text-xs text-white">
                          ✓
                        </span>
                        <span className="text-sm font-medium text-[#123b5d]">
                          {getAdminName(admin)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {!loading && !error && availableAdmins.length > 0 && (
                  <div className="space-y-2">
                    <p className="px-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Connect with another admin
                    </p>
                    {availableAdmins.map((admin) => {
                      const adminId = admin?._id || admin?.id;
                      const isSelected =
                        String(selectedAdminId) === String(adminId);

                      if (!adminId) return null;

                      return (
                        <label
                          key={adminId}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                            isSelected
                              ? "border-orange-500 bg-orange-50 shadow-sm"
                              : "border-slate-200 hover:border-orange-300 hover:bg-orange-50/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="connect-admin"
                            value={adminId}
                            checked={isSelected}
                            onChange={() => setSelectedAdminId(adminId)}
                            className="h-4 w-4 accent-orange-500"
                          />
                          <span className="text-sm font-medium text-[#123b5d]">
                            {getAdminName(admin)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {!loading && !error && admins.length === 0 && (
                  <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
                    No admins are available right now.
                  </p>
                )}
              </div>


              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="rounded-full border border-slate-900/15 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConnect}
                  type="button"
                  disabled={!selectedAdminId || loading || connecting}
                  className={`${goldButton} px-6! py-2.5!`}
                >
                  {connecting ? "Connecting..." : "Connect"}
                </button>
              </div>
              {connectionMessage && (
                <p
                  className={`text-center text-sm ${
                    connectionMessage.includes("successfully")
                      ? "text-emerald-700"
                      : "text-red-600"
                  }`}
                >
                  {connectionMessage}
                </p>
              )}
            </motion.div>
          </div>
  );
}

/* ------------------------------------------------------------------ */
/* Summary card                                                        */
/* ------------------------------------------------------------------ */
function SummaryCard({ icon, label, value, suffix = "", index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.08 }}
      className="group relative overflow-hidden rounded-2xl border border-sky-900/10 bg-white/90 p-5 transition duration-500 hover:-translate-y-1.5 hover:border-orange-500/55 hover:shadow-[0_28px_50px_-28px_rgba(18,59,93,0.22)]"
    >
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-orange-400/10 blur-2xl transition duration-500 group-hover:bg-orange-400/25" />

      <div className="relative mb-4 grid h-10 w-10 place-items-center rounded-full bg-linear-to-br from-[#123b5d] to-[#1e638d] text-orange-300">
        {icon}
      </div>

      <p className="relative text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p className={`${serif} relative mt-1 text-4xl font-semibold text-[#123b5d]`}>
        {value}
        {suffix && (
          <span className="ml-1 font-sans text-sm font-medium text-slate-400">
            {suffix}
          </span>
        )}
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Marks chart                                                         */
/* ------------------------------------------------------------------ */
function MarksChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="mb-7 rounded-3xl border border-dashed border-orange-500/50 bg-white/90 p-8 text-center">
        <Waves size={26} className="mx-auto mb-2 text-orange-500" />
        <h3 className={`${serif} text-2xl font-medium text-[#123b5d]`}>
          Daily Marks Analysis
        </h3>
        <p className="mt-1 text-sm text-slate-500">No marks recorded yet.</p>
      </div>
    );
  }

  const width = 760;
  const height = 260;
  const paddingLeft = 50;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 45;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxMarks = 100;

  const barSlotWidth = chartWidth / data.length;
  const barWidth = Math.min(42, barSlotWidth * 0.62);
  const bars = data.map((item, index) => {
    const barHeight = (item.marks / maxMarks) * chartHeight;
    return {
      ...item,
      x: paddingLeft + index * barSlotWidth + (barSlotWidth - barWidth) / 2,
      y: paddingTop + chartHeight - barHeight,
      width: barWidth,
      height: barHeight,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="mb-7 rounded-3xl border border-sky-900/10 bg-white/90 p-5 shadow-[0_24px_50px_-34px_rgba(18,59,93,0.2)] sm:p-7"
    >
      <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-linear-to-br from-[#123b5d] to-[#1e638d] text-orange-300">
              <Waves size={18} />
            </span>
            <h3 className={`${serif} text-2xl font-semibold text-[#123b5d]`}>
              Daily Marks Analysis
            </h3>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Your daily Sadhana performance out of 100
          </p>
        </div>

        <div className="rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-xs text-stone-600">
          Latest{" "}
          <strong className={`${serif} ml-1 text-lg text-[#123b5d]`}>
            {data[data.length - 1].marks}/100
          </strong>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[650px]">
          <defs>
            <linearGradient id="sadhanaBars" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {[0, 25, 50, 75, 100].map((value) => {
            const y = paddingTop + chartHeight - (value / maxMarks) * chartHeight;
            return (
              <g key={value}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#e7e1d4"
                  strokeWidth="1"
                  strokeDasharray="4 5"
                />
                <text x={paddingLeft - 10} y={y + 4} textAnchor="end" fontSize="13" fontWeight="500" fill="#6b7280">
                  {value}
                </text>
              </g>
            );
          })}

          {bars.map((bar) => (
            <g key={bar.date}>
              <rect
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={bar.height}
                rx="7"
                fill="url(#sadhanaBars)"
                stroke="#f59e0b"
                strokeWidth="1"
              />
              <text x={bar.x + bar.width / 2} y={bar.y - 10} textAnchor="middle" fontSize="13" fontWeight="700" fill="#123b5d">
                {bar.marks}
              </text>
              <text x={bar.x + bar.width / 2} y={height - 17} textAnchor="middle" fontSize="12" fontWeight="500" fill="#6b7280">
                {formatShortDate(bar.date)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */
function SadhanaForm({ initialData, onSubmit, submitting, editing, marks }) {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSection
        icon={<Moon size={20} />}
        title="Sleep & Wake Routine"
        description="Maintain a consistent daily rhythm."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <ClockPicker label="Wake Up Time" value={formData.wakeUpTime} onChange={(v) => updateField("wakeUpTime", v)} />
          <ClockPicker label="Sleep Time" value={formData.sleepTime} onChange={(v) => updateField("sleepTime", v)} />
        </div>
      </FormSection>

      <FormSection
        icon={<Sunrise size={20} />}
        title="Chanting & Morning Program"
        description="Record your morning spiritual practice."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ClockPicker label="Chant Start Time" value={formData.chantStartTime} onChange={(v) => updateField("chantStartTime", v)} />
          <ClockPicker label="Chant End Time" value={formData.chantEndTime} onChange={(v) => updateField("chantEndTime", v)} />
          <NumberInput label="Program Duration (mins)" value={formData.morningProgramDuration} onChange={(v) => updateField("morningProgramDuration", v)} />
          <NumberInput label="Chanting Rounds" value={formData.rounds} onChange={(v) => updateField("rounds", v)} />
        </div>

        <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-sky-900/10 bg-[#eff8ff] px-4 py-3 transition hover:border-orange-500/60">
          <input
            type="checkbox"
            checked={formData.morningProgramAttendance}
            onChange={(e) => updateField("morningProgramAttendance", e.target.checked)}
            className="h-4 w-4 accent-orange-500"
          />
          <span className="text-sm font-medium text-slate-700">
            Attended Morning Program
          </span>
        </label>
      </FormSection>

      <FormSection
        icon={<BookOpen size={20} />}
        title="Hearing, Reading & Service"
        description="Enter the activity name and duration."
      >
        <div className="space-y-3">
          <ActivityInput icon={<Headphones size={18} />} label="Hearing" name={formData.hearing} duration={formData.hearingDuration} onNameChange={(v) => updateField("hearing", v)} onDurationChange={(v) => updateField("hearingDuration", v)} />
          <ActivityInput icon={<BookOpen size={18} />} label="Reading" name={formData.reading} duration={formData.readingDuration} onNameChange={(v) => updateField("reading", v)} onDurationChange={(v) => updateField("readingDuration", v)} />
          <ActivityInput icon={<Users size={18} />} label="Preaching" name={formData.preaching} duration={formData.preachingDuration} onNameChange={(v) => updateField("preaching", v)} onDurationChange={(v) => updateField("preachingDuration", v)} />
          <ActivityInput icon={<Flower2 size={18} />} label="Devotional Services" name={formData.services} duration={formData.servicesDuration} onNameChange={(v) => updateField("services", v)} onDurationChange={(v) => updateField("servicesDuration", v)} />
        </div>
      </FormSection>

      <FormSection
        icon={<NotebookPen size={20} />}
        title="Miscellaneous & Notes"
        description="Capture rest, events and other activities."
      >
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <NumberInput label="Rest Duration (mins)" value={formData.rest} onChange={(v) => updateField("rest", v)} />
          <ActivityInput icon={<CalendarDays size={18} />} label="Special Event / Festival" name={formData.event} duration={formData.eventDuration} onNameChange={(v) => updateField("event", v)} onDurationChange={(v) => updateField("eventDuration", v)} />
          <ActivityInput icon={<Clock3 size={18} />} label="Other Activities" name={formData.other} duration={formData.otherDuration} onNameChange={(v) => updateField("other", v)} onDurationChange={(v) => updateField("otherDuration", v)} />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
            Reflection Notes
          </label>
          <textarea
            rows={5}
            value={formData.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder="Key realisations from today's sadhana..."
            className={`${fieldBase} resize-none bg-[#eff8ff] px-4 py-3 focus:bg-white`}
          />
        </div>
      </FormSection>

      {marks && (
        <div className="relative overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_90%_0%,rgba(255,255,255,0.3),transparent_48%),linear-gradient(135deg,#123b5d,#1e638d)] p-6 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-orange-300">
                Evaluation
              </p>
              <p className="mt-1 text-sm text-white/70">
                Marks for the selected date, as scored by the backend.
              </p>
            </div>
            <div className={`${serif} text-5xl font-semibold text-orange-300`}>
              {marks.obtained}
              <span className="ml-1 font-sans text-base font-normal text-white/50">
                /{marks.maximum}
              </span>
            </div>
          </div>
        </div>
      )}

      <motion.button
        type="submit"
        disabled={submitting}
        whileTap={{ scale: 0.97 }}
        className={`${goldButton} w-full sm:w-auto`}
      >
        <Send size={18} />
        {submitting
          ? "Saving..."
          : editing
            ? "Update Daily Sadhana"
            : "Submit Daily Sadhana"}
      </motion.button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Form section                                                        */
/* ------------------------------------------------------------------ */
function FormSection({ icon, title, description, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className="rounded-3xl border border-sky-900/10 bg-white/90 shadow-[0_24px_50px_-36px_rgba(18,59,93,0.2)]"
    >
      <div className="rounded-t-3xl border-b border-sky-900/10 bg-linear-to-r from-sky-100/60 to-transparent px-5 py-5 sm:px-7">
        <div className="flex items-start gap-3.5">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-linear-to-br from-[#123b5d] to-[#1e638d] text-orange-300">
            {icon}
          </div>
          <div>
            <h3 className={`${serif} text-2xl font-semibold leading-tight text-[#123b5d]`}>
              {title}
            </h3>
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">{children}</div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/* Activity input                                                      */
/* ------------------------------------------------------------------ */
function ActivityInput({ icon, label, name, duration, onNameChange, onDurationChange }) {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-center gap-3 rounded-2xl border border-stone-900/10 bg-white p-3 transition focus-within:border-orange-500/60 sm:grid-cols-[auto_minmax(140px,170px)_minmax(0,1fr)_minmax(95px,110px)]">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky-100 text-[#1e638d]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-700">{label}</p>
      </div>

      <input
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Activity name"
        className={`${fieldBase} h-10 min-w-0 bg-[#eff8ff] px-3 focus:bg-white`}
      />

      <div className="relative w-full min-w-0">
        <input
          type="number"
          min="0"
          value={duration}
          onChange={(e) => onDurationChange(e.target.value)}
          className={`${fieldBase} h-10 bg-[#eff8ff] pl-3 pr-11 focus:bg-white`}
        />
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          mins
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Number input                                                        */
/* ------------------------------------------------------------------ */
function NumberInput({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
        {label}
      </label>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldBase} h-11 bg-[#eff8ff] px-3 focus:bg-white`}
      />
    </div>
  );
}