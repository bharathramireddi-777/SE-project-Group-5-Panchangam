import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RotateCw, Play, Pause } from 'lucide-react';
import {
  YUGAS,
  YugaDefinition,
  YugaEvent,
  getNeedleWheelAngle,
  getYugaAtWheelAngle,
} from '../data/yugas';

interface YugaWheelProps {
  rotationDeg: number;
  onRotationChange: (nextDeg: number | ((prev: number) => number)) => void;
  wheelBgUrl: string;
  selectedEventId: string | null;
  onSelectEvent: (event: YugaEvent) => void;
  isAutoOrbit: boolean;
  onToggleAutoOrbit: () => void;
  onSpinImpulse: () => void;
}

const VIEWBOX_HALF = 350;
const WHEEL_RADIUS = 242;
const INNER_CORE_RADIUS = 72;
const SUBTIMELINE_RADIUS = 220;
const STRAP_BASE_RADIUS = 258;
const PULL_TRIGGER_PX = 26;
const MAX_PULL_PX = 56;

function polarToCartesian(radius: number, angleDegClockwiseFromTop: number) {
  const rad = ((angleDegClockwiseFromTop - 90) * Math.PI) / 180;
  return {
    x: radius * Math.cos(rad),
    y: radius * Math.sin(rad),
  };
}

function describeArcWedge(
  innerR: number,
  outerR: number,
  startDeg: number,
  endDeg: number
): string {
  const p1 = polarToCartesian(outerR, startDeg);
  const p2 = polarToCartesian(outerR, endDeg);
  const p3 = polarToCartesian(innerR, endDeg);
  const p4 = polarToCartesian(innerR, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;

  return [
    `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

function describeArcPath(radius: number, startDeg: number, endDeg: number): string {
  const start = polarToCartesian(radius, startDeg);
  const end = polarToCartesian(radius, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

export const YugaWheel: React.FC<YugaWheelProps> = ({
  rotationDeg,
  onRotationChange,
  wheelBgUrl,
  selectedEventId,
  onSelectEvent,
  isAutoOrbit,
  onToggleAutoOrbit,
  onSpinImpulse,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  // Wheel drag-to-spin state
  const spinDragRef = useRef<{
    active: boolean;
    pointerId: number | null;
    lastAngle: number;
    angularVelocity: number;
    lastTimestamp: number;
  }>({
    active: false,
    pointerId: null,
    lastAngle: 0,
    angularVelocity: 0,
    lastTimestamp: 0,
  });

  // Radial pull-to-pop state for individual event straps
  const [pullState, setPullState] = useState<{
    eventId: string;
    pullPx: number;
    triggered: boolean;
  } | null>(null);

  const pullDragRef = useRef<{
    event: YugaEvent | null;
    pointerId: number | null;
    startDist: number;
    startClientX: number;
    startClientY: number;
    maxMovedPx: number;
    triggered: boolean;
  }>({
    event: null,
    pointerId: null,
    startDist: 0,
    startClientX: 0,
    startClientY: 0,
    maxMovedPx: 0,
    triggered: false,
  });

  useEffect(() => {
    setImageFailed(false);
  }, [wheelBgUrl]);

  // Inertia animation loop after releasing a manual spin drag
  const inertiaRafRef = useRef<number | null>(null);

  const stopInertia = useCallback(() => {
    if (inertiaRafRef.current !== null) {
      cancelAnimationFrame(inertiaRafRef.current);
      inertiaRafRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopInertia();
  }, [stopInertia]);

  const getPointerAngleFromCenter = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return { angle: 0, dist: 0 };
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const dist = Math.hypot(dx, dy);
    return { angle, dist };
  }, []);

  // Wheel surface pointer handlers
  const handleWheelPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (pullDragRef.current.event) return;
    stopInertia();
    const { angle } = getPointerAngleFromCenter(e.clientX, e.clientY);
    spinDragRef.current = {
      active: true,
      pointerId: e.pointerId,
      lastAngle: angle,
      angularVelocity: 0,
      lastTimestamp: performance.now(),
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleWheelPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!spinDragRef.current.active || spinDragRef.current.pointerId !== e.pointerId) return;
    const { angle } = getPointerAngleFromCenter(e.clientX, e.clientY);
    let delta = angle - spinDragRef.current.lastAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    const now = performance.now();
    const dt = Math.max(8, now - spinDragRef.current.lastTimestamp);
    const instantVel = (delta / dt) * 16.67;

    spinDragRef.current.lastAngle = angle;
    spinDragRef.current.lastTimestamp = now;
    spinDragRef.current.angularVelocity = spinDragRef.current.angularVelocity * 0.45 + instantVel * 0.55;

    onRotationChange((prev) => prev + delta);
  };

  const handleWheelPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!spinDragRef.current.active || spinDragRef.current.pointerId !== e.pointerId) return;
    spinDragRef.current.active = false;
    spinDragRef.current.pointerId = null;

    let vel = spinDragRef.current.angularVelocity;
    if (Math.abs(vel) > 0.25) {
      const step = () => {
        vel *= 0.955;
        if (Math.abs(vel) < 0.04) {
          inertiaRafRef.current = null;
          return;
        }
        onRotationChange((prev) => prev + vel);
        inertiaRafRef.current = requestAnimationFrame(step);
      };
      inertiaRafRef.current = requestAnimationFrame(step);
    }
  };

  // Event strap radial pull handlers
  const handleStrapPointerDown = (
    e: React.PointerEvent<SVGGElement>,
    eventItem: YugaEvent
  ) => {
    e.stopPropagation();
    stopInertia();
    const { dist } = getPointerAngleFromCenter(e.clientX, e.clientY);
    pullDragRef.current = {
      event: eventItem,
      pointerId: e.pointerId,
      startDist: dist,
      startClientX: e.clientX,
      startClientY: e.clientY,
      maxMovedPx: 0,
      triggered: false,
    };
    setPullState({ eventId: eventItem.id, pullPx: 0, triggered: false });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleStrapPointerMove = (e: React.PointerEvent<SVGGElement>) => {
    const drag = pullDragRef.current;
    if (!drag.event || drag.pointerId !== e.pointerId) return;
    e.stopPropagation();

    const { dist } = getPointerAngleFromCenter(e.clientX, e.clientY);
    const radialPull = Math.max(0, Math.min(MAX_PULL_PX, dist - drag.startDist));
    const pointerMoveDist = Math.hypot(
      e.clientX - drag.startClientX,
      e.clientY - drag.startClientY
    );
    drag.maxMovedPx = Math.max(drag.maxMovedPx, pointerMoveDist);

    const isTriggered = radialPull >= PULL_TRIGGER_PX;
    if (isTriggered && !drag.triggered) {
      drag.triggered = true;
    }

    setPullState({
      eventId: drag.event.id,
      pullPx: radialPull,
      triggered: drag.triggered,
    });
  };

  const handleStrapPointerUp = (e: React.PointerEvent<SVGGElement>) => {
    const drag = pullDragRef.current;
    if (!drag.event || drag.pointerId !== e.pointerId) return;
    e.stopPropagation();

    const targetEvent = drag.event;
    const wasTap = drag.maxMovedPx < 7;
    const wasPulled = drag.triggered;

    pullDragRef.current = {
      event: null,
      pointerId: null,
      startDist: 0,
      startClientX: 0,
      startClientY: 0,
      maxMovedPx: 0,
      triggered: false,
    };
    setPullState(null);

    if (wasPulled || wasTap) {
      onSelectEvent(targetEvent);
    }
  };

  const needleAngle = getNeedleWheelAngle(rotationDeg);
  const activeYuga: YugaDefinition = useMemo(
    () => getYugaAtWheelAngle(needleAngle),
    [needleAngle]
  );

  // Subtle tick marks proportional to every 108,000 years (1/40th of Mahayuga = 9°)
  const ticks = useMemo(() => {
    const list: Array<{ angle: number; major: boolean }> = [];
    for (let i = 0; i < 40; i++) {
      const angle = i * 9;
      const isYugaBoundary =
        angle === 0 || angle === 144 || angle === 252 || angle === 324;
      list.push({ angle, major: isYugaBoundary || i % 2 === 0 });
    }
    return list;
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center w-full select-none">
      {/* Main Wheel Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[650px] aspect-square flex items-center justify-center"
      >
        {/* Fixed Top Reading Needle (Zenith Pointer) */}
        <div
          className="pointer-events-none absolute top-[6.5%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
          aria-hidden="true"
        >
          <div className="px-2.5 py-0.5 bg-black/90 border border-zinc-700/80 rounded text-[11px] font-mono-tabular tracking-wider text-zinc-200 shadow-lg">
            {needleAngle.toFixed(1)}°
          </div>
          <svg width="20" height="26" viewBox="0 0 20 26" className="-mt-0.5 drop-shadow-[0_0_8px_rgba(250,204,21,0.55)]">
            <polygon
              points="10,25 2,4 18,4"
              fill={activeYuga.accentHex}
              stroke="#000000"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Interactive SVG Wheel */}
        <svg
          viewBox={`${-VIEWBOX_HALF} ${-VIEWBOX_HALF} ${VIEWBOX_HALF * 2} ${VIEWBOX_HALF * 2}`}
          className="w-full h-full touch-none cursor-grab active:cursor-grabbing overflow-visible"
          onPointerDown={handleWheelPointerDown}
          onPointerMove={handleWheelPointerMove}
          onPointerUp={handleWheelPointerUp}
          onPointerCancel={handleWheelPointerUp}
          role="application"
          aria-label="Spinning wheel of the Four Yugas scaled in 4:3:2:1 ratios"
        >
          <defs>
            <clipPath id="wheel-disc-clip">
              <circle cx="0" cy="0" r={WHEEL_RADIUS} />
            </clipPath>

            <radialGradient id="wheel-scrim" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.62" />
              <stop offset="55%" stopColor="#000000" stopOpacity="0.34" />
              <stop offset="88%" stopColor="#000000" stopOpacity="0.52" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.78" />
            </radialGradient>

            <radialGradient id="fallback-mandala" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#292011" />
              <stop offset="55%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#09090b" />
            </radialGradient>

            {YUGAS.map((yuga) => (
              <path
                key={`arc-label-path-${yuga.id}`}
                id={`arc-label-${yuga.id}`}
                d={describeArcPath(192, yuga.startAngle + 3, yuga.endAngle - 3)}
              />
            ))}
          </defs>

          {/* Outer Black Orbit Hairline Guides (stationary subtle reference) */}
          <circle
            cx="0"
            cy="0"
            r={STRAP_BASE_RADIUS + 14}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
            strokeDasharray="3 6"
          />

          {/* Rotating Wheel Group */}
          <g transform={`rotate(${rotationDeg})`}>
            {/* Wheel Background Image (Circular Clipped) */}
            <g clipPath="url(#wheel-disc-clip)">
              <circle cx="0" cy="0" r={WHEEL_RADIUS} fill="url(#fallback-mandala)" />
              {!imageFailed && (
                <image
                  href={wheelBgUrl}
                  x={-WHEEL_RADIUS * 1.12}
                  y={-WHEEL_RADIUS * 1.12}
                  width={WHEEL_RADIUS * 2.24}
                  height={WHEEL_RADIUS * 2.24}
                  preserveAspectRatio="xMidYMid slice"
                  onError={() => setImageFailed(true)}
                  opacity="0.9"
                />
              )}
              <circle cx="0" cy="0" r={WHEEL_RADIUS} fill="url(#wheel-scrim)" />
            </g>

            {/* Proportional 4:3:2:1 Yuga Wedges */}
            {YUGAS.map((yuga) => {
              const isActive = activeYuga.id === yuga.id;
              const midAngle = (yuga.startAngle + yuga.endAngle) / 2;
              const ratioPos = polarToCartesian(150, midAngle);

              return (
                <g key={yuga.id}>
                  {/* Proportional Sector Tint */}
                  <path
                    d={describeArcWedge(
                      INNER_CORE_RADIUS,
                      WHEEL_RADIUS,
                      yuga.startAngle,
                      yuga.endAngle
                    )}
                    fill={yuga.accentHex}
                    fillOpacity={isActive ? 0.17 : 0.07}
                    stroke={yuga.accentHex}
                    strokeOpacity={isActive ? 0.85 : 0.35}
                    strokeWidth={isActive ? 1.8 : 1}
                    className="transition-opacity duration-200"
                  />

                  {/* Outer Proportional Rim Highlight */}
                  <path
                    d={describeArcPath(WHEEL_RADIUS - 3, yuga.startAngle + 0.6, yuga.endAngle - 0.6)}
                    fill="none"
                    stroke={yuga.accentHex}
                    strokeWidth={isActive ? 5 : 3}
                    strokeOpacity={isActive ? 0.95 : 0.45}
                  />

                  {/* Curved Yuga Title along proportional arc */}
                  <text
                    fill={isActive ? '#FFFFFF' : '#E4E4E7'}
                    fontSize={yuga.id === 'kali' ? '11.5' : '13.5'}
                    fontWeight="600"
                    letterSpacing="0.14em"
                    className="font-display pointer-events-none"
                  >
                    <textPath
                      href={`#arc-label-${yuga.id}`}
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      {yuga.id === 'kali' ? 'KALI' : yuga.name.toUpperCase()}
                    </textPath>
                  </text>

                  {/* Ratio & Degree marker inside wedge */}
                  <g
                    transform={`translate(${ratioPos.x.toFixed(1)}, ${ratioPos.y.toFixed(
                      1
                    )}) rotate(${midAngle})`}
                    className="pointer-events-none"
                  >
                    <text
                      x="0"
                      y="-5"
                      textAnchor="middle"
                      fill={yuga.accentHex}
                      fontSize="11"
                      fontWeight="600"
                      className="font-mono-tabular"
                    >
                      {yuga.percentage}% · {yuga.degrees}°
                    </text>
                    <text
                      x="0"
                      y="9"
                      textAnchor="middle"
                      fill="rgba(244,244,245,0.75)"
                      fontSize="9"
                      className="font-mono-tabular"
                    >
                      Ratio {yuga.ratio}/10
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Sub-Timeline Concentric Ring & Proportional Degree Ticks */}
            <circle
              cx="0"
              cy="0"
              r={SUBTIMELINE_RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1"
            />
            {ticks.map((tick, idx) => {
              const inner = polarToCartesian(
                tick.major ? SUBTIMELINE_RADIUS - 8 : SUBTIMELINE_RADIUS - 4,
                tick.angle
              );
              const outer = polarToCartesian(SUBTIMELINE_RADIUS, tick.angle);
              return (
                <line
                  key={idx}
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke={tick.major ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={tick.major ? 1.5 : 0.9}
                />
              );
            })}

            {/* Pullable Radial Timestrap Event Nodes */}
            {YUGAS.flatMap((yuga) =>
              yuga.events.map((ev, evIndex) => {
                const isSelected = selectedEventId === ev.id;
                const isPullingThis = pullState?.eventId === ev.id;
                const pullDistance = isPullingThis ? pullState.pullPx : 0;
                const pullRatio = Math.min(1, pullDistance / PULL_TRIGGER_PX);

                const anchorOnRing = polarToCartesian(SUBTIMELINE_RADIUS, ev.wheelAngleDeg);
                const strapRadius = STRAP_BASE_RADIUS + pullDistance;
                const handlePos = polarToCartesian(strapRadius, ev.wheelAngleDeg);

                // Alternate slightly or label angle cleanly so adjacent Kali/Dvapara pins never collide
                const labelRadius = strapRadius + 16;
                const labelPos = polarToCartesian(labelRadius, ev.wheelAngleDeg);
                const normalizedDisplayAngle = ((ev.wheelAngleDeg % 360) + 360) % 360;
                const onLeftSide = normalizedDisplayAngle > 180;

                return (
                  <g
                    key={ev.id}
                    className="cursor-grab active:cursor-grabbing"
                    onPointerDown={(e) => handleStrapPointerDown(e, ev)}
                    onPointerMove={handleStrapPointerMove}
                    onPointerUp={handleStrapPointerUp}
                    onPointerCancel={handleStrapPointerUp}
                    role="button"
                    tabIndex={0}
                    aria-label={`Pull or select event: ${ev.title} (${yuga.name})`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectEvent(ev);
                      }
                    }}
                  >
                    {/* Invisible generous hit target */}
                    <circle
                      cx={handlePos.x}
                      cy={handlePos.y}
                      r="18"
                      fill="transparent"
                    />

                    {/* Elastic Timestrap Tether Line */}
                    <line
                      x1={anchorOnRing.x}
                      y1={anchorOnRing.y}
                      x2={handlePos.x}
                      y2={handlePos.y}
                      stroke={yuga.accentHex}
                      strokeWidth={isPullingThis || isSelected ? 2.4 : 1.4}
                      strokeOpacity={isPullingThis || isSelected ? 1 : 0.72}
                      strokeDasharray={isPullingThis ? 'none' : '2 2'}
                    />

                    {/* Sub-timeline ring anchor dot */}
                    <circle
                      cx={anchorOnRing.x}
                      cy={anchorOnRing.y}
                      r="3.2"
                      fill={yuga.accentHex}
                      stroke="#000000"
                      strokeWidth="1"
                    />

                    {/* Pull Progress Halo when pulling outward */}
                    {isPullingThis && pullDistance > 2 && (
                      <circle
                        cx={handlePos.x}
                        cy={handlePos.y}
                        r={13 + pullRatio * 5}
                        fill="none"
                        stroke={pullRatio >= 1 ? '#FFFFFF' : yuga.accentHex}
                        strokeWidth="2"
                        strokeOpacity={0.85}
                      />
                    )}

                    {/* Pullable Event Strap Handle */}
                    <circle
                      cx={handlePos.x}
                      cy={handlePos.y}
                      r={isSelected || isPullingThis ? 9.5 : 7.5}
                      fill={isSelected ? yuga.accentHex : '#09090B'}
                      stroke={yuga.accentHex}
                      strokeWidth={isSelected ? 2 : 1.75}
                    />
                    <text
                      x={handlePos.x}
                      y={handlePos.y + 3}
                      textAnchor="middle"
                      fontSize="8.5"
                      fontWeight="700"
                      fill={isSelected ? '#000000' : '#FAFAFA'}
                      className="font-mono-tabular pointer-events-none"
                    >
                      {evIndex + 1}
                    </text>

                    {/* Concise Radial Event Tag */}
                    <g
                      transform={`translate(${labelPos.x.toFixed(1)}, ${labelPos.y.toFixed(1)})`}
                      className="pointer-events-none"
                    >
                      <text
                        x={0}
                        y={3}
                        textAnchor={
                          normalizedDisplayAngle < 15 || normalizedDisplayAngle > 345
                            ? 'middle'
                            : onLeftSide
                            ? 'end'
                            : 'start'
                        }
                        transform={`rotate(${-rotationDeg})`}
                        fontSize="9.5"
                        fontWeight={isSelected || isPullingThis ? '600' : '500'}
                        fill={isSelected || isPullingThis ? '#FFFFFF' : 'rgba(228,228,231,0.78)'}
                      >
                        {ev.title.split('&')[0].trim().slice(0, 18)}
                      </text>
                    </g>
                  </g>
                );
              })
            )}

            {/* Central Cosmic Hub */}
            <circle
              cx="0"
              cy="0"
              r={INNER_CORE_RADIUS}
              fill="#000000"
              fillOpacity="0.92"
              stroke={activeYuga.accentHex}
              strokeOpacity="0.65"
              strokeWidth="1.5"
            />
            <circle
              cx="0"
              cy="0"
              r={INNER_CORE_RADIUS - 8}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
          </g>

          {/* Non-rotating Center Hub Readout */}
          <g className="pointer-events-none">
            <text
              x="0"
              y="-14"
              textAnchor="middle"
              fill={activeYuga.accentHex}
              fontSize="10"
              fontWeight="600"
              letterSpacing="0.16em"
              className="font-mono-tabular"
            >
              4 : 3 : 2 : 1
            </text>
            <text
              x="0"
              y="5"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="14.5"
              fontWeight="700"
              className="font-display"
            >
              {activeYuga.name}
            </text>
            <text
              x="0"
              y="22"
              textAnchor="middle"
              fill="#A1A1AA"
              fontSize="10"
              className="font-mono-tabular"
            >
              {activeYuga.percentage}% · {activeYuga.dharmaPillars}/4 Pillars
            </text>
          </g>
        </svg>
      </div>

      {/* Tactile Wheel Controls Directly Below Wheel */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onSpinImpulse}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
        >
          <RotateCw className="w-3.5 h-3.5" />
          Spin Wheel
        </button>

        <button
          type="button"
          onClick={onToggleAutoOrbit}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 ${
            isAutoOrbit
              ? 'bg-zinc-900 text-amber-300 border-amber-400/50'
              : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'
          }`}
        >
          {isAutoOrbit ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {isAutoOrbit ? 'Pause Orbit' : 'Auto-Orbit'}
        </button>

        <span className="text-xs text-zinc-500 whitespace-nowrap">
          Drag wheel to spin · Pull any outer event strap outward to pop open
        </span>
      </div>
    </div>
  );
};
