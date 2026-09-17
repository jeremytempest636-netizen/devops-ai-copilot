import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "incidents.json");

async function readAll() {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

async function writeAll(incidents) {
  await fs.writeFile(DB_PATH, JSON.stringify(incidents, null, 2), "utf-8");
}

export async function getIncidents() {
  const incidents = await readAll();
  return incidents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getIncidentById(id) {
  const incidents = await readAll();
  return incidents.find((i) => i.id === id) || null;
}

export async function createIncident(diagnosis, source) {
  const incidents = await readAll();

  const newIncident = {
    id: `INC-${String(incidents.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
    status: "open",
    source, // "manual-log" | "auto-detection"
    ...diagnosis,
  };

  incidents.push(newIncident);
  await writeAll(incidents);

  return newIncident;
}

export async function resolveIncident(id) {
  const incidents = await readAll();
  const incident = incidents.find((i) => i.id === id);
  if (incident) {
    incident.status = "resolved";
    incident.resolvedAt = new Date().toISOString();
    await writeAll(incidents);
  }
  return incident;
}
export async function clearAllIncidents() {
  await writeAll([]);
}