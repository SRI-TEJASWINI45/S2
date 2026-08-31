import { Activity, TrendingUp, TrendingDown, Minus, Cpu, Server, Database } from 'lucide-react';
import type { TelemetrySeries } from '@/lib/types';
import { TELEMETRY_SERIES, TELEMETRY_STATS } from '@/lib/scanData';

export function SystemTelemetryMetrics() {
  return (
    <div className="space-y-5">
      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {TELEMETRY_STATS.map((s) => {
          const TrendIcon = s.trend === 'up' ? TrendingUp : s.trend === 'down' ? TrendingDown : Minus;
          const toneClass =
            s.tone === 'good'
              ? 'text-success-400'
              : s.tone === 'warn'
              ? 'text-warning-400'
              : s.tone === 'bad'
              ? 'text-danger-400'
              : 'text-accent-300';
          return (
            <div key={s.label} className="panel px-4 py-3.5">
              <div className="flex items-start justify-between">
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{s.label}</p>
                <TrendIcon className={`w-3.5 h-3.5 ${toneClass}`} />
              </div>
              <p className="text-2xl font-bold mt-2 tabular-nums text-slate-100">{s.value}</p>
              <p className={`text-[11px] font-mono mt-1 ${toneClass}`}>{s.delta}</p>
            </div>
          );
        })}
      </div>

      {/* charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {TELEMETRY_SERIES.map((s) => (
          <ChartCard key={s.label} series={s} />
        ))}
      </div>

      {/* subsystem health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HealthCard icon={Cpu} name="Forensic inference engine" load={72} detail="GPU cluster · 4 nodes online" />
        <HealthCard icon={Database} name="Fraud register sync" load={38} detail="4 registers · last sync 12s ago" />
        <HealthCard icon={Server} name="Screening queue" load={54} detail="queue depth 7 · p95 1.8s" />
      </div>

      {/* event log */}
      <div className="panel overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-ink-700/50 bg-ink-850/60">
          <Activity className="w-4 h-4 text-accent-400" />
          <h4 className="text-[13px] font-semibold text-slate-100">Live event stream</h4>
          <span className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-success-400">
            <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulseSoft" /> streaming
          </span>
        </div>
        <div className="divide-y divide-ink-800/70 font-mono text-[11px]">
          {EVENT_LOG.map((e, i) => (
            <div key={i} className="px-4 py-2.5 flex items-center gap-3">
              <span className="text-slate-600 tabular-nums">{e.time}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] ${e.toneClass}`}>{e.level}</span>
              <span className="text-slate-300">{e.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ series }: { series: TelemetrySeries }) {
  const w = 320;
  const h = 96;
  const pad = 6;
  const max = Math.max(...series.values);
  const min = Math.min(...series.values);
  const range = max - min || 1;
  const step = (w - pad * 2) / (series.values.length - 1);
  const points = series.values.map((v, i) => {
    const x = pad + i * step;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${points[points.length - 1][0].toFixed(1)},${h - pad} L${points[0][0].toFixed(1)},${h - pad} Z`;
  const last = series.values[series.values.length - 1];
  const prev = series.values[series.values.length - 2];
  const delta = last - prev;
  const up = delta >= 0;

  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-medium text-slate-200">{series.label}</p>
        <span className={`text-[11px] font-mono ${up ? 'text-success-400' : 'text-danger-400'}`}>
          {up ? '▲' : '▼'} {Math.abs(delta)}
        </span>
      </div>
      <p className="text-2xl font-bold tabular-nums text-slate-100 mt-1">{last}</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full mt-3" preserveAspectRatio="none" style={{ height: 96 }}>
        <defs>
          <linearGradient id={`grad-${series.label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={series.color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={series.color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#grad-${series.label})`} />
        <path d={line} fill="none" stroke={series.color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={i === points.length - 1 ? 3 : 0} fill={series.color} />
        ))}
      </svg>
      <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-slate-600">
        <span>min {min}</span>
        <span>max {max}</span>
      </div>
    </div>
  );
}

function HealthCard({
  icon: Icon,
  name,
  load,
  detail,
}: {
  icon: typeof Cpu;
  name: string;
  load: number;
  detail: string;
}) {
  const tone = load > 80 ? 'text-danger-400' : load > 60 ? 'text-warning-400' : 'text-success-400';
  return (
    <div className="panel p-4">
      <div className="flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-lg bg-ink-800 border border-ink-700/60 flex items-center justify-center">
          <Icon className="w-4 h-4 text-accent-400" />
        </span>
        <div>
          <p className="text-[12px] font-medium text-slate-200">{name}</p>
          <p className="text-[10px] font-mono text-slate-500 mt-0.5">{detail}</p>
        </div>
        <span className={`ml-auto text-[13px] font-mono tabular-nums ${tone}`}>{load}%</span>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-ink-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${load > 80 ? 'bg-danger-500' : load > 60 ? 'bg-warning-500' : 'bg-success-500'}`}
          style={{ width: `${load}%` }}
        />
      </div>
    </div>
  );
}

const EVENT_LOG: { time: string; level: string; toneClass: string; message: string }[] = [
  { time: '14:02:11', level: 'FLAG', toneClass: 'bg-danger-500/15 text-danger-400', message: 'passport_case_887.pdf — face-swap match on MHA National Watchlist (conf 0.89)' },
  { time: '14:01:54', level: 'SCAN', toneClass: 'bg-accent-500/15 text-accent-300', message: 'aadhaar_subject_4421.pdf screened — verdict authentic (score 91)' },
  { time: '14:01:30', level: 'SYNC', toneClass: 'bg-success-500/15 text-success-400', message: 'Interpol Stolen Travel Documents register synced — 12,884 records' },
  { time: '14:00:58', level: 'WARN', toneClass: 'bg-warning-500/15 text-warning-400', message: 'GPU node 3 thermal at 78°C — scaling inference across nodes 1-2' },
  { time: '14:00:12', level: 'SCAN', toneClass: 'bg-accent-500/15 text-accent-300', message: 'dl_bengaluru_5590.jpg screened — verdict tampered (score 41)' },
  { time: '13:59:40', level: 'FLAG', toneClass: 'bg-danger-500/15 text-danger-400', message: 'pan_finance_7733.pdf — cloned-seal match on Regional Forgery DB (conf 0.76)' },
];
