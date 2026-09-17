const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "anthropic/claude-sonnet-5";

const SYSTEM_PROMPT = `You are a senior DevOps troubleshooting assistant embedded in a monitoring dashboard.

You will be given system context (logs, container status, or infrastructure state). Analyze it and respond with a diagnosis.

You MUST respond with ONLY a valid JSON object, no markdown formatting, no code fences, no preamble. The JSON must match this exact shape:

{
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "problem": "one sentence describing the core problem",
  "possibleCauses": ["cause 1", "cause 2"],
  "recommendations": ["action 1", "action 2", "action 3"],
  "commands": ["command 1", "command 2"]
}

Keep each string concise and technical. Do not include any text outside the JSON object.`;

async function callOpenRouter(userContent) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set in .env.local");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "DevOps AI Copilot",
    },

    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `OpenRouter error (${response.status}): ${errorText}`
    );
  }

  const data = await response.json();

  const rawText = data.choices?.[0]?.message?.content;

  if (!rawText) {
    throw new Error("OpenRouter returned an empty response");
  }

  return parseAiJson(rawText);
}

export async function analyzeLogs(logText) {
  return callOpenRouter(
    `Analyze the following infrastructure logs:\n\n${logText}`
  );
}

export async function analyzeIncident(systemState) {
  return callOpenRouter(
    `Analyze the following system state and identify the incident:\n\n${systemState}`
  );
}

function parseAiJson(rawText) {
  const cleaned = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    throw new Error(
      "AI returned invalid JSON: " + cleaned.slice(0, 200)
    );
  }
}
export async function analyzeIncidentFromSystemState({ containers, metrics }) {
  const problemContainers = containers.filter(
    (c) => c.status === "restarting" || c.status === "warning"
  );

  const contextText = `
SYSTEM METRICS
CPU: ${metrics.cpu}%
Memory: ${metrics.memory}%
Disk: ${metrics.disk}%

DOCKER CONTAINERS
${containers.map((c) => `- ${c.name}: ${c.status} (CPU: ${c.cpu}, Memory: ${c.memory})`).join("\n")}

PROBLEM CONTAINERS DETECTED
${problemContainers.map((c) => `- ${c.name} is ${c.status}`).join("\n") || "None"}
`.trim();

  return callOpenRouter(
    `Analyze the following system state and identify the incident:\n\n${contextText}`
  );
}