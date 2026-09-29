import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  getCourseById,
  getCourseProgress,
  toggleLessonCompletion,
  getStudentById,
  submitModuleQuiz
} from "../utils/lmsState";

import {
  FaArrowLeft,
  FaCheckCircle,
  FaRegCircle,
  FaPlay,
  FaChevronDown,
  FaChevronUp,
  FaFileDownload,
  FaTrophy,
  FaQuestionCircle
} from "react-icons/fa";

import useToken from "../hooks/useToken";
import { jwtDecode } from "jwt-decode";

/**
 * Player Page Component
 * Renders the main interface for course consumption: video player, curriculum sidebar,
 * lesson resources, module quizzes, and celebration modals.
 */
export default function Player() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const lastLoadedKey = useRef(null);

  // --- State Variables ---
  const [course, setCourse] = useState(null);
  const [progressInfo, setProgressInfo] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [activeView, setActiveView] = useState("lesson");
  const [activeQuizModuleId, setActiveQuizModuleId] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [quizAnswersByModule, setQuizAnswersByModule] = useState({});
  const [quizResultsByModule, setQuizResultsByModule] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const { token, saveToken, removeToken } = useToken();

  // --- Effects ---
  useEffect(() => {
    if (!courseId) {
      navigate("/lms", { replace: true });
    }
  }, [courseId, navigate]);

  useEffect(() => {
    async function fetchStudentData() {
      if (token) {
        const response = await getStudentById(jwtDecode(token).id);
        setStudent(response);
      }
    }

    fetchStudentData();
  }, [token]);

  // Load course details and enrollment progress on mount/route change
  useEffect(() => {
    async function loadPlayerData() {
      if (!courseId || !student?.id) return;

      const fetchKey = `${courseId}:${student.id}`;

      if (lastLoadedKey.current === fetchKey) return;

      lastLoadedKey.current = fetchKey;

      try {
        const targetId = courseId;

        const foundCourse = await getCourseById(targetId);

        if (!foundCourse) return;

        setCourse(foundCourse);

        const courseinfo = student.enrollments.find(
          (e) => String(e.courseId) === String(targetId)
        );

        const prog = await getCourseProgress(courseinfo);

        setProgressInfo(prog);

        // Default to the first lesson of the first module
        if (foundCourse.modules && foundCourse.modules.length > 0) {
          const firstMod = foundCourse.modules[0];

          if (firstMod.lessons && firstMod.lessons.length > 0) {
            setCurrentLesson(firstMod.lessons[0]);
            setActiveView("lesson");
            setActiveQuizModuleId(null);
          }

          // Expand all modules by default
          const defaultExpanded = {};

          foundCourse.modules.forEach((m) => {
            defaultExpanded[m._id] = true;
          });

          setExpandedModules(defaultExpanded);
        }
      } catch (err) {
        console.error("Error loading player data:", err);
      }
    }

    loadPlayerData();
  }, [courseId, student]);

  // Celebration is only awarded when a quiz is submitted with a passing score.

  // --- Helper / Action Handlers ---

  const handleLessonSelect = (lesson) => {
    setActiveView("lesson");
    setActiveQuizModuleId(null);
    setCurrentLesson(lesson);
  };

  const handleQuizSelect = (module) => {
    setActiveView("quiz");
    setActiveQuizModuleId(module?._id || null);
  };

  const currentModule =
    course?.modules?.find((module) =>
      module.lessons?.some(
        (lesson) =>
          String(lesson._id) === String(currentLesson?._id)
      )
    ) ||
    course?.modules?.[0] ||
    null;

  const selectedQuizModule = activeQuizModuleId
    ? course?.modules?.find(
        (module) =>
          String(module._id) === String(activeQuizModuleId)
      ) || null
    : null;

  const handleToggleCompletion = async (lessonId) => {
    try {
      await toggleLessonCompletion(course._id, lessonId);

      const refreshedStudent = await getStudentById(
        student._id || student.id
      );

      setStudent(refreshedStudent);

      const updatedEnrollment =
        refreshedStudent.enrollments.find(
          (enrollment) =>
            String(enrollment.courseId) === String(course._id)
        );

      const prog = await getCourseProgress(updatedEnrollment);

      setProgressInfo(prog);
    } catch (err) {
      console.error("Error toggling completion:", err);
    }
  };

  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const handleNextLesson = async () => {
    const currentModuleIndex = course.modules.findIndex(
      (module) =>
        module.lessons?.some(
          (lesson) =>
            String(lesson._id) === String(currentLesson._id)
        )
    );

    const currentModuleData =
      currentModuleIndex >= 0
        ? course.modules[currentModuleIndex]
        : null;

    const currentLessonIndex =
      currentModuleData?.lessons?.findIndex(
        (lesson) =>
          String(lesson._id) === String(currentLesson._id)
      ) ?? -1;

    const nextLesson =
      currentModuleData?.lessons?.[
        currentLessonIndex + 1
      ] || null;

    // Automatically mark the current lesson complete when clicking next
    if (
      !progressInfo?.completedLessons.includes(
        currentLesson._id
      )
    ) {
      await handleToggleCompletion(currentLesson._id);
    }

    if (nextLesson) {
      setActiveView("lesson");
      setActiveQuizModuleId(null);
      setCurrentLesson(nextLesson);
    } else {
      const quizExistsForModule =
        Array.isArray(currentModuleData?.quiz) &&
        currentModuleData.quiz.length > 0;

      if (quizExistsForModule) {
        setActiveView("quiz");
        setActiveQuizModuleId(currentModuleData._id);
      }
    }
  };

  const handleQuizAnswer = (moduleId, qIdx, option) => {
    setQuizAnswersByModule((prev) => ({
      ...prev,
      [moduleId]: {
        ...(prev[moduleId] || {}),
        [qIdx]: option
      }
    }));
  };

  const handleSubmitModuleQuiz = async (module) => {
    if (!module) return;

    const quizQuestions = module.quiz || [];

    if (quizQuestions.length === 0) return;

    const answers =
      quizAnswersByModule[module._id] || {};

    let correctCount = 0;

    quizQuestions.forEach((q, idx) => {
      if (answers[idx] === q.answer) {
        correctCount++;
      }
    });

    const scorePercent = Math.round(
      (correctCount / quizQuestions.length) * 100
    );

    const passed = scorePercent >= 70;

    setQuizResultsByModule((prev) => ({
      ...prev,
      [module._id]: {
        score: scorePercent,
        passed
      }
    }));

    try {
      await submitModuleQuiz(
        course._id,
        module._id,
        scorePercent,
        passed
      );

      const refreshedStudent = await getStudentById(
        student._id || student.id
      );

      setStudent(refreshedStudent);

      const updatedEnrollment =
        refreshedStudent.enrollments.find(
          (enrollment) =>
            String(enrollment.courseId) ===
            String(course._id)
        );

      const prog = await getCourseProgress(
        updatedEnrollment
      );

      setProgressInfo(prog);

      if (passed) {
        setShowCelebration(true);
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  // --- Render Fallback ---
  if (!course || !currentLesson || !progressInfo || !student) {
    return (
      <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center px-4">
        <div className="text-center">

          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-[#e7eee9]" />

            <div className="absolute inset-0 rounded-full border-4 border-[#1f5d42] border-t-transparent animate-spin" />
          </div>

          <h2 className="text-lg md:text-xl font-semibold text-[#1f5d42]">
            Loading course player...
          </h2>

          <p className="text-sm text-[#718278] mt-1">
            Preparing your learning experience
          </p>
        </div>
      </div>
    );
  }

  // --- Main Layout ---
  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#234d3a] flex flex-col">

      {/* Top Header Control Bar */}
      <PlayerHeader
        course={course}
        navigate={navigate}
      />

      {/* Main Workspace Split Panel */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* Left Side: Video Player & Tabs */}
        <div className="flex-1 flex flex-col p-3 sm:p-4 lg:p-6 overflow-y-auto lg:max-h-[calc(100vh-4rem)]">

          {activeView === "lesson" ? (
            <>
              <VideoPlayerSection
                currentLesson={currentLesson}
                progressInfo={progressInfo}
                handleToggleCompletion={
                  handleToggleCompletion
                }
                handleNextLesson={handleNextLesson}
              />

              <LessonResourcesPanel
                currentLesson={currentLesson}
              />
            </>
          ) : (
            <ModuleQuizPanel
              module={
                selectedQuizModule || currentModule
              }
              quizAnswersByModule={
                quizAnswersByModule
              }
              quizResultsByModule={
                quizResultsByModule
              }
              handleQuizAnswer={handleQuizAnswer}
              handleSubmitModuleQuiz={
                handleSubmitModuleQuiz
              }
            />
          )}
        </div>

        {/* Right Side: Navigation Outline Sidebar */}
        <CurriculumSidebar
          progressInfo={progressInfo}
          course={course}
          expandedModules={expandedModules}
          toggleModule={toggleModule}
          currentLesson={currentLesson}
          activeView={activeView}
          activeQuizModuleId={activeQuizModuleId}
          handleToggleCompletion={
            handleToggleCompletion
          }
          handleLessonSelect={handleLessonSelect}
          handleQuizSelect={handleQuizSelect}
        />
      </div>

      {/* Celebratory Completion Modal Overlay */}
      <CelebrationModal
        isOpen={showCelebration}
        course={course}
        onClose={() =>
          setShowCelebration(false)
        }
      />
    </div>
  );
}


// ==========================================
//          PLAYER HEADER
// ==========================================

function PlayerHeader({ course, navigate }) {
  return (
    <div
      className="
        bg-white
        border-b
        border-[#e7eee9]
        px-3
        sm:px-4
        py-3
        flex
        items-center
        justify-between
        gap-3
        shadow-[0_4px_18px_rgba(31,93,66,0.06)]
        z-10
        sticky
        top-0
      "
    >

      <div className="flex items-center gap-2 sm:gap-4 min-w-0">

        <button
          onClick={() =>
            navigate(`/lms/course/${course._id}`)
          }
          className="
            p-2
            text-[#1f5d42]
            hover:text-white
            rounded-xl
            hover:bg-[#1f5d42]
            transition-all
            duration-300
            flex
            items-center
            justify-center
            cursor-pointer
            shrink-0
          "
          aria-label="Back to Course Details"
        >
          <FaArrowLeft />
        </button>

        <div className="min-w-0">

          <span className="text-[9px] sm:text-xs uppercase tracking-[0.16em] text-[#d97706] font-semibold">
            {course.category} Course
          </span>

          <h1 className="text-sm md:text-lg font-bold font-serif line-clamp-1 text-[#1f5d42]">
            {course.title}
          </h1>
        </div>
      </div>

      <Link
        to="/lms/dashboard"
        className="
          shrink-0
          text-[10px]
          sm:text-xs
          md:text-sm
          bg-[#1f5d42]
          hover:bg-[#174a34]
          text-white
          font-semibold
          py-2
          px-3
          sm:px-4
          rounded-full
          transition-all
          duration-300
          shadow-[0_6px_18px_rgba(31,93,66,0.15)]
        "
      >
        My Dashboard
      </Link>
    </div>
  );
}


// ==========================================
//          YOUTUBE EMBED HELPER
// ==========================================

function getEmbedUrl(url) {
  if (!url) return "";

  if (url.includes("/embed/")) {
    return url;
  }

  if (url.includes("youtu.be/")) {
    const parts = url.split("youtu.be/");

    if (parts.length > 1) {
      const idAndParams = parts[1];
      const videoId = idAndParams.split("?")[0];

      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  if (url.includes("watch?v=")) {
    const parts = url.split("watch?v=");

    if (parts.length > 1) {
      const idAndParams = parts[1];
      const videoId = idAndParams.split("&")[0];

      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  return url;
}


// ==========================================
//          VIDEO PLAYER SECTION
// ==========================================

function VideoPlayerSection({
  currentLesson,
  progressInfo,
  handleToggleCompletion,
  handleNextLesson
}) {
  const hasVideo = !!currentLesson.videoUrl;

  const isCompleted =
    progressInfo?.completedLessons?.includes(
      currentLesson._id
    );

  return (
    <div className="w-full max-w-5xl mx-auto">

      {/* Video */}
      {hasVideo && (
        <div
          className="
            aspect-video
            rounded-2xl
            overflow-hidden
            shadow-[0_18px_50px_rgba(20,61,45,0.18)]
            bg-black
            border
            border-[#e7eee9]
            animate-fade-in
          "
        >
          <iframe
            className="w-full h-full"
            src={getEmbedUrl(
              currentLesson.videoUrl
            )}
            title={currentLesson.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* Text Lesson */}
      <div
        className="
          min-h-[300px]
          md:min-h-[380px]
          mt-4
          rounded-2xl
          p-5
          md:p-8
          flex
          flex-col
          justify-between
          shadow-[0_12px_35px_rgba(31,93,66,0.07)]
          overflow-y-auto
          animate-fade-in
          bg-white
          border
          border-[#e7eee9]
        "
      >

        <div>

          <div className="flex items-start gap-3 border-b border-[#e7eee9] pb-3 mb-4">

            <div className="w-1 h-7 bg-[#f59e0b] rounded-full shrink-0"></div>

            <h2 className="text-xl md:text-2xl font-bold font-serif text-[#1f5d42]">
              {currentLesson.title}
            </h2>
          </div>

          <div
            className="
              text-[#587064]
              text-sm
              md:text-base
              leading-relaxed
              space-y-4
              whitespace-pre-line
              text-justify
              max-h-[300px]
              overflow-y-auto
              pr-2
              custom-scrollbar
            "
          >
            {currentLesson.content ||
            currentLesson.text ? (
              currentLesson.content ||
              currentLesson.text
            ) : (
              <div className="text-[#8a9991] italic bg-[#f3f7f4] p-4 rounded-xl border border-[#e7eee9]">
                <p>
                  Welcome to{" "}
                  <strong className="text-[#1f5d42]">
                    {currentLesson.title}
                  </strong>
                  .
                </p>

                <p className="mt-2 text-xs text-[#718278]">
                  This is a text-based lesson. Use
                  the resources below and the module
                  quiz when you finish the lesson.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-[10px] md:text-xs text-[#d97706] mt-4 font-semibold uppercase tracking-[0.16em]">
          ✦ Text Lesson Reading
        </div>
      </div>


      {/* Player Controls */}
      <div
        className="
          mt-4
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-3
          bg-white
          border
          border-[#e7eee9]
          shadow-[0_8px_25px_rgba(31,93,66,0.06)]
          p-3
          rounded-2xl
        "
      >

        <div className="flex items-center gap-2">

          <button
            onClick={() =>
              handleToggleCompletion(
                currentLesson._id
              )
            }
            className={`
              flex
              items-center
              gap-2
              px-3
              py-2
              rounded-xl
              text-xs
              md:text-sm
              font-semibold
              transition-all
              duration-300
              cursor-pointer
              ${
                isCompleted
                  ? "bg-[#e8f1eb] text-[#1f5d42] border border-[#cfdcd4]"
                  : "bg-[#f3f7f4] text-[#587064] border border-[#e7eee9] hover:bg-[#e8f1eb] hover:text-[#1f5d42]"
              }
            `}
          >
            {isCompleted ? (
              <>
                <FaCheckCircle className="text-[#1f5d42]" />
                Completed
              </>
            ) : (
              <>
                <FaRegCircle className="text-[#8a9991]" />
                Mark Completed
              </>
            )}
          </button>
        </div>

        <button
          onClick={handleNextLesson}
          className="
            bg-[#1f5d42]
            hover:bg-[#174a34]
            text-white
            px-4
            py-2
            rounded-xl
            text-xs
            md:text-sm
            font-semibold
            transition-all
            duration-300
            cursor-pointer
            shadow-[0_6px_18px_rgba(31,93,66,0.15)]
          "
        >
          Next Lesson
        </button>
      </div>
    </div>
  );
}


// ==========================================
//          LESSON RESOURCES
// ==========================================

function LessonResourcesPanel({
  currentLesson
}) {
  const resources =
    currentLesson?.resources || [];

  const hasResources =
    resources && resources.length > 0;

  return (
    <div
      className="
        max-w-5xl
        w-full
        mx-auto
        mt-6
        md:mt-8
        bg-white
        p-5
        md:p-6
        rounded-2xl
        border
        border-[#e7eee9]
        shadow-[0_10px_30px_rgba(31,93,66,0.06)]
      "
    >

      <div className="flex items-center justify-between mb-4 gap-3">

        <h3 className="text-sm md:text-md font-bold text-[#1f5d42]">
          Downloadable Reference Material
        </h3>

        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.16em] font-bold text-[#d97706]">
          Resources
        </span>
      </div>

      {hasResources ? (
        <div className="space-y-3">

          {resources.map((res, i) => (
            <a
              key={i}
              href={res.url}
              className="
                flex
                items-center
                gap-3
                p-3
                bg-[#f3f7f4]
                hover:bg-[#e8f1eb]
                border
                border-[#e7eee9]
                rounded-xl
                transition-all
                duration-300
                text-sm
                text-[#587064]
                shadow-sm
              "
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFileDownload className="text-[#1f5d42] shrink-0" />

              <span className="font-semibold">
                {res.title}
              </span>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-[#8a9991] text-sm">
          No external resources provided for this lesson.
        </p>
      )}
    </div>
  );
}


// ==========================================
//          MODULE QUIZ PANEL
// ==========================================

function ModuleQuizPanel({
  module,
  quizAnswersByModule,
  quizResultsByModule,
  handleQuizAnswer,
  handleSubmitModuleQuiz
}) {
  const quizQuestions = module?.quiz || [];

  const quizResult = module
    ? quizResultsByModule[module._id]
    : null;

  const quizAnswers = module
    ? quizAnswersByModule[module._id] || {}
    : {};

  const hasQuiz = quizQuestions.length > 0;

  if (!module) {
    return (
      <div
        className="
          max-w-5xl
          w-full
          mx-auto
          mt-8
          bg-white
          p-6
          rounded-2xl
          border
          border-[#e7eee9]
          text-[#718278]
          text-sm
          shadow-[0_10px_30px_rgba(31,93,66,0.06)]
        "
      >
        Module quiz will appear here when a
        module is selected.
      </div>
    );
  }

  return (
    <div
      className="
        max-w-5xl
        w-full
        mx-auto
        mt-2
        md:mt-8
        bg-white
        p-5
        md:p-7
        rounded-2xl
        border
        border-[#e7eee9]
        shadow-[0_12px_35px_rgba(31,93,66,0.07)]
      "
    >

      {/* Quiz Header */}
      <div className="flex items-start gap-3 mb-4">

        <div className="w-10 h-10 rounded-full bg-[#e8f1eb] flex items-center justify-center shrink-0">
          <FaQuestionCircle className="text-[#1f5d42] text-lg" />
        </div>

        <div>
          <h3 className="text-lg md:text-xl font-bold font-serif text-[#1f5d42]">
            Module Quiz
          </h3>

          <p className="text-sm text-[#587064] mt-0.5">
            {module.title}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">

        <span className="text-[#f59e0b]">
          ✦
        </span>

        <p className="text-xs md:text-sm text-[#718278]">
          Complete the questions for this module.
          Score 70% or higher to pass this module quiz.
        </p>
      </div>

      {hasQuiz ? (
        <div className="space-y-7">

          {quizQuestions.map((q, qIdx) => (
            <div
              key={qIdx}
              className="
                space-y-3
                bg-[#f8faf8]
                border
                border-[#e7eee9]
                p-4
                md:p-5
                rounded-2xl
              "
            >

              <h4 className="text-sm font-semibold text-[#234d3a] leading-relaxed">
                {qIdx + 1}. {q.question}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                {q.options.map((opt, oIdx) => {

                  const isSelected =
                    quizAnswers[qIdx] === opt;

                  return (
                    <button
                      key={oIdx}
                      onClick={() =>
                        handleQuizAnswer(
                          module._id,
                          qIdx,
                          opt
                        )
                      }
                      className={`
                        text-left
                        p-3
                        rounded-xl
                        border
                        text-xs
                        transition-all
                        duration-300
                        cursor-pointer
                        ${
                          isSelected
                            ? "bg-[#1f5d42] text-white font-semibold border-[#1f5d42] shadow-md"
                            : "bg-white border-[#e7eee9] text-[#587064] hover:bg-[#e8f1eb] hover:border-[#cfdcd4]"
                        }
                      `}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            onClick={() =>
              handleSubmitModuleQuiz(module)
            }
            className="
              w-full
              py-3
              bg-[#f59e0b]
              hover:bg-[#d97706]
              text-white
              font-bold
              rounded-xl
              transition-all
              duration-300
              mt-6
              cursor-pointer
              shadow-[0_8px_22px_rgba(245,158,11,0.18)]
            "
          >
            Submit Module Quiz
          </button>

          {quizResult && (
            <div
              className={`
                mt-6
                p-4
                rounded-xl
                text-center
                font-bold
                text-sm
                ${
                  quizResult.passed
                    ? "bg-[#e8f1eb] text-[#1f5d42] border border-[#cfdcd4]"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }
              `}
            >
              {quizResult.passed ? (
                <>
                  Passed! Score: {quizResult.score}%
                  {" "}
                  (Required: 70%)
                </>
              ) : (
                <>
                  Failed. Score: {quizResult.score}%
                  {" "}
                  (Required: 70%). Please review
                  lessons and try again.
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-[#718278] text-sm">
          No quiz configured for this module yet.
        </p>
      )}
    </div>
  );
}


// ==========================================
//          CURRICULUM SIDEBAR
// ==========================================

function CurriculumSidebar({
  progressInfo,
  course,
  expandedModules,
  toggleModule,
  currentLesson,
  activeView,
  activeQuizModuleId,
  handleToggleCompletion,
  handleLessonSelect,
  handleQuizSelect
}) {
  const progressPercent =
    progressInfo?.progress || 0;

  const completedCount =
    progressInfo?.completedCount || 0;

  const totalLessons =
    progressInfo?.totalLessons || 0;

  return (
    <div
      className="
        w-full
        lg:w-80
        bg-white
        border-t
        lg:border-t-0
        lg:border-l
        border-[#e7eee9]
        shadow-[0_0_25px_rgba(31,93,66,0.05)]
        flex
        flex-col
        z-0
      "
    >

      {/* Progress Tracker Widget */}
      <div
        className="
          p-4
          border-b
          border-[#e7eee9]
          bg-[#f3f7f4]
        "
      >

        <div className="flex items-center justify-between text-xs font-semibold mb-2">

          <span className="text-[#718278] tracking-wide">
            YOUR PROGRESS
          </span>

          <span className="text-[#1f5d42]">
            {progressPercent}% Complete
          </span>
        </div>

        <div className="w-full bg-[#dfe9e3] h-2.5 rounded-full overflow-hidden">

          <div
            className="
              bg-[#f59e0b]
              h-full
              rounded-full
              transition-all
              duration-300
            "
            style={{
              width: `${progressPercent}%`
            }}
          ></div>
        </div>

        <span className="text-xs text-[#718278] mt-2 block">
          {completedCount} of {totalLessons} lessons complete
        </span>
      </div>


      {/* Curriculum Accordion */}
      <div
        className="
          flex-1
          overflow-y-auto
          max-h-[400px]
          lg:max-h-[none]
          divide-y
          divide-[#e7eee9]
        "
      >

        {course.modules &&
          course.modules.map((mod) => {

            const isExpanded =
              expandedModules[mod._id] !== false;

            return (
              <div
                key={mod._id}
                className="bg-white"
              >

                {/* Module Toggle Button */}
                <button
                  onClick={() =>
                    toggleModule(mod._id)
                  }
                  className="
                    w-full
                    p-4
                    flex
                    items-center
                    justify-between
                    gap-3
                    font-bold
                    text-[#234d3a]
                    text-sm
                    hover:bg-[#f3f7f4]
                    transition-all
                    duration-300
                    text-left
                    cursor-pointer
                  "
                >

                  <span className="line-clamp-1">
                    {mod.title}
                  </span>

                  {isExpanded ? (
                    <FaChevronUp className="text-[#1f5d42] shrink-0" />
                  ) : (
                    <FaChevronDown className="text-[#1f5d42] shrink-0" />
                  )}
                </button>


                {/* Module Lessons Accordion Panel */}
                {isExpanded && (
                  <div className="bg-[#fafcfb] divide-y divide-[#edf2ef]">

                    {mod.lessons &&
                      mod.lessons.map((lesson) => {

                        const isCurrent =
                          lesson._id ===
                          currentLesson._id;

                        const isCompleted =
                          progressInfo?.completedLessons.includes(
                            lesson._id
                          );

                        return (
                          <div
                            key={lesson._id}
                            className={`
                              flex
                              items-start
                              gap-3
                              p-3
                              transition-all
                              duration-300
                              text-left
                              relative
                              ${
                                isCurrent
                                  ? "bg-[#e8f1eb] border-l-2 border-[#1f5d42]"
                                  : "hover:bg-[#f3f7f4]"
                              }
                            `}
                          >

                            {/* Completion Toggle Icon Button */}
                            <button
                              onClick={() =>
                                handleToggleCompletion(
                                  lesson._id
                                )
                              }
                              className="
                                mt-0.5
                                text-[#8a9991]
                                hover:text-[#1f5d42]
                                transition
                                cursor-pointer
                                shrink-0
                              "
                              aria-label={
                                isCompleted
                                  ? "Mark lesson incomplete"
                                  : "Mark lesson complete"
                              }
                            >
                              {isCompleted ? (
                                <FaCheckCircle className="text-[#1f5d42] text-base" />
                              ) : (
                                <FaRegCircle className="text-[#a5b2ab] text-base" />
                              )}
                            </button>


                            {/* Clickable Lesson Title */}
                            <button
                              onClick={() =>
                                handleLessonSelect(
                                  lesson
                                )
                              }
                              className="
                                flex-1
                                text-xs
                                text-left
                                cursor-pointer
                                min-w-0
                              "
                            >

                              <span
                                className={`
                                  font-semibold
                                  block
                                  ${
                                    isCurrent
                                      ? "text-[#1f5d42] font-bold"
                                      : "text-[#587064]"
                                  }
                                `}
                              >
                                {lesson.title}
                              </span>

                              <span className="text-[10px] text-[#8a9991] flex items-center gap-2 mt-1">

                                <FaPlay className="text-[8px] text-[#d97706]" />

                                {lesson.duration}
                              </span>
                            </button>
                          </div>
                        );
                      })}


                    {/* Module Quiz */}
                    {mod.quiz &&
                      mod.quiz.length > 0 && (
                        <button
                          onClick={() =>
                            handleQuizSelect(mod)
                          }
                          className={`
                            w-full
                            flex
                            items-center
                            justify-between
                            gap-3
                            p-3
                            transition-all
                            duration-300
                            text-left
                            border-t
                            border-[#e7eee9]
                            ${
                              activeView === "quiz" &&
                              String(
                                activeQuizModuleId
                              ) === String(mod._id)
                                ? "bg-[#fff7e6] border-l-2 border-[#f59e0b]"
                                : "hover:bg-[#fffaf0]"
                            }
                          `}
                        >

                          <div className="flex items-start gap-3 min-w-0">

                            <FaQuestionCircle className="mt-1 text-[#f59e0b] text-sm shrink-0" />

                            <div className="min-w-0 text-left">

                              <span className="font-semibold block text-[#234d3a] text-xs">
                                Module Quiz
                              </span>

                              <span className="text-[10px] text-[#8a9991]">
                                {mod.quiz.length} questions
                              </span>
                            </div>
                          </div>

                          <span className="text-[10px] text-[#d97706] uppercase tracking-wider font-semibold shrink-0">
                            Quiz
                          </span>
                        </button>
                      )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}


// ==========================================
//          CELEBRATION MODAL
// ==========================================

function CelebrationModal({
  isOpen,
  course,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        p-4
        bg-[#071a12]/85
        backdrop-blur-sm
      "
    >

      <div
        className="
          bg-[#143d2d]
          border
          border-[#f59e0b]/30
          p-7
          md:p-8
          rounded-3xl
          max-w-md
          w-full
          text-center
          shadow-[0_25px_80px_rgba(0,0,0,0.4)]
          relative
          overflow-hidden
        "
      >

        {/* Spotlight Glow Effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#f59e0b]/15 rounded-full blur-3xl"></div>

        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#1f5d42] rounded-full blur-3xl"></div>


        {/* Trophy */}
        <div className="relative z-10">

          <div
            className="
              w-20
              h-20
              rounded-full
              bg-[#f59e0b]/15
              border
              border-[#f59e0b]/30
              flex
              items-center
              justify-center
              mx-auto
              mb-5
            "
          >
            <FaTrophy
              className="
                text-[#fbbf24]
                text-4xl
                animate-bounce
              "
            />
          </div>


          <div className="flex items-center justify-center gap-2 mb-2">

            <span className="text-[#f59e0b]">
              ✦
            </span>

            <span className="text-xs uppercase tracking-[0.2em] text-[#fbbf24] font-semibold">
              Congratulations
            </span>

            <span className="text-[#f59e0b]">
              ✦
            </span>
          </div>


          <h2 className="text-2xl md:text-3xl font-bold font-serif text-white">
            Course Completed!
          </h2>

          <p className="text-[#d7e5dc] text-sm mt-4 leading-relaxed">
            Incredible effort! You have completed
            all lessons for{" "}
            <strong className="text-white">
              {course.title}
            </strong>
            .
          </p>

          <p className="text-[#9fb5a9] text-xs mt-3 leading-relaxed">
            Review any pending module quiz below
            to unlock your custom completion
            certificate.
          </p>


          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-3 my-6">

            <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#f59e0b]/50"></span>

            <span className="text-[#f59e0b] text-xs">
              ✦
            </span>

            <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#f59e0b]/50"></span>
          </div>


          <div className="flex flex-col gap-3">

            <button
              onClick={onClose}
              className="
                w-full
                bg-[#f59e0b]
                hover:bg-[#d97706]
                text-white
                font-bold
                py-3
                rounded-xl
                text-sm
                transition-all
                duration-300
                cursor-pointer
                shadow-[0_8px_22px_rgba(245,158,11,0.18)]
              "
            >
              Continue Learning
            </button>

            <button
              onClick={onClose}
              className="
                w-full
                bg-white/10
                hover:bg-white/15
                text-[#d7e5dc]
                py-2.5
                rounded-xl
                text-xs
                transition-all
                duration-300
                cursor-pointer
                border
                border-white/10
              "
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
