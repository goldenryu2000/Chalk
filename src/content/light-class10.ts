import type { Block, Lesson } from '../types/lesson'

/**
 * The hero lesson. In the real product this is what the generator returns and
 * the teacher then edits; here it is hand-written so the demo has no backend.
 *
 * Source: NCERT Science, Class 10, Chapter 9 — Light: Reflection and Refraction
 * (2023 rationalised edition, where Light is Chapter 9).
 */

export const CHAPTER_OUTCOMES = [
  {
    id: '9.1',
    text: 'State the laws of reflection and apply them to plane mirrors',
  },
  {
    id: '9.2',
    text: 'Describe spherical mirrors, their terminology and their uses',
  },
  {
    id: '9.3',
    text: 'Use the mirror formula and magnification to solve numericals',
  },
  { id: '9.4', text: 'Explain refraction of light and state its laws' },
  {
    id: '9.5',
    text: 'Define refractive index and relate it to the speed of light',
  },
  {
    id: '9.6',
    text: 'Apply the lens formula and calculate the power of a lens',
  },
]

const blocks: Block[] = [
  {
    id: 'b-reflection-intro',
    type: 'explainer',
    outcomes: ['9.1'],
    title: 'Light bounces, and it bounces predictably',
    figure: 'plane-mirror',
    body: [
      'A highly polished surface — a mirror, still water, a steel plate — sends almost all the light falling on it back into the same medium. That turning back is reflection.',
      'It is not random. Draw a line perpendicular to the mirror at the point where the ray lands; that line is the normal. Every reflection obeys two rules with respect to it.',
      'First: the angle of incidence equals the angle of reflection. Second: the incident ray, the reflected ray and the normal all lie in one plane. These two laws hold for every reflecting surface, curved or flat.',
    ],
    keyTerms: [
      {
        term: 'Normal',
        definition:
          'The line drawn perpendicular to the reflecting surface at the point of incidence. All angles are measured from it — never from the mirror itself.',
      },
      {
        term: 'Angle of incidence (∠i)',
        definition: 'The angle between the incident ray and the normal.',
      },
      {
        term: 'Angle of reflection (∠r)',
        definition: 'The angle between the reflected ray and the normal.',
      },
    ],
  },
  {
    id: 'b-label-reflection',
    type: 'label',
    outcomes: ['9.1'],
    title: 'Label the reflection at a plane mirror',
    figure: 'plane-mirror',
    targets: [
      // Percentages of the shared 400×260 figure box. The two angle hotspots sit
      // inside their own angle but are staggered vertically, because the placed
      // labels are wide enough to collide if they share a line.
      { id: 't-incident', label: 'Incident ray', x: 28, y: 40 },
      { id: 't-normal', label: 'Normal', x: 50, y: 19 },
      { id: 't-reflected', label: 'Reflected ray', x: 72, y: 40 },
      { id: 't-i', label: 'Angle of incidence', x: 42, y: 52 },
      { id: 't-r', label: 'Angle of reflection', x: 54, y: 66 },
      { id: 't-point', label: 'Point of incidence', x: 50, y: 89 },
    ],
  },
  {
    id: 'b-mcq-angle',
    type: 'mcq',
    outcomes: ['9.1'],
    question:
      'A ray of light strikes a plane mirror at an angle of incidence of 35°. What is the angle between the incident ray and the reflected ray?',
    options: ['35°', '55°', '70°', '110°'],
    answerIndex: 2,
    explanation:
      'By the first law of reflection ∠r = ∠i = 35°. Both angles are measured from the normal, and the two rays lie on opposite sides of it — so the angle between the rays is 35° + 35° = 70°.',
  },
  {
    id: 'b-spherical-intro',
    type: 'explainer',
    outcomes: ['9.2'],
    title: 'Spherical mirrors: the vocabulary you must not mix up',
    figure: 'concave-mirror',
    body: [
      'Cut a small piece out of a hollow sphere and silver one side of it. If the reflecting surface is the hollow inner side, you have a concave mirror. If it is the bulging outer side, you have a convex mirror.',
      'Because the mirror came from a sphere, that sphere leaves its fingerprints on the geometry: a centre, a radius, and a point where parallel light converges. Almost every mistake in this chapter is a vocabulary mistake, not a physics mistake.',
      'For a spherical mirror the focal length is half the radius of curvature: f = R/2. That single relation saves you a step in most numericals.',
    ],
    keyTerms: [
      {
        term: 'Principal axis',
        definition:
          'The straight line passing through the pole and the centre of curvature of the mirror.',
      },
      {
        term: 'f = R / 2',
        definition:
          'The focal length of a spherical mirror is half its radius of curvature.',
      },
    ],
  },
  {
    id: 'b-match-terms',
    type: 'match',
    outcomes: ['9.2'],
    title: 'Match each term to what it actually means',
    pairs: [
      {
        left: 'Pole (P)',
        right: 'The centre of the reflecting surface of the mirror',
      },
      {
        left: 'Centre of curvature (C)',
        right: 'The centre of the sphere that the mirror is a part of',
      },
      {
        left: 'Principal focus (F)',
        right:
          'Where rays parallel to the principal axis meet after reflection',
      },
      {
        left: 'Radius of curvature (R)',
        right: 'The distance from the pole to the centre of curvature',
      },
      {
        left: 'Aperture',
        right: 'The effective diameter of the reflecting surface',
      },
    ],
  },
  {
    id: 'b-sequence-raydiagram',
    type: 'sequence',
    outcomes: ['9.2'],
    title:
      'Put the ray-diagram steps in order: image formed by a concave mirror',
    steps: [
      'Draw the principal axis and mark the pole P, the focus F and the centre of curvature C',
      'Stand the object as an upright arrow on the axis, beyond C',
      'From the top of the object draw a ray parallel to the principal axis',
      'After reflection, continue that ray so it passes through the focus F',
      'From the top of the object draw a second ray passing through C, which reflects straight back along itself',
      'Mark where the two reflected rays intersect and draw the image down to the principal axis',
    ],
  },
  {
    id: 'b-mcq-rearview',
    type: 'mcq',
    outcomes: ['9.2'],
    question: 'Why is a convex mirror used as the rear-view mirror in vehicles?',
    options: [
      'It forms a magnified image, so vehicles behind look closer',
      'It always forms an erect, diminished image and gives a wider field of view',
      'It forms a real image on the driver’s side of the mirror',
      'It is cheaper to manufacture than a plane mirror of the same size',
    ],
    answerIndex: 1,
    explanation:
      'A convex mirror always produces a virtual, erect and diminished image regardless of where the object is. Because the image is diminished, a much larger area of traffic fits into the same mirror — a wider field of view than a plane mirror of equal size.',
  },
  {
    id: 'b-mcq-mirror-formula',
    type: 'mcq',
    outcomes: ['9.3'],
    question:
      'An object is placed 15 cm in front of a concave mirror of focal length 10 cm. Where is the image formed?',
    options: [
      '30 cm behind the mirror',
      '30 cm in front of the mirror',
      '6 cm in front of the mirror',
      '15 cm behind the mirror',
    ],
    answerIndex: 1,
    explanation:
      'Using the sign convention, u = −15 cm and f = −10 cm. From 1/v + 1/u = 1/f: 1/v = 1/f − 1/u = −1/10 + 1/15 = −1/30, so v = −30 cm. The negative sign means the image is 30 cm in front of the mirror — real, inverted and magnified.',
  },
  {
    id: 'b-refraction-intro',
    type: 'explainer',
    outcomes: ['9.4', '9.5'],
    title: 'Refraction: why the straw looks broken',
    figure: 'refraction-slab',
    body: [
      'Light does not travel at the same speed in every medium. When a ray crosses from air into glass or water, that change in speed forces it to change direction at the boundary. This bending is refraction.',
      'Going from a rarer medium into a denser one the ray bends towards the normal; coming back out into a rarer medium it bends away from the normal. A ray hitting the surface along the normal does not bend at all.',
      'Pass a ray through a rectangular glass slab and it emerges parallel to the direction it went in — just shifted sideways. That sideways shift is the lateral displacement, and it is why a straw in a glass of water looks snapped at the surface.',
    ],
    keyTerms: [
      {
        term: 'Refractive index (n)',
        definition:
          'n = c / v — the speed of light in vacuum divided by its speed in the medium. It has no unit.',
      },
      {
        term: 'Optically denser medium',
        definition:
          'The medium in which light travels more slowly, and therefore the one with the higher refractive index.',
      },
    ],
  },
  {
    id: 'b-mcq-bending',
    type: 'mcq',
    outcomes: ['9.4'],
    question:
      'A ray of light travels from water into air, striking the surface at an angle. How does it bend?',
    options: [
      'Towards the normal, because air is optically rarer',
      'Away from the normal, because air is optically rarer',
      'It does not bend, because both are transparent',
      'It bends towards the normal, because it speeds up',
    ],
    answerIndex: 1,
    explanation:
      'Air is optically rarer than water, so light speeds up on entering it. A ray moving from a denser to a rarer medium always bends away from the normal.',
  },
  {
    id: 'b-mcq-refractive-index',
    type: 'mcq',
    outcomes: ['9.5'],
    question:
      'The refractive index of glass is 1.5 and the speed of light in vacuum is 3 × 10⁸ m/s. What is the speed of light in glass?',
    options: [
      '4.5 × 10⁸ m/s',
      '3.0 × 10⁸ m/s',
      '2.0 × 10⁸ m/s',
      '1.5 × 10⁸ m/s',
    ],
    answerIndex: 2,
    explanation:
      'From n = c / v we get v = c / n = (3 × 10⁸) / 1.5 = 2 × 10⁸ m/s. Light is always slower in a medium than in vacuum, so an answer larger than 3 × 10⁸ m/s can be ruled out immediately.',
  },
]

export const lightLesson: Lesson = {
  id: 'light-c10',
  title: 'Light: Reflection and Refraction',
  summary:
    'Two laws of reflection, the spherical-mirror vocabulary students always confuse, and why light bends when it changes medium.',
  meta: {
    board: 'CBSE',
    grade: 10,
    subject: 'Science',
    chapterNumber: 9,
    chapter: 'Light: Reflection and Refraction',
    outcomes: CHAPTER_OUTCOMES,
    durationMinutes: 40,
    difficulty: 'Standard',
    language: 'English',
  },
  blocks,
}

/**
 * Pre-written alternates for the "Regenerate this block" button in Review.
 * The demo swaps one of these in instead of calling a model.
 */
export const alternates: Record<string, Block[]> = {
  'b-mcq-angle': [
    {
      id: 'b-mcq-angle',
      type: 'mcq',
      outcomes: ['9.1'],
      question:
        'A ray of light falls normally (perpendicularly) on a plane mirror. What is the angle of reflection?',
      options: ['0°', '45°', '90°', '180°'],
      answerIndex: 0,
      explanation:
        'A ray falling normally travels along the normal itself, so the angle of incidence is 0°. Since ∠r = ∠i, the angle of reflection is also 0° and the ray retraces its own path.',
    },
    {
      id: 'b-mcq-angle',
      type: 'mcq',
      outcomes: ['9.1'],
      question:
        'The angle between a reflected ray and the mirror surface is 30°. What is the angle of incidence?',
      options: ['30°', '60°', '90°', '120°'],
      answerIndex: 1,
      explanation:
        'Angles in reflection are measured from the normal, not from the mirror. If the reflected ray makes 30° with the surface, it makes 90° − 30° = 60° with the normal. So ∠r = 60°, and therefore ∠i = 60°.',
    },
  ],
  'b-mcq-rearview': [
    {
      id: 'b-mcq-rearview',
      type: 'mcq',
      outcomes: ['9.2'],
      question:
        'Which of these uses a concave mirror, and for what reason?',
      options: [
        'A vehicle headlight, because a source at the focus produces a parallel beam',
        'A rear-view mirror, because it widens the field of view',
        'A shop security mirror, because it shows the whole aisle',
        'A street lamp reflector, because it scatters light in all directions',
      ],
      answerIndex: 0,
      explanation:
        'Placing the bulb at the principal focus of a concave reflector sends the reflected rays out parallel to the principal axis, which is exactly what a headlight beam needs. The other three are convex-mirror applications.',
    },
  ],
  'b-mcq-refractive-index': [
    {
      id: 'b-mcq-refractive-index',
      type: 'mcq',
      outcomes: ['9.5'],
      question:
        'The refractive index of water is 1.33 and of diamond is 2.42. Which statement is correct?',
      options: [
        'Light travels faster in diamond than in water',
        'Light travels faster in water than in diamond',
        'Light travels at the same speed in both',
        'Diamond is optically rarer than water',
      ],
      answerIndex: 1,
      explanation:
        'Refractive index and speed are inversely related, since n = c / v. Diamond has the higher refractive index, so light is slower in diamond — and faster in water.',
    },
  ],
}

/**
 * The block offered when the teacher clicks "Cover this" on the outcome the
 * draft missed (9.6 — lens formula and power).
 */
export const lensBlock: Block = {
  id: 'b-mcq-lens-power',
  type: 'mcq',
  outcomes: ['9.6'],
  question:
    'A convex lens has a focal length of 25 cm. What is its power, and what sign does it carry?',
  options: ['+0.25 D', '+4 D', '−4 D', '+25 D'],
  answerIndex: 1,
  explanation:
    'Power is the reciprocal of the focal length in metres: P = 1 / f = 1 / 0.25 m = +4 D. A converging (convex) lens has a positive focal length, so its power is positive; a concave lens would give a negative value.',
}

/** The scripted pipeline shown while the demo pretends to generate. */
export const generationSteps = [
  {
    label: 'Reading NCERT Class 10 Science, Chapter 9',
    detail: 'Parsing 6 declared learning outcomes',
  },
  {
    label: 'Planning the lesson arc',
    detail: 'Reflection → spherical mirrors → refraction, 40 minutes',
  },
  {
    label: 'Writing explainers',
    detail: '3 explainers, 5 key terms, 3 diagrams',
  },
  {
    label: 'Building interactive blocks',
    detail: '5 quiz questions, 1 matching set, 1 ordering task, 1 labelled diagram',
  },
  {
    label: 'Checking curriculum coverage',
    detail: '5 of 6 outcomes covered — 9.6 flagged for the teacher',
  },
  {
    label: 'Ready for your review',
    detail: 'Nothing is published until you approve it',
  },
]
