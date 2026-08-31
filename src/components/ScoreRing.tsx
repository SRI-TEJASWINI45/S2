interface ScoreRingProps {
  score: number;
  size?: number;
  stroke?: number;
}

export function ScoreRing({ score, size = 132, stroke = 10 }: ScoreRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 85 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#1b243d"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums" style={{ color }}>
          {score}
          <span className="text-lg">%</span>
        </span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mt-0.5">
          Integrity
        </span>
      </div>
    </div>
  );
}
