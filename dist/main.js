var tt = Object.defineProperty;
var it = (e, t, a) => t in e ? tt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a;
var X = (e, t, a) => it(e, typeof t != "symbol" ? t + "" : t, a);
function at() {
  var e, t, a;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : t.api) ?? ((a = foundry == null ? void 0 : foundry.applications) == null ? void 0 : a.api) ?? null;
}
function nt() {
  var e, t, a;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : t.api) ?? ((a = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : a.api) ?? null;
}
function ot(e = {}, t = {}) {
  var i, n, o;
  const a = ((n = (i = globalThis.foundry) == null ? void 0 : i.utils) == null ? void 0 : n.mergeObject) ?? ((o = foundry == null ? void 0 : foundry.utils) == null ? void 0 : o.mergeObject);
  return typeof a == "function" ? a(e, t, { inplace: !1 }) : { ...e, ...t };
}
function rt() {
  var e, t, a, i, n;
  return ((a = (t = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : t.randomID) == null ? void 0 : a.call(t, 8)) ?? ((n = (i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.randomID) == null ? void 0 : n.call(i, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function Ee(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${rt()}`),
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
function st(e) {
  return class extends e {
    constructor(i = {}) {
      const n = ot(new.target.defaultOptions ?? {}, i);
      super(Ee(n));
      X(this, "_v1Options");
      this._v1Options = n;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return Ee(this.defaultOptions ?? {});
    }
    activateListeners(i) {
    }
    async _renderHTML(i, n) {
      var c, d, p;
      const o = typeof this.getData == "function" ? await this.getData() : {}, s = ((c = this._v1Options) == null ? void 0 : c.template) ?? ((d = this.options) == null ? void 0 : d.template) ?? ((p = this.constructor.defaultOptions) == null ? void 0 : p.template);
      if (!s) return document.createDocumentFragment();
      const r = await globalThis.renderTemplate(s, o), l = document.createElement("template");
      return l.innerHTML = r.trim(), l.content;
    }
    _activateV1Form(i) {
      var o, s;
      if (typeof this._updateObject != "function") return;
      const n = (o = i.matches) != null && o.call(i, "form") ? i : (s = i.querySelector) == null ? void 0 : s.call(i, "form");
      n instanceof HTMLFormElement && n.addEventListener("submit", async (r) => {
        var l;
        r.preventDefault(), r.stopPropagation(), await this._updateObject(r, new FormData(n)), ((l = this._v1Options) == null ? void 0 : l.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(i, n, o) {
      var d, p, u, f;
      n.replaceChildren(i);
      const s = globalThis.jQuery ?? globalThis.$, r = ((d = n.closest) == null ? void 0 : d.call(n, ".window-app, .app, .application")) ?? n, l = s ? s(r) : r;
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
      const c = (p = this._v1Options) == null ? void 0 : p.classes;
      Array.isArray(c) && c.length && (n.classList.add(...c), (f = (u = n.closest) == null ? void 0 : u.call(n, ".window-app, .app, .application")) == null || f.classList.add(...c)), this._activateV1Form(n), typeof this.activateListeners == "function" && this.activateListeners(s ? s(n) : n);
    }
  };
}
function lt() {
  const e = at(), t = nt(), a = globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (a) return a;
  const i = e == null ? void 0 : e.ApplicationV2;
  return i ? st(i) : null;
}
const A = "holodock", ct = "HoloDock", ue = "profiles", pe = "slotCategories", fe = "defaultProfile", oe = "shipEquipment", Pe = `modules/${A}/templates/holodock.hbs`, K = "modules/holodock/assets/SpaceshipDefault.webp", dt = "icons/svg/space-station.svg", U = ["Weapons", "Defense", "Utility", "Engines", "Cargo", "Special"];
function P(e) {
  var t, a;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.deepClone ? foundry.utils.deepClone(e) : (a = foundry == null ? void 0 : foundry.utils) != null && a.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? {}));
}
function C(e = "hd") {
  var a, i, n;
  const t = ((i = (a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.randomID) == null ? void 0 : i.call(a)) ?? ((n = crypto == null ? void 0 : crypto.randomUUID) == null ? void 0 : n.call(crypto)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${e}-${t}`;
}
function w(e) {
  var a;
  if ((a = foundry == null ? void 0 : foundry.utils) != null && a.escapeHTML) return foundry.utils.escapeHTML(String(e ?? ""));
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function S(e = "edit HoloDock") {
  var t, a, i;
  return (t = game.user) != null && t.isGM ? !0 : ((i = (a = ui.notifications) == null ? void 0 : a.warn) == null || i.call(a, `Only a GM can ${e}.`), !1);
}
const ut = lt();
let B = null, L = "", $ = "overview", I = "";
const re = [
  { id: "overview", label: "Overview", icon: "fa-solid fa-display" },
  { id: "systems", label: "Systems", icon: "fa-solid fa-microchip" },
  { id: "power", label: "Power Grid", icon: "fa-solid fa-bolt" },
  { id: "damage", label: "Damage", icon: "fa-solid fa-shield-halved" },
  { id: "speed", label: "Speed", icon: "fa-solid fa-gauge-high" },
  { id: "capacity", label: "Capacity", icon: "fa-solid fa-users" }
];
function G(e = {}) {
  const t = Number(e.anchorX), a = Number(e.anchorY);
  return {
    id: String(e.id || C("slot")),
    label: String(e.label || "Equipment Slot").trim() || "Equipment Slot",
    category: String(e.category || U[0]).trim() || U[0],
    description: String(e.description || "").trim(),
    requireShipEquipment: e.requireShipEquipment === !0,
    requiredCategory: String(e.requiredCategory || "").trim(),
    requiredTags: Array.isArray(e.requiredTags) ? e.requiredTags.map((i) => String(i).trim()).filter(Boolean) : [],
    allowUntagged: e.allowUntagged !== !1,
    anchorX: Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : void 0,
    anchorY: Number.isFinite(a) ? Math.min(100, Math.max(0, a)) : void 0,
    itemUuid: String(e.itemUuid || "").trim() || void 0
  };
}
function O(e = {}) {
  return {
    id: String(e.id || C("stat")),
    label: String(e.label || "Statistic").trim() || "Statistic",
    value: String(e.value || "").trim(),
    note: String(e.note || "").trim()
  };
}
function xe(e = {}) {
  return {
    slotId: String(e.slotId || "").trim(),
    allocated: Math.max(0, v(e.allocated, 0)),
    online: e.online !== !1
  };
}
function Le(e = {}) {
  return {
    id: String(e.id || C("preset")),
    name: String(e.name || "Power Preset").trim() || "Power Preset",
    entries: Array.isArray(e.entries) ? e.entries.map(xe).filter((t) => t.slotId) : []
  };
}
function M(e = {}) {
  const t = String(e.image || K).trim() || K;
  return {
    id: String(e.id || C("ship")),
    name: String(e.name || "Party Ship").trim() || "Party Ship",
    shipClass: String(e.shipClass || "").trim(),
    image: t === dt ? K : t,
    powerCapacity: Math.max(0, v(e.powerCapacity, 0)),
    powerPresets: Array.isArray(e.powerPresets) ? e.powerPresets.map(Le) : [],
    stats: Array.isArray(e.stats) ? e.stats.map(O) : [],
    slots: Array.isArray(e.slots) ? e.slots.map(G) : []
  };
}
function v(e, t = 0) {
  const a = Number(e);
  return Number.isFinite(a) ? a : t;
}
function Ie(e) {
  return Array.isArray(e) ? e.map((t) => String(t).trim()).filter(Boolean) : String(e || "").split(",").map((t) => t.trim()).filter(Boolean);
}
function Ce(e) {
  return e ? "checked" : "";
}
function me(e = {}) {
  var n, o, s, r, l, c, d, p, u, f, m, h, g, b, k, T, N;
  const t = Math.max(0, v((n = e.durability) == null ? void 0 : n.max, 0)), a = Math.min(t, Math.max(0, v((o = e.durability) == null ? void 0 : o.value, t))), i = String(e.category || U[0]).trim() || U[0];
  return {
    enabled: e.enabled === !0,
    category: i,
    tags: Ie(e.tags),
    activation: {
      enabled: ((s = e.activation) == null ? void 0 : s.enabled) === !0,
      label: String(((r = e.activation) == null ? void 0 : r.label) || "Activate").trim() || "Activate",
      actionType: String(((l = e.activation) == null ? void 0 : l.actionType) || "").trim(),
      cooldown: Math.max(0, v((c = e.activation) == null ? void 0 : c.cooldown, 0)),
      resourceCost: String(((d = e.activation) == null ? void 0 : d.resourceCost) || "").trim(),
      durabilityCost: Math.max(0, v((p = e.activation) == null ? void 0 : p.durabilityCost, 0)),
      blockWhenBroken: ((u = e.activation) == null ? void 0 : u.blockWhenBroken) !== !1,
      lastActivatedAt: Math.max(0, v((f = e.activation) == null ? void 0 : f.lastActivatedAt, 0))
    },
    durability: {
      enabled: ((m = e.durability) == null ? void 0 : m.enabled) === !0,
      value: a,
      max: t,
      brokenAt: Math.max(0, v((h = e.durability) == null ? void 0 : h.brokenAt, 0))
    },
    power: {
      enabled: ((g = e.power) == null ? void 0 : g.enabled) === !0,
      draw: Math.max(0, v((b = e.power) == null ? void 0 : b.draw, 0)),
      allocated: Math.max(0, v((k = e.power) == null ? void 0 : k.allocated, ((T = e.power) == null ? void 0 : T.draw) ?? 0)),
      online: ((N = e.power) == null ? void 0 : N.online) !== !1
    }
  };
}
function q(e) {
  var t;
  return me(((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, A, oe)) ?? {});
}
function pt(e) {
  return q(e).enabled;
}
async function _(e, t, a = {}) {
  var o;
  if (a.requireGm !== !1 && !S("tag ship equipment") || !(e != null && e.setFlag)) return null;
  const i = q(e), n = me({
    ...i,
    ...t,
    tags: t.tags ?? i.tags,
    activation: {
      ...i.activation,
      ...t.activation
    },
    durability: {
      ...i.durability,
      ...t.durability
    },
    power: {
      ...i.power,
      ...t.power
    }
  });
  return n.enabled ? (await e.setFlag(A, oe, n), await le(n.category), j(), n) : (await ((o = e.unsetFlag) == null ? void 0 : o.call(e, A, oe)), j(), n);
}
async function Z(e, t, a = {}) {
  const i = q(e), n = Math.max(0, i.durability.max), o = Math.min(n, Math.max(0, v(t, i.durability.value)));
  return _(e, {
    enabled: i.enabled,
    durability: {
      ...i.durability,
      value: o
    }
  }, a);
}
async function Me(e, t) {
  const a = q(e);
  return !a.enabled || !a.power.enabled ? null : _(e, {
    enabled: a.enabled,
    power: {
      ...a.power,
      online: t === !0
    }
  });
}
async function se(e, t) {
  const a = q(e);
  return !a.enabled || !a.power.enabled ? null : _(e, {
    enabled: a.enabled,
    power: {
      ...a.power,
      allocated: Math.max(0, v(t, a.power.allocated))
    }
  });
}
function he(e) {
  const t = e.durability, a = e.enabled && t.enabled, i = Math.max(0, t.max), n = Math.min(i, Math.max(0, t.value)), o = a && n <= t.brokenAt, s = a && !o && i > 0 && n < i;
  return { isBroken: o, isDamaged: s, value: n, max: i };
}
async function R(e, t, a = {}) {
  var d, p, u;
  const i = globalThis.ChatMessage;
  if (!(i != null && i.create)) return;
  const n = q(e), o = he(n), s = a.slot, r = a.profile, l = t.blocked || !t.ok ? "Blocked" : t.handled ? "Activated" : "Unhandled", c = `
    <article class="hd-chat-card ${t.blocked || !t.ok ? "is-blocked" : "is-activated"}">
      <header>
        <img src="${w((e == null ? void 0 : e.img) || "icons/svg/item-bag.svg")}" alt="">
        <div>
          <p class="hd-kicker">HoloDock Activation</p>
          <h3>${w((e == null ? void 0 : e.name) ?? "Ship Equipment")}</h3>
        </div>
      </header>
      <dl>
        <div><dt>Outcome</dt><dd>${w(l)}</dd></div>
        ${r ? `<div><dt>Ship</dt><dd>${w(r.name)}</dd></div>` : ""}
        ${s ? `<div><dt>Slot</dt><dd>${w(s.label)}</dd></div>` : ""}
        ${n.activation.actionType ? `<div><dt>Action</dt><dd>${w(n.activation.actionType)}</dd></div>` : ""}
        ${n.activation.resourceCost ? `<div><dt>Resource</dt><dd>${w(n.activation.resourceCost)}</dd></div>` : ""}
        ${n.activation.cooldown ? `<div><dt>Cooldown</dt><dd>${n.activation.cooldown} rounds</dd></div>` : ""}
        ${n.durability.enabled ? `<div><dt>Durability</dt><dd>${o.value} / ${o.max}</dd></div>` : ""}
      </dl>
      ${(d = t.consequences) != null && d.length ? `<ul>${t.consequences.map((f) => `<li>${w(f)}</li>`).join("")}</ul>` : ""}
      ${t.message ? `<p>${w(t.message)}</p>` : ""}
    </article>
  `;
  await i.create({
    user: (p = game.user) == null ? void 0 : p.id,
    speaker: ((u = i.getSpeaker) == null ? void 0 : u.call(i)) ?? {},
    content: c
  });
}
async function Oe(e, t = {}) {
  const a = q(e);
  if (!a.enabled || !a.activation.enabled)
    return { ok: !1, handled: !1, blocked: !0, message: "That item is not configured as activatable ship equipment." };
  if (a.power.enabled && !a.power.online) {
    const u = { ok: !1, handled: !1, blocked: !0, message: "That ship equipment is offline." };
    return await R(e, u, t), u;
  }
  if (a.power.enabled && a.power.allocated < a.power.draw) {
    const u = { ok: !1, handled: !1, blocked: !0, message: "That ship equipment does not have enough allocated power." };
    return await R(e, u, t), u;
  }
  const i = he(a);
  if (a.activation.blockWhenBroken && i.isBroken) {
    const u = { ok: !1, handled: !1, blocked: !0, message: "That ship equipment is broken." };
    return await R(e, u, t), u;
  }
  const n = Date.now(), o = Math.max(0, a.activation.cooldown) * 6e3;
  if (o > 0 && a.activation.lastActivatedAt > 0) {
    const u = a.activation.lastActivatedAt + o;
    if (u > n) {
      const f = Math.max(1, Math.ceil((u - n) / 6e3)), m = {
        ok: !1,
        handled: !1,
        blocked: !0,
        message: `That ship equipment is cooling down for ${f} more round${f === 1 ? "" : "s"}.`,
        consequences: [`Cooldown remaining: ${f} round${f === 1 ? "" : "s"}`]
      };
      return await R(e, m, t), m;
    }
  }
  if (a.activation.durabilityCost > 0 && a.durability.enabled && i.value <= 0) {
    const u = {
      ok: !1,
      handled: !1,
      blocked: !0,
      message: "That ship equipment has no durability left to spend.",
      consequences: [`Required durability: ${a.activation.durabilityCost}`]
    };
    return await R(e, u, t), u;
  }
  const s = {
    item: e,
    equipment: a,
    durabilityState: i,
    handled: !1,
    blocked: !1,
    message: "",
    consequences: [],
    ...t
  };
  if (Hooks.callAll(`${A}.activateEquipment`, s), s.blocked) {
    const u = {
      ok: !1,
      handled: s.handled === !0,
      blocked: !0,
      message: String(s.message || "Ship equipment activation was blocked."),
      consequences: s.consequences
    };
    return await R(e, u, t), u;
  }
  const r = [...s.consequences], l = {
    enabled: a.enabled,
    activation: {
      ...a.activation,
      lastActivatedAt: n
    }
  };
  if (a.activation.durabilityCost > 0 && a.durability.enabled) {
    const u = Math.max(0, i.value - a.activation.durabilityCost);
    l.durability = {
      ...a.durability,
      value: u
    }, r.push(`Durability spent: ${a.activation.durabilityCost} (${u}/${i.max} remaining)`);
  }
  a.activation.resourceCost && r.push(`Resource cost: ${a.activation.resourceCost}`), a.activation.cooldown > 0 && r.push(`Cooldown started: ${a.activation.cooldown} round${a.activation.cooldown === 1 ? "" : "s"}`);
  let c = !1;
  try {
    c = !!await _(e, l, { requireGm: !1 });
  } catch (u) {
    console.warn(`${ct} | Failed to save activation consequences`, u);
  }
  !c && r.length && r.push("Consequence state could not be saved; check item permissions.");
  const d = s.handled === !0 || r.length > 0, p = {
    ok: !0,
    handled: d,
    blocked: !1,
    message: String(s.message || (d ? "Ship equipment activated." : "No system handled this ship equipment activation.")),
    consequences: r
  };
  return Hooks.callAll(`${A}.equipmentActivated`, { item: e, equipment: q(e), result: p, ...t }), await R(e, p, t), p;
}
function E() {
  const e = game.settings.get(A, ue);
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const t = {};
  for (const a of Object.values(e)) {
    const i = M(a);
    t[i.id] = i;
  }
  return t;
}
function ge() {
  return Object.values(E()).sort((e, t) => e.name.localeCompare(t.name));
}
function Be() {
  return String(game.settings.get(A, fe) || "");
}
async function we(e) {
  await game.settings.set(A, fe, e);
}
async function x(e) {
  S("save ship loadouts") && (await game.settings.set(A, ue, e), j());
}
function Y() {
  const e = game.settings.get(A, pe), t = Array.isArray(e) ? e.map((a) => String(a).trim()).filter(Boolean) : [];
  return t.length ? [...new Set(t)] : U;
}
async function le(e) {
  var i;
  const t = String(e || "").trim();
  if (!t || !((i = game.user) != null && i.isGM)) return;
  const a = Y();
  a.some((n) => n.toLowerCase() === t.toLowerCase()) || await game.settings.set(A, pe, [...a, t]);
}
function y() {
  const e = ge();
  if (!e.length) return null;
  if (!L || !e.some((t) => t.id === L)) {
    const t = Be();
    L = e.some((a) => a.id === t) ? t : e[0].id;
  }
  return e.find((t) => t.id === L) ?? null;
}
function te(e = L) {
  const t = E()[e];
  return t ? M(t) : null;
}
async function Ne() {
  if (!S("create ship profiles")) return null;
  const e = M({
    id: C("ship"),
    name: "New Ship",
    shipClass: "",
    image: K,
    powerCapacity: 0,
    stats: [
      O({ id: C("stat"), label: "Speed", value: "6", note: "" }),
      O({ id: C("stat"), label: "Cruise Speed", value: "4", note: "Efficient travel" }),
      O({ id: C("stat"), label: "Fuel", value: "100%", note: "" }),
      O({ id: C("stat"), label: "Defense", value: "10", note: "" }),
      O({ id: C("stat"), label: "Capacity", value: "6", note: "Crew and passengers" }),
      O({ id: C("stat"), label: "Cargo", value: "2 tons", note: "Available hold" })
    ],
    slots: U.slice(0, 4).map((a) => G({
      id: C("slot"),
      label: a,
      category: a
    }))
  }), t = P(E());
  return t[e.id] = e, L = e.id, await we(e.id), await x(t), e;
}
async function He(e, t) {
  if (!S("update ship profiles")) return null;
  const a = P(E()), i = a[e];
  if (!i) return null;
  const n = M({
    ...i,
    name: t.name,
    shipClass: t.shipClass,
    image: t.image,
    powerCapacity: t.powerCapacity,
    powerPresets: i.powerPresets,
    stats: i.stats,
    slots: i.slots
  });
  return a[e] = n, await x(a), n;
}
async function Ue(e, t) {
  var s, r;
  if (!S("save power presets")) return null;
  const a = P(E()), i = a[e];
  if (!i) return null;
  const n = [];
  for (const l of i.slots) {
    if (!l.itemUuid) continue;
    const c = await D(l.itemUuid), d = q(c);
    !d.enabled || !d.power.enabled || n.push(xe({
      slotId: l.id,
      allocated: d.power.allocated,
      online: d.power.online
    }));
  }
  if (!n.length)
    return (r = (s = ui.notifications) == null ? void 0 : s.warn) == null || r.call(s, "No powered ship equipment is currently slotted."), null;
  const o = Le({
    id: C("preset"),
    name: t,
    entries: n
  });
  return i.powerPresets = [...i.powerPresets ?? [], o], a[e] = M(i), await x(a), o;
}
async function Re(e, t) {
  var s;
  if (!S("delete power presets")) return !1;
  const a = P(E()), i = a[e];
  if (!i) return !1;
  const n = (s = i.powerPresets) == null ? void 0 : s.find((r) => r.id === t);
  return !n || !await Dialog.confirm({
    title: "Delete Power Preset",
    content: `<p>Delete <strong>${w(n.name)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (i.powerPresets = i.powerPresets.filter((r) => r.id !== t), a[e] = M(i), await x(a), !0);
}
async function ft(e, t) {
  const a = [];
  let i = 0, n = 0, o = 0, s = 0, r = 0, l = 0;
  for (const c of t.entries) {
    const d = e.slots.find((g) => g.id === c.slotId), p = await D((d == null ? void 0 : d.itemUuid) ?? ""), u = q(p);
    if (!d || !p || !u.enabled || !u.power.enabled) {
      n += 1;
      continue;
    }
    const f = u.power.online, m = Math.max(0, u.power.allocated), h = Math.max(0, c.allocated);
    o += f ? m : 0, s += c.online ? h : 0, c.online ? r += 1 : l += 1, i += 1, (m !== h || f !== c.online) && a.push({
      slotId: d.id,
      itemName: String(p.name ?? "Ship Equipment"),
      slotLabel: d.label,
      currentText: `${f ? "Online" : "Offline"} / ${m}`,
      targetText: `${c.online ? "Online" : "Offline"} / ${h}`,
      stateClass: c.online ? "is-ready" : "is-offline"
    });
  }
  return { changes: a, appliedCount: i, missingCount: n, currentAllocated: o, targetAllocated: s, onlineCount: r, offlineCount: l };
}
async function mt(e, t) {
  var n, o;
  const a = await ft(e, t);
  if (!a.appliedCount)
    return (o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, "That preset did not match any powered slotted equipment."), !1;
  const i = a.changes.length ? a.changes.map((s) => `
      <article class="hd-preset-preview-row ${s.stateClass}">
        <strong>${w(s.itemName)}</strong>
        <small>${w(s.slotLabel)}</small>
        <span>${w(s.currentText)} -> ${w(s.targetText)}</span>
      </article>
    `).join("") : '<p class="hd-muted">This preset already matches the current allocation.</p>';
  return Dialog.confirm({
    title: `Apply ${w(t.name)}`,
    content: `
      <section class="hd-preset-preview">
        <div class="hd-preset-preview-summary">
          <article><span>Systems</span><strong>${a.appliedCount}</strong></article>
          <article><span>Target</span><strong>${a.targetAllocated}</strong></article>
          <article><span>Online</span><strong>${a.onlineCount}/${a.appliedCount}</strong></article>
        </div>
        ${a.missingCount ? `<p class="hd-muted">${a.missingCount} saved ${a.missingCount === 1 ? "entry no longer matches" : "entries no longer match"} installed powered equipment.</p>` : ""}
        <div class="hd-preset-preview-list">${i}</div>
      </section>
    `,
    defaultYes: !0
  });
}
async function ht(e, t, a) {
  var s, r;
  const i = globalThis.ChatMessage;
  if (!(i != null && i.create)) return;
  const n = t.entries.reduce((l, c) => c.online ? l + c.allocated : l, 0), o = t.entries.filter((l) => l.online).length;
  await i.create({
    user: (s = game.user) == null ? void 0 : s.id,
    speaker: ((r = i.getSpeaker) == null ? void 0 : r.call(i)) ?? {},
    content: `
      <article class="hd-chat-card is-activated">
        <header>
          <i class="fa-solid fa-sliders"></i>
          <div>
            <p class="hd-kicker">HoloDock Power Mode</p>
            <h3>${w(t.name)}</h3>
          </div>
        </header>
        <dl>
          <div><dt>Ship</dt><dd>${w(e.name)}</dd></div>
          <div><dt>Systems Applied</dt><dd>${a}</dd></div>
          <div><dt>Target Allocation</dt><dd>${n}</dd></div>
          <div><dt>Online</dt><dd>${o}/${t.entries.length}</dd></div>
        </dl>
      </article>
    `
  });
}
async function Fe(e, t) {
  var o, s, r, l;
  if (!S("apply power presets")) return !1;
  const a = te(e), i = a == null ? void 0 : a.powerPresets.find((c) => c.id === t);
  if (!a || !i || !await mt(a, i)) return !1;
  let n = 0;
  for (const c of i.entries) {
    const d = a.slots.find((f) => f.id === c.slotId), p = await D((d == null ? void 0 : d.itemUuid) ?? ""), u = q(p);
    !u.enabled || !u.power.enabled || (await _(p, {
      enabled: u.enabled,
      power: {
        ...u.power,
        allocated: c.allocated,
        online: c.online
      }
    }), n += 1);
  }
  return n ? ((l = (r = ui.notifications) == null ? void 0 : r.info) == null || l.call(r, `Applied power preset: ${i.name}`), await ht(a, i, n), j(), !0) : ((s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, "That preset did not match any powered slotted equipment."), !1);
}
async function je(e = L) {
  if (!S("delete ship profiles")) return !1;
  const t = te(e);
  if (!t || !await Dialog.confirm({
    title: "Delete Ship Profile",
    content: `<p>Delete <strong>${w(t.name)}</strong>?</p>`,
    defaultYes: !1
  })) return !1;
  const i = P(E());
  return delete i[e], L = Object.keys(i)[0] ?? "", Be() === e && await we(L), await x(i), !0;
}
async function be(e, t) {
  if (!S("edit ship statistics")) return null;
  const a = P(E()), i = a[e];
  if (!i) return null;
  const n = O(t), o = i.stats.findIndex((s) => s.id === n.id);
  return o >= 0 ? i.stats[o] = { ...i.stats[o], ...n } : i.stats.push(n), a[e] = M(i), await x(a), n;
}
async function _e(e, t) {
  if (!S("delete ship statistics")) return !1;
  const a = P(E()), i = a[e];
  if (!i) return !1;
  const n = i.stats.find((s) => s.id === t);
  return !n || !await Dialog.confirm({
    title: "Delete Ship Statistic",
    content: `<p>Delete <strong>${w(n.label)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (i.stats = i.stats.filter((s) => s.id !== t), a[e] = M(i), await x(a), !0);
}
async function Ve(e, t) {
  if (!S("edit equipment slots")) return null;
  const a = P(E()), i = a[e];
  if (!i) return null;
  const n = i.slots.findIndex((s) => s.id === t.id), o = G(n >= 0 ? { ...i.slots[n], ...t } : t);
  return n >= 0 ? i.slots[n] = o : i.slots.push(o), a[e] = M(i), await le(o.category), o.requiredCategory && await le(o.requiredCategory), await x(a), o;
}
async function Ge(e, t) {
  if (!S("delete equipment slots")) return !1;
  const a = P(E()), i = a[e];
  if (!i) return !1;
  const n = i.slots.find((s) => s.id === t);
  return !n || !await Dialog.confirm({
    title: "Delete Equipment Slot",
    content: `<p>Delete <strong>${w(n.label)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (i.slots = i.slots.filter((s) => s.id !== t), a[e] = M(i), await x(a), !0);
}
async function ce(e, t, a, i) {
  var s;
  if (!S("place equipment links")) return !1;
  const n = P(E()), o = (s = n[e]) == null ? void 0 : s.slots.find((r) => r.id === t);
  return o ? (o.anchorX = Math.min(100, Math.max(0, Number(a))), o.anchorY = Math.min(100, Math.max(0, Number(i))), await x(n), !0) : !1;
}
async function ze(e, t) {
  var n;
  if (!S("clear equipment links")) return !1;
  const a = P(E()), i = (n = a[e]) == null ? void 0 : n.slots.find((o) => o.id === t);
  return i ? (delete i.anchorX, delete i.anchorY, await x(a), !0) : !1;
}
function Ye(e) {
  const t = [];
  return e.requireShipEquipment && t.push("Ship equipment required"), e.requiredCategory && t.push(`Category: ${e.requiredCategory}`), e.requiredTags.length && t.push(`Tags: ${e.requiredTags.join(", ")}`), !e.allowUntagged && !e.requireShipEquipment && t.push("Tagged items only"), t.join(" | ");
}
function ye(e, t) {
  const a = q(t), i = !!e.requiredCategory, n = e.requiredTags.length > 0, o = e.requireShipEquipment || i || n || !e.allowUntagged;
  if (!a.enabled)
    return o ? { ok: !1, reason: "That slot only accepts HoloDock ship equipment." } : { ok: !0 };
  if (e.requiredCategory && a.category.toLowerCase() !== e.requiredCategory.toLowerCase())
    return { ok: !1, reason: `That slot requires ${e.requiredCategory} ship equipment.` };
  const s = new Set(a.tags.map((l) => l.toLowerCase())), r = e.requiredTags.filter((l) => !s.has(l.toLowerCase()));
  return r.length ? { ok: !1, reason: `That slot requires tag${r.length === 1 ? "" : "s"}: ${r.join(", ")}.` } : { ok: !0 };
}
async function ve(e, t, a) {
  var r, l, c, d, p;
  if (!S("equip items")) return !1;
  const i = await D(a);
  if (!i)
    return (l = (r = ui.notifications) == null ? void 0 : r.warn) == null || l.call(r, "Drop a regular Foundry Item onto the slot."), !1;
  const n = P(E()), o = (c = n[e]) == null ? void 0 : c.slots.find((u) => u.id === t);
  if (!o) return !1;
  const s = ye(G(o), i);
  return s.ok ? (o.itemUuid = i.uuid, await x(n), !0) : ((p = (d = ui.notifications) == null ? void 0 : d.warn) == null || p.call(d, s.reason ?? "That item is not compatible with this ship slot."), !1);
}
async function de(e, t) {
  var n;
  if (!S("remove equipped items")) return !1;
  const a = P(E()), i = (n = a[e]) == null ? void 0 : n.slots.find((o) => o.id === t);
  return i ? (delete i.itemUuid, await x(a), !0) : !1;
}
async function D(e) {
  var i;
  const t = String(e || "").trim(), a = globalThis.fromUuid;
  if (!t || typeof a != "function") return null;
  try {
    const n = await a(t);
    return (n == null ? void 0 : n.documentName) === "Item" || ((i = n == null ? void 0 : n.constructor) == null ? void 0 : i.name) === "Item" ? n : null;
  } catch (n) {
    return console.warn(`${A} | Failed to resolve item UUID "${t}".`, n), null;
  }
}
function gt(e) {
  var t, a, i;
  try {
    const n = globalThis.TextEditor ?? ((a = (t = foundry == null ? void 0 : foundry.applications) == null ? void 0 : t.ux) == null ? void 0 : a.TextEditor);
    if (n != null && n.getDragEventData) return n.getDragEventData(e);
  } catch {
  }
  try {
    return JSON.parse(((i = e.dataTransfer) == null ? void 0 : i.getData("text/plain")) || "{}");
  } catch {
    return {};
  }
}
function wt(e) {
  var a, i, n;
  const t = ((i = (a = e == null ? void 0 : e.system) == null ? void 0 : a.description) == null ? void 0 : i.value) ?? ((n = e == null ? void 0 : e.system) == null ? void 0 : n.description) ?? (e == null ? void 0 : e.description) ?? "";
  return typeof t == "string" ? t.trim() : t != null && t.value ? String(t.value).trim() : "";
}
function We(e) {
  if (!e.enabled) return "";
  const t = [`Ship Equipment: ${e.category}`];
  return e.durability.enabled && e.durability.max > 0 && t.push(`Durability ${e.durability.value}/${e.durability.max}`), e.power.enabled && e.power.draw > 0 && t.push(`Power ${e.power.allocated}/${e.power.draw} ${e.power.online ? "online" : "offline"}`), t.join(" | ");
}
function bt(e) {
  if (!e.enabled) return [];
  const t = [e.category];
  return e.activation.enabled && t.push("Activatable"), e.durability.enabled && t.push("Durability"), e.power.enabled && t.push("Power"), t;
}
function yt(e) {
  const t = e.durability, { isBroken: a, isDamaged: i, value: n, max: o } = he(e), s = e.power.enabled && !e.power.online, r = e.power.enabled && e.power.online && e.power.draw > 0 && e.power.allocated <= 0, l = e.power.enabled && e.power.online && !r && e.power.allocated < e.power.draw, c = Math.max(0, e.activation.cooldown) * 6e3, d = e.activation.lastActivatedAt + c, p = e.activation.enabled && c > 0 && e.activation.lastActivatedAt > 0 && d > Date.now(), u = p ? Math.max(1, Math.ceil((d - Date.now()) / 6e3)) : 0, f = s || r || l || p || e.activation.blockWhenBroken && a;
  return {
    ...e,
    badges: bt(e),
    tagsText: e.tags.join(", "),
    hasTags: e.tags.length > 0,
    durability: {
      ...t,
      value: n,
      max: o,
      state: a ? "Broken" : i ? "Damaged" : "Intact",
      isBroken: a,
      isDamaged: i
    },
    power: {
      ...e.power,
      state: e.power.online ? r ? "No Power" : l ? "Low Power" : "Online" : "Offline",
      allocationText: `${e.power.allocated} / ${e.power.draw}`,
      allocationPercent: e.power.draw > 0 ? Math.min(100, Math.round(e.power.allocated / e.power.draw * 100)) : 100,
      isOffline: s,
      isNoPower: r,
      isUnderpowered: l
    },
    activation: {
      ...e.activation,
      isBlocked: f,
      isCoolingDown: p,
      cooldownRemaining: u,
      blockedReason: s ? "Equipment offline" : r ? "No power allocated" : l ? "Low allocated power" : p ? `Cooling down: ${u} round${u === 1 ? "" : "s"}` : a ? "Equipment broken" : ""
    }
  };
}
function Xe(e) {
  const t = Math.max(0, v(e.powerCapacity, 0)), a = e.slots.reduce((r, l) => {
    var d, p;
    const c = (p = (d = l == null ? void 0 : l.item) == null ? void 0 : d.equipment) == null ? void 0 : p.power;
    return !(c != null && c.enabled) || c.online === !1 ? r : r + Math.max(0, v(c.allocated, c.draw ?? 0));
  }, 0), i = t > 0 ? t - a : 0, n = t > 0 ? Math.max(0, a - t) : 0, o = t > 0, s = o && a > t;
  return {
    capacity: t,
    used: a,
    remaining: i,
    overage: n,
    hasCapacity: o,
    isOverBudget: s,
    summary: o ? `${a} / ${t}` : `${a} draw`
  };
}
function vt(e, t) {
  const a = new Map(t.map((n) => [n.id, n])), i = t.filter((n) => {
    var o, s, r;
    return (r = (s = (o = n.item) == null ? void 0 : o.equipment) == null ? void 0 : s.power) == null ? void 0 : r.enabled;
  });
  return e.powerPresets.map((n) => {
    const o = n.entries.reduce((m, h) => h.online ? m + h.allocated : m, 0), s = n.entries.filter((m) => m.online).length, r = Math.max(0, n.entries.length - s);
    let l = 0, c = 0, d = 0, p = 0;
    const u = n.entries.map((m) => {
      var k, T;
      const h = a.get(m.slotId), g = (T = (k = h == null ? void 0 : h.item) == null ? void 0 : k.equipment) == null ? void 0 : T.power;
      if (!(g != null && g.enabled))
        return d += 1, null;
      l += 1;
      const b = g.allocated !== m.allocated || g.online !== m.online;
      return b && (c += 1), {
        slotId: m.slotId,
        itemName: h.item.name,
        currentText: `${g.online ? "Online" : "Offline"} / ${g.allocated}`,
        targetText: `${m.online ? "Online" : "Offline"} / ${m.allocated}`,
        changed: b,
        stateClass: m.online ? "is-ready" : "is-offline"
      };
    }).filter(Boolean).slice(0, 3);
    e.powerCapacity > 0 && (p = Math.max(0, o - e.powerCapacity));
    const f = i.length > 0 && n.entries.length === i.length && n.entries.every((m) => {
      var g, b, k;
      const h = (k = (b = (g = a.get(m.slotId)) == null ? void 0 : g.item) == null ? void 0 : b.equipment) == null ? void 0 : k.power;
      return (h == null ? void 0 : h.enabled) && h.allocated === m.allocated && h.online === m.online;
    });
    return {
      ...n,
      allocated: o,
      onlineEntries: s,
      offlineEntries: r,
      systemCount: n.entries.length,
      matchedEntries: l,
      changedEntries: c,
      missingEntries: d,
      previewChanges: u,
      hasPreviewChanges: u.length > 0,
      projectedOverage: p,
      isOverBudget: p > 0,
      summary: `${o} allocated | ${s}/${n.entries.length} online`,
      isCurrent: f
    };
  });
}
function Se(e, t) {
  const a = t.map((i) => i.toLowerCase());
  return e.filter((i) => a.some((n) => i.label.toLowerCase().includes(n)));
}
function ke(e, t) {
  return Se(e, t)[0] ?? null;
}
function F(e, t, a, i = "Unset", n = t) {
  const o = ke(e, a);
  return {
    label: t,
    value: (o == null ? void 0 : o.value) || i,
    inputValue: (o == null ? void 0 : o.value) || "",
    note: (o == null ? void 0 : o.note) || "",
    stat: o,
    statId: (o == null ? void 0 : o.id) || "",
    editLabel: (o == null ? void 0 : o.label) || n,
    isConfigured: !!o
  };
}
function Je(e, t, a, i) {
  const n = e[0] ?? null;
  return {
    label: t,
    value: (n == null ? void 0 : n.value) || "Unset",
    inputValue: (n == null ? void 0 : n.value) || "",
    note: (n == null ? void 0 : n.note) || (n ? n.label : "Add ship statistic"),
    icon: i,
    page: a,
    stateClass: n ? "is-ready" : "is-muted",
    stat: n,
    statId: (n == null ? void 0 : n.id) || "",
    editLabel: (n == null ? void 0 : n.label) || t,
    relatedStats: e.slice(1),
    hasRelatedStats: e.length > 1
  };
}
function St(e) {
  const t = ke(e, ["speed"]), a = Se(e, ["max speed", "maximum speed", "top speed", "maximum"]).filter((o) => o.id !== (t == null ? void 0 : t.id)), i = [t, ...a].filter(Boolean);
  return {
    ...Je(i, "Speed", "speed", "fa-gauge-high"),
    metrics: [
      F(e, "Cruise", ["cruise"], "Unset", "Cruise Speed"),
      F(e, "Maximum", ["max speed", "maximum speed", "top speed", "maximum"], "Unset", "Maximum Speed"),
      F(e, "Thrust", ["thrust", "acceleration"])
    ]
  };
}
function kt(e) {
  const t = ke(e, ["capacity", "occupancy"]), a = Se(e, ["passenger"]).filter((o) => o.id !== (t == null ? void 0 : t.id)), i = [t, ...a].filter(Boolean);
  return {
    ...Je(i, "Capacity", "capacity", "fa-users"),
    metrics: [
      F(e, "Crew", ["crew"]),
      F(e, "Berths", ["berth"]),
      F(e, "Cargo", ["cargo", "hold"]),
      F(e, "Life Support", ["life support", "life-support"])
    ]
  };
}
function qt(e) {
  if (e.brokenSystems > 0 || e.power.isOverBudget && e.underpoweredSystems > 0)
    return {
      level: "critical",
      label: "Critical",
      note: e.brokenSystems > 0 ? `${e.brokenSystems} broken system${e.brokenSystems === 1 ? "" : "s"}` : "Power grid failing",
      icon: "fa-triangle-exclamation"
    };
  if (e.damagedSystems > 0 || e.offlineSystems > 0 || e.underpoweredSystems > 0 || e.power.isOverBudget) {
    const t = e.damagedSystems + e.offlineSystems + e.underpoweredSystems + (e.power.isOverBudget ? 1 : 0);
    return {
      level: "compromised",
      label: "Compromised",
      note: `${t} active issue${t === 1 ? "" : "s"}`,
      icon: "fa-shield-halved"
    };
  }
  return !e.systems.length || !e.power.hasCapacity ? {
    level: "strained",
    label: "Strained",
    note: e.systems.length ? "Power capacity untracked" : "No ship systems online",
    icon: "fa-gauge-simple-low"
  } : {
    level: "nominal",
    label: "Nominal",
    note: "All tracked systems ready",
    icon: "fa-circle-check"
  };
}
function At(e) {
  const t = e.slots.length, a = e.slots.filter((m) => m.item && !m.item.missing).length, i = Math.max(0, t - a), n = e.slots.filter((m) => {
    var h, g;
    return (g = (h = m.item) == null ? void 0 : h.equipment) == null ? void 0 : g.enabled;
  }).map((m) => {
    const h = m.item.equipment, g = h.power, b = h.durability, k = b.enabled && b.isBroken, T = b.enabled && b.isDamaged, N = g.enabled && g.isOffline, W = g.enabled && g.isNoPower, Ae = g.enabled && g.isUnderpowered, Ze = h.activation.enabled, $e = k ? "Broken" : N ? "Offline" : W ? "No Power" : Ae ? "Low Power" : T ? "Damaged" : "Ready", et = `is-${$e.toLowerCase().replace(/\s+/g, "-")}`;
    return {
      slotId: m.id,
      slotLabel: m.label,
      itemName: m.item.name,
      itemImg: m.item.img,
      category: h.category,
      state: $e,
      stateClass: et,
      icon: k ? "fa-triangle-exclamation" : N ? "fa-power-off" : W ? "fa-battery-empty" : Ae ? "fa-gauge-simple-low" : T ? "fa-screwdriver-wrench" : "fa-circle-check",
      canActivate: Ze,
      activationLabel: h.activation.label,
      activationBlocked: h.activation.isBlocked,
      powerEnabled: g.enabled,
      powerDraw: g.draw,
      powerAllocated: g.allocated,
      powerAllocationText: g.allocationText,
      powerAllocationPercent: g.allocationPercent,
      powerState: g.state,
      durabilityEnabled: b.enabled,
      durabilityText: b.enabled ? `${b.value} / ${b.max}` : ""
    };
  }), o = n.filter((m) => m.state === "Broken").length, s = n.filter((m) => m.state === "Damaged").length, r = n.filter((m) => m.state === "Offline").length, l = n.filter((m) => m.state === "Low Power" || m.state === "No Power").length, c = n.filter((m) => m.powerEnabled).length, d = n.filter((m) => m.powerEnabled && m.powerState === "Online").length, p = St(e.stats), u = kt(e.stats), f = qt({ power: e.power, systems: n, brokenSystems: o, damagedSystems: s, offlineSystems: r, underpoweredSystems: l });
  return {
    totalSlots: t,
    equippedSlots: a,
    emptySlots: i,
    systems: n,
    hasSystems: n.length > 0,
    brokenSystems: o,
    damagedSystems: s,
    offlineSystems: r,
    underpoweredSystems: l,
    poweredSystems: c,
    onlineSystems: d,
    condition: f,
    hasAlerts: e.power.isOverBudget || o > 0 || s > 0 || r > 0 || l > 0,
    speed: p,
    capacity: u,
    tiles: [
      { label: "Systems", value: `${a}/${t}`, note: i ? `${i} empty` : "All slots filled", icon: "fa-layer-group", page: "systems", stateClass: i ? "is-muted" : "is-ready" },
      { label: "Power", value: e.power.summary, note: e.power.hasCapacity ? `${e.power.remaining} remaining` : "capacity untracked", icon: e.power.isOverBudget ? "fa-triangle-exclamation" : "fa-bolt", page: "power", stateClass: e.power.isOverBudget ? "is-danger" : "is-ready" },
      { label: "Online", value: `${d}/${c}`, note: l ? `${l} underpowered` : c ? "powered systems" : "No power draw", icon: "fa-power-off", page: "systems", stateClass: r || l ? "is-warning" : "is-ready" },
      { label: "Integrity", value: o ? `${o} broken` : s ? `${s} damaged` : "Nominal", note: n.length ? "ship equipment" : "No systems", icon: o ? "fa-triangle-exclamation" : "fa-shield-halved", page: "damage", stateClass: o ? "is-danger" : s ? "is-warning" : "is-ready" },
      p,
      u
    ]
  };
}
function $t(e) {
  var a;
  const t = /* @__PURE__ */ new Map();
  for (const i of e) {
    const n = String(i.category || "Unassigned");
    t.has(n) || t.set(n, []), (a = t.get(n)) == null || a.push({
      ...i,
      isSelectedEquipment: i.id === I
    });
  }
  return Array.from(t.entries()).map(([i, n]) => ({
    category: i,
    count: n.length,
    equippedCount: n.filter((o) => o.item && !o.item.missing).length,
    slots: n
  }));
}
function Et(e) {
  const t = e.filter((a) => a.item);
  return t.length ? ((!I || !t.some((a) => a.id === I)) && (I = t[0].id), t.find((a) => a.id === I) ?? null) : (I = "", null);
}
function Ct(e, t) {
  const a = e.filter((i) => {
    var n, o, s;
    return (s = (o = (n = i.item) == null ? void 0 : n.equipment) == null ? void 0 : o.power) == null ? void 0 : s.enabled;
  }).map((i) => {
    const n = i.item.equipment.power;
    return {
      slotId: i.id,
      label: i.label,
      itemName: i.item.name,
      category: i.category,
      allocated: n.allocated,
      draw: n.draw,
      allocationText: n.allocationText,
      allocationPercent: n.allocationPercent,
      state: n.state,
      isOffline: n.isOffline,
      isNoPower: n.isNoPower,
      isUnderpowered: n.isUnderpowered
    };
  });
  return {
    nodes: a,
    hasNodes: a.length > 0,
    reactorLabel: t.hasCapacity ? `${t.used} / ${t.capacity}` : `${t.used} allocated`
  };
}
async function Tt(e) {
  const t = Number.isFinite(e.anchorX) && Number.isFinite(e.anchorY), a = Ye(e), i = {
    ...e,
    hasAnchor: t,
    compatibilitySummary: a,
    hasCompatibilityRules: !!a
  };
  if (!e.itemUuid) return { ...i, item: null };
  const n = await D(e.itemUuid);
  if (!n)
    return {
      ...i,
      item: {
        name: "Missing Item",
        img: "icons/svg/hazard.svg",
        status: "Stored UUID no longer resolves",
        missing: !0
      }
    };
  const o = q(n), s = We(o), r = yt(o), l = r.durability.isBroken ? "is-broken" : r.power.isOffline ? "is-offline" : r.power.isNoPower ? "is-no-power" : r.power.isUnderpowered ? "is-low-power" : r.durability.isDamaged ? "is-damaged" : r.enabled ? "is-online" : "is-untagged";
  return {
    ...i,
    item: {
      name: n.name ?? "Unnamed Item",
      img: n.img || "icons/svg/item-bag.svg",
      status: s,
      description: wt(n),
      uuid: n.uuid,
      equipment: r
    },
    pinStateClass: l,
    statusClass: l,
    statusLabel: r.durability.isBroken ? "Broken" : r.power.state || r.durability.state
  };
}
async function Dt() {
  var n, o, s;
  const e = y();
  let t = null;
  if (e) {
    const r = await Promise.all(e.slots.map(Tt)), l = Xe({ ...e, slots: r }), c = At({ slots: r, power: l, stats: e.stats }), d = new Set([
      (n = c.speed.stat) == null ? void 0 : n.id,
      (o = c.capacity.stat) == null ? void 0 : o.id,
      ...c.speed.relatedStats.map((f) => f.id),
      ...c.capacity.relatedStats.map((f) => f.id),
      ...c.speed.metrics.map((f) => {
        var m;
        return (m = f.stat) == null ? void 0 : m.id;
      }),
      ...c.capacity.metrics.map((f) => {
        var m;
        return (m = f.stat) == null ? void 0 : m.id;
      })
    ].filter(Boolean));
    c.tiles = c.tiles.map((f) => ({
      ...f,
      isActive: f.page === $ || f.page === "systems" && $ === "equipment" && f.label === "Systems"
    }));
    const p = Et(r), u = r.map((f) => ({
      ...f,
      isSelectedEquipment: f.id === I
    }));
    t = {
      ...e,
      slots: u,
      power: l,
      powerPresets: vt(e, r),
      hasPowerPresets: e.powerPresets.length > 0,
      dashboard: c,
      additionalStats: e.stats.filter((f) => !d.has(f.id)),
      hasAdditionalStats: e.stats.some((f) => !d.has(f.id)),
      equipmentCategories: $t(u),
      selectedEquipmentSlot: p,
      hasSelectedEquipment: !!p,
      powerGrid: Ct(r, l)
    };
  }
  const a = ge().map((r) => ({
    ...r,
    isSelected: r.id === L
  }));
  return !new Set(re.map((r) => r.id)).has($) && $ !== "equipment" && ($ = "overview"), {
    canEdit: ((s = game.user) == null ? void 0 : s.isGM) === !0,
    hasProfiles: a.length > 0,
    profiles: a,
    selectedProfile: t,
    pages: re.map((r) => ({
      ...r,
      isActive: r.id === $
    })),
    activePage: $,
    isOverview: $ === "overview",
    isSystems: $ === "systems",
    isEquipment: $ === "equipment",
    isPower: $ === "power",
    isDamage: $ === "damage",
    isSpeed: $ === "speed",
    isCapacity: $ === "capacity",
    categories: Y()
  };
}
function ee(e, t = null) {
  var a;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (a = e == null ? void 0 : e.element) != null && a[0] ? e.element[0] : (e == null ? void 0 : e.element) ?? null;
}
function j() {
  B != null && B.rendered && B.render(!0);
}
function qe(e) {
  var i, n;
  const t = (e == null ? void 0 : e[0]) ?? e, a = ((i = t == null ? void 0 : t.querySelector) == null ? void 0 : i.call(t, "form")) ?? ((n = t == null ? void 0 : t.closest) == null ? void 0 : n.call(t, "form"));
  return Object.fromEntries(new FormData(a).entries());
}
function Pt(e) {
  var n, o;
  const t = (e == null ? void 0 : e[0]) ?? e, a = ((n = t == null ? void 0 : t.querySelector) == null ? void 0 : n.call(t, "form")) ?? ((o = t == null ? void 0 : t.closest) == null ? void 0 : o.call(t, "form")), i = new FormData(a);
  return {
    id: String(i.get("id") || ""),
    label: String(i.get("label") || ""),
    category: String(i.get("category") || ""),
    description: String(i.get("description") || ""),
    requireShipEquipment: H(i, "requireShipEquipment"),
    requiredCategory: String(i.get("requiredCategory") || ""),
    requiredTags: Ie(i.get("requiredTags")),
    allowUntagged: H(i, "allowUntagged")
  };
}
function Te(e = {}) {
  if (!S("edit equipment slots")) return;
  const t = y();
  if (!t) return;
  const a = G({ label: "New Slot", category: U[0], ...e }), i = Y().map((n) => `<option value="${w(n)}">`).join("");
  new Dialog({
    title: e.id ? "Edit Equipment Slot" : "Add Equipment Slot",
    content: `
      <form class="hd-dialog-form">
        <input type="hidden" name="id" value="${w(a.id)}">
        <label>
          <span>Slot Label</span>
          <input type="text" name="label" value="${w(a.label)}">
        </label>
        <label>
          <span>Category</span>
          <input type="text" name="category" value="${w(a.category)}" list="hd-slot-categories">
          <datalist id="hd-slot-categories">${i}</datalist>
        </label>
        <label>
          <span>Description</span>
          <textarea name="description" rows="4">${w(a.description)}</textarea>
        </label>
        <fieldset>
          <legend>Compatibility</legend>
          <label class="hd-check">
            <input type="checkbox" name="requireShipEquipment" ${Ce(a.requireShipEquipment)}>
            <span>Require HoloDock ship equipment</span>
          </label>
          <label class="hd-check">
            <input type="checkbox" name="allowUntagged" ${Ce(a.allowUntagged)}>
            <span>Allow untagged items when no category or tag rule is set</span>
          </label>
          <label>
            <span>Required Ship Equipment Category</span>
            <input type="text" name="requiredCategory" value="${w(a.requiredCategory)}" list="hd-slot-categories" placeholder="Optional">
          </label>
          <label>
            <span>Required Tags</span>
            <input type="text" name="requiredTags" value="${w(a.requiredTags.join(", "))}" placeholder="turret, external">
          </label>
        </fieldset>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (n) => Ve(t.id, Pt(n))
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
function ae(e = {}) {
  if (!S("edit ship statistics")) return;
  const t = y();
  if (!t) return;
  const a = O({ label: "New Statistic", ...e });
  new Dialog({
    title: e.id ? "Edit Ship Statistic" : "Add Ship Statistic",
    content: `
      <form class="hd-dialog-form">
        <input type="hidden" name="id" value="${w(a.id)}">
        <label>
          <span>Label</span>
          <input type="text" name="label" value="${w(a.label)}">
        </label>
        <label>
          <span>Value</span>
          <input type="text" name="value" value="${w(a.value)}">
        </label>
        <label>
          <span>Note</span>
          <textarea name="note" rows="3">${w(a.note)}</textarea>
        </label>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (i) => be(t.id, qe(i))
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
function xt() {
  if (!S("save power presets")) return;
  const e = y();
  e && new Dialog({
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
        callback: (t) => {
          const a = qe(t);
          return Ue(e.id, a.name || "Power Mode");
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
  }).render(!0);
}
function H(e, t) {
  return e.get(t) === "on";
}
function Lt(e) {
  var o, s;
  const t = (e == null ? void 0 : e[0]) ?? e, a = ((o = t == null ? void 0 : t.querySelector) == null ? void 0 : o.call(t, "form")) ?? ((s = t == null ? void 0 : t.closest) == null ? void 0 : s.call(t, "form")), i = new FormData(a), n = String(i.get("tags") || "").split(",").map((r) => r.trim()).filter(Boolean);
  return me({
    enabled: H(i, "enabled"),
    category: String(i.get("category") || ""),
    tags: n,
    activation: {
      enabled: H(i, "activation.enabled"),
      label: String(i.get("activation.label") || ""),
      actionType: String(i.get("activation.actionType") || ""),
      cooldown: v(i.get("activation.cooldown"), 0),
      resourceCost: String(i.get("activation.resourceCost") || ""),
      durabilityCost: v(i.get("activation.durabilityCost"), 0),
      blockWhenBroken: H(i, "activation.blockWhenBroken")
    },
    durability: {
      enabled: H(i, "durability.enabled"),
      value: v(i.get("durability.value"), 0),
      max: v(i.get("durability.max"), 0),
      brokenAt: v(i.get("durability.brokenAt"), 0)
    },
    power: {
      enabled: H(i, "power.enabled"),
      draw: v(i.get("power.draw"), 0),
      allocated: v(i.get("power.allocated"), v(i.get("power.draw"), 0)),
      online: H(i, "power.online")
    }
  });
}
function V(e) {
  if (!S("tag ship equipment") || !e) return;
  const t = q(e), a = Y().map((n) => `<option value="${w(n)}">`).join(""), i = (n) => n ? "checked" : "";
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
          <input type="text" name="category" value="${w(t.category)}" list="hd-equipment-categories">
          <datalist id="hd-equipment-categories">${a}</datalist>
        </label>
        <label>
          <span>Tags</span>
          <input type="text" name="tags" value="${w(t.tags.join(", "))}" placeholder="turret, external, sensor">
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
              <input type="text" name="activation.label" value="${w(t.activation.label)}">
            </label>
            <label>
              <span>Action Type</span>
              <input type="text" name="activation.actionType" value="${w(t.activation.actionType)}" placeholder="attack, scan, repair">
            </label>
            <label>
              <span>Cooldown</span>
              <input type="number" min="0" step="1" name="activation.cooldown" value="${t.activation.cooldown}">
            </label>
            <label>
              <span>Resource Cost</span>
              <input type="text" name="activation.resourceCost" value="${w(t.activation.resourceCost)}">
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
        callback: (n) => _(e, Lt(n))
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
function It(e) {
  if (!S("edit ship equipment durability")) return;
  const t = q(e);
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
        callback: (a) => {
          const i = qe(a);
          return Z(e, v(i.value, t.durability.value));
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
function Mt() {
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
function Ot(e) {
  return Mt().filter((t) => {
    var a;
    return (t == null ? void 0 : t.documentName) === "Item" || ((a = t == null ? void 0 : t.constructor) == null ? void 0 : a.name) === "Item";
  }).map((t) => {
    const a = q(t), i = ye(e, t);
    return {
      id: String(t.id ?? t.uuid ?? C("item")),
      uuid: String(t.uuid ?? ""),
      name: String(t.name ?? "Unnamed Item"),
      img: String(t.img || "icons/svg/item-bag.svg"),
      type: String(t.type || "Item"),
      status: We(a),
      compatible: i.ok,
      reason: i.reason ?? "",
      shipEquipment: a.enabled,
      category: a.enabled ? a.category : "",
      tagsText: a.tags.join(", ")
    };
  }).filter((t) => t.uuid).sort((t, a) => t.compatible !== a.compatible ? t.compatible ? -1 : 1 : t.shipEquipment !== a.shipEquipment ? t.shipEquipment ? -1 : 1 : t.name.localeCompare(a.name));
}
function De(e) {
  return `
    <button type="button" class="hd-equipment-pick ${e.compatible ? "" : "is-incompatible"}" data-hd-pick-item="${w(e.uuid)}">
      <img src="${w(e.img)}" alt="">
      <span>
        <strong>${w(e.name)}</strong>
        ${e.status ? `<small>${w(e.status)}</small>` : ""}
        ${e.tagsText ? `<em>${w(e.tagsText)}</em>` : ""}
        ${e.reason ? `<em>${w(e.reason)}</em>` : ""}
      </span>
    </button>
  `;
}
function Bt(e, t) {
  if (!S("equip items")) return;
  const a = te(e), i = a == null ? void 0 : a.slots.find((c) => c.id === t);
  if (!a || !i) return;
  const n = G(i), o = Ot(n), s = o.filter((c) => c.compatible), r = o.filter((c) => !c.compatible), l = new Dialog({
    title: `Choose Equipment: ${i.label}`,
    content: `
      <section class="hd-equipment-browser">
        <p class="hd-muted">${w(Ye(n) || "No slot compatibility rules set.")}</p>
        <div class="hd-equipment-pick-list">
          ${s.length ? s.map(De).join("") : '<p class="hd-muted">No compatible world items found.</p>'}
        </div>
        ${r.length ? `
          <details class="hd-incompatible-equipment">
            <summary>${r.length} incompatible item${r.length === 1 ? "" : "s"}</summary>
            <div class="hd-equipment-pick-list">
              ${r.map(De).join("")}
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
  l.render(!0), window.setTimeout(() => {
    const c = ee(l);
    c == null || c.querySelectorAll("[data-hd-pick-item]").forEach((d) => {
      d.addEventListener("click", async () => {
        const p = d.dataset.hdPickItem ?? "";
        await ve(a.id, i.id, p) && l.close();
      });
    });
  }, 0);
}
function ie(e) {
  var a, i, n;
  const t = [
    e == null ? void 0 : e.document,
    e == null ? void 0 : e.item,
    e == null ? void 0 : e.object,
    e == null ? void 0 : e._document,
    (a = e == null ? void 0 : e.options) == null ? void 0 : a.document
  ];
  for (const o of t) {
    if (!o) continue;
    const s = o.documentName ?? ((i = o.constructor) == null ? void 0 : i.documentName), r = String(((n = o.constructor) == null ? void 0 : n.name) ?? "");
    if (s === "Item" || r.includes("Item") && o.type !== void 0 && o.setFlag && o.getFlag) return o;
  }
  return null;
}
function J(e, t) {
  var n;
  if (!((n = game.user) != null && n.isGM)) return;
  const a = ie(e);
  if (!a || !Array.isArray(t) || t.some((o) => (o == null ? void 0 : o.class) === "hd-edit-equipment" || (o == null ? void 0 : o.className) === "hd-edit-equipment")) return;
  const i = {
    label: "Ship Equipment",
    title: "HoloDock Ship Equipment",
    class: "hd-edit-equipment",
    className: "hd-edit-equipment",
    icon: "fa-solid fa-shuttle-space",
    onclick: () => V(a),
    onClick: () => V(a)
  };
  t.unshift(i);
}
function Nt(e, t) {
  var i;
  if (!((i = game.user) != null && i.isGM)) return;
  const a = ie(e);
  !a || !Array.isArray(t) || t.some((n) => (n == null ? void 0 : n.action) === "holodockShipEquipment" || (n == null ? void 0 : n.class) === "hd-edit-equipment") || t.unshift({
    action: "holodockShipEquipment",
    label: "Ship Equipment",
    title: "HoloDock Ship Equipment",
    icon: "fa-solid fa-shuttle-space",
    class: "hd-edit-equipment",
    visible: !0,
    ownership: "OWNER",
    onClick: () => V(a),
    onclick: () => V(a)
  });
}
function Qe(e, t = null) {
  var r, l, c, d, p, u, f;
  const a = ee(null, t), i = ((r = e == null ? void 0 : e.element) == null ? void 0 : r[0]) ?? (e == null ? void 0 : e.element) ?? ((l = e == null ? void 0 : e._element) == null ? void 0 : l[0]) ?? (e == null ? void 0 : e._element), n = ((c = e == null ? void 0 : e.window) == null ? void 0 : c.element) ?? ((d = e == null ? void 0 : e.window) == null ? void 0 : d.frame), o = e != null && e.id && ((p = globalThis.CSS) != null && p.escape) ? CSS.escape(e.id) : "", s = [
    n,
    (u = i == null ? void 0 : i.closest) == null ? void 0 : u.call(i, ".application, .app, .window-app"),
    i,
    (f = a == null ? void 0 : a.closest) == null ? void 0 : f.call(a, ".application, .app, .window-app"),
    e != null && e.id ? document.getElementById(e.id) : null,
    o ? document.querySelector(`#${o}`) : null,
    e != null && e.appId ? document.querySelector(`[data-appid="${e.appId}"], [data-application-id="${e.appId}"]`) : null
  ];
  for (const m of s)
    if (m instanceof HTMLElement) return m;
  return null;
}
function Q(e, t = null) {
  var l;
  if (!((l = game.user) != null && l.isGM)) return;
  const a = ie(e);
  if (!a) return;
  const i = Qe(e, t);
  if (!i || i.querySelector(".hd-edit-equipment, [data-hd-edit-equipment]")) return;
  const n = i.querySelector(".window-header, header.window-header, .app-header, header");
  if (!n) return;
  const o = document.createElement("button");
  o.type = "button", o.className = "hd-edit-equipment hd-item-sheet-header-fallback", o.dataset.hdEditEquipment = "true", o.title = "HoloDock Ship Equipment", o.innerHTML = '<i class="fa-solid fa-shuttle-space"></i><span class="sr-only">Ship Equipment</span>', o.addEventListener("click", (c) => {
    c.preventDefault(), V(a);
  });
  const s = n.querySelector(".window-controls, .header-controls, .window-header-buttons, .window-buttons, menu"), r = n.querySelector(".close, [data-action='close']");
  s ? s.prepend(o) : r ? n.insertBefore(o, r) : n.append(o);
}
function Ht(e, t = null) {
  Q(e, t), window.setTimeout(() => Q(e, t), 0), window.setTimeout(() => Q(e, t), 100), window.setTimeout(() => Q(e, t), 300);
}
function z(e, t = null) {
  Ht(e, t);
  const a = Qe(e, t), i = ie(e);
  !a || !i || a.dataset.hdEquipmentHeaderListener === "true" || (a.dataset.hdEquipmentHeaderListener = "true", a.addEventListener("click", (n) => {
    var s, r;
    (r = (s = n.target) == null ? void 0 : s.closest) != null && r.call(s, "[data-action='holodockShipEquipment'], .hd-edit-equipment") && (n.preventDefault(), V(i));
  }));
}
class Ut extends ut {
  constructor() {
    super(...arguments);
    X(this, "linkingSlotId", "");
    X(this, "linkResizeObserver");
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holodock",
      title: "HoloDock - Ship Loadout",
      classes: ["holodock-window"],
      template: Pe,
      popOut: !0,
      resizable: !0,
      width: 1280,
      height: 820
    });
  }
  async getData() {
    return Dt();
  }
  activateListeners(a) {
    var n, o;
    super.activateListeners(a);
    const i = ee(this, a);
    i && ((n = i.querySelector("[data-hd-profile-select]")) == null || n.addEventListener("change", (s) => {
      L = s.currentTarget.value, I = "", we(L).finally(() => this.render(!0));
    }), i.querySelectorAll("[data-hd-page]").forEach((s) => {
      s.addEventListener("click", (r) => {
        const l = r.currentTarget.dataset.hdPage ?? "overview";
        re.some((c) => c.id === l) && ($ = l, this.render(!0));
      });
    }), i.querySelectorAll("[data-hd-select-equipment]").forEach((s) => {
      s.addEventListener("click", (r) => {
        I = r.currentTarget.dataset.hdSelectEquipment ?? "", $ = "equipment", this.render(!0);
      });
    }), (o = i.querySelector("[data-hd-profile-form]")) == null || o.addEventListener("submit", async (s) => {
      s.preventDefault();
      const r = y();
      if (!r) return;
      const l = Object.fromEntries(new FormData(s.currentTarget).entries());
      await He(r.id, l);
    }), i.querySelectorAll("[data-hd-action]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        const l = r.currentTarget.dataset.hdAction, c = y();
        l === "create-profile" && await Ne(), l === "delete-profile" && await je(c == null ? void 0 : c.id), l === "create-slot" && Te(), l === "create-stat" && ae(), l === "browse-image" && this.browseShipImage(), l === "save-power-preset" && xt();
      });
    }), i.querySelectorAll("[data-hd-apply-power-preset]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        const l = y(), c = r.currentTarget.dataset.hdApplyPowerPreset ?? "";
        l && await Fe(l.id, c);
      });
    }), i.querySelectorAll("[data-hd-delete-power-preset]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        const l = y(), c = r.currentTarget.dataset.hdDeletePowerPreset ?? "";
        l && await Re(l.id, c);
      });
    }), i.querySelectorAll("[data-hd-edit-stat]").forEach((s) => {
      s.addEventListener("click", (r) => {
        const l = y(), c = l == null ? void 0 : l.stats.find((d) => d.id === r.currentTarget.dataset.hdEditStat);
        c && ae(c);
      });
    }), i.querySelectorAll("[data-hd-add-stat-label]").forEach((s) => {
      s.addEventListener("click", (r) => {
        const l = r.currentTarget.dataset.hdAddStatLabel ?? "New Statistic";
        ae({ label: l, value: "", note: "" });
      });
    }), i.querySelectorAll("[data-hd-stat-value]").forEach((s) => {
      const r = async (l) => {
        const c = y(), d = l.currentTarget;
        if (d.dataset.hdSavingValue !== "true" && c && !(!d.dataset.hdStatValue && d.value.trim() === "")) {
          d.dataset.hdSavingValue = "true";
          try {
            const p = d.dataset.hdStatNote || "", u = await be(c.id, {
              id: d.dataset.hdStatValue || void 0,
              label: d.dataset.hdStatLabel || "Ship Statistic",
              value: d.value,
              note: p === "Not configured" || p === "Add ship statistic" ? "" : p
            });
            u != null && u.id && (d.dataset.hdStatValue = u.id);
          } finally {
            delete d.dataset.hdSavingValue;
          }
        }
      };
      s.addEventListener("change", r), s.addEventListener("blur", r);
    }), i.querySelectorAll("[data-hd-delete-stat]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        const l = y(), c = r.currentTarget.dataset.hdDeleteStat ?? "";
        l && await _e(l.id, c);
      });
    }), i.querySelectorAll("[data-hd-edit-slot]").forEach((s) => {
      s.addEventListener("click", (r) => {
        const l = y(), c = l == null ? void 0 : l.slots.find((d) => d.id === r.currentTarget.dataset.hdEditSlot);
        c && Te(c);
      });
    }), i.querySelectorAll("[data-hd-delete-slot]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        const l = y(), c = r.currentTarget.dataset.hdDeleteSlot ?? "";
        l && await Ge(l.id, c);
      });
    }), i.querySelectorAll("[data-hd-browse-equipment]").forEach((s) => {
      s.addEventListener("click", (r) => {
        const l = y(), c = r.currentTarget.dataset.hdBrowseEquipment ?? "";
        l && Bt(l.id, c);
      });
    }), i.querySelectorAll("[data-hd-open-item]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        var p, u, f;
        const l = y(), c = l == null ? void 0 : l.slots.find((m) => m.id === r.currentTarget.dataset.hdOpenItem), d = await D((c == null ? void 0 : c.itemUuid) ?? "");
        (p = d == null ? void 0 : d.sheet) != null && p.render ? d.sheet.render(!0) : (f = (u = ui.notifications) == null ? void 0 : u.warn) == null || f.call(u, "That item could not be found.");
      });
    }), i.querySelectorAll("[data-hd-activate-equipment]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        var f, m, h, g, b, k, T, N;
        const l = y(), c = r.currentTarget.dataset.hdActivateEquipment ?? "", d = l == null ? void 0 : l.slots.find((W) => W.id === c), p = await D((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p || !l || !d) {
          (m = (f = ui.notifications) == null ? void 0 : f.warn) == null || m.call(f, "That ship equipment could not be found.");
          return;
        }
        const u = await Oe(p, { profile: l, slot: d });
        u.blocked || !u.ok ? (g = (h = ui.notifications) == null ? void 0 : h.warn) == null || g.call(h, u.message) : u.handled ? u.message && ((N = (T = ui.notifications) == null ? void 0 : T.info) == null || N.call(T, u.message)) : (k = (b = ui.notifications) == null ? void 0 : b.info) == null || k.call(b, u.message);
      });
    }), i.querySelectorAll("[data-hd-durability-adjust]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        var f, m;
        const l = y(), c = r.currentTarget, d = l == null ? void 0 : l.slots.find((h) => h.id === c.dataset.hdDurabilityAdjust), p = await D((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (m = (f = ui.notifications) == null ? void 0 : f.warn) == null || m.call(f, "That ship equipment could not be found.");
          return;
        }
        const u = q(p);
        !u.enabled || !u.durability.enabled || await Z(p, u.durability.value + v(c.dataset.hdDurabilityDelta, 0));
      });
    }), i.querySelectorAll("[data-hd-durability-set]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        var p, u;
        const l = y(), c = l == null ? void 0 : l.slots.find((f) => f.id === r.currentTarget.dataset.hdDurabilitySet), d = await D((c == null ? void 0 : c.itemUuid) ?? "");
        d ? It(d) : (u = (p = ui.notifications) == null ? void 0 : p.warn) == null || u.call(p, "That ship equipment could not be found.");
      });
    }), i.querySelectorAll("[data-hd-durability-value]").forEach((s) => {
      s.addEventListener("change", async (r) => {
        var u, f;
        const l = y(), c = r.currentTarget, d = l == null ? void 0 : l.slots.find((m) => m.id === c.dataset.hdDurabilityValue), p = await D((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (f = (u = ui.notifications) == null ? void 0 : u.warn) == null || f.call(u, "That ship equipment could not be found.");
          return;
        }
        await Z(p, v(c.value, 0));
      });
    }), i.querySelectorAll("[data-hd-power-toggle]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        var f, m;
        const l = y(), c = r.currentTarget, d = l == null ? void 0 : l.slots.find((h) => h.id === c.dataset.hdPowerToggle), p = await D((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (m = (f = ui.notifications) == null ? void 0 : f.warn) == null || m.call(f, "That ship equipment could not be found.");
          return;
        }
        const u = q(p);
        !u.enabled || !u.power.enabled || await Me(p, c.dataset.hdPowerOnline === "true");
      });
    }), i.querySelectorAll("[data-hd-power-adjust]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        var f, m;
        const l = y(), c = r.currentTarget, d = l == null ? void 0 : l.slots.find((h) => h.id === c.dataset.hdPowerAdjust), p = await D((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (m = (f = ui.notifications) == null ? void 0 : f.warn) == null || m.call(f, "That ship equipment could not be found.");
          return;
        }
        const u = q(p);
        !u.enabled || !u.power.enabled || await se(p, u.power.allocated + v(c.dataset.hdPowerDelta, 0));
      });
    }), i.querySelectorAll("[data-hd-power-allocation]").forEach((s) => {
      s.addEventListener("change", async (r) => {
        var u, f;
        const l = y(), c = r.currentTarget, d = l == null ? void 0 : l.slots.find((m) => m.id === c.dataset.hdPowerAllocation), p = await D((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (f = (u = ui.notifications) == null ? void 0 : u.warn) == null || f.call(u, "That ship equipment could not be found.");
          return;
        }
        await se(p, v(c.value, 0));
      });
    }), i.querySelectorAll("[data-hd-remove-item]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        const l = y(), c = r.currentTarget.dataset.hdRemoveItem ?? "";
        l && await de(l.id, c);
      });
    }), this.activateSlotDrops(i), this.activateSlotAnchors(i), window.requestAnimationFrame(() => this.syncShipLinks(i)), window.setTimeout(() => this.syncShipLinks(i), 100));
  }
  activateSlotDrops(a) {
    a.querySelectorAll("[data-hd-slot-id]").forEach((i) => {
      i.addEventListener("dragover", (n) => {
        var o;
        (o = game.user) != null && o.isGM && (n.preventDefault(), i.classList.add("is-drop-hover"));
      }), i.addEventListener("dragleave", () => i.classList.remove("is-drop-hover")), i.addEventListener("drop", async (n) => {
        var c, d, p;
        if (i.classList.remove("is-drop-hover"), !((c = game.user) != null && c.isGM)) return;
        n.preventDefault();
        const o = y(), s = i.dataset.hdSlotId ?? "", r = gt(n), l = r.uuid ?? r.documentUuid ?? r.itemUuid ?? "";
        if (!o || !l) {
          (p = (d = ui.notifications) == null ? void 0 : d.warn) == null || p.call(d, "Drop a Foundry Item onto an equipment slot.");
          return;
        }
        await ve(o.id, s, l);
      }), i.addEventListener("contextmenu", async (n) => {
        var r;
        if (!((r = game.user) != null && r.isGM)) return;
        n.preventDefault();
        const o = y(), s = i.dataset.hdSlotId ?? "";
        o && await de(o.id, s);
      });
    });
  }
  activateSlotAnchors(a) {
    var n, o, s;
    const i = a.querySelector("[data-hd-ship-map]");
    i && ((n = this.linkResizeObserver) == null || n.disconnect(), this.linkResizeObserver = void 0, typeof ResizeObserver < "u" && (this.linkResizeObserver = new ResizeObserver(() => this.syncShipLinks(a)), this.linkResizeObserver.observe(a.querySelector(".hd-stage") ?? a)), (o = a.querySelector(".hd-slot-rail")) == null || o.addEventListener("scroll", () => this.syncShipLinks(a)), (s = i.querySelector("img")) == null || s.addEventListener("load", () => this.syncShipLinks(a)), a.querySelectorAll("[data-hd-link-slot]").forEach((r) => {
      r.addEventListener("click", () => {
        var l;
        (l = game.user) != null && l.isGM && (this.linkingSlotId = r.dataset.hdLinkSlot ?? "", a.classList.toggle("is-linking-slot", !!this.linkingSlotId));
      });
    }), a.querySelectorAll("[data-hd-clear-link]").forEach((r) => {
      r.addEventListener("click", async () => {
        const l = y(), c = r.dataset.hdClearLink ?? "";
        l && await ze(l.id, c);
      });
    }), i.addEventListener("click", async (r) => {
      var p;
      if (!((p = game.user) != null && p.isGM) || !this.linkingSlotId) return;
      r.preventDefault();
      const l = y(), c = this.getImageAnchorPoint(i, r.clientX, r.clientY), d = this.linkingSlotId;
      this.linkingSlotId = "", a.classList.remove("is-linking-slot"), l && await ce(l.id, d, c.x, c.y);
    }), a.querySelectorAll("[data-hd-anchor-slot]").forEach((r) => {
      r.addEventListener("click", (l) => {
        var d;
        l.preventDefault(), l.stopPropagation();
        const c = r.dataset.hdAnchorSlot ?? "";
        !c || (d = game.user) != null && d.isGM || (I = c, $ = "equipment", this.render(!0));
      }), r.addEventListener("pointerdown", (l) => {
        var h;
        if (!((h = game.user) != null && h.isGM)) return;
        l.preventDefault();
        const c = r.dataset.hdAnchorSlot ?? "", d = l.clientX, p = l.clientY;
        let u = !1;
        const f = (g) => {
          (Math.abs(g.clientX - d) > 3 || Math.abs(g.clientY - p) > 3) && (u = !0);
          const b = this.getImageAnchorPoint(i, g.clientX, g.clientY);
          r.dataset.hdAnchorX = String(b.x), r.dataset.hdAnchorY = String(b.y), this.syncShipLinks(a);
        }, m = async (g) => {
          if (window.removeEventListener("pointermove", f), window.removeEventListener("pointerup", m), !u) {
            I = c, $ = "equipment", this.render(!0);
            return;
          }
          const b = y(), k = this.getImageAnchorPoint(i, g.clientX, g.clientY);
          b && await ce(b.id, c, k.x, k.y);
        };
        window.addEventListener("pointermove", f), window.addEventListener("pointerup", m);
      });
    }));
  }
  getImageAnchorPoint(a, i, n) {
    const o = this.getShipImageRect(a), s = Math.min(100, Math.max(0, (i - o.left) / o.width * 100)), r = Math.min(100, Math.max(0, (n - o.top) / o.height * 100));
    return { x: s, y: r };
  }
  getShipImageRect(a) {
    const i = a.querySelector("img"), n = i == null ? void 0 : i.getBoundingClientRect();
    if (n != null && n.width && (n != null && n.height) && (i != null && i.naturalWidth) && (i != null && i.naturalHeight)) {
      const o = i.naturalWidth / i.naturalHeight, s = n.width / n.height;
      if (o > s) {
        const c = n.width / o, d = n.top + (n.height - c) / 2;
        return new DOMRect(n.left, d, n.width, c);
      }
      const r = n.height * o, l = n.left + (n.width - r) / 2;
      return new DOMRect(l, n.top, r, n.height);
    }
    return n != null && n.width && (n != null && n.height) ? n : a.getBoundingClientRect();
  }
  positionSlotPins(a) {
    const i = a.querySelector("[data-hd-ship-map]");
    if (!i) return;
    const n = this.getShipImageRect(i), o = i.getBoundingClientRect();
    a.querySelectorAll("[data-hd-anchor-slot]").forEach((s) => {
      const r = Number(s.dataset.hdAnchorX), l = Number(s.dataset.hdAnchorY);
      if (!Number.isFinite(r) || !Number.isFinite(l)) return;
      const c = n.left - o.left + n.width * r / 100, d = n.top - o.top + n.height * l / 100;
      s.style.left = `${c}px`, s.style.top = `${d}px`;
    });
  }
  syncShipLinks(a) {
    this.positionSlotPins(a), this.drawSlotLinks(a);
  }
  drawSlotLinks(a) {
    const i = a.querySelector("[data-hd-link-lines]"), n = a.querySelector("[data-hd-ship-map]");
    if (!i || !n) return;
    const o = i.getBoundingClientRect(), s = Math.max(1, Math.round(o.width)), r = Math.max(1, Math.round(o.height));
    i.setAttribute("viewBox", `0 0 ${s} ${r}`), i.setAttribute("width", String(s)), i.setAttribute("height", String(r)), i.innerHTML = "", a.querySelectorAll("[data-hd-anchor-slot]").forEach((l) => {
      const c = l.dataset.hdAnchorSlot ?? "", d = a.querySelector(`[data-hd-slot-card="${c}"]`);
      if (!d) return;
      const p = l.getBoundingClientRect(), u = d.getBoundingClientRect(), f = p.left + p.width / 2 - o.left, m = p.top + p.height / 2 - o.top, h = u.left - o.left, g = u.top + u.height / 2 - o.top, b = Math.max(40, Math.abs(h - f) / 2), k = document.createElementNS("http://www.w3.org/2000/svg", "path");
      k.setAttribute("d", `M ${f} ${m} C ${f + b} ${m}, ${h - b} ${g}, ${h} ${g}`), k.setAttribute("class", `hd-link-line ${l.dataset.hdAnchorState || ""}`.trim()), i.append(k);
    });
  }
  browseShipImage() {
    var n, o;
    if (!S("choose ship images")) return;
    const a = ee(this), i = a == null ? void 0 : a.querySelector("[data-hd-profile-form] input[name='image']");
    if (!i || typeof FilePicker > "u") {
      (o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, "Foundry FilePicker is not available.");
      return;
    }
    new FilePicker({
      type: "image",
      current: i.value,
      callback: (s) => {
        i.value = s;
      }
    }).browse();
  }
  async close(a = {}) {
    var i;
    return (i = this.linkResizeObserver) == null || i.disconnect(), this.linkResizeObserver = void 0, B = null, super.close(a);
  }
}
async function Ke() {
  return B || (B = new Ut()), await B.render(!0), B;
}
function Rt() {
  game.settings.register(A, ue, {
    name: "HoloDock Ship Profiles",
    hint: "World-level ship profile and loadout data.",
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: j
  }), game.settings.register(A, pe, {
    name: "HoloDock Slot Categories",
    hint: "Reusable equipment slot categories for HoloDock.",
    scope: "world",
    config: !1,
    type: Array,
    default: U,
    onChange: j
  }), game.settings.register(A, fe, {
    name: "HoloDock Default Ship Profile",
    hint: "The ship profile this user opens by default.",
    scope: "client",
    config: !1,
    type: String,
    default: "",
    onChange: j
  });
}
function Ft() {
  const e = {
    open: Ke,
    getProfiles: ge,
    getProfile: te,
    createProfile: Ne,
    updateProfileMetadata: He,
    deleteProfile: je,
    capturePowerPreset: Ue,
    applyPowerPreset: Fe,
    deletePowerPreset: Re,
    upsertSlot: Ve,
    deleteSlot: Ge,
    upsertStat: be,
    deleteStat: _e,
    setSlotAnchor: ce,
    clearSlotAnchor: ze,
    equipItem: ve,
    unequipItem: de,
    getCategories: Y,
    getShipPowerBudget: Xe,
    getShipEquipmentData: q,
    isShipEquipment: pt,
    validateItemForSlot: ye,
    setShipEquipmentData: _,
    updateShipEquipmentDurability: Z,
    updateShipEquipmentPowerState: Me,
    updateShipEquipmentPowerAllocation: se,
    activateEquipment: Oe
  };
  game.holodock = e;
  const t = game.modules.get(A);
  t && (t.api = e);
}
function jt() {
  const e = game.modules.get("holosuite-core");
  return (e != null && e.active ? e.api : null) ?? game.holosuite ?? globalThis.HoloSuiteCoreApi ?? null;
}
function ne() {
  const e = jt();
  if (!(e != null && e.registerApp)) return !1;
  const t = {
    id: A,
    title: "HoloDock",
    icon: "fa-solid fa-shuttle-space",
    premium: !1,
    playerVisible: !0,
    description: "View and manage system-agnostic ship loadouts.",
    open: () => Ke()
  };
  return e.registerApp(t), !0;
}
function _t() {
  if (ne()) return;
  let e = 0;
  const t = () => {
    e += 1, !(ne() || e >= 20) && window.setTimeout(t, 250);
  };
  Hooks.once("holosuite-core.apiReady", () => ne()), window.setTimeout(t, 250);
}
Hooks.once("init", async () => {
  Rt(), Handlebars.registerHelper("hdFallback", (e, t) => e || t), await loadTemplates([Pe]);
});
Hooks.once("ready", () => {
  Ft(), Hooks.on("getApplicationHeaderButtons", J), Hooks.on("getApplicationV1HeaderButtons", J), Hooks.on("getDocumentSheetHeaderButtons", J), Hooks.on("getItemSheetHeaderButtons", J), Hooks.on("getHeaderControlsApplicationV2", Nt), Hooks.on("renderItemSheet", z), Hooks.on("renderItemSheetV2", z), Hooks.on("renderApplication", z), Hooks.on("renderApplicationV1", z), Hooks.on("renderApplicationV2", z), _t(), console.log(`${A} | Ready. API available at game.holodock.`);
});
