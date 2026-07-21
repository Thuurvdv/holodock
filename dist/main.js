var pt = Object.defineProperty;
var ft = (e, t, n) => t in e ? pt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Q = (e, t, n) => ft(e, typeof t != "symbol" ? t + "" : t, n);
function mt() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) ?? null;
}
function ht() {
  var e, t, n;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : t.api) ?? ((n = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : n.api) ?? null;
}
function gt(e = {}, t = {}) {
  var i, a, o;
  const n = ((a = (i = globalThis.foundry) == null ? void 0 : i.utils) == null ? void 0 : a.mergeObject) ?? ((o = foundry == null ? void 0 : foundry.utils) == null ? void 0 : o.mergeObject);
  return typeof n == "function" ? n(e, t, { inplace: !1 }) : { ...e, ...t };
}
function wt() {
  var e, t, n, i, a;
  return ((n = (t = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : t.randomID) == null ? void 0 : n.call(t, 8)) ?? ((a = (i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.randomID) == null ? void 0 : a.call(i, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function De(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${wt()}`),
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
function yt(e) {
  return class extends e {
    constructor(i = {}) {
      const a = gt(new.target.defaultOptions ?? {}, i);
      super(De(a));
      Q(this, "_v1Options");
      this._v1Options = a;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return De(this.defaultOptions ?? {});
    }
    activateListeners(i) {
    }
    async _renderHTML(i, a) {
      var c, d, p;
      const o = typeof this.getData == "function" ? await this.getData() : {}, s = ((c = this._v1Options) == null ? void 0 : c.template) ?? ((d = this.options) == null ? void 0 : d.template) ?? ((p = this.constructor.defaultOptions) == null ? void 0 : p.template);
      if (!s) return document.createDocumentFragment();
      const r = await globalThis.renderTemplate(s, o), l = document.createElement("template");
      return l.innerHTML = r.trim(), l.content;
    }
    _activateV1Form(i) {
      var o, s;
      if (typeof this._updateObject != "function") return;
      const a = (o = i.matches) != null && o.call(i, "form") ? i : (s = i.querySelector) == null ? void 0 : s.call(i, "form");
      a instanceof HTMLFormElement && a.addEventListener("submit", async (r) => {
        var l;
        r.preventDefault(), r.stopPropagation(), await this._updateObject(r, new FormData(a)), ((l = this._v1Options) == null ? void 0 : l.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(i, a, o) {
      var d, p, u, m;
      a.replaceChildren(i);
      const s = globalThis.jQuery ?? globalThis.$, r = ((d = a.closest) == null ? void 0 : d.call(a, ".window-app, .app, .application")) ?? a, l = s ? s(r) : r;
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
      Array.isArray(c) && c.length && (a.classList.add(...c), (m = (u = a.closest) == null ? void 0 : u.call(a, ".window-app, .app, .application")) == null || m.classList.add(...c)), this._activateV1Form(a), typeof this.activateListeners == "function" && this.activateListeners(s ? s(a) : a);
    }
  };
}
function bt() {
  const e = mt(), t = ht(), n = globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (n) return n;
  const i = e == null ? void 0 : e.ApplicationV2;
  return i ? yt(i) : null;
}
const k = "holodock", vt = "HoloDock", we = "profiles", ye = "slotCategories", be = "defaultProfile", de = "shipEquipment", Re = `modules/${k}/templates/holodock.hbs`, te = "modules/holodock/assets/SpaceshipDefault.webp", St = "icons/svg/space-station.svg", j = ["Weapons", "Defense", "Utility", "Engines", "Cargo", "Special"];
function I(e) {
  var t, n;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.deepClone ? foundry.utils.deepClone(e) : (n = foundry == null ? void 0 : foundry.utils) != null && n.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? {}));
}
function D(e = "hd") {
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
function q(e = "edit HoloDock") {
  var t, n, i;
  return (t = game.user) != null && t.isGM ? !0 : ((i = (n = ui.notifications) == null ? void 0 : n.warn) == null || i.call(n, `Only a GM can ${e}.`), !1);
}
const kt = bt();
let N = null, L = "", E = "overview", M = "", Ie = "", xe = 0;
const Be = `module.${k}`, ue = [
  { id: "overview", label: "Overview", icon: "fa-solid fa-display" },
  { id: "systems", label: "Systems", icon: "fa-solid fa-microchip" },
  { id: "power", label: "Power Grid", icon: "fa-solid fa-bolt" },
  { id: "damage", label: "Damage", icon: "fa-solid fa-shield-halved" },
  { id: "speed", label: "Speed", icon: "fa-solid fa-gauge-high" },
  { id: "capacity", label: "Capacity", icon: "fa-solid fa-users" }
];
function F(e = {}) {
  const t = Number(e.anchorX), n = Number(e.anchorY), i = String(e.category || e.label || j[0]).trim() || j[0];
  return {
    id: String(e.id || D("slot")),
    label: i,
    category: i,
    description: String(e.description || "").trim(),
    requiredCategory: String(e.requiredCategory || "").trim(),
    requiredTags: Array.isArray(e.requiredTags) ? e.requiredTags.map((a) => String(a).trim()).filter(Boolean) : [],
    anchorX: Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : void 0,
    anchorY: Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : void 0,
    itemUuid: String(e.itemUuid || "").trim() || void 0
  };
}
function R(e = {}) {
  return {
    id: String(e.id || D("stat")),
    label: String(e.label || "Statistic").trim() || "Statistic",
    value: String(e.value || "").trim(),
    note: String(e.note || "").trim()
  };
}
function Ne(e = {}) {
  return {
    slotId: String(e.slotId || "").trim(),
    allocated: Math.max(0, v(e.allocated, 0)),
    online: e.online !== !1
  };
}
function Fe(e = {}) {
  return {
    id: String(e.id || D("preset")),
    name: String(e.name || "Power Preset").trim() || "Power Preset",
    entries: Array.isArray(e.entries) ? e.entries.map(Ne).filter((t) => t.slotId) : []
  };
}
function Ue(e = {}) {
  return {
    hiddenFromPlayers: e.hiddenFromPlayers === !0,
    allowPlayerEquip: e.allowPlayerEquip === !0,
    allowPlayerActivate: e.allowPlayerActivate !== !1
  };
}
function O(e = {}) {
  const t = String(e.image || te).trim() || te;
  return {
    id: String(e.id || D("ship")),
    name: String(e.name || "Party Ship").trim() || "Party Ship",
    shipClass: String(e.shipClass || "").trim(),
    image: t === St ? te : t,
    powerCapacity: Math.max(0, v(e.powerCapacity, 0)),
    permissions: Ue(e.permissions),
    powerPresets: Array.isArray(e.powerPresets) ? e.powerPresets.map(Fe) : [],
    stats: Array.isArray(e.stats) ? e.stats.map(R) : [],
    slots: Array.isArray(e.slots) ? e.slots.map(F) : []
  };
}
function v(e, t = 0) {
  const n = Number(e);
  return Number.isFinite(n) ? n : t;
}
function je(e) {
  return Array.isArray(e) ? e.map((t) => String(t).trim()).filter(Boolean) : String(e || "").split(",").map((t) => t.trim()).filter(Boolean);
}
function ne(e = {}) {
  var o, s, r, l, c, d, p, u, m, f, w, h, y, S, $, T, H;
  const t = Math.max(0, v((o = e.durability) == null ? void 0 : o.max, 0)), n = Math.min(t, Math.max(0, v((s = e.durability) == null ? void 0 : s.value, t))), i = String(e.category || j[0]).trim() || j[0], a = {
    enabled: e.enabled === !0,
    category: i,
    tags: je(e.tags),
    activation: {
      enabled: ((r = e.activation) == null ? void 0 : r.enabled) === !0,
      label: String(((l = e.activation) == null ? void 0 : l.label) || "Activate").trim() || "Activate",
      actionType: String(((c = e.activation) == null ? void 0 : c.actionType) || "").trim(),
      cooldown: Math.max(0, v((d = e.activation) == null ? void 0 : d.cooldown, 0)),
      resourceCost: String(((p = e.activation) == null ? void 0 : p.resourceCost) || "").trim(),
      durabilityCost: Math.max(0, v((u = e.activation) == null ? void 0 : u.durabilityCost, 0)),
      blockWhenBroken: ((m = e.activation) == null ? void 0 : m.blockWhenBroken) !== !1,
      lastActivatedAt: Math.max(0, v((f = e.activation) == null ? void 0 : f.lastActivatedAt, 0))
    },
    durability: {
      enabled: ((w = e.durability) == null ? void 0 : w.enabled) === !0,
      value: n,
      max: t,
      brokenAt: Math.max(0, v((h = e.durability) == null ? void 0 : h.brokenAt, 0))
    },
    power: {
      enabled: ((y = e.power) == null ? void 0 : y.enabled) === !0,
      draw: Math.max(0, v((S = e.power) == null ? void 0 : S.draw, 0)),
      allocated: Math.max(0, v(($ = e.power) == null ? void 0 : $.allocated, ((T = e.power) == null ? void 0 : T.draw) ?? 0)),
      online: ((H = e.power) == null ? void 0 : H.online) !== !1
    }
  };
  return qt(a);
}
function qt(e) {
  const t = I(e), n = t.enabled && t.durability.enabled && t.durability.value <= t.durability.brokenAt, i = t.enabled && t.power.enabled && t.power.draw > 0 && t.power.allocated <= 0;
  return t.enabled && t.power.enabled && (i || n) && (t.power.online = !1), t;
}
function A(e) {
  var t;
  return ne(((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, k, de)) ?? {});
}
function At(e) {
  return A(e).enabled;
}
async function G(e, t, n = {}) {
  var o;
  if (n.requireGm !== !1 && !q("tag ship equipment") || !(e != null && e.setFlag)) return null;
  const i = A(e), a = ne({
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
  return a.enabled ? (await e.setFlag(k, de, a), await fe(a.category), U(), a) : (await ((o = e.unsetFlag) == null ? void 0 : o.call(e, k, de)), U(), a);
}
async function ie(e, t, n = {}) {
  const i = A(e), a = Math.max(0, i.durability.max), o = Math.min(a, Math.max(0, v(t, i.durability.value)));
  return G(e, {
    enabled: i.enabled,
    durability: {
      ...i.durability,
      value: o
    }
  }, n);
}
async function Ge(e, t) {
  const n = A(e);
  return !n.enabled || !n.power.enabled ? null : G(e, {
    enabled: n.enabled,
    power: {
      ...n.power,
      online: t === !0
    }
  });
}
async function pe(e, t) {
  const n = A(e);
  return !n.enabled || !n.power.enabled ? null : G(e, {
    enabled: n.enabled,
    power: {
      ...n.power,
      allocated: Math.max(0, v(t, n.power.allocated))
    }
  });
}
function ve(e) {
  const t = e.durability, n = e.enabled && t.enabled, i = Math.max(0, t.max), a = Math.min(i, Math.max(0, t.value)), o = n && a <= t.brokenAt, s = n && !o && i > 0 && a < i;
  return { isBroken: o, isDamaged: s, value: a, max: i };
}
async function _(e, t, n = {}) {
  var d, p, u;
  const i = globalThis.ChatMessage;
  if (!(i != null && i.create)) return;
  const a = A(e), o = ve(a), s = n.slot, r = n.profile, l = t.blocked || !t.ok ? "Blocked" : t.handled ? "Activated" : "Unhandled", c = `
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
        ${r ? `<div><dt>Ship</dt><dd>${g(r.name)}</dd></div>` : ""}
        ${s ? `<div><dt>Slot</dt><dd>${g(s.label)}</dd></div>` : ""}
        ${a.activation.actionType ? `<div><dt>Action</dt><dd>${g(a.activation.actionType)}</dd></div>` : ""}
        ${a.activation.resourceCost ? `<div><dt>Resource</dt><dd>${g(a.activation.resourceCost)}</dd></div>` : ""}
        ${a.activation.cooldown ? `<div><dt>Cooldown</dt><dd>${a.activation.cooldown} rounds</dd></div>` : ""}
        ${a.durability.enabled ? `<div><dt>Durability</dt><dd>${o.value} / ${o.max}</dd></div>` : ""}
      </dl>
      ${(d = t.consequences) != null && d.length ? `<ul>${t.consequences.map((m) => `<li>${g(m)}</li>`).join("")}</ul>` : ""}
      ${t.message ? `<p>${g(t.message)}</p>` : ""}
    </article>
  `;
  await i.create({
    user: (p = game.user) == null ? void 0 : p.id,
    speaker: ((u = i.getSpeaker) == null ? void 0 : u.call(i)) ?? {},
    content: c
  });
}
async function Ve(e, t = {}) {
  const n = A(e);
  if (!n.enabled || !n.activation.enabled)
    return { ok: !1, handled: !1, blocked: !0, message: "That item is not configured as activatable ship equipment." };
  if (n.power.enabled && !n.power.online) {
    const u = { ok: !1, handled: !1, blocked: !0, message: "That ship equipment is offline." };
    return await _(e, u, t), u;
  }
  if (n.power.enabled && n.power.allocated < n.power.draw) {
    const u = { ok: !1, handled: !1, blocked: !0, message: "That ship equipment does not have enough allocated power." };
    return await _(e, u, t), u;
  }
  const i = ve(n);
  if (n.activation.blockWhenBroken && i.isBroken) {
    const u = { ok: !1, handled: !1, blocked: !0, message: "That ship equipment is broken." };
    return await _(e, u, t), u;
  }
  const a = Date.now(), o = Math.max(0, n.activation.cooldown) * 6e3;
  if (o > 0 && n.activation.lastActivatedAt > 0) {
    const u = n.activation.lastActivatedAt + o;
    if (u > a) {
      const m = Math.max(1, Math.ceil((u - a) / 6e3)), f = {
        ok: !1,
        handled: !1,
        blocked: !0,
        message: `That ship equipment is cooling down for ${m} more round${m === 1 ? "" : "s"}.`,
        consequences: [`Cooldown remaining: ${m} round${m === 1 ? "" : "s"}`]
      };
      return await _(e, f, t), f;
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
    return await _(e, u, t), u;
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
  if (Hooks.callAll(`${k}.activateEquipment`, s), s.blocked) {
    const u = {
      ok: !1,
      handled: s.handled === !0,
      blocked: !0,
      message: String(s.message || "Ship equipment activation was blocked."),
      consequences: s.consequences
    };
    return await _(e, u, t), u;
  }
  const r = [...s.consequences], l = {
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
    }, r.push(`Durability spent: ${n.activation.durabilityCost} (${u}/${i.max} remaining)`);
  }
  n.activation.resourceCost && r.push(`Resource cost: ${n.activation.resourceCost}`), n.activation.cooldown > 0 && r.push(`Cooldown started: ${n.activation.cooldown} round${n.activation.cooldown === 1 ? "" : "s"}`);
  let c = !1;
  try {
    c = !!await G(e, l, { requireGm: !1 });
  } catch (u) {
    console.warn(`${vt} | Failed to save activation consequences`, u);
  }
  !c && r.length && r.push("Consequence state could not be saved; check item permissions.");
  const d = s.handled === !0 || r.length > 0, p = {
    ok: !0,
    handled: d,
    blocked: !1,
    message: String(s.message || (d ? "Ship equipment activated." : "No system handled this ship equipment activation.")),
    consequences: r
  };
  return Hooks.callAll(`${k}.equipmentActivated`, { item: e, equipment: A(e), result: p, ...t }), await _(e, p, t), p;
}
function P() {
  const e = game.settings.get(k, we);
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const t = {};
  for (const n of Object.values(e)) {
    const i = O(n);
    t[i.id] = i;
  }
  return t;
}
function _e() {
  return Object.values(P()).sort((e, t) => e.name.localeCompare(t.name));
}
function ze() {
  var t;
  const e = _e();
  return (t = game.user) != null && t.isGM ? e : e.filter((n) => !n.permissions.hiddenFromPlayers);
}
function Ye() {
  return String(game.settings.get(k, be) || "");
}
async function Se(e) {
  await game.settings.set(k, be, e);
}
async function x(e, t = {}) {
  t.requireGm !== !1 && !q("save ship loadouts") || (await game.settings.set(k, we, e), U());
}
function J() {
  const e = game.settings.get(k, ye), t = Array.isArray(e) ? e.map((n) => String(n).trim()).filter(Boolean) : [];
  return t.length ? [...new Set(t)] : j;
}
async function fe(e) {
  var i;
  const t = String(e || "").trim();
  if (!t || !((i = game.user) != null && i.isGM)) return;
  const n = J();
  n.some((a) => a.toLowerCase() === t.toLowerCase()) || await game.settings.set(k, ye, [...n, t]);
}
function b() {
  const e = ze();
  if (!e.length) return null;
  if (!L || !e.some((t) => t.id === L)) {
    const t = Ye();
    L = e.some((n) => n.id === t) ? t : e[0].id;
  }
  return e.find((t) => t.id === L) ?? null;
}
function V(e = L) {
  const t = P()[e];
  return t ? O(t) : null;
}
async function We() {
  if (!q("create ship profiles")) return null;
  const e = O({
    id: D("ship"),
    name: "New Ship",
    shipClass: "",
    image: te,
    powerCapacity: 0,
    stats: [
      R({ id: D("stat"), label: "Speed", value: "6", note: "" }),
      R({ id: D("stat"), label: "Cruise Speed", value: "4", note: "Efficient travel" }),
      R({ id: D("stat"), label: "Fuel", value: "100%", note: "" }),
      R({ id: D("stat"), label: "Defense", value: "10", note: "" }),
      R({ id: D("stat"), label: "Capacity", value: "6", note: "Crew and passengers" }),
      R({ id: D("stat"), label: "Cargo", value: "2 tons", note: "Available hold" })
    ],
    slots: j.slice(0, 4).map((n) => F({
      id: D("slot"),
      label: n,
      category: n
    }))
  }), t = I(P());
  return t[e.id] = e, L = e.id, await Se(e.id), await x(t), e;
}
async function Xe(e, t) {
  if (!q("update ship profiles")) return null;
  const n = I(P()), i = n[e];
  if (!i) return null;
  const a = O({
    ...i,
    name: t.name,
    shipClass: t.shipClass,
    image: t.image,
    powerCapacity: t.powerCapacity,
    permissions: i.permissions,
    powerPresets: i.powerPresets,
    stats: i.stats,
    slots: i.slots
  });
  return n[e] = a, await x(n), a;
}
async function Ke(e, t) {
  if (!q("update HoloDock player rights")) return null;
  const n = I(P()), i = n[e];
  if (!i) return null;
  const a = O({
    ...i,
    permissions: {
      ...i.permissions,
      ...t
    }
  });
  return n[e] = a, await x(n), a;
}
async function Je(e, t) {
  var s, r;
  if (!q("save power presets")) return null;
  const n = I(P()), i = n[e];
  if (!i) return null;
  const a = [];
  for (const l of i.slots) {
    if (!l.itemUuid) continue;
    const c = await C(l.itemUuid), d = A(c);
    !d.enabled || !d.power.enabled || a.push(Ne({
      slotId: l.id,
      allocated: d.power.allocated,
      online: d.power.online
    }));
  }
  if (!a.length)
    return (r = (s = ui.notifications) == null ? void 0 : s.warn) == null || r.call(s, "No powered ship equipment is currently slotted."), null;
  const o = Fe({
    id: D("preset"),
    name: t,
    entries: a
  });
  return i.powerPresets = [...i.powerPresets ?? [], o], n[e] = O(i), await x(n), o;
}
async function Qe(e, t) {
  var s;
  if (!q("delete power presets")) return !1;
  const n = I(P()), i = n[e];
  if (!i) return !1;
  const a = (s = i.powerPresets) == null ? void 0 : s.find((r) => r.id === t);
  return !a || !await Dialog.confirm({
    title: "Delete Power Preset",
    content: `<p>Delete <strong>${g(a.name)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (i.powerPresets = i.powerPresets.filter((r) => r.id !== t), n[e] = O(i), await x(n), !0);
}
async function $t(e, t) {
  const n = [];
  let i = 0, a = 0, o = 0, s = 0, r = 0, l = 0;
  for (const c of t.entries) {
    const d = e.slots.find((h) => h.id === c.slotId), p = await C((d == null ? void 0 : d.itemUuid) ?? ""), u = A(p);
    if (!d || !p || !u.enabled || !u.power.enabled) {
      a += 1;
      continue;
    }
    const m = u.power.online, f = Math.max(0, u.power.allocated), w = Math.max(0, c.allocated);
    o += m ? f : 0, s += c.online ? w : 0, c.online ? r += 1 : l += 1, i += 1, (f !== w || m !== c.online) && n.push({
      slotId: d.id,
      itemName: String(p.name ?? "Ship Equipment"),
      slotLabel: d.label,
      currentText: `${m ? "Online" : "Offline"} / ${f}`,
      targetText: `${c.online ? "Online" : "Offline"} / ${w}`,
      stateClass: c.online ? "is-ready" : "is-offline"
    });
  }
  return { changes: n, appliedCount: i, missingCount: a, currentAllocated: o, targetAllocated: s, onlineCount: r, offlineCount: l };
}
async function Et(e, t) {
  var a, o;
  const n = await $t(e, t);
  if (!n.appliedCount)
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "That preset did not match any powered slotted equipment."), !1;
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
async function Ct(e, t, n) {
  var s, r;
  const i = globalThis.ChatMessage;
  if (!(i != null && i.create)) return;
  const a = t.entries.reduce((l, c) => c.online ? l + c.allocated : l, 0), o = t.entries.filter((l) => l.online).length;
  await i.create({
    user: (s = game.user) == null ? void 0 : s.id,
    speaker: ((r = i.getSpeaker) == null ? void 0 : r.call(i)) ?? {},
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
          <div><dt>Online</dt><dd>${o}/${t.entries.length}</dd></div>
        </dl>
      </article>
    `
  });
}
async function Ze(e, t) {
  var o, s, r, l;
  if (!q("apply power presets")) return !1;
  const n = V(e), i = n == null ? void 0 : n.powerPresets.find((c) => c.id === t);
  if (!n || !i || !await Et(n, i)) return !1;
  let a = 0;
  for (const c of i.entries) {
    const d = n.slots.find((m) => m.id === c.slotId), p = await C((d == null ? void 0 : d.itemUuid) ?? ""), u = A(p);
    !u.enabled || !u.power.enabled || (await G(p, {
      enabled: u.enabled,
      power: {
        ...u.power,
        allocated: c.allocated,
        online: c.online
      }
    }), a += 1);
  }
  return a ? ((l = (r = ui.notifications) == null ? void 0 : r.info) == null || l.call(r, `Applied power preset: ${i.name}`), await Ct(n, i, a), U(), !0) : ((s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, "That preset did not match any powered slotted equipment."), !1);
}
async function et(e = L) {
  if (!q("delete ship profiles")) return !1;
  const t = V(e);
  if (!t || !await Dialog.confirm({
    title: "Delete Ship Profile",
    content: `<p>Delete <strong>${g(t.name)}</strong>?</p>`,
    defaultYes: !1
  })) return !1;
  const i = I(P());
  return delete i[e], L = Object.keys(i)[0] ?? "", Ye() === e && await Se(L), await x(i), !0;
}
async function ke(e, t) {
  if (!q("edit ship statistics")) return null;
  const n = I(P()), i = n[e];
  if (!i) return null;
  const a = R(t), o = i.stats.findIndex((s) => s.id === a.id);
  return o >= 0 ? i.stats[o] = { ...i.stats[o], ...a } : i.stats.push(a), n[e] = O(i), await x(n), a;
}
async function tt(e, t) {
  if (!q("delete ship statistics")) return !1;
  const n = I(P()), i = n[e];
  if (!i) return !1;
  const a = i.stats.find((s) => s.id === t);
  return !a || !await Dialog.confirm({
    title: "Delete Ship Statistic",
    content: `<p>Delete <strong>${g(a.label)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (i.stats = i.stats.filter((s) => s.id !== t), n[e] = O(i), await x(n), !0);
}
async function it(e, t) {
  if (!q("edit equipment slots")) return null;
  const n = I(P()), i = n[e];
  if (!i) return null;
  const a = i.slots.findIndex((s) => s.id === t.id), o = F(a >= 0 ? { ...i.slots[a], ...t } : t);
  return a >= 0 ? i.slots[a] = o : i.slots.push(o), n[e] = O(i), await fe(o.category), o.requiredCategory && await fe(o.requiredCategory), await x(n), o;
}
async function nt(e, t) {
  if (!q("delete equipment slots")) return !1;
  const n = I(P()), i = n[e];
  if (!i) return !1;
  const a = i.slots.find((s) => s.id === t);
  return !a || !await Dialog.confirm({
    title: "Delete Equipment Slot",
    content: `<p>Delete <strong>${g(a.label)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (i.slots = i.slots.filter((s) => s.id !== t), n[e] = O(i), await x(n), !0);
}
async function me(e, t, n, i) {
  var s;
  if (!q("place equipment links")) return !1;
  const a = I(P()), o = (s = a[e]) == null ? void 0 : s.slots.find((r) => r.id === t);
  return o ? (o.anchorX = Math.min(100, Math.max(0, Number(n))), o.anchorY = Math.min(100, Math.max(0, Number(i))), await x(a), !0) : !1;
}
async function at(e, t) {
  var a;
  if (!q("clear equipment links")) return !1;
  const n = I(P()), i = (a = n[e]) == null ? void 0 : a.slots.find((o) => o.id === t);
  return i ? (delete i.anchorX, delete i.anchorY, await x(n), !0) : !1;
}
function ot(e) {
  const t = [];
  return e.requiredCategory && t.push(`Category: ${e.requiredCategory}`), e.requiredTags.length && t.push(`Tags: ${e.requiredTags.join(", ")}`), t.join(" | ");
}
function qe(e, t) {
  const n = A(t);
  return n.enabled ? n : ne({
    ...n,
    enabled: !0,
    category: e.requiredCategory || e.category
  });
}
function ae(e, t, n = qe(e, t)) {
  if (e.requiredCategory && n.category.toLowerCase() !== e.requiredCategory.toLowerCase())
    return { ok: !1, reason: `That slot requires ${e.requiredCategory} ship equipment.` };
  const i = new Set(n.tags.map((o) => o.toLowerCase())), a = e.requiredTags.filter((o) => !i.has(o.toLowerCase()));
  return a.length ? { ok: !1, reason: `That slot requires tag${a.length === 1 ? "" : "s"}: ${a.join(", ")}.` } : { ok: !0 };
}
async function Pt(e, t, n) {
  return Dialog.confirm({
    title: "Install Ship Equipment",
    content: `
      <section class="hd-install-confirm">
        <i class="fa-solid fa-shuttle-space"></i>
        <div>
          <p>Install <strong>${g((t == null ? void 0 : t.name) ?? "this item")}</strong> into <strong>${g(e.label)}</strong>?</p>
          ${n ? '<p class="hd-muted">This item will be converted into HoloDock ship equipment so it can be tracked by the ship.</p>' : '<p class="hd-muted">This item is already HoloDock ship equipment and will be assigned to this slot.</p>'}
        </div>
      </section>
    `,
    defaultYes: !0
  }, {
    classes: ["holodock-window", "hd-dialog", "hd-install-dialog"],
    width: 440
  });
}
function he(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 || (e == null ? void 0 : e.permissions.allowPlayerEquip) === !0;
}
function Tt(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 || (e == null ? void 0 : e.permissions.allowPlayerActivate) === !0;
}
async function Ae(e, t, n, i = {}) {
  var u, m;
  const a = await C(n);
  if (!a)
    return { ok: !1, message: "Drop a Foundry Item onto the equipment slot." };
  const o = I(P()), s = o[e], r = s == null ? void 0 : s.slots.find((f) => f.id === t);
  if (!s || !r) return { ok: !1, message: "That ship slot could not be found." };
  if (!s.permissions.allowPlayerEquip && !((u = game.user) != null && u.isGM))
    return { ok: !1, message: "Players are not allowed to install equipment on this ship." };
  if (r.itemUuid) return { ok: !1, message: "That equipment slot is already occupied." };
  const l = F(r), c = A(a), d = qe(l, a), p = ae(l, a, d);
  if (!p.ok)
    return { ok: !1, message: p.reason ?? "That item is not compatible with this ship slot." };
  if (!c.enabled) {
    const f = await G(a, d, { requireGm: ((m = game.user) == null ? void 0 : m.isGM) !== !0 ? !1 : void 0 });
    if (!(f != null && f.enabled)) return { ok: !1, message: "That item could not be converted into ship equipment." };
  }
  return r.itemUuid = a.uuid, await x(o), i.openEditor && !c.enabled && window.setTimeout(() => Y(a), 50), { ok: !0, message: `${a.name ?? "Item"} installed in ${l.label}.` };
}
function Dt() {
  var i;
  const e = game.users, n = (Array.isArray(e) ? e : Array.isArray(e == null ? void 0 : e.contents) ? e.contents : Array.from(e ?? [])).filter((a) => (a == null ? void 0 : a.active) && (a == null ? void 0 : a.isGM)).sort((a, o) => String(a.id ?? "").localeCompare(String(o.id ?? "")));
  return String(((i = n[0]) == null ? void 0 : i.id) ?? "");
}
function re(e) {
  var t, n;
  (n = (t = game.socket) == null ? void 0 : t.emit) == null || n.call(t, Be, e);
}
function It(e) {
  var i, a;
  const t = game.users, n = ((i = t == null ? void 0 : t.get) == null ? void 0 : i.call(t, e)) ?? ((a = t == null ? void 0 : t.find) == null ? void 0 : a.call(t, (o) => (o == null ? void 0 : o.id) === e));
  return String((n == null ? void 0 : n.name) || "A player");
}
async function xt(e) {
  const t = V(String(e.profileId || "")), n = t == null ? void 0 : t.slots.find((a) => a.id === e.slotId), i = await C(String(e.itemUuid || ""));
  return !t || !n || !i ? !1 : Dialog.confirm({
    title: "Player Ship Equipment Install",
    content: `
      <section class="hd-install-confirm">
        <i class="fa-solid fa-user-shield"></i>
        <div>
          <p><strong>${g(It(e.userId))}</strong> wants to install <strong>${g(i.name ?? "this item")}</strong>.</p>
          <p class="hd-muted">Ship: ${g(t.name)} | Slot: ${g(n.label)}</p>
          <p class="hd-muted">Approving will convert the item to HoloDock ship equipment if needed and place it in the empty slot.</p>
        </div>
      </section>
    `,
    defaultYes: !0
  }, {
    classes: ["holodock-window", "hd-dialog", "hd-install-dialog"],
    width: 480
  });
}
async function Lt(e, t, n) {
  var l, c, d, p, u, m, f, w, h, y, S;
  const i = globalThis.ChatMessage;
  if (!(i != null && i.create))
    return (c = (l = ui.notifications) == null ? void 0 : l.warn) == null || c.call(l, "Foundry chat is not available for ship equipment requests."), !1;
  const a = D("equip"), o = V(e), s = o == null ? void 0 : o.slots.find(($) => $.id === t), r = await C(n);
  return !o || !s || !r ? ((p = (d = ui.notifications) == null ? void 0 : d.warn) == null || p.call(d, "That ship equipment request could not be prepared."), !1) : (await i.create({
    user: (u = game.user) == null ? void 0 : u.id,
    speaker: ((m = i.getSpeaker) == null ? void 0 : m.call(i)) ?? {},
    content: `
      <article class="hd-chat-card hd-install-request-card" data-hd-install-request="${g(a)}" data-hd-profile-id="${g(e)}" data-hd-slot-id="${g(t)}" data-hd-item-uuid="${g(n)}" data-hd-user-id="${g(((f = game.user) == null ? void 0 : f.id) ?? "")}">
        <header>
          <img src="${g(r.img || "icons/svg/item-bag.svg")}" alt="">
          <div>
            <p class="hd-kicker">HoloDock Install Request</p>
            <h3>${g(r.name ?? "Ship Equipment")}</h3>
          </div>
        </header>
        <dl>
          <div><dt>Player</dt><dd>${g(((w = game.user) == null ? void 0 : w.name) ?? "Player")}</dd></div>
          <div><dt>Ship</dt><dd>${g(o.name)}</dd></div>
          <div><dt>Slot</dt><dd>${g(s.label)}</dd></div>
        </dl>
        <p>A player wants to install this item as HoloDock ship equipment.</p>
        <footer class="hd-chat-actions">
          <button type="button" data-hd-install-approve="${g(a)}"><i class="fa-solid fa-check"></i> Approve</button>
          <button type="button" data-hd-install-reject="${g(a)}"><i class="fa-solid fa-xmark"></i> Reject</button>
        </footer>
      </article>
    `,
    flags: {
      [k]: {
        installRequest: {
          requestId: a,
          userId: (h = game.user) == null ? void 0 : h.id,
          profileId: e,
          slotId: t,
          itemUuid: n,
          status: "pending"
        }
      }
    }
  }), (S = (y = ui.notifications) == null ? void 0 : y.info) == null || S.call(y, "HoloDock posted the install request to chat."), !0);
}
function Mt() {
  var e, t;
  (t = (e = game.socket) == null ? void 0 : e.on) == null || t.call(e, Be, async (n) => {
    var s, r, l, c, d, p;
    if (!n || typeof n != "object") return;
    if (n.action === "equipItemResult") {
      if (n.userId && n.userId !== ((s = game.user) == null ? void 0 : s.id)) return;
      n.ok ? (l = (r = ui.notifications) == null ? void 0 : r.info) == null || l.call(r, n.message ?? "Ship equipment installed.") : (d = (c = ui.notifications) == null ? void 0 : c.warn) == null || d.call(c, n.message ?? "Ship equipment could not be installed."), U();
      return;
    }
    if (n.action !== "equipItem" || !((p = game.user) != null && p.isGM) || game.user.id !== Dt()) return;
    const i = V(String(n.profileId || ""));
    if (!(i != null && i.permissions.allowPlayerEquip)) {
      re({
        action: "equipItemResult",
        requestId: n.requestId,
        userId: n.userId,
        ok: !1,
        message: "Players are not allowed to install equipment on this ship."
      });
      return;
    }
    if (!await xt(n)) {
      re({
        action: "equipItemResult",
        requestId: n.requestId,
        userId: n.userId,
        ok: !1,
        message: "The GM rejected the ship equipment install request."
      });
      return;
    }
    const o = await Ae(String(n.profileId || ""), String(n.slotId || ""), String(n.itemUuid || ""), { openEditor: !1 });
    re({
      action: "equipItemResult",
      requestId: n.requestId,
      userId: n.userId,
      ok: o.ok,
      message: o.message
    });
  });
}
function Ot(e, t = null) {
  const n = [e == null ? void 0 : e.document, e == null ? void 0 : e.message, e == null ? void 0 : e.object, e];
  for (const i of n)
    if (i != null && i.getFlag && (i != null && i.setFlag)) return i;
  return null;
}
async function Ht(e, t) {
  var a;
  const n = ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, k, "installRequest")) ?? {}, i = {
    requestId: String(n.requestId || t.dataset.hdInstallRequest || ""),
    userId: String(n.userId || t.dataset.hdUserId || ""),
    profileId: String(n.profileId || t.dataset.hdProfileId || ""),
    slotId: String(n.slotId || t.dataset.hdSlotId || ""),
    itemUuid: String(n.itemUuid || t.dataset.hdItemUuid || ""),
    status: String(n.status || "pending")
  };
  return i.requestId && i.profileId && i.slotId && i.itemUuid ? i : null;
}
async function Le(e, t, n) {
  var r, l, c;
  const i = ((r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, k, "installRequest")) ?? {};
  await ((l = e == null ? void 0 : e.setFlag) == null ? void 0 : l.call(e, k, "installRequest", { ...i, status: t, resultMessage: n }));
  const a = String((e == null ? void 0 : e.content) || ""), o = `<p class="hd-install-request-status ${t === "approved" ? "is-approved" : "is-rejected"}">${g(n)}</p>`, s = a.replace(/<footer class="hd-chat-actions">[\s\S]*?<\/footer>/, o);
  s !== a && await ((c = e == null ? void 0 : e.update) == null ? void 0 : c.call(e, { content: s }));
}
function Me(e, t = null) {
  const n = K(null, t), i = Ot(e, t);
  !n || !i || n.querySelectorAll("[data-hd-install-request]").forEach((a) => {
    const o = (s, r) => {
      var l;
      (l = a.querySelector(s)) == null || l.addEventListener("click", async (c) => {
        var p, u, m;
        if (c.preventDefault(), c.stopPropagation(), !((p = game.user) != null && p.isGM)) {
          (m = (u = ui.notifications) == null ? void 0 : u.warn) == null || m.call(u, "Only the GM can answer ship equipment install requests.");
          return;
        }
        const d = await Ht(i, a);
        !d || d.status !== "pending" || await r(d);
      });
    };
    o("[data-hd-install-approve]", async (s) => {
      var l, c, d, p;
      const r = await Ae(s.profileId, s.slotId, s.itemUuid, { openEditor: !1 });
      await Le(i, r.ok ? "approved" : "rejected", r.message), r.ok ? (c = (l = ui.notifications) == null ? void 0 : l.info) == null || c.call(l, r.message) : (p = (d = ui.notifications) == null ? void 0 : d.warn) == null || p.call(d, r.message);
    }), o("[data-hd-install-reject]", async () => {
      var s, r;
      await Le(i, "rejected", "The GM rejected the ship equipment install request."), (r = (s = ui.notifications) == null ? void 0 : s.info) == null || r.call(s, "Ship equipment install request rejected.");
    });
  });
}
async function $e(e, t, n) {
  var p, u, m, f, w, h, y, S, $;
  const i = V(e);
  if (!he(i))
    return (u = (p = ui.notifications) == null ? void 0 : p.warn) == null || u.call(p, "Players are not allowed to install equipment on this ship."), !1;
  const a = await C(n);
  if (!a)
    return (f = (m = ui.notifications) == null ? void 0 : m.warn) == null || f.call(m, "Drop a Foundry Item onto the equipment slot."), !1;
  const o = i == null ? void 0 : i.slots.find((T) => T.id === t);
  if (!o) return !1;
  const s = A(a), r = qe(F(o), a), l = ae(F(o), a, r);
  if (!l.ok)
    return (h = (w = ui.notifications) == null ? void 0 : w.warn) == null || h.call(w, l.reason ?? "That item is not compatible with this ship slot."), !1;
  if (!await Pt(F(o), a, !s.enabled)) return !1;
  if (!((y = game.user) != null && y.isGM)) return Lt(e, t, n);
  const d = await Ae(e, t, n, { openEditor: !0 });
  return d.ok || ($ = (S = ui.notifications) == null ? void 0 : S.warn) == null || $.call(S, d.message), d.ok;
}
async function ge(e, t) {
  var a;
  if (!q("remove equipped items")) return !1;
  const n = I(P()), i = (a = n[e]) == null ? void 0 : a.slots.find((o) => o.id === t);
  return i ? (delete i.itemUuid, await x(n), !0) : !1;
}
async function C(e) {
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
function Rt(e) {
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
function Bt(e) {
  var n, i, a;
  const t = ((i = (n = e == null ? void 0 : e.system) == null ? void 0 : n.description) == null ? void 0 : i.value) ?? ((a = e == null ? void 0 : e.system) == null ? void 0 : a.description) ?? (e == null ? void 0 : e.description) ?? "";
  return typeof t == "string" ? t.trim() : t != null && t.value ? String(t.value).trim() : "";
}
function st(e) {
  if (!e.enabled) return "";
  const t = [`Ship Equipment: ${e.category}`];
  return e.durability.enabled && e.durability.max > 0 && t.push(`Durability ${e.durability.value}/${e.durability.max}`), e.power.enabled && e.power.draw > 0 && t.push(`Power ${e.power.allocated}/${e.power.draw} ${e.power.online ? "online" : "offline"}`), t.join(" | ");
}
function Nt(e) {
  if (!e.enabled) return [];
  const t = [e.category];
  return e.activation.enabled && t.push("Activatable"), e.durability.enabled && t.push("Durability"), e.power.enabled && t.push("Power"), t;
}
function Ft(e) {
  const t = e.durability, { isBroken: n, isDamaged: i, value: a, max: o } = ve(e), s = e.power.enabled && !e.power.online, r = e.power.enabled && e.power.online && e.power.draw > 0 && e.power.allocated <= 0, l = e.power.enabled && e.power.online && !r && e.power.allocated < e.power.draw, c = Math.max(0, e.activation.cooldown) * 6e3, d = e.activation.lastActivatedAt + c, p = e.activation.enabled && c > 0 && e.activation.lastActivatedAt > 0 && d > Date.now(), u = p ? Math.max(1, Math.ceil((d - Date.now()) / 6e3)) : 0, m = s || r || l || p || e.activation.blockWhenBroken && n;
  return {
    ...e,
    badges: Nt(e),
    tagsText: e.tags.join(", "),
    hasTags: e.tags.length > 0,
    durability: {
      ...t,
      value: a,
      max: o,
      state: n ? "Broken" : i ? "Damaged" : "Intact",
      isBroken: n,
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
      isBlocked: m,
      isCoolingDown: p,
      cooldownRemaining: u,
      blockedReason: s ? "Equipment offline" : r ? "No power allocated" : l ? "Low allocated power" : p ? `Cooling down: ${u} round${u === 1 ? "" : "s"}` : n ? "Equipment broken" : ""
    }
  };
}
function rt(e) {
  const t = Math.max(0, v(e.powerCapacity, 0)), n = e.slots.reduce((r, l) => {
    var d, p;
    const c = (p = (d = l == null ? void 0 : l.item) == null ? void 0 : d.equipment) == null ? void 0 : p.power;
    return !(c != null && c.enabled) || c.online === !1 ? r : r + Math.max(0, v(c.allocated, c.draw ?? 0));
  }, 0), i = t > 0 ? t - n : 0, a = t > 0 ? Math.max(0, n - t) : 0, o = t > 0, s = o && n > t;
  return {
    capacity: t,
    used: n,
    remaining: i,
    overage: a,
    hasCapacity: o,
    isOverBudget: s,
    summary: o ? `${n} / ${t}` : `${n} draw`
  };
}
function Ut(e, t) {
  const n = new Map(t.map((a) => [a.id, a])), i = t.filter((a) => {
    var o, s, r;
    return (r = (s = (o = a.item) == null ? void 0 : o.equipment) == null ? void 0 : s.power) == null ? void 0 : r.enabled;
  });
  return e.powerPresets.map((a) => {
    const o = a.entries.reduce((f, w) => w.online ? f + w.allocated : f, 0), s = a.entries.filter((f) => f.online).length, r = Math.max(0, a.entries.length - s);
    let l = 0, c = 0, d = 0, p = 0;
    const u = a.entries.map((f) => {
      var S, $;
      const w = n.get(f.slotId), h = ($ = (S = w == null ? void 0 : w.item) == null ? void 0 : S.equipment) == null ? void 0 : $.power;
      if (!(h != null && h.enabled))
        return d += 1, null;
      l += 1;
      const y = h.allocated !== f.allocated || h.online !== f.online;
      return y && (c += 1), {
        slotId: f.slotId,
        itemName: w.item.name,
        currentText: `${h.online ? "Online" : "Offline"} / ${h.allocated}`,
        targetText: `${f.online ? "Online" : "Offline"} / ${f.allocated}`,
        changed: y,
        stateClass: f.online ? "is-ready" : "is-offline"
      };
    }).filter(Boolean).slice(0, 3);
    e.powerCapacity > 0 && (p = Math.max(0, o - e.powerCapacity));
    const m = i.length > 0 && a.entries.length === i.length && a.entries.every((f) => {
      var h, y, S;
      const w = (S = (y = (h = n.get(f.slotId)) == null ? void 0 : h.item) == null ? void 0 : y.equipment) == null ? void 0 : S.power;
      return (w == null ? void 0 : w.enabled) && w.allocated === f.allocated && w.online === f.online;
    });
    return {
      ...a,
      allocated: o,
      onlineEntries: s,
      offlineEntries: r,
      systemCount: a.entries.length,
      matchedEntries: l,
      changedEntries: c,
      missingEntries: d,
      previewChanges: u,
      hasPreviewChanges: u.length > 0,
      projectedOverage: p,
      isOverBudget: p > 0,
      summary: `${o} allocated | ${s}/${a.entries.length} online`,
      isCurrent: m
    };
  });
}
function Ee(e, t) {
  const n = t.map((i) => i.toLowerCase());
  return e.filter((i) => n.some((a) => i.label.toLowerCase().includes(a)));
}
function Ce(e, t) {
  return Ee(e, t)[0] ?? null;
}
function z(e, t, n, i = "Unset", a = t) {
  const o = Ce(e, n);
  return {
    label: t,
    value: (o == null ? void 0 : o.value) || i,
    inputValue: (o == null ? void 0 : o.value) || "",
    note: (o == null ? void 0 : o.note) || "",
    stat: o,
    statId: (o == null ? void 0 : o.id) || "",
    editLabel: (o == null ? void 0 : o.label) || a,
    isConfigured: !!o
  };
}
function lt(e, t, n, i) {
  const a = e[0] ?? null;
  return {
    label: t,
    value: (a == null ? void 0 : a.value) || "Unset",
    inputValue: (a == null ? void 0 : a.value) || "",
    note: (a == null ? void 0 : a.note) || (a ? a.label : "Add ship statistic"),
    icon: i,
    page: n,
    stateClass: a ? "is-ready" : "is-muted",
    stat: a,
    statId: (a == null ? void 0 : a.id) || "",
    editLabel: (a == null ? void 0 : a.label) || t,
    relatedStats: e.slice(1),
    hasRelatedStats: e.length > 1
  };
}
function jt(e) {
  const t = Ce(e, ["speed"]), n = Ee(e, ["max speed", "maximum speed", "top speed", "maximum"]).filter((o) => o.id !== (t == null ? void 0 : t.id)), i = [t, ...n].filter(Boolean);
  return {
    ...lt(i, "Speed", "speed", "fa-gauge-high"),
    metrics: [
      z(e, "Cruise", ["cruise"], "Unset", "Cruise Speed"),
      z(e, "Maximum", ["max speed", "maximum speed", "top speed", "maximum"], "Unset", "Maximum Speed"),
      z(e, "Thrust", ["thrust", "acceleration"])
    ]
  };
}
function Gt(e) {
  const t = Ce(e, ["capacity", "occupancy"]), n = Ee(e, ["passenger"]).filter((o) => o.id !== (t == null ? void 0 : t.id)), i = [t, ...n].filter(Boolean);
  return {
    ...lt(i, "Capacity", "capacity", "fa-users"),
    metrics: [
      z(e, "Crew", ["crew"]),
      z(e, "Berths", ["berth"]),
      z(e, "Cargo", ["cargo", "hold"]),
      z(e, "Life Support", ["life support", "life-support"])
    ]
  };
}
function Vt(e) {
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
function _t(e) {
  const t = e.slots.length, n = e.slots.filter((f) => f.item && !f.item.missing).length, i = Math.max(0, t - n), a = e.slots.filter((f) => {
    var w, h;
    return (h = (w = f.item) == null ? void 0 : w.equipment) == null ? void 0 : h.enabled;
  }).map((f) => {
    const w = f.item.equipment, h = w.power, y = w.durability, S = y.enabled && y.isBroken, $ = y.enabled && y.isDamaged, T = h.enabled && h.isOffline, H = h.enabled && h.isNoPower, W = h.enabled && h.isUnderpowered, se = w.activation.enabled, Te = S ? "Broken" : T ? "Offline" : H ? "No Power" : W ? "Low Power" : $ ? "Damaged" : "Ready", ut = `is-${Te.toLowerCase().replace(/\s+/g, "-")}`;
    return {
      slotId: f.id,
      slotLabel: f.label,
      itemName: f.item.name,
      itemImg: f.item.img,
      category: w.category,
      state: Te,
      stateClass: ut,
      icon: S ? "fa-triangle-exclamation" : T ? "fa-power-off" : H ? "fa-battery-empty" : W ? "fa-gauge-simple-low" : $ ? "fa-screwdriver-wrench" : "fa-circle-check",
      canActivate: se,
      activationLabel: w.activation.label,
      activationBlocked: w.activation.isBlocked,
      powerEnabled: h.enabled,
      powerDraw: h.draw,
      powerAllocated: h.allocated,
      powerAllocationText: h.allocationText,
      powerAllocationPercent: h.allocationPercent,
      powerState: h.state,
      durabilityEnabled: y.enabled,
      durabilityText: y.enabled ? `${y.value} / ${y.max}` : ""
    };
  }), o = a.filter((f) => f.state === "Broken").length, s = a.filter((f) => f.state === "Damaged").length, r = a.filter((f) => f.state === "Offline").length, l = a.filter((f) => f.state === "Low Power" || f.state === "No Power").length, c = a.filter((f) => f.powerEnabled).length, d = a.filter((f) => f.powerEnabled && f.powerState === "Online").length, p = jt(e.stats), u = Gt(e.stats), m = Vt({ power: e.power, systems: a, brokenSystems: o, damagedSystems: s, offlineSystems: r, underpoweredSystems: l });
  return {
    totalSlots: t,
    equippedSlots: n,
    emptySlots: i,
    systems: a,
    hasSystems: a.length > 0,
    brokenSystems: o,
    damagedSystems: s,
    offlineSystems: r,
    underpoweredSystems: l,
    poweredSystems: c,
    onlineSystems: d,
    condition: m,
    hasAlerts: e.power.isOverBudget || o > 0 || s > 0 || r > 0 || l > 0,
    speed: p,
    capacity: u,
    tiles: [
      { label: "Systems", value: `${n}/${t}`, note: i ? `${i} empty` : "All slots filled", icon: "fa-layer-group", page: "systems", stateClass: i ? "is-muted" : "is-ready" },
      { label: "Power", value: e.power.summary, note: e.power.hasCapacity ? `${e.power.remaining} remaining` : "capacity untracked", icon: e.power.isOverBudget ? "fa-triangle-exclamation" : "fa-bolt", page: "power", stateClass: e.power.isOverBudget ? "is-danger" : "is-ready" },
      { label: "Online", value: `${d}/${c}`, note: l ? `${l} underpowered` : c ? "powered systems" : "No power draw", icon: "fa-power-off", page: "systems", stateClass: r || l ? "is-warning" : "is-ready" },
      { label: "Integrity", value: o ? `${o} broken` : s ? `${s} damaged` : "Nominal", note: a.length ? "ship equipment" : "No systems", icon: o ? "fa-triangle-exclamation" : "fa-shield-halved", page: "damage", stateClass: o ? "is-danger" : s ? "is-warning" : "is-ready" },
      p,
      u
    ]
  };
}
function zt(e) {
  var n;
  const t = /* @__PURE__ */ new Map();
  for (const i of e) {
    const a = String(i.category || "Unassigned");
    t.has(a) || t.set(a, []), (n = t.get(a)) == null || n.push({
      ...i,
      isSelectedEquipment: i.id === M
    });
  }
  return Array.from(t.entries()).map(([i, a]) => ({
    category: i,
    count: a.length,
    equippedCount: a.filter((o) => o.item && !o.item.missing).length,
    slots: a
  }));
}
function Yt(e) {
  const t = e.filter((n) => n.item);
  return t.length ? ((!M || !t.some((n) => n.id === M)) && (M = t[0].id), t.find((n) => n.id === M) ?? null) : (M = "", null);
}
function Wt(e, t) {
  const n = e.filter((i) => {
    var a, o, s;
    return (s = (o = (a = i.item) == null ? void 0 : a.equipment) == null ? void 0 : o.power) == null ? void 0 : s.enabled;
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
      isNoPower: a.isNoPower,
      isUnderpowered: a.isUnderpowered
    };
  });
  return {
    nodes: n,
    hasNodes: n.length > 0,
    reactorLabel: t.hasCapacity ? `${t.used} / ${t.capacity}` : `${t.used} allocated`
  };
}
async function Xt(e) {
  const t = Number.isFinite(e.anchorX) && Number.isFinite(e.anchorY), n = ot(e), i = {
    ...e,
    hasAnchor: t,
    compatibilitySummary: n,
    hasCompatibilityRules: !!n
  };
  if (!e.itemUuid) return { ...i, item: null };
  const a = await C(e.itemUuid);
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
  const o = A(a), s = st(o), r = Ft(o), l = r.durability.isBroken ? "is-broken" : r.power.isOffline ? "is-offline" : r.power.isNoPower ? "is-no-power" : r.power.isUnderpowered ? "is-low-power" : r.durability.isDamaged ? "is-damaged" : r.enabled ? "is-online" : "is-untagged";
  return {
    ...i,
    item: {
      name: a.name ?? "Unnamed Item",
      img: a.img || "icons/svg/item-bag.svg",
      status: s,
      description: Bt(a),
      uuid: a.uuid,
      equipment: r
    },
    pinStateClass: l,
    statusClass: l,
    statusLabel: r.durability.isBroken ? "Broken" : r.power.state || r.durability.state
  };
}
async function Kt() {
  var r, l, c;
  const e = b();
  let t = null;
  const n = ((r = game.user) == null ? void 0 : r.isGM) === !0;
  let i = n, a = n;
  if (e) {
    i = n || e.permissions.allowPlayerEquip, a = n || e.permissions.allowPlayerActivate;
    const d = await Promise.all(e.slots.map(Xt)), p = rt({ ...e, slots: d }), u = _t({ slots: d, power: p, stats: e.stats }), m = new Set([
      (l = u.speed.stat) == null ? void 0 : l.id,
      (c = u.capacity.stat) == null ? void 0 : c.id,
      ...u.speed.relatedStats.map((h) => h.id),
      ...u.capacity.relatedStats.map((h) => h.id),
      ...u.speed.metrics.map((h) => {
        var y;
        return (y = h.stat) == null ? void 0 : y.id;
      }),
      ...u.capacity.metrics.map((h) => {
        var y;
        return (y = h.stat) == null ? void 0 : y.id;
      })
    ].filter(Boolean));
    u.tiles = u.tiles.map((h) => ({
      ...h,
      isActive: h.page === E || h.page === "systems" && E === "equipment" && h.label === "Systems"
    }));
    const f = Yt(d), w = d.map((h) => ({
      ...h,
      isSelectedEquipment: h.id === M
    }));
    t = {
      ...e,
      slots: w,
      power: p,
      powerPresets: Ut(e, d),
      hasPowerPresets: e.powerPresets.length > 0,
      dashboard: u,
      additionalStats: e.stats.filter((h) => !m.has(h.id)),
      hasAdditionalStats: e.stats.some((h) => !m.has(h.id)),
      equipmentCategories: zt(w),
      selectedEquipmentSlot: f,
      hasSelectedEquipment: !!f,
      powerGrid: Wt(d, p)
    };
  }
  const o = ze().map((d) => ({
    ...d,
    isSelected: d.id === L
  }));
  return !new Set(ue.map((d) => d.id)).has(E) && E !== "equipment" && (E = "overview"), {
    canEdit: n,
    canEquip: i,
    canActivateSystems: a,
    hasProfiles: o.length > 0,
    profiles: o,
    selectedProfile: t,
    pages: ue.map((d) => ({
      ...d,
      isActive: d.id === E
    })),
    activePage: E,
    isOverview: E === "overview",
    isSystems: E === "systems",
    isEquipment: E === "equipment",
    isPower: E === "power",
    isDamage: E === "damage",
    isSpeed: E === "speed",
    isCapacity: E === "capacity",
    categories: J()
  };
}
function K(e, t = null) {
  var n;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (n = e == null ? void 0 : e.element) != null && n[0] ? e.element[0] : (e == null ? void 0 : e.element) ?? null;
}
function U() {
  N != null && N.rendered && N.render(!0);
}
function Pe(e) {
  var i, a;
  const t = (e == null ? void 0 : e[0]) ?? e, n = ((i = t == null ? void 0 : t.querySelector) == null ? void 0 : i.call(t, "form")) ?? ((a = t == null ? void 0 : t.closest) == null ? void 0 : a.call(t, "form"));
  return Object.fromEntries(new FormData(n).entries());
}
function Jt(e) {
  var o, s;
  const t = (e == null ? void 0 : e[0]) ?? e, n = ((o = t == null ? void 0 : t.querySelector) == null ? void 0 : o.call(t, "form")) ?? ((s = t == null ? void 0 : t.closest) == null ? void 0 : s.call(t, "form")), i = new FormData(n), a = String(i.get("category") || "");
  return {
    id: String(i.get("id") || ""),
    label: a,
    category: a,
    description: String(i.get("description") || ""),
    requiredCategory: String(i.get("requiredCategory") || ""),
    requiredTags: je(i.get("requiredTags"))
  };
}
function Qt(e) {
  var a, o;
  const t = (e == null ? void 0 : e[0]) ?? e, n = ((a = t == null ? void 0 : t.querySelector) == null ? void 0 : a.call(t, "form")) ?? ((o = t == null ? void 0 : t.closest) == null ? void 0 : o.call(t, "form")), i = new FormData(n);
  return {
    hiddenFromPlayers: B(i, "hiddenFromPlayers"),
    allowPlayerEquip: B(i, "allowPlayerEquip"),
    allowPlayerActivate: B(i, "allowPlayerActivate")
  };
}
function Zt(e) {
  if (!q("set HoloDock player rights")) return;
  const t = Ue(e.permissions), n = (i) => i ? "checked" : "";
  new Dialog({
    title: `Player Rights: ${e.name}`,
    content: `
      <form class="hd-dialog-form hd-permissions-form">
        <label class="hd-check">
          <input type="checkbox" name="hiddenFromPlayers" ${n(t.hiddenFromPlayers)}>
          <span>Hide ship from players</span>
        </label>
        <label class="hd-check">
          <input type="checkbox" name="allowPlayerEquip" ${n(t.allowPlayerEquip)}>
          <span>Allow players to drag equipment into empty slots</span>
        </label>
        <label class="hd-check">
          <input type="checkbox" name="allowPlayerActivate" ${n(t.allowPlayerActivate)}>
          <span>Allow players to activate systems</span>
        </label>
        <p class="hd-muted">When activation is disabled, players keep a read-only ship view.</p>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (i) => Ke(e.id, Qt(i))
      },
      cancel: {
        icon: '<i class="fa-solid fa-xmark"></i>',
        label: "Cancel"
      }
    },
    default: "save"
  }, {
    classes: ["holodock-window", "hd-dialog"],
    width: 460
  }).render(!0);
}
function Oe(e = {}) {
  if (!q("edit equipment slots")) return;
  const t = b();
  if (!t) return;
  const n = F({ label: "New Slot", category: j[0], ...e }), i = J().map((a) => `<option value="${g(a)}">`).join("");
  new Dialog({
    title: e.id ? "Edit Equipment Slot" : "Add Equipment Slot",
    content: `
      <form class="hd-dialog-form">
        <input type="hidden" name="id" value="${g(n.id)}">
        <label>
          <span>Slot Type</span>
          <input type="text" name="category" value="${g(n.category)}" list="hd-slot-categories">
          <datalist id="hd-slot-categories">${i}</datalist>
        </label>
        <label>
          <span>Description</span>
          <textarea name="description" rows="4">${g(n.description)}</textarea>
        </label>
        <fieldset>
          <legend>Compatibility</legend>
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
        callback: (a) => it(t.id, Jt(a))
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
function le(e = {}) {
  if (!q("edit ship statistics")) return;
  const t = b();
  if (!t) return;
  const n = R({ label: "New Statistic", ...e });
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
        callback: (i) => ke(t.id, Pe(i))
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
function ei() {
  if (!q("save power presets")) return;
  const e = b();
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
          const n = Pe(t);
          return Je(e.id, n.name || "Power Mode");
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
function ti(e) {
  var o, s;
  const t = (e == null ? void 0 : e[0]) ?? e, n = ((o = t == null ? void 0 : t.querySelector) == null ? void 0 : o.call(t, "form")) ?? ((s = t == null ? void 0 : t.closest) == null ? void 0 : s.call(t, "form")), i = new FormData(n), a = String(i.get("tags") || "").split(",").map((r) => r.trim()).filter(Boolean);
  return ne({
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
function Y(e) {
  if (!q("tag ship equipment") || !e) return;
  const t = String(e.uuid ?? e.id ?? e.name ?? "item"), n = Date.now();
  if (t === Ie && n - xe < 500) return;
  Ie = t, xe = n;
  const i = A(e), a = J().map((s) => `<option value="${g(s)}">`).join(""), o = (s) => s ? "checked" : "";
  new Dialog({
    title: `Ship Equipment: ${e.name ?? "Item"}`,
    content: `
      <form class="hd-dialog-form hd-equipment-form">
        <label class="hd-check">
          <input type="checkbox" name="enabled" ${o(i.enabled)}>
          <span>Ship Equipment</span>
        </label>
        <label>
          <span>Category</span>
          <input type="text" name="category" value="${g(i.category)}" list="hd-equipment-categories">
          <datalist id="hd-equipment-categories">${a}</datalist>
        </label>
        <label>
          <span>Tags</span>
          <input type="text" name="tags" value="${g(i.tags.join(", "))}" placeholder="turret, external, sensor">
        </label>

        <fieldset>
          <legend>Activation</legend>
          <label class="hd-check">
            <input type="checkbox" name="activation.enabled" ${o(i.activation.enabled)}>
            <span>Can be activated</span>
          </label>
          <div class="hd-form-grid">
            <label>
              <span>Button Label</span>
              <input type="text" name="activation.label" value="${g(i.activation.label)}">
            </label>
            <label>
              <span>Action Type</span>
              <input type="text" name="activation.actionType" value="${g(i.activation.actionType)}" placeholder="attack, scan, repair">
            </label>
            <label>
              <span>Cooldown</span>
              <input type="number" min="0" step="1" name="activation.cooldown" value="${i.activation.cooldown}">
            </label>
            <label>
              <span>Resource Cost</span>
              <input type="text" name="activation.resourceCost" value="${g(i.activation.resourceCost)}">
            </label>
            <label>
              <span>Durability Cost</span>
              <input type="number" min="0" step="1" name="activation.durabilityCost" value="${i.activation.durabilityCost}">
            </label>
          </div>
          <label class="hd-check">
            <input type="checkbox" name="activation.blockWhenBroken" ${o(i.activation.blockWhenBroken)}>
            <span>Block activation when broken</span>
          </label>
        </fieldset>

        <fieldset>
          <legend>Durability</legend>
          <label class="hd-check">
            <input type="checkbox" name="durability.enabled" ${o(i.durability.enabled)}>
            <span>Has durability</span>
          </label>
          <div class="hd-form-grid">
            <label>
              <span>Current</span>
              <input type="number" min="0" step="1" name="durability.value" value="${i.durability.value}">
            </label>
            <label>
              <span>Maximum</span>
              <input type="number" min="0" step="1" name="durability.max" value="${i.durability.max}">
            </label>
            <label>
              <span>Broken At</span>
              <input type="number" min="0" step="1" name="durability.brokenAt" value="${i.durability.brokenAt}">
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Power</legend>
          <label class="hd-check">
            <input type="checkbox" name="power.enabled" ${o(i.power.enabled)}>
            <span>Requires power</span>
          </label>
          <label class="hd-check">
            <input type="checkbox" name="power.online" ${o(i.power.online)}>
            <span>Online</span>
          </label>
          <label>
            <span>Power Draw</span>
            <input type="number" min="0" step="1" name="power.draw" value="${i.power.draw}">
          </label>
          <label>
            <span>Starting Allocation</span>
            <input type="number" min="0" step="1" name="power.allocated" value="${i.power.allocated}">
          </label>
        </fieldset>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (s) => G(e, ti(s))
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
function ii(e) {
  if (!q("edit ship equipment durability")) return;
  const t = A(e);
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
          const i = Pe(n);
          return ie(e, v(i.value, t.durability.value));
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
function ni() {
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
function ai(e) {
  return ni().filter((t) => {
    var n;
    return (t == null ? void 0 : t.documentName) === "Item" || ((n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) === "Item";
  }).map((t) => {
    const n = A(t), i = ae(e, t);
    return {
      id: String(t.id ?? t.uuid ?? D("item")),
      uuid: String(t.uuid ?? ""),
      name: String(t.name ?? "Unnamed Item"),
      img: String(t.img || "icons/svg/item-bag.svg"),
      type: String(t.type || "Item"),
      status: st(n),
      compatible: i.ok,
      reason: i.reason ?? "",
      shipEquipment: n.enabled,
      category: n.enabled ? n.category : "",
      tagsText: n.tags.join(", ")
    };
  }).filter((t) => t.uuid).sort((t, n) => t.compatible !== n.compatible ? t.compatible ? -1 : 1 : t.shipEquipment !== n.shipEquipment ? t.shipEquipment ? -1 : 1 : t.name.localeCompare(n.name));
}
function He(e) {
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
function oi(e, t) {
  if (!q("equip items")) return;
  const n = V(e), i = n == null ? void 0 : n.slots.find((c) => c.id === t);
  if (!n || !i) return;
  const a = F(i), o = ai(a), s = o.filter((c) => c.compatible), r = o.filter((c) => !c.compatible), l = new Dialog({
    title: `Choose Equipment: ${i.label}`,
    content: `
      <section class="hd-equipment-browser">
        <p class="hd-muted">${g(ot(a) || "No slot compatibility rules set.")}</p>
        <div class="hd-equipment-pick-list">
          ${s.length ? s.map(He).join("") : '<p class="hd-muted">No compatible world items found.</p>'}
        </div>
        ${r.length ? `
          <details class="hd-incompatible-equipment">
            <summary>${r.length} incompatible item${r.length === 1 ? "" : "s"}</summary>
            <div class="hd-equipment-pick-list">
              ${r.map(He).join("")}
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
    width: 700,
    height: 640
  });
  l.render(!0), window.setTimeout(() => {
    const c = K(l);
    c == null || c.querySelectorAll("[data-hd-pick-item]").forEach((d) => {
      d.addEventListener("click", async () => {
        const p = d.dataset.hdPickItem ?? "";
        await $e(n.id, i.id, p) && l.close();
      });
    });
  }, 0);
}
function oe(e) {
  var n, i, a;
  const t = [
    e == null ? void 0 : e.document,
    e == null ? void 0 : e.item,
    e == null ? void 0 : e.object,
    e == null ? void 0 : e._document,
    (n = e == null ? void 0 : e.options) == null ? void 0 : n.document
  ];
  for (const o of t) {
    if (!o) continue;
    const s = o.documentName ?? ((i = o.constructor) == null ? void 0 : i.documentName), r = String(((a = o.constructor) == null ? void 0 : a.name) ?? "");
    if (s === "Item" || r.includes("Item") && o.type !== void 0 && o.setFlag && o.getFlag) return o;
  }
  return null;
}
function Z(e, t) {
  var a;
  if (!((a = game.user) != null && a.isGM)) return;
  const n = oe(e);
  if (!n || !Array.isArray(t) || t.some((o) => (o == null ? void 0 : o.class) === "hd-edit-equipment" || (o == null ? void 0 : o.className) === "hd-edit-equipment")) return;
  const i = {
    label: "Ship Equipment",
    title: "HoloDock Ship Equipment",
    class: "hd-edit-equipment",
    className: "hd-edit-equipment",
    icon: "fa-solid fa-shuttle-space",
    onclick: () => Y(n),
    onClick: () => Y(n)
  };
  t.unshift(i);
}
function si(e, t) {
  var i;
  if (!((i = game.user) != null && i.isGM)) return;
  const n = oe(e);
  !n || !Array.isArray(t) || t.some((a) => (a == null ? void 0 : a.action) === "holodockShipEquipment" || (a == null ? void 0 : a.class) === "hd-edit-equipment") || t.unshift({
    action: "holodockShipEquipment",
    label: "Ship Equipment",
    title: "HoloDock Ship Equipment",
    icon: "fa-solid fa-shuttle-space",
    class: "hd-edit-equipment",
    visible: !0,
    ownership: "OWNER",
    onClick: () => Y(n),
    onclick: () => Y(n)
  });
}
function ct(e, t = null) {
  var r, l, c, d, p, u, m;
  const n = K(null, t), i = ((r = e == null ? void 0 : e.element) == null ? void 0 : r[0]) ?? (e == null ? void 0 : e.element) ?? ((l = e == null ? void 0 : e._element) == null ? void 0 : l[0]) ?? (e == null ? void 0 : e._element), a = ((c = e == null ? void 0 : e.window) == null ? void 0 : c.element) ?? ((d = e == null ? void 0 : e.window) == null ? void 0 : d.frame), o = e != null && e.id && ((p = globalThis.CSS) != null && p.escape) ? CSS.escape(e.id) : "", s = [
    a,
    (u = i == null ? void 0 : i.closest) == null ? void 0 : u.call(i, ".application, .app, .window-app"),
    i,
    (m = n == null ? void 0 : n.closest) == null ? void 0 : m.call(n, ".application, .app, .window-app"),
    e != null && e.id ? document.getElementById(e.id) : null,
    o ? document.querySelector(`#${o}`) : null,
    e != null && e.appId ? document.querySelector(`[data-appid="${e.appId}"], [data-application-id="${e.appId}"]`) : null
  ];
  for (const f of s)
    if (f instanceof HTMLElement) return f;
  return null;
}
function ee(e, t = null) {
  var l;
  if (!((l = game.user) != null && l.isGM)) return;
  const n = oe(e);
  if (!n) return;
  const i = ct(e, t);
  if (!i || i.querySelector(".hd-edit-equipment, [data-hd-edit-equipment]")) return;
  const a = i.querySelector(".window-header, header.window-header, .app-header, header");
  if (!a) return;
  const o = document.createElement("button");
  o.type = "button", o.className = "hd-edit-equipment hd-item-sheet-header-fallback", o.dataset.hdEditEquipment = "true", o.title = "HoloDock Ship Equipment", o.innerHTML = '<i class="fa-solid fa-shuttle-space"></i><span class="sr-only">Ship Equipment</span>', o.addEventListener("click", (c) => {
    c.preventDefault(), c.stopPropagation(), Y(n);
  });
  const s = a.querySelector(".window-controls, .header-controls, .window-header-buttons, .window-buttons, menu"), r = a.querySelector(".close, [data-action='close']");
  s ? s.prepend(o) : r ? a.insertBefore(o, r) : a.append(o);
}
function ri(e, t = null) {
  ee(e, t), window.setTimeout(() => ee(e, t), 0), window.setTimeout(() => ee(e, t), 100), window.setTimeout(() => ee(e, t), 300);
}
function X(e, t = null) {
  ri(e, t);
  const n = ct(e, t), i = oe(e);
  !n || !i || n.dataset.hdEquipmentHeaderListener === "true" || (n.dataset.hdEquipmentHeaderListener = "true", n.addEventListener("click", (a) => {
    var s, r;
    (r = (s = a.target) == null ? void 0 : s.closest) != null && r.call(s, "[data-action='holodockShipEquipment'], .hd-edit-equipment") && (a.preventDefault(), a.stopPropagation(), Y(i));
  }));
}
class li extends kt {
  constructor() {
    super(...arguments);
    Q(this, "linkingSlotId", "");
    Q(this, "linkResizeObserver");
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holodock",
      title: "HoloDock - Ship Loadout",
      classes: ["holodock-window"],
      template: Re,
      popOut: !0,
      resizable: !0,
      width: 1280,
      height: 820
    });
  }
  async getData() {
    return Kt();
  }
  activateListeners(n) {
    var a, o;
    super.activateListeners(n);
    const i = K(this, n);
    i && ((a = i.querySelector("[data-hd-profile-select]")) == null || a.addEventListener("change", (s) => {
      L = s.currentTarget.value, M = "", Se(L).finally(() => this.render(!0));
    }), i.querySelectorAll("[data-hd-page]").forEach((s) => {
      s.addEventListener("click", (r) => {
        const l = r.currentTarget.dataset.hdPage ?? "overview";
        ue.some((c) => c.id === l) && (E = l, this.render(!0));
      });
    }), i.querySelectorAll("[data-hd-select-equipment]").forEach((s) => {
      s.addEventListener("click", (r) => {
        M = r.currentTarget.dataset.hdSelectEquipment ?? "", E = "equipment", this.render(!0);
      });
    }), (o = i.querySelector("[data-hd-profile-form]")) == null || o.addEventListener("submit", async (s) => {
      s.preventDefault();
      const r = b();
      if (!r) return;
      const l = Object.fromEntries(new FormData(s.currentTarget).entries());
      await Xe(r.id, l);
    }), i.querySelectorAll("[data-hd-action]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        const l = r.currentTarget.dataset.hdAction, c = b();
        l === "create-profile" && await We(), l === "delete-profile" && await et(c == null ? void 0 : c.id), l === "create-slot" && Oe(), l === "create-stat" && le(), l === "browse-image" && this.browseShipImage(), l === "save-power-preset" && ei(), l === "profile-permissions" && c && Zt(c);
      });
    }), i.querySelectorAll("[data-hd-apply-power-preset]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        const l = b(), c = r.currentTarget.dataset.hdApplyPowerPreset ?? "";
        l && await Ze(l.id, c);
      });
    }), i.querySelectorAll("[data-hd-delete-power-preset]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        const l = b(), c = r.currentTarget.dataset.hdDeletePowerPreset ?? "";
        l && await Qe(l.id, c);
      });
    }), i.querySelectorAll("[data-hd-edit-stat]").forEach((s) => {
      s.addEventListener("click", (r) => {
        const l = b(), c = l == null ? void 0 : l.stats.find((d) => d.id === r.currentTarget.dataset.hdEditStat);
        c && le(c);
      });
    }), i.querySelectorAll("[data-hd-add-stat-label]").forEach((s) => {
      s.addEventListener("click", (r) => {
        const l = r.currentTarget.dataset.hdAddStatLabel ?? "New Statistic";
        le({ label: l, value: "", note: "" });
      });
    }), i.querySelectorAll("[data-hd-stat-value]").forEach((s) => {
      const r = async (l) => {
        const c = b(), d = l.currentTarget;
        if (d.dataset.hdSavingValue !== "true" && c && !(!d.dataset.hdStatValue && d.value.trim() === "")) {
          d.dataset.hdSavingValue = "true";
          try {
            const p = d.dataset.hdStatNote || "", u = await ke(c.id, {
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
        const l = b(), c = r.currentTarget.dataset.hdDeleteStat ?? "";
        l && await tt(l.id, c);
      });
    }), i.querySelectorAll("[data-hd-edit-slot]").forEach((s) => {
      s.addEventListener("click", (r) => {
        const l = b(), c = l == null ? void 0 : l.slots.find((d) => d.id === r.currentTarget.dataset.hdEditSlot);
        c && Oe(c);
      });
    }), i.querySelectorAll("[data-hd-delete-slot]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        const l = b(), c = r.currentTarget.dataset.hdDeleteSlot ?? "";
        l && await nt(l.id, c);
      });
    }), i.querySelectorAll("[data-hd-browse-equipment]").forEach((s) => {
      s.addEventListener("click", (r) => {
        const l = b(), c = r.currentTarget.dataset.hdBrowseEquipment ?? "";
        l && oi(l.id, c);
      });
    }), i.querySelectorAll("[data-hd-open-item]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        var p, u, m;
        const l = b(), c = l == null ? void 0 : l.slots.find((f) => f.id === r.currentTarget.dataset.hdOpenItem), d = await C((c == null ? void 0 : c.itemUuid) ?? "");
        (p = d == null ? void 0 : d.sheet) != null && p.render ? d.sheet.render(!0) : (m = (u = ui.notifications) == null ? void 0 : u.warn) == null || m.call(u, "That item could not be found.");
      });
    }), i.querySelectorAll("[data-hd-activate-equipment]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        var m, f, w, h, y, S, $, T, H, W;
        const l = b(), c = r.currentTarget.dataset.hdActivateEquipment ?? "", d = l == null ? void 0 : l.slots.find((se) => se.id === c), p = await C((d == null ? void 0 : d.itemUuid) ?? "");
        if (!Tt(l)) {
          (f = (m = ui.notifications) == null ? void 0 : m.warn) == null || f.call(m, "Players have read-only access to this ship.");
          return;
        }
        if (!p || !l || !d) {
          (h = (w = ui.notifications) == null ? void 0 : w.warn) == null || h.call(w, "That ship equipment could not be found.");
          return;
        }
        const u = await Ve(p, { profile: l, slot: d });
        u.blocked || !u.ok ? (S = (y = ui.notifications) == null ? void 0 : y.warn) == null || S.call(y, u.message) : u.handled ? u.message && ((W = (H = ui.notifications) == null ? void 0 : H.info) == null || W.call(H, u.message)) : (T = ($ = ui.notifications) == null ? void 0 : $.info) == null || T.call($, u.message);
      });
    }), i.querySelectorAll("[data-hd-durability-adjust]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        var m, f;
        const l = b(), c = r.currentTarget, d = l == null ? void 0 : l.slots.find((w) => w.id === c.dataset.hdDurabilityAdjust), p = await C((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (f = (m = ui.notifications) == null ? void 0 : m.warn) == null || f.call(m, "That ship equipment could not be found.");
          return;
        }
        const u = A(p);
        !u.enabled || !u.durability.enabled || await ie(p, u.durability.value + v(c.dataset.hdDurabilityDelta, 0));
      });
    }), i.querySelectorAll("[data-hd-durability-set]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        var p, u;
        const l = b(), c = l == null ? void 0 : l.slots.find((m) => m.id === r.currentTarget.dataset.hdDurabilitySet), d = await C((c == null ? void 0 : c.itemUuid) ?? "");
        d ? ii(d) : (u = (p = ui.notifications) == null ? void 0 : p.warn) == null || u.call(p, "That ship equipment could not be found.");
      });
    }), i.querySelectorAll("[data-hd-durability-value]").forEach((s) => {
      s.addEventListener("change", async (r) => {
        var u, m;
        const l = b(), c = r.currentTarget, d = l == null ? void 0 : l.slots.find((f) => f.id === c.dataset.hdDurabilityValue), p = await C((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (m = (u = ui.notifications) == null ? void 0 : u.warn) == null || m.call(u, "That ship equipment could not be found.");
          return;
        }
        await ie(p, v(c.value, 0));
      });
    }), i.querySelectorAll("[data-hd-power-toggle]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        var m, f;
        const l = b(), c = r.currentTarget, d = l == null ? void 0 : l.slots.find((w) => w.id === c.dataset.hdPowerToggle), p = await C((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (f = (m = ui.notifications) == null ? void 0 : m.warn) == null || f.call(m, "That ship equipment could not be found.");
          return;
        }
        const u = A(p);
        !u.enabled || !u.power.enabled || await Ge(p, c.dataset.hdPowerOnline === "true");
      });
    }), i.querySelectorAll("[data-hd-power-adjust]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        var m, f;
        const l = b(), c = r.currentTarget, d = l == null ? void 0 : l.slots.find((w) => w.id === c.dataset.hdPowerAdjust), p = await C((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (f = (m = ui.notifications) == null ? void 0 : m.warn) == null || f.call(m, "That ship equipment could not be found.");
          return;
        }
        const u = A(p);
        !u.enabled || !u.power.enabled || await pe(p, u.power.allocated + v(c.dataset.hdPowerDelta, 0));
      });
    }), i.querySelectorAll("[data-hd-power-allocation]").forEach((s) => {
      s.addEventListener("change", async (r) => {
        var u, m;
        const l = b(), c = r.currentTarget, d = l == null ? void 0 : l.slots.find((f) => f.id === c.dataset.hdPowerAllocation), p = await C((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (m = (u = ui.notifications) == null ? void 0 : u.warn) == null || m.call(u, "That ship equipment could not be found.");
          return;
        }
        await pe(p, v(c.value, 0));
      });
    }), i.querySelectorAll("[data-hd-remove-item]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        const l = b(), c = r.currentTarget.dataset.hdRemoveItem ?? "";
        l && await ge(l.id, c);
      });
    }), this.activateSlotDrops(i), this.activateSlotAnchors(i), window.requestAnimationFrame(() => this.syncShipLinks(i)), window.setTimeout(() => this.syncShipLinks(i), 100));
  }
  activateSlotDrops(n) {
    n.querySelectorAll("[data-hd-slot-id]").forEach((i) => {
      i.addEventListener("dragover", (a) => {
        const o = b(), s = i.dataset.hdSlotId ?? "", r = o == null ? void 0 : o.slots.find((l) => l.id === s);
        !o || !he(o) || r != null && r.itemUuid || (a.preventDefault(), i.classList.add("is-drop-hover"));
      }), i.addEventListener("dragleave", () => i.classList.remove("is-drop-hover")), i.addEventListener("drop", async (a) => {
        var d, p;
        i.classList.remove("is-drop-hover"), a.preventDefault();
        const o = b(), s = i.dataset.hdSlotId ?? "", r = o == null ? void 0 : o.slots.find((u) => u.id === s);
        if (!o || !he(o) || r != null && r.itemUuid) return;
        const l = Rt(a), c = l.uuid ?? l.documentUuid ?? l.itemUuid ?? "";
        if (!o || !c) {
          (p = (d = ui.notifications) == null ? void 0 : d.warn) == null || p.call(d, "Drop a Foundry Item onto an equipment slot.");
          return;
        }
        await $e(o.id, s, c);
      }), i.addEventListener("contextmenu", async (a) => {
        var r;
        if (!((r = game.user) != null && r.isGM)) return;
        a.preventDefault();
        const o = b(), s = i.dataset.hdSlotId ?? "";
        o && await ge(o.id, s);
      });
    });
  }
  activateSlotAnchors(n) {
    var a, o, s;
    const i = n.querySelector("[data-hd-ship-map]");
    i && ((a = this.linkResizeObserver) == null || a.disconnect(), this.linkResizeObserver = void 0, typeof ResizeObserver < "u" && (this.linkResizeObserver = new ResizeObserver(() => this.syncShipLinks(n)), this.linkResizeObserver.observe(n.querySelector(".hd-stage") ?? n)), (o = n.querySelector(".hd-slot-rail")) == null || o.addEventListener("scroll", () => this.syncShipLinks(n)), (s = i.querySelector("img")) == null || s.addEventListener("load", () => this.syncShipLinks(n)), n.querySelectorAll("[data-hd-link-slot]").forEach((r) => {
      r.addEventListener("click", () => {
        var l;
        (l = game.user) != null && l.isGM && (this.linkingSlotId = r.dataset.hdLinkSlot ?? "", n.classList.toggle("is-linking-slot", !!this.linkingSlotId));
      });
    }), n.querySelectorAll("[data-hd-clear-link]").forEach((r) => {
      r.addEventListener("click", async () => {
        const l = b(), c = r.dataset.hdClearLink ?? "";
        l && await at(l.id, c);
      });
    }), i.addEventListener("click", async (r) => {
      var p;
      if (!((p = game.user) != null && p.isGM) || !this.linkingSlotId) return;
      r.preventDefault();
      const l = b(), c = this.getImageAnchorPoint(i, r.clientX, r.clientY), d = this.linkingSlotId;
      this.linkingSlotId = "", n.classList.remove("is-linking-slot"), l && await me(l.id, d, c.x, c.y);
    }), n.querySelectorAll("[data-hd-anchor-slot]").forEach((r) => {
      r.addEventListener("click", (l) => {
        var d;
        l.preventDefault(), l.stopPropagation();
        const c = r.dataset.hdAnchorSlot ?? "";
        !c || (d = game.user) != null && d.isGM || (M = c, E = "equipment", this.render(!0));
      }), r.addEventListener("pointerdown", (l) => {
        var w;
        if (!((w = game.user) != null && w.isGM)) return;
        l.preventDefault();
        const c = r.dataset.hdAnchorSlot ?? "", d = l.clientX, p = l.clientY;
        let u = !1;
        const m = (h) => {
          (Math.abs(h.clientX - d) > 3 || Math.abs(h.clientY - p) > 3) && (u = !0);
          const y = this.getImageAnchorPoint(i, h.clientX, h.clientY);
          r.dataset.hdAnchorX = String(y.x), r.dataset.hdAnchorY = String(y.y), this.syncShipLinks(n);
        }, f = async (h) => {
          if (window.removeEventListener("pointermove", m), window.removeEventListener("pointerup", f), !u) {
            M = c, E = "equipment", this.render(!0);
            return;
          }
          const y = b(), S = this.getImageAnchorPoint(i, h.clientX, h.clientY);
          y && await me(y.id, c, S.x, S.y);
        };
        window.addEventListener("pointermove", m), window.addEventListener("pointerup", f);
      });
    }));
  }
  getImageAnchorPoint(n, i, a) {
    const o = this.getShipImageRect(n), s = Math.min(100, Math.max(0, (i - o.left) / o.width * 100)), r = Math.min(100, Math.max(0, (a - o.top) / o.height * 100));
    return { x: s, y: r };
  }
  getShipImageRect(n) {
    const i = n.querySelector("img"), a = i == null ? void 0 : i.getBoundingClientRect();
    if (a != null && a.width && (a != null && a.height) && (i != null && i.naturalWidth) && (i != null && i.naturalHeight)) {
      const o = i.naturalWidth / i.naturalHeight, s = a.width / a.height;
      if (o > s) {
        const c = a.width / o, d = a.top + (a.height - c) / 2;
        return new DOMRect(a.left, d, a.width, c);
      }
      const r = a.height * o, l = a.left + (a.width - r) / 2;
      return new DOMRect(l, a.top, r, a.height);
    }
    return a != null && a.width && (a != null && a.height) ? a : n.getBoundingClientRect();
  }
  positionSlotPins(n) {
    const i = n.querySelector("[data-hd-ship-map]");
    if (!i) return;
    const a = this.getShipImageRect(i), o = i.getBoundingClientRect();
    n.querySelectorAll("[data-hd-anchor-slot]").forEach((s) => {
      const r = Number(s.dataset.hdAnchorX), l = Number(s.dataset.hdAnchorY);
      if (!Number.isFinite(r) || !Number.isFinite(l)) return;
      const c = a.left - o.left + a.width * r / 100, d = a.top - o.top + a.height * l / 100;
      s.style.left = `${c}px`, s.style.top = `${d}px`;
    });
  }
  syncShipLinks(n) {
    this.positionSlotPins(n), this.drawSlotLinks(n);
  }
  getSlotCardVisibility(n, i) {
    const a = n.querySelector(".hd-slot-rail");
    if (!a) return 1;
    const o = a.getBoundingClientRect(), s = i.getBoundingClientRect();
    if (!s.height || !o.height) return 1;
    const r = Math.max(s.top, o.top), l = Math.min(s.bottom, o.bottom), c = Math.max(0, l - r);
    return Math.min(1, Math.max(0, c / s.height));
  }
  drawSlotLinks(n) {
    const i = n.querySelector("[data-hd-link-lines]"), a = n.querySelector("[data-hd-ship-map]");
    if (!i || !a) return;
    const o = i.getBoundingClientRect(), s = Math.max(1, Math.round(o.width)), r = Math.max(1, Math.round(o.height));
    i.setAttribute("viewBox", `0 0 ${s} ${r}`), i.setAttribute("width", String(s)), i.setAttribute("height", String(r)), i.innerHTML = "", n.querySelectorAll("[data-hd-anchor-slot]").forEach((l) => {
      const c = l.dataset.hdAnchorSlot ?? "", d = n.querySelector(`[data-hd-slot-card="${c}"]`);
      if (!d) return;
      const p = l.getBoundingClientRect(), u = d.getBoundingClientRect(), m = p.left + p.width / 2 - o.left, f = p.top + p.height / 2 - o.top, w = u.left - o.left, h = u.top + u.height / 2 - o.top, y = Math.max(40, Math.abs(w - m) / 2), $ = 0.12 + this.getSlotCardVisibility(n, d) * 0.83, T = document.createElementNS("http://www.w3.org/2000/svg", "path");
      T.setAttribute("d", `M ${m} ${f} C ${m + y} ${f}, ${w - y} ${h}, ${w} ${h}`), T.setAttribute("class", `hd-link-line ${l.dataset.hdAnchorState || ""}`.trim()), T.style.opacity = $.toFixed(2), i.append(T);
    });
  }
  browseShipImage() {
    var a, o;
    if (!q("choose ship images")) return;
    const n = K(this), i = n == null ? void 0 : n.querySelector("[data-hd-profile-form] input[name='image']");
    if (!i || typeof FilePicker > "u") {
      (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Foundry FilePicker is not available.");
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
    return (i = this.linkResizeObserver) == null || i.disconnect(), this.linkResizeObserver = void 0, N = null, super.close(n);
  }
}
async function dt() {
  return N || (N = new li()), await N.render(!0), N;
}
function ci() {
  game.settings.register(k, we, {
    name: "HoloDock Ship Profiles",
    hint: "World-level ship profile and loadout data.",
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: U
  }), game.settings.register(k, ye, {
    name: "HoloDock Slot Categories",
    hint: "Reusable equipment slot categories for HoloDock.",
    scope: "world",
    config: !1,
    type: Array,
    default: j,
    onChange: U
  }), game.settings.register(k, be, {
    name: "HoloDock Default Ship Profile",
    hint: "The ship profile this user opens by default.",
    scope: "client",
    config: !1,
    type: String,
    default: "",
    onChange: U
  });
}
function di() {
  const e = {
    open: dt,
    getProfiles: _e,
    getProfile: V,
    createProfile: We,
    updateProfileMetadata: Xe,
    updateProfilePermissions: Ke,
    deleteProfile: et,
    capturePowerPreset: Je,
    applyPowerPreset: Ze,
    deletePowerPreset: Qe,
    upsertSlot: it,
    deleteSlot: nt,
    upsertStat: ke,
    deleteStat: tt,
    setSlotAnchor: me,
    clearSlotAnchor: at,
    equipItem: $e,
    unequipItem: ge,
    getCategories: J,
    getShipPowerBudget: rt,
    getShipEquipmentData: A,
    isShipEquipment: At,
    validateItemForSlot: ae,
    setShipEquipmentData: G,
    updateShipEquipmentDurability: ie,
    updateShipEquipmentPowerState: Ge,
    updateShipEquipmentPowerAllocation: pe,
    activateEquipment: Ve
  };
  game.holodock = e;
  const t = game.modules.get(k);
  t && (t.api = e);
}
function pi() {
  const e = game.modules.get("holosuite-core");
  return (e != null && e.active ? e.api : null) ?? game.holosuite ?? globalThis.HoloSuiteCoreApi ?? null;
}
function ce() {
  const e = pi();
  if (!(e != null && e.registerApp)) return !1;
  const t = {
    id: k,
    title: "HoloDock",
    icon: "fa-solid fa-shuttle-space",
    premium: !1,
    playerVisible: !0,
    description: "View and manage system-agnostic ship loadouts.",
    open: () => dt()
  };
  return e.registerApp(t), !0;
}
function fi() {
  if (ce()) return;
  let e = 0;
  const t = () => {
    e += 1, !(ce() || e >= 20) && window.setTimeout(t, 250);
  };
  Hooks.once("holosuite-core.apiReady", () => ce()), window.setTimeout(t, 250);
}
Hooks.once("init", async () => {
  ci(), Handlebars.registerHelper("hdFallback", (e, t) => e || t), await loadTemplates([Re]);
});
Hooks.once("ready", () => {
  di(), Mt(), Hooks.on("getApplicationHeaderButtons", Z), Hooks.on("getApplicationV1HeaderButtons", Z), Hooks.on("getDocumentSheetHeaderButtons", Z), Hooks.on("getItemSheetHeaderButtons", Z), Hooks.on("getHeaderControlsApplicationV2", si), Hooks.on("renderItemSheet", X), Hooks.on("renderItemSheetV2", X), Hooks.on("renderApplication", X), Hooks.on("renderApplicationV1", X), Hooks.on("renderApplicationV2", X), Hooks.on("renderChatMessage", Me), Hooks.on("renderChatMessageHTML", Me), fi(), console.log(`${k} | Ready. API available at game.holodock.`);
});
