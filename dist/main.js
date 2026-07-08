var ot = Object.defineProperty;
var lt = (t, r, i) => r in t ? ot(t, r, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[r] = i;
var T = (t, r, i) => lt(t, typeof r != "symbol" ? r + "" : r, i);
function ct() {
  var t, r, i;
  return ((r = (t = globalThis.foundry) == null ? void 0 : t.applications) == null ? void 0 : r.api) ?? ((i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.api) ?? null;
}
function ut() {
  var t, r, i;
  return ((r = (t = globalThis.foundry) == null ? void 0 : t.appv1) == null ? void 0 : r.api) ?? ((i = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : i.api) ?? null;
}
function dt(t = {}, r = {}) {
  var e, n, s;
  const i = ((n = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : n.mergeObject) ?? ((s = foundry == null ? void 0 : foundry.utils) == null ? void 0 : s.mergeObject);
  return typeof i == "function" ? i(t, r, { inplace: !1 }) : { ...t, ...r };
}
function ft() {
  var t, r, i, e, n;
  return ((i = (r = (t = globalThis.foundry) == null ? void 0 : t.utils) == null ? void 0 : r.randomID) == null ? void 0 : i.call(r, 8)) ?? ((n = (e = foundry == null ? void 0 : foundry.utils) == null ? void 0 : e.randomID) == null ? void 0 : n.call(e, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function j(t = {}) {
  return {
    id: String(t.id ?? `legacy-application-${ft()}`),
    tag: t.tag ?? "section",
    classes: Array.isArray(t.classes) ? t.classes : [],
    window: {
      title: t.title ?? "",
      icon: t.icon,
      resizable: t.resizable === !0
    },
    position: {
      width: Number(t.width ?? 600),
      height: t.height === "auto" ? "auto" : Number(t.height ?? 600)
    }
  };
}
function pt(t) {
  return class extends t {
    constructor(e = {}) {
      const n = dt(new.target.defaultOptions ?? {}, e);
      super(j(n));
      T(this, "_v1Options");
      this._v1Options = n;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return j(this.defaultOptions ?? {});
    }
    activateListeners(e) {
    }
    async _renderHTML(e, n) {
      var c, u, d;
      const s = typeof this.getData == "function" ? await this.getData() : {}, o = ((c = this._v1Options) == null ? void 0 : c.template) ?? ((u = this.options) == null ? void 0 : u.template) ?? ((d = this.constructor.defaultOptions) == null ? void 0 : d.template);
      if (!o) return document.createDocumentFragment();
      const a = await globalThis.renderTemplate(o, s), l = document.createElement("template");
      return l.innerHTML = a.trim(), l.content;
    }
    _activateV1Form(e) {
      var s, o;
      if (typeof this._updateObject != "function") return;
      const n = (s = e.matches) != null && s.call(e, "form") ? e : (o = e.querySelector) == null ? void 0 : o.call(e, "form");
      n instanceof HTMLFormElement && n.addEventListener("submit", async (a) => {
        var l;
        a.preventDefault(), a.stopPropagation(), await this._updateObject(a, new FormData(n)), ((l = this._v1Options) == null ? void 0 : l.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(e, n, s) {
      var u, d, g, p;
      n.replaceChildren(e);
      const o = globalThis.jQuery ?? globalThis.$, a = ((u = n.closest) == null ? void 0 : u.call(n, ".window-app, .app, .application")) ?? n, l = o ? o(a) : a;
      try {
        Object.defineProperty(this, "element", {
          value: l,
          configurable: !0,
          writable: !0
        });
      } catch {
        try {
          this.element = l;
        } catch {
        }
      }
      const c = (d = this._v1Options) == null ? void 0 : d.classes;
      Array.isArray(c) && c.length && (n.classList.add(...c), (p = (g = n.closest) == null ? void 0 : g.call(n, ".window-app, .app, .application")) == null || p.classList.add(...c)), this._activateV1Form(n), typeof this.activateListeners == "function" && this.activateListeners(o ? o(n) : n);
    }
  };
}
function ht() {
  const t = ct(), r = ut(), i = globalThis.Application ?? (r == null ? void 0 : r.Application) ?? (t == null ? void 0 : t.ApplicationV1);
  if (i) return i;
  const e = t == null ? void 0 : t.ApplicationV2;
  return e ? pt(e) : null;
}
const S = "holodock", H = "profiles", N = "slotCategories", B = `modules/${S}/templates/holodock.hbs`, M = "modules/holodock/assets/SpaceshipDefault.webp", gt = "icons/svg/space-station.svg", O = ["Weapons", "Defense", "Utility", "Engines", "Cargo", "Special"];
function w(t) {
  var r, i;
  return (r = foundry == null ? void 0 : foundry.utils) != null && r.deepClone ? foundry.utils.deepClone(t) : (i = foundry == null ? void 0 : foundry.utils) != null && i.duplicate ? foundry.utils.duplicate(t) : JSON.parse(JSON.stringify(t ?? {}));
}
function L(t = "hd") {
  var i, e, n;
  const r = ((e = (i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.randomID) == null ? void 0 : e.call(i)) ?? ((n = crypto == null ? void 0 : crypto.randomUUID) == null ? void 0 : n.call(crypto)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${t}-${r}`;
}
function b(t) {
  var i;
  if ((i = foundry == null ? void 0 : foundry.utils) != null && i.escapeHTML) return foundry.utils.escapeHTML(String(t ?? ""));
  const r = document.createElement("div");
  return r.textContent = String(t ?? ""), r.innerHTML;
}
function h(t = "edit HoloDock") {
  var r, i, e;
  return (r = game.user) != null && r.isGM ? !0 : ((e = (i = ui.notifications) == null ? void 0 : i.warn) == null || e.call(i, `Only a GM can ${t}.`), !1);
}
const mt = ht();
let k = null, A = "";
function q(t = {}) {
  const r = Number(t.anchorX), i = Number(t.anchorY);
  return {
    id: String(t.id || L("slot")),
    label: String(t.label || "Equipment Slot").trim() || "Equipment Slot",
    category: String(t.category || O[0]).trim() || O[0],
    description: String(t.description || "").trim(),
    anchorX: Number.isFinite(r) ? Math.min(100, Math.max(0, r)) : void 0,
    anchorY: Number.isFinite(i) ? Math.min(100, Math.max(0, i)) : void 0,
    itemUuid: String(t.itemUuid || "").trim() || void 0
  };
}
function I(t = {}) {
  return {
    id: String(t.id || L("stat")),
    label: String(t.label || "Statistic").trim() || "Statistic",
    value: String(t.value || "").trim(),
    note: String(t.note || "").trim()
  };
}
function E(t = {}) {
  const r = String(t.image || M).trim() || M;
  return {
    id: String(t.id || L("ship")),
    name: String(t.name || "Party Ship").trim() || "Party Ship",
    shipClass: String(t.shipClass || "").trim(),
    image: r === gt ? M : r,
    stats: Array.isArray(t.stats) ? t.stats.map(I) : [],
    slots: Array.isArray(t.slots) ? t.slots.map(q) : []
  };
}
function m() {
  const t = game.settings.get(S, H);
  if (!t || typeof t != "object" || Array.isArray(t)) return {};
  const r = {};
  for (const i of Object.values(t)) {
    const e = E(i);
    r[e.id] = e;
  }
  return r;
}
function _() {
  return Object.values(m()).sort((t, r) => t.name.localeCompare(r.name));
}
async function v(t) {
  h("save ship loadouts") && (await game.settings.set(S, H, t), F());
}
function x() {
  const t = game.settings.get(S, N), r = Array.isArray(t) ? t.map((i) => String(i).trim()).filter(Boolean) : [];
  return r.length ? [...new Set(r)] : O;
}
async function yt(t) {
  var e;
  const r = String(t || "").trim();
  if (!r || !((e = game.user) != null && e.isGM)) return;
  const i = x();
  i.some((n) => n.toLowerCase() === r.toLowerCase()) || await game.settings.set(S, N, [...i, r]);
}
function f() {
  const t = _();
  return t.length ? ((!A || !t.some((r) => r.id === A)) && (A = t[0].id), t.find((r) => r.id === A) ?? null) : null;
}
function W(t = A) {
  const r = m()[t];
  return r ? E(r) : null;
}
async function J() {
  if (!h("create ship profiles")) return null;
  const t = E({
    id: L("ship"),
    name: "New Ship",
    shipClass: "",
    image: M,
    stats: [
      I({ id: L("stat"), label: "Speed", value: "6", note: "" }),
      I({ id: L("stat"), label: "Fuel", value: "100%", note: "" }),
      I({ id: L("stat"), label: "Defense", value: "10", note: "" })
    ],
    slots: O.slice(0, 4).map((i) => q({
      id: L("slot"),
      label: i,
      category: i
    }))
  }), r = w(m());
  return r[t.id] = t, A = t.id, await v(r), t;
}
async function Q(t, r) {
  if (!h("update ship profiles")) return null;
  const i = w(m()), e = i[t];
  if (!e) return null;
  const n = E({
    ...e,
    name: r.name,
    shipClass: r.shipClass,
    image: r.image,
    stats: e.stats,
    slots: e.slots
  });
  return i[t] = n, await v(i), n;
}
async function K(t = A) {
  if (!h("delete ship profiles")) return !1;
  const r = W(t);
  if (!r || !await Dialog.confirm({
    title: "Delete Ship Profile",
    content: `<p>Delete <strong>${b(r.name)}</strong>?</p>`,
    defaultYes: !1
  })) return !1;
  const e = w(m());
  return delete e[t], A = Object.keys(e)[0] ?? "", await v(e), !0;
}
async function Z(t, r) {
  if (!h("edit ship statistics")) return null;
  const i = w(m()), e = i[t];
  if (!e) return null;
  const n = I(r), s = e.stats.findIndex((o) => o.id === n.id);
  return s >= 0 ? e.stats[s] = { ...e.stats[s], ...n } : e.stats.push(n), i[t] = E(e), await v(i), n;
}
async function tt(t, r) {
  if (!h("delete ship statistics")) return !1;
  const i = w(m()), e = i[t];
  return e ? (e.stats = e.stats.filter((n) => n.id !== r), i[t] = E(e), await v(i), !0) : !1;
}
async function et(t, r) {
  if (!h("edit equipment slots")) return null;
  const i = w(m()), e = i[t];
  if (!e) return null;
  const n = q(r), s = e.slots.findIndex((o) => o.id === n.id);
  return s >= 0 ? e.slots[s] = { ...e.slots[s], ...n } : e.slots.push(n), i[t] = E(e), await yt(n.category), await v(i), n;
}
async function it(t, r) {
  if (!h("delete equipment slots")) return !1;
  const i = w(m()), e = i[t];
  return e ? (e.slots = e.slots.filter((n) => n.id !== r), i[t] = E(e), await v(i), !0) : !1;
}
async function $(t, r, i, e) {
  var o;
  if (!h("place equipment links")) return !1;
  const n = w(m()), s = (o = n[t]) == null ? void 0 : o.slots.find((a) => a.id === r);
  return s ? (s.anchorX = Math.min(100, Math.max(0, Number(i))), s.anchorY = Math.min(100, Math.max(0, Number(e))), await v(n), !0) : !1;
}
async function nt(t, r) {
  var n;
  if (!h("clear equipment links")) return !1;
  const i = w(m()), e = (n = i[t]) == null ? void 0 : n.slots.find((s) => s.id === r);
  return e ? (delete e.anchorX, delete e.anchorY, await v(i), !0) : !1;
}
async function rt(t, r, i) {
  var o, a, l;
  if (!h("equip items")) return !1;
  const e = await U(i);
  if (!e)
    return (a = (o = ui.notifications) == null ? void 0 : o.warn) == null || a.call(o, "Drop a regular Foundry Item onto the slot."), !1;
  const n = w(m()), s = (l = n[t]) == null ? void 0 : l.slots.find((c) => c.id === r);
  return s ? (s.itemUuid = e.uuid, await v(n), !0) : !1;
}
async function P(t, r) {
  var n;
  if (!h("remove equipped items")) return !1;
  const i = w(m()), e = (n = i[t]) == null ? void 0 : n.slots.find((s) => s.id === r);
  return e ? (delete e.itemUuid, await v(i), !0) : !1;
}
async function U(t) {
  var e;
  const r = String(t || "").trim(), i = globalThis.fromUuid;
  if (!r || typeof i != "function") return null;
  try {
    const n = await i(r);
    return (n == null ? void 0 : n.documentName) === "Item" || ((e = n == null ? void 0 : n.constructor) == null ? void 0 : e.name) === "Item" ? n : null;
  } catch (n) {
    return console.warn(`${S} | Failed to resolve item UUID "${r}".`, n), null;
  }
}
function St(t) {
  var r, i, e;
  try {
    const n = globalThis.TextEditor ?? ((i = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.ux) == null ? void 0 : i.TextEditor);
    if (n != null && n.getDragEventData) return n.getDragEventData(t);
  } catch {
  }
  try {
    return JSON.parse(((e = t.dataTransfer) == null ? void 0 : e.getData("text/plain")) || "{}");
  } catch {
    return {};
  }
}
function wt(t) {
  var i, e, n;
  const r = ((e = (i = t == null ? void 0 : t.system) == null ? void 0 : i.description) == null ? void 0 : e.value) ?? ((n = t == null ? void 0 : t.system) == null ? void 0 : n.description) ?? (t == null ? void 0 : t.description) ?? "";
  return typeof r == "string" ? r.trim() : r != null && r.value ? String(r.value).trim() : "";
}
async function vt(t) {
  const r = Number.isFinite(t.anchorX) && Number.isFinite(t.anchorY), i = {
    ...t,
    hasAnchor: r
  };
  if (!t.itemUuid) return { ...i, item: null };
  const e = await U(t.itemUuid);
  return e ? {
    ...i,
    item: {
      name: e.name ?? "Unnamed Item",
      img: e.img || "icons/svg/item-bag.svg",
      status: e.type ? `Item Type: ${e.type}` : "Foundry Item",
      description: wt(e),
      uuid: e.uuid
    }
  } : {
    ...i,
    item: {
      name: "Missing Item",
      img: "icons/svg/hazard.svg",
      status: "Stored UUID no longer resolves",
      missing: !0
    }
  };
}
async function bt() {
  var e;
  const t = f(), r = t ? {
    ...t,
    slots: await Promise.all(t.slots.map(vt))
  } : null, i = _().map((n) => ({
    ...n,
    isSelected: n.id === A
  }));
  return {
    canEdit: ((e = game.user) == null ? void 0 : e.isGM) === !0,
    hasProfiles: i.length > 0,
    profiles: i,
    selectedProfile: r,
    categories: x()
  };
}
function V(t, r = null) {
  var i;
  return r != null && r[0] ? r[0] : r instanceof HTMLElement ? r : (i = t.element) != null && i[0] ? t.element[0] : t.element ?? null;
}
function F() {
  k != null && k.rendered && k.render(!0);
}
function st(t) {
  var e, n;
  const r = (t == null ? void 0 : t[0]) ?? t, i = ((e = r == null ? void 0 : r.querySelector) == null ? void 0 : e.call(r, "form")) ?? ((n = r == null ? void 0 : r.closest) == null ? void 0 : n.call(r, "form"));
  return Object.fromEntries(new FormData(i).entries());
}
function Y(t = {}) {
  if (!h("edit equipment slots")) return;
  const r = f();
  if (!r) return;
  const i = q({ label: "New Slot", category: O[0], ...t }), e = x().map((n) => `<option value="${b(n)}">`).join("");
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
          <datalist id="hd-slot-categories">${e}</datalist>
        </label>
        <label>
          <span>Description</span>
          <textarea name="description" rows="4">${b(i.description)}</textarea>
        </label>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (n) => et(r.id, st(n))
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
function X(t = {}) {
  if (!h("edit ship statistics")) return;
  const r = f();
  if (!r) return;
  const i = I({ label: "New Statistic", ...t });
  new Dialog({
    title: t.id ? "Edit Ship Statistic" : "Add Ship Statistic",
    content: `
      <form class="hd-dialog-form">
        <input type="hidden" name="id" value="${b(i.id)}">
        <label>
          <span>Label</span>
          <input type="text" name="label" value="${b(i.label)}">
        </label>
        <label>
          <span>Value</span>
          <input type="text" name="value" value="${b(i.value)}">
        </label>
        <label>
          <span>Note</span>
          <textarea name="note" rows="3">${b(i.note)}</textarea>
        </label>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (e) => Z(r.id, st(e))
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
class At extends mt {
  constructor() {
    super(...arguments);
    T(this, "linkingSlotId", "");
    T(this, "linkResizeObserver");
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holodock",
      title: "HoloDock - Ship Loadout",
      classes: ["holodock-window"],
      template: B,
      popOut: !0,
      resizable: !0,
      width: 920,
      height: 760
    });
  }
  async getData() {
    return bt();
  }
  activateListeners(i) {
    var n, s;
    super.activateListeners(i);
    const e = V(this, i);
    e && ((n = e.querySelector("[data-hd-profile-select]")) == null || n.addEventListener("change", (o) => {
      A = o.currentTarget.value, this.render(!0);
    }), (s = e.querySelector("[data-hd-profile-form]")) == null || s.addEventListener("submit", async (o) => {
      o.preventDefault();
      const a = f();
      if (!a) return;
      const l = Object.fromEntries(new FormData(o.currentTarget).entries());
      await Q(a.id, l);
    }), e.querySelectorAll("[data-hd-action]").forEach((o) => {
      o.addEventListener("click", async (a) => {
        const l = a.currentTarget.dataset.hdAction, c = f();
        l === "create-profile" && await J(), l === "delete-profile" && await K(c == null ? void 0 : c.id), l === "create-slot" && Y(), l === "create-stat" && X(), l === "browse-image" && this.browseShipImage();
      });
    }), e.querySelectorAll("[data-hd-edit-stat]").forEach((o) => {
      o.addEventListener("click", (a) => {
        const l = f(), c = l == null ? void 0 : l.stats.find((u) => u.id === a.currentTarget.dataset.hdEditStat);
        c && X(c);
      });
    }), e.querySelectorAll("[data-hd-delete-stat]").forEach((o) => {
      o.addEventListener("click", async (a) => {
        const l = f(), c = a.currentTarget.dataset.hdDeleteStat ?? "";
        l && await tt(l.id, c);
      });
    }), e.querySelectorAll("[data-hd-edit-slot]").forEach((o) => {
      o.addEventListener("click", (a) => {
        const l = f(), c = l == null ? void 0 : l.slots.find((u) => u.id === a.currentTarget.dataset.hdEditSlot);
        c && Y(c);
      });
    }), e.querySelectorAll("[data-hd-delete-slot]").forEach((o) => {
      o.addEventListener("click", async (a) => {
        const l = f(), c = a.currentTarget.dataset.hdDeleteSlot ?? "";
        l && await it(l.id, c);
      });
    }), e.querySelectorAll("[data-hd-open-item]").forEach((o) => {
      o.addEventListener("click", async (a) => {
        var d, g, p;
        const l = f(), c = l == null ? void 0 : l.slots.find((y) => y.id === a.currentTarget.dataset.hdOpenItem), u = await U((c == null ? void 0 : c.itemUuid) ?? "");
        (d = u == null ? void 0 : u.sheet) != null && d.render ? u.sheet.render(!0) : (p = (g = ui.notifications) == null ? void 0 : g.warn) == null || p.call(g, "That item could not be found.");
      });
    }), e.querySelectorAll("[data-hd-remove-item]").forEach((o) => {
      o.addEventListener("click", async (a) => {
        const l = f(), c = a.currentTarget.dataset.hdRemoveItem ?? "";
        l && await P(l.id, c);
      });
    }), this.activateSlotDrops(e), this.activateSlotAnchors(e), window.requestAnimationFrame(() => this.syncShipLinks(e)), window.setTimeout(() => this.syncShipLinks(e), 100));
  }
  activateSlotDrops(i) {
    i.querySelectorAll("[data-hd-slot-id]").forEach((e) => {
      e.addEventListener("dragover", (n) => {
        var s;
        (s = game.user) != null && s.isGM && (n.preventDefault(), e.classList.add("is-drop-hover"));
      }), e.addEventListener("dragleave", () => e.classList.remove("is-drop-hover")), e.addEventListener("drop", async (n) => {
        var c, u, d;
        if (e.classList.remove("is-drop-hover"), !((c = game.user) != null && c.isGM)) return;
        n.preventDefault();
        const s = f(), o = e.dataset.hdSlotId ?? "", a = St(n), l = a.uuid ?? a.documentUuid ?? a.itemUuid ?? "";
        if (!s || !l) {
          (d = (u = ui.notifications) == null ? void 0 : u.warn) == null || d.call(u, "Drop a Foundry Item onto an equipment slot.");
          return;
        }
        await rt(s.id, o, l);
      }), e.addEventListener("contextmenu", async (n) => {
        var a;
        if (!((a = game.user) != null && a.isGM)) return;
        n.preventDefault();
        const s = f(), o = e.dataset.hdSlotId ?? "";
        s && await P(s.id, o);
      });
    });
  }
  activateSlotAnchors(i) {
    var n, s, o;
    const e = i.querySelector("[data-hd-ship-map]");
    e && ((n = this.linkResizeObserver) == null || n.disconnect(), this.linkResizeObserver = void 0, typeof ResizeObserver < "u" && (this.linkResizeObserver = new ResizeObserver(() => this.syncShipLinks(i)), this.linkResizeObserver.observe(i.querySelector(".hd-stage") ?? i)), (s = i.querySelector(".hd-slot-rail")) == null || s.addEventListener("scroll", () => this.syncShipLinks(i)), (o = e.querySelector("img")) == null || o.addEventListener("load", () => this.syncShipLinks(i)), i.querySelectorAll("[data-hd-link-slot]").forEach((a) => {
      a.addEventListener("click", () => {
        var l;
        (l = game.user) != null && l.isGM && (this.linkingSlotId = a.dataset.hdLinkSlot ?? "", i.classList.toggle("is-linking-slot", !!this.linkingSlotId));
      });
    }), i.querySelectorAll("[data-hd-clear-link]").forEach((a) => {
      a.addEventListener("click", async () => {
        const l = f(), c = a.dataset.hdClearLink ?? "";
        l && await nt(l.id, c);
      });
    }), e.addEventListener("click", async (a) => {
      var d;
      if (!((d = game.user) != null && d.isGM) || !this.linkingSlotId) return;
      a.preventDefault();
      const l = f(), c = this.getImageAnchorPoint(e, a.clientX, a.clientY), u = this.linkingSlotId;
      this.linkingSlotId = "", i.classList.remove("is-linking-slot"), l && await $(l.id, u, c.x, c.y);
    }), i.querySelectorAll("[data-hd-anchor-slot]").forEach((a) => {
      a.addEventListener("pointerdown", (l) => {
        var g;
        if (!((g = game.user) != null && g.isGM)) return;
        l.preventDefault();
        const c = a.dataset.hdAnchorSlot ?? "", u = (p) => {
          const y = this.getImageAnchorPoint(e, p.clientX, p.clientY);
          a.dataset.hdAnchorX = String(y.x), a.dataset.hdAnchorY = String(y.y), this.syncShipLinks(i);
        }, d = async (p) => {
          window.removeEventListener("pointermove", u), window.removeEventListener("pointerup", d);
          const y = f(), D = this.getImageAnchorPoint(e, p.clientX, p.clientY);
          y && await $(y.id, c, D.x, D.y);
        };
        window.addEventListener("pointermove", u), window.addEventListener("pointerup", d);
      });
    }));
  }
  getImageAnchorPoint(i, e, n) {
    const s = this.getShipImageRect(i), o = Math.min(100, Math.max(0, (e - s.left) / s.width * 100)), a = Math.min(100, Math.max(0, (n - s.top) / s.height * 100));
    return { x: o, y: a };
  }
  getShipImageRect(i) {
    const e = i.querySelector("img"), n = e == null ? void 0 : e.getBoundingClientRect();
    if (n != null && n.width && (n != null && n.height) && (e != null && e.naturalWidth) && (e != null && e.naturalHeight)) {
      const s = e.naturalWidth / e.naturalHeight, o = n.width / n.height;
      if (s > o) {
        const c = n.width / s, u = n.top + (n.height - c) / 2;
        return new DOMRect(n.left, u, n.width, c);
      }
      const a = n.height * s, l = n.left + (n.width - a) / 2;
      return new DOMRect(l, n.top, a, n.height);
    }
    return n != null && n.width && (n != null && n.height) ? n : i.getBoundingClientRect();
  }
  positionSlotPins(i) {
    const e = i.querySelector("[data-hd-ship-map]");
    if (!e) return;
    const n = this.getShipImageRect(e), s = e.getBoundingClientRect();
    i.querySelectorAll("[data-hd-anchor-slot]").forEach((o) => {
      const a = Number(o.dataset.hdAnchorX), l = Number(o.dataset.hdAnchorY);
      if (!Number.isFinite(a) || !Number.isFinite(l)) return;
      const c = n.left - s.left + n.width * a / 100, u = n.top - s.top + n.height * l / 100;
      o.style.left = `${c}px`, o.style.top = `${u}px`;
    });
  }
  syncShipLinks(i) {
    this.positionSlotPins(i), this.drawSlotLinks(i);
  }
  drawSlotLinks(i) {
    const e = i.querySelector("[data-hd-link-lines]"), n = i.querySelector("[data-hd-ship-map]");
    if (!e || !n) return;
    const s = e.getBoundingClientRect(), o = Math.max(1, Math.round(s.width)), a = Math.max(1, Math.round(s.height));
    e.setAttribute("viewBox", `0 0 ${o} ${a}`), e.setAttribute("width", String(o)), e.setAttribute("height", String(a)), e.innerHTML = "", i.querySelectorAll("[data-hd-anchor-slot]").forEach((l) => {
      const c = l.dataset.hdAnchorSlot ?? "", u = i.querySelector(`[data-hd-slot-card="${c}"]`);
      if (!u) return;
      const d = l.getBoundingClientRect(), g = u.getBoundingClientRect(), p = d.left + d.width / 2 - s.left, y = d.top + d.height / 2 - s.top, D = g.left - s.left, z = g.top + g.height / 2 - s.top, G = Math.max(40, Math.abs(D - p) / 2), R = document.createElementNS("http://www.w3.org/2000/svg", "path");
      R.setAttribute("d", `M ${p} ${y} C ${p + G} ${y}, ${D - G} ${z}, ${D} ${z}`), R.setAttribute("class", "hd-link-line"), e.append(R);
    });
  }
  browseShipImage() {
    var n, s;
    if (!h("choose ship images")) return;
    const i = V(this), e = i == null ? void 0 : i.querySelector("[data-hd-profile-form] input[name='image']");
    if (!e || typeof FilePicker > "u") {
      (s = (n = ui.notifications) == null ? void 0 : n.warn) == null || s.call(n, "Foundry FilePicker is not available.");
      return;
    }
    new FilePicker({
      type: "image",
      current: e.value,
      callback: (o) => {
        e.value = o;
      }
    }).browse();
  }
  async close(i = {}) {
    var e;
    return (e = this.linkResizeObserver) == null || e.disconnect(), this.linkResizeObserver = void 0, k = null, super.close(i);
  }
}
async function at() {
  return k || (k = new At()), await k.render(!0), k;
}
function kt() {
  game.settings.register(S, H, {
    name: "HoloDock Ship Profiles",
    hint: "World-level ship profile and loadout data.",
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: F
  }), game.settings.register(S, N, {
    name: "HoloDock Slot Categories",
    hint: "Reusable equipment slot categories for HoloDock.",
    scope: "world",
    config: !1,
    type: Array,
    default: O,
    onChange: F
  });
}
function Lt() {
  const t = {
    open: at,
    getProfiles: _,
    getProfile: W,
    createProfile: J,
    updateProfileMetadata: Q,
    deleteProfile: K,
    upsertSlot: et,
    deleteSlot: it,
    upsertStat: Z,
    deleteStat: tt,
    setSlotAnchor: $,
    clearSlotAnchor: nt,
    equipItem: rt,
    unequipItem: P,
    getCategories: x
  };
  game.holodock = t;
  const r = game.modules.get(S);
  r && (r.api = t);
}
function Et() {
  const t = game.modules.get("holosuite-core");
  return (t != null && t.active ? t.api : null) ?? game.holosuite ?? globalThis.HoloSuiteCoreApi ?? null;
}
function C() {
  const t = Et();
  if (!(t != null && t.registerApp)) return !1;
  const r = {
    id: S,
    title: "HoloDock",
    icon: "fa-solid fa-shuttle-space",
    premium: !1,
    playerVisible: !0,
    description: "View and manage system-agnostic ship loadouts.",
    open: () => at()
  };
  return t.registerApp(r), !0;
}
function Dt() {
  if (C()) return;
  let t = 0;
  const r = () => {
    t += 1, !(C() || t >= 20) && window.setTimeout(r, 250);
  };
  Hooks.once("holosuite-core.apiReady", () => C()), window.setTimeout(r, 250);
}
Hooks.once("init", async () => {
  kt(), Handlebars.registerHelper("hdFallback", (t, r) => t || r), await loadTemplates([B]);
});
Hooks.once("ready", () => {
  Lt(), Dt(), console.log(`${S} | Ready. API available at game.holodock.`);
});
