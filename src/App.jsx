import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import Navbar from './assets/components/Navbar.jsx'
import Footer from './assets/components/Footer.jsx'
import PageTransition from './assets/components/PageTransition.jsx'

const Home = lazy(() => import('./pages/Home/Home.jsx'))

const AboutUs = lazy(() => import('./pages/AboutUs/About.jsx'))
const StudentCourses = lazy(() => import('./pages/StudentCourses.jsx'))
const Player = lazy(() => import('./pages/Player.jsx'))
const ViewCourse = lazy(() => import('./pages/ViewCourse.jsx'))
const PageNotFound = lazy(() => import('./pages/PageNotFound.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Gallery = lazy(() => import('./pages/Gallery.jsx'))
const EventDetails = lazy(() => import('./pages/EventDetails.jsx'))
const Events = lazy(() => import('./pages/Events.jsx'))

const Courses = lazy(() => import('./pages/Courses.jsx'))
const LmsApp = lazy(() => import('./lms/LmsApp.jsx'))
const Donation = lazy(() => import('./pages/Donation.jsx'))
const JoinUs = lazy(() => import('./pages/JoinUs/JoinUs.jsx'))
const StoreThankYou = lazy(() => import('./pages/ThankStore.jsx'))
const TransactionFailed = lazy(() => import('./pages/TransactionFailed.jsx'))
const LegalPage = lazy(() => import('./pages/Legal/LegalPage.jsx'))
const Sadhna = lazy(() => import('./pages/sadhna/Sadhna.jsx'))
const Login = lazy(() => import('./pages/sadhna/Auth.jsx'))
const AdminRegister = lazy(() => import('./pages/sadhna/AdminRegister.jsx'))
const AdminDashboard = lazy(() => import('./pages/sadhna/AdminDashboard.jsx'))

const FreeClass = lazy(() => import('./pages/Free.jsx'))

function PageLoader() {
  return <div className="flex min-h-[40vh] items-center justify-center text-sm text-stone-500">Loading...</div>
}

function App() {
  const location = useLocation()
  const isLmsRoute = location.pathname.startsWith('/lms')

  return (
    <>
      {!isLmsRoute && <Navbar />}

      <main className={isLmsRoute ? '' : 'pt-16'}>
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
             
              <Route path="/aboutUs" element={<PageTransition><AboutUs /></PageTransition>} />
              <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
              <Route path="/events/:eventSlug" element={<PageTransition><EventDetails /></PageTransition>} />
              
              
              <Route path="/donation" element={<PageTransition><Donation /></PageTransition>} />
              <Route path="/courses" element={<PageTransition><Courses /></PageTransition>} />
              <Route path="/lms/*" element={<LmsApp />} />
              <Route path="/youth-courses" element={<PageTransition><StudentCourses /></PageTransition>} />
              <Route path="/course/:courseId" element={<PageTransition><ViewCourse /></PageTransition>} />
              <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
              <Route path="/player" element={<PageTransition><Player /></PageTransition>} />
              <Route path="/player/:courseId" element={<PageTransition><Player /></PageTransition>} />
              <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
              <Route path="/join" element={<PageTransition><JoinUs /></PageTransition>} />
              <Route path="*" element={<PageTransition><PageNotFound /></PageTransition>} />
              <Route path="/sadhna" element={<PageTransition><Sadhna /></PageTransition>} />
              <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/admin/dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />

              <Route
                path="/store/thank-you"
                element={<StoreThankYou />} />

              <Route path="/admin/register" element={<PageTransition><AdminRegister /></PageTransition>} />
              <Route path="/free-class" element={<PageTransition><FreeClass /></PageTransition>} />
              <Route path="/payment_error" element={<PageTransition><TransactionFailed /></PageTransition>} />
              <Route path="/legal/:policy" element={<PageTransition><LegalPage /></PageTransition>} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>

      {!isLmsRoute && <Footer />}
    </>
  );
}

export default App
