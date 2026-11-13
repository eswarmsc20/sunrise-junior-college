// Sunrise Junior College - Master Question Bank Repository
// Configured by Lecturers and Admin for MPC, BiPC, CEC, MEC, and HEC
export const DEFAULT_EXAM_QUESTIONS = [
  // MPC Questions
  {
    id: "Q-MPC-01",
    stream: "MPC",
    subject: "Mathematics",
    type: "mcq", // 'mcq' or 'descriptive'
    question: "If matrix A is symmetric, which of the following algebraic properties holds true?",
    options: ["A = -A^T", "A = A^T", "A^2 = I", "det(A) = 0"],
    correctAnswer: 1,
    marks: 10,
    author: "Smt. P. Sujatha (Lecturer in Maths)",
    date: "12-11-2026",
    topic: "Matrices & Determinants"
  },
  {
    id: "Q-MPC-02",
    stream: "MPC",
    subject: "Physics",
    type: "mcq",
    question: "According to Newton's Second Law, the rate of change of linear momentum is directly proportional to:",
    options: ["Applied External Force", "Velocity of the body", "Displacement vector", "Kinetic Energy"],
    correctAnswer: 0,
    marks: 10,
    author: "Sri K. Ramanjaneyulu (HOD Physics)",
    date: "12-11-2026",
    topic: "Laws of Motion"
  },
  {
    id: "Q-MPC-03",
    stream: "MPC",
    subject: "Chemistry",
    type: "mcq",
    question: "Which quantum number specifies the three-dimensional orientation of an atomic orbital?",
    options: ["Principal Quantum Number (n)", "Azimuthal Quantum Number (l)", "Magnetic Quantum Number (m)", "Spin Quantum Number (s)"],
    correctAnswer: 2,
    marks: 10,
    author: "Sri B. V. Satyanarayana (Lecturer in Chemistry)",
    date: "12-11-2026",
    topic: "Atomic Structure"
  },
  {
    id: "Q-MPC-04",
    stream: "MPC",
    subject: "Mathematics",
    type: "descriptive",
    question: "State and prove Rolle's Theorem for a real-valued continuous function on a closed interval [a, b]. Explain its geometric significance.",
    options: [],
    correctAnswer: null,
    marks: 20,
    author: "Smt. P. Sujatha (Lecturer in Maths)",
    date: "12-11-2026",
    topic: "Calculus & Derivatives"
  },
  {
    id: "Q-MPC-05",
    stream: "MPC",
    subject: "Physics",
    type: "descriptive",
    question: "Derive an expression for the work done in compressing an ideal gas adiabatically from volume V1 to V2.",
    options: [],
    correctAnswer: null,
    marks: 20,
    author: "Sri K. Ramanjaneyulu (HOD Physics)",
    date: "12-11-2026",
    topic: "Thermodynamics"
  },

  // BiPC Questions
  {
    id: "Q-BIPC-01",
    stream: "BiPC",
    subject: "Botany",
    type: "mcq",
    question: "Which cellular organelle is responsible for ATP synthesis through cellular respiration in plant cells?",
    options: ["Chloroplast", "Mitochondria", "Ribosome", "Golgi apparatus"],
    correctAnswer: 1,
    marks: 10,
    author: "Dr. M. Kameswara Rao (Dean Medical Streams)",
    date: "12-11-2026",
    topic: "Cell Biology"
  },
  {
    id: "Q-BIPC-02",
    stream: "BiPC",
    subject: "Zoology",
    type: "mcq",
    question: "The human heart is encapsulated by a double-layered protective serous membrane known as:",
    options: ["Pleura", "Pericardium", "Peritoneum", "Meninges"],
    correctAnswer: 1,
    marks: 10,
    author: "Dr. M. Kameswara Rao (Dean Medical Streams)",
    date: "12-11-2026",
    topic: "Human Circulatory System"
  },
  {
    id: "Q-BIPC-03",
    stream: "BiPC",
    subject: "Chemistry",
    type: "mcq",
    question: "The pH of pure distilled water at 25 degrees Celsius in standard conditions equals:",
    options: ["0", "7", "14", "1"],
    correctAnswer: 1,
    marks: 10,
    author: "Sri B. V. Satyanarayana (Lecturer in Chemistry)",
    date: "12-11-2026",
    topic: "Chemical Equilibrium"
  },
  {
    id: "Q-BIPC-04",
    stream: "BiPC",
    subject: "Botany",
    type: "descriptive",
    question: "Describe the process of double fertilization and triple fusion in Angiospermic flowering plants with a neat labeled diagram.",
    options: [],
    correctAnswer: null,
    marks: 20,
    author: "Dr. M. Kameswara Rao (Dean Medical Streams)",
    date: "12-11-2026",
    topic: "Plant Reproduction"
  },
  {
    id: "Q-BIPC-05",
    stream: "BiPC",
    subject: "Zoology",
    type: "descriptive",
    question: "Explain the physiological mechanism of oxygen transport and carbon dioxide exchange across alveolar capillaries.",
    options: [],
    correctAnswer: null,
    marks: 20,
    author: "Dr. M. Kameswara Rao (Dean Medical Streams)",
    date: "12-11-2026",
    topic: "Respiration in Humans"
  },

  // CEC Questions
  {
    id: "Q-CEC-01",
    stream: "CEC",
    subject: "Civics",
    type: "mcq",
    question: "Who served as the Chairman of the Drafting Committee of the Constituent Assembly of India?",
    options: ["Dr. B.R. Ambedkar", "Dr. Rajendra Prasad", "Jawaharlal Nehru", "Sardar Vallabhbhai Patel"],
    correctAnswer: 0,
    marks: 10,
    author: "Sri D. Jagannadha Rao (HOD Humanities)",
    date: "12-11-2026",
    topic: "Indian Constitution"
  },
  {
    id: "Q-CEC-02",
    stream: "CEC",
    subject: "Economics",
    type: "mcq",
    question: "When consumer demand expands as a result of a fall in commodity price, this phenomenon is termed:",
    options: ["Extension of Demand", "Contraction of Demand", "Shift in Demand curve", "Inelastic Demand"],
    correctAnswer: 0,
    marks: 10,
    author: "Sri T. Appala Naidu (HOD Commerce)",
    date: "12-11-2026",
    topic: "Theory of Consumer Behavior"
  },
  {
    id: "Q-CEC-03",
    stream: "CEC",
    subject: "Commerce",
    type: "mcq",
    question: "Under the Dual Aspect accounting convention, Total Business Assets are always equal to:",
    options: ["Liabilities - Capital", "Capital + Liabilities", "Revenues - Expenses", "Cash + Bank Balances"],
    correctAnswer: 1,
    marks: 10,
    author: "Sri T. Appala Naidu (HOD Commerce)",
    date: "12-11-2026",
    topic: "Accounting Principles"
  },
  {
    id: "Q-CEC-04",
    stream: "CEC",
    subject: "Commerce",
    type: "descriptive",
    question: "What is a Bank Reconciliation Statement (BRS)? Explain four primary causes of difference between Cash Book and Pass Book balances.",
    options: [],
    correctAnswer: null,
    marks: 20,
    author: "Sri T. Appala Naidu (HOD Commerce)",
    date: "12-11-2026",
    topic: "Financial Accounting"
  },
  {
    id: "Q-CEC-05",
    stream: "CEC",
    subject: "Civics",
    type: "descriptive",
    question: "Explain the powers, constitutional functions, and impeachment procedure of the President of India under the Constitution.",
    options: [],
    correctAnswer: null,
    marks: 20,
    author: "Sri D. Jagannadha Rao (HOD Humanities)",
    date: "12-11-2026",
    topic: "Union Executive"
  },

  // MEC Questions
  {
    id: "Q-MEC-01",
    stream: "MEC",
    subject: "Mathematics",
    type: "mcq",
    question: "The geometric slope of any horizontal straight line parallel to the X-axis is equal to:",
    options: ["0", "1", "Infinity / Undefined", "-1"],
    correctAnswer: 0,
    marks: 10,
    author: "Smt. P. Sujatha (Lecturer in Maths)",
    date: "12-11-2026",
    topic: "Coordinate Geometry"
  },
  {
    id: "Q-MEC-02",
    stream: "MEC",
    subject: "Economics",
    type: "mcq",
    question: "The economic Law of Diminishing Marginal Utility postulates that as consecutive units of a good are consumed:",
    options: ["Total utility turns negative", "Marginal utility derived from each extra unit decreases", "Market price increases", "Demand becomes static"],
    correctAnswer: 1,
    marks: 10,
    author: "Sri T. Appala Naidu (HOD Commerce)",
    date: "12-11-2026",
    topic: "Consumer Economics"
  },
  {
    id: "Q-MEC-03",
    stream: "MEC",
    subject: "Commerce",
    type: "mcq",
    question: "The primary book of original entry where all business transactions are registered in chronological order is:",
    options: ["Ledger", "Journal", "Balance Sheet", "Trial Balance"],
    correctAnswer: 1,
    marks: 10,
    author: "Sri T. Appala Naidu (HOD Commerce)",
    date: "12-11-2026",
    topic: "Bookkeeping & Accounts"
  },
  {
    id: "Q-MEC-04",
    stream: "MEC",
    subject: "Mathematics",
    type: "descriptive",
    question: "Calculate the Mean, Median, and Standard Deviation for a grouped statistical frequency distribution dataset.",
    options: [],
    correctAnswer: null,
    marks: 20,
    author: "Smt. P. Sujatha (Lecturer in Maths)",
    date: "12-11-2026",
    topic: "Measures of Dispersion"
  },
  {
    id: "Q-MEC-05",
    stream: "MEC",
    subject: "Economics",
    type: "descriptive",
    question: "Define Gross Domestic Product (GDP). Differentiate between Nominal GDP and Real GDP with appropriate macroeconomic examples.",
    options: [],
    correctAnswer: null,
    marks: 20,
    author: "Sri T. Appala Naidu (HOD Commerce)",
    date: "12-11-2026",
    topic: "National Income Accounting"
  },

  // HEC Questions (History, Economics, Civics)
  {
    id: "Q-HEC-01",
    stream: "HEC",
    subject: "History",
    type: "mcq",
    question: "Who was the founder of the illustrious Maurya Empire in ancient Indian history?",
    options: ["Chandragupta Maurya", "Ashoka the Great", "Samudragupta", "Harshavardhana"],
    correctAnswer: 0,
    marks: 10,
    author: "Sri D. Jagannadha Rao (HOD Humanities)",
    date: "12-11-2026",
    topic: "Ancient Indian Dynasties"
  },
  {
    id: "Q-HEC-02",
    stream: "HEC",
    subject: "Civics",
    type: "mcq",
    question: "Fundamental Rights guaranteed to Indian citizens are codified under which Part of the Indian Constitution?",
    options: ["Part II", "Part III (Articles 12 to 35)", "Part IV", "Part IV-A"],
    correctAnswer: 1,
    marks: 10,
    author: "Sri D. Jagannadha Rao (HOD Humanities)",
    date: "12-11-2026",
    topic: "Fundamental Rights & Duties"
  },
  {
    id: "Q-HEC-03",
    stream: "HEC",
    subject: "Economics",
    type: "mcq",
    question: "In which year was the Planning Commission of India officially substituted by NITI Aayog?",
    options: ["2014", "2015", "2016", "2017"],
    correctAnswer: 1,
    marks: 10,
    author: "Sri T. Appala Naidu (HOD Commerce)",
    date: "12-11-2026",
    topic: "Economic Planning in India"
  },
  {
    id: "Q-HEC-04",
    stream: "HEC",
    subject: "History",
    type: "descriptive",
    question: "Analyze the salient town-planning features, drainage systems, and socio-economic life of the Indus Valley Civilization.",
    options: [],
    correctAnswer: null,
    marks: 20,
    author: "Sri D. Jagannadha Rao (HOD Humanities)",
    date: "12-11-2026",
    topic: "Indus Valley Civilization"
  },
  {
    id: "Q-HEC-05",
    stream: "HEC",
    subject: "Civics",
    type: "descriptive",
    question: "Critically evaluate the Directive Principles of State Policy (DPSP) and discuss their role in establishing a Welfare State in India.",
    options: [],
    correctAnswer: null,
    marks: 20,
    author: "Sri D. Jagannadha Rao (HOD Humanities)",
    date: "12-11-2026",
    topic: "Welfare State & DPSP"
  }
];

// Helper to get questions from localStorage or fallback to default
export function getSavedExamQuestions() {
  const saved = localStorage.getItem('sunrise_exam_questions');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn("Error parsing saved exam questions:", e);
    }
  }
  localStorage.setItem('sunrise_exam_questions', JSON.stringify(DEFAULT_EXAM_QUESTIONS));
  return DEFAULT_EXAM_QUESTIONS;
}

// Helper to save questions
export function saveExamQuestions(questionsList) {
  localStorage.setItem('sunrise_exam_questions', JSON.stringify(questionsList));
}
