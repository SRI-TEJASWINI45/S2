import { Search, Bell, ChevronRight } from 'lucide-react';
import type { ViewId } from '@/lib/types';

const TITLES: Record<ViewId, { title: string; sub: string }> = {
  screening: { title: 'Live Screening Room', sub: 'Real-time identity document tamper analysis' },
  vault: { title: 'Batch Forensic Vault', sub: 'Archive of all screened identity documents' },
  registers: { title: 'Local Fraud Registers', sub: 'Cross-reference matches against national watchlists' },
  telemetry: { title: 'System Telemetry Metrics', sub: 'Throughput, detection rates and model health' },
};

interface TopBarProps {
  view: ViewId;
}

export function TopBar({ view }: TopBarProps) {
  const { title, sub } = TITLES[view];
  return (
    <header className="sticky top-0 z-20 bg-ink-950/85 backdrop-blur-md border-b border-ink-700/50">
      <div className="px-6 py-4 flex items-center gap-4">
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
          <span>Sthira.AI</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-300">{title}</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-850/80 border border-ink-700/60 w-64">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              placeholder="Search reference ID…"
              className="bg-transparent text-[12px] text-slate-200 placeholder:text-slate-600 outline-none w-full"
            />
            <span className="text-[10px] font-mono text-slate-600 px-1.5 py-0.5 rounded border border-ink-600">⌘K</span>
          </div>
          <button className="relative p-2 rounded-lg hover:bg-ink-800/70 text-slate-400 hover:text-slate-200 transition-colors">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger-500 ring-2 ring-ink-950" />
          </button>
          <div className="flex items-center gap-2.5 pl-3 border-l border-ink-700/50">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-[11px] font-semibold text-ink-950">
              FO
            </div>
            <div className="hidden sm:block">
              <p className="text-[12px] text-slate-200 leading-none">Forensic Officer</p>
              <p className="text-[10px] font-mono text-slate-500 mt-1">MHA-FOR-7741</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 pb-4">
        <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
        <p className="text-[13px] text-slate-500 mt-0.5">{sub}</p>
      </div>
    </header>
  );
}
