import katex from 'katex';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Render inline $...$ segments in a string with KaTeX (build time).
 * Non-math segments are HTML-escaped. Returns safe HTML.
 */
export function renderInlineMath(text: string): string {
  return text
    .split(/(\$[^$]+\$)/g)
    .map((part) => {
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        try {
          return katex.renderToString(part.slice(1, -1), {
            displayMode: false,
            throwOnError: false,
            strict: false,
          });
        } catch {
          return escapeHtml(part);
        }
      }
      return escapeHtml(part);
    })
    .join('');
}

export function stripMath(text: string): string {
  return text.replace(/\$[^$]*\$/g, '').trim();
}
