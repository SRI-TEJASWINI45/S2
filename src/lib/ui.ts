import type { ModuleStatus, Verdict } from './types';

export function verdictMeta(v: Verdict): {
  label: string;
  text: string;
  bg: string;
  border: string;
  dot: string;
  ring: string;
} {
  switch (v) {
    case 'authentic':
      return {
        label: 'Authentic',
        text: 'text-success-400',
        bg: 'bg-success-500/10',
        border: 'border-success-500/30',
        dot: 'bg-success-500',
        ring: 'stroke-success-500',
      };
    case 'suspicious':
      return {
        label: 'Suspicious',
        text: 'text-warning-400',
        bg: 'bg-warning-500/10',
        border: 'border-warning-500/30',
        dot: 'bg-warning-500',
        ring: 'stroke-warning-500',
      };
    case 'tampered':
      return {
        label: 'Tampered',
        text: 'text-danger-400',
        bg: 'bg-danger-500/10',
        border: 'border-danger-500/30',
        dot: 'bg-danger-500',
        ring: 'stroke-danger-500',
      };
  }
}

export function moduleStatusMeta(s: ModuleStatus): {
  label: string;
  text: string;
  bg: string;
  border: string;
  dot: string;
} {
  switch (s) {
    case 'SUCCESS':
      return { label: 'SUCCESS', text: 'text-success-400', bg: 'bg-success-500/10', border: 'border-success-500/30', dot: 'bg-success-500' };
    case 'WARNING':
      return { label: 'WARNING', text: 'text-accent-300', bg: 'bg-accent-500/10', border: 'border-accent-500/30', dot: 'bg-accent-400' };
    case 'FAILED':
      return { label: 'FAILED', text: 'text-danger-400', bg: 'bg-danger-500/10', border: 'border-danger-500/30', dot: 'bg-danger-500' };
  }
}

export function severityMeta(s: 'high' | 'medium' | 'low'): {
  label: string;
  text: string;
  bg: string;
  border: string;
} {
  switch (s) {
    case 'high':
      return { label: 'HIGH', text: 'text-danger-400', bg: 'bg-danger-500/10', border: 'border-danger-500/30' };
    case 'medium':
      return { label: 'MED', text: 'text-warning-400', bg: 'bg-warning-500/10', border: 'border-warning-500/30' };
    case 'low':
      return { label: 'LOW', text: 'text-success-400', bg: 'bg-success-500/10', border: 'border-success-500/30' };
  }
}

export function checksumMeta(c: 'match' | 'mismatch' | 'missing'): {
  label: string;
  text: string;
  bg: string;
} {
  switch (c) {
    case 'match':
      return { label: 'MATCH', text: 'text-success-400', bg: 'bg-success-500/10' };
    case 'mismatch':
      return { label: 'MISMATCH', text: 'text-danger-400', bg: 'bg-danger-500/10' };
    case 'missing':
      return { label: 'MISSING', text: 'text-warning-400', bg: 'bg-warning-500/10' };
  }
}

export function scoreColor(score: number): string {
  if (score >= 85) return '#22c55e';
  if (score >= 60) return '#eab308';
  return '#ef4444';
}

export function scoreLabel(score: number): string {
  if (score >= 85) return 'Authentic';
  if (score >= 60) return 'Suspicious';
  return 'Tampered';
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}
