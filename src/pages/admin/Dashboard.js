import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaUsers,
  FaBullhorn,
} from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { adminApi } from "../../api/adminApi";

const DEPT_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6", "#f97316"];

const scheduleEvents = [
  {
    timeStart: "9:00 AM",
    timeEnd: "12:00 PM",
    title: "Career Development Workshop",
    tag: "Business and Technology",
    tagColor: "bg-blue-100 text-blue-700",
    audience: "Third and Fourth-year Students",
    icon: <FaUsers size={11} />,
  },
  {
    timeStart: "2:00 PM",
    timeEnd: "5:00 PM",
    title: "Guest Lecture Series",
    tag: "Humanities and Social Sciences",
    tagColor: "bg-rose-100 text-rose-700",
    audience: "All Students",
    icon: <FaUsers size={11} />,
  },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: prevDays - i, type: "prev" });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, type: "cur" });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, type: "next" });
  return cells;
}

function StatCard({ label, value, color, bg, onClick }) {
  return (
    <div className="bg-white rounded-2xl p-3 sm:p-5 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 w-full border-l-4 border-l-[#5362a3]">
      <div className="flex-1 overflow-hidden">
        <p className="text-[11px] sm:text-xs text-gray-400 font-medium mb-1 break-words">
          {label}
        </p>
        <p className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-800 tracking-tight break-all">
          {value}
        </p>
      </div>
      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0  ${bg} ${color} rounded-xl flex items-center justify-center cursor-pointer`}
        onClick={onClick}
      >
        <FaArrowRight size={14} />
      </div>
    </div>
  );
}

function Calendar() {
  const today = new Date();
  const [current, setCurrent] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [selected, setSelected] = useState(today.getDate());
  const cells = buildCalendar(current.year, current.month);
  const prev = () =>
    setCurrent(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
    );
  const next = () =>
    setCurrent(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 },
    );
  const isToday = (cell) =>
    cell.type === "cur" &&
    current.year === today.getFullYear() &&
    current.month === today.getMonth() &&
    cell.day === today.getDate();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-800">
          {MONTHS[current.month]} {current.year}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={prev}
            className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
          >
            <FaChevronLeft size={12} />
          </button>
          <button
            onClick={next}
            className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
          >
            <FaChevronRight size={12} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-gray-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((cell, i) => {
          const isSelected = cell.type === "cur" && cell.day === selected;
          const todayCell = isToday(cell);
          return (
            <button
              key={i}
              onClick={() => cell.type === "cur" && setSelected(cell.day)}
              className={`h-8 w-8 mx-auto text-xs font-medium rounded-full flex items-center justify-center transition-all duration-150
                ${cell.type !== "cur" ? "text-gray-300 cursor-default" : "hover:bg-blue-50 cursor-pointer"}
                ${todayCell ? "bg-blue-500 text-white hover:bg-blue-600 font-bold" : ""}
                ${isSelected && !todayCell ? "bg-blue-100 text-blue-700 font-bold" : ""}
                ${cell.type === "cur" && !isSelected && !todayCell ? "text-gray-700" : ""}
              `}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

function ScheduleSection() {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-base font-bold text-gray-800">Future Events</h3>
          <p className="text-xs text-gray-400">{today}</p>
        </div>
        <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
          <FaPlus size={11} />
        </button>
      </div>
      <div className="mt-3 space-y-4">
        {scheduleEvents.map((ev, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex-shrink-0 text-right" style={{ minWidth: 68 }}>
              <p className="text-xs text-gray-400 leading-tight">
                {ev.timeStart} to
              </p>
              <p className="text-xs text-gray-400 leading-tight">
                {ev.timeEnd}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-1 flex-shrink-0" />
              {i < scheduleEvents.length - 1 && (
                <div className="w-px flex-1 bg-gray-100 mt-1" />
              )}
            </div>
            <div className="pb-4">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {ev.title}
              </p>
              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${ev.tagColor}`}
              >
                {ev.tag}
              </span>
              <div className="flex items-center gap-1 mt-1.5 text-gray-400">
                {ev.icon}
                <span className="text-xs">{ev.audience}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DepartmentsDonut({ stats }) {
  const deptData = stats?.students_per_department;
  const departments = deptData
    ? Object.entries(deptData).map(([label, value], i) => ({
        label,
        value,
        color: DEPT_COLORS[i % DEPT_COLORS.length],
      }))
    : [];
  const total = departments.reduce((sum, d) => sum + d.value, 0);
  const size = 160;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const gapDeg = 4;
  const gapRatio = gapDeg / 360;

  let offset = 0;
  const segments = departments.map((dep) => {
    const ratio = dep.value / total;
    const dash = Math.max(0, (ratio - gapRatio) * circumference);
    const seg = { ...dep, dash, offset: -offset * circumference };
    offset += ratio;
    return seg;
  });

  return (
    <div className="bg-gray-50 rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-800">
          Students by Department
        </h3>
      </div>

      <div className="flex justify-center mb-5">
        <div
          className="relative flex-shrink-0"
          style={{ width: size, height: size }}
        >
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${seg.dash} ${circumference}`}
                strokeDashoffset={seg.offset}
                strokeLinecap="round"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">
              {total.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 mt-0.5">Total</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {departments.map((dep) => {
          const pct = ((dep.value / total) * 100).toFixed(1);
          return (
            <div
              key={dep.label}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: dep.color }}
                />
                <span className="text-xs font-semibold text-gray-700 truncate">
                  {dep.label}
                </span>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  ({pct}%)
                </span>
              </div>
              <span className="text-xs text-gray-600 font-medium flex-shrink-0">
                {dep.value.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const StudentsChart = ({ stats }) => {
  const malePct = stats.gender_distribution?.male_percentage ?? 0;
  const femalePct = stats.gender_distribution?.female_percentage ?? 0;
  const maleCount = Math.round(stats.total_students * (malePct / 100));
  const femaleCount = stats.total_students - maleCount;
  const total = maleCount + femaleCount;
  const size = 160;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const gapDeg = 4;
  const gapRatio = gapDeg / 360;
  const segments = [
    { label: "Male", value: maleCount, pct: malePct.toFixed(1), color: "#3b82f6", bg: "bg-blue-500", ratio: total > 0 ? maleCount / total : 0 },
    { label: "Female", value: femaleCount, pct: femalePct.toFixed(1), color: "#10b981", bg: "bg-emerald-500", ratio: total > 0 ? femaleCount / total : 0 },
  ];
  let offset = 0;
  const chartSegments = segments.map((seg) => {
    const ratio = seg.ratio;
    const dash = Math.max(0, (ratio - gapRatio) * circumference);
    const result = { ...seg, dash, offset: -offset * circumference };
    offset += ratio;
    return result;
  });

  return (
    <div className="bg-gray-50 rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-800">Students</h3>
      </div>
      <div className="flex justify-center mb-5">
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={center} cy={center} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
            {chartSegments.map((seg, i) => (
              <circle key={i} cx={center} cy={center} r={radius} fill="none" stroke={seg.color} strokeWidth={strokeWidth}
                strokeDasharray={`${seg.dash} ${circumference}`}
                strokeDashoffset={seg.offset}
                strokeLinecap="round" />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">{total.toLocaleString()}</span>
            <span className="text-xs text-gray-400 mt-0.5">Total</span>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {segments.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-sm ${item.bg}`} />
              <span className="text-sm font-semibold text-gray-700">{item.label}</span>
              <span className="text-xs text-gray-400">({item.pct}%)</span>
            </div>
            <span className="text-sm text-gray-600 font-medium">{item.value.toLocaleString()} students</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);

  const timeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminApi.getAnnouncements();
        setAnnouncements(res.data);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAdd = async () => {
    if (!newContent.trim()) return;
    try {
      const res = await adminApi.createAnnouncement({
        title: "General Announcement",
        content: newContent.trim(),
        is_global: true,
      });
      setAnnouncements((prev) => [res.data, ...prev]);
      setNewContent("");
      setShowNewForm(false);
    } catch (err) {
      console.error("Failed to create announcement:", err);
    }
  };

  const handleCancel = () => {
    setNewContent("");
    setShowNewForm(false);
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-800">Announcements</h3>
        {!showNewForm && (
          <button
            onClick={() => setShowNewForm(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FaPlus size={10} />
            New
          </button>
        )}
      </div>

      {showNewForm && (
        <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200">
          <textarea
            autoFocus
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write your announcement..."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 resize-none"
            rows={3}
          />
          <div className="flex items-center justify-end gap-2 mt-3">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newContent.trim()}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#1B2036] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-400">Loading announcements...</p>
        </div>
      ) : announcements.length === 0 && !showNewForm ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <FaBullhorn size={18} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">No announcements yet</p>
          <p className="text-xs text-gray-300 mt-1">
            Click "New" to create one
          </p>
        </div>
      ) : (
        <nav className="max-h-[260px] overflow-y-auto space-y-3">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <FaBullhorn size={13} className="text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {announcement.content}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-medium text-gray-500">
                    {announcement.author_name}
                  </span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-gray-400">
                    {timeAgo(announcement.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </nav>
      )}
    </div>
  );
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_students: 0,
    total_courses: 0,
    total_doctors: 0,
    total_tas: 0,
    gender_distribution: { male_percentage: 0, female_percentage: 0 },
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        const response = await adminApi.getDashboardSummary();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard summary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardSummary();
  }, []);

  const statsCards = [
    {
      label: "Students",
      value: loading ? "..." : stats.total_students.toLocaleString(),
      color: "text-gray-700",
      bg: "bg-blue-50",
      path: "/admin/students",
    },
    {
      label: "Instructors",
      value: loading ? "..." : stats.total_doctors.toLocaleString(),
      color: "text-gray-700",
      bg: "bg-purple-50",
      path: "/admin/instructors",
    },
    {
      label: "TAs",
      value: loading ? "..." : stats.total_tas.toLocaleString(),
      color: "text-gray-700",
      bg: "bg-emerald-50",
      path: "/admin/teaching-assistants",
    },
    {
      label: "Courses",
      value: loading ? "..." : stats.total_courses.toLocaleString(),
      color: "text-gray-700",
      bg: "bg-amber-50",
      path: "/admin/courses",
    },
  ];

  return (
    <div className="flex-1 flex overflow-hidden  min-h-screen">
      <div className="flex-1 flex flex-col overflow-y-auto p-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-400">{today}</p>
          </div>
          <div className="flex items-center gap-3"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsCards.map((card) => (
            <StatCard
              key={card.label}
              {...card}
              onClick={() => navigate(card.path)}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <StudentsChart stats={stats} />
          <DepartmentsDonut stats={stats} />
        </div>

        <AnnouncementsSection />

        <div className="flex-1" />
      </div>

      <div className="w-72 bg-white border-l border-gray-100 flex flex-col overflow-y-auto p-3 shadow-sm">
        <Calendar />
        <ScheduleSection />
      </div>
    </div>
  );
};

export default Dashboard;
