import type { Block } from '../../types/lesson'
import { ExplainerView } from './ExplainerView'
import { LabelView } from './LabelView'
import { MatchView } from './MatchView'
import { McqView } from './McqView'
import { SequenceView } from './SequenceView'
import type { BlockVariant } from './types'

/**
 * The one place that knows which component renders which block type. Every
 * screen goes through here, so adding a sixth block type is a change in exactly
 * two files: the union in types/lesson.ts, and this switch.
 */
export function BlockView({
  block,
  variant,
  onResult,
}: {
  block: Block
  variant: BlockVariant
  onResult?: (correct: number, total: number) => void
}) {
  switch (block.type) {
    case 'explainer':
      return <ExplainerView block={block} variant={variant} />
    case 'mcq':
      return <McqView block={block} variant={variant} onResult={onResult} />
    case 'match':
      return <MatchView block={block} variant={variant} onResult={onResult} />
    case 'sequence':
      return <SequenceView block={block} variant={variant} onResult={onResult} />
    case 'label':
      return <LabelView block={block} variant={variant} onResult={onResult} />
  }
}
