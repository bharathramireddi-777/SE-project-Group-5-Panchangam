import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  ALL_EVENTS,
  TOTAL_MAHAYUGA_YEARS,
  YUGAS,
  YugaEvent,
  formatYears,
} from '../data/yugas';

interface EventPopupModalProps {
  event: YugaEvent | null;
  onClose: () => void;
  onSelectEvent: (event: YugaEvent) => void;
}

export const EventPopupModal: React.FC<EventPopupModalProps> = ({
  event,
  onClose,
  onSelectEvent,
}) => {
  useEffect(() => {
    if (!event) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        const idx = ALL_EVENTS.findIndex((item) => item.id === event.id);
        const next = ALL_EVENTS[(idx + 1) % ALL_EVENTS.length];
        onSelectEvent(next);
      } else if (e.key === 'ArrowLeft') {
        const idx = ALL_EVENTS.findIndex((item) => item.id === event.id);
        const prev = ALL_EVENTS[(idx - 1 + ALL_EVENTS.length) % ALL_EVENTS.length];
        onSelectEvent(prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [event, onClose, onSelectEvent]);

  const yuga = event ? YUGAS.find((y) => y.id === event.yugaId) : null;
  const currentIndex = event ? ALL_EVENTS.findIndex((item) => item.id === event.id) : -1;
  const prevEvent =
    currentIndex >= 0
      ? ALL_EVENTS[(currentIndex - 1 + ALL_EVENTS.length) % ALL_EVENTS.length]
      : null;
  const nextEvent =
    currentIndex >= 0 ? ALL_EVENTS[(currentIndex + 1) % ALL_EVENTS.length] : null;

  return (
    <AnimatePresence>
      {event && yuga && (
        <motion.div
          key="event-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-popup-title"
        >
          <motion.article
            key={event.id}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{ borderColor: yuga.accentBorderHex }}
            className="relative w-full max-w-2xl rounded-xl border bg-zinc-950 p-6 sm:p-8 shadow-2xl text-zinc-100"
          >
            {/* Top Metadata & Close */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono-tabular text-zinc-400">
                <span className="font-semibold" style={{ color: yuga.accentHex }}>
                  {yuga.name}
                </span>
                <span aria-hidden="true">·</span>
                <span>{event.epochPhase}</span>
                <span aria-hidden="true">·</span>
                <span>{event.wheelAngleDeg.toFixed(1)}°</span>
                <span aria-hidden="true">·</span>
                <span>
                  Year {formatYears(event.mahayugaYear)} / {formatYears(TOTAL_MAHAYUGA_YEARS)}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close event details"
                className="p-2 -mr-2 -mt-2 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Event Title & Sanskrit Term */}
            <header className="mt-4">
              <p className="text-sm text-zinc-400 font-medium">{event.sanskritTerm}</p>
              <h2
                id="event-popup-title"
                className="mt-1 text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight text-balance"
              >
                {event.title}
              </h2>
              <p className="mt-2 text-xs text-zinc-400">
                {event.figureOrAvatar} <span className="mx-1.5 text-zinc-600">/</span>{' '}
                {event.sourceTradition}
              </p>
            </header>

            <div className="my-5 h-px bg-zinc-800/80" />

            {/* Narrative & Significance */}
            <div className="space-y-4">
              <p className="text-[15px] leading-relaxed text-zinc-200">{event.summary}</p>

              <div className="rounded-lg bg-black border border-zinc-800/90 p-4">
                <h3 className="text-xs font-semibold text-zinc-300 mb-1.5">
                  Cosmological Significance
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">{event.significance}</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-zinc-300 mb-2">
                  Key Timeline Milestones
                </h3>
                <ul className="space-y-1.5">
                  {event.highlights.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-zinc-300 leading-snug"
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: yuga.accentHex }}
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => prevEvent && onSelectEvent(prevEvent)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-black border border-zinc-800 hover:border-zinc-700 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous Event
              </button>

              <span className="text-xs font-mono-tabular text-zinc-500">
                {currentIndex + 1} / {ALL_EVENTS.length}
              </span>

              <button
                type="button"
                onClick={() => nextEvent && onSelectEvent(nextEvent)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-black border border-zinc-800 hover:border-zinc-700 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Next Event
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
