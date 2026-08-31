import {
  ScanLine,
  Archive,
  ShieldAlert,
  Activity,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import type { ViewId } from '@/lib/types';

interface NavItem {
  id: ViewId;
  label: string;
  icon: typeof ScanLine;
  hint: string;
}

const NAV: NavItem[] = [
  { id: 'screening', label: 'Live Screening Room', icon: ScanLine, hint: 'Real-time ID screening' },
  { id: 'vault', label: 'Batch Forensic Vault', icon: Archive, hint: 'Screened document archive' },
  { id: 'registers', label: 'Local Fraud Registers', icon: ShieldAlert, hint: 'Watchlist match records' },
  { id: 'telemetry', label: 'System Telemetry Metrics', icon: Activity, hint: 'Throughput & model health' },
];

interface SidebarProps {
  active: ViewId;
  onChange: (id: ViewId) => void;
}

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className="w-72 shrink-0 h-screen sticky top-0 bg-ink-950 border-r border-ink-700/60 flex flex-col">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-ink-700/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-700 flex items-center justify-center shadow-glow-accent">
              <ShieldCheck className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success-500 ring-2 ring-ink-950 animate-pulseSoft" />
          </div>
          <div>
            <h1 className="text-[15px] font-semibold tracking-tight text-white leading-none">
              Sthira<span className="text-accent-400">.AI</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-500 mt-1 tracking-wider uppercase">
              Engineered by Equinox.core
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-slate-600">
          Operations
        </p>
        {NAV.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`group w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-accent-500/10 text-white ring-1 ring-accent-500/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-ink-800/70'
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] mt-0.5 shrink-0 ${
                  isActive ? 'text-accent-400' : 'text-slate-500 group-hover:text-slate-300'
                }`}
                strokeWidth={2}
              />
              <span className="flex-1 min-w-0">
                <span className="block text-[13px] font-medium leading-tight">{item.label}</span>
                <span className="block text-[11px] text-slate-600 mt-0.5 leading-tight">{item.hint}</span>
              </span>
              {isActive && (
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent-400 shadow-glow-accent" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Clearance footer */}
      <div className="px-4 py-4 border-t border-ink-700/50">
        <div className="panel-tight px-3 py-3">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-accent-400" />
            <span className="text-[11px] font-mono text-slate-400">CLEARANCE</span>
            <span className="ml-auto chip bg-accent-500/10 text-accent-300 border border-accent-500/30">
              LEVEL-4
            </span>
          </div>
          <p className="mt-2.5 text-[11px] text-slate-500 leading-relaxed">
            Ministry of Home Affairs · SIH26188
          </p>
          <p className="mt-1 text-[10px] font-mono text-accent-400/70">
            Engineered by Equinox.core
          </p>
          <p className="mt-1 text-[10px] font-mono text-slate-600">
            Operator: MHA-FOR-7741
          </p>
        </div>
      </div>
    </aside>
  );
}
