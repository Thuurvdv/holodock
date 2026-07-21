var Qe = Object.defineProperty;
var Ke = (e, t, n) => t in e ? Qe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var W = (e, t, n) => Ke(e, typeof t != "symbol" ? t + "" : t, n);
function Ze() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) ?? null;
}
function et() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : n.api) ?? null;
}
function tt(e = {}, t = {}) {
  var i, a, r;
  const n = ((a = (i = globalThis.foundry) == null ? void 0 : i.utils) == null ? void 0 : a.mergeObject) ?? ((r = foundry == null ? void 0 : foundry.utils) == null ? void 0 : r.mergeObject);
  return typeof n == "function" ? n(e, t, { inplace: !1 }) : { ...e, ...t };
}
function it() {
  var e, t, n, i, a;
  return ((n = (t = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : t.randomID) == null ? void 0 : n.call(t, 8)) ?? ((a = (i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.randomID) == null ? void 0 : a.call(i, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function ve(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${it()}`),
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
function nt(e) {
  return class extends e {
    constructor(i = {}) {
      const a = tt(new.target.defaultOptions ?? {}, i);
      super(ve(a));
      W(this, "_v1Options");
      this._v1Options = a;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return ve(this.defaultOptions ?? {});
    }
    activateListeners(i) {
    }
    async _renderHTML(i, a) {
      var c, d, p;
      const r = typeof this.getData == "function" ? await this.getData() : {}, s = ((c = this._v1Options) == null ? void 0 : c.template) ?? ((d = this.options) == null ? void 0 : d.template) ?? ((p = this.constructor.defaultOptions) == null ? void 0 : p.template);
      if (!s) return document.createDocumentFragment();
      const o = await globalThis.renderTemplate(s, r), l = document.createElement("template");
      return l.innerHTML = o.trim(), l.content;
    }
    _activateV1Form(i) {
      var r, s;
      if (typeof this._updateObject != "function") return;
      const a = (r = i.matches) != null && r.call(i, "form") ? i : (s = i.querySelector) == null ? void 0 : s.call(i, "form");
      a instanceof HTMLFormElement && a.addEventListener("submit", async (o) => {
        var l;
        o.preventDefault(), o.stopPropagation(), await this._updateObject(o, new FormData(a)), ((l = this._v1Options) == null ? void 0 : l.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(i, a, r) {
      var d, p, u, f;
      a.replaceChildren(i);
      const s = globalThis.jQuery ?? globalThis.$, o = ((d = a.closest) == null ? void 0 : d.call(a, ".window-app, .app, .application")) ?? a, l = s ? s(o) : o;
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
      Array.isArray(c) && c.length && (a.classList.add(...c), (f = (u = a.closest) == null ? void 0 : u.call(a, ".window-app, .app, .application")) == null || f.classList.add(...c)), this._activateV1Form(a), typeof this.activateListeners == "function" && this.activateListeners(s ? s(a) : a);
    }
  };
}
function at() {
  const e = Ze(), t = et(), n = globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (n) return n;
  const i = e == null ? void 0 : e.ApplicationV2;
  return i ? nt(i) : null;
}
const $ = "holodock", ot = "HoloDock", ce = "profiles", de = "slotCategories", ue = "defaultProfile", ne = "shipEquipment", Ce = `modules/${$}/templates/holodock.hbs`, Q = "modules/holodock/assets/SpaceshipDefault.webp", st = "icons/svg/space-station.svg", U = ["Weapons", "Defense", "Utility", "Engines", "Cargo", "Special"];
function D(e) {
  var t, n;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.deepClone ? foundry.utils.deepClone(e) : (n = foundry == null ? void 0 : foundry.utils) != null && n.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? {}));
}
function P(e = "hd") {
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
function S(e = "edit HoloDock") {
  var t, n, i;
  return (t = game.user) != null && t.isGM ? !0 : ((i = (n = ui.notifications) == null ? void 0 : n.warn) == null || i.call(n, `Only a GM can ${e}.`), !1);
}
const rt = at();
let O = null, L = "", A = "overview", I = "";
const ae = [
  { id: "overview", label: "Overview", icon: "fa-solid fa-display" },
  { id: "systems", label: "Systems", icon: "fa-solid fa-microchip" },
  { id: "power", label: "Power Grid", icon: "fa-solid fa-bolt" },
  { id: "damage", label: "Damage", icon: "fa-solid fa-shield-halved" },
  { id: "speed", label: "Speed", icon: "fa-solid fa-gauge-high" },
  { id: "capacity", label: "Capacity", icon: "fa-solid fa-users" }
];
function G(e = {}) {
  const t = Number(e.anchorX), n = Number(e.anchorY);
  return {
    id: String(e.id || P("slot")),
    label: String(e.label || "Equipment Slot").trim() || "Equipment Slot",
    category: String(e.category || U[0]).trim() || U[0],
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
function N(e = {}) {
  return {
    id: String(e.id || P("stat")),
    label: String(e.label || "Statistic").trim() || "Statistic",
    value: String(e.value || "").trim(),
    note: String(e.note || "").trim()
  };
}
function Te(e = {}) {
  return {
    slotId: String(e.slotId || "").trim(),
    allocated: Math.max(0, v(e.allocated, 0)),
    online: e.online !== !1
  };
}
function De(e = {}) {
  return {
    id: String(e.id || P("preset")),
    name: String(e.name || "Power Preset").trim() || "Power Preset",
    entries: Array.isArray(e.entries) ? e.entries.map(Te).filter((t) => t.slotId) : []
  };
}
function M(e = {}) {
  const t = String(e.image || Q).trim() || Q;
  return {
    id: String(e.id || P("ship")),
    name: String(e.name || "Party Ship").trim() || "Party Ship",
    shipClass: String(e.shipClass || "").trim(),
    image: t === st ? Q : t,
    powerCapacity: Math.max(0, v(e.powerCapacity, 0)),
    powerPresets: Array.isArray(e.powerPresets) ? e.powerPresets.map(De) : [],
    stats: Array.isArray(e.stats) ? e.stats.map(N) : [],
    slots: Array.isArray(e.slots) ? e.slots.map(G) : []
  };
}
function v(e, t = 0) {
  const n = Number(e);
  return Number.isFinite(n) ? n : t;
}
function xe(e) {
  return Array.isArray(e) ? e.map((t) => String(t).trim()).filter(Boolean) : String(e || "").split(",").map((t) => t.trim()).filter(Boolean);
}
function Se(e) {
  return e ? "checked" : "";
}
function pe(e = {}) {
  var a, r, s, o, l, c, d, p, u, f, m, h, w, b, k, C, H;
  const t = Math.max(0, v((a = e.durability) == null ? void 0 : a.max, 0)), n = Math.min(t, Math.max(0, v((r = e.durability) == null ? void 0 : r.value, t))), i = String(e.category || U[0]).trim() || U[0];
  return {
    enabled: e.enabled === !0,
    category: i,
    tags: xe(e.tags),
    activation: {
      enabled: ((s = e.activation) == null ? void 0 : s.enabled) === !0,
      label: String(((o = e.activation) == null ? void 0 : o.label) || "Activate").trim() || "Activate",
      actionType: String(((l = e.activation) == null ? void 0 : l.actionType) || "").trim(),
      cooldown: Math.max(0, v((c = e.activation) == null ? void 0 : c.cooldown, 0)),
      resourceCost: String(((d = e.activation) == null ? void 0 : d.resourceCost) || "").trim(),
      durabilityCost: Math.max(0, v((p = e.activation) == null ? void 0 : p.durabilityCost, 0)),
      blockWhenBroken: ((u = e.activation) == null ? void 0 : u.blockWhenBroken) !== !1,
      lastActivatedAt: Math.max(0, v((f = e.activation) == null ? void 0 : f.lastActivatedAt, 0))
    },
    durability: {
      enabled: ((m = e.durability) == null ? void 0 : m.enabled) === !0,
      value: n,
      max: t,
      brokenAt: Math.max(0, v((h = e.durability) == null ? void 0 : h.brokenAt, 0))
    },
    power: {
      enabled: ((w = e.power) == null ? void 0 : w.enabled) === !0,
      draw: Math.max(0, v((b = e.power) == null ? void 0 : b.draw, 0)),
      allocated: Math.max(0, v((k = e.power) == null ? void 0 : k.allocated, ((C = e.power) == null ? void 0 : C.draw) ?? 0)),
      online: ((H = e.power) == null ? void 0 : H.online) !== !1
    }
  };
}
function q(e) {
  var t;
  return pe(((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, $, ne)) ?? {});
}
function lt(e) {
  return q(e).enabled;
}
async function j(e, t, n = {}) {
  var r;
  if (n.requireGm !== !1 && !S("tag ship equipment") || !(e != null && e.setFlag)) return null;
  const i = q(e), a = pe({
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
  return a.enabled ? (await e.setFlag($, ne, a), await se(a.category), F(), a) : (await ((r = e.unsetFlag) == null ? void 0 : r.call(e, $, ne)), F(), a);
}
async function K(e, t, n = {}) {
  const i = q(e), a = Math.max(0, i.durability.max), r = Math.min(a, Math.max(0, v(t, i.durability.value)));
  return j(e, {
    enabled: i.enabled,
    durability: {
      ...i.durability,
      value: r
    }
  }, n);
}
async function Pe(e, t) {
  const n = q(e);
  return !n.enabled || !n.power.enabled ? null : j(e, {
    enabled: n.enabled,
    power: {
      ...n.power,
      online: t === !0
    }
  });
}
async function oe(e, t) {
  const n = q(e);
  return !n.enabled || !n.power.enabled ? null : j(e, {
    enabled: n.enabled,
    power: {
      ...n.power,
      allocated: Math.max(0, v(t, n.power.allocated))
    }
  });
}
function fe(e) {
  const t = e.durability, n = e.enabled && t.enabled, i = Math.max(0, t.max), a = Math.min(i, Math.max(0, t.value)), r = n && a <= t.brokenAt, s = n && !r && i > 0 && a < i;
  return { isBroken: r, isDamaged: s, value: a, max: i };
}
async function R(e, t, n = {}) {
  var d, p, u;
  const i = globalThis.ChatMessage;
  if (!(i != null && i.create)) return;
  const a = q(e), r = fe(a), s = n.slot, o = n.profile, l = t.blocked || !t.ok ? "Blocked" : t.handled ? "Activated" : "Unhandled", c = `
    <article class="hd-chat-card ${t.blocked || !t.ok ? "is-blocked" : "is-activated"}">
      <header>
        <img src="${g((e == null ? void 0 : e.img) || "icons/svg/item-bag.svg")}" alt="">
        <div>
          <p class="hd-kicker">HoloDock Activation</p>
          <h3>${g((e == null ? void 0 : e.name) ?? "Ship Equipment")}</h3>
        </div>
      </header>
      <dl>
        <div><dt>Outcome</dt><dd>${g(l)}</dd></div>
        ${o ? `<div><dt>Ship</dt><dd>${g(o.name)}</dd></div>` : ""}
        ${s ? `<div><dt>Slot</dt><dd>${g(s.label)}</dd></div>` : ""}
        ${a.activation.actionType ? `<div><dt>Action</dt><dd>${g(a.activation.actionType)}</dd></div>` : ""}
        ${a.activation.resourceCost ? `<div><dt>Resource</dt><dd>${g(a.activation.resourceCost)}</dd></div>` : ""}
        ${a.activation.cooldown ? `<div><dt>Cooldown</dt><dd>${a.activation.cooldown} rounds</dd></div>` : ""}
        ${a.durability.enabled ? `<div><dt>Durability</dt><dd>${r.value} / ${r.max}</dd></div>` : ""}
      </dl>
      ${(d = t.consequences) != null && d.length ? `<ul>${t.consequences.map((f) => `<li>${g(f)}</li>`).join("")}</ul>` : ""}
      ${t.message ? `<p>${g(t.message)}</p>` : ""}
    </article>
  `;
  await i.create({
    user: (p = game.user) == null ? void 0 : p.id,
    speaker: ((u = i.getSpeaker) == null ? void 0 : u.call(i)) ?? {},
    content: c
  });
}
async function Le(e, t = {}) {
  const n = q(e);
  if (!n.enabled || !n.activation.enabled)
    return { ok: !1, handled: !1, blocked: !0, message: "That item is not configured as activatable ship equipment." };
  if (n.power.enabled && !n.power.online) {
    const u = { ok: !1, handled: !1, blocked: !0, message: "That ship equipment is offline." };
    return await R(e, u, t), u;
  }
  if (n.power.enabled && n.power.allocated < n.power.draw) {
    const u = { ok: !1, handled: !1, blocked: !0, message: "That ship equipment does not have enough allocated power." };
    return await R(e, u, t), u;
  }
  const i = fe(n);
  if (n.activation.blockWhenBroken && i.isBroken) {
    const u = { ok: !1, handled: !1, blocked: !0, message: "That ship equipment is broken." };
    return await R(e, u, t), u;
  }
  const a = Date.now(), r = Math.max(0, n.activation.cooldown) * 6e3;
  if (r > 0 && n.activation.lastActivatedAt > 0) {
    const u = n.activation.lastActivatedAt + r;
    if (u > a) {
      const f = Math.max(1, Math.ceil((u - a) / 6e3)), m = {
        ok: !1,
        handled: !1,
        blocked: !0,
        message: `That ship equipment is cooling down for ${f} more round${f === 1 ? "" : "s"}.`,
        consequences: [`Cooldown remaining: ${f} round${f === 1 ? "" : "s"}`]
      };
      return await R(e, m, t), m;
    }
  }
  if (n.activation.durabilityCost > 0 && n.durability.enabled && i.value <= 0) {
    const u = {
      ok: !1,
      handled: !1,
      blocked: !0,
      message: "That ship equipment has no durability left to spend.",
      consequences: [`Required durability: ${n.activation.durabilityCost}`]
    };
    return await R(e, u, t), u;
  }
  const s = {
    item: e,
    equipment: n,
    durabilityState: i,
    handled: !1,
    blocked: !1,
    message: "",
    consequences: [],
    ...t
  };
  if (Hooks.callAll(`${$}.activateEquipment`, s), s.blocked) {
    const u = {
      ok: !1,
      handled: s.handled === !0,
      blocked: !0,
      message: String(s.message || "Ship equipment activation was blocked."),
      consequences: s.consequences
    };
    return await R(e, u, t), u;
  }
  const o = [...s.consequences], l = {
    enabled: n.enabled,
    activation: {
      ...n.activation,
      lastActivatedAt: a
    }
  };
  if (n.activation.durabilityCost > 0 && n.durability.enabled) {
    const u = Math.max(0, i.value - n.activation.durabilityCost);
    l.durability = {
      ...n.durability,
      value: u
    }, o.push(`Durability spent: ${n.activation.durabilityCost} (${u}/${i.max} remaining)`);
  }
  n.activation.resourceCost && o.push(`Resource cost: ${n.activation.resourceCost}`), n.activation.cooldown > 0 && o.push(`Cooldown started: ${n.activation.cooldown} round${n.activation.cooldown === 1 ? "" : "s"}`);
  let c = !1;
  try {
    c = !!await j(e, l, { requireGm: !1 });
  } catch (u) {
    console.warn(`${ot} | Failed to save activation consequences`, u);
  }
  !c && o.length && o.push("Consequence state could not be saved; check item permissions.");
  const d = s.handled === !0 || o.length > 0, p = {
    ok: !0,
    handled: d,
    blocked: !1,
    message: String(s.message || (d ? "Ship equipment activated." : "No system handled this ship equipment activation.")),
    consequences: o
  };
  return Hooks.callAll(`${$}.equipmentActivated`, { item: e, equipment: q(e), result: p, ...t }), await R(e, p, t), p;
}
function E() {
  const e = game.settings.get($, ce);
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const t = {};
  for (const n of Object.values(e)) {
    const i = M(n);
    t[i.id] = i;
  }
  return t;
}
function me() {
  return Object.values(E()).sort((e, t) => e.name.localeCompare(t.name));
}
function Ie() {
  return String(game.settings.get($, ue) || "");
}
async function he(e) {
  await game.settings.set($, ue, e);
}
async function x(e) {
  S("save ship loadouts") && (await game.settings.set($, ce, e), F());
}
function V() {
  const e = game.settings.get($, de), t = Array.isArray(e) ? e.map((n) => String(n).trim()).filter(Boolean) : [];
  return t.length ? [...new Set(t)] : U;
}
async function se(e) {
  var i;
  const t = String(e || "").trim();
  if (!t || !((i = game.user) != null && i.isGM)) return;
  const n = V();
  n.some((a) => a.toLowerCase() === t.toLowerCase()) || await game.settings.set($, de, [...n, t]);
}
function y() {
  const e = me();
  if (!e.length) return null;
  if (!L || !e.some((t) => t.id === L)) {
    const t = Ie();
    L = e.some((n) => n.id === t) ? t : e[0].id;
  }
  return e.find((t) => t.id === L) ?? null;
}
function ee(e = L) {
  const t = E()[e];
  return t ? M(t) : null;
}
async function Me() {
  if (!S("create ship profiles")) return null;
  const e = M({
    id: P("ship"),
    name: "New Ship",
    shipClass: "",
    image: Q,
    powerCapacity: 0,
    stats: [
      N({ id: P("stat"), label: "Speed", value: "6", note: "" }),
      N({ id: P("stat"), label: "Fuel", value: "100%", note: "" }),
      N({ id: P("stat"), label: "Defense", value: "10", note: "" }),
      N({ id: P("stat"), label: "Capacity", value: "6", note: "Crew and passengers" })
    ],
    slots: U.slice(0, 4).map((n) => G({
      id: P("slot"),
      label: n,
      category: n
    }))
  }), t = D(E());
  return t[e.id] = e, L = e.id, await he(e.id), await x(t), e;
}
async function Oe(e, t) {
  if (!S("update ship profiles")) return null;
  const n = D(E()), i = n[e];
  if (!i) return null;
  const a = M({
    ...i,
    name: t.name,
    shipClass: t.shipClass,
    image: t.image,
    powerCapacity: t.powerCapacity,
    powerPresets: i.powerPresets,
    stats: i.stats,
    slots: i.slots
  });
  return n[e] = a, await x(n), a;
}
async function He(e, t) {
  var s, o;
  if (!S("save power presets")) return null;
  const n = D(E()), i = n[e];
  if (!i) return null;
  const a = [];
  for (const l of i.slots) {
    if (!l.itemUuid) continue;
    const c = await T(l.itemUuid), d = q(c);
    !d.enabled || !d.power.enabled || a.push(Te({
      slotId: l.id,
      allocated: d.power.allocated,
      online: d.power.online
    }));
  }
  if (!a.length)
    return (o = (s = ui.notifications) == null ? void 0 : s.warn) == null || o.call(s, "No powered ship equipment is currently slotted."), null;
  const r = De({
    id: P("preset"),
    name: t,
    entries: a
  });
  return i.powerPresets = [...i.powerPresets ?? [], r], n[e] = M(i), await x(n), r;
}
async function Be(e, t) {
  var s;
  if (!S("delete power presets")) return !1;
  const n = D(E()), i = n[e];
  if (!i) return !1;
  const a = (s = i.powerPresets) == null ? void 0 : s.find((o) => o.id === t);
  return !a || !await Dialog.confirm({
    title: "Delete Power Preset",
    content: `<p>Delete <strong>${g(a.name)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (i.powerPresets = i.powerPresets.filter((o) => o.id !== t), n[e] = M(i), await x(n), !0);
}
async function ct(e, t) {
  const n = [];
  let i = 0, a = 0, r = 0, s = 0, o = 0, l = 0;
  for (const c of t.entries) {
    const d = e.slots.find((w) => w.id === c.slotId), p = await T((d == null ? void 0 : d.itemUuid) ?? ""), u = q(p);
    if (!d || !p || !u.enabled || !u.power.enabled) {
      a += 1;
      continue;
    }
    const f = u.power.online, m = Math.max(0, u.power.allocated), h = Math.max(0, c.allocated);
    r += f ? m : 0, s += c.online ? h : 0, c.online ? o += 1 : l += 1, i += 1, (m !== h || f !== c.online) && n.push({
      slotId: d.id,
      itemName: String(p.name ?? "Ship Equipment"),
      slotLabel: d.label,
      currentText: `${f ? "Online" : "Offline"} / ${m}`,
      targetText: `${c.online ? "Online" : "Offline"} / ${h}`,
      stateClass: c.online ? "is-ready" : "is-offline"
    });
  }
  return { changes: n, appliedCount: i, missingCount: a, currentAllocated: r, targetAllocated: s, onlineCount: o, offlineCount: l };
}
async function dt(e, t) {
  var a, r;
  const n = await ct(e, t);
  if (!n.appliedCount)
    return (r = (a = ui.notifications) == null ? void 0 : a.warn) == null || r.call(a, "That preset did not match any powered slotted equipment."), !1;
  const i = n.changes.length ? n.changes.map((s) => `
      <article class="hd-preset-preview-row ${s.stateClass}">
        <strong>${g(s.itemName)}</strong>
        <small>${g(s.slotLabel)}</small>
        <span>${g(s.currentText)} -> ${g(s.targetText)}</span>
      </article>
    `).join("") : '<p class="hd-muted">This preset already matches the current allocation.</p>';
  return Dialog.confirm({
    title: `Apply ${g(t.name)}`,
    content: `
      <section class="hd-preset-preview">
        <div class="hd-preset-preview-summary">
          <article><span>Systems</span><strong>${n.appliedCount}</strong></article>
          <article><span>Target</span><strong>${n.targetAllocated}</strong></article>
          <article><span>Online</span><strong>${n.onlineCount}/${n.appliedCount}</strong></article>
        </div>
        ${n.missingCount ? `<p class="hd-muted">${n.missingCount} saved ${n.missingCount === 1 ? "entry no longer matches" : "entries no longer match"} installed powered equipment.</p>` : ""}
        <div class="hd-preset-preview-list">${i}</div>
      </section>
    `,
    defaultYes: !0
  });
}
async function ut(e, t, n) {
  var s, o;
  const i = globalThis.ChatMessage;
  if (!(i != null && i.create)) return;
  const a = t.entries.reduce((l, c) => c.online ? l + c.allocated : l, 0), r = t.entries.filter((l) => l.online).length;
  await i.create({
    user: (s = game.user) == null ? void 0 : s.id,
    speaker: ((o = i.getSpeaker) == null ? void 0 : o.call(i)) ?? {},
    content: `
      <article class="hd-chat-card is-activated">
        <header>
          <i class="fa-solid fa-sliders"></i>
          <div>
            <p class="hd-kicker">HoloDock Power Mode</p>
            <h3>${g(t.name)}</h3>
          </div>
        </header>
        <dl>
          <div><dt>Ship</dt><dd>${g(e.name)}</dd></div>
          <div><dt>Systems Applied</dt><dd>${n}</dd></div>
          <div><dt>Target Allocation</dt><dd>${a}</dd></div>
          <div><dt>Online</dt><dd>${r}/${t.entries.length}</dd></div>
        </dl>
      </article>
    `
  });
}
async function Ue(e, t) {
  var r, s, o, l;
  if (!S("apply power presets")) return !1;
  const n = ee(e), i = n == null ? void 0 : n.powerPresets.find((c) => c.id === t);
  if (!n || !i || !await dt(n, i)) return !1;
  let a = 0;
  for (const c of i.entries) {
    const d = n.slots.find((f) => f.id === c.slotId), p = await T((d == null ? void 0 : d.itemUuid) ?? ""), u = q(p);
    !u.enabled || !u.power.enabled || (await j(p, {
      enabled: u.enabled,
      power: {
        ...u.power,
        allocated: c.allocated,
        online: c.online
      }
    }), a += 1);
  }
  return a ? ((l = (o = ui.notifications) == null ? void 0 : o.info) == null || l.call(o, `Applied power preset: ${i.name}`), await ut(n, i, a), F(), !0) : ((s = (r = ui.notifications) == null ? void 0 : r.warn) == null || s.call(r, "That preset did not match any powered slotted equipment."), !1);
}
async function Re(e = L) {
  if (!S("delete ship profiles")) return !1;
  const t = ee(e);
  if (!t || !await Dialog.confirm({
    title: "Delete Ship Profile",
    content: `<p>Delete <strong>${g(t.name)}</strong>?</p>`,
    defaultYes: !1
  })) return !1;
  const i = D(E());
  return delete i[e], L = Object.keys(i)[0] ?? "", Ie() === e && await he(L), await x(i), !0;
}
async function Ne(e, t) {
  if (!S("edit ship statistics")) return null;
  const n = D(E()), i = n[e];
  if (!i) return null;
  const a = N(t), r = i.stats.findIndex((s) => s.id === a.id);
  return r >= 0 ? i.stats[r] = { ...i.stats[r], ...a } : i.stats.push(a), n[e] = M(i), await x(n), a;
}
async function Fe(e, t) {
  if (!S("delete ship statistics")) return !1;
  const n = D(E()), i = n[e];
  if (!i) return !1;
  const a = i.stats.find((s) => s.id === t);
  return !a || !await Dialog.confirm({
    title: "Delete Ship Statistic",
    content: `<p>Delete <strong>${g(a.label)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (i.stats = i.stats.filter((s) => s.id !== t), n[e] = M(i), await x(n), !0);
}
async function je(e, t) {
  if (!S("edit equipment slots")) return null;
  const n = D(E()), i = n[e];
  if (!i) return null;
  const a = i.slots.findIndex((s) => s.id === t.id), r = G(a >= 0 ? { ...i.slots[a], ...t } : t);
  return a >= 0 ? i.slots[a] = r : i.slots.push(r), n[e] = M(i), await se(r.category), r.requiredCategory && await se(r.requiredCategory), await x(n), r;
}
async function _e(e, t) {
  if (!S("delete equipment slots")) return !1;
  const n = D(E()), i = n[e];
  if (!i) return !1;
  const a = i.slots.find((s) => s.id === t);
  return !a || !await Dialog.confirm({
    title: "Delete Equipment Slot",
    content: `<p>Delete <strong>${g(a.label)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (i.slots = i.slots.filter((s) => s.id !== t), n[e] = M(i), await x(n), !0);
}
async function re(e, t, n, i) {
  var s;
  if (!S("place equipment links")) return !1;
  const a = D(E()), r = (s = a[e]) == null ? void 0 : s.slots.find((o) => o.id === t);
  return r ? (r.anchorX = Math.min(100, Math.max(0, Number(n))), r.anchorY = Math.min(100, Math.max(0, Number(i))), await x(a), !0) : !1;
}
async function Ge(e, t) {
  var a;
  if (!S("clear equipment links")) return !1;
  const n = D(E()), i = (a = n[e]) == null ? void 0 : a.slots.find((r) => r.id === t);
  return i ? (delete i.anchorX, delete i.anchorY, await x(n), !0) : !1;
}
function ze(e) {
  const t = [];
  return e.requireShipEquipment && t.push("Ship equipment required"), e.requiredCategory && t.push(`Category: ${e.requiredCategory}`), e.requiredTags.length && t.push(`Tags: ${e.requiredTags.join(", ")}`), !e.allowUntagged && !e.requireShipEquipment && t.push("Tagged items only"), t.join(" | ");
}
function ge(e, t) {
  const n = q(t), i = !!e.requiredCategory, a = e.requiredTags.length > 0, r = e.requireShipEquipment || i || a || !e.allowUntagged;
  if (!n.enabled)
    return r ? { ok: !1, reason: "That slot only accepts HoloDock ship equipment." } : { ok: !0 };
  if (e.requiredCategory && n.category.toLowerCase() !== e.requiredCategory.toLowerCase())
    return { ok: !1, reason: `That slot requires ${e.requiredCategory} ship equipment.` };
  const s = new Set(n.tags.map((l) => l.toLowerCase())), o = e.requiredTags.filter((l) => !s.has(l.toLowerCase()));
  return o.length ? { ok: !1, reason: `That slot requires tag${o.length === 1 ? "" : "s"}: ${o.join(", ")}.` } : { ok: !0 };
}
async function we(e, t, n) {
  var o, l, c, d, p;
  if (!S("equip items")) return !1;
  const i = await T(n);
  if (!i)
    return (l = (o = ui.notifications) == null ? void 0 : o.warn) == null || l.call(o, "Drop a regular Foundry Item onto the slot."), !1;
  const a = D(E()), r = (c = a[e]) == null ? void 0 : c.slots.find((u) => u.id === t);
  if (!r) return !1;
  const s = ge(G(r), i);
  return s.ok ? (r.itemUuid = i.uuid, await x(a), !0) : ((p = (d = ui.notifications) == null ? void 0 : d.warn) == null || p.call(d, s.reason ?? "That item is not compatible with this ship slot."), !1);
}
async function le(e, t) {
  var a;
  if (!S("remove equipped items")) return !1;
  const n = D(E()), i = (a = n[e]) == null ? void 0 : a.slots.find((r) => r.id === t);
  return i ? (delete i.itemUuid, await x(n), !0) : !1;
}
async function T(e) {
  var i;
  const t = String(e || "").trim(), n = globalThis.fromUuid;
  if (!t || typeof n != "function") return null;
  try {
    const a = await n(t);
    return (a == null ? void 0 : a.documentName) === "Item" || ((i = a == null ? void 0 : a.constructor) == null ? void 0 : i.name) === "Item" ? a : null;
  } catch (a) {
    return console.warn(`${$} | Failed to resolve item UUID "${t}".`, a), null;
  }
}
function pt(e) {
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
function ft(e) {
  var n, i, a;
  const t = ((i = (n = e == null ? void 0 : e.system) == null ? void 0 : n.description) == null ? void 0 : i.value) ?? ((a = e == null ? void 0 : e.system) == null ? void 0 : a.description) ?? (e == null ? void 0 : e.description) ?? "";
  return typeof t == "string" ? t.trim() : t != null && t.value ? String(t.value).trim() : "";
}
function Ve(e) {
  if (!e.enabled) return "";
  const t = [`Ship Equipment: ${e.category}`];
  return e.durability.enabled && e.durability.max > 0 && t.push(`Durability ${e.durability.value}/${e.durability.max}`), e.power.enabled && e.power.draw > 0 && t.push(`Power ${e.power.allocated}/${e.power.draw} ${e.power.online ? "online" : "offline"}`), t.join(" | ");
}
function mt(e) {
  if (!e.enabled) return [];
  const t = [e.category];
  return e.activation.enabled && t.push("Activatable"), e.durability.enabled && t.push("Durability"), e.power.enabled && t.push("Power"), t;
}
function ht(e) {
  const t = e.durability, { isBroken: n, isDamaged: i, value: a, max: r } = fe(e), s = e.power.enabled && !e.power.online, o = e.power.enabled && e.power.online && e.power.allocated < e.power.draw, l = Math.max(0, e.activation.cooldown) * 6e3, c = e.activation.lastActivatedAt + l, d = e.activation.enabled && l > 0 && e.activation.lastActivatedAt > 0 && c > Date.now(), p = d ? Math.max(1, Math.ceil((c - Date.now()) / 6e3)) : 0, u = s || o || d || e.activation.blockWhenBroken && n;
  return {
    ...e,
    badges: mt(e),
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
      state: e.power.online ? o ? "Underpowered" : "Online" : "Offline",
      allocationText: `${e.power.allocated} / ${e.power.draw}`,
      allocationPercent: e.power.draw > 0 ? Math.min(100, Math.round(e.power.allocated / e.power.draw * 100)) : 100,
      isOffline: s,
      isUnderpowered: o
    },
    activation: {
      ...e.activation,
      isBlocked: u,
      isCoolingDown: d,
      cooldownRemaining: p,
      blockedReason: s ? "Equipment offline" : o ? "Insufficient allocated power" : d ? `Cooling down: ${p} round${p === 1 ? "" : "s"}` : n ? "Equipment broken" : ""
    }
  };
}
function Ye(e) {
  const t = Math.max(0, v(e.powerCapacity, 0)), n = e.slots.reduce((o, l) => {
    var d, p;
    const c = (p = (d = l == null ? void 0 : l.item) == null ? void 0 : d.equipment) == null ? void 0 : p.power;
    return !(c != null && c.enabled) || c.online === !1 ? o : o + Math.max(0, v(c.allocated, c.draw ?? 0));
  }, 0), i = t > 0 ? t - n : 0, a = t > 0 ? Math.max(0, n - t) : 0, r = t > 0, s = r && n > t;
  return {
    capacity: t,
    used: n,
    remaining: i,
    overage: a,
    hasCapacity: r,
    isOverBudget: s,
    summary: r ? `${n} / ${t}` : `${n} draw`
  };
}
function gt(e, t) {
  const n = new Map(t.map((a) => [a.id, a])), i = t.filter((a) => {
    var r, s, o;
    return (o = (s = (r = a.item) == null ? void 0 : r.equipment) == null ? void 0 : s.power) == null ? void 0 : o.enabled;
  });
  return e.powerPresets.map((a) => {
    const r = a.entries.reduce((m, h) => h.online ? m + h.allocated : m, 0), s = a.entries.filter((m) => m.online).length, o = Math.max(0, a.entries.length - s);
    let l = 0, c = 0, d = 0, p = 0;
    const u = a.entries.map((m) => {
      var k, C;
      const h = n.get(m.slotId), w = (C = (k = h == null ? void 0 : h.item) == null ? void 0 : k.equipment) == null ? void 0 : C.power;
      if (!(w != null && w.enabled))
        return d += 1, null;
      l += 1;
      const b = w.allocated !== m.allocated || w.online !== m.online;
      return b && (c += 1), {
        slotId: m.slotId,
        itemName: h.item.name,
        currentText: `${w.online ? "Online" : "Offline"} / ${w.allocated}`,
        targetText: `${m.online ? "Online" : "Offline"} / ${m.allocated}`,
        changed: b,
        stateClass: m.online ? "is-ready" : "is-offline"
      };
    }).filter(Boolean).slice(0, 3);
    e.powerCapacity > 0 && (p = Math.max(0, r - e.powerCapacity));
    const f = i.length > 0 && a.entries.length === i.length && a.entries.every((m) => {
      var w, b, k;
      const h = (k = (b = (w = n.get(m.slotId)) == null ? void 0 : w.item) == null ? void 0 : b.equipment) == null ? void 0 : k.power;
      return (h == null ? void 0 : h.enabled) && h.allocated === m.allocated && h.online === m.online;
    });
    return {
      ...a,
      allocated: r,
      onlineEntries: s,
      offlineEntries: o,
      systemCount: a.entries.length,
      matchedEntries: l,
      changedEntries: c,
      missingEntries: d,
      previewChanges: u,
      hasPreviewChanges: u.length > 0,
      projectedOverage: p,
      isOverBudget: p > 0,
      summary: `${r} allocated | ${s}/${a.entries.length} online`,
      isCurrent: f
    };
  });
}
function ke(e, t) {
  const n = t.map((i) => i.toLowerCase());
  return e.filter((i) => n.some((a) => i.label.toLowerCase().includes(a)));
}
function qe(e, t, n, i) {
  const a = e[0] ?? null;
  return {
    label: t,
    value: (a == null ? void 0 : a.value) || "Unset",
    note: (a == null ? void 0 : a.note) || (a ? a.label : "Add ship statistic"),
    icon: i,
    page: n,
    stateClass: a ? "is-ready" : "is-muted",
    stat: a,
    relatedStats: e.slice(1),
    hasRelatedStats: e.length > 1
  };
}
function wt(e) {
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
function bt(e) {
  const t = e.slots.length, n = e.slots.filter((m) => m.item && !m.item.missing).length, i = Math.max(0, t - n), a = e.slots.filter((m) => {
    var h, w;
    return (w = (h = m.item) == null ? void 0 : h.equipment) == null ? void 0 : w.enabled;
  }).map((m) => {
    const h = m.item.equipment, w = h.power, b = h.durability, k = b.enabled && b.isBroken, C = b.enabled && b.isDamaged, H = w.enabled && w.isOffline, Y = w.enabled && w.isUnderpowered, Je = h.activation.enabled, ye = k ? "Broken" : H ? "Offline" : Y ? "Underpowered" : C ? "Damaged" : "Ready";
    return {
      slotId: m.id,
      slotLabel: m.label,
      itemName: m.item.name,
      itemImg: m.item.img,
      category: h.category,
      state: ye,
      stateClass: `is-${ye.toLowerCase()}`,
      icon: k ? "fa-triangle-exclamation" : H ? "fa-power-off" : Y ? "fa-gauge-simple-low" : C ? "fa-screwdriver-wrench" : "fa-circle-check",
      canActivate: Je,
      activationLabel: h.activation.label,
      activationBlocked: h.activation.isBlocked,
      powerEnabled: w.enabled,
      powerDraw: w.draw,
      powerAllocated: w.allocated,
      powerAllocationText: w.allocationText,
      powerAllocationPercent: w.allocationPercent,
      powerState: w.state,
      durabilityEnabled: b.enabled,
      durabilityText: b.enabled ? `${b.value} / ${b.max}` : ""
    };
  }), r = a.filter((m) => m.state === "Broken").length, s = a.filter((m) => m.state === "Damaged").length, o = a.filter((m) => m.state === "Offline").length, l = a.filter((m) => m.state === "Underpowered").length, c = a.filter((m) => m.powerEnabled).length, d = a.filter((m) => m.powerEnabled && m.powerState === "Online").length, p = qe(ke(e.stats, ["speed", "maneuver", "thrust", "acceleration"]), "Speed", "speed", "fa-gauge-high"), u = qe(ke(e.stats, ["crew", "passenger", "capacity", "occupancy", "berth", "cargo"]), "Capacity", "capacity", "fa-users"), f = wt({ power: e.power, systems: a, brokenSystems: r, damagedSystems: s, offlineSystems: o, underpoweredSystems: l });
  return {
    totalSlots: t,
    equippedSlots: n,
    emptySlots: i,
    systems: a,
    hasSystems: a.length > 0,
    brokenSystems: r,
    damagedSystems: s,
    offlineSystems: o,
    underpoweredSystems: l,
    poweredSystems: c,
    onlineSystems: d,
    condition: f,
    hasAlerts: e.power.isOverBudget || r > 0 || s > 0 || o > 0 || l > 0,
    speed: p,
    capacity: u,
    tiles: [
      { label: "Systems", value: `${n}/${t}`, note: i ? `${i} empty` : "All slots filled", icon: "fa-layer-group", page: "systems", stateClass: i ? "is-muted" : "is-ready" },
      { label: "Power", value: e.power.summary, note: e.power.hasCapacity ? `${e.power.remaining} remaining` : "capacity untracked", icon: e.power.isOverBudget ? "fa-triangle-exclamation" : "fa-bolt", page: "power", stateClass: e.power.isOverBudget ? "is-danger" : "is-ready" },
      { label: "Online", value: `${d}/${c}`, note: l ? `${l} underpowered` : c ? "powered systems" : "No power draw", icon: "fa-power-off", page: "systems", stateClass: o || l ? "is-warning" : "is-ready" },
      { label: "Integrity", value: r ? `${r} broken` : s ? `${s} damaged` : "Nominal", note: a.length ? "ship equipment" : "No systems", icon: r ? "fa-triangle-exclamation" : "fa-shield-halved", page: "damage", stateClass: r ? "is-danger" : s ? "is-warning" : "is-ready" },
      p,
      u
    ]
  };
}
function yt(e) {
  var n;
  const t = /* @__PURE__ */ new Map();
  for (const i of e) {
    const a = String(i.category || "Unassigned");
    t.has(a) || t.set(a, []), (n = t.get(a)) == null || n.push({
      ...i,
      isSelectedEquipment: i.id === I
    });
  }
  return Array.from(t.entries()).map(([i, a]) => ({
    category: i,
    count: a.length,
    equippedCount: a.filter((r) => r.item && !r.item.missing).length,
    slots: a
  }));
}
function vt(e) {
  const t = e.filter((n) => n.item);
  return t.length ? ((!I || !t.some((n) => n.id === I)) && (I = t[0].id), t.find((n) => n.id === I) ?? null) : (I = "", null);
}
function St(e, t) {
  const n = e.filter((i) => {
    var a, r, s;
    return (s = (r = (a = i.item) == null ? void 0 : a.equipment) == null ? void 0 : r.power) == null ? void 0 : s.enabled;
  }).map((i) => {
    const a = i.item.equipment.power;
    return {
      slotId: i.id,
      label: i.label,
      itemName: i.item.name,
      category: i.category,
      allocated: a.allocated,
      draw: a.draw,
      allocationText: a.allocationText,
      allocationPercent: a.allocationPercent,
      state: a.state,
      isOffline: a.isOffline,
      isUnderpowered: a.isUnderpowered
    };
  });
  return {
    nodes: n,
    hasNodes: n.length > 0,
    reactorLabel: t.hasCapacity ? `${t.used} / ${t.capacity}` : `${t.used} allocated`
  };
}
async function kt(e) {
  const t = Number.isFinite(e.anchorX) && Number.isFinite(e.anchorY), n = ze(e), i = {
    ...e,
    hasAnchor: t,
    compatibilitySummary: n,
    hasCompatibilityRules: !!n
  };
  if (!e.itemUuid) return { ...i, item: null };
  const a = await T(e.itemUuid);
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
  const r = q(a), s = Ve(r), o = ht(r), l = o.durability.isBroken ? "is-broken" : o.power.isOffline ? "is-offline" : o.power.isUnderpowered ? "is-underpowered" : o.durability.isDamaged ? "is-damaged" : o.enabled ? "is-ready" : "is-untagged";
  return {
    ...i,
    item: {
      name: a.name ?? "Unnamed Item",
      img: a.img || "icons/svg/item-bag.svg",
      status: s,
      description: ft(a),
      uuid: a.uuid,
      equipment: o
    },
    pinStateClass: l
  };
}
async function qt() {
  var a, r, s;
  const e = y();
  let t = null;
  if (e) {
    const o = await Promise.all(e.slots.map(kt)), l = Ye({ ...e, slots: o }), c = bt({ slots: o, power: l, stats: e.stats }), d = new Set([
      (a = c.speed.stat) == null ? void 0 : a.id,
      (r = c.capacity.stat) == null ? void 0 : r.id,
      ...c.speed.relatedStats.map((f) => f.id),
      ...c.capacity.relatedStats.map((f) => f.id)
    ].filter(Boolean));
    c.tiles = c.tiles.map((f) => ({
      ...f,
      isActive: f.page === A || f.page === "systems" && A === "equipment" && f.label === "Systems"
    }));
    const p = vt(o), u = o.map((f) => ({
      ...f,
      isSelectedEquipment: f.id === I
    }));
    t = {
      ...e,
      slots: u,
      power: l,
      powerPresets: gt(e, o),
      hasPowerPresets: e.powerPresets.length > 0,
      dashboard: c,
      additionalStats: e.stats.filter((f) => !d.has(f.id)),
      hasAdditionalStats: e.stats.some((f) => !d.has(f.id)),
      equipmentCategories: yt(u),
      selectedEquipmentSlot: p,
      hasSelectedEquipment: !!p,
      powerGrid: St(o, l)
    };
  }
  const n = me().map((o) => ({
    ...o,
    isSelected: o.id === L
  }));
  return !new Set(ae.map((o) => o.id)).has(A) && A !== "equipment" && (A = "overview"), {
    canEdit: ((s = game.user) == null ? void 0 : s.isGM) === !0,
    hasProfiles: n.length > 0,
    profiles: n,
    selectedProfile: t,
    pages: ae.map((o) => ({
      ...o,
      isActive: o.id === A
    })),
    activePage: A,
    isOverview: A === "overview",
    isSystems: A === "systems",
    isEquipment: A === "equipment",
    isPower: A === "power",
    isDamage: A === "damage",
    isSpeed: A === "speed",
    isCapacity: A === "capacity",
    categories: V()
  };
}
function Z(e, t = null) {
  var n;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (n = e == null ? void 0 : e.element) != null && n[0] ? e.element[0] : (e == null ? void 0 : e.element) ?? null;
}
function F() {
  O != null && O.rendered && O.render(!0);
}
function be(e) {
  var i, a;
  const t = (e == null ? void 0 : e[0]) ?? e, n = ((i = t == null ? void 0 : t.querySelector) == null ? void 0 : i.call(t, "form")) ?? ((a = t == null ? void 0 : t.closest) == null ? void 0 : a.call(t, "form"));
  return Object.fromEntries(new FormData(n).entries());
}
function $t(e) {
  var a, r;
  const t = (e == null ? void 0 : e[0]) ?? e, n = ((a = t == null ? void 0 : t.querySelector) == null ? void 0 : a.call(t, "form")) ?? ((r = t == null ? void 0 : t.closest) == null ? void 0 : r.call(t, "form")), i = new FormData(n);
  return {
    id: String(i.get("id") || ""),
    label: String(i.get("label") || ""),
    category: String(i.get("category") || ""),
    description: String(i.get("description") || ""),
    requireShipEquipment: B(i, "requireShipEquipment"),
    requiredCategory: String(i.get("requiredCategory") || ""),
    requiredTags: xe(i.get("requiredTags")),
    allowUntagged: B(i, "allowUntagged")
  };
}
function $e(e = {}) {
  if (!S("edit equipment slots")) return;
  const t = y();
  if (!t) return;
  const n = G({ label: "New Slot", category: U[0], ...e }), i = V().map((a) => `<option value="${g(a)}">`).join("");
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
            <input type="checkbox" name="requireShipEquipment" ${Se(n.requireShipEquipment)}>
            <span>Require HoloDock ship equipment</span>
          </label>
          <label class="hd-check">
            <input type="checkbox" name="allowUntagged" ${Se(n.allowUntagged)}>
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
        callback: (a) => je(t.id, $t(a))
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
function Ae(e = {}) {
  if (!S("edit ship statistics")) return;
  const t = y();
  if (!t) return;
  const n = N({ label: "New Statistic", ...e });
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
        callback: (i) => Ne(t.id, be(i))
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
function At() {
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
          const n = be(t);
          return He(e.id, n.name || "Power Mode");
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
function B(e, t) {
  return e.get(t) === "on";
}
function Et(e) {
  var r, s;
  const t = (e == null ? void 0 : e[0]) ?? e, n = ((r = t == null ? void 0 : t.querySelector) == null ? void 0 : r.call(t, "form")) ?? ((s = t == null ? void 0 : t.closest) == null ? void 0 : s.call(t, "form")), i = new FormData(n), a = String(i.get("tags") || "").split(",").map((o) => o.trim()).filter(Boolean);
  return pe({
    enabled: B(i, "enabled"),
    category: String(i.get("category") || ""),
    tags: a,
    activation: {
      enabled: B(i, "activation.enabled"),
      label: String(i.get("activation.label") || ""),
      actionType: String(i.get("activation.actionType") || ""),
      cooldown: v(i.get("activation.cooldown"), 0),
      resourceCost: String(i.get("activation.resourceCost") || ""),
      durabilityCost: v(i.get("activation.durabilityCost"), 0),
      blockWhenBroken: B(i, "activation.blockWhenBroken")
    },
    durability: {
      enabled: B(i, "durability.enabled"),
      value: v(i.get("durability.value"), 0),
      max: v(i.get("durability.max"), 0),
      brokenAt: v(i.get("durability.brokenAt"), 0)
    },
    power: {
      enabled: B(i, "power.enabled"),
      draw: v(i.get("power.draw"), 0),
      allocated: v(i.get("power.allocated"), v(i.get("power.draw"), 0)),
      online: B(i, "power.online")
    }
  });
}
function _(e) {
  if (!S("tag ship equipment") || !e) return;
  const t = q(e), n = V().map((a) => `<option value="${g(a)}">`).join(""), i = (a) => a ? "checked" : "";
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
        callback: (a) => j(e, Et(a))
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
function Ct(e) {
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
        callback: (n) => {
          const i = be(n);
          return K(e, v(i.value, t.durability.value));
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
function Tt() {
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
function Dt(e) {
  return Tt().filter((t) => {
    var n;
    return (t == null ? void 0 : t.documentName) === "Item" || ((n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) === "Item";
  }).map((t) => {
    const n = q(t), i = ge(e, t);
    return {
      id: String(t.id ?? t.uuid ?? P("item")),
      uuid: String(t.uuid ?? ""),
      name: String(t.name ?? "Unnamed Item"),
      img: String(t.img || "icons/svg/item-bag.svg"),
      type: String(t.type || "Item"),
      status: Ve(n),
      compatible: i.ok,
      reason: i.reason ?? "",
      shipEquipment: n.enabled,
      category: n.enabled ? n.category : "",
      tagsText: n.tags.join(", ")
    };
  }).filter((t) => t.uuid).sort((t, n) => t.compatible !== n.compatible ? t.compatible ? -1 : 1 : t.shipEquipment !== n.shipEquipment ? t.shipEquipment ? -1 : 1 : t.name.localeCompare(n.name));
}
function Ee(e) {
  return `
    <button type="button" class="hd-equipment-pick ${e.compatible ? "" : "is-incompatible"}" data-hd-pick-item="${g(e.uuid)}">
      <img src="${g(e.img)}" alt="">
      <span>
        <strong>${g(e.name)}</strong>
        ${e.status ? `<small>${g(e.status)}</small>` : ""}
        ${e.tagsText ? `<em>${g(e.tagsText)}</em>` : ""}
        ${e.reason ? `<em>${g(e.reason)}</em>` : ""}
      </span>
    </button>
  `;
}
function xt(e, t) {
  if (!S("equip items")) return;
  const n = ee(e), i = n == null ? void 0 : n.slots.find((c) => c.id === t);
  if (!n || !i) return;
  const a = G(i), r = Dt(a), s = r.filter((c) => c.compatible), o = r.filter((c) => !c.compatible), l = new Dialog({
    title: `Choose Equipment: ${i.label}`,
    content: `
      <section class="hd-equipment-browser">
        <p class="hd-muted">${g(ze(a) || "No slot compatibility rules set.")}</p>
        <div class="hd-equipment-pick-list">
          ${s.length ? s.map(Ee).join("") : '<p class="hd-muted">No compatible world items found.</p>'}
        </div>
        ${o.length ? `
          <details class="hd-incompatible-equipment">
            <summary>${o.length} incompatible item${o.length === 1 ? "" : "s"}</summary>
            <div class="hd-equipment-pick-list">
              ${o.map(Ee).join("")}
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
    const c = Z(l);
    c == null || c.querySelectorAll("[data-hd-pick-item]").forEach((d) => {
      d.addEventListener("click", async () => {
        const p = d.dataset.hdPickItem ?? "";
        await we(n.id, i.id, p) && l.close();
      });
    });
  }, 0);
}
function te(e) {
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
    const s = r.documentName ?? ((i = r.constructor) == null ? void 0 : i.documentName), o = String(((a = r.constructor) == null ? void 0 : a.name) ?? "");
    if (s === "Item" || o.includes("Item") && r.type !== void 0 && r.setFlag && r.getFlag) return r;
  }
  return null;
}
function X(e, t) {
  var a;
  if (!((a = game.user) != null && a.isGM)) return;
  const n = te(e);
  if (!n || !Array.isArray(t) || t.some((r) => (r == null ? void 0 : r.class) === "hd-edit-equipment" || (r == null ? void 0 : r.className) === "hd-edit-equipment")) return;
  const i = {
    label: "Ship Equipment",
    title: "HoloDock Ship Equipment",
    class: "hd-edit-equipment",
    className: "hd-edit-equipment",
    icon: "fa-solid fa-shuttle-space",
    onclick: () => _(n),
    onClick: () => _(n)
  };
  t.unshift(i);
}
function Pt(e, t) {
  var i;
  if (!((i = game.user) != null && i.isGM)) return;
  const n = te(e);
  !n || !Array.isArray(t) || t.some((a) => (a == null ? void 0 : a.action) === "holodockShipEquipment" || (a == null ? void 0 : a.class) === "hd-edit-equipment") || t.unshift({
    action: "holodockShipEquipment",
    label: "Ship Equipment",
    title: "HoloDock Ship Equipment",
    icon: "fa-solid fa-shuttle-space",
    class: "hd-edit-equipment",
    visible: !0,
    ownership: "OWNER",
    onClick: () => _(n),
    onclick: () => _(n)
  });
}
function We(e, t = null) {
  var o, l, c, d, p, u, f;
  const n = Z(null, t), i = ((o = e == null ? void 0 : e.element) == null ? void 0 : o[0]) ?? (e == null ? void 0 : e.element) ?? ((l = e == null ? void 0 : e._element) == null ? void 0 : l[0]) ?? (e == null ? void 0 : e._element), a = ((c = e == null ? void 0 : e.window) == null ? void 0 : c.element) ?? ((d = e == null ? void 0 : e.window) == null ? void 0 : d.frame), r = e != null && e.id && ((p = globalThis.CSS) != null && p.escape) ? CSS.escape(e.id) : "", s = [
    a,
    (u = i == null ? void 0 : i.closest) == null ? void 0 : u.call(i, ".application, .app, .window-app"),
    i,
    (f = n == null ? void 0 : n.closest) == null ? void 0 : f.call(n, ".application, .app, .window-app"),
    e != null && e.id ? document.getElementById(e.id) : null,
    r ? document.querySelector(`#${r}`) : null,
    e != null && e.appId ? document.querySelector(`[data-appid="${e.appId}"], [data-application-id="${e.appId}"]`) : null
  ];
  for (const m of s)
    if (m instanceof HTMLElement) return m;
  return null;
}
function J(e, t = null) {
  var l;
  if (!((l = game.user) != null && l.isGM)) return;
  const n = te(e);
  if (!n) return;
  const i = We(e, t);
  if (!i || i.querySelector(".hd-edit-equipment, [data-hd-edit-equipment]")) return;
  const a = i.querySelector(".window-header, header.window-header, .app-header, header");
  if (!a) return;
  const r = document.createElement("button");
  r.type = "button", r.className = "hd-edit-equipment hd-item-sheet-header-fallback", r.dataset.hdEditEquipment = "true", r.title = "HoloDock Ship Equipment", r.innerHTML = '<i class="fa-solid fa-shuttle-space"></i><span class="sr-only">Ship Equipment</span>', r.addEventListener("click", (c) => {
    c.preventDefault(), _(n);
  });
  const s = a.querySelector(".window-controls, .header-controls, .window-header-buttons, .window-buttons, menu"), o = a.querySelector(".close, [data-action='close']");
  s ? s.prepend(r) : o ? a.insertBefore(r, o) : a.append(r);
}
function Lt(e, t = null) {
  J(e, t), window.setTimeout(() => J(e, t), 0), window.setTimeout(() => J(e, t), 100), window.setTimeout(() => J(e, t), 300);
}
function z(e, t = null) {
  Lt(e, t);
  const n = We(e, t), i = te(e);
  !n || !i || n.dataset.hdEquipmentHeaderListener === "true" || (n.dataset.hdEquipmentHeaderListener = "true", n.addEventListener("click", (a) => {
    var s, o;
    (o = (s = a.target) == null ? void 0 : s.closest) != null && o.call(s, "[data-action='holodockShipEquipment'], .hd-edit-equipment") && (a.preventDefault(), _(i));
  }));
}
class It extends rt {
  constructor() {
    super(...arguments);
    W(this, "linkingSlotId", "");
    W(this, "linkResizeObserver");
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holodock",
      title: "HoloDock - Ship Loadout",
      classes: ["holodock-window"],
      template: Ce,
      popOut: !0,
      resizable: !0,
      width: 920,
      height: 760
    });
  }
  async getData() {
    return qt();
  }
  activateListeners(n) {
    var a, r;
    super.activateListeners(n);
    const i = Z(this, n);
    i && ((a = i.querySelector("[data-hd-profile-select]")) == null || a.addEventListener("change", (s) => {
      L = s.currentTarget.value, I = "", he(L).finally(() => this.render(!0));
    }), i.querySelectorAll("[data-hd-page]").forEach((s) => {
      s.addEventListener("click", (o) => {
        const l = o.currentTarget.dataset.hdPage ?? "overview";
        ae.some((c) => c.id === l) && (A = l, this.render(!0));
      });
    }), i.querySelectorAll("[data-hd-select-equipment]").forEach((s) => {
      s.addEventListener("click", (o) => {
        I = o.currentTarget.dataset.hdSelectEquipment ?? "", A = "equipment", this.render(!0);
      });
    }), (r = i.querySelector("[data-hd-profile-form]")) == null || r.addEventListener("submit", async (s) => {
      s.preventDefault();
      const o = y();
      if (!o) return;
      const l = Object.fromEntries(new FormData(s.currentTarget).entries());
      await Oe(o.id, l);
    }), i.querySelectorAll("[data-hd-action]").forEach((s) => {
      s.addEventListener("click", async (o) => {
        const l = o.currentTarget.dataset.hdAction, c = y();
        l === "create-profile" && await Me(), l === "delete-profile" && await Re(c == null ? void 0 : c.id), l === "create-slot" && $e(), l === "create-stat" && Ae(), l === "browse-image" && this.browseShipImage(), l === "save-power-preset" && At();
      });
    }), i.querySelectorAll("[data-hd-apply-power-preset]").forEach((s) => {
      s.addEventListener("click", async (o) => {
        const l = y(), c = o.currentTarget.dataset.hdApplyPowerPreset ?? "";
        l && await Ue(l.id, c);
      });
    }), i.querySelectorAll("[data-hd-delete-power-preset]").forEach((s) => {
      s.addEventListener("click", async (o) => {
        const l = y(), c = o.currentTarget.dataset.hdDeletePowerPreset ?? "";
        l && await Be(l.id, c);
      });
    }), i.querySelectorAll("[data-hd-edit-stat]").forEach((s) => {
      s.addEventListener("click", (o) => {
        const l = y(), c = l == null ? void 0 : l.stats.find((d) => d.id === o.currentTarget.dataset.hdEditStat);
        c && Ae(c);
      });
    }), i.querySelectorAll("[data-hd-delete-stat]").forEach((s) => {
      s.addEventListener("click", async (o) => {
        const l = y(), c = o.currentTarget.dataset.hdDeleteStat ?? "";
        l && await Fe(l.id, c);
      });
    }), i.querySelectorAll("[data-hd-edit-slot]").forEach((s) => {
      s.addEventListener("click", (o) => {
        const l = y(), c = l == null ? void 0 : l.slots.find((d) => d.id === o.currentTarget.dataset.hdEditSlot);
        c && $e(c);
      });
    }), i.querySelectorAll("[data-hd-delete-slot]").forEach((s) => {
      s.addEventListener("click", async (o) => {
        const l = y(), c = o.currentTarget.dataset.hdDeleteSlot ?? "";
        l && await _e(l.id, c);
      });
    }), i.querySelectorAll("[data-hd-browse-equipment]").forEach((s) => {
      s.addEventListener("click", (o) => {
        const l = y(), c = o.currentTarget.dataset.hdBrowseEquipment ?? "";
        l && xt(l.id, c);
      });
    }), i.querySelectorAll("[data-hd-open-item]").forEach((s) => {
      s.addEventListener("click", async (o) => {
        var p, u, f;
        const l = y(), c = l == null ? void 0 : l.slots.find((m) => m.id === o.currentTarget.dataset.hdOpenItem), d = await T((c == null ? void 0 : c.itemUuid) ?? "");
        (p = d == null ? void 0 : d.sheet) != null && p.render ? d.sheet.render(!0) : (f = (u = ui.notifications) == null ? void 0 : u.warn) == null || f.call(u, "That item could not be found.");
      });
    }), i.querySelectorAll("[data-hd-activate-equipment]").forEach((s) => {
      s.addEventListener("click", async (o) => {
        var f, m, h, w, b, k, C, H;
        const l = y(), c = o.currentTarget.dataset.hdActivateEquipment ?? "", d = l == null ? void 0 : l.slots.find((Y) => Y.id === c), p = await T((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p || !l || !d) {
          (m = (f = ui.notifications) == null ? void 0 : f.warn) == null || m.call(f, "That ship equipment could not be found.");
          return;
        }
        const u = await Le(p, { profile: l, slot: d });
        u.blocked || !u.ok ? (w = (h = ui.notifications) == null ? void 0 : h.warn) == null || w.call(h, u.message) : u.handled ? u.message && ((H = (C = ui.notifications) == null ? void 0 : C.info) == null || H.call(C, u.message)) : (k = (b = ui.notifications) == null ? void 0 : b.info) == null || k.call(b, u.message);
      });
    }), i.querySelectorAll("[data-hd-durability-adjust]").forEach((s) => {
      s.addEventListener("click", async (o) => {
        var f, m;
        const l = y(), c = o.currentTarget, d = l == null ? void 0 : l.slots.find((h) => h.id === c.dataset.hdDurabilityAdjust), p = await T((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (m = (f = ui.notifications) == null ? void 0 : f.warn) == null || m.call(f, "That ship equipment could not be found.");
          return;
        }
        const u = q(p);
        !u.enabled || !u.durability.enabled || await K(p, u.durability.value + v(c.dataset.hdDurabilityDelta, 0));
      });
    }), i.querySelectorAll("[data-hd-durability-set]").forEach((s) => {
      s.addEventListener("click", async (o) => {
        var p, u;
        const l = y(), c = l == null ? void 0 : l.slots.find((f) => f.id === o.currentTarget.dataset.hdDurabilitySet), d = await T((c == null ? void 0 : c.itemUuid) ?? "");
        d ? Ct(d) : (u = (p = ui.notifications) == null ? void 0 : p.warn) == null || u.call(p, "That ship equipment could not be found.");
      });
    }), i.querySelectorAll("[data-hd-durability-value]").forEach((s) => {
      s.addEventListener("change", async (o) => {
        var u, f;
        const l = y(), c = o.currentTarget, d = l == null ? void 0 : l.slots.find((m) => m.id === c.dataset.hdDurabilityValue), p = await T((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (f = (u = ui.notifications) == null ? void 0 : u.warn) == null || f.call(u, "That ship equipment could not be found.");
          return;
        }
        await K(p, v(c.value, 0));
      });
    }), i.querySelectorAll("[data-hd-power-toggle]").forEach((s) => {
      s.addEventListener("click", async (o) => {
        var f, m;
        const l = y(), c = o.currentTarget, d = l == null ? void 0 : l.slots.find((h) => h.id === c.dataset.hdPowerToggle), p = await T((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (m = (f = ui.notifications) == null ? void 0 : f.warn) == null || m.call(f, "That ship equipment could not be found.");
          return;
        }
        const u = q(p);
        !u.enabled || !u.power.enabled || await Pe(p, c.dataset.hdPowerOnline === "true");
      });
    }), i.querySelectorAll("[data-hd-power-adjust]").forEach((s) => {
      s.addEventListener("click", async (o) => {
        var f, m;
        const l = y(), c = o.currentTarget, d = l == null ? void 0 : l.slots.find((h) => h.id === c.dataset.hdPowerAdjust), p = await T((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (m = (f = ui.notifications) == null ? void 0 : f.warn) == null || m.call(f, "That ship equipment could not be found.");
          return;
        }
        const u = q(p);
        !u.enabled || !u.power.enabled || await oe(p, u.power.allocated + v(c.dataset.hdPowerDelta, 0));
      });
    }), i.querySelectorAll("[data-hd-power-allocation]").forEach((s) => {
      s.addEventListener("change", async (o) => {
        var u, f;
        const l = y(), c = o.currentTarget, d = l == null ? void 0 : l.slots.find((m) => m.id === c.dataset.hdPowerAllocation), p = await T((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (f = (u = ui.notifications) == null ? void 0 : u.warn) == null || f.call(u, "That ship equipment could not be found.");
          return;
        }
        await oe(p, v(c.value, 0));
      });
    }), i.querySelectorAll("[data-hd-remove-item]").forEach((s) => {
      s.addEventListener("click", async (o) => {
        const l = y(), c = o.currentTarget.dataset.hdRemoveItem ?? "";
        l && await le(l.id, c);
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
        const r = y(), s = i.dataset.hdSlotId ?? "", o = pt(a), l = o.uuid ?? o.documentUuid ?? o.itemUuid ?? "";
        if (!r || !l) {
          (p = (d = ui.notifications) == null ? void 0 : d.warn) == null || p.call(d, "Drop a Foundry Item onto an equipment slot.");
          return;
        }
        await we(r.id, s, l);
      }), i.addEventListener("contextmenu", async (a) => {
        var o;
        if (!((o = game.user) != null && o.isGM)) return;
        a.preventDefault();
        const r = y(), s = i.dataset.hdSlotId ?? "";
        r && await le(r.id, s);
      });
    });
  }
  activateSlotAnchors(n) {
    var a, r, s;
    const i = n.querySelector("[data-hd-ship-map]");
    i && ((a = this.linkResizeObserver) == null || a.disconnect(), this.linkResizeObserver = void 0, typeof ResizeObserver < "u" && (this.linkResizeObserver = new ResizeObserver(() => this.syncShipLinks(n)), this.linkResizeObserver.observe(n.querySelector(".hd-stage") ?? n)), (r = n.querySelector(".hd-slot-rail")) == null || r.addEventListener("scroll", () => this.syncShipLinks(n)), (s = i.querySelector("img")) == null || s.addEventListener("load", () => this.syncShipLinks(n)), n.querySelectorAll("[data-hd-link-slot]").forEach((o) => {
      o.addEventListener("click", () => {
        var l;
        (l = game.user) != null && l.isGM && (this.linkingSlotId = o.dataset.hdLinkSlot ?? "", n.classList.toggle("is-linking-slot", !!this.linkingSlotId));
      });
    }), n.querySelectorAll("[data-hd-clear-link]").forEach((o) => {
      o.addEventListener("click", async () => {
        const l = y(), c = o.dataset.hdClearLink ?? "";
        l && await Ge(l.id, c);
      });
    }), i.addEventListener("click", async (o) => {
      var p;
      if (!((p = game.user) != null && p.isGM) || !this.linkingSlotId) return;
      o.preventDefault();
      const l = y(), c = this.getImageAnchorPoint(i, o.clientX, o.clientY), d = this.linkingSlotId;
      this.linkingSlotId = "", n.classList.remove("is-linking-slot"), l && await re(l.id, d, c.x, c.y);
    }), n.querySelectorAll("[data-hd-anchor-slot]").forEach((o) => {
      o.addEventListener("click", (l) => {
        var d;
        l.preventDefault(), l.stopPropagation();
        const c = o.dataset.hdAnchorSlot ?? "";
        !c || (d = game.user) != null && d.isGM || (I = c, A = "equipment", this.render(!0));
      }), o.addEventListener("pointerdown", (l) => {
        var h;
        if (!((h = game.user) != null && h.isGM)) return;
        l.preventDefault();
        const c = o.dataset.hdAnchorSlot ?? "", d = l.clientX, p = l.clientY;
        let u = !1;
        const f = (w) => {
          (Math.abs(w.clientX - d) > 3 || Math.abs(w.clientY - p) > 3) && (u = !0);
          const b = this.getImageAnchorPoint(i, w.clientX, w.clientY);
          o.dataset.hdAnchorX = String(b.x), o.dataset.hdAnchorY = String(b.y), this.syncShipLinks(n);
        }, m = async (w) => {
          if (window.removeEventListener("pointermove", f), window.removeEventListener("pointerup", m), !u) {
            I = c, A = "equipment", this.render(!0);
            return;
          }
          const b = y(), k = this.getImageAnchorPoint(i, w.clientX, w.clientY);
          b && await re(b.id, c, k.x, k.y);
        };
        window.addEventListener("pointermove", f), window.addEventListener("pointerup", m);
      });
    }));
  }
  getImageAnchorPoint(n, i, a) {
    const r = this.getShipImageRect(n), s = Math.min(100, Math.max(0, (i - r.left) / r.width * 100)), o = Math.min(100, Math.max(0, (a - r.top) / r.height * 100));
    return { x: s, y: o };
  }
  getShipImageRect(n) {
    const i = n.querySelector("img"), a = i == null ? void 0 : i.getBoundingClientRect();
    if (a != null && a.width && (a != null && a.height) && (i != null && i.naturalWidth) && (i != null && i.naturalHeight)) {
      const r = i.naturalWidth / i.naturalHeight, s = a.width / a.height;
      if (r > s) {
        const c = a.width / r, d = a.top + (a.height - c) / 2;
        return new DOMRect(a.left, d, a.width, c);
      }
      const o = a.height * r, l = a.left + (a.width - o) / 2;
      return new DOMRect(l, a.top, o, a.height);
    }
    return a != null && a.width && (a != null && a.height) ? a : n.getBoundingClientRect();
  }
  positionSlotPins(n) {
    const i = n.querySelector("[data-hd-ship-map]");
    if (!i) return;
    const a = this.getShipImageRect(i), r = i.getBoundingClientRect();
    n.querySelectorAll("[data-hd-anchor-slot]").forEach((s) => {
      const o = Number(s.dataset.hdAnchorX), l = Number(s.dataset.hdAnchorY);
      if (!Number.isFinite(o) || !Number.isFinite(l)) return;
      const c = a.left - r.left + a.width * o / 100, d = a.top - r.top + a.height * l / 100;
      s.style.left = `${c}px`, s.style.top = `${d}px`;
    });
  }
  syncShipLinks(n) {
    this.positionSlotPins(n), this.drawSlotLinks(n);
  }
  drawSlotLinks(n) {
    const i = n.querySelector("[data-hd-link-lines]"), a = n.querySelector("[data-hd-ship-map]");
    if (!i || !a) return;
    const r = i.getBoundingClientRect(), s = Math.max(1, Math.round(r.width)), o = Math.max(1, Math.round(r.height));
    i.setAttribute("viewBox", `0 0 ${s} ${o}`), i.setAttribute("width", String(s)), i.setAttribute("height", String(o)), i.innerHTML = "", n.querySelectorAll("[data-hd-anchor-slot]").forEach((l) => {
      const c = l.dataset.hdAnchorSlot ?? "", d = n.querySelector(`[data-hd-slot-card="${c}"]`);
      if (!d) return;
      const p = l.getBoundingClientRect(), u = d.getBoundingClientRect(), f = p.left + p.width / 2 - r.left, m = p.top + p.height / 2 - r.top, h = u.left - r.left, w = u.top + u.height / 2 - r.top, b = Math.max(40, Math.abs(h - f) / 2), k = document.createElementNS("http://www.w3.org/2000/svg", "path");
      k.setAttribute("d", `M ${f} ${m} C ${f + b} ${m}, ${h - b} ${w}, ${h} ${w}`), k.setAttribute("class", "hd-link-line"), i.append(k);
    });
  }
  browseShipImage() {
    var a, r;
    if (!S("choose ship images")) return;
    const n = Z(this), i = n == null ? void 0 : n.querySelector("[data-hd-profile-form] input[name='image']");
    if (!i || typeof FilePicker > "u") {
      (r = (a = ui.notifications) == null ? void 0 : a.warn) == null || r.call(a, "Foundry FilePicker is not available.");
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
  async close(n = {}) {
    var i;
    return (i = this.linkResizeObserver) == null || i.disconnect(), this.linkResizeObserver = void 0, O = null, super.close(n);
  }
}
async function Xe() {
  return O || (O = new It()), await O.render(!0), O;
}
function Mt() {
  game.settings.register($, ce, {
    name: "HoloDock Ship Profiles",
    hint: "World-level ship profile and loadout data.",
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: F
  }), game.settings.register($, de, {
    name: "HoloDock Slot Categories",
    hint: "Reusable equipment slot categories for HoloDock.",
    scope: "world",
    config: !1,
    type: Array,
    default: U,
    onChange: F
  }), game.settings.register($, ue, {
    name: "HoloDock Default Ship Profile",
    hint: "The ship profile this user opens by default.",
    scope: "client",
    config: !1,
    type: String,
    default: "",
    onChange: F
  });
}
function Ot() {
  const e = {
    open: Xe,
    getProfiles: me,
    getProfile: ee,
    createProfile: Me,
    updateProfileMetadata: Oe,
    deleteProfile: Re,
    capturePowerPreset: He,
    applyPowerPreset: Ue,
    deletePowerPreset: Be,
    upsertSlot: je,
    deleteSlot: _e,
    upsertStat: Ne,
    deleteStat: Fe,
    setSlotAnchor: re,
    clearSlotAnchor: Ge,
    equipItem: we,
    unequipItem: le,
    getCategories: V,
    getShipPowerBudget: Ye,
    getShipEquipmentData: q,
    isShipEquipment: lt,
    validateItemForSlot: ge,
    setShipEquipmentData: j,
    updateShipEquipmentDurability: K,
    updateShipEquipmentPowerState: Pe,
    updateShipEquipmentPowerAllocation: oe,
    activateEquipment: Le
  };
  game.holodock = e;
  const t = game.modules.get($);
  t && (t.api = e);
}
function Ht() {
  const e = game.modules.get("holosuite-core");
  return (e != null && e.active ? e.api : null) ?? game.holosuite ?? globalThis.HoloSuiteCoreApi ?? null;
}
function ie() {
  const e = Ht();
  if (!(e != null && e.registerApp)) return !1;
  const t = {
    id: $,
    title: "HoloDock",
    icon: "fa-solid fa-shuttle-space",
    premium: !1,
    playerVisible: !0,
    description: "View and manage system-agnostic ship loadouts.",
    open: () => Xe()
  };
  return e.registerApp(t), !0;
}
function Bt() {
  if (ie()) return;
  let e = 0;
  const t = () => {
    e += 1, !(ie() || e >= 20) && window.setTimeout(t, 250);
  };
  Hooks.once("holosuite-core.apiReady", () => ie()), window.setTimeout(t, 250);
}
Hooks.once("init", async () => {
  Mt(), Handlebars.registerHelper("hdFallback", (e, t) => e || t), await loadTemplates([Ce]);
});
Hooks.once("ready", () => {
  Ot(), Hooks.on("getApplicationHeaderButtons", X), Hooks.on("getApplicationV1HeaderButtons", X), Hooks.on("getDocumentSheetHeaderButtons", X), Hooks.on("getItemSheetHeaderButtons", X), Hooks.on("getHeaderControlsApplicationV2", Pt), Hooks.on("renderItemSheet", z), Hooks.on("renderItemSheetV2", z), Hooks.on("renderApplication", z), Hooks.on("renderApplicationV1", z), Hooks.on("renderApplicationV2", z), Bt(), console.log(`${$} | Ready. API available at game.holodock.`);
});
