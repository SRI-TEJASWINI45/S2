import type {
  BoundingBox,
  DocPreset,
  ExtractedField,
  ForensicModule,
  PixelForensicRow,
  ScanResult,
  TamperingReason,
  TextLayerRow,
  VaultEntry,
  Verdict,
} from './types';

export interface PresetMeta {
  id: DocPreset;
  buttonLabel: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  referenceId: string;
  documentType: string;
  issuingAuthority: string;
  score: number;
  scoreLabel: string;
  verdict: Verdict;
  modules: ForensicModule[];
  boxes: BoundingBox[];
  pixelForensics: PixelForensicRow[];
  textLayers: TextLayerRow[];
  tamperingReasons: TamperingReason[];
  extractedFields: ExtractedField[];
}

// ===================== PASSPORT (AUTHENTIC) =====================

const PASSPORT_MODULES: ForensicModule[] = [
  { number: 1, name: 'OCR Extraction', detail: 'Fields Extracted: Name: Rohan Sharma, Passport No: Z1234567, Nationality: IND', status: 'SUCCESS' },
  { number: 2, name: 'Document Validation', detail: 'ICAO 9303 Alphanumeric Checksums: VALID', status: 'SUCCESS' },
  { number: 3, name: 'Tampering Detection', detail: 'Error Level Analysis (ELA) Delta: 0.02 (Stable)', status: 'SUCCESS' },
  { number: 4, name: 'Face Verification', detail: 'Biometric Registry Facial Match Confidence: 96.4%', status: 'SUCCESS' },
];

const PASSPORT_BOXES: BoundingBox[] = [];

const PASSPORT_PIXEL: PixelForensicRow[] = [
  { id: 'px1', analysis: 'Error Level Analysis (ELA)', finding: 'Uniform compression — no recompression boundaries detected', delta: '0.02', status: 'SUCCESS' },
  { id: 'px2', analysis: 'Noise Residue Map', finding: 'Consistent noise distribution across full canvas', delta: '0.01', status: 'SUCCESS' },
  { id: 'px3', analysis: 'Clone Detection (PatchMatch)', finding: 'No duplicated texture clusters found', delta: '0.00', status: 'SUCCESS' },
  { id: 'px4', analysis: 'Edge Gradient Analysis', finding: 'Smooth edge transitions — no splice artifacts', delta: '0.03', status: 'SUCCESS' },
];

const PASSPORT_TEXT: TextLayerRow[] = [
  { id: 'tx1', field: 'Name → Rohan Sharma', extractedValue: 'ROHAN SHARMA', checksum: 'SHA-256: 7a3f…b2c1 ✓ MATCH', status: 'SUCCESS' },
  { id: 'tx2', field: 'Passport No → Z1234567', extractedValue: 'Z1234567', checksum: 'ICAO checksum digit 7 ✓ VALID', status: 'SUCCESS' },
  { id: 'tx3', field: 'Nationality → IND', extractedValue: 'IND', checksum: 'ISO 3166-1 alpha-3 ✓ MATCH', status: 'SUCCESS' },
  { id: 'tx4', field: 'MRZ Line 1', extractedValue: 'P<INDSHARMA<<ROHAN<<<<<<<<<<<<<<<<<<<<<', checksum: 'Parity check ✓ PASS', status: 'SUCCESS' },
  { id: 'tx5', field: 'MRZ Line 2', extractedValue: 'Z1234567<7IND9006123M3006119<<<<<<<<<<06', checksum: 'Final check digit 6 ✓ VALID', status: 'SUCCESS' },
];

const PASSPORT_REASONS: TamperingReason[] = [
  {
    id: 'r1',
    title: 'No Tampering Indicators Detected',
    description: 'All four forensic modules returned SUCCESS. The document exhibits uniform pixel density, stable ELA delta, and no edge-discontinuity vectors.',
    basis: 'ELA delta 0.02 (threshold 0.08) · Clone detection 0 matches · Edge gradient smooth · MRZ checksums all valid',
    tamperProbability: 2,
    severity: 'low',
  },
];

const PASSPORT_FIELDS: ExtractedField[] = [
  { label: 'Name', value: 'Rohan Sharma', status: 'verified' },
  { label: 'Passport Number', value: 'Z1234567', status: 'verified' },
  { label: 'Nationality', value: 'IND', status: 'verified' },
  { label: 'Date of Birth', value: '12-JUN-1990', status: 'verified' },
  { label: 'Date of Expiry', value: '11-JUN-2030', status: 'verified' },
  { label: 'Gender', value: 'M', status: 'verified' },
];

// ===================== VISA (FORGED) =====================

const VISA_MODULES: ForensicModule[] = [
  { number: 1, name: 'OCR Extraction', detail: 'Fields Extracted: Visa No: V9876543, Type: Tourist, Stay: 30 Days', status: 'SUCCESS' },
  { number: 2, name: 'Document Validation', detail: 'Validation Error: Expiry Year hash sequence mismatches metadata structure', status: 'FAILED' },
  { number: 3, name: 'Tampering Detection', detail: 'Error Level Analysis (ELA) Flags: High-contrast compression spikes around Expiry Date field. Text Manipulation verified.', status: 'FAILED' },
  { number: 4, name: 'Face Verification', detail: 'Facial Verification: Incomplete due to document layout alteration boundaries', status: 'WARNING' },
];

const VISA_BOXES: BoundingBox[] = [
  {
    id: 'bx-expiry',
    label: 'Expiry Date — Re-encoded Text',
    x: 8, y: 52, w: 34, h: 14,
    severity: 'high',
    confidence: 0.93,
    note: 'ELA recompression boundary detected around the expiry year text block. The year was digitally overwritten after the original print, creating a high-contrast pixel spike.',
  },
];

const VISA_PIXEL: PixelForensicRow[] = [
  { id: 'px1', analysis: 'Error Level Analysis (ELA)', finding: 'High-contrast compression spike localized to expiry date field', delta: '0.27', status: 'FAILED' },
  { id: 'px2', analysis: 'Noise Residue Map', finding: 'Noise distribution anomaly in lower-right quadrant near expiry block', delta: '0.18', status: 'FAILED' },
  { id: 'px3', analysis: 'Clone Detection (PatchMatch)', finding: 'No duplicated texture clusters detected', delta: '0.00', status: 'SUCCESS' },
  { id: 'px4', analysis: 'Edge Gradient Analysis', finding: 'Minor edge discontinuity along expiry text baseline', delta: '0.12', status: 'WARNING' },
  { id: 'px5', analysis: 'JPEG Ghost Analysis', finding: 'Secondary compression artifact detected in expiry region only', delta: '0.21', status: 'FAILED' },
];

const VISA_TEXT: TextLayerRow[] = [
  { id: 'tx1', field: 'Visa No → V9876543', extractedValue: 'V9876543', checksum: 'SHA-256: 4c2e…8a91 ✓ MATCH', status: 'SUCCESS' },
  { id: 'tx2', field: 'Visa Type → Tourist', extractedValue: 'TOURIST (T-1)', checksum: 'Type code T-1 ✓ VALID', status: 'SUCCESS' },
  { id: 'tx3', field: 'Stay Duration → 30 Days', extractedValue: '30 DAYS', checksum: 'Duration hash ✓ MATCH', status: 'SUCCESS' },
  { id: 'tx4', field: 'Expiry Date → 03-JUL-2027', extractedValue: '03-JUL-2027', checksum: 'SHA-256: 9f1a…3c04 ✗ MISMATCH', status: 'FAILED' },
  { id: 'tx5', field: 'Issue Date → 04-JAN-2026', extractedValue: '04-JAN-2026', checksum: 'SHA-256: 2b7d…e8f1 ✓ MATCH', status: 'SUCCESS' },
];

const VISA_REASONS: TamperingReason[] = [
  {
    id: 'r1',
    title: 'Expiry Date Text Manipulation',
    description: 'The expiry year was digitally overwritten from 2026 to 2027. ELA analysis reveals a recompression boundary around the expiry text block — the pixels in that region were re-encoded at a different quality level than the rest of the document.',
    basis: 'ELA delta 0.27 (threshold 0.08) · JPEG ghost artifact confirmed · Noise residue anomaly 0.18 · Expiry hash mismatch (9f1a…3c04 ≠ registry)',
    tamperProbability: 93,
    severity: 'high',
  },
  {
    id: 'r2',
    title: 'Structural Hash Divergence',
    description: 'The structural hash of the expiry field block does not match the issuing-registry record. The original document was registered with a 2026 expiry window; the presented copy shows 2027.',
    basis: 'Expiry checksum SHA-256 mismatch · Issue/expiry chronology violated (registered 2026 vs presented 2027) · ICAO 9303 field hash divergence 0.41',
    tamperProbability: 87,
    severity: 'high',
  },
  {
    id: 'r3',
    title: 'Facial Verification Degradation',
    description: 'Face vector extraction was degraded by the layout shift caused by the text manipulation. The system could only achieve a partial biometric match at 61.3% confidence, below the 85% clearance threshold.',
    basis: 'Cosine similarity 61.3% (threshold 85%) · Insufficient landmark coverage · Layout alteration boundaries detected',
    tamperProbability: 39,
    severity: 'medium',
  },
];

const VISA_FIELDS: ExtractedField[] = [
  { label: 'Visa Number', value: 'V9876543', status: 'verified' },
  { label: 'Visa Type', value: 'Tourist (T-1)', status: 'verified' },
  { label: 'Stay Duration', value: '30 Days', status: 'verified' },
  { label: 'Date of Issue', value: '04-JAN-2026', status: 'verified' },
  { label: 'Date of Expiry', value: '03-JUL-2027', status: 'mismatch' },
];

// ===================== IDENTITY FRAUD =====================

const FRAUD_MODULES: ForensicModule[] = [
  { number: 1, name: 'OCR Extraction', detail: 'Fields Extracted: National ID No: 99887766', status: 'SUCCESS' },
  { number: 2, name: 'Document Validation', detail: 'Base database text entries match registry framework', status: 'SUCCESS' },
  { number: 3, name: 'Tampering Detection', detail: 'Sharp edge-discontinuity vectors detected around photo frame border. Photo Replacement verified.', status: 'FAILED' },
  { number: 4, name: 'Face Verification', detail: 'Presented Face mismatches embedded profile vector. Confidence: 14.2%', status: 'FAILED' },
];

const FRAUD_BOXES: BoundingBox[] = [
  {
    id: 'bx-photo',
    label: 'Photo Frame — Spliced Portrait',
    x: 56, y: 12, w: 34, h: 40,
    severity: 'high',
    confidence: 0.96,
    note: 'Sharp edge-discontinuity vectors trace the full perimeter of the photo frame. The portrait was cut from a donor image and composited into the document. ELA confirms a recompression boundary around the photo window.',
  },
];

const FRAUD_PIXEL: PixelForensicRow[] = [
  { id: 'px1', analysis: 'Error Level Analysis (ELA)', finding: 'Recompression boundary around photo frame — donor image confirmed', delta: '0.38', status: 'FAILED' },
  { id: 'px2', analysis: 'Noise Residue Map', finding: 'Noise pattern discontinuity at photo frame boundary — different sensor signature', delta: '0.31', status: 'FAILED' },
  { id: 'px3', analysis: 'Clone Detection (PatchMatch)', finding: 'Duplicated texture clusters around jawline — composite assembly confirmed', delta: '0.24', status: 'FAILED' },
  { id: 'px4', analysis: 'Edge Gradient Analysis', finding: 'Sharp edge-gradient vectors trace full photo frame perimeter', delta: '0.42', status: 'FAILED' },
  { id: 'px5', analysis: 'JPEG Ghost Analysis', finding: 'Tertiary compression artifact in photo region — multiple re-saves detected', delta: '0.29', status: 'FAILED' },
];

const FRAUD_TEXT: TextLayerRow[] = [
  { id: 'tx1', field: 'National ID No → 99887766', extractedValue: '99887766', checksum: 'SHA-256: 1e5c…7a22 ✓ MATCH', status: 'SUCCESS' },
  { id: 'tx2', field: 'Name → Priya Natarajan', extractedValue: 'PRIYA NATARAJAN', checksum: 'SHA-256: 3a8b…6d90 ✓ MATCH', status: 'SUCCESS' },
  { id: 'tx3', field: 'Date of Birth → 22-NOV-1994', extractedValue: '22-NOV-1994', checksum: 'SHA-256: 5c2f…1e87 ✓ MATCH', status: 'SUCCESS' },
  { id: 'tx4', field: 'Address → Chennai', extractedValue: '7, ANNA SALAI, CHENNAI, 600002', checksum: 'SHA-256: 8d1a…4b33 ✓ MATCH', status: 'SUCCESS' },
  { id: 'tx5', field: 'Embedded Photo Hash', extractedValue: 'HASH REDACTED', checksum: 'SHA-256: 0f2c…9e41 ✗ MISMATCH (donor image)', status: 'FAILED' },
];

const FRAUD_REASONS: TamperingReason[] = [
  {
    id: 'r1',
    title: 'Photo Replacement / Face Splicing',
    description: 'The portrait photograph was cut from a donor image and composited into the document frame. Sharp edge-discontinuity vectors trace the full perimeter of the photo frame, and the noise residue map shows a different sensor signature inside the photo region versus the surrounding document.',
    basis: 'ELA delta 0.38 · Edge gradient 0.42 · Noise residue discontinuity 0.31 · Clone detection 0.24 · JPEG ghost (tertiary compression) 0.29',
    tamperProbability: 96,
    severity: 'high',
  },
  {
    id: 'r2',
    title: 'Biometric Identity Mismatch',
    description: 'The presented face does not match the biometric profile vector embedded in the document chip. Cosine similarity is 14.2%, far below the 85% clearance threshold. The person presenting this document is not the individual whose identity it represents.',
    basis: 'Cosine similarity 14.2% (threshold 85%) · Registry index MHA-BIO-2209 mismatch · Splice artifacts invalidate liveness scoring',
    tamperProbability: 98,
    severity: 'high',
  },
  {
    id: 'r3',
    title: 'Composite Assembly Evidence',
    description: 'Duplicated texture clusters around the jawline confirm the photo was assembled from multiple source images. The JPEG ghost analysis shows the photo region was compressed three times (tertiary compression), indicating it was extracted, edited, and re-inserted.',
    basis: 'PatchMatch clone detection 0.24 · JPEG ghost tertiary compression 0.29 · Noise sensor signature mismatch',
    tamperProbability: 91,
    severity: 'high',
  },
];

const FRAUD_FIELDS: ExtractedField[] = [
  { label: 'National ID No', value: '99887766', status: 'verified' },
  { label: 'Name', value: 'Priya Natarajan', status: 'verified' },
  { label: 'Date of Birth', value: '22-NOV-1994', status: 'verified' },
  { label: 'Address', value: '7, Anna Salai, Chennai, 600002', status: 'verified' },
  { label: 'Gender', value: 'F', status: 'verified' },
];

// ===================== PRESETS =====================

export const PRESETS: Record<DocPreset, PresetMeta> = {
  passport: {
    id: 'passport',
    buttonLabel: 'Demo File A: Valid Passport',
    fileName: 'passport_valid_rohan_sharma.pdf',
    fileType: 'application/pdf',
    fileSize: 1_842_000,
    referenceId: 'MHA-PPT-2026-Z1234567',
    documentType: 'Indian Passport',
    issuingAuthority: 'Ministry of External Affairs',
    score: 98,
    scoreLabel: '98% - AUTHENTIC / CLEARED',
    verdict: 'authentic',
    modules: PASSPORT_MODULES,
    boxes: PASSPORT_BOXES,
    pixelForensics: PASSPORT_PIXEL,
    textLayers: PASSPORT_TEXT,
    tamperingReasons: PASSPORT_REASONS,
    extractedFields: PASSPORT_FIELDS,
  },
  visa: {
    id: 'visa',
    buttonLabel: 'Demo File B: Forged Visa',
    fileName: 'visa_forged_expiry_tampered.pdf',
    fileType: 'application/pdf',
    fileSize: 1_206_000,
    referenceId: 'MHA-VS-2026-V9876543',
    documentType: 'Tourist Visa Stamp',
    issuingAuthority: 'Bureau of Immigration',
    score: 34,
    scoreLabel: '34% - HIGH RISK / FORGERY DETECTED',
    verdict: 'tampered',
    modules: VISA_MODULES,
    boxes: VISA_BOXES,
    pixelForensics: VISA_PIXEL,
    textLayers: VISA_TEXT,
    tamperingReasons: VISA_REASONS,
    extractedFields: VISA_FIELDS,
  },
  fraud: {
    id: 'fraud',
    buttonLabel: 'Demo File C: Identity Fraud',
    fileName: 'idcard_identity_fraud_photo_swap.jpg',
    fileType: 'image/jpeg',
    fileSize: 946_000,
    referenceId: 'MHA-IDF-2026-99887766',
    documentType: 'National ID Card',
    issuingAuthority: 'Unique Identification Authority of India',
    score: 12,
    scoreLabel: '12% - CRITICAL ALERT / FRAUD DETECTED',
    verdict: 'tampered',
    modules: FRAUD_MODULES,
    boxes: FRAUD_BOXES,
    pixelForensics: FRAUD_PIXEL,
    textLayers: FRAUD_TEXT,
    tamperingReasons: FRAUD_REASONS,
    extractedFields: FRAUD_FIELDS,
  },
};

export const PRESET_ORDER: DocPreset[] = ['passport', 'visa', 'fraud'];

export function buildScanResult(preset: DocPreset, overrideFileName?: string): ScanResult {
  const meta = PRESETS[preset];
  return {
    preset,
    fileName: overrideFileName ?? meta.fileName,
    fileType: meta.fileType,
    fileSize: meta.fileSize,
    score: meta.score,
    scoreLabel: meta.scoreLabel,
    verdict: meta.verdict,
    documentType: meta.documentType,
    issuingAuthority: meta.issuingAuthority,
    referenceId: meta.referenceId,
    scannedAt: new Date().toISOString(),
    modules: meta.modules,
    boxes: meta.boxes,
    pixelForensics: meta.pixelForensics,
    textLayers: meta.textLayers,
    tamperingReasons: meta.tamperingReasons,
    extractedFields: meta.extractedFields,
  };
}

export function toVaultEntry(r: ScanResult): VaultEntry {
  const meta = PRESETS[r.preset];
  const flagged = r.boxes.length;
  return {
    id: crypto.randomUUID(),
    fileName: r.fileName,
    scannedAt: r.scannedAt,
    integrityScore: r.score,
    verdict: r.verdict,
    verdictLabel: meta.scoreLabel.split(' - ')[1] ?? meta.scoreLabel,
    documentType: r.documentType,
    referenceId: r.referenceId,
    flaggedRegions: flagged,
  };
}

export const SEED_VAULT: VaultEntry[] = [
  { id: 'v1', fileName: 'passport_valid_rohan_sharma.pdf', scannedAt: '2026-08-28T09:14:00Z', integrityScore: 98, verdict: 'authentic', verdictLabel: 'AUTHENTIC / CLEARED', documentType: 'Indian Passport', referenceId: 'MHA-PPT-2026-Z1234567', flaggedRegions: 0 },
  { id: 'v2', fileName: 'visa_forged_expiry_tampered.pdf', scannedAt: '2026-08-28T11:02:00Z', integrityScore: 34, verdict: 'tampered', verdictLabel: 'HIGH RISK / FORGERY DETECTED', documentType: 'Tourist Visa', referenceId: 'MHA-VS-2026-V9876543', flaggedRegions: 1 },
  { id: 'v3', fileName: 'idcard_identity_fraud_photo_swap.jpg', scannedAt: '2026-08-29T07:41:00Z', integrityScore: 12, verdict: 'tampered', verdictLabel: 'CRITICAL ALERT / FRAUD DETECTED', documentType: 'National ID Card', referenceId: 'MHA-IDF-2026-99887766', flaggedRegions: 1 },
  { id: 'v4', fileName: 'pan_finance_7733.pdf', scannedAt: '2026-08-29T13:25:00Z', integrityScore: 73, verdict: 'suspicious', verdictLabel: 'SUSPICIOUS', documentType: 'PAN Card', referenceId: 'NCRB-2026-552310', flaggedRegions: 1 },
  { id: 'v5', fileName: 'voterid_ward12_901.pdf', scannedAt: '2026-08-30T06:08:00Z', integrityScore: 88, verdict: 'authentic', verdictLabel: 'AUTHENTIC / CLEARED', documentType: 'Voter ID (EPIC)', referenceId: 'MHA-2026-441988', flaggedRegions: 0 },
];

export const SEED_FRAUD = [
  { id: 'f1', referenceId: 'MHA-VS-2026-V9876543', documentType: 'Tourist Visa', matchedAt: '2026-08-28T11:04:00Z', matchType: 'Cloned Seal' as const, confidence: 0.76, register: 'Regional Forgery DB' as const, status: 'flagged' as const },
  { id: 'f2', referenceId: 'MHA-IDF-2026-99887766', documentType: 'National ID Card', matchedAt: '2026-08-29T07:43:00Z', matchType: 'Face Swap' as const, confidence: 0.86, register: 'MHA National Watchlist' as const, status: 'flagged' as const },
  { id: 'f3', referenceId: 'NCRB-2026-552310', documentType: 'PAN Card', matchedAt: '2026-08-29T13:27:00Z', matchType: 'Template Forgery' as const, confidence: 0.68, register: 'MHA National Watchlist' as const, status: 'under_review' as const },
  { id: 'f4', referenceId: 'UIDAI-2026-882001', documentType: 'Aadhaar Card', matchedAt: '2026-08-27T15:50:00Z', matchType: 'Synthetic Identity' as const, confidence: 0.81, register: 'UIDAI Duplicate Registry' as const, status: 'flagged' as const },
  { id: 'f5', referenceId: 'MEA-2026-220917', documentType: 'Indian Passport', matchedAt: '2026-08-26T10:11:00Z', matchType: 'Stolen Identity' as const, confidence: 0.93, register: 'Interpol Stolen Travel Documents' as const, status: 'flagged' as const },
  { id: 'f6', referenceId: 'NCRB-2026-331455', documentType: 'PAN Card', matchedAt: '2026-08-25T18:34:00Z', matchType: 'Stolen Identity' as const, confidence: 0.58, register: 'Interpol Stolen Travel Documents' as const, status: 'cleared' as const },
];

export const TELEMETRY_SERIES = [
  { label: 'Documents / hour', values: [42, 55, 48, 61, 73, 68, 80, 92, 86, 99, 104, 118], color: '#22d3ee' },
  { label: 'Tamper detections / hour', values: [3, 5, 4, 8, 6, 9, 7, 12, 10, 14, 11, 16], color: '#f87171' },
  { label: 'Avg. scan latency (s)', values: [2.4, 2.2, 2.3, 2.1, 2.0, 2.1, 1.9, 2.0, 2.0, 1.8, 1.9, 1.8], color: '#facc15' },
];

export const TELEMETRY_STATS = [
  { label: 'Total documents screened', value: '12,488', delta: '+312 today', trend: 'up' as const, tone: 'good' as const },
  { label: 'Tampered documents flagged', value: '1,204', delta: '+41 today', trend: 'up' as const, tone: 'bad' as const },
  { label: 'Fraud-register matches', value: '386', delta: '+7 today', trend: 'up' as const, tone: 'warn' as const },
  { label: 'Median scan latency', value: '1.8s', delta: '-0.3s', trend: 'down' as const, tone: 'good' as const },
  { label: 'Model confidence (p95)', value: '0.94', delta: '+0.01', trend: 'up' as const, tone: 'good' as const },
  { label: 'System uptime (30d)', value: '99.97%', delta: 'stable', trend: 'flat' as const, tone: 'neutral' as const },
];
