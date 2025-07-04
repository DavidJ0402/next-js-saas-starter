// lib/db/drizzle.ts

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Evita usar dotenv aquí, Next.js ya carga las variables de entorno automáticamente desde `.env.local`
// dotenv.config(); ← ¡NO ES NECESARIO EN NEXT.JS!

// Validación explícita de la variable
const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const client = postgres(connectionString, {
  max: 1, // Para evitar múltiples conexiones en serverless/Edge
});

export const db = drizzle(client, { schema });
