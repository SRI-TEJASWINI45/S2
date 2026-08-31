import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { LiveScreeningRoom } from '@/components/LiveScreeningRoom';
import { BatchForensicVault } from '@/components/BatchForensicVault';
import { LocalFraudRegisters } from '@/components/LocalFraudRegisters';
import { SystemTelemetryMetrics } from '@/components/SystemTelemetryMetrics';
import type { ScanResult, VaultEntry, ViewId } from '@/lib/types';
import { SEED_FRAUD, toVaultEntry } from '@/lib/scanData';
import { loadVault, saveVault } from '@/lib/storage';

function App() {
  const [view, setView] = useState<ViewId>('screening');
  const [vault, setVault] = useState<VaultEntry[]>(() => loadVault());

  const handleScanComplete = (result: ScanResult) => {
    setVault((v) => {
      const updated = [toVaultEntry(result), ...v];
      saveVault(updated);
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-ink-950 text-slate-200 flex">
      <Sidebar active={view} onChange={setView} />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar view={view} />
        <main className="flex-1 px-6 py-6">
          {view === 'screening' && <LiveScreeningRoom onScanComplete={handleScanComplete} />}
          {view === 'vault' && <BatchForensicVault entries={vault} />}
          {view === 'registers' && <LocalFraudRegisters records={SEED_FRAUD} />}
          {view === 'telemetry' && <SystemTelemetryMetrics />}
        </main>
      </div>
    </div>
  );
}

export default App;
