import type { HoloSuiteAppRegistration } from "../../shared/src/index";

const MODULE_ID = "holodock";
const MODULE_TITLE = "HoloDock";
const SETTING_PROFILES = "profiles";
const SETTING_CATEGORIES = "slotCategories";
const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/holodock.hbs`;
const DEFAULT_IMAGE = "modules/holodock/assets/space-station.svg";
const LEGACY_DEFAULT_IMAGE = "icons/svg/space-station.svg";
const DEFAULT_CATEGORIES = ["Weapons", "Defense", "Utility", "Engines", "Cargo", "Special"];

type ShipSlot = {
  id: string;
  label: string;
  category: string;
  itemUuid?: string;
};

type ShipProfile = {
  id: string;
  name: string;
  shipClass: string;
  image: string;
  slots: ShipSlot[];
};

const LegacyApplication = (globalThis as any).Application ?? foundry?.appv1?.api?.Application;

let holodockApp: HoloDockApp | null = null;
let selectedProfileId = "";

function clone<T>(value: T): T {
  if (foundry?.utils?.deepClone) return foundry.utils.deepClone(value);
  if (foundry?.utils?.duplicate) return foundry.utils.duplicate(value);
  return JSON.parse(JSON.stringify(value ?? {}));
}

function createId(prefix = "hd"): string {
  const id = foundry?.utils?.randomID?.() ?? crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${id}`;
}

function escapeHtml(value: unknown): string {
  if (foundry?.utils?.escapeHTML) return foundry.utils.escapeHTML(String(value ?? ""));
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

function requireGM(action = "edit HoloDock"): boolean {
  if (game.user?.isGM) return true;
  ui.notifications?.warn?.(`Only a GM can ${action}.`);
  return false;
}

function normalizeSlot(data: Partial<ShipSlot> = {}): ShipSlot {
  return {
    id: String(data.id || createId("slot")),
    label: String(data.label || "Equipment Slot").trim() || "Equipment Slot",
    category: String(data.category || DEFAULT_CATEGORIES[0]).trim() || DEFAULT_CATEGORIES[0],
    itemUuid: String(data.itemUuid || "").trim() || undefined
  };
}

function normalizeProfile(data: Partial<ShipProfile> = {}): ShipProfile {
  const image = String(data.image || DEFAULT_IMAGE).trim() || DEFAULT_IMAGE;
  return {
    id: String(data.id || createId("ship")),
    name: String(data.name || "Party Ship").trim() || "Party Ship",
    shipClass: String(data.shipClass || "").trim(),
    image: image === LEGACY_DEFAULT_IMAGE ? DEFAULT_IMAGE : image,
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
  profile.slots = profile.slots.filter((slot) => slot.id !== slotId);
  profiles[profileId] = normalizeProfile(profile);
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

async function prepareSlotForRender(slot: ShipSlot): Promise<any> {
  if (!slot.itemUuid) return { ...slot, item: null };
  const item = await resolveItem(slot.itemUuid);
  if (!item) {
    return {
      ...slot,
      item: {
        name: "Missing Item",
        img: "icons/svg/hazard.svg",
        status: "Stored UUID no longer resolves",
        missing: true
      }
    };
  }

  return {
    ...slot,
      item: {
        name: item.name ?? "Unnamed Item",
        img: item.img || "icons/svg/item-bag.svg",
        status: item.type ? `Item Type: ${item.type}` : "Foundry Item",
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

class HoloDockApp extends LegacyApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holodock",
      title: "HoloDock - Ship Loadout",
      classes: ["holodock-window"],
      template: TEMPLATE_PATH,
      popOut: true,
      resizable: true,
      width: 920,
      height: "auto"
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
        if (action === "browse-image") this.browseShipImage();
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
    equipItem,
    unequipItem,
    getCategories
  };

  game.holodock = api;
  const module = game.modules.get(MODULE_ID);
  if (module) module.api = api;
}

function registerWithHoloSuite(): boolean {
  const holosuite = game.modules.get("holosuite-core");
  const api = holosuite?.active ? holosuite.api : null;
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

Hooks.once("init", async () => {
  registerSettings();
  Handlebars.registerHelper("hdFallback", (value, fallback) => value || fallback);
  await loadTemplates([TEMPLATE_PATH]);
});

Hooks.once("ready", () => {
  registerApi();
  registerWithHoloSuite();
  console.log(`${MODULE_ID} | Ready. API available at game.holodock.`);
});
