import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, ...props }) => (
            <p
              className="my-2 leading-7 [&:not(:first-child)]:mt-4"
              {...props}
            />
          ),
          h1: ({ node, ...props }) => (
            <h1
              className="scroll-m-20 text-4xl font-bold tracking-tight"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="scroll-m-20 text-2xl font-semibold tracking-tight mt-6"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="scroll-m-20 text-xl font-semibold tracking-tight"
              {...props}
            />
          ),
          code: ({ node, className, children, ...props }) => {
            const isBlock =
              typeof className === "string" &&
              className.includes("language-")

            if (isBlock) {
              return (
                <code
                  {...props}
                  className={`block rounded-lg bg-muted p-3 font-mono text-sm overflow-x-auto ${
                    className ?? ""
                  }`}
                >
                  {children}
                </code>
              )
            }

            return (
              <code
                {...props}
                className={`rounded bg-muted px-1 py-0.5 font-mono text-sm ${
                  className ?? ""
                }`}
              >
                {children}
              </code>
            )
          },

          pre: ({ node, ...props }) => (
            <pre
              className="rounded-lg bg-muted p-3 overflow-x-auto"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="my-4 list-disc pl-6" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="my-4 list-decimal pl-6" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="mt-4 border-l-4 pl-4 italic text-muted-foreground"
              {...props}
            />
          ),
          hr: ({ node, ...props }) => <hr className="my-4" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
