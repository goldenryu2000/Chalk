import type { Board } from '../types/lesson'

/** The teacher whose account the demo is signed in as. */
export const teacher = {
  name: 'Meera Iyer',
  initials: 'MI',
  school: 'Sunrise Public School, Pune',
  subjects: 'Science · Class 8–10',
}

export interface LessonCard {
  id: string
  title: string
  board: Board
  grade: number
  subject: string
  chapterNumber: number
  blocks: number
  status: 'Published' | 'Draft' | 'Needs review'
  taughtOn?: string
  avgScore?: number
}

/** Set dressing for the dashboard. Only the Light lesson is actually openable. */
export const previousLessons: LessonCard[] = [
  {
    id: 'metals-c10',
    title: 'Metals and Non-metals',
    board: 'CBSE',
    grade: 10,
    subject: 'Science',
    chapterNumber: 3,
    blocks: 12,
    status: 'Published',
    taughtOn: '22 Jul',
    avgScore: 74,
  },
  {
    id: 'life-processes-c10',
    title: 'Life Processes',
    board: 'CBSE',
    grade: 10,
    subject: 'Science',
    chapterNumber: 5,
    blocks: 14,
    status: 'Published',
    taughtOn: '18 Jul',
    avgScore: 81,
  },
  {
    id: 'sound-c9',
    title: 'Sound',
    board: 'CBSE',
    grade: 9,
    subject: 'Science',
    chapterNumber: 11,
    blocks: 9,
    status: 'Needs review',
  },
  {
    id: 'carbon-c10',
    title: 'Carbon and its Compounds',
    board: 'CBSE',
    grade: 10,
    subject: 'Science',
    chapterNumber: 4,
    blocks: 11,
    status: 'Draft',
  },
]

/* ---------- Wizard options ---------- */

export const boards: Board[] = ['CBSE', 'ICSE', 'State Board']
export const grades = [6, 7, 8, 9, 10, 11, 12]
export const subjects = ['Science', 'Mathematics', 'Social Science', 'English']

/** Chapter lists per subject. Only Science · Class 10 · Ch 9 opens a real lesson. */
export const chapters: Record<string, string[]> = {
  Science: [
    'Chemical Reactions and Equations',
    'Acids, Bases and Salts',
    'Metals and Non-metals',
    'Carbon and its Compounds',
    'Life Processes',
    'Control and Coordination',
    'How do Organisms Reproduce?',
    'Heredity',
    'Light: Reflection and Refraction',
    'The Human Eye and the Colourful World',
    'Electricity',
    'Magnetic Effects of Electric Current',
    'Our Environment',
  ],
  Mathematics: [
    'Real Numbers',
    'Polynomials',
    'Pair of Linear Equations in Two Variables',
    'Quadratic Equations',
    'Arithmetic Progressions',
    'Triangles',
    'Coordinate Geometry',
    'Introduction to Trigonometry',
  ],
  'Social Science': [
    'The Rise of Nationalism in Europe',
    'Nationalism in India',
    'The Making of a Global World',
    'Resources and Development',
    'Water Resources',
    'Power Sharing',
    'Federalism',
  ],
  English: [
    'A Letter to God',
    'Nelson Mandela: Long Walk to Freedom',
    'Two Stories about Flying',
    'From the Diary of Anne Frank',
    'Glimpses of India',
  ],
}

/** The chapter the demo is wired for. */
export const DEMO_CHAPTER = 'Light: Reflection and Refraction'

/* ---------- Class results (post-lesson) ---------- */

export const classInfo = {
  name: 'Class 10-B',
  strength: 34,
  present: 31,
}

/** Score buckets across the class, for the distribution chart. */
export const scoreDistribution = [
  { band: '0–20%', students: 1 },
  { band: '21–40%', students: 3 },
  { band: '41–60%', students: 7 },
  { band: '61–80%', students: 12 },
  { band: '81–100%', students: 8 },
]

/** Per-block accuracy, keyed by block id from the Light lesson. */
export const blockAccuracy: Record<string, number> = {
  'b-label-reflection': 88,
  'b-mcq-angle': 79,
  'b-match-terms': 71,
  'b-sequence-raydiagram': 64,
  'b-mcq-rearview': 91,
  'b-mcq-mirror-formula': 42,
  'b-mcq-bending': 83,
  'b-mcq-refractive-index': 55,
}

export interface Misconception {
  outcome: string
  headline: string
  detail: string
  students: number
}

export const misconceptions: Misconception[] = [
  {
    outcome: '9.3',
    headline: '18 students dropped the sign convention',
    detail:
      'On the mirror-formula question, the most common wrong answer put the image behind the mirror: they used u = +15 instead of u = −15.',
    students: 18,
  },
  {
    outcome: '9.5',
    headline: '14 students inverted n = c / v',
    detail:
      'They divided 1.5 by 3 × 10⁸ rather than the other way round, and chose a speed faster than light in vacuum without noticing.',
    students: 14,
  },
]

export const topStudents = [
  { name: 'Aarav Deshmukh', score: 96 },
  { name: 'Fatima Sheikh', score: 92 },
  { name: 'Rohan Patil', score: 88 },
]

export const needsHelp = [
  { name: 'Kabir Joshi', score: 34 },
  { name: 'Sneha Kulkarni', score: 41 },
  { name: 'Vivaan Rane', score: 47 },
]
