import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ALL_EVENTS,
  DEFAULT_WHEEL_BG,
  YUGAS,
  YugaDefinition,
  YugaEvent,
  getNeedleWheelAngle,
} from './data/yugas';
import { YugaWheel } from './components/YugaWheel';
import { TimestrapRail } from './components/TimestrapRail';
import { YugaOverviewPanel } from './components/YugaOverviewPanel';
import { EventPopupModal } from './components/EventPopupModal';

export default function App() {
  // Start aligned slightly into Satya Yuga (~22° clockwise under needle)
  const [rotationDeg, setRotationDeg] = useState<number>(-22);
  const [wheelBgUrl, setWheelBgUrl] = useState<string>(DEFAULT_WHEEL_BG);
  const [isAutoOrbit, setIsAutoOrbit] = useState<boolean>(false);
  const [popupEvent, setPopupEvent] = useState<YugaEvent | null>(null);

  const animRafRef = useRef<number | null>(null);
  const prefersReducedMotion = useRef<boolean>(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
  }, []);

  const stopAnimatedSpin = useCallback(() => {
    if (animRafRef.current !== null) {
      cancelAnimationFrame(animRafRef.current);
      animRafRef.current = null;
    }
  }, []);

  // Gentle auto-orbit loop when toggled on
  useEffect(() => {
    if (!isAutoOrbit || prefersReducedMotion.current) return;
    let lastTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;
      // ~7.5 degrees per second
      setRotationDeg((prev) => prev - (dt / 1000) * 7.5);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isAutoOrbit]);

  useEffect(() => {
    return () => stopAnimatedSpin();
  }, [stopAnimatedSpin]);

  // Smoothly animate wheel rotation to a target wheel-angle under the 12 o'clock needle
  const animateToWheelAngle = useCallback(
    (targetWheelAngleDeg: number, extraFullTurns = 0, onComplete?: () => void) => {
      stopAnimatedSpin();
      setIsAutoOrbit(false);

      const currentWheelAngle = getNeedleWheelAngle(rotationDeg);
      let deltaWheelAngle = targetWheelAngleDeg - currentWheelAngle;
      if (extraFullTurns > 0) {
        // Spin forward through the cycle
        if (deltaWheelAngle <= 0) deltaWheelAngle += 360;
        deltaWheelAngle += extraFullTurns * 360;
      } else {
        // Shortest rotational path
        if (deltaWheelAngle > 180) deltaWheelAngle -= 360;
        if (deltaWheelAngle < -180) deltaWheelAngle += 360;
      }

      // Visual rotation moves counter to needle angle
      const startRotation = rotationDeg;
      const targetRotation = startRotation - deltaWheelAngle;

      if (prefersReducedMotion.current) {
        setRotationDeg(targetRotation);
        onComplete?.();
        return;
      }

      const durationMs = extraFullTurns > 0 ? 1850 : 620;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / durationMs);
        // Quintic ease-out for heavy astronomical wheel settle
        const eased = 1 - Math.pow(1 - t, 4);
        setRotationDeg(startRotation + (targetRotation - startRotation) * eased);

        if (t < 1) {
          animRafRef.current = requestAnimationFrame(step);
        } else {
          animRafRef.current = null;
          onComplete?.();
        }
      };

      animRafRef.current = requestAnimationFrame(step);
    },
    [rotationDeg, stopAnimatedSpin]
  );

  const handleSpinImpulse = useCallback(() => {
    // Pick a random event across the Mahayuga proportionally and spin 2 full turns to land on it
    const randomEvent = ALL_EVENTS[Math.floor(Math.random() * ALL_EVENTS.length)];
    animateToWheelAngle(randomEvent.wheelAngleDeg, 2, () => {
      setPopupEvent(randomEvent);
    });
  }, [animateToWheelAngle]);

  const handleJumpToYuga = useCallback(
    (yuga: YugaDefinition) => {
      const midpoint = (yuga.startAngle + yuga.endAngle) / 2;
      animateToWheelAngle(midpoint, 0);
    },
    [animateToWheelAngle]
  );

  const handleScrubToAngle = useCallback(
    (wheelAngleDeg: number) => {
      stopAnimatedSpin();
      setIsAutoOrbit(false);
      setRotationDeg(-wheelAngleDeg);
    },
    [stopAnimatedSpin]
  );

  const handleSelectEvent = useCallback(
    (ev: YugaEvent) => {
      animateToWheelAngle(ev.wheelAngleDeg, 0);
      setPopupEvent(ev);
    },
    [animateToWheelAngle]
  );

  const currentNeedleAngle = getNeedleWheelAngle(rotationDeg);

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col">
      {/* Three-Zone Top Bar */}
      <header className="w-full border-b border-zinc-900 bg-black/95 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Wordmark */}
          <div className="flex items-center gap-4 shrink-0">
            <a
              href="/"
              className="text-xs font-medium text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 rounded-md px-2.5 py-1.5 transition-colors whitespace-nowrap"
            >
              ← VedicAstro
            </a>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                animateToWheelAngle(0, 0);
              }}
              className="font-display text-lg font-semibold tracking-wide text-white whitespace-nowrap"
            >
              Chatur-Yuga Wheel
            </a>
          </div>

          {/* Zone 2: 4 Single-line Navigation Jump Links */}
          <nav
            aria-label="Jump to Yuga"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400"
          >
            {YUGAS.map((yuga) => {
              const active =
                currentNeedleAngle >= yuga.startAngle &&
                currentNeedleAngle < yuga.endAngle;
              return (
                <button
                  key={yuga.id}
                  type="button"
                  onClick={() => handleJumpToYuga(yuga)}
                  className={`transition-colors cursor-pointer whitespace-nowrap shrink-0 pb-0.5 border-b ${
                    active
                      ? 'text-white border-amber-400'
                      : 'border-transparent hover:text-zinc-100'
                  }`}
                >
                  {yuga.name}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleSpinImpulse}
              className="px-4 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Spin Cycle
            </button>
          </div>
        </div>
      </header>

      {/* Main Cosmic Simulation Workspace on Pure Black */}
      <main id="top" className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight text-balance">
              The Four Yugas in 4 : 3 : 2 : 1 Cosmic Proportion
            </h1>
            <p className="mt-1 text-sm text-zinc-400 max-w-2xl">
              Spin the wheel directly or scrub the proportional timestrap below. Pull any event strap outward from the wheel—or downward from the timeline—to open its epoch record.
            </p>
          </div>
          <div className="text-xs font-mono-tabular text-zinc-500 whitespace-nowrap">
            144° Satya · 108° Treta · 72° Dvapara · 36° Kali
          </div>
        </div>

        {/* Two-Zone Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)] gap-8 items-start">
          {/* Left Stage: Spinning Proportional Wheel */}
          <div className="flex items-center justify-center rounded-2xl bg-black border border-zinc-900 p-3 sm:p-6">
            <YugaWheel
              rotationDeg={rotationDeg}
              onRotationChange={(next) => {
                stopAnimatedSpin();
                setRotationDeg(next);
              }}
              wheelBgUrl={wheelBgUrl}
              selectedEventId={popupEvent?.id ?? null}
              onSelectEvent={handleSelectEvent}
              isAutoOrbit={isAutoOrbit}
              onToggleAutoOrbit={() => setIsAutoOrbit((v) => !v)}
              onSpinImpulse={handleSpinImpulse}
            />
          </div>

          {/* Right Stage: Active Yuga & Ratio Concept Deck */}
          <YugaOverviewPanel
            rotationDeg={rotationDeg}
            onJumpToYuga={handleJumpToYuga}
            onSelectEvent={handleSelectEvent}
            selectedEventId={popupEvent?.id ?? null}
            wheelBgUrl={wheelBgUrl}
            onWheelBgChange={setWheelBgUrl}
          />
        </div>

        {/* Full-Width Proportional Pullable Timestrap */}
        <div className="mt-8">
          <TimestrapRail
            rotationDeg={rotationDeg}
            onScrubToAngle={handleScrubToAngle}
            selectedEventId={popupEvent?.id ?? null}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      </main>

      {/* Event Details Pop-Up Modal */}
      <EventPopupModal
        event={popupEvent}
        onClose={() => setPopupEvent(null)}
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
}
