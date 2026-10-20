import { createElement, useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LogOut,
  Search,
  Settings2,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_SADHNA_API_URL || "http://localhost:4000";

const getToday = () => new Date().toISOString().split("T")[0];
const MARKS_SETTINGS_KEY = "sadhna-marks-settings";
const defaultMarksSettings = {
  hearing: 20,
  reading: 20,
  preaching: 20,
  devotionalServices: 20,
  morningProgram: 20,
};

const formatDate = (value) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const getInitials = (name = "User") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getUserId = (user) => user?._id || user?.id;

const getUserName = (user) =>
  user?.name ||
  [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
  "Unnamed student";

const getSadhanaRecords = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.records)) return response.records;
  if (Array.isArray(response?.sadhana)) return response.sadhana;
  return response?.sadhana ? [response.sadhana] : response ? [response] : [];
};

async function adminRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      data.message || "Unable to load admin dashboard data.",
    );
    error.status = response.status;
    throw error;
  }
  return data;
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-2xl border border-[#173f5f]/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#173f5f]/55">
          {label}
        </p>
        <span className={`rounded-xl p-2.5 ${accent}`}>
          {createElement(Icon, { size: 18 })}
        </span>
      </div>
      <p className="mt-5 text-3xl font-semibold text-[#173f5f]">{value}</p>
    </div>
  );
}

function RecordDetail({ record, student, onClose }) {
  const activities = [
    ["Hearing", record?.activities?.hearing],
    ["Reading", record?.activities?.reading],
    ["Preaching", record?.activities?.preaching],
    ["Devotional service", record?.activities?.devotionalServices],
  ].filter(([, entries]) => entries?.some((entry) => entry.activityName));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#08243d]/50 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-[#f8fcff] shadow-2xl sm:rounded-3xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-[#173f5f]/10 bg-[#f8fcff]/95 px-6 py-5 backdrop-blur">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
              Sadhna record
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-[#173f5f]">
              {getUserName(student)} · {formatDate(record?.date)}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#173f5f]/60 transition hover:bg-[#173f5f]/10 hover:text-[#173f5f]"
            aria-label="Close record"
          >
            <X size={20} />
          </button>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#173f5f]/50">
              Score
            </p>
            <p className="mt-2 text-3xl font-semibold text-orange-600">
              {record?.marks?.obtained ?? "—"}
              <span className="text-base text-[#173f5f]/45">
                {record?.marks ? ` / ${record.marks.maximum}` : ""}
              </span>
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#173f5f]/50">
              Chanting rounds
            </p>
            <p className="mt-2 text-3xl font-semibold text-[#173f5f]">
              {record?.chantingRounds ?? 0}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#173f5f]/50">
              Sleep and wake
            </p>
            <p className="mt-2 text-sm font-medium text-[#173f5f]">
              {record?.sleepWake?.wakeUpTime || "—"} wake ·{" "}
              {record?.sleepWake?.sleepTime || "—"} sleep
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#173f5f]/50">
              Morning program
            </p>
            <p className="mt-2 text-sm font-medium text-[#173f5f]">
              {record?.morningProgram?.attendance ? "Attended" : "Not attended"} ·{" "}
              {record?.morningProgram?.durationMinutes || 0} minutes
            </p>
          </div>
          {activities.length > 0 && (
            <div className="sm:col-span-2 rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#173f5f]/50">
                Activities
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {activities.map(([label, entries]) => (
                  <div key={label} className="text-sm text-[#173f5f]">
                    <span className="font-semibold">{label}:</span>{" "}
                    {entries
                      .filter((entry) => entry.activityName)
                      .map(
                        (entry) =>
                          `${entry.activityName} (${entry.durationMinutes || 0}m)`,
                      )
                      .join(", ")}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="sm:col-span-2 rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#173f5f]/50">
              Other activities
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                ["Special events", record?.miscellaneous?.specialEvents],
                ["Other activities", record?.miscellaneous?.otherActivities],
              ].map(([label, entries]) => (
                <div key={label} className="text-sm text-[#173f5f]">
                  <span className="font-semibold">{label}:</span>{" "}
                  {entries?.length
                    ? entries
                        .filter((entry) => entry.activityName)
                        .map(
                          (entry) =>
                            `${entry.activityName} (${entry.durationMinutes || 0}m)`,
                        )
                        .join(", ") || "—"
                    : "—"}
                </div>
              ))}
              <div className="text-sm text-[#173f5f]">
                <span className="font-semibold">Rest:</span>{" "}
                {record?.miscellaneous?.restDurationMinutes || 0} minutes
              </div>
            </div>
          </div>
          {record?.marks?.breakdown && (
            <div className="sm:col-span-2 rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#173f5f]/50">
                Marks breakdown
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-[#173f5f] sm:grid-cols-3">
                {Object.entries(record.marks.breakdown).map(([label, value]) => (
                  <div key={label}>
                    <span className="font-semibold">
                      {label.replace(/([A-Z])/g, " $1")}:
                    </span>{" "}
                    {value ?? 0}
                  </div>
                ))}
              </div>
            </div>
          )}
          {record?.reflectionNotes && (
            <div className="sm:col-span-2 rounded-2xl bg-orange-50 p-4 text-sm leading-6 text-[#173f5f]">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-orange-700">
                Reflection
              </p>
              {record.reflectionNotes}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(getToday());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMarksSettings, setShowMarksSettings] = useState(false);
  const [marksSettings, setMarksSettings] = useState(() => {
    try {
      return {
        ...defaultMarksSettings,
        ...JSON.parse(localStorage.getItem(MARKS_SETTINGS_KEY)),
      };
    } catch {
      return defaultMarksSettings;
    }
  });

  useEffect(() => {
    let storedUser;
    try {
      storedUser = JSON.parse(localStorage.getItem("user"));
    } catch {
      storedUser = null;
    }
    if (!localStorage.getItem("token") || storedUser?.role !== "admin") {
      navigate("/login", { replace: true });
      return;
    }
    // console.log("Stored admin user:", storedUser);
    adminRequest("/api/relations/getStudents", { method: "POST", body: JSON.stringify({ adminId: storedUser.id }) })
      .then(async (data) => {
        const students = Array.isArray(data)
          ? data
          : Array.isArray(data?.students)
            ? data.students
            : Array.isArray(data?.users)
              ? data.users
              : Array.isArray(data?.data)
                ? data.data
                : [];
        const responseSummary = Array.isArray(data)
          ? {}
          : data?.summary || data?.stats || {};
        const allSadhanaResponse = await adminRequest("/api/sadhana/all");
        const allSadhanaRecords = getSadhanaRecords(allSadhanaResponse);
        const studentsWithSadhana = students.map((student) => {
          const userId = getUserId(student);
          const studentRecords = userId
            ? allSadhanaRecords.filter(
                (record) => String(record.userId) === String(userId),
              )
            : [];

          return {
            ...student,
            sadhana: studentRecords.sort((first, second) =>
              String(second.date || "").localeCompare(String(first.date || "")),
            ),
          };
        });

        setUsers(studentsWithSadhana);
        setSummary({
          ...responseSummary,
          totalUsers: responseSummary.totalUsers ?? studentsWithSadhana.length,
        });
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) =>
      [getUserName(user), user.email].filter(Boolean).some((value) =>
        String(value).toLowerCase().includes(query),
      ),
    );
  }, [search, users]);

  const loadRecords = async (user, selectedDate = date) => {
    const userId = getUserId(user);
    if (!userId) {
      setError("Unable to load this student's Sadhna because their ID is missing.");
      return;
    }

    setSelectedUser(user);
    setSelectedRecord(null);
    setError("");
    const studentRecords = (user.sadhana || []).filter(
      (record) =>
        String(record.userId) === String(userId) &&
        record.date === (selectedDate || getToday()),
    );
    setSelectedRecord(studentRecords[0] || null);
  };



  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-[#f8fcff] text-[#173f5f]">Loading admin dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#edf8ff_0%,#ffffff_48%,#e8f5fb_100%)] lg:flex">
      <SideBar onMarksSettings={() => setShowMarksSettings(true)} />
    <main className="min-w-0 flex-1 px-4 py-8 text-[#173f5f] sm:px-8 lg:px-12">
      
      <div className="mx-auto max-w-7xl">
       

        {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="Registered users" value={summary.totalUsers ?? users.length} accent="bg-blue-100 text-blue-700" />
          <StatCard icon={CheckCircle2} label="Submissions today" value={summary.submissionsToday ?? 0} accent="bg-emerald-100 text-emerald-700" />
          <StatCard icon={BarChart3} label="Average score" value={summary.averageMarks ?? "—"} accent="bg-orange-100 text-orange-700" />
          <StatCard icon={Activity} label="Active this week" value={summary.activeThisWeek ?? 0} accent="bg-purple-100 text-purple-700" />
        </section>

        {/* <section className="grid gap-6 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.5fr)]">
          <div className="rounded-3xl border border-[#173f5f]/10 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Community members</h2>
              <span className="rounded-full bg-[#edf8ff] px-3 py-1 text-xs font-semibold">{filteredUsers.length}</span>
            </div>
            <label className="relative mb-4 block">
              <Search size={16} className="absolute left-3 top-3 text-[#173f5f]/45" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" className="w-full rounded-xl border border-[#173f5f]/10 bg-[#f8fcff] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-400" />
            </label>
            <div className="max-h-[520px] space-y-2 overflow-y-auto">
              {filteredUsers.length === 0 && <p className="py-8 text-center text-sm text-[#173f5f]/55">No members found.</p>}
              {filteredUsers.map((user) => (
                <button key={user._id || user.id || user.email} type="button" onClick={() => loadRecords(user)} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${selectedUser?._id === user._id || selectedUser?.id === user.id ? "bg-[#edf8ff] ring-1 ring-[#5ca9d6]/30" : "hover:bg-[#f8fcff]"}`}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#123b5d] text-xs font-bold text-white">{getInitials(user.name)}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{user.name || "Unnamed user"}</span><span className="block truncate text-xs text-[#173f5f]/55">{user.email}</span></span>
                  <ChevronRight size={17} className="text-[#173f5f]/35" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#173f5f]/10 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">Daily records</p><h2 className="mt-1 text-xl font-semibold">{selectedUser?.name || "Select a member"}</h2></div>
              <label className="flex items-center gap-2 rounded-xl border border-[#173f5f]/10 px-3 py-2 text-sm"><CalendarDays size={16} className="text-orange-600" /><input type="date" value={date} max={getToday()} onChange={(event) => { const nextDate = event.target.value; setDate(nextDate); if (selectedUser) loadRecords(selectedUser, nextDate); }} className="bg-transparent outline-none" /></label>
            </div>
            {!selectedUser && <div className="grid min-h-64 place-items-center rounded-2xl bg-[#f8fcff] text-center text-sm text-[#173f5f]/55"><div><Users className="mx-auto mb-3 opacity-40" size={28} /><p>Select a member to view their Sadhna.</p></div></div>}
            {selectedUser && recordsLoading && <p className="py-16 text-center text-sm text-[#173f5f]/55">Loading records...</p>}
            {selectedUser && !recordsLoading && records.length === 0 && <div className="grid min-h-64 place-items-center rounded-2xl bg-[#f8fcff] text-center text-sm text-[#173f5f]/55"><div><Clock3 className="mx-auto mb-3 opacity-40" size={28} /><p>No Sadhna records for this filter.</p></div></div>}
            {!recordsLoading && records.length > 0 && <div className="space-y-3">{records.map((record) => <button type="button" key={record._id || record.id || record.date} onClick={() => setSelectedRecord(record)} className="flex w-full items-center justify-between rounded-2xl border border-[#173f5f]/10 p-4 text-left transition hover:border-orange-300 hover:bg-orange-50/40"><span><span className="block font-semibold">{formatDate(record.date)}</span><span className="mt-1 block text-xs text-[#173f5f]/55">{record.chantingRounds || 0} rounds · {record.morningProgram?.attendance ? "Morning program attended" : "No morning program"}</span></span><span className="text-right"><span className="block font-semibold text-orange-600">{record.marks?.obtained ?? "—"}<small className="text-[#173f5f]/45">{record.marks ? `/${record.marks.maximum}` : ""}</small></span><ChevronRight size={16} className="ml-auto mt-1 text-[#173f5f]/35" /></span></button>)}</div>}
          </div>
        </section> */}
        
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
              Students
            </p>
            <h1 className="mt-1 text-2xl font-semibold">Daily Sadhna</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 rounded-xl border border-[#173f5f]/10 bg-white px-3 py-2 text-sm shadow-sm">
              <CalendarDays size={16} className="text-orange-600" />
              <input
                type="date"
                value={date}
                max={getToday()}
                onChange={(event) => {
                  const nextDate = event.target.value;
                  setDate(nextDate);
                  if (selectedUser) loadRecords(selectedUser, nextDate);
                }}
                className="bg-transparent outline-none"
              />
            </label>
            <label className="relative block">
              <Search
                size={16}
                className="absolute left-3 top-3 text-[#173f5f]/45"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search students"
                className="w-56 rounded-xl border border-[#173f5f]/10 bg-white py-2.5 pl-9 pr-3 text-sm shadow-sm outline-none focus:border-orange-400"
              />
            </label>
          </div>
        </div>
        <div className="grid gap-5">
          {filteredUsers.map((user) => (
            <ProfileCard
              key={getUserId(user) || user.email}
              user={user}
              date={date}
              selected={getUserId(selectedUser) === getUserId(user)}
              onClick={() => loadRecords(user)}
              onDateSelect={(selectedDate) => {
                setDate(selectedDate);
                loadRecords(user, selectedDate);
              }}
            />
          ))}
        </div>
        {filteredUsers.length === 0 && (
          <div className="rounded-3xl bg-white px-6 py-16 text-center text-sm text-[#173f5f]/55 shadow-sm">
            No students found.
          </div>
        )}
        </div>
      {selectedRecord && (
        <RecordDetail
          record={selectedRecord}
          student={selectedUser}
          onClose={() => setSelectedRecord(null)}
        />
      )}
      {showMarksSettings && (
        <MarksSettings
          settings={marksSettings}
          onChange={setMarksSettings}
          onClose={() => setShowMarksSettings(false)}
          onSave={() => {
            localStorage.setItem(MARKS_SETTINGS_KEY, JSON.stringify(marksSettings));
            setShowMarksSettings(false);
          }}
        />
      )}
    </main></div>
  );
}

const MarksSettings = ({ settings, onChange, onClose, onSave }) => (
  <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#08243d]/50 p-0 backdrop-blur-sm sm:items-center sm:p-6">
    <section className="w-full max-w-xl rounded-t-3xl bg-[#f8fcff] p-6 shadow-2xl sm:rounded-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
            Marks settings
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-[#173f5f]">
            Customize activity marks
          </h2>
          <p className="mt-2 text-sm text-[#173f5f]/60">
            Set the maximum marks for each activity. The total is shown below.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-[#173f5f]/60 hover:bg-[#173f5f]/10"
          aria-label="Close marks settings"
        >
          <X size={20} />
        </button>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          ["hearing", "Hearing"],
          ["reading", "Reading"],
          ["preaching", "Preaching"],
          ["devotionalServices", "Devotional service"],
          ["morningProgram", "Morning program"],
        ].map(([key, label]) => (
          <label key={key} className="rounded-2xl border border-[#173f5f]/10 bg-white p-4">
            <span className="block text-sm font-semibold text-[#173f5f]">{label}</span>
            <span className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={settings[key]}
                onChange={(event) =>
                  onChange({
                    ...settings,
                    [key]: Math.max(0, Math.min(100, Number(event.target.value) || 0)),
                  })
                }
                className="w-full rounded-xl border border-[#173f5f]/10 px-3 py-2 text-lg font-semibold text-[#173f5f] outline-none focus:border-orange-400"
              />
              <span className="text-sm text-[#173f5f]/50">marks</span>
            </span>
          </label>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-orange-50 px-4 py-3">
        <span className="text-sm font-semibold text-[#173f5f]">Total maximum marks</span>
        <strong className="text-xl text-orange-600">
          {Object.values(settings).reduce((total, value) => total + Number(value || 0), 0)}
        </strong>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#173f5f]/65 hover:bg-[#173f5f]/10">
          Cancel
        </button>
        <button type="button" onClick={onSave} className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
          Save settings
        </button>
      </div>
    </section>
  </div>
);

const ProfileCard = ({ user, date, selected, onClick, onDateSelect }) => {
  const record = user.sadhana?.find((sadhanaRecord) => sadhanaRecord.date === date);
  const name = getUserName(user);
  const graphRecords = Array.from({ length: 7 }, (_, index) => {
    const graphDate = new Date(`${date}T00:00:00`);
    graphDate.setDate(graphDate.getDate() - (6 - index));
    const dateKey = [
      graphDate.getFullYear(),
      String(graphDate.getMonth() + 1).padStart(2, "0"),
      String(graphDate.getDate()).padStart(2, "0"),
    ].join("-");
    const dayRecord = user.sadhana?.find(
      (sadhanaRecord) => sadhanaRecord.date === dateKey,
    );
    const marks = Number(dayRecord?.marks?.obtained);
    const maximum = Number(dayRecord?.marks?.maximum);

    return {
      date: dateKey,
      score: maximum > 0 && Number.isFinite(marks) ? (marks / maximum) * 100 : 0,
      hasScore: maximum > 0 && Number.isFinite(marks),
    };
  });

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative min-h-[350px] rounded-3xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg lg:grid lg:grid-cols-[minmax(280px,0.8fr)_minmax(520px,1.6fr)] lg:gap-10 lg:p-7 ${
        selected
          ? "border-orange-400 ring-2 ring-orange-200"
          : "border-[#173f5f]/10"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#123b5d] text-sm font-bold text-white">
            {getInitials(name)}
          </span>
          <ChevronRight
            className="text-[#173f5f]/35 transition group-hover:text-orange-600 lg:hidden"
            size={20}
          />
        </div>
        <h2 className="mt-5 truncate text-lg font-semibold text-[#173f5f]">
          {name}
        </h2>
        <p className="mt-1 truncate text-sm text-[#173f5f]/55">
          {user.email || "No email available"}
        </p>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#173f5f]/45">
              {formatDate(date)}
            </p>
            <p
              className={`mt-1 text-sm font-semibold ${
                record ? "text-emerald-600" : "text-orange-600"
              }`}
            >
              {record ? "Sadhna submitted" : "No submission"}
            </p>
          </div>
          {record && (
            <p className="text-2xl font-semibold text-orange-600">
              {record.marks?.obtained ?? "—"}
              <span className="text-xs text-[#173f5f]/45">
                {record.marks ? `/${record.marks.maximum}` : ""}
              </span>
            </p>
          )}
        </div>
      </div>
      <ProfileProgressGraph
        records={graphRecords}
        onDateSelect={onDateSelect}
      />
      <ChevronRight
        className="absolute right-5 top-5 hidden text-[#173f5f]/35 transition group-hover:text-orange-600 lg:block"
        size={20}
      />
    </button>
  );
};

const ProfileProgressGraph = ({ records, onDateSelect }) => {
  const width = 560;
  const height = 230;
  const padding = { top: 30, right: 16, bottom: 38, left: 48 };
  const chartHeight = height - padding.top - padding.bottom;
  const slotWidth = (width - padding.left - padding.right) / records.length;
  const barWidth = Math.min(42, slotWidth * 0.62);

  return (
    <div className="mt-5 flex min-h-[280px] min-w-0 flex-col rounded-2xl bg-[#f8fcff] px-5 py-4 lg:mt-0">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#173f5f]/45">
          Progress · last 7 days
        </span>
        <span className="text-sm text-[#173f5f]/45">Score / 100</span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[240px] w-full flex-1"
        role="img"
        aria-label="Bar graph showing progress for the last 7 days"
      >
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#b9d3df"
          strokeWidth="2"
        />
        {[0, 50, 100].map((value) => {
          const y =
            padding.top + chartHeight - (value / 100) * chartHeight;
          return (
            <g key={value}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#d7e8f1"
                strokeDasharray="4 5"
                strokeWidth="1"
              />
              <text
                x={padding.left - 6}
                y={y + 5}
                textAnchor="end"
                fontSize="15"
                fontWeight="600"
                fill="#6b7280"
              >
                {value}
              </text>
            </g>
          );
        })}
        {records.map(({ date, score, hasScore }, index) => {
          const barHeight = (Math.max(0, Math.min(score, 100)) / 100) * chartHeight;
          const x =
            padding.left +
            index * slotWidth +
            (slotWidth - barWidth) / 2;
          const y = padding.top + chartHeight - barHeight;

          return (
              <g
                key={date}
                className="cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
                  onDateSelect(date);
                }}
              >
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 2)}
                rx="7"
                fill={hasScore ? "#f97316" : "#d7e8f1"}
                opacity={hasScore ? "0.9" : "0.7"}
              >
                <title>
                  {formatDate(date)}: {hasScore ? `${Math.round(score)}%` : "No submission"}
                </title>
              </rect>
              {hasScore && (
                <text
                  x={x + barWidth / 2}
                  y={Math.max(y - 4, 10)}
                  textAnchor="middle"
                  fontSize="17"
                  fontWeight="700"
                  fill="#123b5d"
                >
                  {Math.round(score)}
                </text>
              )}
              <text
                x={x + barWidth / 2}
                y={height - 10}
                textAnchor="middle"
                fontSize="14"
                fontWeight="600"
                fill="#6b7280"
              >
                {new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
                  weekday: "short",
                }).slice(0, 2)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const SideBar = ({ onMarksSettings }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login", { replace: true });
  };

  const navItems = [
    { label: "Overview", to: "/admin/dashboard", icon: BarChart3, end: true },
    { label: "Sadhna portal", to: "/sadhna", icon: CalendarDays },
  ];

  return (
    <aside className="relative z-20 flex w-full shrink-0 flex-col justify-between bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.28),transparent_42%),linear-gradient(180deg,#123b5d,#08243d)] p-5 text-white sm:p-6 lg:sticky lg:top-0 lg:h-screen lg:w-80">
      <div>
        <div className="flex items-center gap-3.5 border-b border-white/10 pb-6">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-orange-400/20 text-orange-200">
            <ShieldCheck size={23} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.28em] text-orange-300">
              Hare Krishna
            </p>
            <h1 className="mt-1 truncate text-lg font-semibold">Admin portal</h1>
          </div>
        </div>

        <nav aria-label="Admin navigation" className="mt-8 space-y-2">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
            Workspace
          </p>
          {navItems.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-white text-[#123b5d] shadow-sm"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {createElement(Icon, { size: 18 })}
              {label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={onMarksSettings}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <Settings2 size={18} />
            Marks settings
          </button>
        </nav>
      </div>

      <div className="mt-8 border-t border-white/10 pt-5">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-white/75 transition hover:bg-red-400/15 hover:text-white"
        >
          <LogOut size={18} />
          Sign out
        </button>
        <p className="mt-5 hidden text-center text-xl text-white/70 lg:block" style={{ fontFamily: "Caveat, cursive" }}>
          Daily Sadhana Portal
        </p>
      </div>
    </aside>
  );
};