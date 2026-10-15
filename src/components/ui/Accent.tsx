import { Fragment } from 'react'

/** Renders "*word*" in content.ts copy as the italic accent (see .accent-em in index.css). */
export function Accent({ text }: { text: string }) {
  return (
    <>
      {text.split('*').map((part, i) =>
        i % 2 === 1 ? (
          <em key={i} className="accent-em">
            {part}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}
