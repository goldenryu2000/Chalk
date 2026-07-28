import { useLessonStore } from '../../store/useLessonStore'
import { OPTION_LETTERS } from '../../components/blocks/types'
import type { Block } from '../../types/lesson'

/**
 * Text editing for the selected block. Only the fields a teacher would actually
 * want to reword are exposed. Structure (block type, hotspot positions) is not
 * editable here, because that is the part they trust Chalk to get right.
 */
export function BlockEditor({
  block,
  onEdited,
}: {
  block: Block
  onEdited: () => void
}) {
  const updateBlock = useLessonStore((s) => s.updateBlock)

  function patch(fields: Partial<Block>) {
    updateBlock(block.id, fields)
    onEdited()
  }

  return (
    <div className="space-y-5">
      {block.type === 'explainer' && (
        <>
          <TextField
            label="Title"
            value={block.title}
            onChange={(title) => patch({ title } as Partial<Block>)}
          />
          <TextArea
            label="Body: one paragraph per blank line"
            rows={10}
            value={block.body.join('\n\n')}
            onChange={(text) =>
              patch({
                body: text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean),
              } as Partial<Block>)
            }
          />
        </>
      )}

      {block.type === 'mcq' && (
        <>
          <TextArea
            label="Question"
            rows={3}
            value={block.question}
            onChange={(question) => patch({ question } as Partial<Block>)}
          />

          <div>
            <p className="mb-2 text-sm font-semibold">Options</p>
            <div className="space-y-2">
              {block.options.map((option, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button
                    type="button"
                    title="Mark as the correct answer"
                    onClick={() =>
                      patch({ answerIndex: i } as Partial<Block>)
                    }
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                      i === block.answerIndex
                        ? 'bg-good text-white'
                        : 'bg-paper-2 text-ink-3 hover:bg-line'
                    }`}
                  >
                    {OPTION_LETTERS[i]}
                  </button>
                  <input
                    value={option}
                    onChange={(e) => {
                      const options = [...block.options]
                      options[i] = e.target.value
                      patch({ options } as Partial<Block>)
                    }}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-3">
              Click a letter to change which option is correct.
            </p>
          </div>

          <TextArea
            label="Explanation shown after answering"
            rows={4}
            value={block.explanation}
            onChange={(explanation) =>
              patch({ explanation } as Partial<Block>)
            }
          />
        </>
      )}

      {block.type === 'match' && (
        <>
          <TextField
            label="Instruction"
            value={block.title}
            onChange={(title) => patch({ title } as Partial<Block>)}
          />
          <div className="space-y-2">
            {block.pairs.map((pair, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-2">
                <input
                  value={pair.left}
                  onChange={(e) => {
                    const pairs = block.pairs.map((p, j) =>
                      j === i ? { ...p, left: e.target.value } : p,
                    )
                    patch({ pairs } as Partial<Block>)
                  }}
                  className="rounded-lg border border-line px-3 py-2 text-sm font-medium"
                />
                <input
                  value={pair.right}
                  onChange={(e) => {
                    const pairs = block.pairs.map((p, j) =>
                      j === i ? { ...p, right: e.target.value } : p,
                    )
                    patch({ pairs } as Partial<Block>)
                  }}
                  className="rounded-lg border border-line px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {block.type === 'sequence' && (
        <>
          <TextField
            label="Instruction"
            value={block.title}
            onChange={(title) => patch({ title } as Partial<Block>)}
          />
          <div>
            <p className="mb-2 text-sm font-semibold">
              Steps, in the correct order
            </p>
            <div className="space-y-2">
              {block.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-2 flex size-6 shrink-0 items-center justify-center rounded-md bg-paper-2 text-xs font-bold text-ink-3">
                    {i + 1}
                  </span>
                  <textarea
                    value={step}
                    rows={2}
                    onChange={(e) => {
                      const steps = [...block.steps]
                      steps[i] = e.target.value
                      patch({ steps } as Partial<Block>)
                    }}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {block.type === 'label' && (
        <>
          <TextField
            label="Instruction"
            value={block.title}
            onChange={(title) => patch({ title } as Partial<Block>)}
          />
          <div>
            <p className="mb-2 text-sm font-semibold">Labels</p>
            <div className="space-y-2">
              {block.targets.map((target, i) => (
                <input
                  key={target.id}
                  value={target.label}
                  onChange={(e) => {
                    const targets = block.targets.map((t, j) =>
                      j === i ? { ...t, label: e.target.value } : t,
                    )
                    patch({ targets } as Partial<Block>)
                  }}
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm"
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-3">
              Where each label sits on the diagram is fixed by the figure.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line px-3 py-2 text-sm"
      />
    </label>
  )
}

function TextArea({
  label,
  value,
  rows,
  onChange,
}: {
  label: string
  value: string
  rows: number
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line px-3 py-2 text-sm leading-relaxed"
      />
    </label>
  )
}
