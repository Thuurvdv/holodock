// @ts-nocheck
export function clone<T>(value: T): T {
  if (foundry?.utils?.deepClone) return foundry.utils.deepClone(value);
  if (foundry?.utils?.duplicate) return foundry.utils.duplicate(value);
  return JSON.parse(JSON.stringify(value ?? {}));
}

export function createId(prefix = "hd"): string {
  const id = foundry?.utils?.randomID?.() ?? crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${id}`;
}

export function escapeHtml(value: unknown): string {
  if (foundry?.utils?.escapeHTML) return foundry.utils.escapeHTML(String(value ?? ""));
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

export function requireGM(action = "edit HoloDock"): boolean {
  if (game.user?.isGM) return true;
  ui.notifications?.warn?.(`Only a GM can ${action}.`);
  return false;
}
