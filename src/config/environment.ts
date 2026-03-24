const DEFAULT_PORT = 3000;
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3001',
  'http://127.0.0.1:3001',
];

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  return value.trim().toLowerCase() === 'true';
}

export function getPort(): number {
  const rawPort = Number(process.env.PORT ?? DEFAULT_PORT);

  if (!Number.isInteger(rawPort) || rawPort <= 0) {
    return DEFAULT_PORT;
  }

  return rawPort;
}

export function getAllowedOrigins(): string[] {
  const rawOrigins = process.env.FRONTEND_URLS?.trim();

  if (!rawOrigins) {
    return DEFAULT_ALLOWED_ORIGINS;
  }

  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function getDatabasePath(): string {
  return process.env.DATABASE_PATH?.trim() || 'db.sqlite';
}

export function shouldSynchronizeDatabase(): boolean {
  return parseBoolean(
    process.env.DB_SYNCHRONIZE,
    process.env.NODE_ENV !== 'production',
  );
}
