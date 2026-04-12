import Dexie, { type Table } from 'dexie';

export interface Memory {
  id?: number;
  title: string;
  description: string;
  date: Date;
  image?: string; // Base64 string for local storage
  createdAt: Date;
}

export interface Settings {
  id?: number;
  key: string;
  value: any;
}

export class EverlastingDB extends Dexie {
  memories!: Table<Memory>;
  settings!: Table<Settings>;

  constructor() {
    super('EverlastingDB');
    this.version(1).stores({
      memories: '++id, date, createdAt',
      settings: '++id, key'
    });
  }
}

export const db = new EverlastingDB();

// Helper to get/set settings
export async function getSetting(key: string, defaultValue: any = null) {
  const setting = await db.settings.where('key').equals(key).first();
  return setting ? setting.value : defaultValue;
}

export async function setSetting(key: string, value: any) {
  const existing = await db.settings.where('key').equals(key).first();
  if (existing) {
    await db.settings.update(existing.id!, { value });
  } else {
    await db.settings.add({ key, value });
  }
}
