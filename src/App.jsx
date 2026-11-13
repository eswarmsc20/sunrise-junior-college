import React, { useState, useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Courses from './components/Courses';
import VideoPlayer from './components/VideoPlayer';
import Facilities from './components/Facilities';
import Gallery from './components/Gallery';
import AdmissionForm from './components/AdmissionForm';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import LoginPage from './components/LoginPage';
import MobileBottomNav from './components/MobileBottomNav';
import StudentPortal from './components/StudentPortal';
import TeacherPortal from './components/TeacherPortal';
import AdminPortal from './components/AdminPortal';
import FeeReceiptModal from './components/FeeReceiptModal';
import ExamMarksModal from './components/ExamMarksModal';
import EnrollmentModal from './components/EnrollmentModal';
import PaymentModal from './components/PaymentModal';
import CampaignManagerModal from './components/CampaignManagerModal';
import FaceBiometricModal from './components/FaceBiometricModal';
import ExamPortalModal from './components/ExamPortalModal';
import NotificationToast from './components/NotificationToast';

export default function App() {
  // App opens directly on the dedicated Gradient Navy Blue Login Page as requested
  const [viewMode, setViewMode] = useState('login'); // 'login' | 'home' | 'portal'
  
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [biometricModalOpen, setBiometricModalOpen] = useState(false);
  const [examPortalModalOpen, setExamPortalModalOpen] = useState(false);

  const [currentPortal, setCurrentPortal] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('M.P.C');

  // Modals for Fee Receipt and Exam Marks
  const [activeReceiptStudent, setActiveReceiptStudent] = useState(null);
  const [activeMarksStudent, setActiveMarksStudent] = useState(null);

  // Instant SMS / WhatsApp Notification Toast
  const [notificationAlert, setNotificationAlert] = useState(null);

  // Native Android Hardware Back Button Handler
  useEffect(() => {
    let handlerPromise;
    try {
      handlerPromise = CapApp.addListener('backButton', () => {
        if (examPortalModalOpen) {
          setExamPortalModalOpen(false);
        } else if (biometricModalOpen) {
          setBiometricModalOpen(false);
        } else if (paymentModalOpen) {
          setPaymentModalOpen(false);
        } else if (enrollmentModalOpen) {
          setEnrollmentModalOpen(false);
        } else if (campaignModalOpen) {
          setCampaignModalOpen(false);
        } else if (loginModalOpen) {
          setLoginModalOpen(false);
        } else if (activeReceiptStudent) {
          setActiveReceiptStudent(null);
        } else if (activeMarksStudent) {
          setActiveMarksStudent(null);
        } else if (viewMode === 'portal') {
          handleLogout();
        } else if (viewMode === 'home') {
          setViewMode('login');
        }
      });
    } catch (e) {
      // Running outside Capacitor web environment
    }

    return () => {
      if (handlerPromise && typeof handlerPromise.then === 'function') {
        handlerPromise.then(h => h.remove()).catch(() => {});
      }
    };
  }, [
    examPortalModalOpen, biometricModalOpen, paymentModalOpen, 
    enrollmentModalOpen, campaignModalOpen, loginModalOpen,
    activeReceiptStudent, activeMarksStudent, viewMode
  ]);

  const handleLoginSuccess = (portalData) => {
    setCurrentPortal(portalData);
    setLoginModalOpen(false);
    setViewMode('portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentPortal(null);
    setViewMode('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerAlert = (alertData) => {
    setNotificationAlert(alertData);
  };

  const handleEnrollStudent = (newStudent) => {
    const existing = JSON.parse(localStorage.getItem('sunrise_enrolled_students') || '[]');
    const updated = [newStudent, ...existing];
    localStorage.setItem('sunrise_enrolled_students', JSON.stringify(updated));
  };

  const handleEnrollTeacher = (newTeacher) => {
    const existing = JSON.parse(localStorage.getItem('sunrise_enrolled_teachers') || '[]');
    const updated = [newTeacher, ...existing];
    localStorage.setItem('sunrise_enrolled_teachers', JSON.stringify(updated));
  };

  const handlePaymentSuccess = (receiptData, openReceipt = false) => {
    triggerAlert({
      title: "Fee Payment Received (₹" + receiptData.amount.toLocaleString('en-IN') + ")",
      message: `Transaction verified for ${receiptData.student.name}. Instant SMS & WhatsApp receipt dispatched to ${receiptData.student.phone}.`
    });

    if (openReceipt) {
      setActiveReceiptStudent(receiptData.student);
    }
  };

  const handleAttendanceRecorded = (record) => {
    triggerAlert({
      title: "Biometric Attendance Verified (50m Geofence)",
      message: `Face match verified for ${record.studentName} at ${record.distanceMeters}m from campus. Alert dispatched to ${record.parentPhone}.`
    });
  };

  // If in 'login' mode and not authenticated, show the full-screen Gradient Navy Blue Login Page
  if (viewMode === 'login' && !currentPortal) {
    return (
      <div className="min-h-screen bg-[#030712] text-white">
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onContinueToHome={() => setViewMode('home')}
          onOpenExamPortal={() => {
            setViewMode('home');
            setExamPortalModalOpen(true);
          }}
          onOpenBiometric={() => {
            setViewMode('home');
            setBiometricModalOpen(true);
          }}
          onOpenPayment={() => {
            setViewMode('home');
            setPaymentModalOpen(true);
          }}
        />

        {/* Global Modals accessible if triggered */}
        <ExamPortalModal
          isOpen={examPortalModalOpen}
          onClose={() => setExamPortalModalOpen(false)}
          onOpenMarksMemo={(studentData) => setActiveMarksStudent(studentData)}
        />
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
        <FaceBiometricModal
          isOpen={biometricModalOpen}
          onClose={() => setBiometricModalOpen(false)}
          onAttendanceRecorded={handleAttendanceRecorded}
          onSendAlert={triggerAlert}
        />
        <NotificationToast
          alert={notificationAlert}
          onClose={() => setNotificationAlert(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 pb-16 md:pb-0 overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar
        onOpenLogin={() => setViewMode('login')}
        onOpenEnrollment={() => setEnrollmentModalOpen(true)}
        onOpenPayment={() => setPaymentModalOpen(true)}
        onOpenCampaign={() => setCampaignModalOpen(true)}
        onOpenBiometric={() => setBiometricModalOpen(true)}
        onOpenExamPortal={() => setExamPortalModalOpen(true)}
        currentPortal={currentPortal}
        onLogout={handleLogout}
      />

      {/* Main View: Conditional Portal or Public Website */}
      {currentPortal ? (
        <main className="flex-1">
          {currentPortal.role === 'student' && (
            <StudentPortal
              student={currentPortal.data}
              onLogout={handleLogout}
              onOpenReceipt={(s) => setActiveReceiptStudent(s)}
              onOpenMarks={(s) => setActiveMarksStudent(s)}
              onSendAlert={triggerAlert}
              onOpenPayment={() => setPaymentModalOpen(true)}
              onOpenExamPortal={() => setExamPortalModalOpen(true)}
              onOpenBiometric={() => setBiometricModalOpen(true)}
            />
          )}
          {currentPortal.role === 'teacher' && (
            <TeacherPortal
              teacher={currentPortal.data}
              onLogout={handleLogout}
              onOpenReceipt={(s) => setActiveReceiptStudent(s)}
              onOpenMarks={(s) => setActiveMarksStudent(s)}
              onSendAlert={triggerAlert}
              onOpenBiometric={() => setBiometricModalOpen(true)}
            />
          )}
          {currentPortal.role === 'admin' && (
            <AdminPortal
              admin={currentPortal.data}
              onLogout={handleLogout}
              onOpenReceipt={(s) => setActiveReceiptStudent(s)}
              onOpenMarks={(s) => setActiveMarksStudent(s)}
              onSendAlert={triggerAlert}
              onOpenEnrollment={() => setEnrollmentModalOpen(true)}
              onOpenPayment={() => setPaymentModalOpen(true)}
              onOpenCampaign={() => setCampaignModalOpen(true)}
              onOpenBiometric={() => setBiometricModalOpen(true)}
              onOpenExamPortal={() => setExamPortalModalOpen(true)}
            />
          )}
        </main>
      ) : (
        <main className="flex-1">
          {/* Hero Section */}
          <Hero
            onOpenLogin={() => setViewMode('login')}
            onPlayVideo={() => {
              const el = document.getElementById('video-tour');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenPayment={() => setPaymentModalOpen(true)}
            onOpenExamPortal={() => setExamPortalModalOpen(true)}
            onOpenBiometric={() => setBiometricModalOpen(true)}
          />

          {/* About Section */}
          <About />

          {/* Academic Courses (MPC, BiPC, CEC, MEC, HEC) */}
          <Courses onSelectCourse={(c) => setSelectedCourse(c)} />

          {/* Video Streaming Showcase */}
          <VideoPlayer />

          {/* Campus & Hostel Facilities */}
          <Facilities />

          {/* Image Gallery */}
          <Gallery />

          {/* Online Admission Application Form */}
          <AdmissionForm initialCourse={selectedCourse} />

          {/* Contact, Location Map & Interactive Enquiry Form */}
          <Contact
            onOpenPayment={() => setPaymentModalOpen(true)}
            onOpenCampaign={() => setCampaignModalOpen(true)}
            onOpenExamPortal={() => setExamPortalModalOpen(true)}
          />
        </main>
      )}

      {/* Footer */}
      <Footer onOpenLogin={() => setViewMode('login')} />

      {/* Native Mobile Bottom Navigation Bar (Visible on mobile/tablets/APK) */}
      <MobileBottomNav
        currentPortal={currentPortal}
        onGoHome={() => {
          if (currentPortal) setCurrentPortal(null);
          setViewMode('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenExamPortal={() => setExamPortalModalOpen(true)}
        onOpenBiometric={() => setBiometricModalOpen(true)}
        onOpenPayment={() => setPaymentModalOpen(true)}
        onOpenLogin={() => setViewMode('login')}
        onLogout={handleLogout}
      />

      {/* Role-Based Login Modal (Accessible from anywhere) */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenEnrollment={() => setEnrollmentModalOpen(true)}
      />

      {/* Universal Enrollment Modal (Student & Teacher Registration) */}
      <EnrollmentModal
        isOpen={enrollmentModalOpen}
        onClose={() => setEnrollmentModalOpen(false)}
        onEnrollStudent={handleEnrollStudent}
        onEnrollTeacher={handleEnrollTeacher}
        onSendAlert={triggerAlert}
      />

      {/* Online Fee Payment Modal (UPI QR Code & Gateway) */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* 2-Day Drip Marketing & Indian Calendar Festival Broadcast Modal */}
      <CampaignManagerModal
        isOpen={campaignModalOpen}
        onClose={() => setCampaignModalOpen(false)}
        onSendNotification={triggerAlert}
      />

      {/* 50-Meter Geofenced Biometric Face Recognition Attendance Modal */}
      <FaceBiometricModal
        isOpen={biometricModalOpen}
        onClose={() => setBiometricModalOpen(false)}
        onAttendanceRecorded={handleAttendanceRecorded}
        onSendAlert={triggerAlert}
      />

      {/* Comprehensive Examination Portal Modal (Registration -> Hall Ticket -> CBT Exam -> Marks Memo) */}
      <ExamPortalModal
        isOpen={examPortalModalOpen}
        onClose={() => setExamPortalModalOpen(false)}
        onOpenMarksMemo={(studentData) => setActiveMarksStudent(studentData)}
      />

      {/* Universal Fee Receipt Modal (Accessible by Student, Teacher, Admin) */}
      <FeeReceiptModal
        isOpen={!!activeReceiptStudent}
        onClose={() => setActiveReceiptStudent(null)}
        student={activeReceiptStudent}
        onSendAlert={triggerAlert}
      />

      {/* Universal Exam Marks Modal with WhatsApp / SMS Dispatch */}
      <ExamMarksModal
        isOpen={!!activeMarksStudent}
        onClose={() => setActiveMarksStudent(null)}
        student={activeMarksStudent}
        onSendAlert={triggerAlert}
      />

      {/* Live SMS & WhatsApp Toast Notification */}
      <NotificationToast
        alert={notificationAlert}
        onClose={() => setNotificationAlert(null)}
      />
    </div>
  );
}
