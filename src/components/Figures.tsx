import type { FigureId } from '../types/lesson'

/**
 * Hand-drawn optics diagrams. Every figure shares one 400×260 viewBox so the
 * Label block can position hotspots with plain percentages, and each takes a
 * `tone` so the same drawing works on paper and on the blackboard.
 */

type Tone = 'paper' | 'board'

interface FigureProps {
  id: FigureId
  tone?: Tone
  /** Hides the built-in text labels, so the Label block can ask for them. */
  unlabelled?: boolean
  className?: string
}

const palette = {
  paper: {
    line: '#4a423e',
    faint: '#b8ada2',
    ray: '#d9541e',
    text: '#4a423c',
    surface: '#1a1614',
  },
  board: {
    line: '#dfe9e4',
    faint: '#7d928a',
    ray: '#f2a074',
    text: '#c6d6cf',
    surface: '#eef4f1',
  },
}

export function Figure({
  id,
  tone = 'paper',
  unlabelled = false,
  className = '',
}: FigureProps) {
  const c = palette[tone]
  return (
    <svg
      viewBox="0 0 400 260"
      className={`w-full ${className}`}
      role="img"
      aria-label={FIGURE_ALT[id]}
    >
      <defs>
        <marker
          id={`arrow-${id}-${tone}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={c.ray} />
        </marker>
      </defs>
      {id === 'plane-mirror' && (
        <PlaneMirror c={c} marker={`arrow-${id}-${tone}`} showText={!unlabelled} />
      )}
      {id === 'concave-mirror' && (
        <ConcaveMirror c={c} marker={`arrow-${id}-${tone}`} showText={!unlabelled} />
      )}
      {id === 'refraction-slab' && (
        <RefractionSlab c={c} marker={`arrow-${id}-${tone}`} showText={!unlabelled} />
      )}
    </svg>
  )
}

export const FIGURE_ALT: Record<FigureId, string> = {
  'plane-mirror':
    'A ray of light striking a plane mirror, with the normal drawn at the point of incidence and the reflected ray leaving at an equal angle on the other side.',
  'concave-mirror':
    'A concave mirror on a principal axis, marked with the pole, principal focus and centre of curvature, and a parallel ray reflecting through the focus.',
  'refraction-slab':
    'A ray of light passing through a rectangular glass slab, bending towards the normal on entry and away from it on exit, emerging parallel but laterally displaced.',
}

type C = (typeof palette)['paper']
interface PartProps {
  c: C
  marker: string
  showText: boolean
}

function Label({
  c,
  x,
  y,
  children,
  anchor = 'middle',
}: {
  c: C
  x: number
  y: number
  children: string
  anchor?: 'start' | 'middle' | 'end'
}) {
  return (
    <text
      x={x}
      y={y}
      fill={c.text}
      fontSize="12"
      fontFamily="Inter Variable, system-ui, sans-serif"
      textAnchor={anchor}
    >
      {children}
    </text>
  )
}

function PlaneMirror({ c, marker, showText }: PartProps) {
  // Mirror along y = 200, point of incidence at (200, 200), 40° either side of the normal.
  return (
    <g>
      {/* Hatching under the mirror surface */}
      {Array.from({ length: 17 }, (_, i) => 60 + i * 17).map((x) => (
        <line
          key={x}
          x1={x}
          y1={202}
          x2={x - 10}
          y2={214}
          stroke={c.faint}
          strokeWidth="1.5"
        />
      ))}
      <line x1="50" y1="200" x2="350" y2="200" stroke={c.surface} strokeWidth="3" />

      {/* Normal */}
      <line
        x1="200"
        y1="200"
        x2="200"
        y2="45"
        stroke={c.faint}
        strokeWidth="1.5"
        strokeDasharray="6 5"
      />

      {/* Incident and reflected rays, both at 40° from the normal */}
      <line
        x1="70"
        y1="45"
        x2="200"
        y2="200"
        stroke={c.ray}
        strokeWidth="2.5"
        markerEnd={`url(#${marker})`}
      />
      <line
        x1="200"
        y1="200"
        x2="330"
        y2="45"
        stroke={c.ray}
        strokeWidth="2.5"
        markerEnd={`url(#${marker})`}
      />

      {/* Angle arcs against the normal */}
      <path
        d="M 200 145 A 55 55 0 0 0 165 165"
        fill="none"
        stroke={c.line}
        strokeWidth="1.5"
      />
      <path
        d="M 200 145 A 55 55 0 0 1 235 165"
        fill="none"
        stroke={c.line}
        strokeWidth="1.5"
      />

      <circle cx="200" cy="200" r="4" fill={c.surface} />

      {showText && (
        <g>
          <Label c={c} x={104} y={112} anchor="end">
            Incident ray
          </Label>
          <Label c={c} x={296} y={112} anchor="start">
            Reflected ray
          </Label>
          <Label c={c} x={200} y={38}>
            Normal
          </Label>
          <Label c={c} x={168} y={182} anchor="end">
            ∠i
          </Label>
          <Label c={c} x={232} y={182} anchor="start">
            ∠r
          </Label>
          <Label c={c} x={200} y={236}>
            Point of incidence
          </Label>
        </g>
      )}
    </g>
  )
}

function ConcaveMirror({ c, marker, showText }: PartProps) {
  // Reflecting surface faces left; pole at (325,130), R = 180 so C = 145 and F = 235.
  return (
    <g>
      <line
        x1="40"
        y1="130"
        x2="380"
        y2="130"
        stroke={c.faint}
        strokeWidth="1.5"
        strokeDasharray="6 5"
      />
      <path
        d="M 300 35 Q 350 130 300 225"
        fill="none"
        stroke={c.surface}
        strokeWidth="3.5"
      />
      {/* Silvered back of the mirror */}
      {Array.from({ length: 11 }, (_, i) => 40 + i * 19).map((y) => (
        <line
          key={y}
          x1={318 + Math.abs(y - 130) * -0.11}
          y1={y}
          x2={332 + Math.abs(y - 130) * -0.11}
          y2={y - 8}
          stroke={c.faint}
          strokeWidth="1.5"
        />
      ))}

      {/* A parallel ray reflecting through the focus */}
      <line
        x1="80"
        y1="82"
        x2="311"
        y2="82"
        stroke={c.ray}
        strokeWidth="2.5"
        markerEnd={`url(#${marker})`}
      />
      <line
        x1="311"
        y1="82"
        x2="180"
        y2="163"
        stroke={c.ray}
        strokeWidth="2.5"
        markerEnd={`url(#${marker})`}
      />

      {[
        { x: 325, letter: 'P' },
        { x: 235, letter: 'F' },
        { x: 145, letter: 'C' },
      ].map((p) => (
        <g key={p.letter}>
          <circle cx={p.x} cy={130} r="4" fill={c.surface} />
          {showText && (
            <Label c={c} x={p.x} y={152}>
              {p.letter}
            </Label>
          )}
        </g>
      ))}

      {showText && (
        <g>
          <Label c={c} x={62} y={122} anchor="start">
            Principal axis
          </Label>
          <Label c={c} x={80} y={70} anchor="start">
            Ray parallel to the axis
          </Label>
          <Label c={c} x={239} y={196} anchor="start">
            Reflects through F
          </Label>
        </g>
      )}
    </g>
  )
}

function RefractionSlab({ c, marker, showText }: PartProps) {
  // Slab spans x 120–280, y 70–190. Entry at (160,70), exit at (232,190).
  return (
    <g>
      <rect
        x="120"
        y="70"
        width="160"
        height="120"
        fill={c.faint}
        fillOpacity="0.18"
        stroke={c.surface}
        strokeWidth="2"
      />

      {/* Normals at the two surfaces */}
      <line
        x1="160"
        y1="30"
        x2="160"
        y2="110"
        stroke={c.faint}
        strokeWidth="1.5"
        strokeDasharray="6 5"
      />
      <line
        x1="232"
        y1="150"
        x2="232"
        y2="230"
        stroke={c.faint}
        strokeWidth="1.5"
        strokeDasharray="6 5"
      />

      {/* Air → glass: bends towards the normal. Glass → air: bends back, parallel but shifted. */}
      <line
        x1="60"
        y1="28"
        x2="160"
        y2="70"
        stroke={c.ray}
        strokeWidth="2.5"
        markerEnd={`url(#${marker})`}
      />
      <line x1="160" y1="70" x2="232" y2="190" stroke={c.ray} strokeWidth="2.5" />
      <line
        x1="232"
        y1="190"
        x2="332"
        y2="232"
        stroke={c.ray}
        strokeWidth="2.5"
        markerEnd={`url(#${marker})`}
      />

      {/* Where the ray would have gone with no slab */}
      <line
        x1="160"
        y1="70"
        x2="290"
        y2="125"
        stroke={c.faint}
        strokeWidth="1.5"
        strokeDasharray="4 6"
      />

      {showText && (
        <g>
          <Label c={c} x={62} y={20} anchor="start">
            Incident ray (air)
          </Label>
          <Label c={c} x={200} y={128} anchor="start">
            Glass
          </Label>
          <Label c={c} x={334} y={224} anchor="end">
            Emergent ray
          </Label>
          <Label c={c} x={296} y={140} anchor="start">
            Lateral shift
          </Label>
        </g>
      )}
    </g>
  )
}
