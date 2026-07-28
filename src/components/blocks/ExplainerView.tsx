import { Figure } from '../Figures'
import type { ExplainerBlock } from '../../types/lesson'
import { tones, type BlockViewProps } from './types'

export function ExplainerView({
  block,
  variant,
}: BlockViewProps<ExplainerBlock>) {
  const t = tones(variant)
  const big = variant === 'present'

  return (
    <div className={big ? 'grid gap-10 lg:grid-cols-[1.1fr_1fr]' : 'grid gap-6'}>
      <div>
        <h3
          className={`${big ? 'text-4xl' : 'text-2xl'} font-semibold ${t.heading}`}
        >
          {block.title}
        </h3>
        <div
          className={`mt-4 space-y-3 ${big ? 'text-xl leading-relaxed' : 'text-[0.95rem] leading-relaxed'} ${t.body}`}
        >
          {block.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {block.figure && (
          <div
            className={`rounded-2xl border p-4 ${t.surface} ${big ? '' : 'max-w-md'}`}
          >
            <Figure id={block.figure} tone={t.board ? 'board' : 'paper'} />
          </div>
        )}

        {block.keyTerms && block.keyTerms.length > 0 && (
          <dl className={`space-y-3 ${big ? 'text-base' : 'text-sm'}`}>
            {block.keyTerms.map((term) => (
              <div
                key={term.term}
                className={`rounded-xl border-l-2 border-accent pl-3 ${t.body}`}
              >
                <dt className={`font-semibold ${t.heading}`}>{term.term}</dt>
                <dd className="mt-0.5 leading-relaxed">{term.definition}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  )
}
