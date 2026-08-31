export type ViewId =
  | 'screening'
  | 'vault'
  | 'registers'
  | 'telemetry';

export type Verdict = 'authentic' | 'suspicious' | 'tampered';

export type DocPreset = 'passport' | 'visa' | 'fraud';

export type ModuleStatus = 'SUCCESS' | 'FAILED' | 'WARNING';

export interface ForensicModule {
  number: number;
  name: string;
  detail: string;
  status: ModuleStatus;
}

export interface BoundingBox {
  id: string;
  label: string;
  /** percentage coordinates within the document image (0-100) */
  x: number;
  y: number;
  w: number;
  h: number;
  severity: 'high' | 'medium' | 'low';
  confidence: number;
  note: string;
}

export interface PixelForensicRow {
  id: string;
  analysis: string;
  finding: string;
  delta: string;
  status: ModuleStatus;
}

export interface TextLayerRow {
  id: string;
  field: string;
  extractedValue: string;
  checksum: string;
  status: ModuleStatus;
}

export interface TamperingReason {
  id: string;
  title: string;
  description: string;
  basis: string;
  tamperProbability: number;
  severity: 'high' | 'medium' | 'low';
}

export interface ExtractedField {
  label: string;
  value: string;
  status: 'verified' | 'mismatch' | 'missing';
}

export interface ScanResult {
  preset: DocPreset;
  fileName: string;
  fileType: string;
  fileSize: number;
  score: number;
  scoreLabel: string;
  verdict: Verdict;
  documentType: string;
  issuingAuthority: string;
  referenceId: string;
  scannedAt: string;
  modules: ForensicModule[];
  boxes: BoundingBox[];
  pixelForensics: PixelForensicRow[];
  textLayers: TextLayerRow[];
  tamperingReasons: TamperingReason[];
  extractedFields: ExtractedField[];
}

export interface VaultEntry {
  id: string;
  fileName: string;
  scannedAt: string;
  integrityScore: number;
  verdict: Verdict;
  verdictLabel: string;
  documentType: string;
  referenceId: string;
  flaggedRegions: number;
}

export interface FraudRecord {
  id: string;
  referenceId: string;
  documentType: string;
  matchedAt: string;
  matchType: 'Face Swap' | 'Synthetic Identity' | 'Cloned Seal' | 'Stolen Identity' | 'Template Forgery';
  confidence: number;
  register: 'MHA National Watchlist' | 'Interpol Stolen Travel Documents' | 'UIDAI Duplicate Registry' | 'Regional Forgery DB';
  status: 'flagged' | 'cleared' | 'under_review';
}

export interface TelemetrySeries {
  label: string;
  values: number[];
  color: string;
}

export interface TelemetryStat {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'flat';
  tone: 'good' | 'warn' | 'bad' | 'neutral';
}
