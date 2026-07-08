import type { HoloSuiteAppRegistration } from "../../shared/src/index";
import { getApplicationBase } from "../../shared/src/application-base";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_IMAGE,
  LEGACY_DEFAULT_IMAGE,
  MODULE_ID,
  MODULE_TITLE,
  SETTING_CATEGORIES,
  SETTING_PROFILES,
  TEMPLATE_PATH
} from "./constants";
import { clone, createId, escapeHtml, requireGM } from "./utils";

type ShipSlot = {
  id: string;
  label: string;
  category: string;
  description: string;
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

type ShipProfile = {
  id: string;
  name: string;
  shipClass: string;
  image: string;
  stats: ShipStat[];
  slots: ShipSlot[];
};

const LegacyApplication = getApplicationBase();

let holodockApp: HoloDockApp | null = null;
let selectedProfileId = "";

function normalizeSlot(data: Partial<ShipSlot> = {}): ShipSlot {
  const anchorX = Number(data.anchorX);
  const anchorY = Number(data.anchorY);
  return {
    id: String(data.id || createId("slot")),
    label: String(data.label || "Equipment Slot").trim() || "Equipment Slot",
    category: String(data.category || DEFAULT_CATEGORIES[0]).trim() || DEFAULT_CATEGORIES[0],
    description: String(data.description || "").trim(),
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

function normalizeProfile(data: Partial<ShipProfile> = {}): ShipProfile {
  const image = String(data.image || DEFAULT_IMAGE).trim() || DEFAULT_IMAGE;
  return {
    id: String(data.id || createId("ship")),
    name: String(data.name || "Party Ship").trim() || "Party Ship",
    shipClass: String(data.shipClass || "").trim(),
    image: image === LEGACY_DEFAULT_IMAGE ? DEFAULT_IMAGE : image,
    stats: Array.isArray(data.stats) ? data.stats.map(normalizeStat) : [],
    slots: Array.isArray(data.slots) ? data.slots.map(normalizeSlot) : []
  };
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
    selectedProfileId = profiles[0].id;
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
    stats: [
      normalizeStat({ id: createId("stat"), label: "Speed", value: "6", note: "" }),
      normalizeStat({ id: createId("stat"), label: "Fuel", value: "100%", note: "" }),
      normalizeStat({ id: createId("stat"), label: "Defense", value: "10", note: "" })
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
    stats: existing.stats,
    slots: existing.slots
  });
  profiles[profileId] = updated;
  await saveProfileStore(profiles);
  return updated;
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
  const slot = normalizeSlot(slotData);
  const index = profile.slots.findIndex((candidate) => candidate.id === slot.id);
  if (index >= 0) profile.slots[index] = { ...profile.slots[index], ...slot };
  else profile.slots.push(slot);
  profiles[profileId] = normalizeProfile(profile);
  await rememberCategory(slot.category);
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

async function prepareSlotForRender(slot: ShipSlot): Promise<any> {
  const hasAnchor = Number.isFinite(slot.anchorX) && Number.isFinite(slot.anchorY);
  const preparedSlot = {
    ...slot,
    hasAnchor
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

  return {
    ...preparedSlot,
      item: {
        name: item.name ?? "Unnamed Item",
        img: item.img || "icons/svg/item-bag.svg",
        status: item.type ? `Item Type: ${item.type}` : "Foundry Item",
        description: extractItemDescription(item),
        uuid: item.uuid
      }
  };
}

async function getRenderContext(): Promise<any> {
  const selectedProfile = getSelectedProfile();
  const preparedProfile = selectedProfile
    ? {
      ...selectedProfile,
      slots: await Promise.all(selectedProfile.slots.map(prepareSlotForRender))
    }
    : null;
  const profiles = getProfiles().map((profile) => ({
    ...profile,
    isSelected: profile.id === selectedProfileId
  }));

  return {
    canEdit: game.user?.isGM === true,
    hasProfiles: profiles.length > 0,
    profiles,
    selectedProfile: preparedProfile,
    categories: getCategories()
  };
}

function getElement(app: any, html: any = null): HTMLElement | null {
  if (html?.[0]) return html[0];
  if (html instanceof HTMLElement) return html;
  if (app.element?.[0]) return app.element[0];
  return app.element ?? null;
}

function refreshOpenApp(): void {
  if (holodockApp?.rendered) holodockApp.render(true);
}

function getFormValues(html: any): Record<string, string> {
  const root = html?.[0] ?? html;
  const form = root?.querySelector?.("form") ?? root?.closest?.("form");
  return Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
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
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (html) => upsertSlot(profile.id, getFormValues(html))
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
      width: 920,
      height: 760
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
      this.render(true);
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
      });
    });

    element.querySelectorAll("[data-hd-edit-stat]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const profile = getSelectedProfile();
        const stat = profile?.stats.find((candidate) => candidate.id === (event.currentTarget as HTMLElement).dataset.hdEditStat);
        if (stat) openStatDialog(stat);
      });
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

    element.querySelectorAll("[data-hd-open-item]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const profile = getSelectedProfile();
        const slot = profile?.slots.find((candidate) => candidate.id === (event.currentTarget as HTMLElement).dataset.hdOpenItem);
        const item = await resolveItem(slot?.itemUuid ?? "");
        if (item?.sheet?.render) item.sheet.render(true);
        else ui.notifications?.warn?.("That item could not be found.");
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
      pin.addEventListener("pointerdown", (event) => {
        if (!game.user?.isGM) return;
        event.preventDefault();
        const slotId = (pin as HTMLElement).dataset.hdAnchorSlot ?? "";
        const move = (moveEvent: PointerEvent) => {
          const point = this.getImageAnchorPoint(map, moveEvent.clientX, moveEvent.clientY);
          (pin as HTMLElement).dataset.hdAnchorX = String(point.x);
          (pin as HTMLElement).dataset.hdAnchorY = String(point.y);
          this.syncShipLinks(element);
        };
        const up = async (upEvent: PointerEvent) => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
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
      path.setAttribute("class", "hd-link-line");
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
}

function registerApi(): void {
  const api = {
    open: openHoloDock,
    getProfiles,
    getProfile,
    createProfile,
    updateProfileMetadata,
    deleteProfile,
    upsertSlot,
    deleteSlot,
    upsertStat,
    deleteStat,
    setSlotAnchor,
    clearSlotAnchor,
    equipItem,
    unequipItem,
    getCategories
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
  registerWithHoloSuiteWhenReady();
  console.log(`${MODULE_ID} | Ready. API available at game.holodock.`);
});
