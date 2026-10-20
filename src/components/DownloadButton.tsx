'use client';

/** Saves text content (Markdown) as a file the viewer can open in Word, Google Docs or any editor. */
export function DownloadButton({ filename, content, label = 'Download' }: { filename: string; content: string; label?: string }) {
  return (
    <button
      type="button"
      className="btn"
      onClick={() => {
        const url = URL.createObjectURL(new Blob([content], { type: 'text/markdown;charset=utf-8' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }}
    >
      {label}
    </button>
  );
}
