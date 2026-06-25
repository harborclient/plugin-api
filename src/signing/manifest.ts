import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const PLUGIN_ID_PATTERN = /^[a-zA-Z][a-zA-Z0-9.-]*\.[a-zA-Z][a-zA-Z0-9.-]+$/;

/**
 * Minimal manifest fields required for plugin signing.
 */
export interface PluginManifestIdentity {
  id: string;
  version: string;
}

/**
 * Reads and validates plugin id and version from manifest.json.
 *
 * @param pluginDir - Plugin root directory containing manifest.json.
 * @returns Parsed manifest identity fields.
 * @throws When manifest.json is missing, invalid JSON, or fails validation.
 */
export function readPluginManifestIdentity(pluginDir: string): PluginManifestIdentity {
  const manifestPath = join(pluginDir, 'manifest.json');
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(manifestPath, 'utf8')) as unknown;
  } catch (error) {
    throw new Error(`Plugin manifest is not valid JSON: ${manifestPath}`, { cause: error });
  }

  if (typeof raw !== 'object' || raw == null) {
    throw new Error(`Plugin manifest must be a JSON object: ${manifestPath}`);
  }

  const record = raw as Record<string, unknown>;
  const id = record.id;
  const version = record.version;

  if (typeof id !== 'string' || !PLUGIN_ID_PATTERN.test(id)) {
    throw new Error(`Plugin manifest id is invalid: ${manifestPath}`);
  }
  if (typeof version !== 'string' || version.trim().length === 0) {
    throw new Error(`Plugin manifest version is invalid: ${manifestPath}`);
  }

  return { id, version };
}
