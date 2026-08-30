import React, { useEffect, useMemo, useState } from 'react';

const TOUR_STEPS = [
  {
    id: 'new-sticker',
    selector: '[data-tour-id="tour-new-sticker"]',
    title: 'Create a new bug',
    body: 'Use the New Sticker button to log a bug, assign an owner, and capture the issue before the team starts triage.'
  },
  {
    id: 'search',
    selector: '[data-tour-id="tour-search"]',
    title: 'Search the case files',
    body: 'The top search box helps you hunt for bug IDs, tags, or product names across the workspace in seconds.'
  },
  {
    id: 'nav',
    selector: '[data-tour-id="tour-nav-overview"]',
    title: 'Switch into each workspace view',
    body: 'The left sidebar is your command center for Overview, Bugs, Board, AI Assistant, GitHub Sync, and more.'
  },
  {
    id: 'filters',
    selector: '[data-tour-id="tour-product-filters"]',
    title: 'Filter by project or team',
    body: 'Use the product chips to narrow the board to a specific app or service without losing the full incident picture.'
  },
  {
    id: 'metrics',
    selector: '[data-tour-id="tour-metrics"]',
    title: 'Track the health of the app',
    body: 'These metric cards reveal open bugs, resolved issues, AI suggestions, and sprint momentum at a glance.'
  },
  {
    id: 'assistant',
    selector: '[data-tour-id="tour-ai-assistant"]',
    title: 'Ask the AI detective',
    body: 'The AI assistant helps explain root causes, suggest triage flow, and prioritize what the team should investigate next.'
  }
] as const;

export default function DemoTour({
  open,
  onComplete,
}: {
  open: boolean;
  onComplete: () => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!open) return;
    setStepIndex(0);
  }, [open]);

  const currentStep = TOUR_STEPS[stepIndex];

  useEffect(() => {
    if (!open || !currentStep) return;

    const updateHighlight = () => {
      const element = document.querySelector(currentStep.selector) as HTMLElement | null;
      setHighlightRect(element ? element.getBoundingClientRect() : null);
    };

    updateHighlight();
    window.addEventListener('resize', updateHighlight);
    window.addEventListener('scroll', updateHighlight, true);

    return () => {
      window.removeEventListener('resize', updateHighlight);
      window.removeEventListener('scroll', updateHighlight, true);
    };
  }, [open, currentStep]);

  const bubblePosition = useMemo(() => {
    if (!highlightRect) {
      return {
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const width = 320;
    const maxLeft = window.innerWidth - width - 20;
    const left = Math.min(Math.max(highlightRect.right + 18, 20), maxLeft);
    const isFourthStep = stepIndex === 3;
    const topOffset = isFourthStep ? -22 : 0;
    const top = Math.min(Math.max(highlightRect.top - 8 + topOffset, 20), window.innerHeight - 180);

    return {
      left: `${left}px`,
      top: `${top}px`,
      transform: 'none'
    };
  }, [highlightRect, stepIndex]);

  if (!open || !currentStep) return null;

  const isLastStep = stepIndex === TOUR_STEPS.length - 1;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(8, 10, 18, 0.36)',
        pointerEvents: 'none'
      }}
    >
      {highlightRect && (
        <div
          style={{
            position: 'absolute',
            left: highlightRect.left - 10,
            top: highlightRect.top - 10,
            width: highlightRect.width + 20,
            height: highlightRect.height + 20,
            border: '3px solid #FBBF24',
            borderRadius: '14px',
            boxShadow: '0 0 0 9999px rgba(8, 10, 18, 0.55), 0 0 28px rgba(251, 191, 36, 0.6)',
            pointerEvents: 'none'
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          ...bubblePosition,
          width: 'min(320px, calc(100vw - 32px))',
          background: '#111827',
          border: '2px solid #FBBF24',
          borderRadius: '16px',
          boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
          padding: '18px 18px 14px',
          color: '#F8FAFC',
          pointerEvents: 'auto'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '10px'
          }}
        >
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FBBF24', fontWeight: 800 }}>
            Live demo tour
          </div>
          <button
            type="button"
            onClick={onComplete}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#E5E7EB',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 700
            }}
          >
            Skip
          </button>
        </div>

        <div style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>{currentStep.title}</div>
        <div style={{ fontSize: '0.95rem', lineHeight: 1.5, color: '#D1D5DB', marginBottom: '18px' }}>{currentStep.body}</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
            {stepIndex + 1} / {TOUR_STEPS.length}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={stepIndex === 0}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#F3F4F6',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: stepIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: stepIndex === 0 ? 0.45 : 1
              }}
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                if (isLastStep) {
                  onComplete();
                  return;
                }
                setStepIndex((prev) => prev + 1);
              }}
              style={{
                background: '#FBBF24',
                border: '2px solid #111827',
                color: '#111827',
                borderRadius: '8px',
                padding: '8px 14px',
                cursor: 'pointer',
                fontWeight: 800,
                boxShadow: '3px 3px 0 rgba(0,0,0,0.9)'
              }}
            >
              {isLastStep ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
