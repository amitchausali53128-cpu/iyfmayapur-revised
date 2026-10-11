import { useEffect, useMemo, useState } from "react";
import { cloudinaryAsset } from "../../lib/cloudinary";

const avatar = cloudinaryAsset("avatar.png");
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
} from "lucide-react";

import {
  createSadhana,
  getMarksGraph,
  getMarksSummary,
  getSadhanaByDate,
  updateSadhana,
} from "./services/sadhanaApi";


// ======================================================
// HELPER
// ======================================================

const getToday = () => {
  return new Date().toISOString().split("T")[0];
};


// ======================================================
// MAIN PAGE
// ======================================================

export default function Sadhna() {
  const today = getToday();
  const [selectedDate, setSelectedDate] = useState(today);

  const [sadhana, setSadhana] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem("user").name ||"User");
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

  // ----------------------------------------------------
  // Load report data once on mount
  // ----------------------------------------------------

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
      const parse = JSON.parse(localStorage.getItem("user"))
      setUsername(parse?.name || "User");
      console.log(parse);
    } catch (err) {
      setError(err.message);
    }
  };

  // ----------------------------------------------------
  // Load sadhana whenever selectedDate changes
  // ----------------------------------------------------

  useEffect(() => {
    loadSadhanaForDate(selectedDate);
  }, [selectedDate]);

  const loadSadhanaForDate = async (date) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const todayResponse = await getSadhanaByDate(date);
      setSadhana(todayResponse);
    } catch (err) {
      // 404 means no submission for this date yet
      setSadhana(null);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // Submit / Update
  // ----------------------------------------------------

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setMessage("");
      setError("");

     const payload = {
        date: selectedDate, // Changed from today to selectedDate
        // ... rest of your payload mapping
      };

      let response;

      if (sadhana) {
        response = await updateSadhana(selectedDate, payload);
      } else {
        response = await createSadhana(payload);
      }

      setSadhana(response.sadhana);

      setMessage(
        sadhana
          ? `Sadhana for ${formatDate(selectedDate)} updated successfully.`
          : `Sadhana for ${formatDate(selectedDate)} submitted successfully.`
      );

      // Refresh reports
      await loadReportData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

//sharing sadhna 
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

      // Generate all dates in the range
      let currentDate = new Date(start);
      const dateList = [];
      while (currentDate <= end) {
        dateList.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Fetch sadhana for all dates in parallel
      const promises = dateList.map(async (date) => {
        try {
          const res = await getSadhanaByDate(date);
          return { date, data: res };
        } catch (err) {
          return { date, data: null };
        }
      });

      const results = await Promise.all(promises);

      // Format into a clean text report
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
    } catch (err) {
      setError("Failed to generate share report.");
    } finally {
      setShareLoading(false);
    }
  };


  // ----------------------------------------------------
  // Initial form values
  // ----------------------------------------------------

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
      wakeUpTime:
        sadhana.sleepWake?.wakeUpTime || "",

      sleepTime:
        sadhana.sleepWake?.sleepTime || "",

      chantStartTime:
        sadhana.morningProgram?.chantStartTime || "",

      chantEndTime:
        sadhana.morningProgram?.chantEndTime || "",

      morningProgramAttendance:
        sadhana.morningProgram?.attendance || false,

      morningProgramDuration:
        sadhana.morningProgram?.durationMinutes || 0,

      rounds:
        sadhana.chantingRounds || 0,

      hearing:
        sadhana.activities?.hearing?.[0]
          ?.activityName || "",

      hearingDuration:
        sadhana.activities?.hearing?.[0]
          ?.durationMinutes || 0,

      reading:
        sadhana.activities?.reading?.[0]
          ?.activityName || "",

      readingDuration:
        sadhana.activities?.reading?.[0]
          ?.durationMinutes || 0,

      preaching:
        sadhana.activities?.preaching?.[0]
          ?.activityName || "",

      preachingDuration:
        sadhana.activities?.preaching?.[0]
          ?.durationMinutes || 0,

      services:
        sadhana.activities?.devotionalServices?.[0]
          ?.activityName || "",

      servicesDuration:
        sadhana.activities?.devotionalServices?.[0]
          ?.durationMinutes || 0,

      rest:
        sadhana.miscellaneous?.restDurationMinutes || 0,

      event:
        sadhana.miscellaneous?.specialEvents?.[0]
          ?.activityName || "",

      eventDuration:
        sadhana.miscellaneous?.specialEvents?.[0]
          ?.durationMinutes || 0,

      other:
        sadhana.miscellaneous?.otherActivities?.[0]
          ?.activityName || "",

      otherDuration:
        sadhana.miscellaneous?.otherActivities?.[0]
          ?.durationMinutes || 0,

      notes: sadhana.reflectionNotes || "",
    };
  }, [sadhana]);


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-blue-700 font-medium">
          Loading Sadhana...
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#f5f8fc] flex flex-col lg:flex-row">

      {/* =================================================
          SIDEBAR
      ================================================= */}
      {/* =================================================
          SIDEBAR
      ================================================= */}
      <aside className="w-full lg:w-80 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shrink-0 lg:min-h-screen lg:sticky lg:top-0 z-20">

        <div className="space-y-6">

          {/* User Profile */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <img
              src={avatar}
              alt="Amit"
              className="w-12 h-12 rounded-full object-cover ring-4 ring-blue-50"
            />

            <div>
              <p className="text-xs text-slate-500">
                Hare Krishna
              </p>

              <h1 className="text-lg font-bold text-slate-800">
                Welcome, {username}
              </h1>
            </div>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Sadhana Date
            </label>

            <div className="relative flex items-center">
              <CalendarDays size={17} className="absolute left-3 text-slate-400 pointer-events-none" />
              
              <input
                type="date"
                value={selectedDate}
                max={today}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={() => {
              setShareStartDate(selectedDate);
              setShareEndDate(selectedDate);
              setShowShareModal(true);
            }}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-4 py-3 text-sm transition border border-blue-200"
          >
            <Share2 size={16} />
            Share Sadhana Report
          </button>

        </div>

        {/* Footer info inside sidebar */}
        <div className="hidden lg:block pt-6 border-t border-slate-100 text-xs text-slate-400 text-center">
          Daily Sadhana Portal
        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT AREA
      ================================================= */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-8 w-full">

        {/* =================================================
            ERROR / SUCCESS
        ================================================= */}

        {message && (
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}


        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative rounded-3xl bg-gradient-to-r from-[#eaf3ff] via-[#f7faff] to-[#fff8e8] border border-blue-100 p-6 sm:p-8 mb-6">
          <div className="relative z-10 max-w-2xl">
            <p className="text-sm font-semibold text-blue-600 mb-2">
              DAILY SADHANA ({formatDate(selectedDate)})
            </p>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-800">
              Small steps every day,
              <br />
              lead to a bigger you.
            </h2>

            <p className="mt-3 text-slate-500">
              Record your daily spiritual activities,
              reflect on your practice, and keep growing.
            </p>
          </div>

          <div className="absolute right-5 bottom-0 text-7xl opacity-25">
            🦚
          </div>
        </section>


        {/* =================================================
            SCORE SUMMARY
        ================================================= */}

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SummaryCard
            icon={<Waves size={20} />}
            label="Average Marks"
            value={summary.averageMarks}
            suffix="/100"
          />

          <SummaryCard
            icon={<CheckCircle2 size={20} />}
            label="Highest Marks"
            value={summary.highestMarks}
            suffix="/100"
          />

          <SummaryCard
            icon={<CalendarDays size={20} />}
            label="Days Completed"
            value={summary.totalDays}
          />

          <SummaryCard
            icon={<NotebookPen size={20} />}
            label="Selected Date Score"
            value={sadhana?.marks?.obtained ?? "—"}
            suffix={
              sadhana?.marks
                ? `/${sadhana.marks.maximum}`
                : ""
            }
          />
        </section>


        {/* =================================================
            MARKS GRAPH
        ================================================= */}

        <MarksChart data={graphData} />


        {/* =================================================
            FORM
        ================================================= */}

        <SadhanaForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitting={submitting}
          editing={!!sadhana}
          marks={sadhana?.marks}
        />

{/* =================================================
          SHARE MODAL
      ================================================= */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                Share Sadhana Report
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select a date range to compile your spiritual activity summary into formatted text ready to paste on WhatsApp or messaging apps.
            </p>

            {shareMessage && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700">
                <CheckCircle2 size={16} />
                {shareMessage}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={shareStartDate}
                  max={today}
                  onChange={(e) => setShareStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={shareEndDate}
                  max={today}
                  onChange={(e) => setShareEndDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={shareLoading}
                onClick={handleShareSadhana}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold shadow-sm transition"
              >
                {shareLoading ? "Generating..." : "Copy as Text"}
              </button>
            </div>

          </div>
        </div>
      )}

      </main>

    </div>
  );
}


// ======================================================
// ACTIVITY HELPER
// ======================================================

function createActivityArray(name, duration) {
  if (
    !name &&
    (!duration || Number(duration) === 0)
  ) {
    return [];
  }

  return [
    {
      activityName: name || "",
      durationMinutes: Number(duration) || 0,
    },
  ];
}


// ======================================================
// SUMMARY CARD
// ======================================================

function SummaryCard({
  icon,
  label,
  value,
  suffix = "",
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">

      <div className="flex items-center justify-between mb-3">

        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          {icon}
        </div>

      </div>

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-800">
        {value}

        {suffix && (
          <span className="text-sm font-medium text-slate-400 ml-1">
            {suffix}
          </span>
        )}
      </p>

    </div>
  );
}


// ======================================================
// MARKS CHART
// ======================================================

function MarksChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">

        <div className="flex items-center gap-2 mb-2">
          <Waves size={20} className="text-blue-600" />

          <h3 className="font-bold text-slate-800">
            Daily Marks Analysis
          </h3>
        </div>

        <p className="text-sm text-slate-500">
          No marks recorded yet.
        </p>

      </div>
    );
  }


  const width = 760;
  const height = 260;

  const paddingLeft = 50;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 45;

  const chartWidth =
    width - paddingLeft - paddingRight;

  const chartHeight =
    height - paddingTop - paddingBottom;

  const maxMarks = 100;

  const points = data.map((item, index) => {

    const x =
      paddingLeft +
      (index / Math.max(data.length - 1, 1)) *
        chartWidth;

    const y =
      paddingTop +
      chartHeight -
      (item.marks / maxMarks) *
        chartHeight;

    return {
      x,
      y,
      ...item,
    };
  });


  const linePath = points
    .map((point, index) =>
      index === 0
        ? `M ${point.x} ${point.y}`
        : `L ${point.x} ${point.y}`
    )
    .join(" ");


  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">

        <div>
          <div className="flex items-center gap-2">
            <Waves size={20} className="text-blue-600" />

            <h3 className="font-bold text-slate-800">
              Daily Marks Analysis
            </h3>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Your daily Sadhana performance out of 100
          </p>
        </div>

        <div className="text-xs text-slate-500">
          Latest:{" "}
          <strong className="text-slate-800">
            {data[data.length - 1].marks}/100
          </strong>
        </div>

      </div>


      <div className="overflow-x-auto">

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[650px]"
        >

          {/* Grid */}
          {[0, 25, 50, 75, 100].map(
            (value) => {

              const y =
                paddingTop +
                chartHeight -
                (value / maxMarks) *
                  chartHeight;

              return (
                <g key={value}>

                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />

                  <text
                    x={paddingLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    fill="#64748b"
                  >
                    {value}
                  </text>

                </g>
              );
            }
          )}


          {/* Area */}
          {points.length > 1 && (
            <path
              d={`${linePath} L ${
                points[points.length - 1].x
              } ${
                height - paddingBottom
              } L ${
                points[0].x
              } ${
                height - paddingBottom
              } Z`}
              fill="#dbeafe"
              opacity="0.45"
            />
          )}


          {/* Line */}
          {points.length > 1 && (
            <path
              d={linePath}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}


          {/* Points */}
          {points.map((point) => (
            <g key={point.date}>

              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="#2563eb"
                stroke="white"
                strokeWidth="3"
              />

              <text
                x={point.x}
                y={point.y - 13}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#1e3a8a"
              >
                {point.marks}
              </text>

              <text
                x={point.x}
                y={height - 18}
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
              >
                {formatShortDate(point.date)}
              </text>

            </g>
          ))}

        </svg>

      </div>

    </div>
  );
}


// ======================================================
// SADHANA FORM
// ======================================================

function SadhanaForm({
  initialData,
  onSubmit,
  submitting,
  editing,
  marks,
}) {
  const [formData, setFormData] =
    useState(initialData);


  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);


  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* =================================================
          SLEEP & WAKE
      ================================================= */}

      <FormSection
        icon={<Moon size={20} />}
        title="Sleep & Wake Routine"
        description="Maintain a consistent daily rhythm."
      >

        <div className="grid sm:grid-cols-2 gap-4">

          <ClockPicker
            label="Wake Up Time"
            value={formData.wakeUpTime}
            onChange={(value) =>
              updateField("wakeUpTime", value)
            }
          />

          <ClockPicker
            label="Sleep Time"
            value={formData.sleepTime}
            onChange={(value) =>
              updateField("sleepTime", value)
            }
          />

        </div>

      </FormSection>


      {/* =================================================
          MORNING PROGRAM
      ================================================= */}

      <FormSection
        icon={<Sunrise size={20} />}
        title="Chanting & Morning Program"
        description="Record your morning spiritual practice."
      >

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <ClockPicker
            label="Chant Start Time"
            value={formData.chantStartTime}
            onChange={(value) =>
              updateField(
                "chantStartTime",
                value
              )
            }
          />

          <ClockPicker
            label="Chant End Time"
            value={formData.chantEndTime}
            onChange={(value) =>
              updateField(
                "chantEndTime",
                value
              )
            }
          />

          <NumberInput
            label="Program Duration (mins)"
            value={formData.morningProgramDuration}
            onChange={(value) =>
              updateField(
                "morningProgramDuration",
                value
              )
            }
          />

          <NumberInput
            label="Chanting Rounds"
            value={formData.rounds}
            onChange={(value) =>
              updateField("rounds", value)
            }
          />

        </div>


        <label className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer">

          <input
            type="checkbox"
            checked={
              formData.morningProgramAttendance
            }
            onChange={(e) =>
              updateField(
                "morningProgramAttendance",
                e.target.checked
              )
            }
            className="w-4 h-4 accent-blue-600"
          />

          <span className="text-sm font-medium text-slate-700">
            Attended Morning Program
          </span>

        </label>

      </FormSection>


      {/* =================================================
          ACTIVITIES
      ================================================= */}

      <FormSection
        icon={<BookOpen size={20} />}
        title="Hearing, Reading & Service"
        description="Enter the activity name and duration."
      >

        <div className="space-y-3">

          <ActivityInput
            icon={<Headphones size={18} />}
            label="Hearing"
            name={formData.hearing}
            duration={formData.hearingDuration}
            onNameChange={(value) =>
              updateField("hearing", value)
            }
            onDurationChange={(value) =>
              updateField(
                "hearingDuration",
                value
              )
            }
          />

          <ActivityInput
            icon={<BookOpen size={18} />}
            label="Reading"
            name={formData.reading}
            duration={formData.readingDuration}
            onNameChange={(value) =>
              updateField("reading", value)
            }
            onDurationChange={(value) =>
              updateField(
                "readingDuration",
                value
              )
            }
          />

          <ActivityInput
            icon={<Users size={18} />}
            label="Preaching"
            name={formData.preaching}
            duration={formData.preachingDuration}
            onNameChange={(value) =>
              updateField("preaching", value)
            }
            onDurationChange={(value) =>
              updateField(
                "preachingDuration",
                value
              )
            }
          />

          <ActivityInput
            icon={<Flower2 size={18} />}
            label="Devotional Services"
            name={formData.services}
            duration={formData.servicesDuration}
            onNameChange={(value) =>
              updateField("services", value)
            }
            onDurationChange={(value) =>
              updateField(
                "servicesDuration",
                value
              )
            }
          />

        </div>

      </FormSection>


      {/* =================================================
          MISC
      ================================================= */}

      <FormSection
        icon={<NotebookPen size={20} />}
        title="Miscellaneous & Notes"
        description="Capture rest, events and other activities."
      >

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          <NumberInput
            label="Rest Duration (mins)"
            value={formData.rest}
            onChange={(value) =>
              updateField("rest", value)
            }
          />

          <ActivityInput
            icon={<CalendarDays size={18} />}
            label="Special Event / Festival"
            name={formData.event}
            duration={formData.eventDuration}
            onNameChange={(value) =>
              updateField("event", value)
            }
            onDurationChange={(value) =>
              updateField(
                "eventDuration",
                value
              )
            }
          />

          <ActivityInput
            icon={<Clock3 size={18} />}
            label="Other Activities"
            name={formData.other}
            duration={formData.otherDuration}
            onNameChange={(value) =>
              updateField("other", value)
            }
            onDurationChange={(value) =>
              updateField(
                "otherDuration",
                value
              )
            }
          />

        </div>


        <div className="mt-4">

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Reflection Notes
          </label>

          <textarea
            rows={5}
            value={formData.notes}
            onChange={(e) =>
              updateField(
                "notes",
                e.target.value
              )
            }
            placeholder="Key realisations from today's sadhana..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none resize-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          />

        </div>

      </FormSection>


      {/* =================================================
          CURRENT MARKS
      ================================================= */}

      {marks && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                Today's Evaluation
              </p>

              <p className="mt-1 text-sm text-amber-800">
                Marks are shown from the backend.
              </p>
            </div>

            <div className="text-3xl font-bold text-amber-700">
              {marks.obtained}
              <span className="text-base text-amber-500">
                /{marks.maximum}
              </span>
            </div>

          </div>

        </div>
      )}


      {/* =================================================
          SUBMIT
      ================================================= */}

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-7 py-3.5 shadow-sm transition"
      >

        <Send size={18} />

        {submitting
          ? "Saving..."
          : editing
          ? "Update Daily Sadhana"
          : "Submit Daily Sadhana"}

      </button>

    </form>
  );
}


// ======================================================
// FORM SECTION
// ======================================================

function FormSection({
  icon,
  title,
  description,
  children,
}) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm ">

      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">

        <div className="flex items-start gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            {icon}
          </div>

          <div>
            <h3 className="font-bold text-slate-800">
              {title}
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              {description}
            </p>
          </div>

        </div>

      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>

    </section>
  );
}


// ======================================================
// ACTIVITY INPUT
// ======================================================

function ActivityInput({
  icon,
  label,
  name,
  duration,
  onNameChange,
  onDurationChange,
}) {
  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-[auto_minmax(140px,170px)_minmax(0,1fr)_minmax(95px,110px)]
        gap-3
        items-center
        rounded-xl
        border border-slate-200
        p-3
        w-full
        min-w-0
      "
    >
      {/* Icon */}
      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
        {icon}
      </div>

      {/* Label */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-700 truncate">
          {label}
        </p>
      </div>

      {/* Activity Name */}
      <input
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Activity name"
        className="
          w-full
          min-w-0
          h-10
          rounded-lg
          border border-slate-200
          px-3
          text-sm
          outline-none
          bg-slate-50
          focus:bg-white
          focus:border-blue-500
        "
      />

      {/* Duration */}
      <div className="relative w-full min-w-0">
        <input
          type="number"
          min="0"
          value={duration}
          onChange={(e) => onDurationChange(e.target.value)}
          className="
            w-full
            h-10
            rounded-lg
            border border-slate-200
            pl-3
            pr-11
            text-sm
            outline-none
            bg-slate-50
            focus:bg-white
            focus:border-blue-500
          "
        />

        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
          mins
        </span>
      </div>
    </div>
  );
}


// ======================================================
// NUMBER INPUT
// ======================================================

function NumberInput({
  label,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>

      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:bg-white focus:border-blue-500"
      />
    </div>
  );
}


// ======================================================
// DATE HELPERS
// ======================================================

function formatDate(dateString) {
  return new Date(
    `${dateString}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}


function formatShortDate(dateString) {
  return new Date(
    `${dateString}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}