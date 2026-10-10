import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getCourseById,
  getStudentById,
  enrollInCourse,
} from "../utils/lmsState";
import {
  FaGraduationCap,
  FaClock,
  FaBookOpen,
  FaAward,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

export default function ViewCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedModule, setExpandedModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      setCourse(null);
      setIsEnrolled(false);
      return;
    }

    let isActive = true;

    async function loadData() {
      setLoading(true);
      setCourse(null);
      setIsEnrolled(false);

      try {
        const foundCourse = await getCourseById(courseId);

        if (!isActive) return;

        if (!foundCourse) {
          setCourse(null);
          return;
        }

        setCourse(foundCourse);
      } catch (err) {
        console.error("Error loading course details:", err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isActive = false;
    };
  }, [courseId]);

  useEffect(() => {
    let isActive = true;

    async function loadEnrollmentState() {
      if (!courseId || !course) return;

      const token = localStorage.getItem("token");

      if (!token) {
        if (isActive) {
          setIsEnrolled(false);
        }
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const student = await getStudentById(decoded.id);

        if (!isActive) return;

        const enrolled = student?.enrollments?.some(
          (enrollment) =>
            String(enrollment.courseId) === String(courseId)
        );

        setIsEnrolled(Boolean(enrolled));
      } catch (err) {
        console.error("Error loading enrollment state:", err);

        if (isActive) {
          setIsEnrolled(false);
        }
      }
    }

    loadEnrollmentState();

    return () => {
      isActive = false;
    };
  }, [courseId, course]);

  /*
   * Handle return from HDFC Treasury.
   *
   * Expected URL:
   * /lms/course/:courseId?reference_id=IYF-LMS-...
   *
   * Or, if the deployed callback uses a signed token:
   * /lms/course/:courseId?payment_token=...
   */
  useEffect(() => {
    const search = new URLSearchParams(location.search);

    const referenceId = search.get("reference_id");
    const paymentToken = search.get("payment_token");
    const paymentError = search.get("payment_error");

    if (!referenceId && !paymentToken && !paymentError) {
      return;
    }

    if (!courseId) {
      return;
    }

    if (paymentError) {
      setCheckoutLoading(false);

      alert(
        "Payment could not be completed. Please try again."
      );

      navigate(`/lms/course/${courseId}`, {
        replace: true,
      });

      return;
    }

    const processReturnedPayment = async () => {
      try {
        setCheckoutLoading(true);

        let payment;

        /*
         * Use the signed token when the deployed callback provides one.
         * Otherwise use the LMS payment status endpoint with reference_id.
         */
        if (paymentToken) {
          const response = await fetch(
            `/api/payment/status?token=${encodeURIComponent(
              paymentToken
            )}`
          );

          if (!response.ok) {
            throw new Error(
              "Unable to verify the payment."
            );
          }

          payment = await response.json();
        } else {
          const response = await fetch(
            `/api/payment/status/${encodeURIComponent(
              referenceId
            )}`
          );

          if (!response.ok) {
            throw new Error(
              "Unable to verify the payment."
            );
          }

          payment = await response.json();
        }

        console.log("LMS payment response:", payment);

        const paymentCourseId = payment?.course_id
          ? String(payment.course_id)
          : "";

        const isCorrectCourse =
          !paymentCourseId ||
          paymentCourseId === String(courseId);

        if (
          payment?.status === "success" &&
          isCorrectCourse
        ) {
          await enrollInCourse(courseId);

          /*
           * Remove payment parameters before navigating
           * so refreshing the page does not process the
           * same payment again.
           */
          navigate(`/lms/course/${courseId}`, {
            replace: true,
          });

          // navigate(`/player/${courseId}`, {
          //   replace: true,
          // });

          return;
        }

        alert(
          "Payment was not completed successfully. Please try again."
        );

        navigate(`/lms/course/${courseId}`, {
          replace: true,
        });
      } catch (err) {
        console.error(
          "LMS payment verification failed:",
          err
        );

        alert(
          err.message ||
            "Payment status could not be verified. Please contact support."
        );

        navigate(`/lms/course/${courseId}`, {
          replace: true,
        });
      } finally {
        setCheckoutLoading(false);
      }
    };

    processReturnedPayment();
  }, [courseId, location.search, navigate]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Loading course details...
        </h2>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Course Not Found
        </h2>

        <p className="text-gray-600 mt-2">
          The course you are looking for does not exist or has
          been removed.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  let totalLessons = 0;

  course.modules?.forEach((mod) => {
    totalLessons += mod.lessons?.length || 0;
  });

  const parseCourseAmount = (price) => {
    if (price == null) return 0;

    const normalized = String(price)
      .toLowerCase()
      .trim();

    if (!normalized || normalized === "free") {
      return 0;
    }

    const numeric = normalized.replace(/[^0-9.]/g, "");
    const amount = Number.parseFloat(numeric);

    if (Number.isNaN(amount) || amount <= 0) {
      return 0;
    }

    return Math.round(amount * 100);
  };

  const handleEnrollment = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/lms/login");
        return;
      }

      const amount = parseCourseAmount(course.price);

      /*
       * Free course.
       */
      if (amount === 0) {
        await enrollInCourse(course._id);
        navigate(`/player/${course._id}`);
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const student = await getStudentById(userId);

      const nameParts = String(student?.name || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      const firstName =
        student?.first_name ||
        nameParts.shift() ||
        "Student";

      const lastName =
        student?.last_name ||
        nameParts.join(" ") ||
        firstName;

      const paymentPayload = {
        payment_type: "lms",

        amount: Number((amount / 100).toFixed(2)),

        email: student?.email || "",

        mobile:
          student?.mobile ||
          student?.phone ||
          "0000000000",

        first_name: firstName,
        last_name: lastName,

        address_1:
          student?.address_1 ||
          "Online purchase",

        address_2: student?.address_2 || "",

        post_office:
          student?.post_office || "",

        pin_code:
          student?.pin_code ||
          "000000",

        district:
          student?.district ||
          "Online",

        city:
          student?.city ||
          "Online",

        state:
          student?.state ||
          "India",

        country:
          student?.country ||
          "India",

        /*
         * IMPORTANT:
         * This identifies the payment as an LMS payment.
         */
        course_id: String(course._id),
        user_id: String(student._id),
        transaction_purpose:
          `LMS Course Enrollment (course_id:${course._id})`,
      };

      setCheckoutLoading(true);

      /*
       * IMPORTANT:
       * Call the LMS Treasury endpoint directly.
       *
       * This prevents the course payment from accidentally
       * going through the normal donation/payment endpoint.
       */

      alert("Checkout not implemented.")
      return;
      const response = await fetch(
        // 
        // {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(paymentPayload),
        // }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to start Treasury checkout."
        );
      }

      if (!data?.payment_url) {
        throw new Error(
          "Treasury checkout URL was not returned."
        );
      }

      /*
       * Send the user to HDFC Treasury.
       */
      window.location.assign(data.payment_url);
    } catch (err) {
      console.error(
        "Error starting course payment:",
        err
      );

      alert(
        err.message ||
          "Unable to start checkout."
      );

      setCheckoutLoading(false);
    }
  };

  const toggleModule = (modId) => {
    if (expandedModule === modId) {
      setExpandedModule(null);
    } else {
      setExpandedModule(modId);
    }
  };

  return (
    <div className="bg-[#faf8f3] min-h-screen pt-10 pb-16">
  <div className="relative bg-gradient-to-r from-[#143d2d] to-[#1f5d42] text-white py-16 px-4 md:px-8 overflow-hidden">
    <div className="absolute top-0 right-0 w-96 h-96 bg-[#f59e0b]/10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f59e0b]/10 rounded-full blur-3xl"></div>

    <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-3 gap-8 items-center">
      <div className="md:col-span-2">
        <span className="bg-[#f59e0b]/15 text-[#fbbf24] text-sm font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-[#f59e0b]/30">
          {course.category} Course
        </span>

        <h1 className="text-3xl md:text-5xl font-bold font-serif mt-4 text-white leading-tight">
          {course.title}
        </h1>

        <p className="text-lg text-white/75 mt-4 leading-relaxed max-w-3xl">
          {course.description}
        </p>

        <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-white/75">
          <span className="flex items-center gap-2">
            <FaGraduationCap className="text-[#f59e0b] text-lg" />
            <span>{course.level} Level</span>
          </span>

          <span className="flex items-center gap-2">
            <FaClock className="text-[#f59e0b] text-lg" />
            <span>{course.duration} Duration</span>
          </span>

          <span className="flex items-center gap-2">
            <FaBookOpen className="text-[#f59e0b] text-lg" />
            <span>{totalLessons} Lessons</span>
          </span>
        </div>
      </div>
    </div>
  </div>

  <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 grid md:grid-cols-3 gap-8">
    <div className="md:col-span-2 space-y-8">

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#e7eee9] shadow-sm">
        <h2 className="text-2xl font-bold text-[#1f5d42] font-serif mb-4 pb-2 border-b border-[#e7eee9]">
          About this Course
        </h2>

        <p className="text-[#587064] leading-relaxed whitespace-pre-line text-justify">
          {course.longDescription ||
            course.description}
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#e7eee9] shadow-sm">
        <h2 className="text-2xl font-bold text-[#1f5d42] font-serif mb-6 pb-2 border-b border-[#e7eee9]">
          Course Syllabus
        </h2>

        {course.modules &&
        course.modules.length > 0 ? (
          <div className="space-y-4">
            {course.modules.map((mod, idx) => {
              const isExpanded =
                expandedModule === mod._id ||
                (expandedModule === null &&
                  idx === 0);

              return (
                <div
                  key={mod._id}
                  className="border border-[#e7eee9] rounded-xl overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() =>
                      toggleModule(mod._id)
                    }
                    className="w-full flex items-center justify-between p-4 bg-[#f3f7f4] hover:bg-[#eaf2ed] transition text-left"
                  >
                    <div>
                      <h3 className="font-semibold text-[#234d3a] text-base md:text-lg">
                        {mod.title}
                      </h3>

                      <span className="text-xs text-[#718278] mt-1 block">
                        {mod.lessons?.length || 0}{" "}
                        Lessons
                      </span>
                    </div>

                    {isExpanded ? (
                      <FaChevronUp className="text-[#587064]" />
                    ) : (
                      <FaChevronDown className="text-[#587064]" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="divide-y divide-[#e7eee9] bg-white">
                      {mod.lessons &&
                        mod.lessons.map(
                          (lesson) => (
                            <div
                              key={lesson._id}
                              className="p-4 flex items-center justify-between hover:bg-[#f8faf8] transition"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>

                                <span className="text-sm font-medium text-[#3f5f50]">
                                  {lesson.title}
                                </span>
                              </div>

                              <span className="text-xs text-[#718278] bg-[#f3f7f4] px-2 py-0.5 rounded-full">
                                {lesson.duration}
                              </span>
                            </div>
                          )
                        )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-[#718278]">
            No modules listed for this course yet.
          </p>
        )}
      </div>
    </div>

    <div className="md:col-span-1">
      <div className="bg-white rounded-2xl border border-[#e7eee9] shadow-lg overflow-hidden sticky top-24">

        <div className="relative w-full bg-[#143d2d] flex items-center justify-center overflow-hidden">
          <img
            src={course.imgUrl}
            alt={course.title}
            className="w-full h-full object-cover opacity-90"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#143d2d]/70 to-transparent"></div>
        </div>

        <div className="p-6">
          <div className="flex items-baseline justify-between mb-6">
            <span className="text-sm text-[#718278] font-semibold uppercase tracking-wider">
              Price
            </span>

            <span className="text-3xl font-extrabold text-[#1f5d42]">
              Rs. {course.price}
            </span>
          </div>

          {isEnrolled ? (
            <button
              onClick={() =>
                navigate(
                  `/lms/player/${course._id}`
                )
              }
              className="w-full bg-[#1f5d42] hover:bg-[#174a34] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaGraduationCap className="text-xl" />
              Resume Learning
            </button>
          ) : (
            <button
              onClick={handleEnrollment}
              disabled={checkoutLoading}
              className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {checkoutLoading
                ? "Opening Checkout..."
                : "Enroll Now"}
            </button>
          )}

          <div className="mt-8 space-y-4 border-t border-[#e7eee9] pt-6">
            <h4 className="font-semibold text-[#234d3a] text-sm uppercase tracking-wider">
              This Course Includes:
            </h4>

            <div className="flex items-start gap-3 text-sm text-[#587064]">
              <FaClock className="text-[#f59e0b] mt-0.5 shrink-0" />

              <span>
                {course.duration} of lessons video
                instruction
              </span>
            </div>

            <div className="flex items-start gap-3 text-sm text-[#587064]">
              <FaBookOpen className="text-[#f59e0b] mt-0.5 shrink-0" />

              <span>
                {totalLessons} lessons with
                downloadable resources
              </span>
            </div>

            <div className="flex items-start gap-3 text-sm text-[#587064]">
              <FaAward className="text-[#f59e0b] mt-0.5 shrink-0" />

              <span>
                Official completion certificate
                from IYF Mayapur
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
