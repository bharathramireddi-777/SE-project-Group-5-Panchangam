import React, { useMemo, useRef, useState } from 'react';
import { ImagePlus, RotateCcw, ArrowUpRight } from 'lucide-react';
import {
  DEFAULT_WHEEL_BG,
  YUGAS,
  YugaDefinition,
  YugaEvent,
  formatYears,
  getNeedleWheelAngle,
  getYugaAtWheelAngle,
} from '../data/yugas';

interface YugaOverviewPanelProps {
  rotationDeg: number;
  onJumpToYuga: (yuga: YugaDefinition) => void;
  onSelectEvent: (event: YugaEvent) => void;
  selectedEventId: string | null;
  wheelBgUrl: string;
  onWheelBgChange: (url: string) => void;
}

export const YugaOverviewPanel: React.FC<YugaOverviewPanelProps> = ({
  rotationDeg,
  onJumpToYuga,
  onSelectEvent,
  selectedEventId,
  wheelBgUrl,
  onWheelBgChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const needleAngle = getNeedleWheelAngle(rotationDeg);
  const activeYuga = useMemo(() => getYugaAtWheelAngle(needleAngle), [needleAngle]);

  const progressInYuga = Math.max(
    0,
    Math.min(100, ((needleAngle - activeYuga.startAngle) / activeYuga.degrees) * 100)
  );

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onWheelBgChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <aside className="flex flex-col gap-5 w-full">
      {/* Active Yuga Overview */}
      <section className="rounded-xl bg-zinc-950/90 border border-zinc-800/90 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <p className="text-xs text-zinc-400 font-mono-tabular">
              {activeYuga.sanskrit} · {activeYuga.alternateName}
            </p>
            <h2
              className="mt-1 text-2xl font-display font-semibold tracking-tight"
              style={{ color: activeYuga.accentHex }}
            >
              {activeYuga.name}
            </h2>
          </div>
          <div className="text-right font-mono-tabular">
            <div className="text-lg font-semibold text-white">
              {activeYuga.percentage}%
            </div>
            <div className="text-xs text-zinc-500">
              {activeYuga.degrees}° of 360°
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
          {activeYuga.description}
        </p>

        {/* Sub-epoch progress indicator */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-mono-tabular text-zinc-400 mb-1.5">
            <span>Epoch Progress</span>
            <span>{progressInYuga.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-zinc-900 overflow-hidden">
            <div
              className="h-full transition-all duration-100"
              style={{
                width: `${progressInYuga}%`,
                backgroundColor: activeYuga.accentHex,
              }}
            />
          </div>
        </div>

        {/* Key Numerical Metrics (Tabular) */}
        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 pt-4 border-t border-zinc-800/80 text-xs">
          <div>
            <dt className="text-zinc-500">Human Span</dt>
            <dd className="mt-0.5 font-mono-tabular text-sm font-medium text-zinc-100">
              {formatYears(activeYuga.humanYears)} yrs
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Divine Span</dt>
            <dd className="mt-0.5 font-mono-tabular text-sm font-medium text-zinc-100">
              {formatYears(activeYuga.divineYears)} yrs
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Sandhya / Sandhyamsa</dt>
            <dd className="mt-0.5 font-mono-tabular text-sm font-medium text-zinc-100">
              {formatYears(activeYuga.sandhyaYears)} yrs each
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Dharma Pillars</dt>
            <dd className="mt-0.5 font-mono-tabular text-sm font-medium text-zinc-100">
              {activeYuga.dharmaPillars} of 4 Standing
            </dd>
          </div>
        </dl>
      </section>

      {/* Proportional 4:3:2:1 Ratio Selector */}
      <section className="rounded-xl bg-zinc-950/90 border border-zinc-800/90 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-100">
            Four Yugas Ratio (4 : 3 : 2 : 1)
          </h3>
          <span className="text-xs font-mono-tabular text-zinc-500">
            4,320,000 yrs
          </span>
        </div>

        <div className="space-y-2.5">
          {YUGAS.map((yuga) => {
            const isActive = yuga.id === activeYuga.id;
            return (
              <button
                key={yuga.id}
                type="button"
                onClick={() => onJumpToYuga(yuga)}
                className={`w-full text-left rounded-lg border px-3.5 py-2.5 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-black border-zinc-600'
                    : 'bg-black/50 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span
                    className="font-semibold"
                    style={{ color: isActive ? yuga.accentHex : '#E4E4E7' }}
                  >
                    {yuga.name}
                  </span>
                  <span className="font-mono-tabular text-zinc-400">
                    {yuga.ratio}/10 · {yuga.degrees}° · {formatYears(yuga.humanYears)}y
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-900 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-opacity"
                    style={{
                      width: `${yuga.percentage}%`,
                      backgroundColor: yuga.accentHex,
                      opacity: isActive ? 1 : 0.65,
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Yuga Sub-Timeline Quick Index */}
      <section className="rounded-xl bg-zinc-950/90 border border-zinc-800/90 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-100">
            {activeYuga.name} Major Events
          </h3>
          <span className="text-xs font-mono-tabular text-zinc-500">
            {activeYuga.events.length} Nodes
          </span>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {activeYuga.events.map((ev, index) => {
            const isSelected = selectedEventId === ev.id;
            return (
              <button
                key={ev.id}
                type="button"
                onClick={() => onSelectEvent(ev)}
                className="w-full py-2.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3 text-left group cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-mono-tabular text-zinc-500">
                    <span style={{ color: activeYuga.accentHex }}>0{index + 1}</span>
                    <span>·</span>
                    <span>{ev.epochPhase}</span>
                  </div>
                  <p
                    className={`mt-0.5 text-sm font-medium truncate transition-colors ${
                      isSelected
                        ? 'text-white'
                        : 'text-zinc-300 group-hover:text-white'
                    }`}
                  >
                    {ev.title}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200 shrink-0 transition-colors" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Wheel Reference Image Control */}
      <section className="rounded-xl bg-zinc-950/90 border border-zinc-800/90 px-4 py-3.5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-zinc-200">Wheel Background Art</p>
          <p className="text-[11px] text-zinc-500 truncate">
            {wheelBgUrl === DEFAULT_WHEEL_BG
              ? 'Cosmic Astrolabe Mandala'
              : 'Custom Reference Image'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFilePick}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-200 bg-black border border-zinc-800 hover:border-zinc-600 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <ImagePlus className="w-3.5 h-3.5" />
            Change Image
          </button>
          {wheelBgUrl !== DEFAULT_WHEEL_BG && (
            <button
              type="button"
              onClick={() => onWheelBgChange(DEFAULT_WHEEL_BG)}
              aria-label="Reset wheel background to default cosmic art"
              className="p-1.5 text-zinc-400 hover:text-white bg-black border border-zinc-800 hover:border-zinc-600 rounded-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </section>

    </aside>
  );
};
