const u = "holodock", P = "profiles", q = "slotCategories", G = `modules/${u}/templates/holodock.hbs`, E = "modules/holodock/assets/space-station.svg", Y = "icons/svg/space-station.svg", S = ["Weapons", "Defense", "Utility", "Engines", "Cargo", "Special"];
var F, $;
const B = globalThis.Application ?? (($ = (F = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : F.api) == null ? void 0 : $.Application);
let g = null, f = "";
function y(t) {
  var e, i;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.deepClone ? foundry.utils.deepClone(t) : (i = foundry == null ? void 0 : foundry.utils) != null && i.duplicate ? foundry.utils.duplicate(t) : JSON.parse(JSON.stringify(t ?? {}));
}
function A(t = "hd") {
  var i, n, r;
  const e = ((n = (i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.randomID) == null ? void 0 : n.call(i)) ?? ((r = crypto == null ? void 0 : crypto.randomUUID) == null ? void 0 : r.call(crypto)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${t}-${e}`;
}
function b(t) {
  var i;
  if ((i = foundry == null ? void 0 : foundry.utils) != null && i.escapeHTML) return foundry.utils.escapeHTML(String(t ?? ""));
  const e = document.createElement("div");
  return e.textContent = String(t ?? ""), e.innerHTML;
}
function p(t = "edit HoloDock") {
  var e, i, n;
  return (e = game.user) != null && e.isGM ? !0 : ((n = (i = ui.notifications) == null ? void 0 : i.warn) == null || n.call(i, `Only a GM can ${t}.`), !1);
}
function I(t = {}) {
  return {
    id: String(t.id || A("slot")),
    label: String(t.label || "Equipment Slot").trim() || "Equipment Slot",
    category: String(t.category || S[0]).trim() || S[0],
    itemUuid: String(t.itemUuid || "").trim() || void 0
  };
}
function v(t = {}) {
  const e = String(t.image || E).trim() || E;
  return {
    id: String(t.id || A("ship")),
    name: String(t.name || "Party Ship").trim() || "Party Ship",
    shipClass: String(t.shipClass || "").trim(),
    image: e === Y ? E : e,
    slots: Array.isArray(t.slots) ? t.slots.map(I) : []
  };
}
function m() {
  const t = game.settings.get(u, P);
  if (!t || typeof t != "object" || Array.isArray(t)) return {};
  const e = {};
  for (const i of Object.values(t)) {
    const n = v(i);
    e[n.id] = n;
  }
  return e;
}
function C() {
  return Object.values(m()).sort((t, e) => t.name.localeCompare(e.name));
}
async function h(t) {
  p("save ship loadouts") && (await game.settings.set(u, P, t), k());
}
function L() {
  const t = game.settings.get(u, q), e = Array.isArray(t) ? t.map((i) => String(i).trim()).filter(Boolean) : [];
  return e.length ? [...new Set(e)] : S;
}
async function K(t) {
  var n;
  const e = String(t || "").trim();
  if (!e || !((n = game.user) != null && n.isGM)) return;
  const i = L();
  i.some((r) => r.toLowerCase() === e.toLowerCase()) || await game.settings.set(u, q, [...i, e]);
}
function d() {
  const t = C();
  return t.length ? ((!f || !t.some((e) => e.id === f)) && (f = t[0].id), t.find((e) => e.id === f) ?? null) : null;
}
function x(t = f) {
  const e = m()[t];
  return e ? v(e) : null;
}
async function j() {
  if (!p("create ship profiles")) return null;
  const t = v({
    id: A("ship"),
    name: "New Ship",
    shipClass: "",
    image: E,
    slots: S.slice(0, 4).map((i) => I({
      id: A("slot"),
      label: i,
      category: i
    }))
  }), e = y(m());
  return e[t.id] = t, f = t.id, await h(e), t;
}
async function N(t, e) {
  if (!p("update ship profiles")) return null;
  const i = y(m()), n = i[t];
  if (!n) return null;
  const r = v({
    ...n,
    name: e.name,
    shipClass: e.shipClass,
    image: e.image,
    slots: n.slots
  });
  return i[t] = r, await h(i), r;
}
async function R(t = f) {
  if (!p("delete ship profiles")) return !1;
  const e = x(t);
  if (!e || !await Dialog.confirm({
    title: "Delete Ship Profile",
    content: `<p>Delete <strong>${b(e.name)}</strong>?</p>`,
    defaultYes: !1
  })) return !1;
  const n = y(m());
  return delete n[t], f = Object.keys(n)[0] ?? "", await h(n), !0;
}
async function _(t, e) {
  if (!p("edit equipment slots")) return null;
  const i = y(m()), n = i[t];
  if (!n) return null;
  const r = I(e), o = n.slots.findIndex((s) => s.id === r.id);
  return o >= 0 ? n.slots[o] = { ...n.slots[o], ...r } : n.slots.push(r), i[t] = v(n), await K(r.category), await h(i), r;
}
async function z(t, e) {
  if (!p("delete equipment slots")) return !1;
  const i = y(m()), n = i[t];
  return n ? (n.slots = n.slots.filter((r) => r.id !== e), i[t] = v(n), await h(i), !0) : !1;
}
async function J(t, e, i) {
  var s, a, l;
  if (!p("equip items")) return !1;
  const n = await U(i);
  if (!n)
    return (a = (s = ui.notifications) == null ? void 0 : s.warn) == null || a.call(s, "Drop a regular Foundry Item onto the slot."), !1;
  const r = y(m()), o = (l = r[t]) == null ? void 0 : l.slots.find((c) => c.id === e);
  return o ? (o.itemUuid = n.uuid, await h(r), !0) : !1;
}
async function T(t, e) {
  var r;
  if (!p("remove equipped items")) return !1;
  const i = y(m()), n = (r = i[t]) == null ? void 0 : r.slots.find((o) => o.id === e);
  return n ? (delete n.itemUuid, await h(i), !0) : !1;
}
async function U(t) {
  var n;
  const e = String(t || "").trim(), i = globalThis.fromUuid;
  if (!e || typeof i != "function") return null;
  try {
    const r = await i(e);
    return (r == null ? void 0 : r.documentName) === "Item" || ((n = r == null ? void 0 : r.constructor) == null ? void 0 : n.name) === "Item" ? r : null;
  } catch (r) {
    return console.warn(`${u} | Failed to resolve item UUID "${e}".`, r), null;
  }
}
function Q(t) {
  var e, i, n;
  try {
    const r = globalThis.TextEditor ?? ((i = (e = foundry == null ? void 0 : foundry.applications) == null ? void 0 : e.ux) == null ? void 0 : i.TextEditor);
    if (r != null && r.getDragEventData) return r.getDragEventData(t);
  } catch {
  }
  try {
    return JSON.parse(((n = t.dataTransfer) == null ? void 0 : n.getData("text/plain")) || "{}");
  } catch {
    return {};
  }
}
async function X(t) {
  if (!t.itemUuid) return { ...t, item: null };
  const e = await U(t.itemUuid);
  return e ? {
    ...t,
    item: {
      name: e.name ?? "Unnamed Item",
      img: e.img || "icons/svg/item-bag.svg",
      status: e.type ? `Item Type: ${e.type}` : "Foundry Item",
      uuid: e.uuid
    }
  } : {
    ...t,
    item: {
      name: "Missing Item",
      img: "icons/svg/hazard.svg",
      status: "Stored UUID no longer resolves",
      missing: !0
    }
  };
}
async function Z() {
  var n;
  const t = d(), e = t ? {
    ...t,
    slots: await Promise.all(t.slots.map(X))
  } : null, i = C().map((r) => ({
    ...r,
    isSelected: r.id === f
  }));
  return {
    canEdit: ((n = game.user) == null ? void 0 : n.isGM) === !0,
    hasProfiles: i.length > 0,
    profiles: i,
    selectedProfile: e,
    categories: L()
  };
}
function H(t, e = null) {
  var i;
  return e != null && e[0] ? e[0] : e instanceof HTMLElement ? e : (i = t.element) != null && i[0] ? t.element[0] : t.element ?? null;
}
function k() {
  g != null && g.rendered && g.render(!0);
}
function ee(t) {
  var n, r;
  const e = (t == null ? void 0 : t[0]) ?? t, i = ((n = e == null ? void 0 : e.querySelector) == null ? void 0 : n.call(e, "form")) ?? ((r = e == null ? void 0 : e.closest) == null ? void 0 : r.call(e, "form"));
  return Object.fromEntries(new FormData(i).entries());
}
function M(t = {}) {
  if (!p("edit equipment slots")) return;
  const e = d();
  if (!e) return;
  const i = I({ label: "New Slot", category: S[0], ...t }), n = L().map((r) => `<option value="${b(r)}">`).join("");
  new Dialog({
    title: t.id ? "Edit Equipment Slot" : "Add Equipment Slot",
    content: `
      <form class="hd-dialog-form">
        <input type="hidden" name="id" value="${b(i.id)}">
        <label>
          <span>Slot Label</span>
          <input type="text" name="label" value="${b(i.label)}">
        </label>
        <label>
          <span>Category</span>
          <input type="text" name="category" value="${b(i.category)}" list="hd-slot-categories">
          <datalist id="hd-slot-categories">${n}</datalist>
        </label>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (r) => _(e.id, ee(r))
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
  }).render(!0);
}
class te extends B {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holodock",
      title: "HoloDock - Ship Loadout",
      classes: ["holodock-window"],
      template: G,
      popOut: !0,
      resizable: !0,
      width: 920,
      height: "auto"
    });
  }
  async getData() {
    return Z();
  }
  activateListeners(e) {
    var n, r;
    super.activateListeners(e);
    const i = H(this, e);
    i && ((n = i.querySelector("[data-hd-profile-select]")) == null || n.addEventListener("change", (o) => {
      f = o.currentTarget.value, this.render(!0);
    }), (r = i.querySelector("[data-hd-profile-form]")) == null || r.addEventListener("submit", async (o) => {
      o.preventDefault();
      const s = d();
      if (!s) return;
      const a = Object.fromEntries(new FormData(o.currentTarget).entries());
      await N(s.id, a);
    }), i.querySelectorAll("[data-hd-action]").forEach((o) => {
      o.addEventListener("click", async (s) => {
        const a = s.currentTarget.dataset.hdAction, l = d();
        a === "create-profile" && await j(), a === "delete-profile" && await R(l == null ? void 0 : l.id), a === "create-slot" && M(), a === "browse-image" && this.browseShipImage();
      });
    }), i.querySelectorAll("[data-hd-edit-slot]").forEach((o) => {
      o.addEventListener("click", (s) => {
        const a = d(), l = a == null ? void 0 : a.slots.find((c) => c.id === s.currentTarget.dataset.hdEditSlot);
        l && M(l);
      });
    }), i.querySelectorAll("[data-hd-delete-slot]").forEach((o) => {
      o.addEventListener("click", async (s) => {
        const a = d(), l = s.currentTarget.dataset.hdDeleteSlot ?? "";
        a && await z(a.id, l);
      });
    }), i.querySelectorAll("[data-hd-open-item]").forEach((o) => {
      o.addEventListener("click", async (s) => {
        var w, D, O;
        const a = d(), l = a == null ? void 0 : a.slots.find((W) => W.id === s.currentTarget.dataset.hdOpenItem), c = await U((l == null ? void 0 : l.itemUuid) ?? "");
        (w = c == null ? void 0 : c.sheet) != null && w.render ? c.sheet.render(!0) : (O = (D = ui.notifications) == null ? void 0 : D.warn) == null || O.call(D, "That item could not be found.");
      });
    }), i.querySelectorAll("[data-hd-remove-item]").forEach((o) => {
      o.addEventListener("click", async (s) => {
        const a = d(), l = s.currentTarget.dataset.hdRemoveItem ?? "";
        a && await T(a.id, l);
      });
    }), this.activateSlotDrops(i));
  }
  activateSlotDrops(e) {
    e.querySelectorAll("[data-hd-slot-id]").forEach((i) => {
      i.addEventListener("dragover", (n) => {
        var r;
        (r = game.user) != null && r.isGM && (n.preventDefault(), i.classList.add("is-drop-hover"));
      }), i.addEventListener("dragleave", () => i.classList.remove("is-drop-hover")), i.addEventListener("drop", async (n) => {
        var l, c, w;
        if (i.classList.remove("is-drop-hover"), !((l = game.user) != null && l.isGM)) return;
        n.preventDefault();
        const r = d(), o = i.dataset.hdSlotId ?? "", s = Q(n), a = s.uuid ?? s.documentUuid ?? s.itemUuid ?? "";
        if (!r || !a) {
          (w = (c = ui.notifications) == null ? void 0 : c.warn) == null || w.call(c, "Drop a Foundry Item onto an equipment slot.");
          return;
        }
        await J(r.id, o, a);
      }), i.addEventListener("contextmenu", async (n) => {
        var s;
        if (!((s = game.user) != null && s.isGM)) return;
        n.preventDefault();
        const r = d(), o = i.dataset.hdSlotId ?? "";
        r && await T(r.id, o);
      });
    });
  }
  browseShipImage() {
    var n, r;
    if (!p("choose ship images")) return;
    const e = H(this), i = e == null ? void 0 : e.querySelector("[data-hd-profile-form] input[name='image']");
    if (!i || typeof FilePicker > "u") {
      (r = (n = ui.notifications) == null ? void 0 : n.warn) == null || r.call(n, "Foundry FilePicker is not available.");
      return;
    }
    new FilePicker({
      type: "image",
      current: i.value,
      callback: (o) => {
        i.value = o;
      }
    }).browse();
  }
  async close(e = {}) {
    return g = null, super.close(e);
  }
}
async function V() {
  return g || (g = new te()), await g.render(!0), g;
}
function ie() {
  game.settings.register(u, P, {
    name: "HoloDock Ship Profiles",
    hint: "World-level ship profile and loadout data.",
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: k
  }), game.settings.register(u, q, {
    name: "HoloDock Slot Categories",
    hint: "Reusable equipment slot categories for HoloDock.",
    scope: "world",
    config: !1,
    type: Array,
    default: S,
    onChange: k
  });
}
function ne() {
  const t = {
    open: V,
    getProfiles: C,
    getProfile: x,
    createProfile: j,
    updateProfileMetadata: N,
    deleteProfile: R,
    upsertSlot: _,
    deleteSlot: z,
    equipItem: J,
    unequipItem: T,
    getCategories: L
  };
  game.holodock = t;
  const e = game.modules.get(u);
  e && (e.api = t);
}
function re() {
  const t = game.modules.get("holosuite-core"), e = t != null && t.active ? t.api : null;
  if (!(e != null && e.registerApp)) return !1;
  const i = {
    id: u,
    title: "HoloDock",
    icon: "fa-solid fa-shuttle-space",
    premium: !1,
    playerVisible: !0,
    description: "View and manage system-agnostic ship loadouts.",
    open: () => V()
  };
  return e.registerApp(i), !0;
}
Hooks.once("init", async () => {
  ie(), Handlebars.registerHelper("hdFallback", (t, e) => t || e), await loadTemplates([G]);
});
Hooks.once("ready", () => {
  ne(), re(), console.log(`${u} | Ready. API available at game.holodock.`);
});
