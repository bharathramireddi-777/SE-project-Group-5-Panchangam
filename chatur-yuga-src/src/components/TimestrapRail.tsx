import React, { useMemo, useRef, useState } from 'react';
import { GripHorizontal, ArrowDown } from 'lucide-react';
import {
  ALL_EVENTS,
  TOTAL_MAHAYUGA_YEARS,
  YUGAS,
  YugaDefinition,
  YugaEvent,
  formatYears,
  getMahayugaYearAtWheelAngle,
  getNeedleWheelAngle,
  getYugaAtWheelAngle,
} from '../data/yugas';

interface TimestrapRailProps {
  rotationDeg: number;
  onScrubToAngle: (wheelAngleDeg: number) => void;
  selectedEventId: string | null;
  onSelectEvent: (event: YugaEvent) => void;
}

const PULL_DOWN_THRESHOLD_PX = 22;
const MAX_PULL_DOWN_PX = 48;

export const TimestrapRail: React.FC<TimestrapRailProps> = ({
  rotationDeg,
  onScrubToAngle,
  selectedEventId,
  onSelectEvent,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [scopeMode, setScopeMode] = useState<'active-yuga' | 'full-cycle'>('active-yuga');
  const [scrubbing, setScrubbing] = useState(false);

  // State for pulling down an event card/tab from the timestrap
  const [pullTabState, setPullTabState] = useState<{
    eventId: string;
    pullY: number;
    ready: boolean;
  } | null>(null);

  const tabDragRef = useRef<{
    event: YugaEvent | null;
    pointerId: number | null;
    startY: number;
    startX: number;
    maxMoved: number;
    ready: boolean;
  }>({
    event: null,
    pointerId: null,
    startY: 0,
    startX: 0,
    maxMoved: 0,
    ready: false,
  });

  const needleAngle = getNeedleWheelAngle(rotationDeg);
  const activeYuga: YugaDefinition = useMemo(
    () => getYugaAtWheelAngle(needleAngle),
    [needleAngle]
  );
  const currentMahayugaYear = getMahayugaYearAtWheelAngle(needleAngle);
  const progressPct = (needleAngle / 360) * 100;

  const updateAngleFromPointer = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const clamped = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onScrubToAngle(clamped * 360);
  };

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setScrubbing(true);
    updateAngleFromPointer(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrubbing) return;
    updateAngleFromPointer(e.clientX);
  };

  const handleTrackPointerUp = () => {
    setScrubbing(false);
  };

  // Pull-down event strap handlers
  const handleEventTabPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    ev: YugaEvent
  ) => {
    e.stopPropagation();
    tabDragRef.current = {
      event: ev,
      pointerId: e.pointerId,
      startY: e.clientY,
      startX: e.clientX,
      maxMoved: 0,
      ready: false,
    };
    setPullTabState({ eventId: ev.id, pullY: 0, ready: false });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleEventTabPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = tabDragRef.current;
    if (!drag.event || drag.pointerId !== e.pointerId) return;
    const dy = Math.max(0, Math.min(MAX_PULL_DOWN_PX, e.clientY - drag.startY));
    const moved = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY);
    drag.maxMoved = Math.max(drag.maxMoved, moved);
    if (dy >= PULL_DOWN_THRESHOLD_PX) {
      drag.ready = true;
    }
    setPullTabState({ eventId: drag.event.id, pullY: dy, ready: drag.ready });
  };

  const handleEventTabPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = tabDragRef.current;
    if (!drag.event || drag.pointerId !== e.pointerId) return;
    const ev = drag.event;
    const wasTap = drag.maxMoved < 7;
    const wasPulled = drag.ready;

    tabDragRef.current = {
      event: null,
      pointerId: null,
      startY: 0,
      startX: 0,
      maxMoved: 0,
      ready: false,
    };
    setPullTabState(null);

    if (wasPulled || wasTap) {
      onSelectEvent(ev);
    }
  };

  const visibleEvents = scopeMode === 'active-yuga' ? activeYuga.events : ALL_EVENTS;

  return (
    <section
      aria-label="Proportional Mahayuga Timestrap"
      className="w-full rounded-xl bg-zinc-950/90 border border-zinc-800/90 p-5"
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-sm font-semibold text-zinc-100">
            Proportional Timestrap
          </h2>
          <span className="text-xs text-zinc-500 font-mono-tabular">
            Year {formatYears(currentMahayugaYear)} / {formatYears(TOTAL_MAHAYUGA_YEARS)}
          </span>
          <span className="text-xs text-zinc-600" aria-hidden="true">·</span>
          <span className="text-xs font-medium" style={{ color: activeYuga.accentHex }}>
            {activeYuga.name} ({activeYuga.percentage}%)
          </span>
        </div>

        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-black border border-zinc-800 rounded-lg">
          <button
            type="button"
            onClick={() => setScopeMode('active-yuga')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              scopeMode === 'active-yuga'
                ? 'bg-zinc-900 text-white border border-zinc-700/80'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {activeYuga.name} Sub-Timeline ({activeYuga.events.length})
          </button>
          <button
            type="button"
            onClick={() => setScopeMode('full-cycle')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              scopeMode === 'full-cycle'
                ? 'bg-zinc-900 text-white border border-zinc-700/80'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Full Cycle (16)
          </button>
        </div>
      </div>

      {/* 4:3:2:1 Proportional Interactive Strap Bar */}
      <div
        ref={trackRef}
        onPointerDown={handleTrackPointerDown}
        onPointerMove={handleTrackPointerMove}
        onPointerUp={handleTrackPointerUp}
        onPointerCancel={handleTrackPointerUp}
        className="relative w-full h-14 rounded-lg border border-zinc-800 bg-black overflow-visible cursor-ew-resize touch-none select-none"
        role="slider"
        aria-label="Mahayuga timeline position"
        aria-valuemin={0}
        aria-valuemax={TOTAL_MAHAYUGA_YEARS}
        aria-valuenow={currentMahayugaYear}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            onScrubToAngle((needleAngle + 9) % 360);
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            onScrubToAngle((needleAngle - 9 + 360) % 360);
          }
        }}
      >
        <div className="flex w-full h-full rounded-lg overflow-hidden">
          {YUGAS.map((yuga) => {
            const isActive = yuga.id === activeYuga.id;
            return (
              <div
                key={yuga.id}
                style={{
                  width: `${yuga.percentage}%`,
                  backgroundColor: isActive ? yuga.accentSoftHex : 'rgba(24,24,27,0.45)',
                  borderRight: yuga.id === 'kali' ? 'none' : '1px solid rgba(255,255,255,0.12)',
                }}
                className="relative h-full flex flex-col justify-center px-2.5 transition-colors duration-150 overflow-hidden"
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className="text-xs font-semibold truncate"
                    style={{ color: isActive ? yuga.accentHex : '#D4D4D8' }}
                  >
                    {yuga.id === 'kali' ? 'Kali' : yuga.name}
                  </span>
                  <span className="hidden sm:inline text-[11px] font-mono-tabular text-zinc-400 shrink-0">
                    {yuga.ratio}:10
                  </span>
                </div>
                <span className="text-[11px] font-mono-tabular text-zinc-500 truncate">
                  {yuga.percentage}% · {formatYears(yuga.humanYears)}y
                </span>
              </div>
            );
          })}
        </div>

        {/* Event Position Pins along the Top Edge of the Timestrap */}
        {ALL_EVENTS.map((ev) => {
          const leftPct = (ev.wheelAngleDeg / 360) * 100;
          const yuga = YUGAS.find((y) => y.id === ev.yugaId)!;
          const isSelected = selectedEventId === ev.id;
          return (
            <button
              key={`pin-${ev.id}`}
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onSelectEvent(ev);
              }}
              style={{ left: `${leftPct}%` }}
              title={`${ev.title} (${formatYears(ev.mahayugaYear)} yrs)`}
              aria-label={`Open event ${ev.title}`}
              className="absolute -top-1.5 -translate-x-1/2 w-3 h-3 rounded-full border border-black transition-transform hover:scale-125 cursor-pointer z-10"
            >
              <span
                className="block w-full h-full rounded-full"
                style={{
                  backgroundColor: isSelected ? '#FFFFFF' : yuga.accentHex,
                  boxShadow: isSelected ? `0 0 10px ${yuga.accentHex}` : 'none',
                }}
              />
            </button>
          );
        })}

        {/* Draggable Playhead / Strap Thumb */}
        <div
          style={{ left: `${progressPct}%` }}
          className="pointer-events-none absolute -top-2 -bottom-2 -translate-x-1/2 flex flex-col items-center z-20"
        >
          <div
            className="w-5 h-5 rounded bg-zinc-950 border-2 flex items-center justify-center shadow-md"
            style={{ borderColor: activeYuga.accentHex }}
          >
            <GripHorizontal className="w-3 h-3 text-zinc-200" />
          </div>
          <div
            className="w-0.5 flex-1"
            style={{ backgroundColor: activeYuga.accentHex }}
          />
        </div>
      </div>

      {/* Pull-Down Event Straps Grid */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-zinc-400">
            Sub-Timeline Event Straps — grab and pull any strap down (or click) to pop open details
          </p>
          <span className="text-[11px] font-mono-tabular text-zinc-500">
            {visibleEvents.length} Events
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {visibleEvents.map((ev) => {
            const yuga = YUGAS.find((y) => y.id === ev.yugaId)!;
            const isSelected = selectedEventId === ev.id;
            const isPulling = pullTabState?.eventId === ev.id;
            const pullY = isPulling ? pullTabState.pullY : 0;
            const ready = isPulling && pullTabState.ready;

            return (
              <div key={ev.id} className="relative pt-2">
                {/* Expanding tether strip visible when pulled downward */}
                <div
                  aria-hidden="true"
                  className="mx-auto w-0.5 transition-all duration-75"
                  style={{
                    height: `${8 + pullY}px`,
                    backgroundColor: ready ? '#FFFFFF' : yuga.accentHex,
                    opacity: isPulling ? 0.95 : 0.4,
                  }}
                />

                {/* Pullable Strap Card */}
                <div
                  onPointerDown={(e) => handleEventTabPointerDown(e, ev)}
                  onPointerMove={handleEventTabPointerMove}
                  onPointerUp={handleEventTabPointerUp}
                  onPointerCancel={handleEventTabPointerUp}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectEvent(ev);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Pull down or open ${ev.title}`}
                  style={{
                    transform: `translateY(${pullY}px)`,
                    borderColor: ready
                      ? '#FFFFFF'
                      : isSelected
                      ? yuga.accentHex
                      : 'rgba(63,63,70,0.8)',
                  }}
                  className={`group relative rounded-lg border bg-black px-3.5 py-3 text-left transition-colors cursor-grab active:cursor-grabbing select-none touch-none ${
                    isPulling ? '' : 'duration-150 hover:border-zinc-500'
                  }`}
                >
                  {/* Unboxed Typographic Metadata */}
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tabular text-zinc-400">
                    <span style={{ color: yuga.accentHex }}>{yuga.name}</span>
                    <span>Yr {formatYears(ev.mahayugaYear)}</span>
                  </div>

                  <h3 className="mt-1.5 text-sm font-medium text-zinc-100 leading-snug line-clamp-2">
                    {ev.title}
                  </h3>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="truncate">{ev.epochPhase}</span>
                    <span className="inline-flex items-center gap-1 text-zinc-400 group-hover:text-zinc-200 shrink-0">
                      <ArrowDown className="w-3 h-3" />
                      {ready ? 'Release' : 'Pull'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
