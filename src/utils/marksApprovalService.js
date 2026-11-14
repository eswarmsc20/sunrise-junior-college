import initialStudents from '../data/studentsData.json';

const STORAGE_KEYS = {
  STUDENTS: 'sunrise_enrolled_students',
  MARKS_APPROVALS: 'sunrise_marks_approval_requests'
};

/**
 * Get all enrolled students from localStorage or fallback to initialStudentsData
 */
export function getEnrolledStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading students from localStorage:', e);
  }
  return initialStudents;
}

/**
 * Save updated students list to localStorage and trigger cross-window storage event
 */
export function saveEnrolledStudents(studentsList) {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(studentsList));
    window.dispatchEvent(new Event('sunrise_students_updated'));
  } catch (e) {
    console.error('Error saving students to localStorage:', e);
  }
}

/**
 * Get list of marks approval requests
 */
export function getMarksApprovalRequests() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.MARKS_APPROVALS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading marks approvals from localStorage:', e);
  }
  return [];
}

/**
 * Save marks approval requests
 */
export function saveMarksApprovalRequests(requestsList) {
  try {
    localStorage.setItem(STORAGE_KEYS.MARKS_APPROVALS, JSON.stringify(requestsList));
    window.dispatchEvent(new Event('sunrise_marks_approvals_updated'));
  } catch (e) {
    console.error('Error saving marks approvals to localStorage:', e);
  }
}

/**
 * Submit a new marks approval request by Teacher
 */
export function submitMarksApprovalRequest({
  studentId,
  studentName,
  hallTicket,
  group,
  examName,
  marks,
  previousMarks,
  teacherName,
  teacherId,
  remarks
}) {
  const allRequests = getMarksApprovalRequests();
  
  const newRequest = {
    id: `REQ-MRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    studentId,
    studentName,
    hallTicket,
    group,
    examName,
    marks,
    previousMarks: previousMarks || {},
    teacherName: teacherName || 'Staff Faculty',
    teacherId: teacherId || 'FAC-001',
    teacherRemarks: remarks || '',
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    submittedAt: new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    adminRemarks: '',
    actionTakenAt: null,
    actionBy: null
  };

  const updatedRequests = [newRequest, ...allRequests];
  saveMarksApprovalRequests(updatedRequests);
  return newRequest;
}

/**
 * Admin approves marks request -> updates student record in database
 */
export function approveMarksRequest(requestId, adminRemarks = '', adminName = 'Principal / Sri Sudarshan Rao') {
  const allRequests = getMarksApprovalRequests();
  const reqIndex = allRequests.findIndex(r => r.id === requestId);
  if (reqIndex === -1) return { success: false, error: 'Request not found' };

  const targetReq = allRequests[reqIndex];
  const now = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // 1. Update the request status
  const updatedReq = {
    ...targetReq,
    status: 'approved',
    adminRemarks: adminRemarks || 'Approved and published to official marks memo',
    actionTakenAt: now,
    actionBy: adminName
  };
  allRequests[reqIndex] = updatedReq;
  saveMarksApprovalRequests(allRequests);

  // 2. Update the student in enrolled students list
  const allStudents = getEnrolledStudents();
  const studentIndex = allStudents.findIndex(s => s.id === targetReq.studentId || s.hallTicket === targetReq.hallTicket);
  
  let updatedStudent = null;
  if (studentIndex !== -1) {
    const student = allStudents[studentIndex];
    const examReports = student.examReports ? { ...student.examReports } : {};
    
    // Update the specific exam marks
    examReports[targetReq.examName] = {
      ...(examReports[targetReq.examName] || {}),
      ...targetReq.marks
    };

    // If this is a major exam (Half-Yearly or Quarterly), also update primary marks
    const updatedPrimaryMarks = {
      ...(student.marks || {}),
      ...targetReq.marks
    };

    updatedStudent = {
      ...student,
      marks: updatedPrimaryMarks,
      examReports: examReports,
      lastMarksUpdatedBy: targetReq.teacherName,
      lastMarksApprovedBy: adminName,
      lastMarksApprovedAt: now
    };

    allStudents[studentIndex] = updatedStudent;
    saveEnrolledStudents(allStudents);
  }

  return { success: true, request: updatedReq, student: updatedStudent };
}

/**
 * Admin rejects marks request with reason
 */
export function rejectMarksRequest(requestId, reason = 'Marks verification required', adminName = 'Principal / Admin') {
  const allRequests = getMarksApprovalRequests();
  const reqIndex = allRequests.findIndex(r => r.id === requestId);
  if (reqIndex === -1) return { success: false, error: 'Request not found' };

  const targetReq = allRequests[reqIndex];
  const now = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const updatedReq = {
    ...targetReq,
    status: 'rejected',
    adminRemarks: reason,
    actionTakenAt: now,
    actionBy: adminName
  };
  allRequests[reqIndex] = updatedReq;
  saveMarksApprovalRequests(allRequests);

  return { success: true, request: updatedReq };
}
