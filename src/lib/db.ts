import * as SQLite from 'expo-sqlite';

const getDB = async () => {
  return await SQLite.openDatabaseAsync('raah_routes.db');
};

export const initDB = async () => {
  const db = await getDB();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS routes_cache (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);
};

export const cacheRoutes = async (routes: any[]) => {
  const db = await getDB();
  const statement = await db.prepareAsync(
    'INSERT OR REPLACE INTO routes_cache (id, data, updated_at) VALUES ($id, $data, $updated_at)'
  );
  
  for (const route of routes) {
    await statement.executeAsync({
      $id: route.id,
      $data: JSON.stringify(route),
      $updated_at: Date.now()
    });
  }
  await statement.finalizeAsync();
};

export const getCachedRoutes = async () => {
  try {
    const db = await getDB();
    const rows = await db.getAllAsync('SELECT data FROM routes_cache');
    return rows.map((row: any) => JSON.parse(row.data));
  } catch (err) {
    console.error("Failed to fetch cached routes", err);
    return [];
  }
};
