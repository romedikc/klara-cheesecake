import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Cakes from './pages/Cakes'
import Product from './pages/Product'
import Courses from './pages/Courses'
import Course from './pages/Course'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Contacts from './pages/Contacts'
import About from './pages/About'
import ThankYou from './pages/ThankYou'
import MyCourses from './pages/MyCourses'
import LearnCourse from './pages/LearnCourse'
import Lesson from './pages/Lesson'
import PaymentSuccess from './pages/PaymentSuccess'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cakes" element={<Cakes />} />
        <Route path="/cakes/:id" element={<Product />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<Course />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/about" element={<About />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/my-courses/:id" element={<LearnCourse />} />
        <Route path="/my-courses/:id/lessons/:lessonId" element={<Lesson />} />
      </Routes>
    </>
  )
}
