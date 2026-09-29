import { useState, useEffect } from "react";
import {
  getCourses,
  saveCourse,
  deleteCourse,
  getStudents,
  saveStudent,
  uploadImageToCloudinary,
} from "../utils/lmsState";

import {
  FaGraduationCap,
  FaAward,
  FaBookOpen,
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBook,
  FaList,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import { IoCloudUploadOutline } from "react-icons/io5";
import { SyncLoader } from "react-spinners";

/**
 * Main Administrator Portal Component
 * Manages parent state, data sync, and displays selected tabs/modals.
 */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [imgUrl, setImgUrl] = useState("");

  // Modal states
  const [editingCourse, setEditingCourse] = useState(null);
  const [managingCurriculum, setManagingCurriculum] = useState(null);

  const [newModuleName, setNewModuleName] = useState("");

  const [newLessonData, setNewLessonData] = useState({
    title: "",
    duration: "15 mins",
    videoUrl: "",
    content: "",
  });

  const [selectedModuleForLesson, setSelectedModuleForLesson] = useState("");
  const [selectedModuleForQuiz, setSelectedModuleForQuiz] = useState("");

  const [newQuizData, setNewQuizData] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    answer: "",
  });

  // Student modal states
  const [managingStudent, setManagingStudent] = useState(null);
  const [enrollCourseSelect, setEnrollCourseSelect] = useState("");

  const refreshData = async () => {
    try {
      const allCourses = await getCourses();
      const allUsers = await getStudents();

      setCourses(allCourses || []);

      const allStudents = allUsers.filter(
        (student) => student.role === "user"
      );

      setStudents(allStudents || []);
      setImgUrl("");
    } catch (err) {
      console.error("Error refreshing admin data:", err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Compute stats
  const totalCourses = courses.length;
  const totalStudents = students.length;

  let totalEnrollments = 0;

  students.forEach((s) => {
    totalEnrollments += Object.keys(s.enrolledCourses || {}).length;
  });

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleDeleteCourse = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this course? This will also remove student progress for this course."
      )
    ) {
      try {
        await deleteCourse(id);
        await refreshData();
      } catch (err) {
        console.error("Error deleting course:", err);
      }
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const courseData = {
      title: formData.get("title"),
      category: formData.get("category"),
      description: formData.get("description"),
      longDescription: formData.get("longDescription"),
      price: formData.get("price"),
      level: formData.get("level"),
      duration: formData.get("duration"),
    };

    if (imgUrl) {
      courseData.imgUrl = imgUrl;
    }

    if (editingCourse !== "new") {
      courseData._id = editingCourse._id;
      courseData.modules = editingCourse.modules || [];
      courseData.quiz = editingCourse.quiz || [];
    } else {
      courseData.modules = [];

      courseData.quiz = [
        {
          question: "What is the main topic of this course?",
          options: ["Introduction", "Yoga", "Bhakti", "All of the above"],
          answer: "All of the above",
        },
      ];
    }

    try {
      await saveCourse(courseData);
      setEditingCourse(null);
      await refreshData();
    } catch (err) {
      console.error("Error saving course:", err);
    }
  };

  const handleAddModule = async () => {
    if (!newModuleName.trim()) return;

    const updated = { ...managingCurriculum };

    if (!updated.modules) updated.modules = [];

    updated.modules.push({
      id: "mod-" + Date.now(),
      title: newModuleName,
      lessons: [],
      quiz: [],
    });

    try {
      await saveCourse(updated);

      setManagingCurriculum(updated);
      setNewModuleName("");

      await refreshData();
    } catch (err) {
      console.error("Error adding module:", err);
    }
  };

  const handleAddLesson = async () => {
    if (!selectedModuleForLesson || !newLessonData.title.trim()) return;

    const updated = { ...managingCurriculum };

    const mod = updated.modules.find(
      (m) => m.title === selectedModuleForLesson
    );

    if (mod) {
      if (!mod.lessons) mod.lessons = [];

      mod.lessons.push({
        title: newLessonData.title,
        duration: newLessonData.duration,
        videoUrl: newLessonData.videoUrl || "",
        content: newLessonData.content || "",
        resources: [],
      });

      try {
        await saveCourse(updated);

        setManagingCurriculum(updated);

        setNewLessonData({
          title: "",
          duration: "15 mins",
          videoUrl: "",
          content: "",
        });

        await refreshData();
      } catch (err) {
        console.log("updated course", updated);
        console.error("Error adding lesson:", err);
      }
    }
  };

  const handleAddQuizQuestion = async () => {
    if (!selectedModuleForQuiz || !newQuizData.question.trim()) return;

    const options = [
      newQuizData.option1,
      newQuizData.option2,
      newQuizData.option3,
      newQuizData.option4,
    ]
      .map((option) => option.trim())
      .filter(Boolean);

    if (options.length < 2 || !newQuizData.answer.trim()) return;

    const updated = { ...managingCurriculum };

    const mod = updated.modules.find(
      (module) => module.title === selectedModuleForQuiz
    );

    if (mod) {
      if (!Array.isArray(mod.quiz)) mod.quiz = [];

      mod.quiz.push({
        question: newQuizData.question.trim(),
        options,
        answer: newQuizData.answer.trim(),
      });

      try {
        await saveCourse(updated);

        setManagingCurriculum(updated);

        setNewQuizData({
          question: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          answer: "",
        });

        await refreshData();
      } catch (err) {
        console.error("Error adding quiz question:", err);
      }
    }
  };

  const handleDeleteQuizQuestion = async (modId, quizIndex) => {
    const updated = { ...managingCurriculum };

    const mod = updated.modules.find(
      (module) => module._id === modId
    );

    if (mod && Array.isArray(mod.quiz)) {
      mod.quiz = mod.quiz.filter(
        (_, index) => index !== quizIndex
      );

      try {
        await saveCourse(updated);

        setManagingCurriculum(updated);

        await refreshData();
      } catch (err) {
        console.error("Error deleting quiz question:", err);
      }
    }
  };

  const handleDeleteLesson = async (modId, lessonId) => {
    const updated = { ...managingCurriculum };

    const mod = updated.modules.find(
      (m) => m._id === modId
    );

    if (mod) {
      mod.lessons = mod.lessons.filter(
        (l) => l._id !== lessonId
      );

      try {
        await saveCourse(updated);

        setManagingCurriculum(updated);

        await refreshData();
      } catch (err) {
        console.error("Error deleting lesson:", err);
      }
    }
  };

  const handleDeleteModule = async (modId) => {
    if (
      window.confirm(
        "Delete this module and all its lessons?"
      )
    ) {
      const updated = { ...managingCurriculum };

      updated.modules = updated.modules.filter(
        (m) => m._id !== modId
      );

      try {
        await saveCourse(updated);

        setManagingCurriculum(updated);

        await refreshData();
      } catch (err) {
        console.error("Error deleting module:", err);
      }
    }
  };

  const handleEnrollStudent = async () => {
    if (!enrollCourseSelect) return;

    const updatedStudent = { ...managingStudent };

    const enrolledCoursesObj = {
      ...updatedStudent.enrolledCourses,
    };

    enrolledCoursesObj[enrollCourseSelect] = {
      courseId: enrollCourseSelect,
      enrollmentDate: new Date().toISOString(),
      completedLessons: [],
      completedQuizzes: [],
      completed: false,
    };

    updatedStudent.enrolledCourses = enrolledCoursesObj;

    try {
      await saveStudent(updatedStudent);

      setManagingStudent(updatedStudent);
      setEnrollCourseSelect("");

      await refreshData();
    } catch (err) {
      console.error("Error enrolling student:", err);
    }
  };

  const handleUnenrollStudent = async (courseId) => {
    if (
      window.confirm(
        "Remove student from this course? Progress will be lost."
      )
    ) {
      const updatedStudent = { ...managingStudent };

      const enrolledCoursesObj = {
        ...updatedStudent.enrolledCourses,
      };

      delete enrolledCoursesObj[courseId];

      updatedStudent.enrolledCourses = enrolledCoursesObj;

      try {
        await saveStudent(updatedStudent);

        setManagingStudent(updatedStudent);

        await refreshData();
      } catch (err) {
        console.error("Error unenrolling student:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] pt-8 pb-16 text-[#234d3a]">

      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ==========================================
            ADMIN HEADER
        ========================================== */}

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-5">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-8 bg-[#f59e0b]" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#d97706]">
                IYF Mayapur • Administration
              </span>
              <span className="h-px w-8 bg-[#f59e0b]" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold font-serif text-[#143d2d]">
              Administrator Portal
            </h1>

            <p className="text-[#718278] text-sm mt-2 max-w-2xl">
              Manage curriculum offerings, course content, and track student
              learning progress.
            </p>
          </div>

          <button
            onClick={() => setEditingCourse("new")}
            className="
              bg-[#1f5d42]
              hover:bg-[#174a34]
              text-white
              font-bold
              py-3
              px-5
              rounded-xl
              shadow-lg
              shadow-[#1f5d42]/15
              transition
              flex
              items-center
              justify-center
              gap-2
              cursor-pointer
              self-start
              md:self-auto
            "
          >
            <FaPlus />
            Add New Course
          </button>
        </div>

        {/* ==========================================
            TAB NAVIGATION
        ========================================== */}

        <div className="flex overflow-x-auto border-b border-[#dce6df] mb-8 font-semibold text-sm">

          <TabButton
            id="overview"
            activeTab={activeTab}
            onClick={setActiveTab}
            icon={<FaList />}
            label="Overview Stats"
          />

          <TabButton
            id="courses"
            activeTab={activeTab}
            onClick={setActiveTab}
            icon={<FaBook />}
            label="Manage Courses"
          />

          <TabButton
            id="students"
            activeTab={activeTab}
            onClick={setActiveTab}
            icon={<FaUsers />}
            label="Student Directory"
          />

        </div>

        {/* ==========================================
            TAB CONTENT
        ========================================== */}

        <div
          className="
            bg-white
            rounded-3xl
            border
            border-[#e3ebe6]
            shadow-[0_15px_45px_rgba(31,93,66,0.07)]
            p-5
            md:p-8
            min-h-[400px]
          "
        >

          {activeTab === "overview" && (
            <OverviewTab
              totalCourses={totalCourses}
              totalStudents={totalStudents}
              totalEnrollments={totalEnrollments}
            />
          )}

          {activeTab === "courses" && (
            <CoursesTab
              courses={courses}
              onManageCurriculum={setManagingCurriculum}
              onEditCourse={setEditingCourse}
              onDeleteCourse={handleDeleteCourse}
            />
          )}

          {activeTab === "students" && (
            <StudentsTab
              students={students}
              onManageStudent={setManagingStudent}
            />
          )}

        </div>
      </div>

      {/* COURSE MODAL */}

      {editingCourse && (
        <CourseModal
          editingCourse={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={handleSaveCourse}
          setImgUrl={setImgUrl}
        />
      )}

      {/* CURRICULUM MODAL */}

      {managingCurriculum && (
        <CurriculumModal
          managingCurriculum={managingCurriculum}
          onClose={() => setManagingCurriculum(null)}
          newModuleName={newModuleName}
          setNewModuleName={setNewModuleName}
          onAddModule={handleAddModule}
          onDeleteModule={handleDeleteModule}
          newLessonData={newLessonData}
          setNewLessonData={setNewLessonData}
          selectedModuleForLesson={selectedModuleForLesson}
          setSelectedModuleForLesson={setSelectedModuleForLesson}
          onAddLesson={handleAddLesson}
          onDeleteLesson={handleDeleteLesson}
          selectedModuleForQuiz={selectedModuleForQuiz}
          setSelectedModuleForQuiz={setSelectedModuleForQuiz}
          newQuizData={newQuizData}
          setNewQuizData={setNewQuizData}
          onAddQuizQuestion={handleAddQuizQuestion}
          onDeleteQuizQuestion={handleDeleteQuizQuestion}
        />
      )}

      {/* STUDENT PROFILE MODAL */}

      {managingStudent && (
        <StudentProfileModal
          managingStudent={managingStudent}
          courses={courses}
          enrollCourseSelect={enrollCourseSelect}
          setEnrollCourseSelect={setEnrollCourseSelect}
          onEnroll={handleEnrollStudent}
          onUnenroll={handleUnenrollStudent}
          onClose={() => setManagingStudent(null)}
        />
      )}
    </div>
  );
}

// ==========================================
// TAB BUTTON
// ==========================================

function TabButton({
  id,
  activeTab,
  onClick,
  icon,
  label,
}) {
  const isActive = activeTab === id;

  return (
    <button
      onClick={() => onClick(id)}
      className={`
        py-3
        px-5
        md:px-6
        border-b-2
        transition
        flex
        items-center
        gap-2
        cursor-pointer
        whitespace-nowrap
        ${
          isActive
            ? "border-[#f59e0b] text-[#1f5d42] font-bold"
            : "border-transparent text-[#718278] hover:text-[#1f5d42]"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

// ==========================================
// OVERVIEW TAB
// ==========================================

function OverviewTab({
  totalCourses,
  totalStudents,
  totalEnrollments,
}) {
  return (
    <div className="space-y-8 animate-fade-in">

      <div className="grid sm:grid-cols-3 gap-5">

        {/* COURSES */}

        <div
          className="
            bg-gradient-to-br
            from-[#edf5f0]
            to-[#f7faf8]
            p-5
            md:p-6
            rounded-2xl
            border
            border-[#dce9e1]
            flex
            items-center
            gap-4
          "
        >
          <div className="w-12 h-12 rounded-xl bg-[#1f5d42] text-white flex items-center justify-center text-xl shadow-md shrink-0">
            <FaBookOpen />
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#668374]">
              Active Courses
            </span>

            <h3 className="text-2xl font-bold text-[#143d2d]">
              {totalCourses}
            </h3>
          </div>
        </div>

        {/* STUDENTS */}

        <div
          className="
            bg-gradient-to-br
            from-[#fff7e7]
            to-[#fffaf2]
            p-5
            md:p-6
            rounded-2xl
            border
            border-[#f4e5c7]
            flex
            items-center
            gap-4
          "
        >
          <div className="w-12 h-12 rounded-xl bg-[#f59e0b] text-white flex items-center justify-center text-xl shadow-md shrink-0">
            <FaUsers />
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#c27a08]">
              Students Enrolled
            </span>

            <h3 className="text-2xl font-bold text-[#143d2d]">
              {totalStudents}
            </h3>
          </div>
        </div>

        {/* ENROLLMENTS */}

        <div
          className="
            bg-gradient-to-br
            from-[#edf5f0]
            to-[#f8faf8]
            p-5
            md:p-6
            rounded-2xl
            border
            border-[#dce9e1]
            flex
            items-center
            gap-4
          "
        >
          <div className="w-12 h-12 rounded-xl bg-[#174a34] text-[#fbbf24] flex items-center justify-center text-xl shadow-md shrink-0">
            <FaAward />
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#668374]">
              Total Enrollments
            </span>

            <h3 className="text-2xl font-bold text-[#143d2d]">
              {totalEnrollments}
            </h3>
          </div>
        </div>
      </div>

      {/* DOCUMENTATION */}

      <div className="border border-[#e0e9e3] rounded-2xl p-6 bg-[#f5f8f5]">

        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-[#1f5d42] text-white flex items-center justify-center">
            <FaGraduationCap />
          </div>

          <h3 className="font-bold text-[#143d2d] text-lg">
            Admin Documentation
          </h3>
        </div>

        <ul className="text-sm text-[#587064] space-y-3">

          <li className="flex gap-3">
            <span className="text-[#f59e0b] font-bold">✦</span>
            <span>
              Use the <strong className="text-[#1f5d42]">Manage Courses</strong>{" "}
              tab to configure course modules, lessons, metadata, and
              assessments.
            </span>
          </li>

          <li className="flex gap-3">
            <span className="text-[#f59e0b] font-bold">✦</span>
            <span>
              The{" "}
              <strong className="text-[#1f5d42]">
                Student Directory
              </strong>{" "}
              tracks active registrants, completed courses, and lesson
              completion metrics.
            </span>
          </li>

        </ul>
      </div>
    </div>
  );
}

// ==========================================
// COURSES TAB
// ==========================================

function CoursesTab({
  courses,
  onManageCurriculum,
  onEditCourse,
  onDeleteCourse,
}) {
  return (
    <div className="overflow-x-auto animate-fade-in">

      <table className="w-full text-left border-collapse min-w-[800px]">

        <thead>
          <tr className="border-b border-[#dfe8e2] text-[10px] font-bold text-[#8a9991] uppercase tracking-wider">

            <th className="pb-4 w-1/3">
              Course Title
            </th>

            <th className="pb-4">
              Category
            </th>

            <th className="pb-4">
              Level
            </th>

            <th className="pb-4">
              Price
            </th>

            <th className="pb-4 text-right">
              Actions
            </th>

          </tr>
        </thead>

        <tbody className="divide-y divide-[#edf1ee] text-sm">

          {courses.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="py-10 text-center text-[#718278]"
              >
                No courses defined in the database. Click{" "}
                <strong>Add New Course</strong> to begin.
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr
                key={course._id}
                className="hover:bg-[#f7faf8] transition"
              >

                <td className="py-4 font-semibold text-[#234d3a]">
                  <div className="flex items-center gap-3">

                    <img
                      src={course.imgUrl}
                      alt=""
                      className="w-11 h-8 object-cover rounded-lg border border-[#dce7df]"
                    />

                    <span className="line-clamp-2">
                      {course.title}
                    </span>

                  </div>
                </td>

                <td className="py-4">

                  <span
                    className={`
                      px-2.5
                      py-1
                      rounded-full
                      text-xs
                      font-semibold
                      ${
                        course.category === "Vedic"
                          ? "bg-[#fff5df] text-[#b66c00] border border-[#f2dfb5]"
                          : "bg-[#edf5f0] text-[#1f5d42] border border-[#d6e6dc]"
                      }
                    `}
                  >
                    {course.category}
                  </span>

                </td>

                <td className="py-4 text-[#587064]">
                  {course.level}
                </td>

                <td className="py-4 font-semibold text-[#234d3a]">
                  {course.price}
                </td>

                <td className="py-4 text-right">

                  <div className="flex justify-end items-center gap-1">

                    <button
                      onClick={() =>
                        onManageCurriculum(course)
                      }
                      className="
                        bg-[#edf5f0]
                        text-[#1f5d42]
                        hover:bg-[#dfece4]
                        border
                        border-[#cfe0d5]
                        px-3
                        py-1.5
                        rounded-lg
                        text-xs
                        font-semibold
                        transition
                        cursor-pointer
                      "
                    >
                      Curriculum
                    </button>

                    <button
                      onClick={() => onEditCourse(course)}
                      className="
                        text-[#587064]
                        hover:text-[#1f5d42]
                        p-2
                        hover:bg-[#edf5f0]
                        rounded-md
                        transition
                        cursor-pointer
                      "
                      title="Edit Details"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() =>
                        onDeleteCourse(course._id)
                      }
                      className="
                        text-rose-500
                        hover:text-rose-700
                        p-2
                        hover:bg-rose-50
                        rounded-md
                        transition
                        cursor-pointer
                      "
                      title="Delete Course"
                    >
                      <FaTrash />
                    </button>

                  </div>

                </td>
              </tr>
            ))
          )}

        </tbody>
      </table>
    </div>
  );
}

// ==========================================
// STUDENTS TAB
// ==========================================

function StudentsTab({
  students,
  onManageStudent,
}) {
  return (
    <div className="overflow-x-auto animate-fade-in">

      <table className="w-full text-left border-collapse min-w-[700px]">

        <thead>
          <tr className="border-b border-[#dfe8e2] text-[10px] font-bold text-[#8a9991] uppercase tracking-wider">

            <th className="pb-4">
              Student Name
            </th>

            <th className="pb-4">
              Email Address
            </th>

            <th className="pb-4">
              Enrollments Count
            </th>

            <th className="pb-4 text-right">
              Actions
            </th>

          </tr>
        </thead>

        <tbody className="divide-y divide-[#edf1ee] text-sm">

          {students.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="py-10 text-center text-[#718278]"
              >
                No students registered in the database.
              </td>
            </tr>
          ) : (
            students.map((stud) => (
              <tr
                key={stud._id}
                className="hover:bg-[#f7faf8] transition"
              >

                <td className="py-4 font-semibold text-[#234d3a]">

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-full bg-[#e7f0ea] flex items-center justify-center font-bold text-xs text-[#1f5d42]">
                      {stud.name
                        ? stud.name.charAt(0).toUpperCase()
                        : "S"}
                    </div>

                    {stud.name}

                  </div>

                </td>

                <td className="py-4 text-[#718278]">
                  {stud.email}
                </td>

                <td className="py-4 text-[#234d3a] font-semibold">
                  {Object.keys(
                    stud.enrolledCourses || {}
                  ).length}
                </td>

                <td className="py-4 text-right">

                  <button
                    onClick={() =>
                      onManageStudent(stud)
                    }
                    className="
                      bg-[#edf5f0]
                      text-[#1f5d42]
                      hover:bg-[#dfece4]
                      border
                      border-[#d4e2d9]
                      px-3
                      py-1.5
                      rounded-lg
                      text-xs
                      font-semibold
                      transition
                      cursor-pointer
                    "
                  >
                    Manage Profile
                  </button>

                </td>
              </tr>
            ))
          )}

        </tbody>
      </table>
    </div>
  );
}

// ==========================================
// COURSE MODAL
// ==========================================

function CourseModal({ editingCourse, onClose, onSave, setImgUrl }) {
  const isNew = editingCourse === "new";

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  // Current image:
  // - For edit: use existing course image
  // - For new course: no image initially
  const [currentImage, setCurrentImage] = useState(
    isNew ? "" : editingCourse?.imgUrl || ""
  );

  const handleUpload = async (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setLoading(true);
    setFile(selectedFile);

    try {
      const img = new FormData();
      img.append("image", selectedFile);

      const response = await uploadImageToCloudinary(img);
      const data = await response.json();

      if (data.url) {
        // Update image shown in modal
        setCurrentImage(data.url);

        // Send new URL back to parent
        setImgUrl(data.url);

        console.log("Image uploaded successfully:", data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-fade-in">

        {/* ================= HEADER ================= */}
        <div className="bg-[#143d2d] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#fbbf24] font-bold uppercase tracking-wider">
              Course Management
            </span>

            <h3 className="font-bold text-lg">
              {isNew
                ? "Create New Course Offering"
                : "Edit Course Information"}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        {/* ================= FORM ================= */}
        <form
          onSubmit={onSave}
          className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
        >

          {/* COURSE TITLE */}
          <div>
            <label className="block text-xs font-bold text-[#587064] uppercase mb-1">
              Course Title
            </label>

            <input
              required
              type="text"
              name="title"
              defaultValue={isNew ? "" : editingCourse.title}
              className="w-full p-2.5 border border-[#dfe9e2] rounded-xl focus:border-[#1f5d42] focus:ring-1 focus:ring-[#1f5d42]/20 outline-none text-sm text-[#234d3a]"
            />
          </div>

          {/* CATEGORY + PRICE */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-xs font-bold text-[#587064] uppercase mb-1">
                Category Type
              </label>

              <select
                name="category"
                defaultValue={isNew ? "Youth" : editingCourse.category}
                className="w-full p-2.5 border border-[#dfe9e2] rounded-xl focus:border-[#1f5d42] outline-none text-sm text-[#234d3a] bg-white"
              >
                <option value="Youth">Youth Course</option>
                <option value="Vedic">Vedic Scripture Course</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#587064] uppercase mb-1">
                Course Price
              </label>

              <input
                required
                type="text"
                name="price"
                defaultValue={isNew ? "Free" : editingCourse.price}
                className="w-full p-2.5 border border-[#dfe9e2] rounded-xl focus:border-[#1f5d42] outline-none text-sm text-[#234d3a]"
              />
            </div>

          </div>

          {/* LEVEL + DURATION */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-xs font-bold text-[#587064] uppercase mb-1">
                Difficulty Level
              </label>

              <select
                name="level"
                defaultValue={isNew ? "Beginner" : editingCourse.level}
                className="w-full p-2.5 border border-[#dfe9e2] rounded-xl focus:border-[#1f5d42] outline-none text-sm text-[#234d3a] bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All levels">All levels</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#587064] uppercase mb-1">
                Est. Duration
              </label>

              <input
                required
                type="text"
                name="duration"
                defaultValue={isNew ? "3 Hours" : editingCourse.duration}
                className="w-full p-2.5 border border-[#dfe9e2] rounded-xl focus:border-[#1f5d42] outline-none text-sm text-[#234d3a]"
              />
            </div>

          </div>

          {/* ================= COURSE IMAGE ================= */}
          <div>
            <p className="text-xs font-bold text-[#587064] uppercase mb-2">
              Course Image
            </p>

            <div className="border border-[#dfe9e2] rounded-2xl bg-[#faf8f3] p-4">

              {/* CURRENT IMAGE */}
              {currentImage && (
                <div className="mb-4">

                  <p className="text-[11px] font-semibold text-[#718278] mb-2">
                    {isNew ? "Selected Image" : "Current Course Image"}
                  </p>

                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-[#dfe9e2] bg-white">

                    <img
                      src={currentImage}
                      alt="Course"
                      className="w-full h-full object-cover"
                    />

                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    <div className="absolute bottom-2 left-3">
                      <span className="text-[10px] font-semibold text-white bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                        Course Image
                      </span>
                    </div>

                  </div>
                </div>
              )}

              {/* NO IMAGE */}
              {!currentImage && !loading && (
                <div className="flex flex-col items-center justify-center py-6 text-center">

                  <div className="w-14 h-14 rounded-2xl bg-[#e8f1eb] text-[#1f5d42] flex items-center justify-center text-3xl mb-2">
                    <IoCloudUploadOutline />
                  </div>

                  <p className="text-sm font-semibold text-[#234d3a]">
                    No course image selected
                  </p>

                  <p className="text-xs text-[#718278] mt-1">
                    Upload an image for this course
                  </p>

                </div>
              )}

              {/* LOADING */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-6">

                  <SyncLoader
                    size={8}
                    color="#1f5d42"
                  />

                  <p className="text-xs text-[#718278] mt-3">
                    Uploading image...
                  </p>

                </div>
              )}

              {/* UPLOAD BUTTON */}
              {!loading && (
                <div className="flex items-center justify-center">

                  <label
                    htmlFor="imageFile"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs font-bold cursor-pointer transition shadow-sm"
                  >
                    <IoCloudUploadOutline className="text-lg" />

                    {currentImage
                      ? "Change Course Image"
                      : "Upload Course Image"}
                  </label>

                  <input
                    type="file"
                    name="imageFile"
                    id="imageFile"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                  />

                </div>
              )}

              {/* SELECTED FILE NAME */}
              {file && !loading && (
                <p className="text-[10px] text-center text-[#718278] mt-2 truncate">
                  {file.name}
                </p>
              )}

            </div>
          </div>

          {/* SHORT DESCRIPTION */}
          <div>
            <label className="block text-xs font-bold text-[#587064] uppercase mb-1">
              Short Description
            </label>

            <input
              required
              type="text"
              name="description"
              defaultValue={
                isNew ? "" : editingCourse.description
              }
              className="w-full p-2.5 border border-[#dfe9e2] rounded-xl focus:border-[#1f5d42] outline-none text-sm text-[#234d3a]"
            />
          </div>

          {/* LONG DESCRIPTION */}
          <div>
            <label className="block text-xs font-bold text-[#587064] uppercase mb-1">
              Detailed Syllabus Overview
            </label>

            <textarea
              rows="4"
              name="longDescription"
              defaultValue={
                isNew ? "" : editingCourse.longDescription
              }
              className="w-full p-2.5 border border-[#dfe9e2] rounded-xl focus:border-[#1f5d42] outline-none text-sm text-[#234d3a] resize-none"
            />
          </div>

          {/* ================= FOOTER ================= */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#e7eee9]">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#dfe9e2] text-[#587064] rounded-xl text-sm font-semibold hover:bg-[#f3f7f4] transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-[#1f5d42] hover:bg-[#174a34] text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <FaSave />
              Save Changes
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

// ==========================================
// CURRICULUM MODAL
// ==========================================

function CurriculumModal({
  managingCurriculum,
  onClose,
  newModuleName,
  setNewModuleName,
  onAddModule,
  onDeleteModule,
  newLessonData,
  setNewLessonData,
  selectedModuleForLesson,
  setSelectedModuleForLesson,
  onAddLesson,
  onDeleteLesson,
  selectedModuleForQuiz,
  setSelectedModuleForQuiz,
  newQuizData,
  setNewQuizData,
  onAddQuizQuestion,
  onDeleteQuizQuestion,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-[#10251c]/80 backdrop-blur-sm">

      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">

        {/* HEADER */}

        <div className="bg-[#143d2d] text-white px-5 md:px-6 py-4 flex items-center justify-between shrink-0">

          <div className="min-w-0">

            <span className="text-[10px] text-[#fbbf24] font-bold uppercase tracking-[0.18em]">
              Curriculum Manager
            </span>

            <h3 className="font-serif font-bold text-lg line-clamp-1 mt-1">
              {managingCurriculum.title}
            </h3>

          </div>

          <button
            onClick={onClose}
            className="
              text-[#b9c8bf]
              hover:text-white
              p-2
              hover:bg-white/10
              rounded-full
              transition
              cursor-pointer
              shrink-0
            "
          >
            <FaTimes />
          </button>

        </div>

        {/* CONTENT */}

        <div className="p-5 md:p-6 overflow-y-auto flex-1 grid md:grid-cols-2 gap-7 md:gap-8">

          {/* MODULES */}

          <div className="space-y-5">

            <div className="flex items-center gap-2 border-b border-[#e7eee9] pb-3">

              <FaBook className="text-[#f59e0b]" />

              <h4 className="font-bold text-[#143d2d]">
                Modules Outline
              </h4>

            </div>

            {managingCurriculum.modules &&
            managingCurriculum.modules.length > 0 ? (
              <div className="space-y-4">

                {managingCurriculum.modules.map(
                  (mod) => (
                    <div
                      key={mod._id}
                      className="
                        border
                        border-[#dfe9e2]
                        p-4
                        rounded-2xl
                        bg-[#f7faf8]
                      "
                    >

                      <div className="flex items-center justify-between mb-3 gap-3">

                        <h5 className="font-bold text-[#234d3a] text-sm">
                          {mod.title}
                        </h5>

                        <button
                          onClick={() =>
                            onDeleteModule(
                              mod._id
                            )
                          }
                          className="
                            text-rose-500
                            hover:text-rose-700
                            text-[11px]
                            font-semibold
                            cursor-pointer
                            whitespace-nowrap
                          "
                        >
                          Delete Module
                        </button>

                      </div>

                      {/* LESSONS */}

                      {mod.lessons &&
                      mod.lessons.length > 0 ? (
                        <ul className="space-y-1.5">

                          {mod.lessons.map(
                            (les) => (
                              <li
                                key={les._id}
                                className="
                                  flex
                                  justify-between
                                  items-center
                                  gap-2
                                  text-xs
                                  bg-white
                                  p-2.5
                                  rounded-lg
                                  border
                                  border-[#e7eee9]
                                "
                              >

                                <span className="font-medium text-[#587064] line-clamp-1">
                                  {les.title} (
                                  {les.duration})
                                </span>

                                <button
                                  onClick={() =>
                                    onDeleteLesson(
                                      mod._id,
                                      les._id
                                    )
                                  }
                                  className="
                                    text-[#8a9991]
                                    hover:text-rose-500
                                    p-0.5
                                    cursor-pointer
                                  "
                                >
                                  <FaTimes />
                                </button>

                              </li>
                            )
                          )}

                        </ul>
                      ) : (
                        <p className="text-xs text-[#8a9991] italic">
                          No lectures added to this
                          module yet.
                        </p>
                      )}

                      {/* QUIZ */}

                      <div className="mt-4 pt-3 border-t border-[#dfe9e2]">

                        <div className="flex items-center justify-between mb-2">

                          <h6 className="text-[11px] font-bold uppercase tracking-wider text-[#668374]">
                            Module Quiz
                          </h6>

                          <span className="text-[10px] text-[#8a9991]">
                            {mod.quiz?.length || 0}{" "}
                            questions
                          </span>

                        </div>

                        {mod.quiz &&
                        mod.quiz.length > 0 ? (
                          <ul className="space-y-1.5">

                            {mod.quiz.map(
                              (
                                quiz,
                                quizIndex
                              ) => (
                                <li
                                  key={`${mod._id || mod.title}-quiz-${quizIndex}`}
                                  className="
                                    flex
                                    justify-between
                                    items-start
                                    gap-3
                                    text-xs
                                    bg-white
                                    p-2.5
                                    rounded-lg
                                    border
                                    border-[#e7eee9]
                                  "
                                >

                                  <div className="min-w-0">

                                    <span className="font-medium text-[#587064] line-clamp-2">
                                      {quiz.question}
                                    </span>

                                    <p className="text-[10px] text-[#9aa79f] mt-1">
                                      {quiz.options
                                        ?.length ||
                                        0}{" "}
                                      options
                                    </p>

                                  </div>

                                  <button
                                    onClick={() =>
                                      onDeleteQuizQuestion(
                                        mod._id,
                                        quizIndex
                                      )
                                    }
                                    className="
                                      text-[#8a9991]
                                      hover:text-rose-500
                                      p-0.5
                                      shrink-0
                                      cursor-pointer
                                    "
                                  >
                                    <FaTimes />
                                  </button>

                                </li>
                              )
                            )}

                          </ul>
                        ) : (
                          <p className="text-xs text-[#8a9991] italic">
                            No quiz added to this
                            module yet.
                          </p>
                        )}

                      </div>

                    </div>
                  )
                )}

              </div>
            ) : (
              <p className="text-[#718278] text-sm italic">
                No modules configured yet. Add a
                module to start adding lessons.
              </p>
            )}

          </div>

          {/* RIGHT CONTROLS */}

          <div className="space-y-5 border-t md:border-t-0 md:border-l border-[#e5ece7] pt-6 md:pt-0 md:pl-8">

            {/* CREATE MODULE */}

            <div className="bg-[#f5f8f5] p-4 rounded-2xl border border-[#dfe9e2]">

              <h4 className="font-bold text-[#234d3a] text-sm mb-3">
                Create New Module
              </h4>

              <div className="flex gap-2">

                <input
                  type="text"
                  placeholder="e.g. Module 3: Advanced Studies"
                  value={newModuleName}
                  onChange={(e) =>
                    setNewModuleName(
                      e.target.value
                    )
                  }
                  className="
                    flex-1
                    min-w-0
                    p-2.5
                    text-xs
                    border
                    border-[#dce6df]
                    rounded-lg
                    outline-none
                    focus:border-[#1f5d42]
                    bg-white
                    text-[#234d3a]
                  "
                />

                <button
                  onClick={onAddModule}
                  className="
                    bg-[#1f5d42]
                    hover:bg-[#174a34]
                    text-white
                    font-bold
                    px-4
                    py-2
                    rounded-lg
                    text-xs
                    transition
                    cursor-pointer
                  "
                >
                  Add
                </button>

              </div>

            </div>

            {/* ADD LESSON */}

            {managingCurriculum.modules &&
              managingCurriculum.modules.length > 0 && (
                <div className="bg-[#f5f8f5] p-4 rounded-2xl border border-[#dfe9e2] space-y-3">

                  <h4 className="font-bold text-[#234d3a] text-sm">
                    Add Lecture to Module
                  </h4>

                  <div>
                    <label className="block text-[10px] font-bold text-[#718278] uppercase mb-1">
                      Target Module
                    </label>

                    <select
                      value={
                        selectedModuleForLesson
                      }
                      onChange={(e) =>
                        setSelectedModuleForLesson(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        p-2.5
                        text-xs
                        border
                        border-[#dce6df]
                        rounded-lg
                        bg-white
                        outline-none
                        focus:border-[#1f5d42]
                        text-[#234d3a]
                      "
                    >
                      <option value="">
                        -- Choose Module --
                      </option>

                      {managingCurriculum.modules.map(
                        (m) => (
                          <option key={m._id}>
                            {m.title}
                          </option>
                        )
                      )}

                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#718278] uppercase mb-1">
                      Lecture Title
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. 3.1 Understanding Karma"
                      value={
                        newLessonData.title
                      }
                      onChange={(e) =>
                        setNewLessonData(
                          (prev) => ({
                            ...prev,
                            title: e.target.value,
                          })
                        )
                      }
                      className="
                        w-full
                        p-2.5
                        text-xs
                        border
                        border-[#dce6df]
                        rounded-lg
                        bg-white
                        outline-none
                        focus:border-[#1f5d42]
                        text-[#234d3a]
                      "
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">

                    <div className="sm:col-span-1">
                      <label className="block text-[10px] font-bold text-[#718278] uppercase mb-1">
                        Est. Duration
                      </label>

                      <input
                        type="text"
                        placeholder="15 mins"
                        value={
                          newLessonData.duration
                        }
                        onChange={(e) =>
                          setNewLessonData(
                            (prev) => ({
                              ...prev,
                              duration:
                                e.target.value,
                            })
                          )
                        }
                        className="
                          w-full
                          p-2.5
                          text-xs
                          border
                          border-[#dce6df]
                          rounded-lg
                          bg-white
                          outline-none
                          focus:border-[#1f5d42]
                          text-[#234d3a]
                        "
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-[#718278] uppercase mb-1">
                        YouTube Link (Optional)
                      </label>

                      <input
                        type="text"
                        placeholder="https://www.youtube.com/embed/..."
                        value={
                          newLessonData.videoUrl
                        }
                        onChange={(e) =>
                          setNewLessonData(
                            (prev) => ({
                              ...prev,
                              videoUrl:
                                e.target.value,
                            })
                          )
                        }
                        className="
                          w-full
                          p-2.5
                          text-xs
                          border
                          border-[#dce6df]
                          rounded-lg
                          bg-white
                          outline-none
                          focus:border-[#1f5d42]
                          text-[#234d3a]
                        "
                      />
                    </div>

                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#718278] uppercase mb-1">
                      Lesson Content / Text (Optional)
                    </label>

                    <textarea
                      rows="3"
                      placeholder="Type lesson reading text here..."
                      value={
                        newLessonData.content ||
                        ""
                      }
                      onChange={(e) =>
                        setNewLessonData(
                          (prev) => ({
                            ...prev,
                            content:
                              e.target.value,
                          })
                        )
                      }
                      className="
                        w-full
                        p-2.5
                        text-xs
                        border
                        border-[#dce6df]
                        rounded-lg
                        bg-white
                        outline-none
                        focus:border-[#1f5d42]
                        text-[#234d3a]
                        resize-none
                      "
                    />
                  </div>

                  <button
                    onClick={onAddLesson}
                    className="
                      w-full
                      py-2.5
                      bg-[#1f5d42]
                      hover:bg-[#174a34]
                      text-white
                      font-bold
                      rounded-lg
                      text-xs
                      transition
                      cursor-pointer
                    "
                  >
                    Add Lecture
                  </button>

                </div>
              )}

            {/* ADD QUIZ */}

            {managingCurriculum.modules &&
              managingCurriculum.modules.length > 0 && (
                <div className="bg-[#fffaf0] p-4 rounded-2xl border border-[#f1e2c3] space-y-3">

                  <h4 className="font-bold text-[#234d3a] text-sm flex items-center gap-2">
                    <span className="text-[#d97706]">
                      ✦
                    </span>
                    Add Quiz Question to Module
                  </h4>

                  <div>
                    <label className="block text-[10px] font-bold text-[#718278] uppercase mb-1">
                      Target Module
                    </label>

                    <select
                      value={
                        selectedModuleForQuiz
                      }
                      onChange={(e) =>
                        setSelectedModuleForQuiz(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        p-2.5
                        text-xs
                        border
                        border-[#e5dcc9]
                        rounded-lg
                        bg-white
                        outline-none
                        focus:border-[#d97706]
                        text-[#234d3a]
                      "
                    >
                      <option value="">
                        -- Choose Module --
                      </option>

                      {managingCurriculum.modules.map(
                        (module) => (
                          <option
                            key={module._id}
                            value={module.title}
                          >
                            {module.title}
                          </option>
                        )
                      )}

                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#718278] uppercase mb-1">
                      Question
                    </label>

                    <textarea
                      rows="2"
                      placeholder="Type quiz question here..."
                      value={
                        newQuizData.question
                      }
                      onChange={(e) =>
                        setNewQuizData(
                          (prev) => ({
                            ...prev,
                            question:
                              e.target.value,
                          })
                        )
                      }
                      className="
                        w-full
                        p-2.5
                        text-xs
                        border
                        border-[#e5dcc9]
                        rounded-lg
                        bg-white
                        outline-none
                        focus:border-[#d97706]
                        text-[#234d3a]
                        resize-none
                      "
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2">

                    {[
                      "option1",
                      "option2",
                      "option3",
                      "option4",
                    ].map(
                      (optionKey, index) => (
                        <input
                          key={optionKey}
                          type="text"
                          placeholder={`Option ${
                            index + 1
                          }`}
                          value={
                            newQuizData[
                              optionKey
                            ]
                          }
                          onChange={(e) =>
                            setNewQuizData(
                              (prev) => ({
                                ...prev,
                                [optionKey]:
                                  e.target
                                    .value,
                              })
                            )
                          }
                          className="
                            w-full
                            p-2.5
                            text-xs
                            border
                            border-[#e5dcc9]
                            rounded-lg
                            bg-white
                            outline-none
                            focus:border-[#d97706]
                            text-[#234d3a]
                          "
                        />
                      )
                    )}

                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#718278] uppercase mb-1">
                      Correct Answer
                    </label>

                    <input
                      type="text"
                      placeholder="Must exactly match one of the options"
                      value={
                        newQuizData.answer
                      }
                      onChange={(e) =>
                        setNewQuizData(
                          (prev) => ({
                            ...prev,
                            answer:
                              e.target.value,
                          })
                        )
                      }
                      className="
                        w-full
                        p-2.5
                        text-xs
                        border
                        border-[#e5dcc9]
                        rounded-lg
                        bg-white
                        outline-none
                        focus:border-[#d97706]
                        text-[#234d3a]
                      "
                    />
                  </div>

                  <button
                    onClick={onAddQuizQuestion}
                    className="
                      w-full
                      py-2.5
                      bg-[#f59e0b]
                      hover:bg-[#d97706]
                      text-white
                      font-bold
                      rounded-lg
                      text-xs
                      transition
                      cursor-pointer
                    "
                  >
                    Add Quiz Question
                  </button>

                </div>
              )}

          </div>
        </div>

        {/* FOOTER */}

        <div className="bg-[#f5f8f5] border-t border-[#e5ece7] p-4 flex justify-end shrink-0">

          <button
            onClick={onClose}
            className="
              px-5
              py-2.5
              bg-[#143d2d]
              hover:bg-[#1f5d42]
              text-white
              rounded-xl
              text-xs
              font-semibold
              transition
              cursor-pointer
            "
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}

// ==========================================
// STUDENT PROFILE MODAL
// ==========================================

function StudentProfileModal({
  managingStudent,
  courses,
  enrollCourseSelect,
  setEnrollCourseSelect,
  onEnroll,
  onUnenroll,
  onClose,
}) {
  const enrolledCourseIds =
    managingStudent.enrolledCourses || {};

  const getEnrollmentProgress = (
    enrollment,
    course
  ) => {
    if (typeof enrollment === "number") {
      return enrollment;
    }

    if (!course) {
      return enrollment?.completed
        ? 100
        : 0;
    }

    const totalLessons =
      course.modules?.reduce(
        (sum, mod) =>
          sum +
          (mod.lessons?.length || 0),
        0
      ) || 0;

    if (totalLessons === 0) {
      return enrollment?.completed
        ? 100
        : 0;
    }

    const lessonIds = new Set(
      course.modules?.flatMap(
        (mod) =>
          (mod.lessons || []).map(
            (lesson) =>
              lesson._id?.toString()
          )
      ) || []
    );

    const completedLessons =
      Array.isArray(
        enrollment?.completedLessons
      )
        ? [
            ...new Set(
              enrollment.completedLessons.map(
                (lessonId) =>
                  String(lessonId)
              )
            ),
          ].filter((lessonId) =>
            lessonIds.has(lessonId)
          )
        : [];

    return Math.round(
      (completedLessons.length /
        totalLessons) *
        100
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-[#10251c]/80 backdrop-blur-sm">

      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">

        {/* HEADER */}

        <div className="bg-[#143d2d] text-white px-6 py-5 flex items-center justify-between">

          <div>

            <span className="text-[10px] text-[#fbbf24] font-bold uppercase tracking-[0.18em]">
              Student Profile Manager
            </span>

            <h3 className="font-serif font-bold text-lg mt-1">
              {managingStudent.name}
            </h3>

          </div>

          <button
            onClick={onClose}
            className="
              text-[#b9c8bf]
              hover:text-white
              p-2
              hover:bg-white/10
              rounded-full
              transition
              cursor-pointer
            "
          >
            <FaTimes />
          </button>

        </div>

        {/* CONTENT */}

        <div className="p-5 md:p-6 space-y-6 overflow-y-auto">

          {/* COURSE PROGRESS */}

          <div>

            <h4 className="font-bold text-[#234d3a] text-sm border-b border-[#e7eee9] pb-3 mb-4">
              Course Progress Tracker
            </h4>

            {Object.keys(
              enrolledCourseIds
            ).length === 0 ? (
              <p className="text-sm text-[#8a9991] italic">
                Student is not currently enrolled
                in any courses.
              </p>
            ) : (
              <div className="space-y-3">

                {Object.entries(
                  enrolledCourseIds
                ).map(
                  ([
                    courseId,
                    enrollment,
                  ]) => {
                    const course =
                      courses.find(
                        (c) =>
                          c._id === courseId
                      );

                    const progress =
                      getEnrollmentProgress(
                        enrollment,
                        course
                      );

                    return (
                      <div
                        key={courseId}
                        className="
                          flex
                          flex-col
                          sm:flex-row
                          sm:items-center
                          justify-between
                          gap-3
                          text-xs
                          bg-[#f7faf8]
                          border
                          border-[#e0e9e3]
                          p-3
                          rounded-xl
                          animate-fade-in
                        "
                      >

                        <div className="w-full sm:w-2/3">

                          <span className="font-semibold text-[#234d3a] block line-clamp-1">
                            {course
                              ? course.title
                              : courseId}
                          </span>

                          <div className="flex items-center gap-2 mt-2">

                            <div className="flex-1 max-w-[150px] bg-[#dfe9e2] h-1.5 rounded-full overflow-hidden">

                              <div
                                className="bg-[#f59e0b] h-full rounded-full transition-all"
                                style={{
                                  width: `${progress}%`,
                                }}
                              />

                            </div>

                            <span className="text-[10px] text-[#718278]">
                              {progress}%
                            </span>

                          </div>

                        </div>

                        <button
                          onClick={() =>
                            onUnenroll(
                              courseId
                            )
                          }
                          className="
                            text-rose-500
                            hover:text-rose-700
                            font-semibold
                            cursor-pointer
                            self-end
                            sm:self-auto
                          "
                        >
                          Unenroll
                        </button>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>

          {/* MANUAL ENROLLMENT */}

          <div className="bg-[#f5f8f5] p-4 rounded-2xl border border-[#dfe9e2] space-y-3">

            <h4 className="font-bold text-[#234d3a] text-xs">
              Register in Course Manually
            </h4>

            <div className="flex flex-col sm:flex-row gap-2">

              <select
                value={
                  enrollCourseSelect
                }
                onChange={(e) =>
                  setEnrollCourseSelect(
                    e.target.value
                  )
                }
                className="
                  flex-1
                  p-2.5
                  text-xs
                  border
                  border-[#dce6df]
                  rounded-lg
                  bg-white
                  outline-none
                  focus:border-[#1f5d42]
                  text-[#234d3a]
                "
              >

                <option value="">
                  -- Choose Course --
                </option>

                {courses
                  .filter(
                    (c) =>
                      !Object.prototype.hasOwnProperty.call(
                        enrolledCourseIds,
                        c._id
                      )
                  )
                  .map((c) => (
                    <option
                      key={c._id}
                      value={c._id}
                    >
                      {c.title}
                    </option>
                  ))}

              </select>

              <button
                onClick={onEnroll}
                className="
                  bg-[#1f5d42]
                  hover:bg-[#174a34]
                  text-white
                  font-bold
                  px-5
                  py-2.5
                  rounded-lg
                  text-xs
                  transition
                  cursor-pointer
                "
              >
                Enroll
              </button>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="bg-[#f5f8f5] border-t border-[#e5ece7] p-4 flex justify-end">

          <button
            onClick={onClose}
            className="
              px-5
              py-2.5
              bg-[#143d2d]
              hover:bg-[#1f5d42]
              text-white
              rounded-xl
              text-xs
              font-semibold
              transition
              cursor-pointer
            "
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}
