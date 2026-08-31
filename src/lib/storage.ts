import type { VaultEntry } from './types';
import { SEED_VAULT } from './scanData';

const KEY = 'sthira_vault_v1';

export function loadVault(): VaultEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return SEED_VAULT;
    const parsed = JSON.parse(raw) as VaultEntry[];
    if (!Array.isArray(parsed) || parsed.length === 0) return SEED_VAULT;
    return parsed;
  } catch {
    return SEED_VAULT;
  }
}

export function saveVault(entries: VaultEntry[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    // storage full or unavailable — silently degrade to in-memory
  }
}
