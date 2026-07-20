var je = Object.defineProperty;
var _e = (e, t, n) => t in e ? je(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var G = (e, t, n) => _e(e, typeof t != "symbol" ? t + "" : t, n);
function ze() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) ?? null;
}
function Ge() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : n.api) ?? null;
}
function Ve(e = {}, t = {}) {
  var i, a, r;
  const n = ((a = (i = globalThis.foundry) == null ? void 0 : i.utils) == null ? void 0 : a.mergeObject) ?? ((r = foundry == null ? void 0 : foundry.utils) == null ? void 0 : r.mergeObject);
  return typeof n == "function" ? n(e, t, { inplace: !1 }) : { ...e, ...t };
}
function We() {
  var e, t, n, i, a;
  return ((n = (t = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : t.randomID) == null ? void 0 : n.call(t, 8)) ?? ((a = (i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.randomID) == null ? void 0 : a.call(i, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function me(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${We()}`),
    tag: e.tag ?? "section",
    classes: Array.isArray(e.classes) ? e.classes : [],
    window: {
      title: e.title ?? "",
      icon: e.icon,
      resizable: e.resizable === !0
    },
    position: {
      width: Number(e.width ?? 600),
      height: e.height === "auto" ? "auto" : Number(e.height ?? 600)
    }
  };
}
function Ye(e) {
  return class extends e {
    constructor(i = {}) {
      const a = Ve(new.target.defaultOptions ?? {}, i);
      super(me(a));
      G(this, "_v1Options");
      this._v1Options = a;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return me(this.defaultOptions ?? {});
    }
    activateListeners(i) {
    }
    async _renderHTML(i, a) {
      var c, d, p;
      const r = typeof this.getData == "function" ? await this.getData() : {}, o = ((c = this._v1Options) == null ? void 0 : c.template) ?? ((d = this.options) == null ? void 0 : d.template) ?? ((p = this.constructor.defaultOptions) == null ? void 0 : p.template);
      if (!o) return document.createDocumentFragment();
      const l = await globalThis.renderTemplate(o, r), s = document.createElement("template");
      return s.innerHTML = l.trim(), s.content;
    }
    _activateV1Form(i) {
      var r, o;
      if (typeof this._updateObject != "function") return;
      const a = (r = i.matches) != null && r.call(i, "form") ? i : (o = i.querySelector) == null ? void 0 : o.call(i, "form");
      a instanceof HTMLFormElement && a.addEventListener("submit", async (l) => {
        var s;
        l.preventDefault(), l.stopPropagation(), await this._updateObject(l, new FormData(a)), ((s = this._v1Options) == null ? void 0 : s.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(i, a, r) {
      var d, p, f, u;
      a.replaceChildren(i);
      const o = globalThis.jQuery ?? globalThis.$, l = ((d = a.closest) == null ? void 0 : d.call(a, ".window-app, .app, .application")) ?? a, s = o ? o(l) : l;
      try {
        Object.defineProperty(this, "element", {
          value: s,
          configurable: !0,
          writable: !0
        });
      } catch {
        try {
          this.element = s;
        } catch {
        }
      }
      const c = (p = this._v1Options) == null ? void 0 : p.classes;
      Array.isArray(c) && c.length && (a.classList.add(...c), (u = (f = a.closest) == null ? void 0 : f.call(a, ".window-app, .app, .application")) == null || u.classList.add(...c)), this._activateV1Form(a), typeof this.activateListeners == "function" && this.activateListeners(o ? o(a) : a);
    }
  };
}
function Xe() {
  const e = ze(), t = Ge(), n = globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (n) return n;
  const i = e == null ? void 0 : e.ApplicationV2;
  return i ? Ye(i) : null;
}
const k = "holodock", oe = "profiles", se = "slotCategories", te = "shipEquipment", ve = `modules/${k}/templates/holodock.hbs`, Y = "modules/holodock/assets/SpaceshipDefault.webp", Je = "icons/svg/space-station.svg", O = ["Weapons", "Defense", "Utility", "Engines", "Cargo", "Special"];
function E(e) {
  var t, n;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.deepClone ? foundry.utils.deepClone(e) : (n = foundry == null ? void 0 : foundry.utils) != null && n.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? {}));
}
function C(e = "hd") {
  var n, i, a;
  const t = ((i = (n = foundry == null ? void 0 : foundry.utils) == null ? void 0 : n.randomID) == null ? void 0 : i.call(n)) ?? ((a = crypto == null ? void 0 : crypto.randomUUID) == null ? void 0 : a.call(crypto)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${e}-${t}`;
}
function g(e) {
  var n;
  if ((n = foundry == null ? void 0 : foundry.utils) != null && n.escapeHTML) return foundry.utils.escapeHTML(String(e ?? ""));
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function y(e = "edit HoloDock") {
  var t, n, i;
  return (t = game.user) != null && t.isGM ? !0 : ((i = (n = ui.notifications) == null ? void 0 : n.warn) == null || i.call(n, `Only a GM can ${e}.`), !1);
}
const Qe = Xe();
let I = null, P = "";
function U(e = {}) {
  const t = Number(e.anchorX), n = Number(e.anchorY);
  return {
    id: String(e.id || C("slot")),
    label: String(e.label || "Equipment Slot").trim() || "Equipment Slot",
    category: String(e.category || O[0]).trim() || O[0],
    description: String(e.description || "").trim(),
    requireShipEquipment: e.requireShipEquipment === !0,
    requiredCategory: String(e.requiredCategory || "").trim(),
    requiredTags: Array.isArray(e.requiredTags) ? e.requiredTags.map((i) => String(i).trim()).filter(Boolean) : [],
    allowUntagged: e.allowUntagged !== !1,
    anchorX: Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : void 0,
    anchorY: Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : void 0,
    itemUuid: String(e.itemUuid || "").trim() || void 0
  };
}
function H(e = {}) {
  return {
    id: String(e.id || C("stat")),
    label: String(e.label || "Statistic").trim() || "Statistic",
    value: String(e.value || "").trim(),
    note: String(e.note || "").trim()
  };
}
function Se(e = {}) {
  return {
    slotId: String(e.slotId || "").trim(),
    allocated: Math.max(0, w(e.allocated, 0)),
    online: e.online !== !1
  };
}
function ke(e = {}) {
  return {
    id: String(e.id || C("preset")),
    name: String(e.name || "Power Preset").trim() || "Power Preset",
    entries: Array.isArray(e.entries) ? e.entries.map(Se).filter((t) => t.slotId) : []
  };
}
function L(e = {}) {
  const t = String(e.image || Y).trim() || Y;
  return {
    id: String(e.id || C("ship")),
    name: String(e.name || "Party Ship").trim() || "Party Ship",
    shipClass: String(e.shipClass || "").trim(),
    image: t === Je ? Y : t,
    powerCapacity: Math.max(0, w(e.powerCapacity, 0)),
    powerPresets: Array.isArray(e.powerPresets) ? e.powerPresets.map(ke) : [],
    stats: Array.isArray(e.stats) ? e.stats.map(H) : [],
    slots: Array.isArray(e.slots) ? e.slots.map(U) : []
  };
}
function w(e, t = 0) {
  const n = Number(e);
  return Number.isFinite(n) ? n : t;
}
function qe(e) {
  return Array.isArray(e) ? e.map((t) => String(t).trim()).filter(Boolean) : String(e || "").split(",").map((t) => t.trim()).filter(Boolean);
}
function ge(e) {
  return e ? "checked" : "";
}
function le(e = {}) {
  var a, r, o, l, s, c, d, p, f, u, h, m, S, A, T, x;
  const t = Math.max(0, w((a = e.durability) == null ? void 0 : a.max, 0)), n = Math.min(t, Math.max(0, w((r = e.durability) == null ? void 0 : r.value, t))), i = String(e.category || O[0]).trim() || O[0];
  return {
    enabled: e.enabled === !0,
    category: i,
    tags: qe(e.tags),
    activation: {
      enabled: ((o = e.activation) == null ? void 0 : o.enabled) === !0,
      label: String(((l = e.activation) == null ? void 0 : l.label) || "Activate").trim() || "Activate",
      actionType: String(((s = e.activation) == null ? void 0 : s.actionType) || "").trim(),
      cooldown: Math.max(0, w((c = e.activation) == null ? void 0 : c.cooldown, 0)),
      resourceCost: String(((d = e.activation) == null ? void 0 : d.resourceCost) || "").trim(),
      durabilityCost: Math.max(0, w((p = e.activation) == null ? void 0 : p.durabilityCost, 0)),
      blockWhenBroken: ((f = e.activation) == null ? void 0 : f.blockWhenBroken) !== !1
    },
    durability: {
      enabled: ((u = e.durability) == null ? void 0 : u.enabled) === !0,
      value: n,
      max: t,
      brokenAt: Math.max(0, w((h = e.durability) == null ? void 0 : h.brokenAt, 0))
    },
    power: {
      enabled: ((m = e.power) == null ? void 0 : m.enabled) === !0,
      draw: Math.max(0, w((S = e.power) == null ? void 0 : S.draw, 0)),
      allocated: Math.max(0, w((A = e.power) == null ? void 0 : A.allocated, ((T = e.power) == null ? void 0 : T.draw) ?? 0)),
      online: ((x = e.power) == null ? void 0 : x.online) !== !1
    }
  };
}
function v(e) {
  var t;
  return le(((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, k, te)) ?? {});
}
function Ke(e) {
  return v(e).enabled;
}
async function R(e, t) {
  var a;
  if (!y("tag ship equipment") || !(e != null && e.setFlag)) return null;
  const n = v(e), i = le({
    ...n,
    ...t,
    tags: t.tags ?? n.tags,
    activation: {
      ...n.activation,
      ...t.activation
    },
    durability: {
      ...n.durability,
      ...t.durability
    },
    power: {
      ...n.power,
      ...t.power
    }
  });
  return i.enabled ? (await e.setFlag(k, te, i), await ne(i.category), B(), i) : (await ((a = e.unsetFlag) == null ? void 0 : a.call(e, k, te)), B(), i);
}
async function J(e, t) {
  const n = v(e), i = Math.max(0, n.durability.max), a = Math.min(i, Math.max(0, w(t, n.durability.value)));
  return R(e, {
    enabled: n.enabled,
    durability: {
      ...n.durability,
      value: a
    }
  });
}
async function Ae(e, t) {
  const n = v(e);
  return !n.enabled || !n.power.enabled ? null : R(e, {
    enabled: n.enabled,
    power: {
      ...n.power,
      online: t === !0
    }
  });
}
async function ie(e, t) {
  const n = v(e);
  return !n.enabled || !n.power.enabled ? null : R(e, {
    enabled: n.enabled,
    power: {
      ...n.power,
      allocated: Math.max(0, w(t, n.power.allocated))
    }
  });
}
function ce(e) {
  const t = e.durability, n = e.enabled && t.enabled, i = Math.max(0, t.max), a = Math.min(i, Math.max(0, t.value)), r = n && a <= t.brokenAt, o = n && !r && i > 0 && a < i;
  return { isBroken: r, isDamaged: o, value: a, max: i };
}
async function j(e, t, n = {}) {
  var d, p;
  const i = globalThis.ChatMessage;
  if (!(i != null && i.create)) return;
  const a = v(e), r = ce(a), o = n.slot, l = n.profile, s = t.blocked || !t.ok ? "Blocked" : t.handled ? "Activated" : "Unhandled", c = `
    <article class="hd-chat-card ${t.blocked || !t.ok ? "is-blocked" : "is-activated"}">
      <header>
        <img src="${g((e == null ? void 0 : e.img) || "icons/svg/item-bag.svg")}" alt="">
        <div>
          <p class="hd-kicker">HoloDock Activation</p>
          <h3>${g((e == null ? void 0 : e.name) ?? "Ship Equipment")}</h3>
        </div>
      </header>
      <dl>
        <div><dt>Outcome</dt><dd>${g(s)}</dd></div>
        ${l ? `<div><dt>Ship</dt><dd>${g(l.name)}</dd></div>` : ""}
        ${o ? `<div><dt>Slot</dt><dd>${g(o.label)}</dd></div>` : ""}
        ${a.activation.actionType ? `<div><dt>Action</dt><dd>${g(a.activation.actionType)}</dd></div>` : ""}
        ${a.durability.enabled ? `<div><dt>Durability</dt><dd>${r.value} / ${r.max}</dd></div>` : ""}
      </dl>
      ${t.message ? `<p>${g(t.message)}</p>` : ""}
    </article>
  `;
  await i.create({
    user: (d = game.user) == null ? void 0 : d.id,
    speaker: ((p = i.getSpeaker) == null ? void 0 : p.call(i)) ?? {},
    content: c
  });
}
async function Ee(e, t = {}) {
  var s;
  const n = v(e);
  if (!n.enabled || !n.activation.enabled)
    return { ok: !1, handled: !1, blocked: !0, message: "That item is not configured as activatable ship equipment." };
  if (n.power.enabled && !n.power.online) {
    const c = { ok: !1, handled: !1, blocked: !0, message: "That ship equipment is offline." };
    return await j(e, c, t), c;
  }
  if (n.power.enabled && n.power.allocated < n.power.draw) {
    const c = { ok: !1, handled: !1, blocked: !0, message: "That ship equipment does not have enough allocated power." };
    return await j(e, c, t), c;
  }
  const i = ce(n);
  if (n.activation.blockWhenBroken && i.isBroken) {
    const c = { ok: !1, handled: !1, blocked: !0, message: "That ship equipment is broken." };
    return await j(e, c, t), c;
  }
  const a = {
    item: e,
    equipment: n,
    durabilityState: i,
    handled: !1,
    blocked: !1,
    message: "",
    ...t
  };
  if (Hooks.callAll(`${k}.activateEquipment`, a), a.blocked) {
    const c = {
      ok: !1,
      handled: a.handled === !0,
      blocked: !0,
      message: String(a.message || "Ship equipment activation was blocked.")
    };
    return await j(e, c, t), c;
  }
  let r = !1;
  n.activation.durabilityCost > 0 && n.durability.enabled && ((s = game.user) != null && s.isGM) && (await J(e, i.value - n.activation.durabilityCost), r = !0);
  const o = a.handled === !0 || r, l = {
    ok: !0,
    handled: o,
    blocked: !1,
    message: String(a.message || (o ? "Ship equipment activated." : "No system handled this ship equipment activation."))
  };
  return await j(e, l, t), l;
}
function q() {
  const e = game.settings.get(k, oe);
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const t = {};
  for (const n of Object.values(e)) {
    const i = L(n);
    t[i.id] = i;
  }
  return t;
}
function de() {
  return Object.values(q()).sort((e, t) => e.name.localeCompare(t.name));
}
async function $(e) {
  y("save ship loadouts") && (await game.settings.set(k, oe, e), B());
}
function z() {
  const e = game.settings.get(k, se), t = Array.isArray(e) ? e.map((n) => String(n).trim()).filter(Boolean) : [];
  return t.length ? [...new Set(t)] : O;
}
async function ne(e) {
  var i;
  const t = String(e || "").trim();
  if (!t || !((i = game.user) != null && i.isGM)) return;
  const n = z();
  n.some((a) => a.toLowerCase() === t.toLowerCase()) || await game.settings.set(k, se, [...n, t]);
}
function b() {
  const e = de();
  return e.length ? ((!P || !e.some((t) => t.id === P)) && (P = e[0].id), e.find((t) => t.id === P) ?? null) : null;
}
function Q(e = P) {
  const t = q()[e];
  return t ? L(t) : null;
}
async function $e() {
  if (!y("create ship profiles")) return null;
  const e = L({
    id: C("ship"),
    name: "New Ship",
    shipClass: "",
    image: Y,
    powerCapacity: 0,
    stats: [
      H({ id: C("stat"), label: "Speed", value: "6", note: "" }),
      H({ id: C("stat"), label: "Fuel", value: "100%", note: "" }),
      H({ id: C("stat"), label: "Defense", value: "10", note: "" })
    ],
    slots: O.slice(0, 4).map((n) => U({
      id: C("slot"),
      label: n,
      category: n
    }))
  }), t = E(q());
  return t[e.id] = e, P = e.id, await $(t), e;
}
async function Te(e, t) {
  if (!y("update ship profiles")) return null;
  const n = E(q()), i = n[e];
  if (!i) return null;
  const a = L({
    ...i,
    name: t.name,
    shipClass: t.shipClass,
    image: t.image,
    powerCapacity: t.powerCapacity,
    powerPresets: i.powerPresets,
    stats: i.stats,
    slots: i.slots
  });
  return n[e] = a, await $(n), a;
}
async function De(e, t) {
  var o, l;
  if (!y("save power presets")) return null;
  const n = E(q()), i = n[e];
  if (!i) return null;
  const a = [];
  for (const s of i.slots) {
    if (!s.itemUuid) continue;
    const c = await D(s.itemUuid), d = v(c);
    !d.enabled || !d.power.enabled || a.push(Se({
      slotId: s.id,
      allocated: d.power.allocated,
      online: d.power.online
    }));
  }
  if (!a.length)
    return (l = (o = ui.notifications) == null ? void 0 : o.warn) == null || l.call(o, "No powered ship equipment is currently slotted."), null;
  const r = ke({
    id: C("preset"),
    name: t,
    entries: a
  });
  return i.powerPresets = [...i.powerPresets ?? [], r], n[e] = L(i), await $(n), r;
}
async function Ce(e, t) {
  var o;
  if (!y("delete power presets")) return !1;
  const n = E(q()), i = n[e];
  if (!i) return !1;
  const a = (o = i.powerPresets) == null ? void 0 : o.find((l) => l.id === t);
  return !a || !await Dialog.confirm({
    title: "Delete Power Preset",
    content: `<p>Delete <strong>${g(a.name)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (i.powerPresets = i.powerPresets.filter((l) => l.id !== t), n[e] = L(i), await $(n), !0);
}
async function xe(e, t) {
  var r, o, l, s;
  if (!y("apply power presets")) return !1;
  const n = Q(e), i = n == null ? void 0 : n.powerPresets.find((c) => c.id === t);
  if (!n || !i) return !1;
  let a = 0;
  for (const c of i.entries) {
    const d = n.slots.find((u) => u.id === c.slotId), p = await D((d == null ? void 0 : d.itemUuid) ?? ""), f = v(p);
    !f.enabled || !f.power.enabled || (await R(p, {
      enabled: f.enabled,
      power: {
        ...f.power,
        allocated: c.allocated,
        online: c.online
      }
    }), a += 1);
  }
  return a ? ((s = (l = ui.notifications) == null ? void 0 : l.info) == null || s.call(l, `Applied power preset: ${i.name}`), B(), !0) : ((o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, "That preset did not match any powered slotted equipment."), !1);
}
async function Pe(e = P) {
  if (!y("delete ship profiles")) return !1;
  const t = Q(e);
  if (!t || !await Dialog.confirm({
    title: "Delete Ship Profile",
    content: `<p>Delete <strong>${g(t.name)}</strong>?</p>`,
    defaultYes: !1
  })) return !1;
  const i = E(q());
  return delete i[e], P = Object.keys(i)[0] ?? "", await $(i), !0;
}
async function Le(e, t) {
  if (!y("edit ship statistics")) return null;
  const n = E(q()), i = n[e];
  if (!i) return null;
  const a = H(t), r = i.stats.findIndex((o) => o.id === a.id);
  return r >= 0 ? i.stats[r] = { ...i.stats[r], ...a } : i.stats.push(a), n[e] = L(i), await $(n), a;
}
async function Ie(e, t) {
  if (!y("delete ship statistics")) return !1;
  const n = E(q()), i = n[e];
  if (!i) return !1;
  const a = i.stats.find((o) => o.id === t);
  return !a || !await Dialog.confirm({
    title: "Delete Ship Statistic",
    content: `<p>Delete <strong>${g(a.label)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (i.stats = i.stats.filter((o) => o.id !== t), n[e] = L(i), await $(n), !0);
}
async function Me(e, t) {
  if (!y("edit equipment slots")) return null;
  const n = E(q()), i = n[e];
  if (!i) return null;
  const a = i.slots.findIndex((o) => o.id === t.id), r = U(a >= 0 ? { ...i.slots[a], ...t } : t);
  return a >= 0 ? i.slots[a] = r : i.slots.push(r), n[e] = L(i), await ne(r.category), r.requiredCategory && await ne(r.requiredCategory), await $(n), r;
}
async function Oe(e, t) {
  if (!y("delete equipment slots")) return !1;
  const n = E(q()), i = n[e];
  if (!i) return !1;
  const a = i.slots.find((o) => o.id === t);
  return !a || !await Dialog.confirm({
    title: "Delete Equipment Slot",
    content: `<p>Delete <strong>${g(a.label)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (i.slots = i.slots.filter((o) => o.id !== t), n[e] = L(i), await $(n), !0);
}
async function ae(e, t, n, i) {
  var o;
  if (!y("place equipment links")) return !1;
  const a = E(q()), r = (o = a[e]) == null ? void 0 : o.slots.find((l) => l.id === t);
  return r ? (r.anchorX = Math.min(100, Math.max(0, Number(n))), r.anchorY = Math.min(100, Math.max(0, Number(i))), await $(a), !0) : !1;
}
async function He(e, t) {
  var a;
  if (!y("clear equipment links")) return !1;
  const n = E(q()), i = (a = n[e]) == null ? void 0 : a.slots.find((r) => r.id === t);
  return i ? (delete i.anchorX, delete i.anchorY, await $(n), !0) : !1;
}
function Be(e) {
  const t = [];
  return e.requireShipEquipment && t.push("Ship equipment required"), e.requiredCategory && t.push(`Category: ${e.requiredCategory}`), e.requiredTags.length && t.push(`Tags: ${e.requiredTags.join(", ")}`), !e.allowUntagged && !e.requireShipEquipment && t.push("Tagged items only"), t.join(" | ");
}
function ue(e, t) {
  const n = v(t), i = !!e.requiredCategory, a = e.requiredTags.length > 0, r = e.requireShipEquipment || i || a || !e.allowUntagged;
  if (!n.enabled)
    return r ? { ok: !1, reason: "That slot only accepts HoloDock ship equipment." } : { ok: !0 };
  if (e.requiredCategory && n.category.toLowerCase() !== e.requiredCategory.toLowerCase())
    return { ok: !1, reason: `That slot requires ${e.requiredCategory} ship equipment.` };
  const o = new Set(n.tags.map((s) => s.toLowerCase())), l = e.requiredTags.filter((s) => !o.has(s.toLowerCase()));
  return l.length ? { ok: !1, reason: `That slot requires tag${l.length === 1 ? "" : "s"}: ${l.join(", ")}.` } : { ok: !0 };
}
async function pe(e, t, n) {
  var l, s, c, d, p;
  if (!y("equip items")) return !1;
  const i = await D(n);
  if (!i)
    return (s = (l = ui.notifications) == null ? void 0 : l.warn) == null || s.call(l, "Drop a regular Foundry Item onto the slot."), !1;
  const a = E(q()), r = (c = a[e]) == null ? void 0 : c.slots.find((f) => f.id === t);
  if (!r) return !1;
  const o = ue(U(r), i);
  return o.ok ? (r.itemUuid = i.uuid, await $(a), !0) : ((p = (d = ui.notifications) == null ? void 0 : d.warn) == null || p.call(d, o.reason ?? "That item is not compatible with this ship slot."), !1);
}
async function re(e, t) {
  var a;
  if (!y("remove equipped items")) return !1;
  const n = E(q()), i = (a = n[e]) == null ? void 0 : a.slots.find((r) => r.id === t);
  return i ? (delete i.itemUuid, await $(n), !0) : !1;
}
async function D(e) {
  var i;
  const t = String(e || "").trim(), n = globalThis.fromUuid;
  if (!t || typeof n != "function") return null;
  try {
    const a = await n(t);
    return (a == null ? void 0 : a.documentName) === "Item" || ((i = a == null ? void 0 : a.constructor) == null ? void 0 : i.name) === "Item" ? a : null;
  } catch (a) {
    return console.warn(`${k} | Failed to resolve item UUID "${t}".`, a), null;
  }
}
function Ze(e) {
  var t, n, i;
  try {
    const a = globalThis.TextEditor ?? ((n = (t = foundry == null ? void 0 : foundry.applications) == null ? void 0 : t.ux) == null ? void 0 : n.TextEditor);
    if (a != null && a.getDragEventData) return a.getDragEventData(e);
  } catch {
  }
  try {
    return JSON.parse(((i = e.dataTransfer) == null ? void 0 : i.getData("text/plain")) || "{}");
  } catch {
    return {};
  }
}
function et(e) {
  var n, i, a;
  const t = ((i = (n = e == null ? void 0 : e.system) == null ? void 0 : n.description) == null ? void 0 : i.value) ?? ((a = e == null ? void 0 : e.system) == null ? void 0 : a.description) ?? (e == null ? void 0 : e.description) ?? "";
  return typeof t == "string" ? t.trim() : t != null && t.value ? String(t.value).trim() : "";
}
function Fe(e) {
  if (!e.enabled) return "";
  const t = [`Ship Equipment: ${e.category}`];
  return e.durability.enabled && e.durability.max > 0 && t.push(`Durability ${e.durability.value}/${e.durability.max}`), e.power.enabled && e.power.draw > 0 && t.push(`Power ${e.power.allocated}/${e.power.draw} ${e.power.online ? "online" : "offline"}`), t.join(" | ");
}
function tt(e) {
  if (!e.enabled) return [];
  const t = [e.category];
  return e.activation.enabled && t.push("Activatable"), e.durability.enabled && t.push("Durability"), e.power.enabled && t.push("Power"), t;
}
function it(e) {
  const t = e.durability, { isBroken: n, isDamaged: i, value: a, max: r } = ce(e), o = e.power.enabled && !e.power.online, l = e.power.enabled && e.power.online && e.power.allocated < e.power.draw, s = o || l || e.activation.blockWhenBroken && n;
  return {
    ...e,
    badges: tt(e),
    tagsText: e.tags.join(", "),
    hasTags: e.tags.length > 0,
    durability: {
      ...t,
      value: a,
      max: r,
      state: n ? "Broken" : i ? "Damaged" : "Intact",
      isBroken: n,
      isDamaged: i
    },
    power: {
      ...e.power,
      state: e.power.online ? l ? "Underpowered" : "Online" : "Offline",
      allocationText: `${e.power.allocated} / ${e.power.draw}`,
      allocationPercent: e.power.draw > 0 ? Math.min(100, Math.round(e.power.allocated / e.power.draw * 100)) : 100,
      isOffline: o,
      isUnderpowered: l
    },
    activation: {
      ...e.activation,
      isBlocked: s,
      blockedReason: o ? "Equipment offline" : l ? "Insufficient allocated power" : n ? "Equipment broken" : ""
    }
  };
}
function Ue(e) {
  const t = Math.max(0, w(e.powerCapacity, 0)), n = e.slots.reduce((l, s) => {
    var d, p;
    const c = (p = (d = s == null ? void 0 : s.item) == null ? void 0 : d.equipment) == null ? void 0 : p.power;
    return !(c != null && c.enabled) || c.online === !1 ? l : l + Math.max(0, w(c.allocated, c.draw ?? 0));
  }, 0), i = t > 0 ? t - n : 0, a = t > 0 ? Math.max(0, n - t) : 0, r = t > 0, o = r && n > t;
  return {
    capacity: t,
    used: n,
    remaining: i,
    overage: a,
    hasCapacity: r,
    isOverBudget: o,
    summary: r ? `${n} / ${t}` : `${n} draw`
  };
}
function nt(e, t) {
  const n = new Map(t.map((a) => [a.id, a])), i = t.filter((a) => {
    var r, o, l;
    return (l = (o = (r = a.item) == null ? void 0 : r.equipment) == null ? void 0 : o.power) == null ? void 0 : l.enabled;
  });
  return e.powerPresets.map((a) => {
    const r = a.entries.reduce((s, c) => c.online ? s + c.allocated : s, 0), o = a.entries.filter((s) => s.online).length, l = i.length > 0 && a.entries.length === i.length && a.entries.every((s) => {
      var d, p, f;
      const c = (f = (p = (d = n.get(s.slotId)) == null ? void 0 : d.item) == null ? void 0 : p.equipment) == null ? void 0 : f.power;
      return (c == null ? void 0 : c.enabled) && c.allocated === s.allocated && c.online === s.online;
    });
    return {
      ...a,
      allocated: r,
      onlineEntries: o,
      systemCount: a.entries.length,
      summary: `${r} allocated | ${o}/${a.entries.length} online`,
      isCurrent: l
    };
  });
}
function at(e) {
  const t = e.slots.length, n = e.slots.filter((u) => u.item && !u.item.missing).length, i = Math.max(0, t - n), a = e.slots.filter((u) => {
    var h, m;
    return (m = (h = u.item) == null ? void 0 : h.equipment) == null ? void 0 : m.enabled;
  }).map((u) => {
    const h = u.item.equipment, m = h.power, S = h.durability, A = S.enabled && S.isBroken, T = S.enabled && S.isDamaged, x = m.enabled && m.isOffline, N = m.enabled && m.isUnderpowered, Z = h.activation.enabled, he = A ? "Broken" : x ? "Offline" : N ? "Underpowered" : T ? "Damaged" : "Ready";
    return {
      slotId: u.id,
      slotLabel: u.label,
      itemName: u.item.name,
      itemImg: u.item.img,
      category: h.category,
      state: he,
      stateClass: `is-${he.toLowerCase()}`,
      icon: A ? "fa-triangle-exclamation" : x ? "fa-power-off" : N ? "fa-gauge-simple-low" : T ? "fa-screwdriver-wrench" : "fa-circle-check",
      canActivate: Z,
      activationLabel: h.activation.label,
      activationBlocked: h.activation.isBlocked,
      powerEnabled: m.enabled,
      powerDraw: m.draw,
      powerAllocated: m.allocated,
      powerAllocationText: m.allocationText,
      powerAllocationPercent: m.allocationPercent,
      powerState: m.state,
      durabilityEnabled: S.enabled,
      durabilityText: S.enabled ? `${S.value} / ${S.max}` : ""
    };
  }), r = a.filter((u) => u.state === "Broken").length, o = a.filter((u) => u.state === "Damaged").length, l = a.filter((u) => u.state === "Offline").length, s = a.filter((u) => u.state === "Underpowered").length, c = a.filter((u) => u.powerEnabled).length, d = a.filter((u) => u.powerEnabled && u.powerState === "Online").length, p = a.filter((u) => u.canActivate).length, f = a.filter((u) => u.canActivate && u.activationBlocked).length;
  return {
    totalSlots: t,
    equippedSlots: n,
    emptySlots: i,
    systems: a,
    hasSystems: a.length > 0,
    brokenSystems: r,
    damagedSystems: o,
    offlineSystems: l,
    underpoweredSystems: s,
    poweredSystems: c,
    onlineSystems: d,
    activatableSystems: p,
    blockedActivations: f,
    hasAlerts: e.power.isOverBudget || r > 0 || o > 0 || l > 0 || s > 0,
    tiles: [
      { label: "Systems", value: `${n}/${t}`, note: i ? `${i} empty` : "All slots filled", icon: "fa-layer-group", stateClass: i ? "is-muted" : "is-ready" },
      { label: "Power", value: e.power.summary, note: e.power.hasCapacity ? `${e.power.remaining} remaining` : "capacity untracked", icon: e.power.isOverBudget ? "fa-triangle-exclamation" : "fa-bolt", stateClass: e.power.isOverBudget ? "is-danger" : "is-ready" },
      { label: "Online", value: `${d}/${c}`, note: s ? `${s} underpowered` : c ? "powered systems" : "No power draw", icon: "fa-power-off", stateClass: l || s ? "is-warning" : "is-ready" },
      { label: "Integrity", value: r ? `${r} broken` : o ? `${o} damaged` : "Nominal", note: a.length ? "ship equipment" : "No systems", icon: r ? "fa-triangle-exclamation" : "fa-shield-halved", stateClass: r ? "is-danger" : o ? "is-warning" : "is-ready" },
      { label: "Actions", value: String(p), note: f ? `${f} blocked` : "available activations", icon: "fa-bolt", stateClass: f ? "is-warning" : "is-ready" }
    ]
  };
}
async function rt(e) {
  const t = Number.isFinite(e.anchorX) && Number.isFinite(e.anchorY), n = Be(e), i = {
    ...e,
    hasAnchor: t,
    compatibilitySummary: n,
    hasCompatibilityRules: !!n
  };
  if (!e.itemUuid) return { ...i, item: null };
  const a = await D(e.itemUuid);
  if (!a)
    return {
      ...i,
      item: {
        name: "Missing Item",
        img: "icons/svg/hazard.svg",
        status: "Stored UUID no longer resolves",
        missing: !0
      }
    };
  const r = v(a), o = Fe(r);
  return {
    ...i,
    item: {
      name: a.name ?? "Unnamed Item",
      img: a.img || "icons/svg/item-bag.svg",
      status: o || (a.type ? `Item Type: ${a.type}` : "Foundry Item"),
      description: et(a),
      uuid: a.uuid,
      equipment: it(r)
    }
  };
}
async function ot() {
  var i;
  const e = b();
  let t = null;
  if (e) {
    const a = await Promise.all(e.slots.map(rt)), r = Ue({ ...e, slots: a });
    t = {
      ...e,
      slots: a,
      power: r,
      powerPresets: nt(e, a),
      hasPowerPresets: e.powerPresets.length > 0,
      dashboard: at({ slots: a, power: r })
    };
  }
  const n = de().map((a) => ({
    ...a,
    isSelected: a.id === P
  }));
  return {
    canEdit: ((i = game.user) == null ? void 0 : i.isGM) === !0,
    hasProfiles: n.length > 0,
    profiles: n,
    selectedProfile: t,
    categories: z()
  };
}
function X(e, t = null) {
  var n;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (n = e.element) != null && n[0] ? e.element[0] : e.element ?? null;
}
function B() {
  I != null && I.rendered && I.render(!0);
}
function fe(e) {
  var i, a;
  const t = (e == null ? void 0 : e[0]) ?? e, n = ((i = t == null ? void 0 : t.querySelector) == null ? void 0 : i.call(t, "form")) ?? ((a = t == null ? void 0 : t.closest) == null ? void 0 : a.call(t, "form"));
  return Object.fromEntries(new FormData(n).entries());
}
function st(e) {
  var a, r;
  const t = (e == null ? void 0 : e[0]) ?? e, n = ((a = t == null ? void 0 : t.querySelector) == null ? void 0 : a.call(t, "form")) ?? ((r = t == null ? void 0 : t.closest) == null ? void 0 : r.call(t, "form")), i = new FormData(n);
  return {
    id: String(i.get("id") || ""),
    label: String(i.get("label") || ""),
    category: String(i.get("category") || ""),
    description: String(i.get("description") || ""),
    requireShipEquipment: M(i, "requireShipEquipment"),
    requiredCategory: String(i.get("requiredCategory") || ""),
    requiredTags: qe(i.get("requiredTags")),
    allowUntagged: M(i, "allowUntagged")
  };
}
function be(e = {}) {
  if (!y("edit equipment slots")) return;
  const t = b();
  if (!t) return;
  const n = U({ label: "New Slot", category: O[0], ...e }), i = z().map((a) => `<option value="${g(a)}">`).join("");
  new Dialog({
    title: e.id ? "Edit Equipment Slot" : "Add Equipment Slot",
    content: `
      <form class="hd-dialog-form">
        <input type="hidden" name="id" value="${g(n.id)}">
        <label>
          <span>Slot Label</span>
          <input type="text" name="label" value="${g(n.label)}">
        </label>
        <label>
          <span>Category</span>
          <input type="text" name="category" value="${g(n.category)}" list="hd-slot-categories">
          <datalist id="hd-slot-categories">${i}</datalist>
        </label>
        <label>
          <span>Description</span>
          <textarea name="description" rows="4">${g(n.description)}</textarea>
        </label>
        <fieldset>
          <legend>Compatibility</legend>
          <label class="hd-check">
            <input type="checkbox" name="requireShipEquipment" ${ge(n.requireShipEquipment)}>
            <span>Require HoloDock ship equipment</span>
          </label>
          <label class="hd-check">
            <input type="checkbox" name="allowUntagged" ${ge(n.allowUntagged)}>
            <span>Allow untagged items when no category or tag rule is set</span>
          </label>
          <label>
            <span>Required Ship Equipment Category</span>
            <input type="text" name="requiredCategory" value="${g(n.requiredCategory)}" list="hd-slot-categories" placeholder="Optional">
          </label>
          <label>
            <span>Required Tags</span>
            <input type="text" name="requiredTags" value="${g(n.requiredTags.join(", "))}" placeholder="turret, external">
          </label>
        </fieldset>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (a) => Me(t.id, st(a))
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
  }).render(!0);
}
function we(e = {}) {
  if (!y("edit ship statistics")) return;
  const t = b();
  if (!t) return;
  const n = H({ label: "New Statistic", ...e });
  new Dialog({
    title: e.id ? "Edit Ship Statistic" : "Add Ship Statistic",
    content: `
      <form class="hd-dialog-form">
        <input type="hidden" name="id" value="${g(n.id)}">
        <label>
          <span>Label</span>
          <input type="text" name="label" value="${g(n.label)}">
        </label>
        <label>
          <span>Value</span>
          <input type="text" name="value" value="${g(n.value)}">
        </label>
        <label>
          <span>Note</span>
          <textarea name="note" rows="3">${g(n.note)}</textarea>
        </label>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (i) => Le(t.id, fe(i))
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
function lt() {
  if (!y("save power presets")) return;
  const e = b();
  e && new Dialog({
    title: "Save Power Preset",
    content: `
      <form class="hd-dialog-form">
        <label>
          <span>Preset Name</span>
          <input type="text" name="name" value="Combat">
        </label>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (t) => {
          const n = fe(t);
          return De(e.id, n.name || "Power Preset");
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
  }).render(!0);
}
function M(e, t) {
  return e.get(t) === "on";
}
function ct(e) {
  var r, o;
  const t = (e == null ? void 0 : e[0]) ?? e, n = ((r = t == null ? void 0 : t.querySelector) == null ? void 0 : r.call(t, "form")) ?? ((o = t == null ? void 0 : t.closest) == null ? void 0 : o.call(t, "form")), i = new FormData(n), a = String(i.get("tags") || "").split(",").map((l) => l.trim()).filter(Boolean);
  return le({
    enabled: M(i, "enabled"),
    category: String(i.get("category") || ""),
    tags: a,
    activation: {
      enabled: M(i, "activation.enabled"),
      label: String(i.get("activation.label") || ""),
      actionType: String(i.get("activation.actionType") || ""),
      cooldown: w(i.get("activation.cooldown"), 0),
      resourceCost: String(i.get("activation.resourceCost") || ""),
      durabilityCost: w(i.get("activation.durabilityCost"), 0),
      blockWhenBroken: M(i, "activation.blockWhenBroken")
    },
    durability: {
      enabled: M(i, "durability.enabled"),
      value: w(i.get("durability.value"), 0),
      max: w(i.get("durability.max"), 0),
      brokenAt: w(i.get("durability.brokenAt"), 0)
    },
    power: {
      enabled: M(i, "power.enabled"),
      draw: w(i.get("power.draw"), 0),
      allocated: w(i.get("power.allocated"), w(i.get("power.draw"), 0)),
      online: M(i, "power.online")
    }
  });
}
function F(e) {
  if (!y("tag ship equipment") || !e) return;
  const t = v(e), n = z().map((a) => `<option value="${g(a)}">`).join(""), i = (a) => a ? "checked" : "";
  new Dialog({
    title: `Ship Equipment: ${e.name ?? "Item"}`,
    content: `
      <form class="hd-dialog-form hd-equipment-form">
        <label class="hd-check">
          <input type="checkbox" name="enabled" ${i(t.enabled)}>
          <span>Ship Equipment</span>
        </label>
        <label>
          <span>Category</span>
          <input type="text" name="category" value="${g(t.category)}" list="hd-equipment-categories">
          <datalist id="hd-equipment-categories">${n}</datalist>
        </label>
        <label>
          <span>Tags</span>
          <input type="text" name="tags" value="${g(t.tags.join(", "))}" placeholder="turret, external, sensor">
        </label>

        <fieldset>
          <legend>Activation</legend>
          <label class="hd-check">
            <input type="checkbox" name="activation.enabled" ${i(t.activation.enabled)}>
            <span>Can be activated</span>
          </label>
          <div class="hd-form-grid">
            <label>
              <span>Button Label</span>
              <input type="text" name="activation.label" value="${g(t.activation.label)}">
            </label>
            <label>
              <span>Action Type</span>
              <input type="text" name="activation.actionType" value="${g(t.activation.actionType)}" placeholder="attack, scan, repair">
            </label>
            <label>
              <span>Cooldown</span>
              <input type="number" min="0" step="1" name="activation.cooldown" value="${t.activation.cooldown}">
            </label>
            <label>
              <span>Resource Cost</span>
              <input type="text" name="activation.resourceCost" value="${g(t.activation.resourceCost)}">
            </label>
            <label>
              <span>Durability Cost</span>
              <input type="number" min="0" step="1" name="activation.durabilityCost" value="${t.activation.durabilityCost}">
            </label>
          </div>
          <label class="hd-check">
            <input type="checkbox" name="activation.blockWhenBroken" ${i(t.activation.blockWhenBroken)}>
            <span>Block activation when broken</span>
          </label>
        </fieldset>

        <fieldset>
          <legend>Durability</legend>
          <label class="hd-check">
            <input type="checkbox" name="durability.enabled" ${i(t.durability.enabled)}>
            <span>Has durability</span>
          </label>
          <div class="hd-form-grid">
            <label>
              <span>Current</span>
              <input type="number" min="0" step="1" name="durability.value" value="${t.durability.value}">
            </label>
            <label>
              <span>Maximum</span>
              <input type="number" min="0" step="1" name="durability.max" value="${t.durability.max}">
            </label>
            <label>
              <span>Broken At</span>
              <input type="number" min="0" step="1" name="durability.brokenAt" value="${t.durability.brokenAt}">
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Power</legend>
          <label class="hd-check">
            <input type="checkbox" name="power.enabled" ${i(t.power.enabled)}>
            <span>Requires power</span>
          </label>
          <label class="hd-check">
            <input type="checkbox" name="power.online" ${i(t.power.online)}>
            <span>Online</span>
          </label>
          <label>
            <span>Power Draw</span>
            <input type="number" min="0" step="1" name="power.draw" value="${t.power.draw}">
          </label>
          <label>
            <span>Starting Allocation</span>
            <input type="number" min="0" step="1" name="power.allocated" value="${t.power.allocated}">
          </label>
        </fieldset>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (a) => R(e, ct(a))
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
  }).render(!0);
}
function dt(e) {
  if (!y("edit ship equipment durability")) return;
  const t = v(e);
  !t.enabled || !t.durability.enabled || new Dialog({
    title: `Set Durability: ${e.name ?? "Item"}`,
    content: `
      <form class="hd-dialog-form">
        <label>
          <span>Current Durability</span>
          <input type="number" min="0" max="${t.durability.max}" step="1" name="value" value="${t.durability.value}">
        </label>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (n) => {
          const i = fe(n);
          return J(e, w(i.value, t.durability.value));
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
  }).render(!0);
}
function ut() {
  const e = game.items;
  if (!e) return [];
  if (Array.isArray(e)) return e;
  if (Array.isArray(e.contents)) return e.contents;
  try {
    return Array.from(e);
  } catch {
    return [];
  }
}
function pt(e) {
  return ut().filter((t) => {
    var n;
    return (t == null ? void 0 : t.documentName) === "Item" || ((n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) === "Item";
  }).map((t) => {
    const n = v(t), i = ue(e, t);
    return {
      id: String(t.id ?? t.uuid ?? C("item")),
      uuid: String(t.uuid ?? ""),
      name: String(t.name ?? "Unnamed Item"),
      img: String(t.img || "icons/svg/item-bag.svg"),
      type: String(t.type || "Item"),
      status: Fe(n) || `Item Type: ${t.type || "Item"}`,
      compatible: i.ok,
      reason: i.reason ?? "",
      shipEquipment: n.enabled,
      category: n.enabled ? n.category : "",
      tagsText: n.tags.join(", ")
    };
  }).filter((t) => t.uuid).sort((t, n) => t.compatible !== n.compatible ? t.compatible ? -1 : 1 : t.shipEquipment !== n.shipEquipment ? t.shipEquipment ? -1 : 1 : t.name.localeCompare(n.name));
}
function ye(e) {
  return `
    <button type="button" class="hd-equipment-pick ${e.compatible ? "" : "is-incompatible"}" data-hd-pick-item="${g(e.uuid)}">
      <img src="${g(e.img)}" alt="">
      <span>
        <strong>${g(e.name)}</strong>
        <small>${g(e.status)}</small>
        ${e.tagsText ? `<em>${g(e.tagsText)}</em>` : ""}
        ${e.reason ? `<em>${g(e.reason)}</em>` : ""}
      </span>
    </button>
  `;
}
function ft(e, t) {
  if (!y("equip items")) return;
  const n = Q(e), i = n == null ? void 0 : n.slots.find((c) => c.id === t);
  if (!n || !i) return;
  const a = U(i), r = pt(a), o = r.filter((c) => c.compatible), l = r.filter((c) => !c.compatible), s = new Dialog({
    title: `Choose Equipment: ${i.label}`,
    content: `
      <section class="hd-equipment-browser">
        <p class="hd-muted">${g(Be(a) || "No slot compatibility rules set.")}</p>
        <div class="hd-equipment-pick-list">
          ${o.length ? o.map(ye).join("") : '<p class="hd-muted">No compatible world items found.</p>'}
        </div>
        ${l.length ? `
          <details class="hd-incompatible-equipment">
            <summary>${l.length} incompatible item${l.length === 1 ? "" : "s"}</summary>
            <div class="hd-equipment-pick-list">
              ${l.map(ye).join("")}
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
  s.render(!0), window.setTimeout(() => {
    const c = X(s);
    c == null || c.querySelectorAll("[data-hd-pick-item]").forEach((d) => {
      d.addEventListener("click", async () => {
        const p = d.dataset.hdPickItem ?? "";
        await pe(n.id, i.id, p) && s.close();
      });
    });
  }, 0);
}
function K(e) {
  var n, i, a;
  const t = [
    e == null ? void 0 : e.document,
    e == null ? void 0 : e.item,
    e == null ? void 0 : e.object,
    e == null ? void 0 : e._document,
    (n = e == null ? void 0 : e.options) == null ? void 0 : n.document
  ];
  for (const r of t) {
    if (!r) continue;
    const o = r.documentName ?? ((i = r.constructor) == null ? void 0 : i.documentName), l = String(((a = r.constructor) == null ? void 0 : a.name) ?? "");
    if (o === "Item" || l.includes("Item") && r.type !== void 0 && r.setFlag && r.getFlag) return r;
  }
  return null;
}
function V(e, t) {
  var a;
  if (!((a = game.user) != null && a.isGM)) return;
  const n = K(e);
  if (!n || !Array.isArray(t) || t.some((r) => (r == null ? void 0 : r.class) === "hd-edit-equipment" || (r == null ? void 0 : r.className) === "hd-edit-equipment")) return;
  const i = {
    label: "Ship Equipment",
    title: "HoloDock Ship Equipment",
    class: "hd-edit-equipment",
    className: "hd-edit-equipment",
    icon: "fa-solid fa-shuttle-space",
    onclick: () => F(n),
    onClick: () => F(n)
  };
  t.unshift(i);
}
function ht(e, t) {
  var i;
  if (!((i = game.user) != null && i.isGM)) return;
  const n = K(e);
  !n || !Array.isArray(t) || t.some((a) => (a == null ? void 0 : a.action) === "holodockShipEquipment" || (a == null ? void 0 : a.class) === "hd-edit-equipment") || t.unshift({
    action: "holodockShipEquipment",
    label: "Ship Equipment",
    title: "HoloDock Ship Equipment",
    icon: "fa-solid fa-shuttle-space",
    class: "hd-edit-equipment",
    visible: !0,
    ownership: "OWNER",
    onClick: () => F(n),
    onclick: () => F(n)
  });
}
function Re(e, t = null) {
  var l, s, c, d, p, f, u;
  const n = X(null, t), i = ((l = e == null ? void 0 : e.element) == null ? void 0 : l[0]) ?? (e == null ? void 0 : e.element) ?? ((s = e == null ? void 0 : e._element) == null ? void 0 : s[0]) ?? (e == null ? void 0 : e._element), a = ((c = e == null ? void 0 : e.window) == null ? void 0 : c.element) ?? ((d = e == null ? void 0 : e.window) == null ? void 0 : d.frame), r = e != null && e.id && ((p = globalThis.CSS) != null && p.escape) ? CSS.escape(e.id) : "", o = [
    a,
    (f = i == null ? void 0 : i.closest) == null ? void 0 : f.call(i, ".application, .app, .window-app"),
    i,
    (u = n == null ? void 0 : n.closest) == null ? void 0 : u.call(n, ".application, .app, .window-app"),
    e != null && e.id ? document.getElementById(e.id) : null,
    r ? document.querySelector(`#${r}`) : null,
    e != null && e.appId ? document.querySelector(`[data-appid="${e.appId}"], [data-application-id="${e.appId}"]`) : null
  ];
  for (const h of o)
    if (h instanceof HTMLElement) return h;
  return null;
}
function W(e, t = null) {
  var s;
  if (!((s = game.user) != null && s.isGM)) return;
  const n = K(e);
  if (!n) return;
  const i = Re(e, t);
  if (!i || i.querySelector(".hd-edit-equipment, [data-hd-edit-equipment]")) return;
  const a = i.querySelector(".window-header, header.window-header, .app-header, header");
  if (!a) return;
  const r = document.createElement("button");
  r.type = "button", r.className = "hd-edit-equipment hd-item-sheet-header-fallback", r.dataset.hdEditEquipment = "true", r.title = "HoloDock Ship Equipment", r.innerHTML = '<i class="fa-solid fa-shuttle-space"></i><span class="sr-only">Ship Equipment</span>', r.addEventListener("click", (c) => {
    c.preventDefault(), F(n);
  });
  const o = a.querySelector(".window-controls, .header-controls, .window-header-buttons, .window-buttons, menu"), l = a.querySelector(".close, [data-action='close']");
  o ? o.prepend(r) : l ? a.insertBefore(r, l) : a.append(r);
}
function mt(e, t = null) {
  W(e, t), window.setTimeout(() => W(e, t), 0), window.setTimeout(() => W(e, t), 100), window.setTimeout(() => W(e, t), 300);
}
function _(e, t = null) {
  mt(e, t);
  const n = Re(e, t), i = K(e);
  !n || !i || n.dataset.hdEquipmentHeaderListener === "true" || (n.dataset.hdEquipmentHeaderListener = "true", n.addEventListener("click", (a) => {
    var o, l;
    (l = (o = a.target) == null ? void 0 : o.closest) != null && l.call(o, "[data-action='holodockShipEquipment'], .hd-edit-equipment") && (a.preventDefault(), F(i));
  }));
}
class gt extends Qe {
  constructor() {
    super(...arguments);
    G(this, "linkingSlotId", "");
    G(this, "linkResizeObserver");
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holodock",
      title: "HoloDock - Ship Loadout",
      classes: ["holodock-window"],
      template: ve,
      popOut: !0,
      resizable: !0,
      width: 920,
      height: 760
    });
  }
  async getData() {
    return ot();
  }
  activateListeners(n) {
    var a, r;
    super.activateListeners(n);
    const i = X(this, n);
    i && ((a = i.querySelector("[data-hd-profile-select]")) == null || a.addEventListener("change", (o) => {
      P = o.currentTarget.value, this.render(!0);
    }), (r = i.querySelector("[data-hd-profile-form]")) == null || r.addEventListener("submit", async (o) => {
      o.preventDefault();
      const l = b();
      if (!l) return;
      const s = Object.fromEntries(new FormData(o.currentTarget).entries());
      await Te(l.id, s);
    }), i.querySelectorAll("[data-hd-action]").forEach((o) => {
      o.addEventListener("click", async (l) => {
        const s = l.currentTarget.dataset.hdAction, c = b();
        s === "create-profile" && await $e(), s === "delete-profile" && await Pe(c == null ? void 0 : c.id), s === "create-slot" && be(), s === "create-stat" && we(), s === "browse-image" && this.browseShipImage(), s === "save-power-preset" && lt();
      });
    }), i.querySelectorAll("[data-hd-apply-power-preset]").forEach((o) => {
      o.addEventListener("click", async (l) => {
        const s = b(), c = l.currentTarget.dataset.hdApplyPowerPreset ?? "";
        s && await xe(s.id, c);
      });
    }), i.querySelectorAll("[data-hd-delete-power-preset]").forEach((o) => {
      o.addEventListener("click", async (l) => {
        const s = b(), c = l.currentTarget.dataset.hdDeletePowerPreset ?? "";
        s && await Ce(s.id, c);
      });
    }), i.querySelectorAll("[data-hd-edit-stat]").forEach((o) => {
      o.addEventListener("click", (l) => {
        const s = b(), c = s == null ? void 0 : s.stats.find((d) => d.id === l.currentTarget.dataset.hdEditStat);
        c && we(c);
      });
    }), i.querySelectorAll("[data-hd-delete-stat]").forEach((o) => {
      o.addEventListener("click", async (l) => {
        const s = b(), c = l.currentTarget.dataset.hdDeleteStat ?? "";
        s && await Ie(s.id, c);
      });
    }), i.querySelectorAll("[data-hd-edit-slot]").forEach((o) => {
      o.addEventListener("click", (l) => {
        const s = b(), c = s == null ? void 0 : s.slots.find((d) => d.id === l.currentTarget.dataset.hdEditSlot);
        c && be(c);
      });
    }), i.querySelectorAll("[data-hd-delete-slot]").forEach((o) => {
      o.addEventListener("click", async (l) => {
        const s = b(), c = l.currentTarget.dataset.hdDeleteSlot ?? "";
        s && await Oe(s.id, c);
      });
    }), i.querySelectorAll("[data-hd-browse-equipment]").forEach((o) => {
      o.addEventListener("click", (l) => {
        const s = b(), c = l.currentTarget.dataset.hdBrowseEquipment ?? "";
        s && ft(s.id, c);
      });
    }), i.querySelectorAll("[data-hd-open-item]").forEach((o) => {
      o.addEventListener("click", async (l) => {
        var p, f, u;
        const s = b(), c = s == null ? void 0 : s.slots.find((h) => h.id === l.currentTarget.dataset.hdOpenItem), d = await D((c == null ? void 0 : c.itemUuid) ?? "");
        (p = d == null ? void 0 : d.sheet) != null && p.render ? d.sheet.render(!0) : (u = (f = ui.notifications) == null ? void 0 : f.warn) == null || u.call(f, "That item could not be found.");
      });
    }), i.querySelectorAll("[data-hd-activate-equipment]").forEach((o) => {
      o.addEventListener("click", async (l) => {
        var u, h, m, S, A, T, x, N;
        const s = b(), c = l.currentTarget.dataset.hdActivateEquipment ?? "", d = s == null ? void 0 : s.slots.find((Z) => Z.id === c), p = await D((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p || !s || !d) {
          (h = (u = ui.notifications) == null ? void 0 : u.warn) == null || h.call(u, "That ship equipment could not be found.");
          return;
        }
        const f = await Ee(p, { profile: s, slot: d });
        f.blocked || !f.ok ? (S = (m = ui.notifications) == null ? void 0 : m.warn) == null || S.call(m, f.message) : f.handled ? f.message && ((N = (x = ui.notifications) == null ? void 0 : x.info) == null || N.call(x, f.message)) : (T = (A = ui.notifications) == null ? void 0 : A.info) == null || T.call(A, f.message);
      });
    }), i.querySelectorAll("[data-hd-durability-adjust]").forEach((o) => {
      o.addEventListener("click", async (l) => {
        var u, h;
        const s = b(), c = l.currentTarget, d = s == null ? void 0 : s.slots.find((m) => m.id === c.dataset.hdDurabilityAdjust), p = await D((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (h = (u = ui.notifications) == null ? void 0 : u.warn) == null || h.call(u, "That ship equipment could not be found.");
          return;
        }
        const f = v(p);
        !f.enabled || !f.durability.enabled || await J(p, f.durability.value + w(c.dataset.hdDurabilityDelta, 0));
      });
    }), i.querySelectorAll("[data-hd-durability-set]").forEach((o) => {
      o.addEventListener("click", async (l) => {
        var p, f;
        const s = b(), c = s == null ? void 0 : s.slots.find((u) => u.id === l.currentTarget.dataset.hdDurabilitySet), d = await D((c == null ? void 0 : c.itemUuid) ?? "");
        d ? dt(d) : (f = (p = ui.notifications) == null ? void 0 : p.warn) == null || f.call(p, "That ship equipment could not be found.");
      });
    }), i.querySelectorAll("[data-hd-power-toggle]").forEach((o) => {
      o.addEventListener("click", async (l) => {
        var u, h;
        const s = b(), c = l.currentTarget, d = s == null ? void 0 : s.slots.find((m) => m.id === c.dataset.hdPowerToggle), p = await D((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (h = (u = ui.notifications) == null ? void 0 : u.warn) == null || h.call(u, "That ship equipment could not be found.");
          return;
        }
        const f = v(p);
        !f.enabled || !f.power.enabled || await Ae(p, c.dataset.hdPowerOnline === "true");
      });
    }), i.querySelectorAll("[data-hd-power-adjust]").forEach((o) => {
      o.addEventListener("click", async (l) => {
        var u, h;
        const s = b(), c = l.currentTarget, d = s == null ? void 0 : s.slots.find((m) => m.id === c.dataset.hdPowerAdjust), p = await D((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (h = (u = ui.notifications) == null ? void 0 : u.warn) == null || h.call(u, "That ship equipment could not be found.");
          return;
        }
        const f = v(p);
        !f.enabled || !f.power.enabled || await ie(p, f.power.allocated + w(c.dataset.hdPowerDelta, 0));
      });
    }), i.querySelectorAll("[data-hd-power-allocation]").forEach((o) => {
      o.addEventListener("change", async (l) => {
        var f, u;
        const s = b(), c = l.currentTarget, d = s == null ? void 0 : s.slots.find((h) => h.id === c.dataset.hdPowerAllocation), p = await D((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (u = (f = ui.notifications) == null ? void 0 : f.warn) == null || u.call(f, "That ship equipment could not be found.");
          return;
        }
        await ie(p, w(c.value, 0));
      });
    }), i.querySelectorAll("[data-hd-remove-item]").forEach((o) => {
      o.addEventListener("click", async (l) => {
        const s = b(), c = l.currentTarget.dataset.hdRemoveItem ?? "";
        s && await re(s.id, c);
      });
    }), this.activateSlotDrops(i), this.activateSlotAnchors(i), window.requestAnimationFrame(() => this.syncShipLinks(i)), window.setTimeout(() => this.syncShipLinks(i), 100));
  }
  activateSlotDrops(n) {
    n.querySelectorAll("[data-hd-slot-id]").forEach((i) => {
      i.addEventListener("dragover", (a) => {
        var r;
        (r = game.user) != null && r.isGM && (a.preventDefault(), i.classList.add("is-drop-hover"));
      }), i.addEventListener("dragleave", () => i.classList.remove("is-drop-hover")), i.addEventListener("drop", async (a) => {
        var c, d, p;
        if (i.classList.remove("is-drop-hover"), !((c = game.user) != null && c.isGM)) return;
        a.preventDefault();
        const r = b(), o = i.dataset.hdSlotId ?? "", l = Ze(a), s = l.uuid ?? l.documentUuid ?? l.itemUuid ?? "";
        if (!r || !s) {
          (p = (d = ui.notifications) == null ? void 0 : d.warn) == null || p.call(d, "Drop a Foundry Item onto an equipment slot.");
          return;
        }
        await pe(r.id, o, s);
      }), i.addEventListener("contextmenu", async (a) => {
        var l;
        if (!((l = game.user) != null && l.isGM)) return;
        a.preventDefault();
        const r = b(), o = i.dataset.hdSlotId ?? "";
        r && await re(r.id, o);
      });
    });
  }
  activateSlotAnchors(n) {
    var a, r, o;
    const i = n.querySelector("[data-hd-ship-map]");
    i && ((a = this.linkResizeObserver) == null || a.disconnect(), this.linkResizeObserver = void 0, typeof ResizeObserver < "u" && (this.linkResizeObserver = new ResizeObserver(() => this.syncShipLinks(n)), this.linkResizeObserver.observe(n.querySelector(".hd-stage") ?? n)), (r = n.querySelector(".hd-slot-rail")) == null || r.addEventListener("scroll", () => this.syncShipLinks(n)), (o = i.querySelector("img")) == null || o.addEventListener("load", () => this.syncShipLinks(n)), n.querySelectorAll("[data-hd-link-slot]").forEach((l) => {
      l.addEventListener("click", () => {
        var s;
        (s = game.user) != null && s.isGM && (this.linkingSlotId = l.dataset.hdLinkSlot ?? "", n.classList.toggle("is-linking-slot", !!this.linkingSlotId));
      });
    }), n.querySelectorAll("[data-hd-clear-link]").forEach((l) => {
      l.addEventListener("click", async () => {
        const s = b(), c = l.dataset.hdClearLink ?? "";
        s && await He(s.id, c);
      });
    }), i.addEventListener("click", async (l) => {
      var p;
      if (!((p = game.user) != null && p.isGM) || !this.linkingSlotId) return;
      l.preventDefault();
      const s = b(), c = this.getImageAnchorPoint(i, l.clientX, l.clientY), d = this.linkingSlotId;
      this.linkingSlotId = "", n.classList.remove("is-linking-slot"), s && await ae(s.id, d, c.x, c.y);
    }), n.querySelectorAll("[data-hd-anchor-slot]").forEach((l) => {
      l.addEventListener("pointerdown", (s) => {
        var f;
        if (!((f = game.user) != null && f.isGM)) return;
        s.preventDefault();
        const c = l.dataset.hdAnchorSlot ?? "", d = (u) => {
          const h = this.getImageAnchorPoint(i, u.clientX, u.clientY);
          l.dataset.hdAnchorX = String(h.x), l.dataset.hdAnchorY = String(h.y), this.syncShipLinks(n);
        }, p = async (u) => {
          window.removeEventListener("pointermove", d), window.removeEventListener("pointerup", p);
          const h = b(), m = this.getImageAnchorPoint(i, u.clientX, u.clientY);
          h && await ae(h.id, c, m.x, m.y);
        };
        window.addEventListener("pointermove", d), window.addEventListener("pointerup", p);
      });
    }));
  }
  getImageAnchorPoint(n, i, a) {
    const r = this.getShipImageRect(n), o = Math.min(100, Math.max(0, (i - r.left) / r.width * 100)), l = Math.min(100, Math.max(0, (a - r.top) / r.height * 100));
    return { x: o, y: l };
  }
  getShipImageRect(n) {
    const i = n.querySelector("img"), a = i == null ? void 0 : i.getBoundingClientRect();
    if (a != null && a.width && (a != null && a.height) && (i != null && i.naturalWidth) && (i != null && i.naturalHeight)) {
      const r = i.naturalWidth / i.naturalHeight, o = a.width / a.height;
      if (r > o) {
        const c = a.width / r, d = a.top + (a.height - c) / 2;
        return new DOMRect(a.left, d, a.width, c);
      }
      const l = a.height * r, s = a.left + (a.width - l) / 2;
      return new DOMRect(s, a.top, l, a.height);
    }
    return a != null && a.width && (a != null && a.height) ? a : n.getBoundingClientRect();
  }
  positionSlotPins(n) {
    const i = n.querySelector("[data-hd-ship-map]");
    if (!i) return;
    const a = this.getShipImageRect(i), r = i.getBoundingClientRect();
    n.querySelectorAll("[data-hd-anchor-slot]").forEach((o) => {
      const l = Number(o.dataset.hdAnchorX), s = Number(o.dataset.hdAnchorY);
      if (!Number.isFinite(l) || !Number.isFinite(s)) return;
      const c = a.left - r.left + a.width * l / 100, d = a.top - r.top + a.height * s / 100;
      o.style.left = `${c}px`, o.style.top = `${d}px`;
    });
  }
  syncShipLinks(n) {
    this.positionSlotPins(n), this.drawSlotLinks(n);
  }
  drawSlotLinks(n) {
    const i = n.querySelector("[data-hd-link-lines]"), a = n.querySelector("[data-hd-ship-map]");
    if (!i || !a) return;
    const r = i.getBoundingClientRect(), o = Math.max(1, Math.round(r.width)), l = Math.max(1, Math.round(r.height));
    i.setAttribute("viewBox", `0 0 ${o} ${l}`), i.setAttribute("width", String(o)), i.setAttribute("height", String(l)), i.innerHTML = "", n.querySelectorAll("[data-hd-anchor-slot]").forEach((s) => {
      const c = s.dataset.hdAnchorSlot ?? "", d = n.querySelector(`[data-hd-slot-card="${c}"]`);
      if (!d) return;
      const p = s.getBoundingClientRect(), f = d.getBoundingClientRect(), u = p.left + p.width / 2 - r.left, h = p.top + p.height / 2 - r.top, m = f.left - r.left, S = f.top + f.height / 2 - r.top, A = Math.max(40, Math.abs(m - u) / 2), T = document.createElementNS("http://www.w3.org/2000/svg", "path");
      T.setAttribute("d", `M ${u} ${h} C ${u + A} ${h}, ${m - A} ${S}, ${m} ${S}`), T.setAttribute("class", "hd-link-line"), i.append(T);
    });
  }
  browseShipImage() {
    var a, r;
    if (!y("choose ship images")) return;
    const n = X(this), i = n == null ? void 0 : n.querySelector("[data-hd-profile-form] input[name='image']");
    if (!i || typeof FilePicker > "u") {
      (r = (a = ui.notifications) == null ? void 0 : a.warn) == null || r.call(a, "Foundry FilePicker is not available.");
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
  async close(n = {}) {
    var i;
    return (i = this.linkResizeObserver) == null || i.disconnect(), this.linkResizeObserver = void 0, I = null, super.close(n);
  }
}
async function Ne() {
  return I || (I = new gt()), await I.render(!0), I;
}
function bt() {
  game.settings.register(k, oe, {
    name: "HoloDock Ship Profiles",
    hint: "World-level ship profile and loadout data.",
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: B
  }), game.settings.register(k, se, {
    name: "HoloDock Slot Categories",
    hint: "Reusable equipment slot categories for HoloDock.",
    scope: "world",
    config: !1,
    type: Array,
    default: O,
    onChange: B
  });
}
function wt() {
  const e = {
    open: Ne,
    getProfiles: de,
    getProfile: Q,
    createProfile: $e,
    updateProfileMetadata: Te,
    deleteProfile: Pe,
    capturePowerPreset: De,
    applyPowerPreset: xe,
    deletePowerPreset: Ce,
    upsertSlot: Me,
    deleteSlot: Oe,
    upsertStat: Le,
    deleteStat: Ie,
    setSlotAnchor: ae,
    clearSlotAnchor: He,
    equipItem: pe,
    unequipItem: re,
    getCategories: z,
    getShipPowerBudget: Ue,
    getShipEquipmentData: v,
    isShipEquipment: Ke,
    validateItemForSlot: ue,
    setShipEquipmentData: R,
    updateShipEquipmentDurability: J,
    updateShipEquipmentPowerState: Ae,
    updateShipEquipmentPowerAllocation: ie,
    activateEquipment: Ee
  };
  game.holodock = e;
  const t = game.modules.get(k);
  t && (t.api = e);
}
function yt() {
  const e = game.modules.get("holosuite-core");
  return (e != null && e.active ? e.api : null) ?? game.holosuite ?? globalThis.HoloSuiteCoreApi ?? null;
}
function ee() {
  const e = yt();
  if (!(e != null && e.registerApp)) return !1;
  const t = {
    id: k,
    title: "HoloDock",
    icon: "fa-solid fa-shuttle-space",
    premium: !1,
    playerVisible: !0,
    description: "View and manage system-agnostic ship loadouts.",
    open: () => Ne()
  };
  return e.registerApp(t), !0;
}
function vt() {
  if (ee()) return;
  let e = 0;
  const t = () => {
    e += 1, !(ee() || e >= 20) && window.setTimeout(t, 250);
  };
  Hooks.once("holosuite-core.apiReady", () => ee()), window.setTimeout(t, 250);
}
Hooks.once("init", async () => {
  bt(), Handlebars.registerHelper("hdFallback", (e, t) => e || t), await loadTemplates([ve]);
});
Hooks.once("ready", () => {
  wt(), Hooks.on("getApplicationHeaderButtons", V), Hooks.on("getApplicationV1HeaderButtons", V), Hooks.on("getDocumentSheetHeaderButtons", V), Hooks.on("getItemSheetHeaderButtons", V), Hooks.on("getHeaderControlsApplicationV2", ht), Hooks.on("renderItemSheet", _), Hooks.on("renderItemSheetV2", _), Hooks.on("renderApplication", _), Hooks.on("renderApplicationV1", _), Hooks.on("renderApplicationV2", _), vt(), console.log(`${k} | Ready. API available at game.holodock.`);
});
