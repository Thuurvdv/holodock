import type { HoloSuiteAppRegistration } from "../../shared/src/index";
import { getApplicationBase } from "../../shared/src/application-base";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_IMAGE,
  FLAG_SHIP_EQUIPMENT,
  LEGACY_DEFAULT_IMAGE,
  MODULE_ID,
  MODULE_TITLE,
  SETTING_CATEGORIES,
  SETTING_DEFAULT_PROFILE,
  SETTING_PROFILES,
  TEMPLATE_PATH
} from "./constants";
import { clone, createId, escapeHtml, requireGM } from "./utils";

type ShipSlot = {
  id: string;
  label: string;
  category: string;
  description: string;
  requireShipEquipment: boolean;
  requiredCategory: string;
  requiredTags: string[];
  allowUntagged: boolean;
  anchorX?: number;
  anchorY?: number;
  itemUuid?: string;
};

type ShipStat = {
  id: string;
  label: string;
  value: string;
  note: string;
};

type ShipPowerPresetEntry = {
  slotId: string;
  allocated: number;
  online: boolean;
};

type ShipPowerPreset = {
  id: string;
  name: string;
  entries: ShipPowerPresetEntry[];
};

type ShipProfile = {
  id: string;
  name: string;
  shipClass: string;
  image: string;
  powerCapacity: number;
  powerPresets: ShipPowerPreset[];
  stats: ShipStat[];
  slots: ShipSlot[];
};

type ShipEquipmentData = {
  enabled: boolean;
  category: string;
  tags: string[];
  activation: {
    enabled: boolean;
    label: string;
    actionType: string;
    cooldown: number;
    resourceCost: string;
    durabilityCost: number;
    blockWhenBroken: boolean;
    lastActivatedAt: number;
  };
  durability: {
    enabled: boolean;
    value: number;
    max: number;
    brokenAt: number;
  };
  power: {
    enabled: boolean;
    draw: number;
    allocated: number;
    online: boolean;
  };
};

type ActivationResult = {
  ok: boolean;
  handled: boolean;
  blocked: boolean;
  message: string;
  consequences?: string[];
};

type EquipmentPickOption = {
  id: string;
  uuid: string;
  name: string;
  img: string;
  type: string;
  status: string;
  compatible: boolean;
  reason: string;
  shipEquipment: boolean;
  category: string;
  tagsText: string;
};

type ShipPowerBudget = {
  capacity: number;
  used: number;
  remaining: number;
  overage: number;
  hasCapacity: boolean;
  isOverBudget: boolean;
  summary: string;
};

type PowerPresetPreviewChange = {
  slotId: string;
  itemName: string;
  slotLabel: string;
  currentText: string;
  targetText: string;
  stateClass: string;
};

const LegacyApplication = getApplicationBase();

let holodockApp: HoloDockApp | null = null;
let selectedProfileId = "";
let selectedPage = "overview";
let selectedEquipmentSlotId = "";

const HOLODOCK_PAGES = [
  { id: "overview", label: "Overview", icon: "fa-solid fa-display" },
  { id: "systems", label: "Systems", icon: "fa-solid fa-microchip" },
  { id: "power", label: "Power Grid", icon: "fa-solid fa-bolt" },
  { id: "damage", label: "Damage", icon: "fa-solid fa-shield-halved" },
  { id: "speed", label: "Speed", icon: "fa-solid fa-gauge-high" },
  { id: "capacity", label: "Capacity", icon: "fa-solid fa-users" }
];

function normalizeSlot(data: Partial<ShipSlot> = {}): ShipSlot {
  const anchorX = Number(data.anchorX);
  const anchorY = Number(data.anchorY);
  return {
    id: String(data.id || createId("slot")),
    label: String(data.label || "Equipment Slot").trim() || "Equipment Slot",
    category: String(data.category || DEFAULT_CATEGORIES[0]).trim() || DEFAULT_CATEGORIES[0],
    description: String(data.description || "").trim(),
    requireShipEquipment: data.requireShipEquipment === true,
    requiredCategory: String(data.requiredCategory || "").trim(),
    requiredTags: Array.isArray(data.requiredTags)
      ? data.requiredTags.map((tag) => String(tag).trim()).filter(Boolean)
      : [],
    allowUntagged: data.allowUntagged !== false,
    anchorX: Number.isFinite(anchorX) ? Math.min(100, Math.max(0, anchorX)) : undefined,
    anchorY: Number.isFinite(anchorY) ? Math.min(100, Math.max(0, anchorY)) : undefined,
    itemUuid: String(data.itemUuid || "").trim() || undefined
  };
}

function normalizeStat(data: Partial<ShipStat> = {}): ShipStat {
  return {
    id: String(data.id || createId("stat")),
    label: String(data.label || "Statistic").trim() || "Statistic",
    value: String(data.value || "").trim(),
    note: String(data.note || "").trim()
  };
}

function normalizePowerPresetEntry(data: Partial<ShipPowerPresetEntry> = {}): ShipPowerPresetEntry {
  return {
    slotId: String(data.slotId || "").trim(),
    allocated: Math.max(0, normalizeNumber(data.allocated, 0)),
    online: data.online !== false
  };
}

function normalizePowerPreset(data: Partial<ShipPowerPreset> = {}): ShipPowerPreset {
  return {
    id: String(data.id || createId("preset")),
    name: String(data.name || "Power Preset").trim() || "Power Preset",
    entries: Array.isArray(data.entries)
      ? data.entries.map(normalizePowerPresetEntry).filter((entry) => entry.slotId)
      : []
  };
}

function normalizeProfile(data: Partial<ShipProfile> = {}): ShipProfile {
  const image = String(data.image || DEFAULT_IMAGE).trim() || DEFAULT_IMAGE;
  return {
    id: String(data.id || createId("ship")),
    name: String(data.name || "Party Ship").trim() || "Party Ship",
    shipClass: String(data.shipClass || "").trim(),
    image: image === LEGACY_DEFAULT_IMAGE ? DEFAULT_IMAGE : image,
    powerCapacity: Math.max(0, normalizeNumber(data.powerCapacity, 0)),
    powerPresets: Array.isArray(data.powerPresets) ? data.powerPresets.map(normalizePowerPreset) : [],
    stats: Array.isArray(data.stats) ? data.stats.map(normalizeStat) : [],
    slots: Array.isArray(data.slots) ? data.slots.map(normalizeSlot) : []
  };
}

function normalizeNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((tag) => String(tag).trim()).filter(Boolean);
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function checkedAttr(value: boolean): string {
  return value ? "checked" : "";
}

function normalizeShipEquipmentData(data: Partial<ShipEquipmentData> = {}): ShipEquipmentData {
  const durabilityMax = Math.max(0, normalizeNumber(data.durability?.max, 0));
  const durabilityValue = Math.min(durabilityMax, Math.max(0, normalizeNumber(data.durability?.value, durabilityMax)));
  const category = String(data.category || DEFAULT_CATEGORIES[0]).trim() || DEFAULT_CATEGORIES[0];
  return {
    enabled: data.enabled === true,
    category,
    tags: normalizeTags(data.tags),
    activation: {
      enabled: data.activation?.enabled === true,
      label: String(data.activation?.label || "Activate").trim() || "Activate",
      actionType: String(data.activation?.actionType || "").trim(),
      cooldown: Math.max(0, normalizeNumber(data.activation?.cooldown, 0)),
      resourceCost: String(data.activation?.resourceCost || "").trim(),
      durabilityCost: Math.max(0, normalizeNumber(data.activation?.durabilityCost, 0)),
      blockWhenBroken: data.activation?.blockWhenBroken !== false,
      lastActivatedAt: Math.max(0, normalizeNumber(data.activation?.lastActivatedAt, 0))
    },
    durability: {
      enabled: data.durability?.enabled === true,
      value: durabilityValue,
      max: durabilityMax,
      brokenAt: Math.max(0, normalizeNumber(data.durability?.brokenAt, 0))
    },
    power: {
      enabled: data.power?.enabled === true,
      draw: Math.max(0, normalizeNumber(data.power?.draw, 0)),
      allocated: Math.max(0, normalizeNumber(data.power?.allocated, data.power?.draw ?? 0)),
      online: data.power?.online !== false
    }
  };
}

function getShipEquipmentData(item: any): ShipEquipmentData {
  return normalizeShipEquipmentData(item?.getFlag?.(MODULE_ID, FLAG_SHIP_EQUIPMENT) ?? {});
}

function isShipEquipment(item: any): boolean {
  return getShipEquipmentData(item).enabled;
}

async function setShipEquipmentData(item: any, data: Partial<ShipEquipmentData>, options: { requireGm?: boolean } = {}): Promise<ShipEquipmentData | null> {
  if (options.requireGm !== false && !requireGM("tag ship equipment")) return null;
  if (!item?.setFlag) return null;
  const current = getShipEquipmentData(item);
  const normalized = normalizeShipEquipmentData({
    ...current,
    ...data,
    tags: data.tags ?? current.tags,
    activation: {
      ...current.activation,
      ...data.activation
    },
    durability: {
      ...current.durability,
      ...data.durability
    },
    power: {
      ...current.power,
      ...data.power
    }
  });
  if (!normalized.enabled) {
    await item.unsetFlag?.(MODULE_ID, FLAG_SHIP_EQUIPMENT);
    refreshOpenApp();
    return normalized;
  }
  await item.setFlag(MODULE_ID, FLAG_SHIP_EQUIPMENT, normalized);
  await rememberCategory(normalized.category);
  refreshOpenApp();
  return normalized;
}

async function updateShipEquipmentDurability(item: any, value: number, options: { requireGm?: boolean } = {}): Promise<ShipEquipmentData | null> {
  const current = getShipEquipmentData(item);
  const max = Math.max(0, current.durability.max);
  const clampedValue = Math.min(max, Math.max(0, normalizeNumber(value, current.durability.value)));
  return setShipEquipmentData(item, {
    enabled: current.enabled,
    durability: {
      ...current.durability,
      value: clampedValue
    }
  }, options);
}

async function updateShipEquipmentPowerState(item: any, online: boolean): Promise<ShipEquipmentData | null> {
  const current = getShipEquipmentData(item);
  if (!current.enabled || !current.power.enabled) return null;
  return setShipEquipmentData(item, {
    enabled: current.enabled,
    power: {
      ...current.power,
      online: online === true
    }
  });
}

async function updateShipEquipmentPowerAllocation(item: any, allocated: number): Promise<ShipEquipmentData | null> {
  const current = getShipEquipmentData(item);
  if (!current.enabled || !current.power.enabled) return null;
  return setShipEquipmentData(item, {
    enabled: current.enabled,
    power: {
      ...current.power,
      allocated: Math.max(0, normalizeNumber(allocated, current.power.allocated))
    }
  });
}

function getDurabilityState(equipment: ShipEquipmentData): { isBroken: boolean; isDamaged: boolean; value: number; max: number } {
  const durability = equipment.durability;
  const hasDurability = equipment.enabled && durability.enabled;
  const max = Math.max(0, durability.max);
  const value = Math.min(max, Math.max(0, durability.value));
  const isBroken = hasDurability && value <= durability.brokenAt;
  const isDamaged = hasDurability && !isBroken && max > 0 && value < max;
  return { isBroken, isDamaged, value, max };
}

async function createActivationChatCard(item: any, result: ActivationResult, context: Record<string, unknown> = {}): Promise<void> {
  const chatMessage = (globalThis as any).ChatMessage;
  if (!chatMessage?.create) return;
  const equipment = getShipEquipmentData(item);
  const durability = getDurabilityState(equipment);
  const slot = context.slot as ShipSlot | undefined;
  const profile = context.profile as ShipProfile | undefined;
  const outcome = result.blocked || !result.ok ? "Blocked" : result.handled ? "Activated" : "Unhandled";
  const content = `
    <article class="hd-chat-card ${result.blocked || !result.ok ? "is-blocked" : "is-activated"}">
      <header>
        <img src="${escapeHtml(item?.img || "icons/svg/item-bag.svg")}" alt="">
        <div>
          <p class="hd-kicker">HoloDock Activation</p>
          <h3>${escapeHtml(item?.name ?? "Ship Equipment")}</h3>
        </div>
      </header>
      <dl>
        <div><dt>Outcome</dt><dd>${escapeHtml(outcome)}</dd></div>
        ${profile ? `<div><dt>Ship</dt><dd>${escapeHtml(profile.name)}</dd></div>` : ""}
        ${slot ? `<div><dt>Slot</dt><dd>${escapeHtml(slot.label)}</dd></div>` : ""}
        ${equipment.activation.actionType ? `<div><dt>Action</dt><dd>${escapeHtml(equipment.activation.actionType)}</dd></div>` : ""}
        ${equipment.activation.resourceCost ? `<div><dt>Resource</dt><dd>${escapeHtml(equipment.activation.resourceCost)}</dd></div>` : ""}
        ${equipment.activation.cooldown ? `<div><dt>Cooldown</dt><dd>${equipment.activation.cooldown} rounds</dd></div>` : ""}
        ${equipment.durability.enabled ? `<div><dt>Durability</dt><dd>${durability.value} / ${durability.max}</dd></div>` : ""}
      </dl>
      ${result.consequences?.length ? `<ul>${result.consequences.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}</ul>` : ""}
      ${result.message ? `<p>${escapeHtml(result.message)}</p>` : ""}
    </article>
  `;
  await chatMessage.create({
    user: game.user?.id,
    speaker: chatMessage.getSpeaker?.() ?? {},
    content
  });
}

async function activateEquipment(item: any, context: Record<string, unknown> = {}): Promise<ActivationResult> {
  const equipment = getShipEquipmentData(item);
  if (!equipment.enabled || !equipment.activation.enabled) {
    return { ok: false, handled: false, blocked: true, message: "That item is not configured as activatable ship equipment." };
  }

  if (equipment.power.enabled && !equipment.power.online) {
    const result = { ok: false, handled: false, blocked: true, message: "That ship equipment is offline." };
    await createActivationChatCard(item, result, context);
    return result;
  }

  if (equipment.power.enabled && equipment.power.allocated < equipment.power.draw) {
    const result = { ok: false, handled: false, blocked: true, message: "That ship equipment does not have enough allocated power." };
    await createActivationChatCard(item, result, context);
    return result;
  }

  const durabilityState = getDurabilityState(equipment);
  if (equipment.activation.blockWhenBroken && durabilityState.isBroken) {
    const result = { ok: false, handled: false, blocked: true, message: "That ship equipment is broken." };
    await createActivationChatCard(item, result, context);
    return result;
  }

  const now = Date.now();
  const cooldownMs = Math.max(0, equipment.activation.cooldown) * 6000;
  if (cooldownMs > 0 && equipment.activation.lastActivatedAt > 0) {
    const readyAt = equipment.activation.lastActivatedAt + cooldownMs;
    if (readyAt > now) {
      const remaining = Math.max(1, Math.ceil((readyAt - now) / 6000));
      const result = {
        ok: false,
        handled: false,
        blocked: true,
        message: `That ship equipment is cooling down for ${remaining} more round${remaining === 1 ? "" : "s"}.`,
        consequences: [`Cooldown remaining: ${remaining} round${remaining === 1 ? "" : "s"}`]
      };
      await createActivationChatCard(item, result, context);
      return result;
    }
  }

  if (equipment.activation.durabilityCost > 0 && equipment.durability.enabled && durabilityState.value <= 0) {
    const result = {
      ok: false,
      handled: false,
      blocked: true,
      message: "That ship equipment has no durability left to spend.",
      consequences: [`Required durability: ${equipment.activation.durabilityCost}`]
    };
    await createActivationChatCard(item, result, context);
    return result;
  }

  const activation = {
    item,
    equipment,
    durabilityState,
    handled: false,
    blocked: false,
    message: "",
    consequences: [] as string[],
    ...context
  };
  Hooks.callAll(`${MODULE_ID}.activateEquipment`, activation);

  if (activation.blocked) {
    const result = {
      ok: false,
      handled: activation.handled === true,
      blocked: true,
      message: String(activation.message || "Ship equipment activation was blocked."),
      consequences: activation.consequences
    };
    await createActivationChatCard(item, result, context);
    return result;
  }

  const consequences = [...activation.consequences];
  const activationUpdate: Partial<ShipEquipmentData> = {
    enabled: equipment.enabled,
    activation: {
      ...equipment.activation,
      lastActivatedAt: now
    }
  };
  if (equipment.activation.durabilityCost > 0 && equipment.durability.enabled) {
    const nextDurability = Math.max(0, durabilityState.value - equipment.activation.durabilityCost);
    activationUpdate.durability = {
      ...equipment.durability,
      value: nextDurability
    };
    consequences.push(`Durability spent: ${equipment.activation.durabilityCost} (${nextDurability}/${durabilityState.max} remaining)`);
  }
  if (equipment.activation.resourceCost) {
    consequences.push(`Resource cost: ${equipment.activation.resourceCost}`);
  }
  if (equipment.activation.cooldown > 0) {
    consequences.push(`Cooldown started: ${equipment.activation.cooldown} round${equipment.activation.cooldown === 1 ? "" : "s"}`);
  }
  let savedConsequences = false;
  try {
    savedConsequences = Boolean(await setShipEquipmentData(item, activationUpdate, { requireGm: false }));
  } catch (error) {
    console.warn(`${MODULE_TITLE} | Failed to save activation consequences`, error);
  }
  if (!savedConsequences && consequences.length) {
    consequences.push("Consequence state could not be saved; check item permissions.");
  }

  const handled = activation.handled === true || consequences.length > 0;
  const result = {
    ok: true,
    handled,
    blocked: false,
    message: String(activation.message || (handled ? "Ship equipment activated." : "No system handled this ship equipment activation.")),
    consequences
  };
  Hooks.callAll(`${MODULE_ID}.equipmentActivated`, { item, equipment: getShipEquipmentData(item), result, ...context });
  await createActivationChatCard(item, result, context);
  return result;
}

function getProfileStore(): Record<string, ShipProfile> {
  const raw = game.settings.get(MODULE_ID, SETTING_PROFILES);
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const normalized: Record<string, ShipProfile> = {};
  for (const profile of Object.values(raw as Record<string, ShipProfile>)) {
    const ship = normalizeProfile(profile);
    normalized[ship.id] = ship;
  }
  return normalized;
}

function getProfiles(): ShipProfile[] {
  return Object.values(getProfileStore()).sort((left, right) => left.name.localeCompare(right.name));
}

function getDefaultProfileId(): string {
  return String(game.settings.get(MODULE_ID, SETTING_DEFAULT_PROFILE) || "");
}

async function setDefaultProfileId(profileId: string): Promise<void> {
  await game.settings.set(MODULE_ID, SETTING_DEFAULT_PROFILE, profileId);
}

async function saveProfileStore(profiles: Record<string, ShipProfile>): Promise<void> {
  if (!requireGM("save ship loadouts")) return;
  await game.settings.set(MODULE_ID, SETTING_PROFILES, profiles);
  refreshOpenApp();
}

function getCategories(): string[] {
  const raw = game.settings.get(MODULE_ID, SETTING_CATEGORIES);
  const categories = Array.isArray(raw) ? raw.map((entry) => String(entry).trim()).filter(Boolean) : [];
  return categories.length ? [...new Set(categories)] : DEFAULT_CATEGORIES;
}

async function rememberCategory(category: string): Promise<void> {
  const cleaned = String(category || "").trim();
  if (!cleaned || !game.user?.isGM) return;
  const categories = getCategories();
  if (categories.some((entry) => entry.toLowerCase() === cleaned.toLowerCase())) return;
  await game.settings.set(MODULE_ID, SETTING_CATEGORIES, [...categories, cleaned]);
}

function getSelectedProfile(): ShipProfile | null {
  const profiles = getProfiles();
  if (!profiles.length) return null;
  if (!selectedProfileId || !profiles.some((profile) => profile.id === selectedProfileId)) {
    const defaultProfileId = getDefaultProfileId();
    selectedProfileId = profiles.some((profile) => profile.id === defaultProfileId) ? defaultProfileId : profiles[0].id;
  }
  return profiles.find((profile) => profile.id === selectedProfileId) ?? null;
}

function getProfile(profileId = selectedProfileId): ShipProfile | null {
  const profile = getProfileStore()[profileId];
  return profile ? normalizeProfile(profile) : null;
}

async function createProfile(): Promise<ShipProfile | null> {
  if (!requireGM("create ship profiles")) return null;
  const profile = normalizeProfile({
    id: createId("ship"),
    name: "New Ship",
    shipClass: "",
    image: DEFAULT_IMAGE,
    powerCapacity: 0,
    stats: [
      normalizeStat({ id: createId("stat"), label: "Speed", value: "6", note: "" }),
      normalizeStat({ id: createId("stat"), label: "Cruise Speed", value: "4", note: "Efficient travel" }),
      normalizeStat({ id: createId("stat"), label: "Fuel", value: "100%", note: "" }),
      normalizeStat({ id: createId("stat"), label: "Defense", value: "10", note: "" }),
      normalizeStat({ id: createId("stat"), label: "Capacity", value: "6", note: "Crew and passengers" }),
      normalizeStat({ id: createId("stat"), label: "Cargo", value: "2 tons", note: "Available hold" })
    ],
    slots: DEFAULT_CATEGORIES.slice(0, 4).map((category) => normalizeSlot({
      id: createId("slot"),
      label: category,
      category
    }))
  });
  const profiles = clone(getProfileStore());
  profiles[profile.id] = profile;
  selectedProfileId = profile.id;
  await setDefaultProfileId(profile.id);
  await saveProfileStore(profiles);
  return profile;
}

async function updateProfileMetadata(profileId: string, metadata: Partial<ShipProfile>): Promise<ShipProfile | null> {
  if (!requireGM("update ship profiles")) return null;
  const profiles = clone(getProfileStore());
  const existing = profiles[profileId];
  if (!existing) return null;
  const updated = normalizeProfile({
    ...existing,
    name: metadata.name,
    shipClass: metadata.shipClass,
    image: metadata.image,
    powerCapacity: metadata.powerCapacity,
    powerPresets: existing.powerPresets,
    stats: existing.stats,
    slots: existing.slots
  });
  profiles[profileId] = updated;
  await saveProfileStore(profiles);
  return updated;
}

async function capturePowerPreset(profileId: string, name: string): Promise<ShipPowerPreset | null> {
  if (!requireGM("save power presets")) return null;
  const profiles = clone(getProfileStore());
  const profile = profiles[profileId];
  if (!profile) return null;
  const entries: ShipPowerPresetEntry[] = [];
  for (const slot of profile.slots) {
    if (!slot.itemUuid) continue;
    const item = await resolveItem(slot.itemUuid);
    const equipment = getShipEquipmentData(item);
    if (!equipment.enabled || !equipment.power.enabled) continue;
    entries.push(normalizePowerPresetEntry({
      slotId: slot.id,
      allocated: equipment.power.allocated,
      online: equipment.power.online
    }));
  }
  if (!entries.length) {
    ui.notifications?.warn?.("No powered ship equipment is currently slotted.");
    return null;
  }
  const preset = normalizePowerPreset({
    id: createId("preset"),
    name,
    entries
  });
  profile.powerPresets = [...(profile.powerPresets ?? []), preset];
  profiles[profileId] = normalizeProfile(profile);
  await saveProfileStore(profiles);
  return preset;
}

async function deletePowerPreset(profileId: string, presetId: string): Promise<boolean> {
  if (!requireGM("delete power presets")) return false;
  const profiles = clone(getProfileStore());
  const profile = profiles[profileId];
  if (!profile) return false;
  const preset = profile.powerPresets?.find((candidate) => candidate.id === presetId);
  if (!preset) return false;
  const confirmed = await Dialog.confirm({
    title: "Delete Power Preset",
    content: `<p>Delete <strong>${escapeHtml(preset.name)}</strong>?</p>`,
    defaultYes: false
  });
  if (!confirmed) return false;
  profile.powerPresets = profile.powerPresets.filter((candidate) => candidate.id !== presetId);
  profiles[profileId] = normalizeProfile(profile);
  await saveProfileStore(profiles);
  return true;
}

async function getPowerPresetPreview(profile: ShipProfile, preset: ShipPowerPreset): Promise<{
  changes: PowerPresetPreviewChange[];
  appliedCount: number;
  missingCount: number;
  currentAllocated: number;
  targetAllocated: number;
  onlineCount: number;
  offlineCount: number;
}> {
  const changes: PowerPresetPreviewChange[] = [];
  let appliedCount = 0;
  let missingCount = 0;
  let currentAllocated = 0;
  let targetAllocated = 0;
  let onlineCount = 0;
  let offlineCount = 0;

  for (const entry of preset.entries) {
    const slot = profile.slots.find((candidate) => candidate.id === entry.slotId);
    const item = await resolveItem(slot?.itemUuid ?? "");
    const equipment = getShipEquipmentData(item);
    if (!slot || !item || !equipment.enabled || !equipment.power.enabled) {
      missingCount += 1;
      continue;
    }
    const currentOnline = equipment.power.online;
    const currentAllocation = Math.max(0, equipment.power.allocated);
    const targetAllocation = Math.max(0, entry.allocated);
    currentAllocated += currentOnline ? currentAllocation : 0;
    targetAllocated += entry.online ? targetAllocation : 0;
    if (entry.online) onlineCount += 1;
    else offlineCount += 1;
    appliedCount += 1;
    if (currentAllocation !== targetAllocation || currentOnline !== entry.online) {
      changes.push({
        slotId: slot.id,
        itemName: String(item.name ?? "Ship Equipment"),
        slotLabel: slot.label,
        currentText: `${currentOnline ? "Online" : "Offline"} / ${currentAllocation}`,
        targetText: `${entry.online ? "Online" : "Offline"} / ${targetAllocation}`,
        stateClass: entry.online ? "is-ready" : "is-offline"
      });
    }
  }

  return { changes, appliedCount, missingCount, currentAllocated, targetAllocated, onlineCount, offlineCount };
}

async function confirmPowerPresetApplication(profile: ShipProfile, preset: ShipPowerPreset): Promise<boolean> {
  const preview = await getPowerPresetPreview(profile, preset);
  if (!preview.appliedCount) {
    ui.notifications?.warn?.("That preset did not match any powered slotted equipment.");
    return false;
  }
  const changeRows = preview.changes.length
    ? preview.changes.map((change) => `
      <article class="hd-preset-preview-row ${change.stateClass}">
        <strong>${escapeHtml(change.itemName)}</strong>
        <small>${escapeHtml(change.slotLabel)}</small>
        <span>${escapeHtml(change.currentText)} -> ${escapeHtml(change.targetText)}</span>
      </article>
    `).join("")
    : `<p class="hd-muted">This preset already matches the current allocation.</p>`;
  return Dialog.confirm({
    title: `Apply ${escapeHtml(preset.name)}`,
    content: `
      <section class="hd-preset-preview">
        <div class="hd-preset-preview-summary">
          <article><span>Systems</span><strong>${preview.appliedCount}</strong></article>
          <article><span>Target</span><strong>${preview.targetAllocated}</strong></article>
          <article><span>Online</span><strong>${preview.onlineCount}/${preview.appliedCount}</strong></article>
        </div>
        ${preview.missingCount ? `<p class="hd-muted">${preview.missingCount} saved ${preview.missingCount === 1 ? "entry no longer matches" : "entries no longer match"} installed powered equipment.</p>` : ""}
        <div class="hd-preset-preview-list">${changeRows}</div>
      </section>
    `,
    defaultYes: true
  });
}

async function createPowerPresetChatCard(profile: ShipProfile, preset: ShipPowerPreset, applied: number): Promise<void> {
  const chatMessage = (globalThis as any).ChatMessage;
  if (!chatMessage?.create) return;
  const allocated = preset.entries.reduce((total, entry) => entry.online ? total + entry.allocated : total, 0);
  const online = preset.entries.filter((entry) => entry.online).length;
  await chatMessage.create({
    user: game.user?.id,
    speaker: chatMessage.getSpeaker?.() ?? {},
    content: `
      <article class="hd-chat-card is-activated">
        <header>
          <i class="fa-solid fa-sliders"></i>
          <div>
            <p class="hd-kicker">HoloDock Power Mode</p>
            <h3>${escapeHtml(preset.name)}</h3>
          </div>
        </header>
        <dl>
          <div><dt>Ship</dt><dd>${escapeHtml(profile.name)}</dd></div>
          <div><dt>Systems Applied</dt><dd>${applied}</dd></div>
          <div><dt>Target Allocation</dt><dd>${allocated}</dd></div>
          <div><dt>Online</dt><dd>${online}/${preset.entries.length}</dd></div>
        </dl>
      </article>
    `
  });
}

async function applyPowerPreset(profileId: string, presetId: string): Promise<boolean> {
  if (!requireGM("apply power presets")) return false;
  const profile = getProfile(profileId);
  const preset = profile?.powerPresets.find((candidate) => candidate.id === presetId);
  if (!profile || !preset) return false;
  if (!await confirmPowerPresetApplication(profile, preset)) return false;
  let applied = 0;
  for (const entry of preset.entries) {
    const slot = profile.slots.find((candidate) => candidate.id === entry.slotId);
    const item = await resolveItem(slot?.itemUuid ?? "");
    const equipment = getShipEquipmentData(item);
    if (!equipment.enabled || !equipment.power.enabled) continue;
    await setShipEquipmentData(item, {
      enabled: equipment.enabled,
      power: {
        ...equipment.power,
        allocated: entry.allocated,
        online: entry.online
      }
    });
    applied += 1;
  }
  if (!applied) {
    ui.notifications?.warn?.("That preset did not match any powered slotted equipment.");
    return false;
  }
  ui.notifications?.info?.(`Applied power preset: ${preset.name}`);
  await createPowerPresetChatCard(profile, preset, applied);
  refreshOpenApp();
  return true;
}

async function deleteProfile(profileId = selectedProfileId): Promise<boolean> {
  if (!requireGM("delete ship profiles")) return false;
  const profile = getProfile(profileId);
  if (!profile) return false;
  const confirmed = await Dialog.confirm({
    title: "Delete Ship Profile",
    content: `<p>Delete <strong>${escapeHtml(profile.name)}</strong>?</p>`,
    defaultYes: false
  });
  if (!confirmed) return false;
  const profiles = clone(getProfileStore());
  delete profiles[profileId];
  selectedProfileId = Object.keys(profiles)[0] ?? "";
  if (getDefaultProfileId() === profileId) await setDefaultProfileId(selectedProfileId);
  await saveProfileStore(profiles);
  return true;
}

async function upsertStat(profileId: string, statData: Partial<ShipStat>): Promise<ShipStat | null> {
  if (!requireGM("edit ship statistics")) return null;
  const profiles = clone(getProfileStore());
  const profile = profiles[profileId];
  if (!profile) return null;
  const stat = normalizeStat(statData);
  const index = profile.stats.findIndex((candidate) => candidate.id === stat.id);
  if (index >= 0) profile.stats[index] = { ...profile.stats[index], ...stat };
  else profile.stats.push(stat);
  profiles[profileId] = normalizeProfile(profile);
  await saveProfileStore(profiles);
  return stat;
}

async function deleteStat(profileId: string, statId: string): Promise<boolean> {
  if (!requireGM("delete ship statistics")) return false;
  const profiles = clone(getProfileStore());
  const profile = profiles[profileId];
  if (!profile) return false;
  const stat = profile.stats.find((candidate) => candidate.id === statId);
  if (!stat) return false;
  const confirmed = await Dialog.confirm({
    title: "Delete Ship Statistic",
    content: `<p>Delete <strong>${escapeHtml(stat.label)}</strong>?</p>`,
    defaultYes: false
  });
  if (!confirmed) return false;
  profile.stats = profile.stats.filter((stat) => stat.id !== statId);
  profiles[profileId] = normalizeProfile(profile);
  await saveProfileStore(profiles);
  return true;
}

async function upsertSlot(profileId: string, slotData: Partial<ShipSlot>): Promise<ShipSlot | null> {
  if (!requireGM("edit equipment slots")) return null;
  const profiles = clone(getProfileStore());
  const profile = profiles[profileId];
  if (!profile) return null;
  const index = profile.slots.findIndex((candidate) => candidate.id === slotData.id);
  const slot = normalizeSlot(index >= 0 ? { ...profile.slots[index], ...slotData } : slotData);
  if (index >= 0) profile.slots[index] = slot;
  else profile.slots.push(slot);
  profiles[profileId] = normalizeProfile(profile);
  await rememberCategory(slot.category);
  if (slot.requiredCategory) await rememberCategory(slot.requiredCategory);
  await saveProfileStore(profiles);
  return slot;
}

async function deleteSlot(profileId: string, slotId: string): Promise<boolean> {
  if (!requireGM("delete equipment slots")) return false;
  const profiles = clone(getProfileStore());
  const profile = profiles[profileId];
  if (!profile) return false;
  const slot = profile.slots.find((candidate) => candidate.id === slotId);
  if (!slot) return false;
  const confirmed = await Dialog.confirm({
    title: "Delete Equipment Slot",
    content: `<p>Delete <strong>${escapeHtml(slot.label)}</strong>?</p>`,
    defaultYes: false
  });
  if (!confirmed) return false;
  profile.slots = profile.slots.filter((slot) => slot.id !== slotId);
  profiles[profileId] = normalizeProfile(profile);
  await saveProfileStore(profiles);
  return true;
}

async function setSlotAnchor(profileId: string, slotId: string, anchorX: number, anchorY: number): Promise<boolean> {
  if (!requireGM("place equipment links")) return false;
  const profiles = clone(getProfileStore());
  const slot = profiles[profileId]?.slots.find((candidate) => candidate.id === slotId);
  if (!slot) return false;
  slot.anchorX = Math.min(100, Math.max(0, Number(anchorX)));
  slot.anchorY = Math.min(100, Math.max(0, Number(anchorY)));
  await saveProfileStore(profiles);
  return true;
}

async function clearSlotAnchor(profileId: string, slotId: string): Promise<boolean> {
  if (!requireGM("clear equipment links")) return false;
  const profiles = clone(getProfileStore());
  const slot = profiles[profileId]?.slots.find((candidate) => candidate.id === slotId);
  if (!slot) return false;
  delete slot.anchorX;
  delete slot.anchorY;
  await saveProfileStore(profiles);
  return true;
}

function getSlotCompatibilitySummary(slot: ShipSlot): string {
  const rules: string[] = [];
  if (slot.requireShipEquipment) rules.push("Ship equipment required");
  if (slot.requiredCategory) rules.push(`Category: ${slot.requiredCategory}`);
  if (slot.requiredTags.length) rules.push(`Tags: ${slot.requiredTags.join(", ")}`);
  if (!slot.allowUntagged && !slot.requireShipEquipment) rules.push("Tagged items only");
  return rules.join(" | ");
}

function validateItemForSlot(slot: ShipSlot, item: any): { ok: boolean; reason?: string } {
  const equipment = getShipEquipmentData(item);
  const hasCategoryRule = Boolean(slot.requiredCategory);
  const hasTagRules = slot.requiredTags.length > 0;
  const needsTaggedItem = slot.requireShipEquipment || hasCategoryRule || hasTagRules || !slot.allowUntagged;

  if (!equipment.enabled) {
    if (!needsTaggedItem) return { ok: true };
    return { ok: false, reason: "That slot only accepts HoloDock ship equipment." };
  }

  if (slot.requiredCategory && equipment.category.toLowerCase() !== slot.requiredCategory.toLowerCase()) {
    return { ok: false, reason: `That slot requires ${slot.requiredCategory} ship equipment.` };
  }

  const itemTags = new Set(equipment.tags.map((tag) => tag.toLowerCase()));
  const missingTags = slot.requiredTags.filter((tag) => !itemTags.has(tag.toLowerCase()));
  if (missingTags.length) {
    return { ok: false, reason: `That slot requires tag${missingTags.length === 1 ? "" : "s"}: ${missingTags.join(", ")}.` };
  }

  return { ok: true };
}

async function equipItem(profileId: string, slotId: string, itemUuid: string): Promise<boolean> {
  if (!requireGM("equip items")) return false;
  const item = await resolveItem(itemUuid);
  if (!item) {
    ui.notifications?.warn?.("Drop a regular Foundry Item onto the slot.");
    return false;
  }
  const profiles = clone(getProfileStore());
  const slot = profiles[profileId]?.slots.find((candidate) => candidate.id === slotId);
  if (!slot) return false;
  const compatibility = validateItemForSlot(normalizeSlot(slot), item);
  if (!compatibility.ok) {
    ui.notifications?.warn?.(compatibility.reason ?? "That item is not compatible with this ship slot.");
    return false;
  }
  slot.itemUuid = item.uuid;
  await saveProfileStore(profiles);
  return true;
}

async function unequipItem(profileId: string, slotId: string): Promise<boolean> {
  if (!requireGM("remove equipped items")) return false;
  const profiles = clone(getProfileStore());
  const slot = profiles[profileId]?.slots.find((candidate) => candidate.id === slotId);
  if (!slot) return false;
  delete slot.itemUuid;
  await saveProfileStore(profiles);
  return true;
}

async function resolveItem(uuid: string): Promise<any | null> {
  const cleaned = String(uuid || "").trim();
  const resolveUuid = (globalThis as any).fromUuid;
  if (!cleaned || typeof resolveUuid !== "function") return null;
  try {
    const document = await resolveUuid(cleaned);
    if (document?.documentName === "Item") return document;
    if (document?.constructor?.name === "Item") return document;
    return null;
  } catch (error) {
    console.warn(`${MODULE_ID} | Failed to resolve item UUID "${cleaned}".`, error);
    return null;
  }
}

function getDragData(event: DragEvent): any {
  try {
    const textEditor = (globalThis as any).TextEditor ?? foundry?.applications?.ux?.TextEditor;
    if (textEditor?.getDragEventData) return textEditor.getDragEventData(event);
  } catch {
    // Fall back to direct JSON parsing below.
  }

  try {
    return JSON.parse(event.dataTransfer?.getData("text/plain") || "{}");
  } catch {
    return {};
  }
}

function extractItemDescription(item: any): string {
  const description = item?.system?.description?.value
    ?? item?.system?.description
    ?? item?.description
    ?? "";
  if (typeof description === "string") return description.trim();
  if (description?.value) return String(description.value).trim();
  return "";
}

function getShipEquipmentStatus(equipment: ShipEquipmentData): string {
  if (!equipment.enabled) return "";
  const parts = [`Ship Equipment: ${equipment.category}`];
  if (equipment.durability.enabled && equipment.durability.max > 0) {
    parts.push(`Durability ${equipment.durability.value}/${equipment.durability.max}`);
  }
  if (equipment.power.enabled && equipment.power.draw > 0) {
    parts.push(`Power ${equipment.power.allocated}/${equipment.power.draw} ${equipment.power.online ? "online" : "offline"}`);
  }
  return parts.join(" | ");
}

function getShipEquipmentBadges(equipment: ShipEquipmentData): string[] {
  if (!equipment.enabled) return [];
  const badges = [equipment.category];
  if (equipment.activation.enabled) badges.push("Activatable");
  if (equipment.durability.enabled) badges.push("Durability");
  if (equipment.power.enabled) badges.push("Power");
  return badges;
}

function prepareShipEquipmentData(equipment: ShipEquipmentData): any {
  const durability = equipment.durability;
  const { isBroken, isDamaged, value, max } = getDurabilityState(equipment);
  const isOffline = equipment.power.enabled && !equipment.power.online;
  const isNoPower = equipment.power.enabled && equipment.power.online && equipment.power.draw > 0 && equipment.power.allocated <= 0;
  const isUnderpowered = equipment.power.enabled && equipment.power.online && !isNoPower && equipment.power.allocated < equipment.power.draw;
  const cooldownMs = Math.max(0, equipment.activation.cooldown) * 6000;
  const cooldownReadyAt = equipment.activation.lastActivatedAt + cooldownMs;
  const isCoolingDown = equipment.activation.enabled && cooldownMs > 0 && equipment.activation.lastActivatedAt > 0 && cooldownReadyAt > Date.now();
  const cooldownRemaining = isCoolingDown ? Math.max(1, Math.ceil((cooldownReadyAt - Date.now()) / 6000)) : 0;
  const isBlocked = isOffline || isNoPower || isUnderpowered || isCoolingDown || (equipment.activation.blockWhenBroken && isBroken);
  return {
    ...equipment,
    badges: getShipEquipmentBadges(equipment),
    tagsText: equipment.tags.join(", "),
    hasTags: equipment.tags.length > 0,
    durability: {
      ...durability,
      value,
      max,
      state: isBroken ? "Broken" : isDamaged ? "Damaged" : "Intact",
      isBroken,
      isDamaged
    },
    power: {
      ...equipment.power,
      state: equipment.power.online ? (isNoPower ? "No Power" : isUnderpowered ? "Low Power" : "Online") : "Offline",
      allocationText: `${equipment.power.allocated} / ${equipment.power.draw}`,
      allocationPercent: equipment.power.draw > 0 ? Math.min(100, Math.round((equipment.power.allocated / equipment.power.draw) * 100)) : 100,
      isOffline,
      isNoPower,
      isUnderpowered
    },
    activation: {
      ...equipment.activation,
      isBlocked,
      isCoolingDown,
      cooldownRemaining,
      blockedReason: isOffline
        ? "Equipment offline"
        : isNoPower
          ? "No power allocated"
          : isUnderpowered
            ? "Low allocated power"
          : isCoolingDown
            ? `Cooling down: ${cooldownRemaining} round${cooldownRemaining === 1 ? "" : "s"}`
            : isBroken
              ? "Equipment broken"
              : ""
    }
  };
}

function getShipPowerBudget(profile: Pick<ShipProfile, "powerCapacity"> & { slots: any[] }): ShipPowerBudget {
  const capacity = Math.max(0, normalizeNumber(profile.powerCapacity, 0));
  const used = profile.slots.reduce((total, slot) => {
    const power = slot?.item?.equipment?.power;
    if (!power?.enabled || power.online === false) return total;
    return total + Math.max(0, normalizeNumber(power.allocated, power.draw ?? 0));
  }, 0);
  const remaining = capacity > 0 ? capacity - used : 0;
  const overage = capacity > 0 ? Math.max(0, used - capacity) : 0;
  const hasCapacity = capacity > 0;
  const isOverBudget = hasCapacity && used > capacity;
  return {
    capacity,
    used,
    remaining,
    overage,
    hasCapacity,
    isOverBudget,
    summary: hasCapacity ? `${used} / ${capacity}` : `${used} draw`
  };
}

function preparePowerPresets(profile: ShipProfile, slots: any[]): any[] {
  const slotLookup = new Map(slots.map((slot) => [slot.id, slot]));
  const poweredSlots = slots.filter((slot) => slot.item?.equipment?.power?.enabled);
  return profile.powerPresets.map((preset) => {
    const allocated = preset.entries.reduce((total, entry) => entry.online ? total + entry.allocated : total, 0);
    const onlineEntries = preset.entries.filter((entry) => entry.online).length;
    const offlineEntries = Math.max(0, preset.entries.length - onlineEntries);
    let matchedEntries = 0;
    let changedEntries = 0;
    let missingEntries = 0;
    let projectedOverage = 0;
    const previewChanges = preset.entries.map((entry) => {
      const slot = slotLookup.get(entry.slotId);
      const power = slot?.item?.equipment?.power;
      if (!power?.enabled) {
        missingEntries += 1;
        return null;
      }
      matchedEntries += 1;
      const changed = power.allocated !== entry.allocated || power.online !== entry.online;
      if (changed) changedEntries += 1;
      return {
        slotId: entry.slotId,
        itemName: slot.item.name,
        currentText: `${power.online ? "Online" : "Offline"} / ${power.allocated}`,
        targetText: `${entry.online ? "Online" : "Offline"} / ${entry.allocated}`,
        changed,
        stateClass: entry.online ? "is-ready" : "is-offline"
      };
    }).filter(Boolean).slice(0, 3);
    if (profile.powerCapacity > 0) projectedOverage = Math.max(0, allocated - profile.powerCapacity);
    const matchesCurrent = poweredSlots.length > 0
      && preset.entries.length === poweredSlots.length
      && preset.entries.every((entry) => {
        const power = slotLookup.get(entry.slotId)?.item?.equipment?.power;
        return power?.enabled && power.allocated === entry.allocated && power.online === entry.online;
      });
    return {
      ...preset,
      allocated,
      onlineEntries,
      offlineEntries,
      systemCount: preset.entries.length,
      matchedEntries,
      changedEntries,
      missingEntries,
      previewChanges,
      hasPreviewChanges: previewChanges.length > 0,
      projectedOverage,
      isOverBudget: projectedOverage > 0,
      summary: `${allocated} allocated | ${onlineEntries}/${preset.entries.length} online`,
      isCurrent: matchesCurrent
    };
  });
}

function findStatsByLabels(stats: ShipStat[], labels: string[]): ShipStat[] {
  const normalizedLabels = labels.map((label) => label.toLowerCase());
  return stats.filter((stat) => normalizedLabels.some((label) => stat.label.toLowerCase().includes(label)));
}

function findStatByLabels(stats: ShipStat[], labels: string[]): ShipStat | null {
  return findStatsByLabels(stats, labels)[0] ?? null;
}

function prepareNamedStat(stats: ShipStat[], label: string, labels: string[], fallback = "Unset", editLabel = label): any {
  const stat = findStatByLabels(stats, labels);
  return {
    label,
    value: stat?.value || fallback,
    inputValue: stat?.value || "",
    note: stat?.note || "",
    stat,
    statId: stat?.id || "",
    editLabel: stat?.label || editLabel,
    isConfigured: Boolean(stat)
  };
}

function prepareStatVital(stats: ShipStat[], fallbackLabel: string, page: string, icon: string): any {
  const stat = stats[0] ?? null;
  return {
    label: fallbackLabel,
    value: stat?.value || "Unset",
    inputValue: stat?.value || "",
    note: stat?.note || (stat ? stat.label : "Add ship statistic"),
    icon,
    page,
    stateClass: stat ? "is-ready" : "is-muted",
    stat,
    statId: stat?.id || "",
    editLabel: stat?.label || fallbackLabel,
    relatedStats: stats.slice(1),
    hasRelatedStats: stats.length > 1
  };
}

function prepareSpeedProfile(stats: ShipStat[]): any {
  const speedStat = findStatByLabels(stats, ["speed"]);
  const relatedSpeedStats = findStatsByLabels(stats, ["max speed", "maximum speed", "top speed", "maximum"])
    .filter((stat) => stat.id !== speedStat?.id);
  const speedStats = [speedStat, ...relatedSpeedStats].filter(Boolean) as ShipStat[];
  const vital = prepareStatVital(speedStats, "Speed", "speed", "fa-gauge-high");
  return {
    ...vital,
    metrics: [
      prepareNamedStat(stats, "Cruise", ["cruise"], "Unset", "Cruise Speed"),
      prepareNamedStat(stats, "Maximum", ["max speed", "maximum speed", "top speed", "maximum"], "Unset", "Maximum Speed"),
      prepareNamedStat(stats, "Thrust", ["thrust", "acceleration"])
    ]
  };
}

function prepareCapacityProfile(stats: ShipStat[]): any {
  const capacityStat = findStatByLabels(stats, ["capacity", "occupancy"]);
  const relatedCapacityStats = findStatsByLabels(stats, ["passenger"])
    .filter((stat) => stat.id !== capacityStat?.id);
  const capacityStats = [capacityStat, ...relatedCapacityStats].filter(Boolean) as ShipStat[];
  const vital = prepareStatVital(capacityStats, "Capacity", "capacity", "fa-users");
  return {
    ...vital,
    metrics: [
      prepareNamedStat(stats, "Crew", ["crew"]),
      prepareNamedStat(stats, "Berths", ["berth"]),
      prepareNamedStat(stats, "Cargo", ["cargo", "hold"]),
      prepareNamedStat(stats, "Life Support", ["life support", "life-support"])
    ]
  };
}

function getShipCondition(profile: {
  power: ShipPowerBudget;
  systems: any[];
  brokenSystems: number;
  damagedSystems: number;
  offlineSystems: number;
  underpoweredSystems: number;
}): any {
  if (profile.brokenSystems > 0 || (profile.power.isOverBudget && profile.underpoweredSystems > 0)) {
    return {
      level: "critical",
      label: "Critical",
      note: profile.brokenSystems > 0 ? `${profile.brokenSystems} broken system${profile.brokenSystems === 1 ? "" : "s"}` : "Power grid failing",
      icon: "fa-triangle-exclamation"
    };
  }
  if (profile.damagedSystems > 0 || profile.offlineSystems > 0 || profile.underpoweredSystems > 0 || profile.power.isOverBudget) {
    const issueCount = profile.damagedSystems + profile.offlineSystems + profile.underpoweredSystems + (profile.power.isOverBudget ? 1 : 0);
    return {
      level: "compromised",
      label: "Compromised",
      note: `${issueCount} active issue${issueCount === 1 ? "" : "s"}`,
      icon: "fa-shield-halved"
    };
  }
  if (!profile.systems.length || !profile.power.hasCapacity) {
    return {
      level: "strained",
      label: "Strained",
      note: !profile.systems.length ? "No ship systems online" : "Power capacity untracked",
      icon: "fa-gauge-simple-low"
    };
  }
  return {
    level: "nominal",
    label: "Nominal",
    note: "All tracked systems ready",
    icon: "fa-circle-check"
  };
}

function getShipDashboard(profile: { slots: any[]; power: ShipPowerBudget; stats: ShipStat[] }): any {
  const totalSlots = profile.slots.length;
  const equippedSlots = profile.slots.filter((slot) => slot.item && !slot.item.missing).length;
  const emptySlots = Math.max(0, totalSlots - equippedSlots);
  const systems = profile.slots
    .filter((slot) => slot.item?.equipment?.enabled)
    .map((slot) => {
      const equipment = slot.item.equipment;
      const power = equipment.power;
      const durability = equipment.durability;
      const isBroken = durability.enabled && durability.isBroken;
      const isDamaged = durability.enabled && durability.isDamaged;
      const isOffline = power.enabled && power.isOffline;
      const isNoPower = power.enabled && power.isNoPower;
      const isUnderpowered = power.enabled && power.isUnderpowered;
      const canActivate = equipment.activation.enabled;
      const state = isBroken ? "Broken" : isOffline ? "Offline" : isNoPower ? "No Power" : isUnderpowered ? "Low Power" : isDamaged ? "Damaged" : "Ready";
      const stateClass = `is-${state.toLowerCase().replace(/\s+/g, "-")}`;
      return {
        slotId: slot.id,
        slotLabel: slot.label,
        itemName: slot.item.name,
        itemImg: slot.item.img,
        category: equipment.category,
        state,
        stateClass,
        icon: isBroken ? "fa-triangle-exclamation" : isOffline ? "fa-power-off" : isNoPower ? "fa-battery-empty" : isUnderpowered ? "fa-gauge-simple-low" : isDamaged ? "fa-screwdriver-wrench" : "fa-circle-check",
        canActivate,
        activationLabel: equipment.activation.label,
        activationBlocked: equipment.activation.isBlocked,
        powerEnabled: power.enabled,
        powerDraw: power.draw,
        powerAllocated: power.allocated,
        powerAllocationText: power.allocationText,
        powerAllocationPercent: power.allocationPercent,
        powerState: power.state,
        durabilityEnabled: durability.enabled,
        durabilityText: durability.enabled ? `${durability.value} / ${durability.max}` : ""
      };
    });
  const brokenSystems = systems.filter((system) => system.state === "Broken").length;
  const damagedSystems = systems.filter((system) => system.state === "Damaged").length;
  const offlineSystems = systems.filter((system) => system.state === "Offline").length;
  const underpoweredSystems = systems.filter((system) => system.state === "Low Power" || system.state === "No Power").length;
  const poweredSystems = systems.filter((system) => system.powerEnabled).length;
  const onlineSystems = systems.filter((system) => system.powerEnabled && system.powerState === "Online").length;
  const speed = prepareSpeedProfile(profile.stats);
  const capacity = prepareCapacityProfile(profile.stats);
  const condition = getShipCondition({ power: profile.power, systems, brokenSystems, damagedSystems, offlineSystems, underpoweredSystems });
  return {
    totalSlots,
    equippedSlots,
    emptySlots,
    systems,
    hasSystems: systems.length > 0,
    brokenSystems,
    damagedSystems,
    offlineSystems,
    underpoweredSystems,
    poweredSystems,
    onlineSystems,
    condition,
    hasAlerts: profile.power.isOverBudget || brokenSystems > 0 || damagedSystems > 0 || offlineSystems > 0 || underpoweredSystems > 0,
    speed,
    capacity,
    tiles: [
      { label: "Systems", value: `${equippedSlots}/${totalSlots}`, note: emptySlots ? `${emptySlots} empty` : "All slots filled", icon: "fa-layer-group", page: "systems", stateClass: emptySlots ? "is-muted" : "is-ready" },
      { label: "Power", value: profile.power.summary, note: profile.power.hasCapacity ? `${profile.power.remaining} remaining` : "capacity untracked", icon: profile.power.isOverBudget ? "fa-triangle-exclamation" : "fa-bolt", page: "power", stateClass: profile.power.isOverBudget ? "is-danger" : "is-ready" },
      { label: "Online", value: `${onlineSystems}/${poweredSystems}`, note: underpoweredSystems ? `${underpoweredSystems} underpowered` : poweredSystems ? "powered systems" : "No power draw", icon: "fa-power-off", page: "systems", stateClass: offlineSystems || underpoweredSystems ? "is-warning" : "is-ready" },
      { label: "Integrity", value: brokenSystems ? `${brokenSystems} broken` : damagedSystems ? `${damagedSystems} damaged` : "Nominal", note: systems.length ? "ship equipment" : "No systems", icon: brokenSystems ? "fa-triangle-exclamation" : "fa-shield-halved", page: "damage", stateClass: brokenSystems ? "is-danger" : damagedSystems ? "is-warning" : "is-ready" },
      speed,
      capacity
    ]
  };
}

function prepareEquipmentCategories(slots: any[]): any[] {
  const grouped = new Map<string, any[]>();
  for (const slot of slots) {
    const category = String(slot.category || "Unassigned");
    if (!grouped.has(category)) grouped.set(category, []);
    grouped.get(category)?.push({
      ...slot,
      isSelectedEquipment: slot.id === selectedEquipmentSlotId
    });
  }
  return Array.from(grouped.entries()).map(([category, entries]) => ({
    category,
    count: entries.length,
    equippedCount: entries.filter((slot) => slot.item && !slot.item.missing).length,
    slots: entries
  }));
}

function getSelectedEquipmentSlot(slots: any[]): any | null {
  const selectable = slots.filter((slot) => slot.item);
  if (!selectable.length) {
    selectedEquipmentSlotId = "";
    return null;
  }
  if (!selectedEquipmentSlotId || !selectable.some((slot) => slot.id === selectedEquipmentSlotId)) {
    selectedEquipmentSlotId = selectable[0].id;
  }
  return selectable.find((slot) => slot.id === selectedEquipmentSlotId) ?? null;
}

function preparePowerGrid(slots: any[], power: ShipPowerBudget): any {
  const nodes = slots
    .filter((slot) => slot.item?.equipment?.power?.enabled)
    .map((slot) => {
      const powerData = slot.item.equipment.power;
      return {
        slotId: slot.id,
        label: slot.label,
        itemName: slot.item.name,
        category: slot.category,
        allocated: powerData.allocated,
        draw: powerData.draw,
        allocationText: powerData.allocationText,
        allocationPercent: powerData.allocationPercent,
        state: powerData.state,
        isOffline: powerData.isOffline,
        isNoPower: powerData.isNoPower,
        isUnderpowered: powerData.isUnderpowered
      };
    });
  return {
    nodes,
    hasNodes: nodes.length > 0,
    reactorLabel: power.hasCapacity ? `${power.used} / ${power.capacity}` : `${power.used} allocated`
  };
}

async function prepareSlotForRender(slot: ShipSlot): Promise<any> {
  const hasAnchor = Number.isFinite(slot.anchorX) && Number.isFinite(slot.anchorY);
  const compatibilitySummary = getSlotCompatibilitySummary(slot);
  const preparedSlot = {
    ...slot,
    hasAnchor,
    compatibilitySummary,
    hasCompatibilityRules: Boolean(compatibilitySummary)
  };
  if (!slot.itemUuid) return { ...preparedSlot, item: null };
  const item = await resolveItem(slot.itemUuid);
  if (!item) {
    return {
      ...preparedSlot,
      item: {
        name: "Missing Item",
        img: "icons/svg/hazard.svg",
        status: "Stored UUID no longer resolves",
        missing: true
      }
    };
  }

  const equipment = getShipEquipmentData(item);
  const equipmentStatus = getShipEquipmentStatus(equipment);
  const preparedEquipment = prepareShipEquipmentData(equipment);
  const pinState = preparedEquipment.durability.isBroken
    ? "is-broken"
    : preparedEquipment.power.isOffline
      ? "is-offline"
      : preparedEquipment.power.isNoPower
        ? "is-no-power"
        : preparedEquipment.power.isUnderpowered
          ? "is-low-power"
          : preparedEquipment.durability.isDamaged
            ? "is-damaged"
            : preparedEquipment.enabled
              ? "is-online"
              : "is-untagged";
  return {
    ...preparedSlot,
      item: {
        name: item.name ?? "Unnamed Item",
        img: item.img || "icons/svg/item-bag.svg",
        status: equipmentStatus,
        description: extractItemDescription(item),
        uuid: item.uuid,
        equipment: preparedEquipment
      },
      pinStateClass: pinState,
      statusClass: pinState,
      statusLabel: preparedEquipment.durability.isBroken ? "Broken" : preparedEquipment.power.state || preparedEquipment.durability.state
  };
}

async function getRenderContext(): Promise<any> {
  const selectedProfile = getSelectedProfile();
  let preparedProfile: any = null;
  if (selectedProfile) {
    const slots = await Promise.all(selectedProfile.slots.map(prepareSlotForRender));
    const power = getShipPowerBudget({ ...selectedProfile, slots });
    const dashboard = getShipDashboard({ slots, power, stats: selectedProfile.stats });
    const featuredStatIds = new Set([
      dashboard.speed.stat?.id,
      dashboard.capacity.stat?.id,
      ...dashboard.speed.relatedStats.map((stat: ShipStat) => stat.id),
      ...dashboard.capacity.relatedStats.map((stat: ShipStat) => stat.id),
      ...dashboard.speed.metrics.map((metric: any) => metric.stat?.id),
      ...dashboard.capacity.metrics.map((metric: any) => metric.stat?.id)
    ].filter(Boolean));
    dashboard.tiles = dashboard.tiles.map((tile: any) => ({
      ...tile,
      isActive: tile.page === selectedPage || (tile.page === "systems" && selectedPage === "equipment" && tile.label === "Systems")
    }));
    const selectedEquipmentSlot = getSelectedEquipmentSlot(slots);
    const visualSlots = slots.map((slot) => ({
      ...slot,
      isSelectedEquipment: slot.id === selectedEquipmentSlotId
    }));
    preparedProfile = {
      ...selectedProfile,
      slots: visualSlots,
      power,
      powerPresets: preparePowerPresets(selectedProfile, slots),
      hasPowerPresets: selectedProfile.powerPresets.length > 0,
      dashboard,
      additionalStats: selectedProfile.stats.filter((stat) => !featuredStatIds.has(stat.id)),
      hasAdditionalStats: selectedProfile.stats.some((stat) => !featuredStatIds.has(stat.id)),
      equipmentCategories: prepareEquipmentCategories(visualSlots),
      selectedEquipmentSlot,
      hasSelectedEquipment: Boolean(selectedEquipmentSlot),
      powerGrid: preparePowerGrid(slots, power)
    };
  }
  const profiles = getProfiles().map((profile) => ({
    ...profile,
    isSelected: profile.id === selectedProfileId
  }));
  const pageIds = new Set(HOLODOCK_PAGES.map((page) => page.id));
  if (!pageIds.has(selectedPage) && selectedPage !== "equipment") selectedPage = "overview";

  return {
    canEdit: game.user?.isGM === true,
    hasProfiles: profiles.length > 0,
    profiles,
    selectedProfile: preparedProfile,
    pages: HOLODOCK_PAGES.map((page) => ({
      ...page,
      isActive: page.id === selectedPage
    })),
    activePage: selectedPage,
    isOverview: selectedPage === "overview",
    isSystems: selectedPage === "systems",
    isEquipment: selectedPage === "equipment",
    isPower: selectedPage === "power",
    isDamage: selectedPage === "damage",
    isSpeed: selectedPage === "speed",
    isCapacity: selectedPage === "capacity",
    categories: getCategories()
  };
}

function getElement(app: any, html: any = null): HTMLElement | null {
  if (html?.[0]) return html[0];
  if (html instanceof HTMLElement) return html;
  if (app?.element?.[0]) return app.element[0];
  return app?.element ?? null;
}

function refreshOpenApp(): void {
  if (holodockApp?.rendered) holodockApp.render(true);
}

function getFormValues(html: any): Record<string, string> {
  const root = html?.[0] ?? html;
  const form = root?.querySelector?.("form") ?? root?.closest?.("form");
  return Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
}

function getSlotFormValues(html: any): Partial<ShipSlot> {
  const root = html?.[0] ?? html;
  const form = root?.querySelector?.("form") ?? root?.closest?.("form");
  const formData = new FormData(form);
  return {
    id: String(formData.get("id") || ""),
    label: String(formData.get("label") || ""),
    category: String(formData.get("category") || ""),
    description: String(formData.get("description") || ""),
    requireShipEquipment: getCheckbox(formData, "requireShipEquipment"),
    requiredCategory: String(formData.get("requiredCategory") || ""),
    requiredTags: normalizeTags(formData.get("requiredTags")),
    allowUntagged: getCheckbox(formData, "allowUntagged")
  };
}

function openSlotDialog(slot: Partial<ShipSlot> = {}): void {
  if (!requireGM("edit equipment slots")) return;
  const profile = getSelectedProfile();
  if (!profile) return;
  const data = normalizeSlot({ label: "New Slot", category: DEFAULT_CATEGORIES[0], ...slot });
  const categoryOptions = getCategories()
    .map((category) => `<option value="${escapeHtml(category)}">`)
    .join("");

  new Dialog({
    title: slot.id ? "Edit Equipment Slot" : "Add Equipment Slot",
    content: `
      <form class="hd-dialog-form">
        <input type="hidden" name="id" value="${escapeHtml(data.id)}">
        <label>
          <span>Slot Label</span>
          <input type="text" name="label" value="${escapeHtml(data.label)}">
        </label>
        <label>
          <span>Category</span>
          <input type="text" name="category" value="${escapeHtml(data.category)}" list="hd-slot-categories">
          <datalist id="hd-slot-categories">${categoryOptions}</datalist>
        </label>
        <label>
          <span>Description</span>
          <textarea name="description" rows="4">${escapeHtml(data.description)}</textarea>
        </label>
        <fieldset>
          <legend>Compatibility</legend>
          <label class="hd-check">
            <input type="checkbox" name="requireShipEquipment" ${checkedAttr(data.requireShipEquipment)}>
            <span>Require HoloDock ship equipment</span>
          </label>
          <label class="hd-check">
            <input type="checkbox" name="allowUntagged" ${checkedAttr(data.allowUntagged)}>
            <span>Allow untagged items when no category or tag rule is set</span>
          </label>
          <label>
            <span>Required Ship Equipment Category</span>
            <input type="text" name="requiredCategory" value="${escapeHtml(data.requiredCategory)}" list="hd-slot-categories" placeholder="Optional">
          </label>
          <label>
            <span>Required Tags</span>
            <input type="text" name="requiredTags" value="${escapeHtml(data.requiredTags.join(", "))}" placeholder="turret, external">
          </label>
        </fieldset>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (html) => upsertSlot(profile.id, getSlotFormValues(html))
      },
      cancel: {
        icon: '<i class="fa-solid fa-xmark"></i>',
        label: "Cancel"
      }
    },
    default: "save"
  }, {
    classes: ["holodock-window", "hd-dialog"],
    width: 480
  }).render(true);
}

function openStatDialog(stat: Partial<ShipStat> = {}): void {
  if (!requireGM("edit ship statistics")) return;
  const profile = getSelectedProfile();
  if (!profile) return;
  const data = normalizeStat({ label: "New Statistic", ...stat });

  new Dialog({
    title: stat.id ? "Edit Ship Statistic" : "Add Ship Statistic",
    content: `
      <form class="hd-dialog-form">
        <input type="hidden" name="id" value="${escapeHtml(data.id)}">
        <label>
          <span>Label</span>
          <input type="text" name="label" value="${escapeHtml(data.label)}">
        </label>
        <label>
          <span>Value</span>
          <input type="text" name="value" value="${escapeHtml(data.value)}">
        </label>
        <label>
          <span>Note</span>
          <textarea name="note" rows="3">${escapeHtml(data.note)}</textarea>
        </label>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (html) => upsertStat(profile.id, getFormValues(html))
      },
      cancel: {
        icon: '<i class="fa-solid fa-xmark"></i>',
        label: "Cancel"
      }
    },
    default: "save"
  }, {
    classes: ["holodock-window", "hd-dialog"],
    width: 420
  }).render(true);
}

function openPowerPresetDialog(): void {
  if (!requireGM("save power presets")) return;
  const profile = getSelectedProfile();
  if (!profile) return;
  new Dialog({
    title: "Save Power Mode",
    content: `
      <form class="hd-dialog-form">
        <label>
          <span>Mode Name</span>
          <input type="text" name="name" value="Combat" list="hd-power-mode-names">
          <datalist id="hd-power-mode-names">
            <option value="Cruise">
            <option value="Combat">
            <option value="Silent Running">
            <option value="Emergency">
          </datalist>
        </label>
        <p class="hd-muted">Captures current allocation and online state for all powered ship equipment.</p>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save Mode",
        callback: (html) => {
          const values = getFormValues(html);
          return capturePowerPreset(profile.id, values.name || "Power Mode");
        }
      },
      cancel: {
        icon: '<i class="fa-solid fa-xmark"></i>',
        label: "Cancel"
      }
    },
    default: "save"
  }, {
    classes: ["holodock-window", "hd-dialog"],
    width: 390
  }).render(true);
}

function getCheckbox(formData: FormData, name: string): boolean {
  return formData.get(name) === "on";
}

function getShipEquipmentFormData(html: any): ShipEquipmentData {
  const root = html?.[0] ?? html;
  const form = root?.querySelector?.("form") ?? root?.closest?.("form");
  const formData = new FormData(form);
  const tags = String(formData.get("tags") || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  return normalizeShipEquipmentData({
    enabled: getCheckbox(formData, "enabled"),
    category: String(formData.get("category") || ""),
    tags,
    activation: {
      enabled: getCheckbox(formData, "activation.enabled"),
      label: String(formData.get("activation.label") || ""),
      actionType: String(formData.get("activation.actionType") || ""),
      cooldown: normalizeNumber(formData.get("activation.cooldown"), 0),
      resourceCost: String(formData.get("activation.resourceCost") || ""),
      durabilityCost: normalizeNumber(formData.get("activation.durabilityCost"), 0),
      blockWhenBroken: getCheckbox(formData, "activation.blockWhenBroken")
    },
    durability: {
      enabled: getCheckbox(formData, "durability.enabled"),
      value: normalizeNumber(formData.get("durability.value"), 0),
      max: normalizeNumber(formData.get("durability.max"), 0),
      brokenAt: normalizeNumber(formData.get("durability.brokenAt"), 0)
    },
    power: {
      enabled: getCheckbox(formData, "power.enabled"),
      draw: normalizeNumber(formData.get("power.draw"), 0),
      allocated: normalizeNumber(formData.get("power.allocated"), normalizeNumber(formData.get("power.draw"), 0)),
      online: getCheckbox(formData, "power.online")
    }
  });
}

function openShipEquipmentDialog(item: any): void {
  if (!requireGM("tag ship equipment")) return;
  if (!item) return;
  const data = getShipEquipmentData(item);
  const categoryOptions = getCategories()
    .map((category) => `<option value="${escapeHtml(category)}">`)
    .join("");
  const checked = (value: boolean) => value ? "checked" : "";

  new Dialog({
    title: `Ship Equipment: ${item.name ?? "Item"}`,
    content: `
      <form class="hd-dialog-form hd-equipment-form">
        <label class="hd-check">
          <input type="checkbox" name="enabled" ${checked(data.enabled)}>
          <span>Ship Equipment</span>
        </label>
        <label>
          <span>Category</span>
          <input type="text" name="category" value="${escapeHtml(data.category)}" list="hd-equipment-categories">
          <datalist id="hd-equipment-categories">${categoryOptions}</datalist>
        </label>
        <label>
          <span>Tags</span>
          <input type="text" name="tags" value="${escapeHtml(data.tags.join(", "))}" placeholder="turret, external, sensor">
        </label>

        <fieldset>
          <legend>Activation</legend>
          <label class="hd-check">
            <input type="checkbox" name="activation.enabled" ${checked(data.activation.enabled)}>
            <span>Can be activated</span>
          </label>
          <div class="hd-form-grid">
            <label>
              <span>Button Label</span>
              <input type="text" name="activation.label" value="${escapeHtml(data.activation.label)}">
            </label>
            <label>
              <span>Action Type</span>
              <input type="text" name="activation.actionType" value="${escapeHtml(data.activation.actionType)}" placeholder="attack, scan, repair">
            </label>
            <label>
              <span>Cooldown</span>
              <input type="number" min="0" step="1" name="activation.cooldown" value="${data.activation.cooldown}">
            </label>
            <label>
              <span>Resource Cost</span>
              <input type="text" name="activation.resourceCost" value="${escapeHtml(data.activation.resourceCost)}">
            </label>
            <label>
              <span>Durability Cost</span>
              <input type="number" min="0" step="1" name="activation.durabilityCost" value="${data.activation.durabilityCost}">
            </label>
          </div>
          <label class="hd-check">
            <input type="checkbox" name="activation.blockWhenBroken" ${checked(data.activation.blockWhenBroken)}>
            <span>Block activation when broken</span>
          </label>
        </fieldset>

        <fieldset>
          <legend>Durability</legend>
          <label class="hd-check">
            <input type="checkbox" name="durability.enabled" ${checked(data.durability.enabled)}>
            <span>Has durability</span>
          </label>
          <div class="hd-form-grid">
            <label>
              <span>Current</span>
              <input type="number" min="0" step="1" name="durability.value" value="${data.durability.value}">
            </label>
            <label>
              <span>Maximum</span>
              <input type="number" min="0" step="1" name="durability.max" value="${data.durability.max}">
            </label>
            <label>
              <span>Broken At</span>
              <input type="number" min="0" step="1" name="durability.brokenAt" value="${data.durability.brokenAt}">
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Power</legend>
          <label class="hd-check">
            <input type="checkbox" name="power.enabled" ${checked(data.power.enabled)}>
            <span>Requires power</span>
          </label>
          <label class="hd-check">
            <input type="checkbox" name="power.online" ${checked(data.power.online)}>
            <span>Online</span>
          </label>
          <label>
            <span>Power Draw</span>
            <input type="number" min="0" step="1" name="power.draw" value="${data.power.draw}">
          </label>
          <label>
            <span>Starting Allocation</span>
            <input type="number" min="0" step="1" name="power.allocated" value="${data.power.allocated}">
          </label>
        </fieldset>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (html) => setShipEquipmentData(item, getShipEquipmentFormData(html))
      },
      cancel: {
        icon: '<i class="fa-solid fa-xmark"></i>',
        label: "Cancel"
      }
    },
    default: "save"
  }, {
    classes: ["holodock-window", "hd-dialog"],
    width: 520
  }).render(true);
}

function openDurabilityDialog(item: any): void {
  if (!requireGM("edit ship equipment durability")) return;
  const equipment = getShipEquipmentData(item);
  if (!equipment.enabled || !equipment.durability.enabled) return;

  new Dialog({
    title: `Set Durability: ${item.name ?? "Item"}`,
    content: `
      <form class="hd-dialog-form">
        <label>
          <span>Current Durability</span>
          <input type="number" min="0" max="${equipment.durability.max}" step="1" name="value" value="${equipment.durability.value}">
        </label>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (html) => {
          const values = getFormValues(html);
          return updateShipEquipmentDurability(item, normalizeNumber(values.value, equipment.durability.value));
        }
      },
      cancel: {
        icon: '<i class="fa-solid fa-xmark"></i>',
        label: "Cancel"
      }
    },
    default: "save"
  }, {
    classes: ["holodock-window", "hd-dialog"],
    width: 360
  }).render(true);
}

function getWorldItems(): any[] {
  const items = game.items;
  if (!items) return [];
  if (Array.isArray(items)) return items;
  if (Array.isArray(items.contents)) return items.contents;
  try {
    return Array.from(items as Iterable<any>);
  } catch {
    return [];
  }
}

function prepareEquipmentPickOptions(slot: ShipSlot): EquipmentPickOption[] {
  return getWorldItems()
    .filter((item) => item?.documentName === "Item" || item?.constructor?.name === "Item")
    .map((item) => {
      const equipment = getShipEquipmentData(item);
      const compatibility = validateItemForSlot(slot, item);
      return {
        id: String(item.id ?? item.uuid ?? createId("item")),
        uuid: String(item.uuid ?? ""),
        name: String(item.name ?? "Unnamed Item"),
        img: String(item.img || "icons/svg/item-bag.svg"),
        type: String(item.type || "Item"),
        status: getShipEquipmentStatus(equipment),
        compatible: compatibility.ok,
        reason: compatibility.reason ?? "",
        shipEquipment: equipment.enabled,
        category: equipment.enabled ? equipment.category : "",
        tagsText: equipment.tags.join(", ")
      };
    })
    .filter((option) => option.uuid)
    .sort((left, right) => {
      if (left.compatible !== right.compatible) return left.compatible ? -1 : 1;
      if (left.shipEquipment !== right.shipEquipment) return left.shipEquipment ? -1 : 1;
      return left.name.localeCompare(right.name);
    });
}

function renderEquipmentPickButton(option: EquipmentPickOption): string {
  return `
    <button type="button" class="hd-equipment-pick ${option.compatible ? "" : "is-incompatible"}" data-hd-pick-item="${escapeHtml(option.uuid)}">
      <img src="${escapeHtml(option.img)}" alt="">
      <span>
        <strong>${escapeHtml(option.name)}</strong>
        ${option.status ? `<small>${escapeHtml(option.status)}</small>` : ""}
        ${option.tagsText ? `<em>${escapeHtml(option.tagsText)}</em>` : ""}
        ${option.reason ? `<em>${escapeHtml(option.reason)}</em>` : ""}
      </span>
    </button>
  `;
}

function openEquipmentBrowser(profileId: string, slotId: string): void {
  if (!requireGM("equip items")) return;
  const profile = getProfile(profileId);
  const slot = profile?.slots.find((candidate) => candidate.id === slotId);
  if (!profile || !slot) return;
  const normalizedSlot = normalizeSlot(slot);
  const options = prepareEquipmentPickOptions(normalizedSlot);
  const compatible = options.filter((option) => option.compatible);
  const incompatible = options.filter((option) => !option.compatible);

  const dialog = new Dialog({
    title: `Choose Equipment: ${slot.label}`,
    content: `
      <section class="hd-equipment-browser">
        <p class="hd-muted">${escapeHtml(getSlotCompatibilitySummary(normalizedSlot) || "No slot compatibility rules set.")}</p>
        <div class="hd-equipment-pick-list">
          ${compatible.length ? compatible.map(renderEquipmentPickButton).join("") : `<p class="hd-muted">No compatible world items found.</p>`}
        </div>
        ${incompatible.length ? `
          <details class="hd-incompatible-equipment">
            <summary>${incompatible.length} incompatible item${incompatible.length === 1 ? "" : "s"}</summary>
            <div class="hd-equipment-pick-list">
              ${incompatible.map(renderEquipmentPickButton).join("")}
            </div>
          </details>
        ` : ""}
      </section>
    `,
    buttons: {
      close: {
        icon: '<i class="fa-solid fa-xmark"></i>',
        label: "Close"
      }
    },
    default: "close"
  }, {
    classes: ["holodock-window", "hd-dialog"],
    width: 560,
    height: 640
  });
  dialog.render(true);
  window.setTimeout(() => {
    const element = getElement(dialog);
    element?.querySelectorAll<HTMLElement>("[data-hd-pick-item]").forEach((button) => {
      button.addEventListener("click", async () => {
        const uuid = button.dataset.hdPickItem ?? "";
        const equipped = await equipItem(profile.id, slot.id, uuid);
        if (equipped) dialog.close();
      });
    });
  }, 0);
}

function getItemFromSheetApp(app: any): any | null {
  const candidates = [
    app?.document,
    app?.item,
    app?.object,
    app?._document,
    app?.options?.document
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const documentName = candidate.documentName ?? candidate.constructor?.documentName;
    const constructorName = String(candidate.constructor?.name ?? "");
    if (documentName === "Item") return candidate;
    if (constructorName.includes("Item") && candidate.type !== undefined && candidate.setFlag && candidate.getFlag) return candidate;
  }
  return null;
}

function addItemSheetHeaderButton(app: any, buttons: any[]): void {
  if (!game.user?.isGM) return;
  const item = getItemFromSheetApp(app);
  if (!item || !Array.isArray(buttons)) return;
  if (buttons.some((button) => button?.class === "hd-edit-equipment" || button?.className === "hd-edit-equipment")) return;
  const control = {
    label: "Ship Equipment",
    title: "HoloDock Ship Equipment",
    class: "hd-edit-equipment",
    className: "hd-edit-equipment",
    icon: "fa-solid fa-shuttle-space",
    onclick: () => openShipEquipmentDialog(item),
    onClick: () => openShipEquipmentDialog(item)
  };
  buttons.unshift(control);
}

function addItemSheetHeaderControl(app: any, controls: any[]): void {
  if (!game.user?.isGM) return;
  const item = getItemFromSheetApp(app);
  if (!item || !Array.isArray(controls)) return;
  if (controls.some((control) => control?.action === "holodockShipEquipment" || control?.class === "hd-edit-equipment")) return;
  controls.unshift({
    action: "holodockShipEquipment",
    label: "Ship Equipment",
    title: "HoloDock Ship Equipment",
    icon: "fa-solid fa-shuttle-space",
    class: "hd-edit-equipment",
    visible: true,
    ownership: "OWNER",
    onClick: () => openShipEquipmentDialog(item),
    onclick: () => openShipEquipmentDialog(item)
  });
}

function getApplicationFrame(app: any, html: any = null): HTMLElement | null {
  const root = getElement(null, html);
  const appElement = app?.element?.[0] ?? app?.element ?? app?._element?.[0] ?? app?._element;
  const windowElement = app?.window?.element ?? app?.window?.frame;
  const escapedId = app?.id && globalThis.CSS?.escape ? CSS.escape(app.id) : "";
  const candidates = [
    windowElement,
    appElement?.closest?.(".application, .app, .window-app"),
    appElement,
    root?.closest?.(".application, .app, .window-app"),
    app?.id ? document.getElementById(app.id) : null,
    escapedId ? document.querySelector(`#${escapedId}`) : null,
    app?.appId ? document.querySelector(`[data-appid="${app.appId}"], [data-application-id="${app.appId}"]`) : null
  ];
  for (const candidate of candidates) {
    if (candidate instanceof HTMLElement) return candidate;
  }
  return null;
}

function addItemSheetHeaderFallback(app: any, html: any = null): void {
  if (!game.user?.isGM) return;
  const item = getItemFromSheetApp(app);
  if (!item) return;
  const frame = getApplicationFrame(app, html);
  if (!frame || frame.querySelector(".hd-edit-equipment, [data-hd-edit-equipment]")) return;
  const header = frame.querySelector<HTMLElement>(".window-header, header.window-header, .app-header, header");
  if (!header) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "hd-edit-equipment hd-item-sheet-header-fallback";
  button.dataset.hdEditEquipment = "true";
  button.title = "HoloDock Ship Equipment";
  button.innerHTML = '<i class="fa-solid fa-shuttle-space"></i><span class="sr-only">Ship Equipment</span>';
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openShipEquipmentDialog(item);
  });
  const controls = header.querySelector<HTMLElement>(".window-controls, .header-controls, .window-header-buttons, .window-buttons, menu");
  const closeButton = header.querySelector<HTMLElement>(".close, [data-action='close']");
  if (controls) controls.prepend(button);
  else if (closeButton) header.insertBefore(button, closeButton);
  else header.append(button);
}

function addItemSheetHeaderFallbackSoon(app: any, html: any = null): void {
  addItemSheetHeaderFallback(app, html);
  window.setTimeout(() => addItemSheetHeaderFallback(app, html), 0);
  window.setTimeout(() => addItemSheetHeaderFallback(app, html), 100);
  window.setTimeout(() => addItemSheetHeaderFallback(app, html), 300);
}

function activateItemSheetHeaderAction(app: any, html: any = null): void {
  addItemSheetHeaderFallbackSoon(app, html);
  const frame = getApplicationFrame(app, html);
  const item = getItemFromSheetApp(app);
  if (!frame || !item || frame.dataset.hdEquipmentHeaderListener === "true") return;
  frame.dataset.hdEquipmentHeaderListener = "true";
  frame.addEventListener("click", (event) => {
    const target = (event.target as HTMLElement | null)?.closest?.("[data-action='holodockShipEquipment'], .hd-edit-equipment");
    if (!target) return;
    event.preventDefault();
    openShipEquipmentDialog(item);
  });
}

class HoloDockApp extends LegacyApplication {
  private linkingSlotId = "";
  private linkResizeObserver?: ResizeObserver;

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holodock",
      title: "HoloDock - Ship Loadout",
      classes: ["holodock-window"],
      template: TEMPLATE_PATH,
      popOut: true,
      resizable: true,
      width: 1280,
      height: 820
    });
  }

  async getData() {
    return getRenderContext();
  }

  activateListeners(html) {
    super.activateListeners(html);
    const element = getElement(this, html);
    if (!element) return;

    element.querySelector("[data-hd-profile-select]")?.addEventListener("change", (event) => {
      selectedProfileId = (event.currentTarget as HTMLSelectElement).value;
      selectedEquipmentSlotId = "";
      void setDefaultProfileId(selectedProfileId).finally(() => this.render(true));
    });

    element.querySelectorAll("[data-hd-page]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const page = (event.currentTarget as HTMLElement).dataset.hdPage ?? "overview";
        if (!HOLODOCK_PAGES.some((candidate) => candidate.id === page)) return;
        selectedPage = page;
        this.render(true);
      });
    });

    element.querySelectorAll("[data-hd-select-equipment]").forEach((button) => {
      button.addEventListener("click", (event) => {
        selectedEquipmentSlotId = (event.currentTarget as HTMLElement).dataset.hdSelectEquipment ?? "";
        selectedPage = "equipment";
        this.render(true);
      });
    });

    element.querySelector("[data-hd-profile-form]")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const profile = getSelectedProfile();
      if (!profile) return;
      const data = Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement).entries());
      await updateProfileMetadata(profile.id, data as Partial<ShipProfile>);
    });

    element.querySelectorAll("[data-hd-action]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const action = (event.currentTarget as HTMLElement).dataset.hdAction;
        const profile = getSelectedProfile();
        if (action === "create-profile") await createProfile();
        if (action === "delete-profile") await deleteProfile(profile?.id);
        if (action === "create-slot") openSlotDialog();
        if (action === "create-stat") openStatDialog();
        if (action === "browse-image") this.browseShipImage();
        if (action === "save-power-preset") openPowerPresetDialog();
      });
    });

    element.querySelectorAll("[data-hd-apply-power-preset]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const profile = getSelectedProfile();
        const presetId = (event.currentTarget as HTMLElement).dataset.hdApplyPowerPreset ?? "";
        if (profile) await applyPowerPreset(profile.id, presetId);
      });
    });

    element.querySelectorAll("[data-hd-delete-power-preset]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const profile = getSelectedProfile();
        const presetId = (event.currentTarget as HTMLElement).dataset.hdDeletePowerPreset ?? "";
        if (profile) await deletePowerPreset(profile.id, presetId);
      });
    });

    element.querySelectorAll("[data-hd-edit-stat]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const profile = getSelectedProfile();
        const stat = profile?.stats.find((candidate) => candidate.id === (event.currentTarget as HTMLElement).dataset.hdEditStat);
        if (stat) openStatDialog(stat);
      });
    });

    element.querySelectorAll("[data-hd-add-stat-label]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const label = (event.currentTarget as HTMLElement).dataset.hdAddStatLabel ?? "New Statistic";
        openStatDialog({ label, value: "", note: "" });
      });
    });

    element.querySelectorAll("[data-hd-stat-value]").forEach((input) => {
      const saveStatValue = async (event: Event) => {
        const profile = getSelectedProfile();
        const target = event.currentTarget as HTMLInputElement;
        if (target.dataset.hdSavingValue === "true") return;
        if (!profile) return;
        if (!target.dataset.hdStatValue && target.value.trim() === "") return;
        target.dataset.hdSavingValue = "true";
        try {
          const rawNote = target.dataset.hdStatNote || "";
          const stat = await upsertStat(profile.id, {
            id: target.dataset.hdStatValue || undefined,
            label: target.dataset.hdStatLabel || "Ship Statistic",
            value: target.value,
            note: rawNote === "Not configured" || rawNote === "Add ship statistic" ? "" : rawNote
          });
          if (stat?.id) target.dataset.hdStatValue = stat.id;
        } finally {
          delete target.dataset.hdSavingValue;
        }
      };
      input.addEventListener("change", saveStatValue);
      input.addEventListener("blur", saveStatValue);
    });

    element.querySelectorAll("[data-hd-delete-stat]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const profile = getSelectedProfile();
        const statId = (event.currentTarget as HTMLElement).dataset.hdDeleteStat ?? "";
        if (profile) await deleteStat(profile.id, statId);
      });
    });

    element.querySelectorAll("[data-hd-edit-slot]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const profile = getSelectedProfile();
        const slot = profile?.slots.find((candidate) => candidate.id === (event.currentTarget as HTMLElement).dataset.hdEditSlot);
        if (slot) openSlotDialog(slot);
      });
    });

    element.querySelectorAll("[data-hd-delete-slot]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const profile = getSelectedProfile();
        const slotId = (event.currentTarget as HTMLElement).dataset.hdDeleteSlot ?? "";
        if (profile) await deleteSlot(profile.id, slotId);
      });
    });

    element.querySelectorAll("[data-hd-browse-equipment]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const profile = getSelectedProfile();
        const slotId = (event.currentTarget as HTMLElement).dataset.hdBrowseEquipment ?? "";
        if (profile) openEquipmentBrowser(profile.id, slotId);
      });
    });

    element.querySelectorAll("[data-hd-open-item]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const profile = getSelectedProfile();
        const slot = profile?.slots.find((candidate) => candidate.id === (event.currentTarget as HTMLElement).dataset.hdOpenItem);
        const item = await resolveItem(slot?.itemUuid ?? "");
        if (item?.sheet?.render) item.sheet.render(true);
        else ui.notifications?.warn?.("That item could not be found.");
      });
    });

    element.querySelectorAll("[data-hd-activate-equipment]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const profile = getSelectedProfile();
        const slotId = (event.currentTarget as HTMLElement).dataset.hdActivateEquipment ?? "";
        const slot = profile?.slots.find((candidate) => candidate.id === slotId);
        const item = await resolveItem(slot?.itemUuid ?? "");
        if (!item || !profile || !slot) {
          ui.notifications?.warn?.("That ship equipment could not be found.");
          return;
        }
        const result = await activateEquipment(item, { profile, slot });
        if (result.blocked || !result.ok) ui.notifications?.warn?.(result.message);
        else if (!result.handled) ui.notifications?.info?.(result.message);
        else if (result.message) ui.notifications?.info?.(result.message);
      });
    });

    element.querySelectorAll("[data-hd-durability-adjust]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const profile = getSelectedProfile();
        const target = event.currentTarget as HTMLElement;
        const slot = profile?.slots.find((candidate) => candidate.id === target.dataset.hdDurabilityAdjust);
        const item = await resolveItem(slot?.itemUuid ?? "");
        if (!item) {
          ui.notifications?.warn?.("That ship equipment could not be found.");
          return;
        }
        const equipment = getShipEquipmentData(item);
        if (!equipment.enabled || !equipment.durability.enabled) return;
        await updateShipEquipmentDurability(item, equipment.durability.value + normalizeNumber(target.dataset.hdDurabilityDelta, 0));
      });
    });

    element.querySelectorAll("[data-hd-durability-set]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const profile = getSelectedProfile();
        const slot = profile?.slots.find((candidate) => candidate.id === (event.currentTarget as HTMLElement).dataset.hdDurabilitySet);
        const item = await resolveItem(slot?.itemUuid ?? "");
        if (item) openDurabilityDialog(item);
        else ui.notifications?.warn?.("That ship equipment could not be found.");
      });
    });

    element.querySelectorAll("[data-hd-durability-value]").forEach((input) => {
      input.addEventListener("change", async (event) => {
        const profile = getSelectedProfile();
        const target = event.currentTarget as HTMLInputElement;
        const slot = profile?.slots.find((candidate) => candidate.id === target.dataset.hdDurabilityValue);
        const item = await resolveItem(slot?.itemUuid ?? "");
        if (!item) {
          ui.notifications?.warn?.("That ship equipment could not be found.");
          return;
        }
        await updateShipEquipmentDurability(item, normalizeNumber(target.value, 0));
      });
    });

    element.querySelectorAll("[data-hd-power-toggle]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const profile = getSelectedProfile();
        const target = event.currentTarget as HTMLElement;
        const slot = profile?.slots.find((candidate) => candidate.id === target.dataset.hdPowerToggle);
        const item = await resolveItem(slot?.itemUuid ?? "");
        if (!item) {
          ui.notifications?.warn?.("That ship equipment could not be found.");
          return;
        }
        const equipment = getShipEquipmentData(item);
        if (!equipment.enabled || !equipment.power.enabled) return;
        await updateShipEquipmentPowerState(item, target.dataset.hdPowerOnline === "true");
      });
    });

    element.querySelectorAll("[data-hd-power-adjust]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const profile = getSelectedProfile();
        const target = event.currentTarget as HTMLElement;
        const slot = profile?.slots.find((candidate) => candidate.id === target.dataset.hdPowerAdjust);
        const item = await resolveItem(slot?.itemUuid ?? "");
        if (!item) {
          ui.notifications?.warn?.("That ship equipment could not be found.");
          return;
        }
        const equipment = getShipEquipmentData(item);
        if (!equipment.enabled || !equipment.power.enabled) return;
        await updateShipEquipmentPowerAllocation(item, equipment.power.allocated + normalizeNumber(target.dataset.hdPowerDelta, 0));
      });
    });

    element.querySelectorAll("[data-hd-power-allocation]").forEach((input) => {
      input.addEventListener("change", async (event) => {
        const profile = getSelectedProfile();
        const target = event.currentTarget as HTMLInputElement;
        const slot = profile?.slots.find((candidate) => candidate.id === target.dataset.hdPowerAllocation);
        const item = await resolveItem(slot?.itemUuid ?? "");
        if (!item) {
          ui.notifications?.warn?.("That ship equipment could not be found.");
          return;
        }
        await updateShipEquipmentPowerAllocation(item, normalizeNumber(target.value, 0));
      });
    });

    element.querySelectorAll("[data-hd-remove-item]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const profile = getSelectedProfile();
        const slotId = (event.currentTarget as HTMLElement).dataset.hdRemoveItem ?? "";
        if (profile) await unequipItem(profile.id, slotId);
      });
    });

    this.activateSlotDrops(element);
    this.activateSlotAnchors(element);
    window.requestAnimationFrame(() => this.syncShipLinks(element));
    window.setTimeout(() => this.syncShipLinks(element), 100);
  }

  activateSlotDrops(element: HTMLElement): void {
    element.querySelectorAll("[data-hd-slot-id]").forEach((slotElement) => {
      slotElement.addEventListener("dragover", (event) => {
        if (!game.user?.isGM) return;
        event.preventDefault();
        slotElement.classList.add("is-drop-hover");
      });
      slotElement.addEventListener("dragleave", () => slotElement.classList.remove("is-drop-hover"));
      slotElement.addEventListener("drop", async (event) => {
        slotElement.classList.remove("is-drop-hover");
        if (!game.user?.isGM) return;
        event.preventDefault();
        const profile = getSelectedProfile();
        const slotId = (slotElement as HTMLElement).dataset.hdSlotId ?? "";
        const data = getDragData(event as DragEvent);
        const uuid = data.uuid ?? data.documentUuid ?? data.itemUuid ?? "";
        if (!profile || !uuid) {
          ui.notifications?.warn?.("Drop a Foundry Item onto an equipment slot.");
          return;
        }
        await equipItem(profile.id, slotId, uuid);
      });
      slotElement.addEventListener("contextmenu", async (event) => {
        if (!game.user?.isGM) return;
        event.preventDefault();
        const profile = getSelectedProfile();
        const slotId = (slotElement as HTMLElement).dataset.hdSlotId ?? "";
        if (profile) await unequipItem(profile.id, slotId);
      });
    });
  }

  activateSlotAnchors(element: HTMLElement): void {
    const map = element.querySelector<HTMLElement>("[data-hd-ship-map]");
    if (!map) return;
    this.linkResizeObserver?.disconnect();
    this.linkResizeObserver = undefined;
    if (typeof ResizeObserver !== "undefined") {
      this.linkResizeObserver = new ResizeObserver(() => this.syncShipLinks(element));
      this.linkResizeObserver.observe(element.querySelector<HTMLElement>(".hd-stage") ?? element);
    }
    element.querySelector<HTMLElement>(".hd-slot-rail")?.addEventListener("scroll", () => this.syncShipLinks(element));
    map.querySelector("img")?.addEventListener("load", () => this.syncShipLinks(element));

    element.querySelectorAll("[data-hd-link-slot]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!game.user?.isGM) return;
        this.linkingSlotId = (button as HTMLElement).dataset.hdLinkSlot ?? "";
        element.classList.toggle("is-linking-slot", Boolean(this.linkingSlotId));
      });
    });

    element.querySelectorAll("[data-hd-clear-link]").forEach((button) => {
      button.addEventListener("click", async () => {
        const profile = getSelectedProfile();
        const slotId = (button as HTMLElement).dataset.hdClearLink ?? "";
        if (profile) await clearSlotAnchor(profile.id, slotId);
      });
    });

    map.addEventListener("click", async (event) => {
      if (!game.user?.isGM || !this.linkingSlotId) return;
      event.preventDefault();
      const profile = getSelectedProfile();
      const point = this.getImageAnchorPoint(map, event.clientX, event.clientY);
      const slotId = this.linkingSlotId;
      this.linkingSlotId = "";
      element.classList.remove("is-linking-slot");
      if (profile) await setSlotAnchor(profile.id, slotId, point.x, point.y);
    });

    element.querySelectorAll("[data-hd-anchor-slot]").forEach((pin) => {
      pin.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const slotId = (pin as HTMLElement).dataset.hdAnchorSlot ?? "";
        if (!slotId || game.user?.isGM) return;
        selectedEquipmentSlotId = slotId;
        selectedPage = "equipment";
        this.render(true);
      });
      pin.addEventListener("pointerdown", (event) => {
        if (!game.user?.isGM) return;
        event.preventDefault();
        const slotId = (pin as HTMLElement).dataset.hdAnchorSlot ?? "";
        const startX = event.clientX;
        const startY = event.clientY;
        let moved = false;
        const move = (moveEvent: PointerEvent) => {
          if (Math.abs(moveEvent.clientX - startX) > 3 || Math.abs(moveEvent.clientY - startY) > 3) moved = true;
          const point = this.getImageAnchorPoint(map, moveEvent.clientX, moveEvent.clientY);
          (pin as HTMLElement).dataset.hdAnchorX = String(point.x);
          (pin as HTMLElement).dataset.hdAnchorY = String(point.y);
          this.syncShipLinks(element);
        };
        const up = async (upEvent: PointerEvent) => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
          if (!moved) {
            selectedEquipmentSlotId = slotId;
            selectedPage = "equipment";
            this.render(true);
            return;
          }
          const profile = getSelectedProfile();
          const point = this.getImageAnchorPoint(map, upEvent.clientX, upEvent.clientY);
          if (profile) await setSlotAnchor(profile.id, slotId, point.x, point.y);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
      });
    });
  }

  getImageAnchorPoint(map: HTMLElement, clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.getShipImageRect(map);
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    return { x, y };
  }

  getShipImageRect(map: HTMLElement): DOMRect {
    const img = map.querySelector<HTMLImageElement>("img");
    const rect = img?.getBoundingClientRect();
    if (rect?.width && rect?.height && img?.naturalWidth && img?.naturalHeight) {
      const imageRatio = img.naturalWidth / img.naturalHeight;
      const boxRatio = rect.width / rect.height;
      if (imageRatio > boxRatio) {
        const height = rect.width / imageRatio;
        const top = rect.top + (rect.height - height) / 2;
        return new DOMRect(rect.left, top, rect.width, height);
      }
      const width = rect.height * imageRatio;
      const left = rect.left + (rect.width - width) / 2;
      return new DOMRect(left, rect.top, width, rect.height);
    }
    if (rect?.width && rect?.height) return rect;
    return map.getBoundingClientRect();
  }

  positionSlotPins(element: HTMLElement): void {
    const map = element.querySelector<HTMLElement>("[data-hd-ship-map]");
    if (!map) return;
    const imageRect = this.getShipImageRect(map);
    const mapRect = map.getBoundingClientRect();
    element.querySelectorAll<HTMLElement>("[data-hd-anchor-slot]").forEach((pin) => {
      const anchorX = Number(pin.dataset.hdAnchorX);
      const anchorY = Number(pin.dataset.hdAnchorY);
      if (!Number.isFinite(anchorX) || !Number.isFinite(anchorY)) return;
      const x = imageRect.left - mapRect.left + (imageRect.width * anchorX) / 100;
      const y = imageRect.top - mapRect.top + (imageRect.height * anchorY) / 100;
      pin.style.left = `${x}px`;
      pin.style.top = `${y}px`;
    });
  }

  syncShipLinks(element: HTMLElement): void {
    this.positionSlotPins(element);
    this.drawSlotLinks(element);
  }

  drawSlotLinks(element: HTMLElement): void {
    const svg = element.querySelector<SVGSVGElement>("[data-hd-link-lines]");
    const map = element.querySelector<HTMLElement>("[data-hd-ship-map]");
    if (!svg || !map) return;
    const stageRect = svg.getBoundingClientRect();
    const width = Math.max(1, Math.round(stageRect.width));
    const height = Math.max(1, Math.round(stageRect.height));
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(height));
    svg.innerHTML = "";

    element.querySelectorAll<HTMLElement>("[data-hd-anchor-slot]").forEach((pin) => {
      const slotId = pin.dataset.hdAnchorSlot ?? "";
      const card = element.querySelector<HTMLElement>(`[data-hd-slot-card="${slotId}"]`);
      if (!card) return;
      const pinRect = pin.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const x1 = pinRect.left + pinRect.width / 2 - stageRect.left;
      const y1 = pinRect.top + pinRect.height / 2 - stageRect.top;
      const x2 = cardRect.left - stageRect.left;
      const y2 = cardRect.top + cardRect.height / 2 - stageRect.top;
      const control = Math.max(40, Math.abs(x2 - x1) / 2);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M ${x1} ${y1} C ${x1 + control} ${y1}, ${x2 - control} ${y2}, ${x2} ${y2}`);
      path.setAttribute("class", `hd-link-line ${pin.dataset.hdAnchorState || ""}`.trim());
      svg.append(path);
    });
  }

  browseShipImage(): void {
    if (!requireGM("choose ship images")) return;
    const element = getElement(this);
    const input = element?.querySelector<HTMLInputElement>("[data-hd-profile-form] input[name='image']");
    if (!input || typeof FilePicker === "undefined") {
      ui.notifications?.warn?.("Foundry FilePicker is not available.");
      return;
    }
    new FilePicker({
      type: "image",
      current: input.value,
      callback: (path) => {
        input.value = path;
      }
    }).browse();
  }

  async close(options = {}) {
    this.linkResizeObserver?.disconnect();
    this.linkResizeObserver = undefined;
    holodockApp = null;
    return super.close(options);
  }
}

async function openHoloDock(): Promise<HoloDockApp> {
  if (!holodockApp) holodockApp = new HoloDockApp();
  await holodockApp.render(true);
  return holodockApp;
}

function registerSettings(): void {
  game.settings.register(MODULE_ID, SETTING_PROFILES, {
    name: "HoloDock Ship Profiles",
    hint: "World-level ship profile and loadout data.",
    scope: "world",
    config: false,
    type: Object,
    default: {},
    onChange: refreshOpenApp
  });

  game.settings.register(MODULE_ID, SETTING_CATEGORIES, {
    name: "HoloDock Slot Categories",
    hint: "Reusable equipment slot categories for HoloDock.",
    scope: "world",
    config: false,
    type: Array,
    default: DEFAULT_CATEGORIES,
    onChange: refreshOpenApp
  });

  game.settings.register(MODULE_ID, SETTING_DEFAULT_PROFILE, {
    name: "HoloDock Default Ship Profile",
    hint: "The ship profile this user opens by default.",
    scope: "client",
    config: false,
    type: String,
    default: "",
    onChange: refreshOpenApp
  });
}

function registerApi(): void {
  const api = {
    open: openHoloDock,
    getProfiles,
    getProfile,
    createProfile,
    updateProfileMetadata,
    deleteProfile,
    capturePowerPreset,
    applyPowerPreset,
    deletePowerPreset,
    upsertSlot,
    deleteSlot,
    upsertStat,
    deleteStat,
    setSlotAnchor,
    clearSlotAnchor,
    equipItem,
    unequipItem,
    getCategories,
    getShipPowerBudget,
    getShipEquipmentData,
    isShipEquipment,
    validateItemForSlot,
    setShipEquipmentData,
    updateShipEquipmentDurability,
    updateShipEquipmentPowerState,
    updateShipEquipmentPowerAllocation,
    activateEquipment
  };

  game.holodock = api;
  const module = game.modules.get(MODULE_ID);
  if (module) module.api = api;
}

function getHoloSuiteApi(): any {
  const holosuite = game.modules.get("holosuite-core");
  return (holosuite?.active ? holosuite.api : null)
    ?? game.holosuite
    ?? (globalThis as any).HoloSuiteCoreApi
    ?? null;
}

function registerWithHoloSuite(): boolean {
  const api = getHoloSuiteApi();
  if (!api?.registerApp) return false;

  const registration: HoloSuiteAppRegistration = {
    id: MODULE_ID,
    title: "HoloDock",
    icon: "fa-solid fa-shuttle-space",
    premium: false,
    playerVisible: true,
    description: "View and manage system-agnostic ship loadouts.",
    open: () => openHoloDock()
  };
  api.registerApp(registration);
  return true;
}

function registerWithHoloSuiteWhenReady(): void {
  if (registerWithHoloSuite()) return;

  let attempts = 0;
  const retry = () => {
    attempts += 1;
    if (registerWithHoloSuite() || attempts >= 20) return;
    window.setTimeout(retry, 250);
  };

  Hooks.once("holosuite-core.apiReady", () => registerWithHoloSuite());
  window.setTimeout(retry, 250);
}

Hooks.once("init", async () => {
  registerSettings();
  Handlebars.registerHelper("hdFallback", (value, fallback) => value || fallback);
  await loadTemplates([TEMPLATE_PATH]);
});

Hooks.once("ready", () => {
  registerApi();
  Hooks.on("getApplicationHeaderButtons", addItemSheetHeaderButton);
  Hooks.on("getApplicationV1HeaderButtons", addItemSheetHeaderButton);
  Hooks.on("getDocumentSheetHeaderButtons", addItemSheetHeaderButton);
  Hooks.on("getItemSheetHeaderButtons", addItemSheetHeaderButton);
  Hooks.on("getHeaderControlsApplicationV2", addItemSheetHeaderControl);
  Hooks.on("renderItemSheet", activateItemSheetHeaderAction);
  Hooks.on("renderItemSheetV2", activateItemSheetHeaderAction);
  Hooks.on("renderApplication", activateItemSheetHeaderAction);
  Hooks.on("renderApplicationV1", activateItemSheetHeaderAction);
  Hooks.on("renderApplicationV2", activateItemSheetHeaderAction);
  registerWithHoloSuiteWhenReady();
  console.log(`${MODULE_ID} | Ready. API available at game.holodock.`);
});
