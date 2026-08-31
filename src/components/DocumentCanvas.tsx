import { FileText, ScanSearch, Eye, AlertTriangle } from 'lucide-react';
import type { BoundingBox, ScanResult } from '@/lib/types';

interface DocumentCanvasProps {
  result: ScanResult;
  annotated: boolean;
}

export function DocumentCanvas({ result, annotated }: DocumentCanvasProps) {
  const isPdf = result.fileType === 'application/pdf';

  return (
    <div className="panel overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-ink-700/50 bg-ink-850/60">
        {annotated ? (
          <ScanSearch className="w-3.5 h-3.5 text-accent-400" />
        ) : (
          <Eye className="w-3.5 h-3.5 text-slate-500" />
        )}
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
          {annotated ? 'Forensic Overlay' : 'Source Document'}
        </span>
        {annotated && result.boxes.length > 0 && (
          <span className="ml-auto chip bg-danger-500/10 text-danger-400 border border-danger-500/30">
            <AlertTriangle className="w-3 h-3" />
            {result.boxes.length} flagged
          </span>
        )}
      </div>

      {/* document body */}
      <div className="relative aspect-[1.586] bg-ink-950 grid-bg-sm overflow-hidden">
        {/* mock document surface */}
        <div className="doc-cqw absolute inset-3 rounded-lg bg-gradient-to-br from-slate-100 to-slate-300 shadow-inner overflow-hidden">
          {/* document type banner */}
          <div className="absolute top-0 left-0 right-0 h-[18%] bg-gradient-to-r from-blue-900 to-blue-800 flex items-center px-[5%]">
            <div className="w-[8%] aspect-square rounded-full bg-amber-500/90 flex items-center justify-center">
              {isPdf ? <FileText className="w-[40%] h-[40%] text-blue-950" /> : null}
            </div>
            <div className="ml-[3%]">
              <p className="text-[1.1cqw] font-bold text-white leading-none uppercase tracking-wider">
                {result.documentType}
              </p>
              <p className="text-[0.7cqw] text-blue-200 mt-[0.5%] uppercase tracking-widest">
                {result.issuingAuthority}
              </p>
            </div>
          </div>

          {/* photo placeholder */}
          <div className="absolute top-[22%] left-[58%] w-[28%] aspect-[3/4] rounded bg-gradient-to-br from-slate-400 to-slate-600 border-2 border-slate-500/50" />

          {/* text lines */}
          <div className="absolute top-[24%] left-[5%] w-[48%] space-y-[2%]">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-[2%]">
                <div className="w-[30%] h-[1.2cqw] bg-slate-400/60 rounded" />
                <div className="flex-1 h-[1.2cqw] bg-slate-500/50 rounded" />
              </div>
            ))}
          </div>

          {/* MRZ lines */}
          <div className="absolute bottom-[4%] left-[5%] right-[5%] space-y-[1.5%]">
            <div className="h-[1.4cqw] bg-slate-600/40 rounded font-mono text-[0.8cqw] text-slate-700 px-[1%] flex items-center">
              {result.preset === 'passport'
                ? 'P<INDSHARMA<<ROHAN<<<<<<<<<<<<<<<<<<<<<<'
                : result.preset === 'visa'
                ? 'V<INDTOURIST<V9876543<<<<<<<<<<<<<<<<<<'
                : 'UID99887766<<NATARAJAN<<PRIYA<<<<<<<<<<<'}
            </div>
            <div className="h-[1.4cqw] bg-slate-600/40 rounded font-mono text-[0.8cqw] text-slate-700 px-[1%] flex items-center">
              {result.preset === 'passport'
                ? 'Z1234567<7IND9006123M3006119<<<<<<<<<<06'
                : result.preset === 'visa'
                ? 'V9876543<4IND2601043F2707033<<<<<<<<<<12'
                : '552011908841<<9411222F<<<<<<<<<<<99887766'}
            </div>
          </div>
        </div>

        {/* bounding boxes overlay */}
        {annotated &&
          result.boxes.map((box) => <Box key={box.id} box={box} />)}

        {/* clean badge */}
        {!annotated && result.boxes.length === 0 && (
          <div className="absolute bottom-3 right-3 chip bg-success-500/15 text-success-400 border border-success-500/30 backdrop-blur-sm">
            No anomalies detected
          </div>
        )}
      </div>

      {/* box notes */}
      {annotated && result.boxes.length > 0 && (
        <div className="px-4 py-3 border-t border-ink-700/50 space-y-2">
          {result.boxes.map((box) => (
            <div key={box.id} className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-danger-500 mt-1.5 shrink-0 animate-pulseSoft" />
              <div>
                <p className="text-[11px] font-semibold text-danger-300">{box.label}</p>
                <p className="text-[10px] text-slate-500 leading-snug mt-0.5">{box.note}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Box({ box }: { box: BoundingBox }) {
  const color =
    box.severity === 'high' ? '#ef4444' : box.severity === 'medium' ? '#eab308' : '#22c55e';
  return (
    <div
      className="absolute border-2 rounded-sm transition-all duration-500 animate-fadeIn"
      style={{
        left: `${box.x}%`,
        top: `${box.y}%`,
        width: `${box.w}%`,
        height: `${box.h}%`,
        borderColor: color,
        boxShadow: `0 0 0 1px ${color}40, 0 0 12px ${color}60`,
        background: `${color}10`,
      }}
    >
      <div
        className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold whitespace-nowrap"
        style={{ background: color, color: '#0a0e1a' }}
      >
        {box.label}
      </div>
    </div>
  );
}
