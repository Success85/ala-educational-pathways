'use client';
import { useState } from 'react';

/** Two or more labelled panels; every panel stays in the page so printing shows all of them. */
export function EntryTabs({ labels, children, initial = 0, ariaLabel = 'Student entry point' }: {
  labels: string[]; children: React.ReactNode[]; initial?: number; ariaLabel?: string;
}) {
  const [active, setActive] = useState(initial);
  return (
    <div className="tabs">
      <div className="tablist no-print" role="tablist" aria-label={ariaLabel}>
        {labels.map((l, i) => (
          <button key={l} type="button" role="tab" id={`tab-${i}`} aria-controls={`panel-${i}`} aria-selected={i === active}
            className={i === active ? 'on' : ''} onClick={() => setActive(i)}>{l}</button>
        ))}
      </div>
      {children.map((panel, i) => (
        <div key={i} role="tabpanel" id={`panel-${i}`} aria-labelledby={`tab-${i}`} className={`tabpanel${i === active ? ' on' : ''}`}>
          <h3 className="print-only">{labels[i]}</h3>
          {panel}
        </div>
      ))}
    </div>
  );
}
