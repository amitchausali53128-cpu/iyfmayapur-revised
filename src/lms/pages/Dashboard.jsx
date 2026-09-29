import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getStudentById,
  getCourseById,
  deleteUser,
  getCourseProgress,
} from "../utils/lmsState";

import {
  FaGraduationCap,
  FaAward,
  FaBookOpen,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaCertificate,
  FaPrint,
  FaTimes,
} from "react-icons/fa";

import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
  const navigate = useNavigate();

  const [enrolledList, setEnrolledList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [student, setStudent] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/lms/login", { replace: true });
          return;
        }

        const decoded = jwtDecode(token);
        const id = decoded?.id;

        if (!id) {
          navigate("/lms/login", { replace: true });
          return;
        }

        // Fetch active student profile
        const activeStudent = await getStudentById(id).catch((e) => {
          console.error("Error fetching student:", e);
          return null;
        });

        setStudent(activeStudent);

        const enrollments = activeStudent?.enrollments || [];

        const inProgress = [];
        const completed = [];

        const enrolledWithProgress = await Promise.all(
          enrollments.map(async (enrollment) => {
            const courseData = await getCourseById(
              enrollment.courseId
            ).catch(() => null);

            const progressInfo = await getCourseProgress(
              enrollment
            ).catch(() => null);

            return {
              ...enrollment,
              courseData,
              progress: progressInfo?.progress ?? 0,
              quizPassed: progressInfo?.quizPassed ?? false,
              completed:
                progressInfo?.completed ??
                enrollment.completed ??
                false,
            };
          })
        );

        enrolledWithProgress.forEach((enrollment) => {
          if (enrollment.completed) {
            completed.push(enrollment);
          } else {
            inProgress.push(enrollment);
          }
        });

        setEnrolledList(inProgress);
        setCompletedList(completed);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="bg-[#faf8f3] min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-[#e7eee9]"></div>

            <div className="absolute inset-0 rounded-full border-4 border-[#1f5d42] border-t-transparent animate-spin"></div>
          </div>

          <p className="text-[#587064] text-sm font-medium">
            Loading student dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf8f3] min-h-screen pt-8 md:pt-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* =====================================================
            DASHBOARD HEADER
        ====================================================== */}
        <div className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-1 h-7 rounded-full bg-[#f59e0b]"></span>

              <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#d97706]">
                IYF Mayapur
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold font-serif text-[#1f5d42]">
              Student Portal
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-[#f59e0b] text-xs">
                ✦
              </span>

              <p className="text-[#718278] text-sm">
                Manage your active courses, check progress, and view certificates.
              </p>
            </div>
          </div>

          <Link
            to="/lms"
            className="
              hidden sm:inline-flex
              items-center justify-center
              gap-2
              bg-[#1f5d42]
              hover:bg-[#174a34]
              text-white
              font-bold
              py-2.5
              px-5
              rounded-full
              shadow-[0_8px_22px_rgba(31,93,66,0.18)]
              transition-all
              duration-300
              hover:-translate-y-0.5
            "
          >
            <FaBookOpen />
            Browse Courses
          </Link>
        </div>

        {/* =====================================================
            DASHBOARD PANELS
        ====================================================== */}
        <div className="grid md:grid-cols-4 gap-8">

          {/* ===================================================
              PROFILE SIDEBAR
          ==================================================== */}
          <div className="md:col-span-1">
            <ProfileCard student={student} />
          </div>

          {/* ===================================================
              COURSES AREA
          ==================================================== */}
          <div className="md:col-span-3 space-y-10">

            {/* =================================================
                ACTIVE ENROLLED COURSES
            ================================================== */}
            <div>
              <h2 className="text-2xl font-bold font-serif text-[#1f5d42] mb-6 flex items-center gap-3">
                <span className="w-2.5 h-7 bg-[#f59e0b] rounded-full"></span>

                In-Progress Courses
              </h2>

              {enrolledList.length === 0 ? (
                <div
                  className="
                    bg-white
                    border border-[#e7eee9]
                    p-8
                    rounded-2xl
                    text-center
                    shadow-[0_10px_30px_rgba(31,93,66,0.06)]
                  "
                >
                  <FaGraduationCap className="text-[#cfdcd4] text-5xl mx-auto mb-3" />

                  <p className="text-[#3f5f50] font-medium">
                    You don't have any active courses.
                  </p>

                  <p className="text-[#8a9991] text-sm mt-1">
                    Enroll in a course to begin your journey of ancient wisdom.
                  </p>

                  <Link
                    to="/lms"
                    className="
                      inline-block
                      mt-4
                      bg-[#1f5d42]
                      hover:bg-[#174a34]
                      text-white
                      font-semibold
                      py-2
                      px-6
                      rounded-full
                      transition-all
                      duration-300
                      text-sm
                    "
                  >
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledList.map((course) => (
                    <DashboardCourseCard
                      key={course.courseId}
                      course={course.courseData}
                      progress={course.progress}
                      onResume={() =>
                        navigate(`/lms/player/${course.courseId}`)
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {/* =================================================
                COMPLETED COURSES
            ================================================== */}
            <div>
              <h2 className="text-2xl font-bold font-serif text-[#1f5d42] mb-6 flex items-center gap-3">
                <span className="w-2.5 h-7 bg-[#f59e0b] rounded-full"></span>

                Completed Courses
              </h2>

              {completedList.length === 0 ? (
                <div
                  className="
                    bg-white
                    border border-[#e7eee9]
                    p-8
                    rounded-2xl
                    text-center
                    shadow-[0_10px_30px_rgba(31,93,66,0.06)]
                  "
                >
                  <FaAward className="text-[#cfdcd4] text-5xl mx-auto mb-3" />

                  <p className="text-[#3f5f50] font-medium">
                    No completed courses yet.
                  </p>

                  <p className="text-[#8a9991] text-sm mt-1">
                    Complete all lessons and pass the module quizzes to earn certificates.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedList.map((course) => (
                    <DashboardCourseCard
                      key={course.courseId}
                      course={course.courseData}
                      progress={100}
                      isCompleted={true}
                      onCertificate={() =>
                        setSelectedCertificate(course.courseData)
                      }
                      onResume={() =>
                        navigate(`/lms/player/${course.courseId}`)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CERTIFICATE VIEWER MODAL
      ====================================================== */}
      {selectedCertificate && (
        <CertificateModal
          studentName={student?.name || "Student"}
          courseName={selectedCertificate?.title || "Course"}
          completionDate={new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
}


// ============================================================
// PROFILE CARD
// ============================================================

function ProfileCard({ student }) {
  const name = student?.name || "Student";
  const email = student?.email || "student@iyf.com";
  const studentId = student?.id || "stud1";

  const getInitials = (fullName) => {
    if (!fullName) return "ST";

    const parts = fullName.trim().split(/\s+/);

    if (parts.length > 1) {
      return (
        parts[0][0] +
        parts[parts.length - 1][0]
      ).toUpperCase();
    }

    return fullName.substring(0, 2).toUpperCase();
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const userId = jwtDecode(token).id;

      const response = await deleteUser(userId);

      if (response.ok) {
        alert("Your account has been deleted successfully.");

        localStorage.removeItem("token");

        window.location.href = "/register";
      } else {
        alert(`Failed to delete account: ${response}`);
      }
    } catch (error) {
      console.error("Error deleting account:", error);

      alert(
        "An error occurred while trying to delete your account. Please try again later."
      );
    }
  };

  return (
    <div
      className="
        bg-white
        border border-[#e7eee9]
        rounded-2xl
        p-6
        shadow-[0_12px_35px_rgba(31,93,66,0.07)]
        flex
        flex-col
        items-center
        text-center
      "
    >

      {/* Avatar */}
      <div
        className="
          w-20
          h-20
          bg-[#e8f1eb]
          rounded-full
          flex
          items-center
          justify-center
          text-[#1f5d42]
          font-extrabold
          text-3xl
          mb-4
          border-2
          border-[#cfdcd4]
          shadow-inner
        "
      >
        {getInitials(name)}
      </div>

      {/* Name */}
      <h3 className="text-lg font-bold text-[#1f5d42] flex items-center gap-1.5 justify-center">
        <FaUser className="text-xs text-[#8a9991]" />

        {name}
      </h3>

      {/* Email */}
      <p className="text-xs text-[#718278] flex items-center gap-1.5 justify-center mt-1 break-all">
        <FaEnvelope className="text-xs text-[#8a9991]" />

        {email}
      </p>

      {/* Divider */}
      <div className="w-full border-t border-[#e7eee9] mt-6 pt-6 space-y-3">

        {/* Student ID */}
        <div className="flex items-center justify-between text-xs text-[#718278]">
          <span>Student ID:</span>

          <span className="font-semibold text-[#3f5f50]">
            {studentId.toUpperCase()}
          </span>
        </div>

        {/* Account Role */}
        <div className="flex items-center justify-between text-xs text-[#718278]">
          <span>Account Role:</span>

          <span className="bg-[#e8f1eb] text-[#1f5d42] px-2.5 py-0.5 rounded-full font-semibold">
            Student
          </span>
        </div>
      </div>

      {/* View Courses */}
      <Link
        to="/lms"
        className="
          w-full
          mt-6
          bg-[#f3f7f4]
          hover:bg-[#e8f1eb]
          text-[#1f5d42]
          font-semibold
          py-2.5
          px-4
          rounded-xl
          text-xs
          transition-all
          duration-300
          text-center
          border border-[#e7eee9]
        "
      >
        View Courses Directory
      </Link>

      {/* Delete Account */}
      <div
        onClick={handleDelete}
        className="
          w-full
          mt-3
          bg-red-50
          hover:bg-red-100
          text-red-600
          hover:text-red-700
          font-semibold
          py-2.5
          px-4
          rounded-xl
          text-xs
          transition
          text-center
          cursor-pointer
          border border-red-100
        "
      >
        Delete my Account
      </div>
    </div>
  );
}


// ============================================================
// DASHBOARD COURSE CARD
// ============================================================

function DashboardCourseCard({
  course,
  progress,
  isCompleted,
  onResume,
  onCertificate,
}) {
  if (!course) return null;

  return (
    <div
      className="
        bg-white
        rounded-2xl
        border border-[#e7eee9]
        shadow-[0_10px_30px_rgba(31,93,66,0.07)]
        overflow-hidden
        flex
        flex-col
        justify-between
        min-h-[360px]
        h-full
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_18px_40px_rgba(31,93,66,0.12)]
      "
    >

      {/* =====================================================
          COURSE TOP
      ====================================================== */}
      <div>

        {/* Course Image */}
        <div className="relative aspect-video w-full bg-[#143d2d] overflow-hidden">

          <img
            src={
              course.imgUrl ||
              "https://via.placeholder.com/300x180"
            }
            alt={course.title || "Course"}
            className="
              w-full
              h-full
              object-cover
              transition-transform
              duration-500
              hover:scale-105
            "
          />

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#143d2d]/50 via-transparent to-transparent pointer-events-none"></div>

          {/* Category */}
          <span
            className="
              absolute
              top-2
              left-2
              bg-[#143d2d]/90
              backdrop-blur-sm
              text-white
              text-[10px]
              font-semibold
              px-2.5
              py-1
              rounded-full
              uppercase
              tracking-wider
              border border-white/10
            "
          >
            {course.category || "General"}
          </span>
        </div>

        {/* Course Information */}
        <div className="p-4">

          <h3 className="font-bold text-[#234d3a] text-sm md:text-base line-clamp-2">
            {course.title || "Untitled Course"}
          </h3>

          <p className="text-xs text-[#718278] mt-1 line-clamp-2">
            {course.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* =====================================================
          COURSE FOOTER
      ====================================================== */}
      <div className="p-4 border-t border-[#e7eee9] mt-auto">

        {!isCompleted ? (

          /* =================================================
             IN PROGRESS
          ================================================== */
          <div className="space-y-2">

            <div className="flex justify-between items-center text-xs font-semibold text-[#587064]">
              <span>Progress</span>

              <span className="text-[#1f5d42]">
                {progress || 0}%
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full bg-[#e7eee9] h-2 rounded-full overflow-hidden">

              <div
                className="
                  bg-[#f59e0b]
                  h-full
                  rounded-full
                  transition-all
                  duration-300
                "
                style={{
                  width: `${progress || 0}%`,
                }}
              ></div>
            </div>

            {/* Resume Button */}
            <button
              onClick={onResume}
              className="
                w-full
                bg-[#1f5d42]
                hover:bg-[#174a34]
                text-white
                font-bold
                py-2.5
                rounded-xl
                text-xs
                transition-all
                duration-300
                cursor-pointer
              "
            >
              Resume Learning
            </button>
          </div>

        ) : (

          /* =================================================
             COMPLETED
          ================================================== */
          <div className="space-y-2">

            {/* Completed Label */}
            <div className="flex items-center gap-1.5 text-xs text-[#1f5d42] font-bold mb-1">

              <span className="w-5 h-5 rounded-full bg-[#e8f1eb] flex items-center justify-center">
                <FaAward className="text-[10px]" />
              </span>

              100% Completed
            </div>

            {/* Buttons */}
            <div className="flex gap-2">

              {/* Certificate */}
              <button
                onClick={onCertificate}
                className="
                  flex-1
                  bg-[#f59e0b]
                  hover:bg-[#d97706]
                  text-white
                  font-bold
                  py-2.5
                  rounded-xl
                  text-xs
                  transition-all
                  duration-300
                  flex
                  items-center
                  justify-center
                  gap-1
                  cursor-pointer
                "
              >
                <FaCertificate />

                Certificate
              </button>

              {/* Review */}
              <button
                onClick={onResume}
                className="
                  bg-[#f3f7f4]
                  hover:bg-[#e8f1eb]
                  text-[#1f5d42]
                  border border-[#e7eee9]
                  font-semibold
                  px-3
                  py-2.5
                  rounded-xl
                  text-xs
                  transition-all
                  duration-300
                  cursor-pointer
                "
              >
                Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ============================================================
// CERTIFICATE MODAL
// ============================================================

function CertificateModal({
  studentName,
  courseName,
  completionDate,
  onClose,
}) {
  const handlePrint = () => {
    window.print();
  };

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
        overflow-y-auto
      "
    >

      <div
        className="
          bg-[#143d2d]
          border
          border-[#f59e0b]/30
          p-5
          md:p-8
          rounded-3xl
          max-w-4xl
          w-full
          shadow-[0_25px_80px_rgba(0,0,0,0.35)]
          relative
        "
      >

        {/* =================================================
            CLOSE BUTTON
        ================================================== */}
        <button
          onClick={onClose}
          className="
            absolute
            top-4
            right-4
            text-[#b7c8bf]
            hover:text-white
            p-2
            hover:bg-white/10
            rounded-full
            transition
            cursor-pointer
            z-10
          "
        >
          <FaTimes className="text-lg" />
        </button>


        {/* =================================================
            CERTIFICATE FRAME
        ================================================== */}
        <div
          id="print-certificate"
          className="
            bg-[#fffaf0]
            text-[#4b3010]
            p-6
            md:p-12
            rounded-2xl
            border-8
            border-double
            border-[#b7791f]
            font-serif
            text-center
            shadow-inner
            relative
            overflow-hidden
            select-none
          "
        >

          {/* Decorative Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#f59e0b]/5 rounded-full blur-3xl pointer-events-none"></div>


          {/* Decorative Corner Borders */}

          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-[#b7791f]"></div>

          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-[#b7791f]"></div>

          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-[#b7791f]"></div>

          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-[#b7791f]"></div>


          {/* Certificate Organization */}
          <span className="text-xs uppercase tracking-widest text-[#8a641e] font-bold block mb-4">
            ISKCON Sridham Mayapur
          </span>


          {/* Certificate Title */}
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-wide text-[#1f5d42] mb-2">
            Certificate of Completion
          </h2>


          {/* Organization Subtitle */}
          <span className="text-xs italic text-[#8a641e] block mb-6 md:mb-10">
            ISKCON Youth Forum (IYF)
          </span>


          {/* Presented To */}
          <p className="text-sm md:text-base text-[#8a641e] mb-2">
            This is proudly presented to
          </p>


          {/* Student Name */}
          <p
            className="
              text-2xl
              md:text-4xl
              font-bold
              text-[#143d2d]
              underline
              decoration-[#d97706]
              underline-offset-8
              mb-6
              font-serif
            "
          >
            {studentName}
          </p>


          {/* Course Description */}
          <p className="text-sm md:text-base text-[#8a641e] max-w-xl mx-auto leading-relaxed mb-6 md:mb-10">
            for successfully completing the authorized systematic curriculum study of

            <strong
              className="
                block
                text-lg
                md:text-xl
                text-[#1f5d42]
                mt-2
                font-bold
                font-sans
              "
            >
              "{courseName}"
            </strong>
          </p>


          {/* =================================================
              DATE + DIRECTOR
          ================================================== */}
          <div className="grid grid-cols-2 gap-8 max-w-xl mx-auto mt-8 items-end text-xs">

            {/* Date */}
            <div className="text-center">

              <span className="border-b border-[#8a641e]/40 pb-1.5 block font-sans italic text-[#1f5d42]">
                {completionDate}
              </span>

              <span className="text-[10px] text-[#a07020] uppercase font-semibold block mt-1.5 flex items-center justify-center gap-1">
                <FaCalendarAlt />

                Date of Issue
              </span>
            </div>


            {/* Director */}
            <div className="text-center">

              <div
                className="
                  text-[#1f5d42]
                  text-lg
                  font-bold
                  font-serif
                  leading-none
                  italic
                  mb-1.5
                  select-none
                  opacity-80
                "
              >
                Sundar Gopal Das
              </div>

              <span className="border-t border-[#8a641e]/40 pt-1.5 block text-[10px] text-[#a07020] uppercase font-semibold">
                Director, IYF Mayapur
              </span>
            </div>
          </div>
        </div>


        {/* =================================================
            MODAL CONTROLS
        ================================================== */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">

          {/* Close */}
          <button
            onClick={onClose}
            className="
              bg-white/10
              hover:bg-white/15
              text-[#d7e5dc]
              font-semibold
              py-2.5
              px-5
              rounded-xl
              text-sm
              transition
              cursor-pointer
              border border-white/10
            "
          >
            Close
          </button>


          {/* Print */}
          <button
            onClick={handlePrint}
            className="
              flex
              items-center
              justify-center
              gap-2
              bg-[#f59e0b]
              hover:bg-[#d97706]
              text-white
              font-bold
              py-2.5
              px-6
              rounded-xl
              text-sm
              transition-all
              duration-300
              cursor-pointer
              shadow-[0_8px_20px_rgba(245,158,11,0.2)]
            "
          >
            <FaPrint />

            Print Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
