var ot = Object.defineProperty;
var lt = (t, s, i) => s in t ? ot(t, s, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[s] = i;
var T = (t, s, i) => lt(t, typeof s != "symbol" ? s + "" : s, i);
function ct() {
  var t, s, i;
  return ((s = (t = globalThis.foundry) == null ? void 0 : t.applications) == null ? void 0 : s.api) ?? ((i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.api) ?? null;
}
function ut() {
  var t, s, i;
  return ((s = (t = globalThis.foundry) == null ? void 0 : t.appv1) == null ? void 0 : s.api) ?? ((i = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : i.api) ?? null;
}
function dt(t = {}, s = {}) {
  var e, n, a;
  const i = ((n = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : n.mergeObject) ?? ((a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.mergeObject);
  return typeof i == "function" ? i(t, s, { inplace: !1 }) : { ...t, ...s };
}
function ft() {
  var t, s, i, e, n;
  return ((i = (s = (t = globalThis.foundry) == null ? void 0 : t.utils) == null ? void 0 : s.randomID) == null ? void 0 : i.call(s, 8)) ?? ((n = (e = foundry == null ? void 0 : foundry.utils) == null ? void 0 : e.randomID) == null ? void 0 : n.call(e, 8)) ?? Math.random().toString(36).slice(2, 10);
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
      const a = typeof this.getData == "function" ? await this.getData() : {}, r = ((c = this._v1Options) == null ? void 0 : c.template) ?? ((u = this.options) == null ? void 0 : u.template) ?? ((d = this.constructor.defaultOptions) == null ? void 0 : d.template);
      if (!r) return document.createDocumentFragment();
      const o = await globalThis.renderTemplate(r, a), l = document.createElement("template");
      return l.innerHTML = o.trim(), l.content;
    }
    _activateV1Form(e) {
      var a, r;
      if (typeof this._updateObject != "function") return;
      const n = (a = e.matches) != null && a.call(e, "form") ? e : (r = e.querySelector) == null ? void 0 : r.call(e, "form");
      n instanceof HTMLFormElement && n.addEventListener("submit", async (o) => {
        var l;
        o.preventDefault(), o.stopPropagation(), await this._updateObject(o, new FormData(n)), ((l = this._v1Options) == null ? void 0 : l.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(e, n, a) {
      var u, d, g, p;
      n.replaceChildren(e);
      const r = globalThis.jQuery ?? globalThis.$, o = ((u = n.closest) == null ? void 0 : u.call(n, ".window-app, .app, .application")) ?? n, l = r ? r(o) : o;
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
      Array.isArray(c) && c.length && (n.classList.add(...c), (p = (g = n.closest) == null ? void 0 : g.call(n, ".window-app, .app, .application")) == null || p.classList.add(...c)), this._activateV1Form(n), typeof this.activateListeners == "function" && this.activateListeners(r ? r(n) : n);
    }
  };
}
function ht() {
  const t = ct(), s = ut(), i = globalThis.Application ?? (s == null ? void 0 : s.Application) ?? (t == null ? void 0 : t.ApplicationV1);
  if (i) return i;
  const e = t == null ? void 0 : t.ApplicationV2;
  return e ? pt(e) : null;
}
const w = "holodock", H = "profiles", N = "slotCategories", B = `modules/${w}/templates/holodock.hbs`, M = "modules/holodock/assets/SpaceshipDefault.webp", gt = "icons/svg/space-station.svg", O = ["Weapons", "Defense", "Utility", "Engines", "Cargo", "Special"];
function v(t) {
  var s, i;
  return (s = foundry == null ? void 0 : foundry.utils) != null && s.deepClone ? foundry.utils.deepClone(t) : (i = foundry == null ? void 0 : foundry.utils) != null && i.duplicate ? foundry.utils.duplicate(t) : JSON.parse(JSON.stringify(t ?? {}));
}
function L(t = "hd") {
  var i, e, n;
  const s = ((e = (i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.randomID) == null ? void 0 : e.call(i)) ?? ((n = crypto == null ? void 0 : crypto.randomUUID) == null ? void 0 : n.call(crypto)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${t}-${s}`;
}
function y(t) {
  var i;
  if ((i = foundry == null ? void 0 : foundry.utils) != null && i.escapeHTML) return foundry.utils.escapeHTML(String(t ?? ""));
  const s = document.createElement("div");
  return s.textContent = String(t ?? ""), s.innerHTML;
}
function h(t = "edit HoloDock") {
  var s, i, e;
  return (s = game.user) != null && s.isGM ? !0 : ((e = (i = ui.notifications) == null ? void 0 : i.warn) == null || e.call(i, `Only a GM can ${t}.`), !1);
}
const mt = ht();
let k = null, A = "";
function q(t = {}) {
  const s = Number(t.anchorX), i = Number(t.anchorY);
  return {
    id: String(t.id || L("slot")),
    label: String(t.label || "Equipment Slot").trim() || "Equipment Slot",
    category: String(t.category || O[0]).trim() || O[0],
    description: String(t.description || "").trim(),
    anchorX: Number.isFinite(s) ? Math.min(100, Math.max(0, s)) : void 0,
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
function D(t = {}) {
  const s = String(t.image || M).trim() || M;
  return {
    id: String(t.id || L("ship")),
    name: String(t.name || "Party Ship").trim() || "Party Ship",
    shipClass: String(t.shipClass || "").trim(),
    image: s === gt ? M : s,
    stats: Array.isArray(t.stats) ? t.stats.map(I) : [],
    slots: Array.isArray(t.slots) ? t.slots.map(q) : []
  };
}
function m() {
  const t = game.settings.get(w, H);
  if (!t || typeof t != "object" || Array.isArray(t)) return {};
  const s = {};
  for (const i of Object.values(t)) {
    const e = D(i);
    s[e.id] = e;
  }
  return s;
}
function _() {
  return Object.values(m()).sort((t, s) => t.name.localeCompare(s.name));
}
async function b(t) {
  h("save ship loadouts") && (await game.settings.set(w, H, t), F());
}
function x() {
  const t = game.settings.get(w, N), s = Array.isArray(t) ? t.map((i) => String(i).trim()).filter(Boolean) : [];
  return s.length ? [...new Set(s)] : O;
}
async function yt(t) {
  var e;
  const s = String(t || "").trim();
  if (!s || !((e = game.user) != null && e.isGM)) return;
  const i = x();
  i.some((n) => n.toLowerCase() === s.toLowerCase()) || await game.settings.set(w, N, [...i, s]);
}
function f() {
  const t = _();
  return t.length ? ((!A || !t.some((s) => s.id === A)) && (A = t[0].id), t.find((s) => s.id === A) ?? null) : null;
}
function W(t = A) {
  const s = m()[t];
  return s ? D(s) : null;
}
async function J() {
  if (!h("create ship profiles")) return null;
  const t = D({
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
  }), s = v(m());
  return s[t.id] = t, A = t.id, await b(s), t;
}
async function Q(t, s) {
  if (!h("update ship profiles")) return null;
  const i = v(m()), e = i[t];
  if (!e) return null;
  const n = D({
    ...e,
    name: s.name,
    shipClass: s.shipClass,
    image: s.image,
    stats: e.stats,
    slots: e.slots
  });
  return i[t] = n, await b(i), n;
}
async function K(t = A) {
  if (!h("delete ship profiles")) return !1;
  const s = W(t);
  if (!s || !await Dialog.confirm({
    title: "Delete Ship Profile",
    content: `<p>Delete <strong>${y(s.name)}</strong>?</p>`,
    defaultYes: !1
  })) return !1;
  const e = v(m());
  return delete e[t], A = Object.keys(e)[0] ?? "", await b(e), !0;
}
async function Z(t, s) {
  if (!h("edit ship statistics")) return null;
  const i = v(m()), e = i[t];
  if (!e) return null;
  const n = I(s), a = e.stats.findIndex((r) => r.id === n.id);
  return a >= 0 ? e.stats[a] = { ...e.stats[a], ...n } : e.stats.push(n), i[t] = D(e), await b(i), n;
}
async function tt(t, s) {
  if (!h("delete ship statistics")) return !1;
  const i = v(m()), e = i[t];
  if (!e) return !1;
  const n = e.stats.find((r) => r.id === s);
  return !n || !await Dialog.confirm({
    title: "Delete Ship Statistic",
    content: `<p>Delete <strong>${y(n.label)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (e.stats = e.stats.filter((r) => r.id !== s), i[t] = D(e), await b(i), !0);
}
async function et(t, s) {
  if (!h("edit equipment slots")) return null;
  const i = v(m()), e = i[t];
  if (!e) return null;
  const n = q(s), a = e.slots.findIndex((r) => r.id === n.id);
  return a >= 0 ? e.slots[a] = { ...e.slots[a], ...n } : e.slots.push(n), i[t] = D(e), await yt(n.category), await b(i), n;
}
async function it(t, s) {
  if (!h("delete equipment slots")) return !1;
  const i = v(m()), e = i[t];
  if (!e) return !1;
  const n = e.slots.find((r) => r.id === s);
  return !n || !await Dialog.confirm({
    title: "Delete Equipment Slot",
    content: `<p>Delete <strong>${y(n.label)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (e.slots = e.slots.filter((r) => r.id !== s), i[t] = D(e), await b(i), !0);
}
async function C(t, s, i, e) {
  var r;
  if (!h("place equipment links")) return !1;
  const n = v(m()), a = (r = n[t]) == null ? void 0 : r.slots.find((o) => o.id === s);
  return a ? (a.anchorX = Math.min(100, Math.max(0, Number(i))), a.anchorY = Math.min(100, Math.max(0, Number(e))), await b(n), !0) : !1;
}
async function nt(t, s) {
  var n;
  if (!h("clear equipment links")) return !1;
  const i = v(m()), e = (n = i[t]) == null ? void 0 : n.slots.find((a) => a.id === s);
  return e ? (delete e.anchorX, delete e.anchorY, await b(i), !0) : !1;
}
async function st(t, s, i) {
  var r, o, l;
  if (!h("equip items")) return !1;
  const e = await U(i);
  if (!e)
    return (o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, "Drop a regular Foundry Item onto the slot."), !1;
  const n = v(m()), a = (l = n[t]) == null ? void 0 : l.slots.find((c) => c.id === s);
  return a ? (a.itemUuid = e.uuid, await b(n), !0) : !1;
}
async function P(t, s) {
  var n;
  if (!h("remove equipped items")) return !1;
  const i = v(m()), e = (n = i[t]) == null ? void 0 : n.slots.find((a) => a.id === s);
  return e ? (delete e.itemUuid, await b(i), !0) : !1;
}
async function U(t) {
  var e;
  const s = String(t || "").trim(), i = globalThis.fromUuid;
  if (!s || typeof i != "function") return null;
  try {
    const n = await i(s);
    return (n == null ? void 0 : n.documentName) === "Item" || ((e = n == null ? void 0 : n.constructor) == null ? void 0 : e.name) === "Item" ? n : null;
  } catch (n) {
    return console.warn(`${w} | Failed to resolve item UUID "${s}".`, n), null;
  }
}
function St(t) {
  var s, i, e;
  try {
    const n = globalThis.TextEditor ?? ((i = (s = foundry == null ? void 0 : foundry.applications) == null ? void 0 : s.ux) == null ? void 0 : i.TextEditor);
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
  const s = ((e = (i = t == null ? void 0 : t.system) == null ? void 0 : i.description) == null ? void 0 : e.value) ?? ((n = t == null ? void 0 : t.system) == null ? void 0 : n.description) ?? (t == null ? void 0 : t.description) ?? "";
  return typeof s == "string" ? s.trim() : s != null && s.value ? String(s.value).trim() : "";
}
async function vt(t) {
  const s = Number.isFinite(t.anchorX) && Number.isFinite(t.anchorY), i = {
    ...t,
    hasAnchor: s
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
  const t = f(), s = t ? {
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
    selectedProfile: s,
    categories: x()
  };
}
function Y(t, s = null) {
  var i;
  return s != null && s[0] ? s[0] : s instanceof HTMLElement ? s : (i = t.element) != null && i[0] ? t.element[0] : t.element ?? null;
}
function F() {
  k != null && k.rendered && k.render(!0);
}
function rt(t) {
  var e, n;
  const s = (t == null ? void 0 : t[0]) ?? t, i = ((e = s == null ? void 0 : s.querySelector) == null ? void 0 : e.call(s, "form")) ?? ((n = s == null ? void 0 : s.closest) == null ? void 0 : n.call(s, "form"));
  return Object.fromEntries(new FormData(i).entries());
}
function V(t = {}) {
  if (!h("edit equipment slots")) return;
  const s = f();
  if (!s) return;
  const i = q({ label: "New Slot", category: O[0], ...t }), e = x().map((n) => `<option value="${y(n)}">`).join("");
  new Dialog({
    title: t.id ? "Edit Equipment Slot" : "Add Equipment Slot",
    content: `
      <form class="hd-dialog-form">
        <input type="hidden" name="id" value="${y(i.id)}">
        <label>
          <span>Slot Label</span>
          <input type="text" name="label" value="${y(i.label)}">
        </label>
        <label>
          <span>Category</span>
          <input type="text" name="category" value="${y(i.category)}" list="hd-slot-categories">
          <datalist id="hd-slot-categories">${e}</datalist>
        </label>
        <label>
          <span>Description</span>
          <textarea name="description" rows="4">${y(i.description)}</textarea>
        </label>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (n) => et(s.id, rt(n))
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
  const s = f();
  if (!s) return;
  const i = I({ label: "New Statistic", ...t });
  new Dialog({
    title: t.id ? "Edit Ship Statistic" : "Add Ship Statistic",
    content: `
      <form class="hd-dialog-form">
        <input type="hidden" name="id" value="${y(i.id)}">
        <label>
          <span>Label</span>
          <input type="text" name="label" value="${y(i.label)}">
        </label>
        <label>
          <span>Value</span>
          <input type="text" name="value" value="${y(i.value)}">
        </label>
        <label>
          <span>Note</span>
          <textarea name="note" rows="3">${y(i.note)}</textarea>
        </label>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (e) => Z(s.id, rt(e))
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
    var n, a;
    super.activateListeners(i);
    const e = Y(this, i);
    e && ((n = e.querySelector("[data-hd-profile-select]")) == null || n.addEventListener("change", (r) => {
      A = r.currentTarget.value, this.render(!0);
    }), (a = e.querySelector("[data-hd-profile-form]")) == null || a.addEventListener("submit", async (r) => {
      r.preventDefault();
      const o = f();
      if (!o) return;
      const l = Object.fromEntries(new FormData(r.currentTarget).entries());
      await Q(o.id, l);
    }), e.querySelectorAll("[data-hd-action]").forEach((r) => {
      r.addEventListener("click", async (o) => {
        const l = o.currentTarget.dataset.hdAction, c = f();
        l === "create-profile" && await J(), l === "delete-profile" && await K(c == null ? void 0 : c.id), l === "create-slot" && V(), l === "create-stat" && X(), l === "browse-image" && this.browseShipImage();
      });
    }), e.querySelectorAll("[data-hd-edit-stat]").forEach((r) => {
      r.addEventListener("click", (o) => {
        const l = f(), c = l == null ? void 0 : l.stats.find((u) => u.id === o.currentTarget.dataset.hdEditStat);
        c && X(c);
      });
    }), e.querySelectorAll("[data-hd-delete-stat]").forEach((r) => {
      r.addEventListener("click", async (o) => {
        const l = f(), c = o.currentTarget.dataset.hdDeleteStat ?? "";
        l && await tt(l.id, c);
      });
    }), e.querySelectorAll("[data-hd-edit-slot]").forEach((r) => {
      r.addEventListener("click", (o) => {
        const l = f(), c = l == null ? void 0 : l.slots.find((u) => u.id === o.currentTarget.dataset.hdEditSlot);
        c && V(c);
      });
    }), e.querySelectorAll("[data-hd-delete-slot]").forEach((r) => {
      r.addEventListener("click", async (o) => {
        const l = f(), c = o.currentTarget.dataset.hdDeleteSlot ?? "";
        l && await it(l.id, c);
      });
    }), e.querySelectorAll("[data-hd-open-item]").forEach((r) => {
      r.addEventListener("click", async (o) => {
        var d, g, p;
        const l = f(), c = l == null ? void 0 : l.slots.find((S) => S.id === o.currentTarget.dataset.hdOpenItem), u = await U((c == null ? void 0 : c.itemUuid) ?? "");
        (d = u == null ? void 0 : u.sheet) != null && d.render ? u.sheet.render(!0) : (p = (g = ui.notifications) == null ? void 0 : g.warn) == null || p.call(g, "That item could not be found.");
      });
    }), e.querySelectorAll("[data-hd-remove-item]").forEach((r) => {
      r.addEventListener("click", async (o) => {
        const l = f(), c = o.currentTarget.dataset.hdRemoveItem ?? "";
        l && await P(l.id, c);
      });
    }), this.activateSlotDrops(e), this.activateSlotAnchors(e), window.requestAnimationFrame(() => this.syncShipLinks(e)), window.setTimeout(() => this.syncShipLinks(e), 100));
  }
  activateSlotDrops(i) {
    i.querySelectorAll("[data-hd-slot-id]").forEach((e) => {
      e.addEventListener("dragover", (n) => {
        var a;
        (a = game.user) != null && a.isGM && (n.preventDefault(), e.classList.add("is-drop-hover"));
      }), e.addEventListener("dragleave", () => e.classList.remove("is-drop-hover")), e.addEventListener("drop", async (n) => {
        var c, u, d;
        if (e.classList.remove("is-drop-hover"), !((c = game.user) != null && c.isGM)) return;
        n.preventDefault();
        const a = f(), r = e.dataset.hdSlotId ?? "", o = St(n), l = o.uuid ?? o.documentUuid ?? o.itemUuid ?? "";
        if (!a || !l) {
          (d = (u = ui.notifications) == null ? void 0 : u.warn) == null || d.call(u, "Drop a Foundry Item onto an equipment slot.");
          return;
        }
        await st(a.id, r, l);
      }), e.addEventListener("contextmenu", async (n) => {
        var o;
        if (!((o = game.user) != null && o.isGM)) return;
        n.preventDefault();
        const a = f(), r = e.dataset.hdSlotId ?? "";
        a && await P(a.id, r);
      });
    });
  }
  activateSlotAnchors(i) {
    var n, a, r;
    const e = i.querySelector("[data-hd-ship-map]");
    e && ((n = this.linkResizeObserver) == null || n.disconnect(), this.linkResizeObserver = void 0, typeof ResizeObserver < "u" && (this.linkResizeObserver = new ResizeObserver(() => this.syncShipLinks(i)), this.linkResizeObserver.observe(i.querySelector(".hd-stage") ?? i)), (a = i.querySelector(".hd-slot-rail")) == null || a.addEventListener("scroll", () => this.syncShipLinks(i)), (r = e.querySelector("img")) == null || r.addEventListener("load", () => this.syncShipLinks(i)), i.querySelectorAll("[data-hd-link-slot]").forEach((o) => {
      o.addEventListener("click", () => {
        var l;
        (l = game.user) != null && l.isGM && (this.linkingSlotId = o.dataset.hdLinkSlot ?? "", i.classList.toggle("is-linking-slot", !!this.linkingSlotId));
      });
    }), i.querySelectorAll("[data-hd-clear-link]").forEach((o) => {
      o.addEventListener("click", async () => {
        const l = f(), c = o.dataset.hdClearLink ?? "";
        l && await nt(l.id, c);
      });
    }), e.addEventListener("click", async (o) => {
      var d;
      if (!((d = game.user) != null && d.isGM) || !this.linkingSlotId) return;
      o.preventDefault();
      const l = f(), c = this.getImageAnchorPoint(e, o.clientX, o.clientY), u = this.linkingSlotId;
      this.linkingSlotId = "", i.classList.remove("is-linking-slot"), l && await C(l.id, u, c.x, c.y);
    }), i.querySelectorAll("[data-hd-anchor-slot]").forEach((o) => {
      o.addEventListener("pointerdown", (l) => {
        var g;
        if (!((g = game.user) != null && g.isGM)) return;
        l.preventDefault();
        const c = o.dataset.hdAnchorSlot ?? "", u = (p) => {
          const S = this.getImageAnchorPoint(e, p.clientX, p.clientY);
          o.dataset.hdAnchorX = String(S.x), o.dataset.hdAnchorY = String(S.y), this.syncShipLinks(i);
        }, d = async (p) => {
          window.removeEventListener("pointermove", u), window.removeEventListener("pointerup", d);
          const S = f(), E = this.getImageAnchorPoint(e, p.clientX, p.clientY);
          S && await C(S.id, c, E.x, E.y);
        };
        window.addEventListener("pointermove", u), window.addEventListener("pointerup", d);
      });
    }));
  }
  getImageAnchorPoint(i, e, n) {
    const a = this.getShipImageRect(i), r = Math.min(100, Math.max(0, (e - a.left) / a.width * 100)), o = Math.min(100, Math.max(0, (n - a.top) / a.height * 100));
    return { x: r, y: o };
  }
  getShipImageRect(i) {
    const e = i.querySelector("img"), n = e == null ? void 0 : e.getBoundingClientRect();
    if (n != null && n.width && (n != null && n.height) && (e != null && e.naturalWidth) && (e != null && e.naturalHeight)) {
      const a = e.naturalWidth / e.naturalHeight, r = n.width / n.height;
      if (a > r) {
        const c = n.width / a, u = n.top + (n.height - c) / 2;
        return new DOMRect(n.left, u, n.width, c);
      }
      const o = n.height * a, l = n.left + (n.width - o) / 2;
      return new DOMRect(l, n.top, o, n.height);
    }
    return n != null && n.width && (n != null && n.height) ? n : i.getBoundingClientRect();
  }
  positionSlotPins(i) {
    const e = i.querySelector("[data-hd-ship-map]");
    if (!e) return;
    const n = this.getShipImageRect(e), a = e.getBoundingClientRect();
    i.querySelectorAll("[data-hd-anchor-slot]").forEach((r) => {
      const o = Number(r.dataset.hdAnchorX), l = Number(r.dataset.hdAnchorY);
      if (!Number.isFinite(o) || !Number.isFinite(l)) return;
      const c = n.left - a.left + n.width * o / 100, u = n.top - a.top + n.height * l / 100;
      r.style.left = `${c}px`, r.style.top = `${u}px`;
    });
  }
  syncShipLinks(i) {
    this.positionSlotPins(i), this.drawSlotLinks(i);
  }
  drawSlotLinks(i) {
    const e = i.querySelector("[data-hd-link-lines]"), n = i.querySelector("[data-hd-ship-map]");
    if (!e || !n) return;
    const a = e.getBoundingClientRect(), r = Math.max(1, Math.round(a.width)), o = Math.max(1, Math.round(a.height));
    e.setAttribute("viewBox", `0 0 ${r} ${o}`), e.setAttribute("width", String(r)), e.setAttribute("height", String(o)), e.innerHTML = "", i.querySelectorAll("[data-hd-anchor-slot]").forEach((l) => {
      const c = l.dataset.hdAnchorSlot ?? "", u = i.querySelector(`[data-hd-slot-card="${c}"]`);
      if (!u) return;
      const d = l.getBoundingClientRect(), g = u.getBoundingClientRect(), p = d.left + d.width / 2 - a.left, S = d.top + d.height / 2 - a.top, E = g.left - a.left, z = g.top + g.height / 2 - a.top, G = Math.max(40, Math.abs(E - p) / 2), R = document.createElementNS("http://www.w3.org/2000/svg", "path");
      R.setAttribute("d", `M ${p} ${S} C ${p + G} ${S}, ${E - G} ${z}, ${E} ${z}`), R.setAttribute("class", "hd-link-line"), e.append(R);
    });
  }
  browseShipImage() {
    var n, a;
    if (!h("choose ship images")) return;
    const i = Y(this), e = i == null ? void 0 : i.querySelector("[data-hd-profile-form] input[name='image']");
    if (!e || typeof FilePicker > "u") {
      (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "Foundry FilePicker is not available.");
      return;
    }
    new FilePicker({
      type: "image",
      current: e.value,
      callback: (r) => {
        e.value = r;
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
  game.settings.register(w, H, {
    name: "HoloDock Ship Profiles",
    hint: "World-level ship profile and loadout data.",
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: F
  }), game.settings.register(w, N, {
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
    setSlotAnchor: C,
    clearSlotAnchor: nt,
    equipItem: st,
    unequipItem: P,
    getCategories: x
  };
  game.holodock = t;
  const s = game.modules.get(w);
  s && (s.api = t);
}
function Dt() {
  const t = game.modules.get("holosuite-core");
  return (t != null && t.active ? t.api : null) ?? game.holosuite ?? globalThis.HoloSuiteCoreApi ?? null;
}
function $() {
  const t = Dt();
  if (!(t != null && t.registerApp)) return !1;
  const s = {
    id: w,
    title: "HoloDock",
    icon: "fa-solid fa-shuttle-space",
    premium: !1,
    playerVisible: !0,
    description: "View and manage system-agnostic ship loadouts.",
    open: () => at()
  };
  return t.registerApp(s), !0;
}
function Et() {
  if ($()) return;
  let t = 0;
  const s = () => {
    t += 1, !($() || t >= 20) && window.setTimeout(s, 250);
  };
  Hooks.once("holosuite-core.apiReady", () => $()), window.setTimeout(s, 250);
}
Hooks.once("init", async () => {
  kt(), Handlebars.registerHelper("hdFallback", (t, s) => t || s), await loadTemplates([B]);
});
Hooks.once("ready", () => {
  Lt(), Et(), console.log(`${w} | Ready. API available at game.holodock.`);
});
