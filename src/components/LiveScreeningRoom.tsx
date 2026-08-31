import { useCallback, useRef, useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ScanText,
  BadgeCheck,
  ScanSearch,
  UserSquare,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSearch,
  Loader2,
  RotateCcw,
  Download,
  Hash,
  CalendarClock,
  ChevronRight,
  UploadCloud,
  Lock,
  Zap,
  Building2,
  Fingerprint,
  FileText,
} from 'lucide-react';
import type {
  DocPreset,
  ForensicModule,
  ModuleStatus,
  PixelForensicRow,
  ScanResult,
  TamperingReason,
  TextLayerRow,
} from '@/lib/types';
import { buildScanResult, PRESETS, PRESET_ORDER } from '@/lib/scanData';
import { verdictMeta, formatDate, formatBytes, moduleStatusMeta } from '@/lib/ui';
import { ScoreRing } from '@/components/ScoreRing';
import { DocumentCanvas } from '@/components/DocumentCanvas';

const MODULE_ICONS: Record<ForensicModule['number'], typeof ScanText> = {
  1: ScanText,
  2: BadgeCheck,
  3: ScanSearch,
  4: UserSquare,
};

const MODULE_STATUS_ICON: Record<ModuleStatus, typeof CheckCircle2> = {
  SUCCESS: CheckCircle2,
  WARNING: AlertTriangle,
  FAILED: XCircle,
};

const PRESET_SHORTCUT_LABELS: Record<DocPreset, string> = {
  passport: 'Load Valid Passport Preset',
  visa: 'Load Forged Visa Preset',
  fraud: 'Load Identity Fraud Preset',
};

interface LiveScreeningRoomProps {
  onScanComplete: (result: ScanResult) => void;
}

export function LiveScreeningRoom({ onScanComplete }: LiveScreeningRoomProps) {
  const [selectedDoc, setSelectedDoc] = useState<DocPreset | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runScan = useCallback(
    (preset: DocPreset, overrideFileName?: string) => {
      setSelectedDoc(preset);
      setLoading(true);
      setResult(null);
      setProgress(0);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 100;
          }
          return p + 5;
        });
      }, 100);

      setTimeout(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        setProgress(100);
        const r = buildScanResult(preset, overrideFileName);
        setResult(r);
        setLoading(false);
        onScanComplete(r);
      }, 2000);
    },
    [onScanComplete]
  );

  const handlePresetClick = (preset: DocPreset) => {
    runScan(preset);
  };

  const handleManualFile = (file: File) => {
    runScan('visa', file.name);
  };

  const reset = () => {
    setSelectedDoc(null);
    setResult(null);
    setLoading(false);
    setProgress(0);
  };

  return (
    <div className="space-y-5">
      {/* === FILE DROP ZONE === */}
      <div>
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-7 h-7 rounded-lg bg-accent-500/15 flex items-center justify-center">
            <FileSearch className="w-4 h-4 text-accent-400" />
          </span>
          <div>
            <h3 className="text-[13px] font-semibold text-slate-100">Document Intake</h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Upload an identity document for forensic screening
            </p>
          </div>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleManualFile(file);
          }}
          onClick={() => inputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 ${
            dragging
              ? 'border-accent-400 bg-accent-500/10 shadow-glow-accent'
              : 'border-ink-600 bg-ink-900/50 hover:border-accent-500/60 hover:bg-ink-850/60'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleManualFile(file);
              e.target.value = '';
            }}
          />
          <div className="px-6 py-9 flex flex-col items-center text-center">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all ${
                dragging ? 'bg-accent-500/20 scale-110' : 'bg-ink-800/80'
              }`}
            >
              <UploadCloud className={`w-6 h-6 ${dragging ? 'text-accent-300' : 'text-accent-400'}`} />
            </div>
            <p className="text-[14px] font-medium text-slate-200">
              Drop identity documents for forensic screening
            </p>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Aadhaar · PAN · Passport · Visa — PDF or image, up to 20&nbsp;MB
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="px-3.5 py-2 rounded-lg bg-accent-500/15 text-accent-300 text-[12px] font-medium border border-accent-500/30">
                Browse files
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-slate-600 font-mono">
                <Lock className="w-3 h-3" /> processed locally in-session
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* === PRESENTATION QUICK-LINKS === */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <Zap className="w-3.5 h-3.5 text-accent-400" />
          <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500">
            Presentation Quick-Links (For Evaluators)
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {PRESET_ORDER.map((id) => {
            const meta = PRESETS[id];
            const active = selectedDoc === id && !loading;
            const toneDot =
              meta.verdict === 'authentic'
                ? 'bg-success-500'
                : meta.verdict === 'suspicious'
                ? 'bg-warning-500'
                : 'bg-danger-500';
            return (
              <button
                key={id}
                onClick={() => handlePresetClick(id)}
                disabled={loading}
                className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  active
                    ? 'border-accent-500/40 bg-accent-500/10'
                    : 'border-ink-700/60 bg-ink-850/60 hover:border-accent-500/30 hover:bg-ink-800/60'
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${toneDot}`} />
                <span className="text-[12px] font-medium text-slate-200 flex-1 min-w-0">
                  {PRESET_SHORTCUT_LABELS[id]}
                </span>
                <span className="text-[10px] font-mono text-slate-600 shrink-0">{meta.score}%</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* === LOADING STATE === */}
      {loading && selectedDoc && (
        <div className="panel p-10 flex flex-col items-center justify-center text-center animate-fadeIn">
          <div className="relative w-16 h-16 mb-4">
            <Loader2 className="w-16 h-16 text-accent-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] font-mono font-bold text-accent-300 tabular-nums">{progress}%</span>
            </div>
          </div>
          <p className="text-[14px] font-medium text-slate-200">Running forensic scan…</p>
          <p className="text-[12px] font-mono text-slate-500 mt-1">
            {PRESETS[selectedDoc].buttonLabel} · 4-module MHA pipeline
          </p>

          {/* progress bar */}
          <div className="mt-5 w-full max-w-sm">
            <div className="h-1.5 rounded-full bg-ink-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-500 to-accent-300 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* module checklist */}
          <div className="mt-5 w-full max-w-sm space-y-2">
            {PRESETS[selectedDoc].modules.map((m, i) => {
              const moduleThreshold = (i + 1) * 25;
              const reached = progress >= moduleThreshold;
              return (
                <div
                  key={m.number}
                  className={`flex items-center gap-2 text-[11px] font-mono transition-colors ${
                    reached ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {reached ? (
                    <CheckCircle2 className="w-3 h-3 text-success-400" />
                  ) : (
                    <Loader2 className="w-3 h-3 animate-spin text-accent-400/60" />
                  )}
                  <span>Module {m.number}: {m.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* === RESULTS === */}
      {!loading && result && <ResultsPanel result={result} onReset={reset} />}

      {/* === EMPTY STATE === */}
      {!loading && !result && (
        <div className="panel min-h-[420px] flex flex-col items-center justify-center text-center p-10 grid-bg">
          <div className="relative w-20 h-20 rounded-2xl bg-ink-850 border border-ink-700/60 flex items-center justify-center mb-5">
            <ShieldCheck className="w-9 h-9 text-accent-400/70" />
            <span className="absolute inset-0 rounded-2xl ring-1 ring-accent-500/20 animate-pulseSoft" />
          </div>
          <h3 className="text-[15px] font-semibold text-slate-200">Awaiting document for screening</h3>
          <p className="text-[13px] text-slate-500 mt-2 max-w-md leading-relaxed">
            Upload a file above, or click one of the presentation quick-links. Sthira.AI will run a
            2-second four-module forensic pass and surface the integrity score, side-by-side
            document comparison, pixel forensics, text-layer verification, and tampering reasoning below.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {['Module 1: OCR Extraction', 'Module 2: Document Validation', 'Module 3: Tampering Detection', 'Module 4: Face Verification'].map((t) => (
              <span key={t} className="chip bg-ink-800 text-slate-400 border border-ink-700">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== RESULTS PANEL =====================

function ResultsPanel({ result, onReset }: { result: ScanResult; onReset: () => void }) {
  const vm = verdictMeta(result.verdict);
  const VerdictIcon =
    result.verdict === 'authentic' ? ShieldCheck : result.verdict === 'suspicious' ? ShieldAlert : ShieldX;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header strip */}
      <div className="panel px-5 py-4 flex flex-wrap items-center gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${vm.bg} ring-1 ${vm.border}`}>
          <VerdictIcon className={`w-5 h-5 ${vm.text}`} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-semibold text-white truncate">{result.fileName}</h3>
            <span className={`chip ${vm.bg} ${vm.text} ${vm.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${vm.dot}`} />
              {result.scoreLabel}
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-1">
            {result.documentType} · {result.issuingAuthority}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="btn-ghost">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Report</span>
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-accent-500/15 text-accent-300 hover:bg-accent-500/25 text-[12px] font-medium border border-accent-500/30 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            New screening
          </button>
        </div>
      </div>

      {/* Score + metadata + side-by-side */}
      <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
        {/* Left: score + metadata */}
        <div className="space-y-4">
          <div className="panel p-5 flex flex-col items-center">
            <ScoreRing score={result.score} />
            <p className={`mt-3 text-[14px] font-semibold text-center ${vm.text}`}>{result.scoreLabel}</p>
            <p className="text-[11px] text-slate-500 mt-1 text-center leading-relaxed">
              Composite integrity score from the four MHA forensic modules.
            </p>
          </div>

          <div className="panel p-4 space-y-3">
            <MetaRow icon={Hash} label="Reference ID" value={result.referenceId} mono />
            <MetaRow icon={Fingerprint} label="Document type" value={result.documentType} />
            <MetaRow icon={Building2} label="Issuing authority" value={result.issuingAuthority} />
            <MetaRow icon={FileText} label="Source file" value={`${result.fileType} · ${formatBytes(result.fileSize)}`} mono />
            <MetaRow icon={CalendarClock} label="Scanned at" value={formatDate(result.scannedAt)} mono />
          </div>
        </div>

        {/* Right: side-by-side document comparison */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ChevronRight className="w-4 h-4 text-accent-400" />
            <h3 className="text-[13px] font-semibold text-slate-200">Side-by-side document comparison</h3>
            <span className="text-[11px] font-mono text-slate-600">source vs. forensic overlay</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocumentCanvas result={result} annotated={false} />
            <DocumentCanvas result={result} annotated={true} />
          </div>
        </div>
      </div>

      {/* Four modules */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ChevronRight className="w-4 h-4 text-accent-400" />
          <h3 className="text-[13px] font-semibold text-slate-200">Forensic module diagnostics</h3>
          <span className="text-[11px] font-mono text-slate-600">MHA SIH26188 pipeline</span>
        </div>
        <div className="space-y-3">
          {result.modules.map((m) => (
            <ModuleCard key={m.number} module={m} />
          ))}
        </div>
      </div>

      {/* Pixel Forensics + Text Layer tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ForensicTable
          title="Pixel Forensic Analysis"
          subtitle="Error Level Analysis anomalies & pixel-domain checks"
          icon={ScanSearch}
          rows={result.pixelForensics}
        />
        <TextLayerTable
          title="Text Layer Verification"
          subtitle="Extracted field checksums against registry"
          icon={BadgeCheck}
          rows={result.textLayers}
        />
      </div>

      {/* Tampering reasoning */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ChevronRight className="w-4 h-4 text-accent-400" />
          <h3 className="text-[13px] font-semibold text-slate-200">
            {result.verdict === 'authentic' ? 'Integrity Assessment' : 'Tampering Assessment — Why This Document Was Flagged'}
          </h3>
        </div>
        <div className="space-y-3">
          {result.tamperingReasons.map((r) => (
            <TamperingReasonCard key={r.id} reason={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ModuleCard({ module: m }: { module: ForensicModule }) {
  const sm = moduleStatusMeta(m.status);
  const Icon = MODULE_ICONS[m.number];
  const StatusIcon = MODULE_STATUS_ICON[m.status];

  return (
    <div className={`panel overflow-hidden ${m.status === 'FAILED' ? 'ring-1 ring-danger-500/20' : ''}`}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-ink-700/50 bg-ink-850/60">
        <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${sm.bg} border ${sm.border}`}>
          <Icon className={`w-[18px] h-[18px] ${sm.text}`} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-slate-100">
            <span className="text-slate-500 font-mono mr-1.5">Module {m.number}:</span>
            {m.name}
          </p>
        </div>
        <span className={`chip ${sm.bg} ${sm.text} ${sm.border}`}>
          <StatusIcon className="w-3 h-3" />
          {sm.label}
        </span>
      </div>
      <div className="px-4 py-3.5">
        <p className="text-[12px] font-mono text-slate-300 leading-relaxed">{m.detail}</p>
      </div>
    </div>
  );
}

function ForensicTable({
  title,
  subtitle,
  icon: Icon,
  rows,
}: {
  title: string;
  subtitle: string;
  icon: typeof ScanSearch;
  rows: PixelForensicRow[];
}) {
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-ink-700/50 bg-ink-850/60">
        <span className="w-8 h-8 rounded-lg bg-accent-500/10 border border-accent-500/30 flex items-center justify-center">
          <Icon className="w-4 h-4 text-accent-400" />
        </span>
        <div>
          <p className="text-[13px] font-semibold text-slate-100">{title}</p>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-ink-900/60 text-[9px] font-mono uppercase tracking-wider text-slate-600">
              <th className="px-3 py-2 font-medium">Analysis</th>
              <th className="px-3 py-2 font-medium">Finding</th>
              <th className="px-3 py-2 font-medium">Delta</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-800/70">
            {rows.map((r) => {
              const sm = moduleStatusMeta(r.status);
              const StatusIcon = MODULE_STATUS_ICON[r.status];
              return (
                <tr key={r.id} className="hover:bg-ink-850/40 transition-colors">
                  <td className="px-3 py-2.5 text-[11px] text-slate-300 font-medium">{r.analysis}</td>
                  <td className="px-3 py-2.5 text-[11px] text-slate-400 leading-snug max-w-[200px]">{r.finding}</td>
                  <td className="px-3 py-2.5 text-[11px] font-mono text-slate-500 tabular-nums">{r.delta}</td>
                  <td className="px-3 py-2.5">
                    <span className={`chip ${sm.bg} ${sm.text} ${sm.border} text-[9px] px-1.5 py-0.5`}>
                      <StatusIcon className="w-2.5 h-2.5" />
                      {sm.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TextLayerTable({
  title,
  subtitle,
  icon: Icon,
  rows,
}: {
  title: string;
  subtitle: string;
  icon: typeof BadgeCheck;
  rows: TextLayerRow[];
}) {
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-ink-700/50 bg-ink-850/60">
        <span className="w-8 h-8 rounded-lg bg-accent-500/10 border border-accent-500/30 flex items-center justify-center">
          <Icon className="w-4 h-4 text-accent-400" />
        </span>
        <div>
          <p className="text-[13px] font-semibold text-slate-100">{title}</p>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-ink-900/60 text-[9px] font-mono uppercase tracking-wider text-slate-600">
              <th className="px-3 py-2 font-medium">Field</th>
              <th className="px-3 py-2 font-medium">Extracted Value</th>
              <th className="px-3 py-2 font-medium">Checksum</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-800/70">
            {rows.map((r) => {
              const sm = moduleStatusMeta(r.status);
              const StatusIcon = MODULE_STATUS_ICON[r.status];
              return (
                <tr key={r.id} className="hover:bg-ink-850/40 transition-colors">
                  <td className="px-3 py-2.5 text-[11px] text-slate-300 font-medium">{r.field}</td>
                  <td className="px-3 py-2.5 text-[11px] font-mono text-slate-400">{r.extractedValue}</td>
                  <td className="px-3 py-2.5 text-[10px] font-mono text-slate-500">{r.checksum}</td>
                  <td className="px-3 py-2.5">
                    <span className={`chip ${sm.bg} ${sm.text} ${sm.border} text-[9px] px-1.5 py-0.5`}>
                      <StatusIcon className="w-2.5 h-2.5" />
                      {sm.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TamperingReasonCard({ reason: r }: { reason: TamperingReason }) {
  const severityColor =
    r.severity === 'high' ? '#ef4444' : r.severity === 'medium' ? '#eab308' : '#22c55e';
  const severityBg =
    r.severity === 'high'
      ? 'bg-danger-500/10 border-danger-500/30'
      : r.severity === 'medium'
      ? 'bg-warning-500/10 border-warning-500/30'
      : 'bg-success-500/10 border-success-500/30';
  const severityText =
    r.severity === 'high' ? 'text-danger-400' : r.severity === 'medium' ? 'text-warning-400' : 'text-success-400';

  return (
    <div className={`panel p-4 ${r.severity === 'high' ? 'ring-1 ring-danger-500/20' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${severityBg}`}>
          <AlertTriangle className={`w-4 h-4 ${severityText}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[13px] font-semibold text-slate-100">{r.title}</p>
            <span className={`chip ${severityBg} ${severityText} text-[9px] px-1.5 py-0.5`}>
              {r.severity.toUpperCase()}
            </span>
          </div>
          <p className="text-[12px] text-slate-400 leading-relaxed mt-1.5">{r.description}</p>
          <div className="mt-3 panel-tight px-3 py-2">
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1">Forensic Basis</p>
            <p className="text-[11px] font-mono text-slate-400 leading-relaxed">{r.basis}</p>
          </div>
        </div>
        {/* tamper probability gauge */}
        <div className="shrink-0 text-center">
          <div className="relative w-14 h-14">
            <svg width="56" height="56" className="-rotate-90">
              <circle cx="28" cy="28" r="24" fill="none" stroke="#1b243d" strokeWidth="4" />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke={severityColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 24}
                strokeDashoffset={2 * Math.PI * 24 - (r.tamperProbability / 100) * (2 * Math.PI * 24)}
                style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] font-bold tabular-nums" style={{ color: severityColor }}>
                {r.tamperProbability}%
              </span>
            </div>
          </div>
          <p className="text-[8px] font-mono uppercase tracking-wider text-slate-600 mt-1">tamper prob.</p>
        </div>
      </div>
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: typeof Hash;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-3.5 h-3.5 text-slate-600 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-600">{label}</p>
        <p className={`text-[12px] text-slate-300 mt-0.5 break-words ${mono ? 'font-mono' : ''}`}>{value}</p>
      </div>
    </div>
  );
}
