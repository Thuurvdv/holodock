var ht = Object.defineProperty;
var gt = (e, t, i) => t in e ? ht(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var K = (e, t, i) => gt(e, typeof t != "symbol" ? t + "" : t, i);
function wt() {
  var e, t, i;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : t.api) ?? ((i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.api) ?? null;
}
function yt() {
  var e, t, i;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : t.api) ?? ((i = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : i.api) ?? null;
}
function bt(e = {}, t = {}) {
  var n, a, o;
  const i = ((a = (n = globalThis.foundry) == null ? void 0 : n.utils) == null ? void 0 : a.mergeObject) ?? ((o = foundry == null ? void 0 : foundry.utils) == null ? void 0 : o.mergeObject);
  return typeof i == "function" ? i(e, t, { inplace: !1 }) : { ...e, ...t };
}
function vt() {
  var e, t, i, n, a;
  return ((i = (t = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : t.randomID) == null ? void 0 : i.call(t, 8)) ?? ((a = (n = foundry == null ? void 0 : foundry.utils) == null ? void 0 : n.randomID) == null ? void 0 : a.call(n, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function xe(e = {}) {
  return {
    id: String(e.id ?? `legacy-application-${vt()}`),
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
function St(e) {
  return class extends e {
    constructor(n = {}) {
      const a = bt(new.target.defaultOptions ?? {}, n);
      super(xe(a));
      K(this, "_v1Options");
      this._v1Options = a;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return xe(this.defaultOptions ?? {});
    }
    activateListeners(n) {
    }
    async _renderHTML(n, a) {
      var c, d, p;
      const o = typeof this.getData == "function" ? await this.getData() : {}, s = ((c = this._v1Options) == null ? void 0 : c.template) ?? ((d = this.options) == null ? void 0 : d.template) ?? ((p = this.constructor.defaultOptions) == null ? void 0 : p.template);
      if (!s) return document.createDocumentFragment();
      const r = await globalThis.renderTemplate(s, o), l = document.createElement("template");
      return l.innerHTML = r.trim(), l.content;
    }
    _activateV1Form(n) {
      var o, s;
      if (typeof this._updateObject != "function") return;
      const a = (o = n.matches) != null && o.call(n, "form") ? n : (s = n.querySelector) == null ? void 0 : s.call(n, "form");
      a instanceof HTMLFormElement && a.addEventListener("submit", async (r) => {
        var l;
        r.preventDefault(), r.stopPropagation(), await this._updateObject(r, new FormData(a)), ((l = this._v1Options) == null ? void 0 : l.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(n, a, o) {
      var d, p, u, m;
      a.replaceChildren(n);
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
function kt() {
  const e = wt(), t = yt(), i = globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (i) return i;
  const n = e == null ? void 0 : e.ApplicationV2;
  return n ? St(n) : null;
}
const S = "holodock", Be = "HoloDock", be = "profiles", ve = "slotCategories", Se = "defaultProfile", pe = "shipEquipment", Ne = `modules/${S}/templates/holodock.hbs`, ne = "modules/holodock/assets/SpaceshipDefault.webp", qt = "icons/svg/space-station.svg", G = ["Weapons", "Defense", "Utility", "Engines", "Cargo", "Special"];
function I(e) {
  var t, i;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.deepClone ? foundry.utils.deepClone(e) : (i = foundry == null ? void 0 : foundry.utils) != null && i.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? {}));
}
function T(e = "hd") {
  var i, n, a;
  const t = ((n = (i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.randomID) == null ? void 0 : n.call(i)) ?? ((a = crypto == null ? void 0 : crypto.randomUUID) == null ? void 0 : a.call(crypto)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${e}-${t}`;
}
function g(e) {
  var i;
  if ((i = foundry == null ? void 0 : foundry.utils) != null && i.escapeHTML) return foundry.utils.escapeHTML(String(e ?? ""));
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function q(e = "edit HoloDock") {
  var t, i, n;
  return (t = game.user) != null && t.isGM ? !0 : ((n = (i = ui.notifications) == null ? void 0 : i.warn) == null || n.call(i, `Only a GM can ${e}.`), !1);
}
const At = kt();
let B = null, L = "", $ = "overview", O = "", Me = "", Le = 0;
const le = /* @__PURE__ */ new Map(), Ue = `module.${S}`, fe = [
  { id: "overview", label: "Overview", icon: "fa-solid fa-display" },
  { id: "systems", label: "Systems", icon: "fa-solid fa-microchip" },
  { id: "power", label: "Power Grid", icon: "fa-solid fa-bolt" },
  { id: "damage", label: "Damage", icon: "fa-solid fa-shield-halved" },
  { id: "speed", label: "Speed", icon: "fa-solid fa-gauge-high" },
  { id: "capacity", label: "Capacity", icon: "fa-solid fa-users" }
];
function N(e = {}) {
  const t = Number(e.anchorX), i = Number(e.anchorY), n = String(e.category || e.label || G[0]).trim() || G[0];
  return {
    id: String(e.id || T("slot")),
    label: n,
    category: n,
    description: String(e.description || "").trim(),
    requiredCategory: String(e.requiredCategory || "").trim(),
    requiredTags: Array.isArray(e.requiredTags) ? e.requiredTags.map((a) => String(a).trim()).filter(Boolean) : [],
    anchorX: Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : void 0,
    anchorY: Number.isFinite(i) ? Math.min(100, Math.max(0, i)) : void 0,
    itemUuid: String(e.itemUuid || "").trim() || void 0
  };
}
function R(e = {}) {
  return {
    id: String(e.id || T("stat")),
    label: String(e.label || "Statistic").trim() || "Statistic",
    value: String(e.value || "").trim(),
    note: String(e.note || "").trim()
  };
}
function je(e = {}) {
  return {
    slotId: String(e.slotId || "").trim(),
    allocated: Math.max(0, v(e.allocated, 0)),
    online: e.online !== !1
  };
}
function Ge(e = {}) {
  return {
    id: String(e.id || T("preset")),
    name: String(e.name || "Power Preset").trim() || "Power Preset",
    entries: Array.isArray(e.entries) ? e.entries.map(je).filter((t) => t.slotId) : []
  };
}
function Ve(e = {}) {
  return {
    hiddenFromPlayers: e.hiddenFromPlayers === !0,
    allowPlayerEquip: e.allowPlayerEquip === !0,
    allowPlayerActivate: e.allowPlayerActivate !== !1
  };
}
function H(e = {}) {
  const t = String(e.image || ne).trim() || ne;
  return {
    id: String(e.id || T("ship")),
    name: String(e.name || "Party Ship").trim() || "Party Ship",
    shipClass: String(e.shipClass || "").trim(),
    image: t === qt ? ne : t,
    powerCapacity: Math.max(0, v(e.powerCapacity, 0)),
    permissions: Ve(e.permissions),
    powerPresets: Array.isArray(e.powerPresets) ? e.powerPresets.map(Ge) : [],
    stats: Array.isArray(e.stats) ? e.stats.map(R) : [],
    slots: Array.isArray(e.slots) ? e.slots.map(N) : []
  };
}
function v(e, t = 0) {
  const i = Number(e);
  return Number.isFinite(i) ? i : t;
}
function _e(e) {
  return Array.isArray(e) ? e.map((t) => String(t).trim()).filter(Boolean) : String(e || "").split(",").map((t) => t.trim()).filter(Boolean);
}
function oe(e = {}) {
  var o, s, r, l, c, d, p, u, m, f, w, h, y, k, C, E, U;
  const t = Math.max(0, v((o = e.durability) == null ? void 0 : o.max, 0)), i = Math.min(t, Math.max(0, v((s = e.durability) == null ? void 0 : s.value, t))), n = String(e.category || G[0]).trim() || G[0], a = {
    enabled: e.enabled === !0,
    category: n,
    tags: _e(e.tags),
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
      value: i,
      max: t,
      brokenAt: Math.max(0, v((h = e.durability) == null ? void 0 : h.brokenAt, 0))
    },
    power: {
      enabled: ((y = e.power) == null ? void 0 : y.enabled) === !0,
      draw: Math.max(0, v((k = e.power) == null ? void 0 : k.draw, 0)),
      allocated: Math.max(0, v((C = e.power) == null ? void 0 : C.allocated, ((E = e.power) == null ? void 0 : E.draw) ?? 0)),
      online: ((U = e.power) == null ? void 0 : U.online) !== !1
    }
  };
  return $t(a);
}
function $t(e) {
  const t = I(e), i = t.enabled && t.durability.enabled && t.durability.value <= t.durability.brokenAt, n = t.enabled && t.power.enabled && t.power.draw > 0 && t.power.allocated <= 0;
  return t.enabled && t.power.enabled && (n || i) && (t.power.online = !1), t;
}
function A(e) {
  var t;
  return oe(((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, S, pe)) ?? {});
}
function Et(e) {
  return A(e).enabled;
}
async function V(e, t, i = {}) {
  var o;
  if (i.requireGm !== !1 && !q("tag ship equipment") || !(e != null && e.setFlag)) return null;
  const n = A(e), a = oe({
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
  return a.enabled ? (await e.setFlag(S, pe, a), await he(a.category), j(), a) : (await ((o = e.unsetFlag) == null ? void 0 : o.call(e, S, pe)), j(), a);
}
async function ae(e, t, i = {}) {
  const n = A(e), a = Math.max(0, n.durability.max), o = Math.min(a, Math.max(0, v(t, n.durability.value)));
  return V(e, {
    enabled: n.enabled,
    durability: {
      ...n.durability,
      value: o
    }
  }, i);
}
async function ze(e, t) {
  const i = A(e);
  return !i.enabled || !i.power.enabled ? null : V(e, {
    enabled: i.enabled,
    power: {
      ...i.power,
      online: t === !0
    }
  });
}
async function me(e, t) {
  const i = A(e);
  return !i.enabled || !i.power.enabled ? null : V(e, {
    enabled: i.enabled,
    power: {
      ...i.power,
      allocated: Math.max(0, v(t, i.power.allocated))
    }
  });
}
function ke(e) {
  const t = e.durability, i = e.enabled && t.enabled, n = Math.max(0, t.max), a = Math.min(n, Math.max(0, t.value)), o = i && a <= t.brokenAt, s = i && !o && n > 0 && a < n;
  return { isBroken: o, isDamaged: s, value: a, max: n };
}
async function qe(e, t = {}) {
  var a, o, s, r, l, c, d, p, u;
  const i = globalThis.ChatMessage;
  if (!(i != null && i.create))
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Foundry chat is not available."), null;
  let n = { alias: ((s = game.user) == null ? void 0 : s.name) ?? Be };
  try {
    n = ((c = i.getSpeaker) == null ? void 0 : c.call(i, { actor: ((r = game.user) == null ? void 0 : r.character) ?? void 0, alias: (l = game.user) == null ? void 0 : l.name })) ?? n;
  } catch (m) {
    console.debug(`${S} | Could not resolve chat speaker, using fallback.`, m);
  }
  try {
    return await i.create({
      user: (d = game.user) == null ? void 0 : d.id,
      speaker: n,
      content: e,
      flags: t
    });
  } catch (m) {
    return console.warn(`${S} | Failed to create HoloDock chat card.`, m), (u = (p = ui.notifications) == null ? void 0 : p.warn) == null || u.call(p, "HoloDock could not create a chat card. Check the console for details."), null;
  }
}
async function Y(e, t, i = {}) {
  var c;
  const n = A(e), a = ke(n), o = i.slot, s = i.profile, r = t.blocked || !t.ok ? "Blocked" : t.handled ? "Activated" : "Unhandled", l = `
    <article class="hd-chat-card ${t.blocked || !t.ok ? "is-blocked" : "is-activated"}">
      <header>
        <img src="${g((e == null ? void 0 : e.img) || "icons/svg/item-bag.svg")}" alt="">
        <div>
          <p class="hd-kicker">HoloDock Activation</p>
          <h3>${g((e == null ? void 0 : e.name) ?? "Ship Equipment")}</h3>
        </div>
      </header>
      <dl>
        <div><dt>Outcome</dt><dd>${g(r)}</dd></div>
        ${s ? `<div><dt>Ship</dt><dd>${g(s.name)}</dd></div>` : ""}
        ${o ? `<div><dt>Slot</dt><dd>${g(o.label)}</dd></div>` : ""}
        ${n.activation.actionType ? `<div><dt>Action</dt><dd>${g(n.activation.actionType)}</dd></div>` : ""}
        ${n.activation.resourceCost ? `<div><dt>Resource</dt><dd>${g(n.activation.resourceCost)}</dd></div>` : ""}
        ${n.activation.cooldown ? `<div><dt>Cooldown</dt><dd>${n.activation.cooldown} rounds</dd></div>` : ""}
        ${n.durability.enabled ? `<div><dt>Durability</dt><dd>${a.value} / ${a.max}</dd></div>` : ""}
      </dl>
      ${(c = t.consequences) != null && c.length ? `<ul>${t.consequences.map((d) => `<li>${g(d)}</li>`).join("")}</ul>` : ""}
      ${t.message ? `<p>${g(t.message)}</p>` : ""}
    </article>
  `;
  await qe(l);
}
async function Ye(e, t = {}) {
  const i = A(e);
  if (!i.enabled || !i.activation.enabled)
    return { ok: !1, handled: !1, blocked: !0, message: "That item is not configured as activatable ship equipment." };
  if (i.power.enabled && !i.power.online) {
    const u = { ok: !1, handled: !1, blocked: !0, message: "That ship equipment is offline." };
    return await Y(e, u, t), u;
  }
  if (i.power.enabled && i.power.allocated < i.power.draw) {
    const u = { ok: !1, handled: !1, blocked: !0, message: "That ship equipment does not have enough allocated power." };
    return await Y(e, u, t), u;
  }
  const n = ke(i);
  if (i.activation.blockWhenBroken && n.isBroken) {
    const u = { ok: !1, handled: !1, blocked: !0, message: "That ship equipment is broken." };
    return await Y(e, u, t), u;
  }
  const a = Date.now(), o = Math.max(0, i.activation.cooldown) * 6e3;
  if (o > 0 && i.activation.lastActivatedAt > 0) {
    const u = i.activation.lastActivatedAt + o;
    if (u > a) {
      const m = Math.max(1, Math.ceil((u - a) / 6e3)), f = {
        ok: !1,
        handled: !1,
        blocked: !0,
        message: `That ship equipment is cooling down for ${m} more round${m === 1 ? "" : "s"}.`,
        consequences: [`Cooldown remaining: ${m} round${m === 1 ? "" : "s"}`]
      };
      return await Y(e, f, t), f;
    }
  }
  if (i.activation.durabilityCost > 0 && i.durability.enabled && n.value <= 0) {
    const u = {
      ok: !1,
      handled: !1,
      blocked: !0,
      message: "That ship equipment has no durability left to spend.",
      consequences: [`Required durability: ${i.activation.durabilityCost}`]
    };
    return await Y(e, u, t), u;
  }
  const s = {
    item: e,
    equipment: i,
    durabilityState: n,
    handled: !1,
    blocked: !1,
    message: "",
    consequences: [],
    ...t
  };
  if (Hooks.callAll(`${S}.activateEquipment`, s), s.blocked) {
    const u = {
      ok: !1,
      handled: s.handled === !0,
      blocked: !0,
      message: String(s.message || "Ship equipment activation was blocked."),
      consequences: s.consequences
    };
    return await Y(e, u, t), u;
  }
  const r = [...s.consequences], l = {
    enabled: i.enabled,
    activation: {
      ...i.activation,
      lastActivatedAt: a
    }
  };
  if (i.activation.durabilityCost > 0 && i.durability.enabled) {
    const u = Math.max(0, n.value - i.activation.durabilityCost);
    l.durability = {
      ...i.durability,
      value: u
    }, r.push(`Durability spent: ${i.activation.durabilityCost} (${u}/${n.max} remaining)`);
  }
  i.activation.resourceCost && r.push(`Resource cost: ${i.activation.resourceCost}`), i.activation.cooldown > 0 && r.push(`Cooldown started: ${i.activation.cooldown} round${i.activation.cooldown === 1 ? "" : "s"}`);
  let c = !1;
  try {
    c = !!await V(e, l, { requireGm: !1 });
  } catch (u) {
    console.warn(`${Be} | Failed to save activation consequences`, u);
  }
  !c && r.length && r.push("Consequence state could not be saved; check item permissions.");
  const d = s.handled === !0 || r.length > 0, p = {
    ok: !0,
    handled: d,
    blocked: !1,
    message: String(s.message || (d ? "Ship equipment activated." : "No system handled this ship equipment activation.")),
    consequences: r
  };
  return Hooks.callAll(`${S}.equipmentActivated`, { item: e, equipment: A(e), result: p, ...t }), await Y(e, p, t), p;
}
function D() {
  const e = game.settings.get(S, be);
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const t = {};
  for (const i of Object.values(e)) {
    const n = H(i);
    t[n.id] = n;
  }
  return t;
}
function We() {
  return Object.values(D()).sort((e, t) => e.name.localeCompare(t.name));
}
function Xe() {
  var t;
  const e = We();
  return (t = game.user) != null && t.isGM ? e : e.filter((i) => !i.permissions.hiddenFromPlayers);
}
function Ke() {
  return String(game.settings.get(S, Se) || "");
}
async function Ae(e) {
  await game.settings.set(S, Se, e);
}
async function M(e, t = {}) {
  t.requireGm !== !1 && !q("save ship loadouts") || (await game.settings.set(S, be, e), j());
}
function Z() {
  const e = game.settings.get(S, ve), t = Array.isArray(e) ? e.map((i) => String(i).trim()).filter(Boolean) : [];
  return t.length ? [...new Set(t)] : G;
}
async function he(e) {
  var n;
  const t = String(e || "").trim();
  if (!t || !((n = game.user) != null && n.isGM)) return;
  const i = Z();
  i.some((a) => a.toLowerCase() === t.toLowerCase()) || await game.settings.set(S, ve, [...i, t]);
}
function b() {
  const e = Xe();
  if (!e.length) return null;
  if (!L || !e.some((t) => t.id === L)) {
    const t = Ke();
    L = e.some((i) => i.id === t) ? t : e[0].id;
  }
  return e.find((t) => t.id === L) ?? null;
}
function _(e = L) {
  const t = D()[e];
  return t ? H(t) : null;
}
async function Je() {
  if (!q("create ship profiles")) return null;
  const e = H({
    id: T("ship"),
    name: "New Ship",
    shipClass: "",
    image: ne,
    powerCapacity: 0,
    stats: [
      R({ id: T("stat"), label: "Speed", value: "6", note: "" }),
      R({ id: T("stat"), label: "Cruise Speed", value: "4", note: "Efficient travel" }),
      R({ id: T("stat"), label: "Fuel", value: "100%", note: "" }),
      R({ id: T("stat"), label: "Defense", value: "10", note: "" }),
      R({ id: T("stat"), label: "Capacity", value: "6", note: "Crew and passengers" }),
      R({ id: T("stat"), label: "Cargo", value: "2 tons", note: "Available hold" })
    ],
    slots: G.slice(0, 4).map((i) => N({
      id: T("slot"),
      label: i,
      category: i
    }))
  }), t = I(D());
  return t[e.id] = e, L = e.id, await Ae(e.id), await M(t), e;
}
async function Qe(e, t) {
  if (!q("update ship profiles")) return null;
  const i = I(D()), n = i[e];
  if (!n) return null;
  const a = H({
    ...n,
    name: t.name,
    shipClass: t.shipClass,
    image: t.image,
    powerCapacity: t.powerCapacity,
    permissions: n.permissions,
    powerPresets: n.powerPresets,
    stats: n.stats,
    slots: n.slots
  });
  return i[e] = a, await M(i), a;
}
async function Ze(e, t) {
  if (!q("update HoloDock player rights")) return null;
  const i = I(D()), n = i[e];
  if (!n) return null;
  const a = H({
    ...n,
    permissions: {
      ...n.permissions,
      ...t
    }
  });
  return i[e] = a, await M(i), a;
}
async function et(e, t) {
  var s, r;
  if (!q("save power presets")) return null;
  const i = I(D()), n = i[e];
  if (!n) return null;
  const a = [];
  for (const l of n.slots) {
    if (!l.itemUuid) continue;
    const c = await P(l.itemUuid), d = A(c);
    !d.enabled || !d.power.enabled || a.push(je({
      slotId: l.id,
      allocated: d.power.allocated,
      online: d.power.online
    }));
  }
  if (!a.length)
    return (r = (s = ui.notifications) == null ? void 0 : s.warn) == null || r.call(s, "No powered ship equipment is currently slotted."), null;
  const o = Ge({
    id: T("preset"),
    name: t,
    entries: a
  });
  return n.powerPresets = [...n.powerPresets ?? [], o], i[e] = H(n), await M(i), o;
}
async function tt(e, t) {
  var s;
  if (!q("delete power presets")) return !1;
  const i = I(D()), n = i[e];
  if (!n) return !1;
  const a = (s = n.powerPresets) == null ? void 0 : s.find((r) => r.id === t);
  return !a || !await Dialog.confirm({
    title: "Delete Power Preset",
    content: `<p>Delete <strong>${g(a.name)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (n.powerPresets = n.powerPresets.filter((r) => r.id !== t), i[e] = H(n), await M(i), !0);
}
async function Ct(e, t) {
  const i = [];
  let n = 0, a = 0, o = 0, s = 0, r = 0, l = 0;
  for (const c of t.entries) {
    const d = e.slots.find((h) => h.id === c.slotId), p = await P((d == null ? void 0 : d.itemUuid) ?? ""), u = A(p);
    if (!d || !p || !u.enabled || !u.power.enabled) {
      a += 1;
      continue;
    }
    const m = u.power.online, f = Math.max(0, u.power.allocated), w = Math.max(0, c.allocated);
    o += m ? f : 0, s += c.online ? w : 0, c.online ? r += 1 : l += 1, n += 1, (f !== w || m !== c.online) && i.push({
      slotId: d.id,
      itemName: String(p.name ?? "Ship Equipment"),
      slotLabel: d.label,
      currentText: `${m ? "Online" : "Offline"} / ${f}`,
      targetText: `${c.online ? "Online" : "Offline"} / ${w}`,
      stateClass: c.online ? "is-ready" : "is-offline"
    });
  }
  return { changes: i, appliedCount: n, missingCount: a, currentAllocated: o, targetAllocated: s, onlineCount: r, offlineCount: l };
}
async function Pt(e, t) {
  var a, o;
  const i = await Ct(e, t);
  if (!i.appliedCount)
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "That preset did not match any powered slotted equipment."), !1;
  const n = i.changes.length ? i.changes.map((s) => `
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
          <article><span>Systems</span><strong>${i.appliedCount}</strong></article>
          <article><span>Target</span><strong>${i.targetAllocated}</strong></article>
          <article><span>Online</span><strong>${i.onlineCount}/${i.appliedCount}</strong></article>
        </div>
        ${i.missingCount ? `<p class="hd-muted">${i.missingCount} saved ${i.missingCount === 1 ? "entry no longer matches" : "entries no longer match"} installed powered equipment.</p>` : ""}
        <div class="hd-preset-preview-list">${n}</div>
      </section>
    `,
    defaultYes: !0
  });
}
async function Dt(e, t, i) {
  const n = t.entries.reduce((o, s) => s.online ? o + s.allocated : o, 0), a = t.entries.filter((o) => o.online).length;
  await qe(
    `
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
          <div><dt>Systems Applied</dt><dd>${i}</dd></div>
          <div><dt>Target Allocation</dt><dd>${n}</dd></div>
          <div><dt>Online</dt><dd>${a}/${t.entries.length}</dd></div>
        </dl>
      </article>
    `
  );
}
async function it(e, t) {
  var o, s, r, l;
  if (!q("apply power presets")) return !1;
  const i = _(e), n = i == null ? void 0 : i.powerPresets.find((c) => c.id === t);
  if (!i || !n || !await Pt(i, n)) return !1;
  let a = 0;
  for (const c of n.entries) {
    const d = i.slots.find((m) => m.id === c.slotId), p = await P((d == null ? void 0 : d.itemUuid) ?? ""), u = A(p);
    !u.enabled || !u.power.enabled || (await V(p, {
      enabled: u.enabled,
      power: {
        ...u.power,
        allocated: c.allocated,
        online: c.online
      }
    }), a += 1);
  }
  return a ? ((l = (r = ui.notifications) == null ? void 0 : r.info) == null || l.call(r, `Applied power preset: ${n.name}`), await Dt(i, n, a), j(), !0) : ((s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, "That preset did not match any powered slotted equipment."), !1);
}
async function nt(e = L) {
  if (!q("delete ship profiles")) return !1;
  const t = _(e);
  if (!t || !await Dialog.confirm({
    title: "Delete Ship Profile",
    content: `<p>Delete <strong>${g(t.name)}</strong>?</p>`,
    defaultYes: !1
  })) return !1;
  const n = I(D());
  return delete n[e], L = Object.keys(n)[0] ?? "", Ke() === e && await Ae(L), await M(n), !0;
}
async function $e(e, t) {
  if (!q("edit ship statistics")) return null;
  const i = I(D()), n = i[e];
  if (!n) return null;
  const a = R(t), o = n.stats.findIndex((s) => s.id === a.id);
  return o >= 0 ? n.stats[o] = { ...n.stats[o], ...a } : n.stats.push(a), i[e] = H(n), await M(i), a;
}
async function at(e, t) {
  if (!q("delete ship statistics")) return !1;
  const i = I(D()), n = i[e];
  if (!n) return !1;
  const a = n.stats.find((s) => s.id === t);
  return !a || !await Dialog.confirm({
    title: "Delete Ship Statistic",
    content: `<p>Delete <strong>${g(a.label)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (n.stats = n.stats.filter((s) => s.id !== t), i[e] = H(n), await M(i), !0);
}
async function ot(e, t) {
  if (!q("edit equipment slots")) return null;
  const i = I(D()), n = i[e];
  if (!n) return null;
  const a = n.slots.findIndex((s) => s.id === t.id), o = N(a >= 0 ? { ...n.slots[a], ...t } : t);
  return a >= 0 ? n.slots[a] = o : n.slots.push(o), i[e] = H(n), await he(o.category), o.requiredCategory && await he(o.requiredCategory), await M(i), o;
}
async function st(e, t) {
  if (!q("delete equipment slots")) return !1;
  const i = I(D()), n = i[e];
  if (!n) return !1;
  const a = n.slots.find((s) => s.id === t);
  return !a || !await Dialog.confirm({
    title: "Delete Equipment Slot",
    content: `<p>Delete <strong>${g(a.label)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (n.slots = n.slots.filter((s) => s.id !== t), i[e] = H(n), await M(i), !0);
}
async function ge(e, t, i, n) {
  var s;
  if (!q("place equipment links")) return !1;
  const a = I(D()), o = (s = a[e]) == null ? void 0 : s.slots.find((r) => r.id === t);
  return o ? (o.anchorX = Math.min(100, Math.max(0, Number(i))), o.anchorY = Math.min(100, Math.max(0, Number(n))), await M(a), !0) : !1;
}
async function rt(e, t) {
  var a;
  if (!q("clear equipment links")) return !1;
  const i = I(D()), n = (a = i[e]) == null ? void 0 : a.slots.find((o) => o.id === t);
  return n ? (delete n.anchorX, delete n.anchorY, await M(i), !0) : !1;
}
function lt(e) {
  const t = [];
  return e.requiredCategory && t.push(`Category: ${e.requiredCategory}`), e.requiredTags.length && t.push(`Tags: ${e.requiredTags.join(", ")}`), t.join(" | ");
}
function Ee(e, t) {
  const i = A(t);
  return i.enabled ? i : oe({
    ...i,
    enabled: !0,
    category: e.requiredCategory || e.category
  });
}
function se(e, t, i = Ee(e, t)) {
  if (e.requiredCategory && i.category.toLowerCase() !== e.requiredCategory.toLowerCase())
    return { ok: !1, reason: `That slot requires ${e.requiredCategory} ship equipment.` };
  const n = new Set(i.tags.map((o) => o.toLowerCase())), a = e.requiredTags.filter((o) => !n.has(o.toLowerCase()));
  return a.length ? { ok: !1, reason: `That slot requires tag${a.length === 1 ? "" : "s"}: ${a.join(", ")}.` } : { ok: !0 };
}
async function Tt(e, t, i) {
  return Dialog.confirm({
    title: "Install Ship Equipment",
    content: `
      <section class="hd-install-confirm">
        <i class="fa-solid fa-shuttle-space"></i>
        <div>
          <p>Install <strong>${g((t == null ? void 0 : t.name) ?? "this item")}</strong> into <strong>${g(e.label)}</strong>?</p>
          ${i ? '<p class="hd-muted">This item will be converted into HoloDock ship equipment so it can be tracked by the ship.</p>' : '<p class="hd-muted">This item is already HoloDock ship equipment and will be assigned to this slot.</p>'}
        </div>
      </section>
    `,
    defaultYes: !0
  }, {
    classes: ["holodock-window", "hd-dialog", "hd-install-dialog"],
    width: 440
  });
}
function we(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 || (e == null ? void 0 : e.permissions.allowPlayerEquip) === !0;
}
function It(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 || (e == null ? void 0 : e.permissions.allowPlayerActivate) === !0;
}
async function Ce(e, t, i, n = {}) {
  var u, m;
  const a = await P(i);
  if (!a)
    return { ok: !1, message: "Drop a Foundry Item onto the equipment slot." };
  const o = I(D()), s = o[e], r = s == null ? void 0 : s.slots.find((f) => f.id === t);
  if (!s || !r) return { ok: !1, message: "That ship slot could not be found." };
  if (!s.permissions.allowPlayerEquip && !((u = game.user) != null && u.isGM))
    return { ok: !1, message: "Players are not allowed to install equipment on this ship." };
  if (r.itemUuid) return { ok: !1, message: "That equipment slot is already occupied." };
  const l = N(r), c = A(a), d = Ee(l, a), p = se(l, a, d);
  if (!p.ok)
    return { ok: !1, message: p.reason ?? "That item is not compatible with this ship slot." };
  if (!c.enabled) {
    const f = await V(a, d, { requireGm: ((m = game.user) == null ? void 0 : m.isGM) !== !0 ? !1 : void 0 });
    if (!(f != null && f.enabled)) return { ok: !1, message: "That item could not be converted into ship equipment." };
  }
  return r.itemUuid = a.uuid, await M(o), n.openEditor && !c.enabled && window.setTimeout(() => X(a), 50), { ok: !0, message: `${a.name ?? "Item"} installed in ${l.label}.` };
}
function xt() {
  var n;
  const e = game.users, i = (Array.isArray(e) ? e : Array.isArray(e == null ? void 0 : e.contents) ? e.contents : Array.from(e ?? [])).filter((a) => (a == null ? void 0 : a.active) && (a == null ? void 0 : a.isGM)).sort((a, o) => String(a.id ?? "").localeCompare(String(o.id ?? "")));
  return String(((n = i[0]) == null ? void 0 : n.id) ?? "");
}
function ce(e) {
  var t, i;
  (i = (t = game.socket) == null ? void 0 : t.emit) == null || i.call(t, Ue, e);
}
function Mt(e) {
  var n, a;
  const t = game.users, i = ((n = t == null ? void 0 : t.get) == null ? void 0 : n.call(t, e)) ?? ((a = t == null ? void 0 : t.find) == null ? void 0 : a.call(t, (o) => (o == null ? void 0 : o.id) === e));
  return String((i == null ? void 0 : i.name) || "A player");
}
async function Lt(e) {
  const t = _(String(e.profileId || "")), i = t == null ? void 0 : t.slots.find((a) => a.id === e.slotId), n = await P(String(e.itemUuid || ""));
  return !t || !i || !n ? !1 : Dialog.confirm({
    title: "Player Ship Equipment Install",
    content: `
      <section class="hd-install-confirm">
        <i class="fa-solid fa-user-shield"></i>
        <div>
          <p><strong>${g(Mt(e.userId))}</strong> wants to install <strong>${g(n.name ?? "this item")}</strong>.</p>
          <p class="hd-muted">Ship: ${g(t.name)} | Slot: ${g(i.label)}</p>
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
async function Ot(e, t, i) {
  var l, c, d, p, u, m, f;
  const n = T("equip"), a = _(e), o = a == null ? void 0 : a.slots.find((w) => w.id === t), s = await P(i);
  return !a || !o || !s ? ((c = (l = ui.notifications) == null ? void 0 : l.warn) == null || c.call(l, "That ship equipment request could not be prepared."), !1) : await qe(
    `
      <article class="hd-chat-card hd-install-request-card" data-hd-install-request="${g(n)}" data-hd-profile-id="${g(e)}" data-hd-slot-id="${g(t)}" data-hd-item-uuid="${g(i)}" data-hd-user-id="${g(((d = game.user) == null ? void 0 : d.id) ?? "")}">
        <header>
          <img src="${g(s.img || "icons/svg/item-bag.svg")}" alt="">
          <div>
            <p class="hd-kicker">HoloDock Install Request</p>
            <h3>${g(s.name ?? "Ship Equipment")}</h3>
          </div>
        </header>
        <dl>
          <div><dt>Player</dt><dd>${g(((p = game.user) == null ? void 0 : p.name) ?? "Player")}</dd></div>
          <div><dt>Ship</dt><dd>${g(a.name)}</dd></div>
          <div><dt>Slot</dt><dd>${g(o.label)}</dd></div>
        </dl>
        <p>A player wants to install this item as HoloDock ship equipment.</p>
        <footer class="hd-chat-actions">
          <button type="button" data-hd-install-approve="${g(n)}"><i class="fa-solid fa-check"></i> Approve</button>
          <button type="button" data-hd-install-reject="${g(n)}"><i class="fa-solid fa-xmark"></i> Reject</button>
        </footer>
      </article>
    `,
    {
      [S]: {
        installRequest: {
          requestId: n,
          userId: (u = game.user) == null ? void 0 : u.id,
          profileId: e,
          slotId: t,
          itemUuid: i,
          status: "pending"
        }
      }
    }
  ) ? ((f = (m = ui.notifications) == null ? void 0 : m.info) == null || f.call(m, "HoloDock posted the install request to chat."), !0) : !1;
}
function Ht() {
  var e, t;
  (t = (e = game.socket) == null ? void 0 : e.on) == null || t.call(e, Ue, async (i) => {
    var s, r, l, c, d, p;
    if (!i || typeof i != "object") return;
    if (i.action === "equipItemResult") {
      if (i.userId && i.userId !== ((s = game.user) == null ? void 0 : s.id)) return;
      i.ok ? (l = (r = ui.notifications) == null ? void 0 : r.info) == null || l.call(r, i.message ?? "Ship equipment installed.") : (d = (c = ui.notifications) == null ? void 0 : c.warn) == null || d.call(c, i.message ?? "Ship equipment could not be installed."), j();
      return;
    }
    if (i.action !== "equipItem" || !((p = game.user) != null && p.isGM) || game.user.id !== xt()) return;
    const n = _(String(i.profileId || ""));
    if (!(n != null && n.permissions.allowPlayerEquip)) {
      ce({
        action: "equipItemResult",
        requestId: i.requestId,
        userId: i.userId,
        ok: !1,
        message: "Players are not allowed to install equipment on this ship."
      });
      return;
    }
    if (!await Lt(i)) {
      ce({
        action: "equipItemResult",
        requestId: i.requestId,
        userId: i.userId,
        ok: !1,
        message: "The GM rejected the ship equipment install request."
      });
      return;
    }
    const o = await Ce(String(i.profileId || ""), String(i.slotId || ""), String(i.itemUuid || ""), { openEditor: !1 });
    ce({
      action: "equipItemResult",
      requestId: i.requestId,
      userId: i.userId,
      ok: o.ok,
      message: o.message
    });
  });
}
function Rt(e, t = null) {
  const i = [e == null ? void 0 : e.document, e == null ? void 0 : e.message, e == null ? void 0 : e.object, e];
  for (const n of i)
    if (n != null && n.getFlag && (n != null && n.setFlag)) return n;
  return null;
}
async function Ft(e, t) {
  var a;
  const i = ((a = e == null ? void 0 : e.getFlag) == null ? void 0 : a.call(e, S, "installRequest")) ?? {}, n = {
    requestId: String(i.requestId || t.dataset.hdInstallRequest || ""),
    userId: String(i.userId || t.dataset.hdUserId || ""),
    profileId: String(i.profileId || t.dataset.hdProfileId || ""),
    slotId: String(i.slotId || t.dataset.hdSlotId || ""),
    itemUuid: String(i.itemUuid || t.dataset.hdItemUuid || ""),
    status: String(i.status || "pending")
  };
  return n.requestId && n.profileId && n.slotId && n.itemUuid ? n : null;
}
async function Oe(e, t, i) {
  var r, l, c;
  const n = ((r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, S, "installRequest")) ?? {};
  await ((l = e == null ? void 0 : e.setFlag) == null ? void 0 : l.call(e, S, "installRequest", { ...n, status: t, resultMessage: i }));
  const a = String((e == null ? void 0 : e.content) || ""), o = `<p class="hd-install-request-status ${t === "approved" ? "is-approved" : "is-rejected"}">${g(i)}</p>`, s = a.replace(/<footer class="hd-chat-actions">[\s\S]*?<\/footer>/, o);
  s !== a && await ((c = e == null ? void 0 : e.update) == null ? void 0 : c.call(e, { content: s }));
}
function He(e, t = null) {
  const i = Q(null, t), n = Rt(e, t);
  !i || !n || i.querySelectorAll("[data-hd-install-request]").forEach((a) => {
    const o = (s, r) => {
      var l;
      (l = a.querySelector(s)) == null || l.addEventListener("click", async (c) => {
        var p, u, m;
        if (c.preventDefault(), c.stopPropagation(), !((p = game.user) != null && p.isGM)) {
          (m = (u = ui.notifications) == null ? void 0 : u.warn) == null || m.call(u, "Only the GM can answer ship equipment install requests.");
          return;
        }
        const d = await Ft(n, a);
        !d || d.status !== "pending" || await r(d);
      });
    };
    o("[data-hd-install-approve]", async (s) => {
      var l, c, d, p;
      const r = await Ce(s.profileId, s.slotId, s.itemUuid, { openEditor: !1 });
      await Oe(n, r.ok ? "approved" : "rejected", r.message), r.ok ? (c = (l = ui.notifications) == null ? void 0 : l.info) == null || c.call(l, r.message) : (p = (d = ui.notifications) == null ? void 0 : d.warn) == null || p.call(d, r.message);
    }), o("[data-hd-install-reject]", async () => {
      var s, r;
      await Oe(n, "rejected", "The GM rejected the ship equipment install request."), (r = (s = ui.notifications) == null ? void 0 : s.info) == null || r.call(s, "Ship equipment install request rejected.");
    });
  });
}
async function Pe(e, t, i) {
  var p, u, m, f, w, h, y, k, C;
  const n = _(e);
  if (!we(n))
    return (u = (p = ui.notifications) == null ? void 0 : p.warn) == null || u.call(p, "Players are not allowed to install equipment on this ship."), !1;
  const a = await P(i);
  if (!a)
    return (f = (m = ui.notifications) == null ? void 0 : m.warn) == null || f.call(m, "Drop a Foundry Item onto the equipment slot."), !1;
  const o = n == null ? void 0 : n.slots.find((E) => E.id === t);
  if (!o) return !1;
  const s = A(a), r = Ee(N(o), a), l = se(N(o), a, r);
  if (!l.ok)
    return (h = (w = ui.notifications) == null ? void 0 : w.warn) == null || h.call(w, l.reason ?? "That item is not compatible with this ship slot."), !1;
  if (!await Tt(N(o), a, !s.enabled)) return !1;
  if (!((y = game.user) != null && y.isGM)) return Ot(e, t, i);
  const d = await Ce(e, t, i, { openEditor: !0 });
  return d.ok || (C = (k = ui.notifications) == null ? void 0 : k.warn) == null || C.call(k, d.message), d.ok;
}
async function ye(e, t) {
  var a;
  if (!q("remove equipped items")) return !1;
  const i = I(D()), n = (a = i[e]) == null ? void 0 : a.slots.find((o) => o.id === t);
  return n ? (delete n.itemUuid, await M(i), !0) : !1;
}
async function P(e) {
  const t = String(e || "").trim(), i = globalThis.fromUuid;
  if (!t || typeof i != "function") return null;
  const n = le.get(t);
  if (n) return n;
  const a = (async () => {
    var s;
    try {
      const r = await i(t);
      return (r == null ? void 0 : r.documentName) === "Item" || ((s = r == null ? void 0 : r.constructor) == null ? void 0 : s.name) === "Item" ? r : null;
    } catch (r) {
      return console.warn(`${S} | Failed to resolve item UUID "${t}".`, r), null;
    }
  })();
  le.set(t, a);
  const o = await a;
  return o || le.delete(t), o;
}
function Bt(e) {
  var t, i, n;
  try {
    const a = globalThis.TextEditor ?? ((i = (t = foundry == null ? void 0 : foundry.applications) == null ? void 0 : t.ux) == null ? void 0 : i.TextEditor);
    if (a != null && a.getDragEventData) return a.getDragEventData(e);
  } catch {
  }
  try {
    return JSON.parse(((n = e.dataTransfer) == null ? void 0 : n.getData("text/plain")) || "{}");
  } catch {
    return {};
  }
}
function Nt(e) {
  var i, n, a;
  const t = ((n = (i = e == null ? void 0 : e.system) == null ? void 0 : i.description) == null ? void 0 : n.value) ?? ((a = e == null ? void 0 : e.system) == null ? void 0 : a.description) ?? (e == null ? void 0 : e.description) ?? "";
  return typeof t == "string" ? t.trim() : t != null && t.value ? String(t.value).trim() : "";
}
function ct(e) {
  if (!e.enabled) return "";
  const t = [`Ship Equipment: ${e.category}`];
  return e.durability.enabled && e.durability.max > 0 && t.push(`Durability ${e.durability.value}/${e.durability.max}`), e.power.enabled && e.power.draw > 0 && t.push(`Power ${e.power.allocated}/${e.power.draw} ${e.power.online ? "online" : "offline"}`), t.join(" | ");
}
function Ut(e) {
  if (!e.enabled) return [];
  const t = [e.category];
  return e.activation.enabled && t.push("Activatable"), e.durability.enabled && t.push("Durability"), e.power.enabled && t.push("Power"), t;
}
function jt(e) {
  const t = e.durability, { isBroken: i, isDamaged: n, value: a, max: o } = ke(e), s = e.power.enabled && !e.power.online, r = e.power.enabled && e.power.online && e.power.draw > 0 && e.power.allocated <= 0, l = e.power.enabled && e.power.online && !r && e.power.allocated < e.power.draw, c = Math.max(0, e.activation.cooldown) * 6e3, d = e.activation.lastActivatedAt + c, p = e.activation.enabled && c > 0 && e.activation.lastActivatedAt > 0 && d > Date.now(), u = p ? Math.max(1, Math.ceil((d - Date.now()) / 6e3)) : 0, m = s || r || l || p || e.activation.blockWhenBroken && i;
  return {
    ...e,
    badges: Ut(e),
    tagsText: e.tags.join(", "),
    hasTags: e.tags.length > 0,
    durability: {
      ...t,
      value: a,
      max: o,
      state: i ? "Broken" : n ? "Damaged" : "Intact",
      isBroken: i,
      isDamaged: n
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
      blockedReason: s ? "Equipment offline" : r ? "No power allocated" : l ? "Low allocated power" : p ? `Cooling down: ${u} round${u === 1 ? "" : "s"}` : i ? "Equipment broken" : ""
    }
  };
}
function dt(e) {
  const t = Math.max(0, v(e.powerCapacity, 0)), i = e.slots.reduce((r, l) => {
    var d, p;
    const c = (p = (d = l == null ? void 0 : l.item) == null ? void 0 : d.equipment) == null ? void 0 : p.power;
    return !(c != null && c.enabled) || c.online === !1 ? r : r + Math.max(0, v(c.allocated, c.draw ?? 0));
  }, 0), n = t > 0 ? t - i : 0, a = t > 0 ? Math.max(0, i - t) : 0, o = t > 0, s = o && i > t;
  return {
    capacity: t,
    used: i,
    remaining: n,
    overage: a,
    hasCapacity: o,
    isOverBudget: s,
    summary: o ? `${i} / ${t}` : `${i} draw`
  };
}
function Gt(e, t) {
  const i = new Map(t.map((a) => [a.id, a])), n = t.filter((a) => {
    var o, s, r;
    return (r = (s = (o = a.item) == null ? void 0 : o.equipment) == null ? void 0 : s.power) == null ? void 0 : r.enabled;
  });
  return e.powerPresets.map((a) => {
    const o = a.entries.reduce((f, w) => w.online ? f + w.allocated : f, 0), s = a.entries.filter((f) => f.online).length, r = Math.max(0, a.entries.length - s);
    let l = 0, c = 0, d = 0, p = 0;
    const u = a.entries.map((f) => {
      var k, C;
      const w = i.get(f.slotId), h = (C = (k = w == null ? void 0 : w.item) == null ? void 0 : k.equipment) == null ? void 0 : C.power;
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
    const m = n.length > 0 && a.entries.length === n.length && a.entries.every((f) => {
      var h, y, k;
      const w = (k = (y = (h = i.get(f.slotId)) == null ? void 0 : h.item) == null ? void 0 : y.equipment) == null ? void 0 : k.power;
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
function De(e, t) {
  const i = t.map((n) => n.toLowerCase());
  return e.filter((n) => i.some((a) => n.label.toLowerCase().includes(a)));
}
function Te(e, t) {
  return De(e, t)[0] ?? null;
}
function W(e, t, i, n = "Unset", a = t) {
  const o = Te(e, i);
  return {
    label: t,
    value: (o == null ? void 0 : o.value) || n,
    inputValue: (o == null ? void 0 : o.value) || "",
    note: (o == null ? void 0 : o.note) || "",
    stat: o,
    statId: (o == null ? void 0 : o.id) || "",
    editLabel: (o == null ? void 0 : o.label) || a,
    isConfigured: !!o
  };
}
function ut(e, t, i, n) {
  const a = e[0] ?? null;
  return {
    label: t,
    value: (a == null ? void 0 : a.value) || "Unset",
    inputValue: (a == null ? void 0 : a.value) || "",
    note: (a == null ? void 0 : a.note) || (a ? a.label : "Add ship statistic"),
    icon: n,
    page: i,
    stateClass: a ? "is-ready" : "is-muted",
    stat: a,
    statId: (a == null ? void 0 : a.id) || "",
    editLabel: (a == null ? void 0 : a.label) || t,
    relatedStats: e.slice(1),
    hasRelatedStats: e.length > 1
  };
}
function Vt(e) {
  const t = Te(e, ["speed"]), i = De(e, ["max speed", "maximum speed", "top speed", "maximum"]).filter((o) => o.id !== (t == null ? void 0 : t.id)), n = [t, ...i].filter(Boolean);
  return {
    ...ut(n, "Speed", "speed", "fa-gauge-high"),
    metrics: [
      W(e, "Cruise", ["cruise"], "Unset", "Cruise Speed"),
      W(e, "Maximum", ["max speed", "maximum speed", "top speed", "maximum"], "Unset", "Maximum Speed"),
      W(e, "Thrust", ["thrust", "acceleration"])
    ]
  };
}
function _t(e) {
  const t = Te(e, ["capacity", "occupancy"]), i = De(e, ["passenger"]).filter((o) => o.id !== (t == null ? void 0 : t.id)), n = [t, ...i].filter(Boolean);
  return {
    ...ut(n, "Capacity", "capacity", "fa-users"),
    metrics: [
      W(e, "Crew", ["crew"]),
      W(e, "Berths", ["berth"]),
      W(e, "Cargo", ["cargo", "hold"]),
      W(e, "Life Support", ["life support", "life-support"])
    ]
  };
}
function zt(e) {
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
function Yt(e) {
  const t = e.slots.length, i = e.slots.filter((f) => f.item && !f.item.missing).length, n = Math.max(0, t - i), a = e.slots.filter((f) => {
    var w, h;
    return (h = (w = f.item) == null ? void 0 : w.equipment) == null ? void 0 : h.enabled;
  }).map((f) => {
    const w = f.item.equipment, h = w.power, y = w.durability, k = y.enabled && y.isBroken, C = y.enabled && y.isDamaged, E = h.enabled && h.isOffline, U = h.enabled && h.isNoPower, z = h.enabled && h.isUnderpowered, ee = w.activation.enabled, x = k ? "Broken" : E ? "Offline" : U ? "No Power" : z ? "Low Power" : C ? "Damaged" : "Ready", mt = `is-${x.toLowerCase().replace(/\s+/g, "-")}`;
    return {
      slotId: f.id,
      slotLabel: f.label,
      itemName: f.item.name,
      itemImg: f.item.img,
      category: w.category,
      state: x,
      stateClass: mt,
      icon: k ? "fa-triangle-exclamation" : E ? "fa-power-off" : U ? "fa-battery-empty" : z ? "fa-gauge-simple-low" : C ? "fa-screwdriver-wrench" : "fa-circle-check",
      canActivate: ee,
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
  }), o = a.filter((f) => f.state === "Broken").length, s = a.filter((f) => f.state === "Damaged").length, r = a.filter((f) => f.state === "Offline").length, l = a.filter((f) => f.state === "Low Power" || f.state === "No Power").length, c = a.filter((f) => f.powerEnabled).length, d = a.filter((f) => f.powerEnabled && f.powerState === "Online").length, p = Vt(e.stats), u = _t(e.stats), m = zt({ power: e.power, systems: a, brokenSystems: o, damagedSystems: s, offlineSystems: r, underpoweredSystems: l });
  return {
    totalSlots: t,
    equippedSlots: i,
    emptySlots: n,
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
      { label: "Systems", value: `${i}/${t}`, note: n ? `${n} empty` : "All slots filled", icon: "fa-layer-group", page: "systems", stateClass: n ? "is-muted" : "is-ready" },
      { label: "Power", value: e.power.summary, note: e.power.hasCapacity ? `${e.power.remaining} remaining` : "capacity untracked", icon: e.power.isOverBudget ? "fa-triangle-exclamation" : "fa-bolt", page: "power", stateClass: e.power.isOverBudget ? "is-danger" : "is-ready" },
      { label: "Online", value: `${d}/${c}`, note: l ? `${l} underpowered` : c ? "powered systems" : "No power draw", icon: "fa-power-off", page: "systems", stateClass: r || l ? "is-warning" : "is-ready" },
      { label: "Integrity", value: o ? `${o} broken` : s ? `${s} damaged` : "Nominal", note: a.length ? "ship equipment" : "No systems", icon: o ? "fa-triangle-exclamation" : "fa-shield-halved", page: "damage", stateClass: o ? "is-danger" : s ? "is-warning" : "is-ready" },
      p,
      u
    ]
  };
}
function Wt(e) {
  var i;
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const a = String(n.category || "Unassigned");
    t.has(a) || t.set(a, []), (i = t.get(a)) == null || i.push({
      ...n,
      isSelectedEquipment: n.id === O
    });
  }
  return Array.from(t.entries()).map(([n, a]) => ({
    category: n,
    count: a.length,
    equippedCount: a.filter((o) => o.item && !o.item.missing).length,
    slots: a
  }));
}
function Xt(e) {
  const t = e.filter((i) => i.item);
  return t.length ? ((!O || !t.some((i) => i.id === O)) && (O = t[0].id), t.find((i) => i.id === O) ?? null) : (O = "", null);
}
function Kt(e, t) {
  const i = e.filter((n) => {
    var a, o, s;
    return (s = (o = (a = n.item) == null ? void 0 : a.equipment) == null ? void 0 : o.power) == null ? void 0 : s.enabled;
  }).map((n) => {
    const a = n.item.equipment.power;
    return {
      slotId: n.id,
      label: n.label,
      itemName: n.item.name,
      category: n.category,
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
    nodes: i,
    hasNodes: i.length > 0,
    reactorLabel: t.hasCapacity ? `${t.used} / ${t.capacity}` : `${t.used} allocated`
  };
}
async function Jt(e) {
  const t = Number.isFinite(e.anchorX) && Number.isFinite(e.anchorY), i = lt(e), n = {
    ...e,
    hasAnchor: t,
    compatibilitySummary: i,
    hasCompatibilityRules: !!i
  };
  if (!e.itemUuid) return { ...n, item: null };
  const a = await P(e.itemUuid);
  if (!a)
    return {
      ...n,
      item: {
        name: "Missing Item",
        img: "icons/svg/hazard.svg",
        status: "Stored UUID no longer resolves",
        missing: !0
      }
    };
  const o = A(a), s = ct(o), r = jt(o), l = r.durability.isBroken ? "is-broken" : r.power.isOffline ? "is-offline" : r.power.isNoPower ? "is-no-power" : r.power.isUnderpowered ? "is-low-power" : r.durability.isDamaged ? "is-damaged" : r.enabled ? "is-online" : "is-untagged";
  return {
    ...n,
    item: {
      name: a.name ?? "Unnamed Item",
      img: a.img || "icons/svg/item-bag.svg",
      status: s,
      description: Nt(a),
      uuid: a.uuid,
      equipment: r
    },
    pinStateClass: l,
    statusClass: l,
    statusLabel: r.durability.isBroken ? "Broken" : r.power.state || r.durability.state
  };
}
async function Qt() {
  var r, l, c;
  const e = b();
  let t = null;
  const i = ((r = game.user) == null ? void 0 : r.isGM) === !0;
  let n = i, a = i;
  if (e) {
    n = i || e.permissions.allowPlayerEquip, a = i || e.permissions.allowPlayerActivate;
    const d = await Promise.all(e.slots.map(Jt)), p = dt({ ...e, slots: d }), u = Yt({ slots: d, power: p, stats: e.stats }), m = new Set([
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
      isActive: h.page === $ || h.page === "systems" && $ === "equipment" && h.label === "Systems"
    }));
    const f = Xt(d), w = d.map((h) => ({
      ...h,
      isSelectedEquipment: h.id === O
    }));
    t = {
      ...e,
      slots: w,
      power: p,
      powerPresets: Gt(e, d),
      hasPowerPresets: e.powerPresets.length > 0,
      dashboard: u,
      additionalStats: e.stats.filter((h) => !m.has(h.id)),
      hasAdditionalStats: e.stats.some((h) => !m.has(h.id)),
      equipmentCategories: Wt(w),
      selectedEquipmentSlot: f,
      hasSelectedEquipment: !!f,
      powerGrid: Kt(d, p)
    };
  }
  const o = Xe().map((d) => ({
    ...d,
    isSelected: d.id === L
  }));
  return !new Set(fe.map((d) => d.id)).has($) && $ !== "equipment" && ($ = "overview"), {
    canEdit: i,
    canEquip: n,
    canActivateSystems: a,
    hasProfiles: o.length > 0,
    profiles: o,
    selectedProfile: t,
    pages: fe.map((d) => ({
      ...d,
      isActive: d.id === $
    })),
    activePage: $,
    isOverview: $ === "overview",
    isSystems: $ === "systems",
    isEquipment: $ === "equipment",
    isPower: $ === "power",
    isDamage: $ === "damage",
    isSpeed: $ === "speed",
    isCapacity: $ === "capacity",
    categories: Z()
  };
}
function Q(e, t = null) {
  var i;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (i = e == null ? void 0 : e.element) != null && i[0] ? e.element[0] : (e == null ? void 0 : e.element) ?? null;
}
function j() {
  B != null && B.rendered && B.requestRender();
}
function Ie(e) {
  var n, a;
  const t = (e == null ? void 0 : e[0]) ?? e, i = ((n = t == null ? void 0 : t.querySelector) == null ? void 0 : n.call(t, "form")) ?? ((a = t == null ? void 0 : t.closest) == null ? void 0 : a.call(t, "form"));
  return Object.fromEntries(new FormData(i).entries());
}
function Zt(e) {
  var o, s;
  const t = (e == null ? void 0 : e[0]) ?? e, i = ((o = t == null ? void 0 : t.querySelector) == null ? void 0 : o.call(t, "form")) ?? ((s = t == null ? void 0 : t.closest) == null ? void 0 : s.call(t, "form")), n = new FormData(i), a = String(n.get("category") || "");
  return {
    id: String(n.get("id") || ""),
    label: a,
    category: a,
    description: String(n.get("description") || ""),
    requiredCategory: String(n.get("requiredCategory") || ""),
    requiredTags: _e(n.get("requiredTags"))
  };
}
function ei(e) {
  var a, o;
  const t = (e == null ? void 0 : e[0]) ?? e, i = ((a = t == null ? void 0 : t.querySelector) == null ? void 0 : a.call(t, "form")) ?? ((o = t == null ? void 0 : t.closest) == null ? void 0 : o.call(t, "form")), n = new FormData(i);
  return {
    hiddenFromPlayers: F(n, "hiddenFromPlayers"),
    allowPlayerEquip: F(n, "allowPlayerEquip"),
    allowPlayerActivate: F(n, "allowPlayerActivate")
  };
}
function ti(e) {
  if (!q("set HoloDock player rights")) return;
  const t = Ve(e.permissions), i = (n) => n ? "checked" : "";
  new Dialog({
    title: `Player Rights: ${e.name}`,
    content: `
      <form class="hd-dialog-form hd-permissions-form">
        <label class="hd-check">
          <input type="checkbox" name="hiddenFromPlayers" ${i(t.hiddenFromPlayers)}>
          <span>Hide ship from players</span>
        </label>
        <label class="hd-check">
          <input type="checkbox" name="allowPlayerEquip" ${i(t.allowPlayerEquip)}>
          <span>Allow players to drag equipment into empty slots</span>
        </label>
        <label class="hd-check">
          <input type="checkbox" name="allowPlayerActivate" ${i(t.allowPlayerActivate)}>
          <span>Allow players to activate systems</span>
        </label>
        <p class="hd-muted">When activation is disabled, players keep a read-only ship view.</p>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (n) => Ze(e.id, ei(n))
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
function Re(e = {}) {
  if (!q("edit equipment slots")) return;
  const t = b();
  if (!t) return;
  const i = N({ label: "New Slot", category: G[0], ...e }), n = Z().map((a) => `<option value="${g(a)}">`).join("");
  new Dialog({
    title: e.id ? "Edit Equipment Slot" : "Add Equipment Slot",
    content: `
      <form class="hd-dialog-form">
        <input type="hidden" name="id" value="${g(i.id)}">
        <label>
          <span>Slot Type</span>
          <input type="text" name="category" value="${g(i.category)}" list="hd-slot-categories">
          <datalist id="hd-slot-categories">${n}</datalist>
        </label>
        <label>
          <span>Description</span>
          <textarea name="description" rows="4">${g(i.description)}</textarea>
        </label>
        <fieldset>
          <legend>Compatibility</legend>
          <label>
            <span>Required Ship Equipment Category</span>
            <input type="text" name="requiredCategory" value="${g(i.requiredCategory)}" list="hd-slot-categories" placeholder="Optional">
          </label>
          <label>
            <span>Required Tags</span>
            <input type="text" name="requiredTags" value="${g(i.requiredTags.join(", "))}" placeholder="turret, external">
          </label>
        </fieldset>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (a) => ot(t.id, Zt(a))
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
function de(e = {}) {
  if (!q("edit ship statistics")) return;
  const t = b();
  if (!t) return;
  const i = R({ label: "New Statistic", ...e });
  new Dialog({
    title: e.id ? "Edit Ship Statistic" : "Add Ship Statistic",
    content: `
      <form class="hd-dialog-form">
        <input type="hidden" name="id" value="${g(i.id)}">
        <label>
          <span>Label</span>
          <input type="text" name="label" value="${g(i.label)}">
        </label>
        <label>
          <span>Value</span>
          <input type="text" name="value" value="${g(i.value)}">
        </label>
        <label>
          <span>Note</span>
          <textarea name="note" rows="3">${g(i.note)}</textarea>
        </label>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (n) => $e(t.id, Ie(n))
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
function ii() {
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
          const i = Ie(t);
          return et(e.id, i.name || "Power Mode");
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
function F(e, t) {
  return e.get(t) === "on";
}
function ni(e) {
  var o, s;
  const t = (e == null ? void 0 : e[0]) ?? e, i = ((o = t == null ? void 0 : t.querySelector) == null ? void 0 : o.call(t, "form")) ?? ((s = t == null ? void 0 : t.closest) == null ? void 0 : s.call(t, "form")), n = new FormData(i), a = String(n.get("tags") || "").split(",").map((r) => r.trim()).filter(Boolean);
  return oe({
    enabled: F(n, "enabled"),
    category: String(n.get("category") || ""),
    tags: a,
    activation: {
      enabled: F(n, "activation.enabled"),
      label: String(n.get("activation.label") || ""),
      actionType: String(n.get("activation.actionType") || ""),
      cooldown: v(n.get("activation.cooldown"), 0),
      resourceCost: String(n.get("activation.resourceCost") || ""),
      durabilityCost: v(n.get("activation.durabilityCost"), 0),
      blockWhenBroken: F(n, "activation.blockWhenBroken")
    },
    durability: {
      enabled: F(n, "durability.enabled"),
      value: v(n.get("durability.value"), 0),
      max: v(n.get("durability.max"), 0),
      brokenAt: v(n.get("durability.brokenAt"), 0)
    },
    power: {
      enabled: F(n, "power.enabled"),
      draw: v(n.get("power.draw"), 0),
      allocated: v(n.get("power.allocated"), v(n.get("power.draw"), 0)),
      online: F(n, "power.online")
    }
  });
}
function X(e) {
  if (!q("tag ship equipment") || !e) return;
  const t = String(e.uuid ?? e.id ?? e.name ?? "item"), i = Date.now();
  if (t === Me && i - Le < 500) return;
  Me = t, Le = i;
  const n = A(e), a = Z().map((s) => `<option value="${g(s)}">`).join(""), o = (s) => s ? "checked" : "";
  new Dialog({
    title: `Ship Equipment: ${e.name ?? "Item"}`,
    content: `
      <form class="hd-dialog-form hd-equipment-form">
        <label class="hd-check">
          <input type="checkbox" name="enabled" ${o(n.enabled)}>
          <span>Ship Equipment</span>
        </label>
        <label>
          <span>Category</span>
          <input type="text" name="category" value="${g(n.category)}" list="hd-equipment-categories">
          <datalist id="hd-equipment-categories">${a}</datalist>
        </label>
        <label>
          <span>Tags</span>
          <input type="text" name="tags" value="${g(n.tags.join(", "))}" placeholder="turret, external, sensor">
        </label>

        <fieldset>
          <legend>Activation</legend>
          <label class="hd-check">
            <input type="checkbox" name="activation.enabled" ${o(n.activation.enabled)}>
            <span>Can be activated</span>
          </label>
          <div class="hd-form-grid">
            <label>
              <span>Button Label</span>
              <input type="text" name="activation.label" value="${g(n.activation.label)}">
            </label>
            <label>
              <span>Action Type</span>
              <input type="text" name="activation.actionType" value="${g(n.activation.actionType)}" placeholder="attack, scan, repair">
            </label>
            <label>
              <span>Cooldown</span>
              <input type="number" min="0" step="1" name="activation.cooldown" value="${n.activation.cooldown}">
            </label>
            <label>
              <span>Resource Cost</span>
              <input type="text" name="activation.resourceCost" value="${g(n.activation.resourceCost)}">
            </label>
            <label>
              <span>Durability Cost</span>
              <input type="number" min="0" step="1" name="activation.durabilityCost" value="${n.activation.durabilityCost}">
            </label>
          </div>
          <label class="hd-check">
            <input type="checkbox" name="activation.blockWhenBroken" ${o(n.activation.blockWhenBroken)}>
            <span>Block activation when broken</span>
          </label>
        </fieldset>

        <fieldset>
          <legend>Durability</legend>
          <label class="hd-check">
            <input type="checkbox" name="durability.enabled" ${o(n.durability.enabled)}>
            <span>Has durability</span>
          </label>
          <div class="hd-form-grid">
            <label>
              <span>Current</span>
              <input type="number" min="0" step="1" name="durability.value" value="${n.durability.value}">
            </label>
            <label>
              <span>Maximum</span>
              <input type="number" min="0" step="1" name="durability.max" value="${n.durability.max}">
            </label>
            <label>
              <span>Broken At</span>
              <input type="number" min="0" step="1" name="durability.brokenAt" value="${n.durability.brokenAt}">
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Power</legend>
          <label class="hd-check">
            <input type="checkbox" name="power.enabled" ${o(n.power.enabled)}>
            <span>Requires power</span>
          </label>
          <label class="hd-check">
            <input type="checkbox" name="power.online" ${o(n.power.online)}>
            <span>Online</span>
          </label>
          <label>
            <span>Power Draw</span>
            <input type="number" min="0" step="1" name="power.draw" value="${n.power.draw}">
          </label>
          <label>
            <span>Starting Allocation</span>
            <input type="number" min="0" step="1" name="power.allocated" value="${n.power.allocated}">
          </label>
        </fieldset>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (s) => V(e, ni(s))
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
function ai(e) {
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
        callback: (i) => {
          const n = Ie(i);
          return ae(e, v(n.value, t.durability.value));
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
function oi() {
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
function si(e) {
  return oi().filter((t) => {
    var i;
    return (t == null ? void 0 : t.documentName) === "Item" || ((i = t == null ? void 0 : t.constructor) == null ? void 0 : i.name) === "Item";
  }).map((t) => {
    const i = A(t), n = se(e, t);
    return {
      id: String(t.id ?? t.uuid ?? T("item")),
      uuid: String(t.uuid ?? ""),
      name: String(t.name ?? "Unnamed Item"),
      img: String(t.img || "icons/svg/item-bag.svg"),
      type: String(t.type || "Item"),
      status: ct(i),
      compatible: n.ok,
      reason: n.reason ?? "",
      shipEquipment: i.enabled,
      category: i.enabled ? i.category : "",
      tagsText: i.tags.join(", ")
    };
  }).filter((t) => t.uuid).sort((t, i) => t.compatible !== i.compatible ? t.compatible ? -1 : 1 : t.shipEquipment !== i.shipEquipment ? t.shipEquipment ? -1 : 1 : t.name.localeCompare(i.name));
}
function Fe(e) {
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
function ri(e, t) {
  if (!q("equip items")) return;
  const i = _(e), n = i == null ? void 0 : i.slots.find((c) => c.id === t);
  if (!i || !n) return;
  const a = N(n), o = si(a), s = o.filter((c) => c.compatible), r = o.filter((c) => !c.compatible), l = new Dialog({
    title: `Choose Equipment: ${n.label}`,
    content: `
      <section class="hd-equipment-browser">
        <p class="hd-muted">${g(lt(a) || "No slot compatibility rules set.")}</p>
        <div class="hd-equipment-pick-list">
          ${s.length ? s.map(Fe).join("") : '<p class="hd-muted">No compatible world items found.</p>'}
        </div>
        ${r.length ? `
          <details class="hd-incompatible-equipment">
            <summary>${r.length} incompatible item${r.length === 1 ? "" : "s"}</summary>
            <div class="hd-equipment-pick-list">
              ${r.map(Fe).join("")}
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
    const c = Q(l);
    c == null || c.querySelectorAll("[data-hd-pick-item]").forEach((d) => {
      d.addEventListener("click", async () => {
        const p = d.dataset.hdPickItem ?? "";
        await Pe(i.id, n.id, p) && l.close();
      });
    });
  }, 0);
}
function re(e) {
  var i, n, a;
  const t = [
    e == null ? void 0 : e.document,
    e == null ? void 0 : e.item,
    e == null ? void 0 : e.object,
    e == null ? void 0 : e._document,
    (i = e == null ? void 0 : e.options) == null ? void 0 : i.document
  ];
  for (const o of t) {
    if (!o) continue;
    const s = o.documentName ?? ((n = o.constructor) == null ? void 0 : n.documentName), r = String(((a = o.constructor) == null ? void 0 : a.name) ?? "");
    if (s === "Item" || r.includes("Item") && o.type !== void 0 && o.setFlag && o.getFlag) return o;
  }
  return null;
}
function te(e, t) {
  var a;
  if (!((a = game.user) != null && a.isGM)) return;
  const i = re(e);
  if (!i || !Array.isArray(t) || t.some((o) => (o == null ? void 0 : o.class) === "hd-edit-equipment" || (o == null ? void 0 : o.className) === "hd-edit-equipment")) return;
  const n = {
    label: "Ship Equipment",
    title: "HoloDock Ship Equipment",
    class: "hd-edit-equipment",
    className: "hd-edit-equipment",
    icon: "fa-solid fa-shuttle-space",
    onclick: () => X(i),
    onClick: () => X(i)
  };
  t.unshift(n);
}
function li(e, t) {
  var n;
  if (!((n = game.user) != null && n.isGM)) return;
  const i = re(e);
  !i || !Array.isArray(t) || t.some((a) => (a == null ? void 0 : a.action) === "holodockShipEquipment" || (a == null ? void 0 : a.class) === "hd-edit-equipment") || t.unshift({
    action: "holodockShipEquipment",
    label: "Ship Equipment",
    title: "HoloDock Ship Equipment",
    icon: "fa-solid fa-shuttle-space",
    class: "hd-edit-equipment",
    visible: !0,
    ownership: "OWNER",
    onClick: () => X(i),
    onclick: () => X(i)
  });
}
function pt(e, t = null) {
  var r, l, c, d, p, u, m;
  const i = Q(null, t), n = ((r = e == null ? void 0 : e.element) == null ? void 0 : r[0]) ?? (e == null ? void 0 : e.element) ?? ((l = e == null ? void 0 : e._element) == null ? void 0 : l[0]) ?? (e == null ? void 0 : e._element), a = ((c = e == null ? void 0 : e.window) == null ? void 0 : c.element) ?? ((d = e == null ? void 0 : e.window) == null ? void 0 : d.frame), o = e != null && e.id && ((p = globalThis.CSS) != null && p.escape) ? CSS.escape(e.id) : "", s = [
    a,
    (u = n == null ? void 0 : n.closest) == null ? void 0 : u.call(n, ".application, .app, .window-app"),
    n,
    (m = i == null ? void 0 : i.closest) == null ? void 0 : m.call(i, ".application, .app, .window-app"),
    e != null && e.id ? document.getElementById(e.id) : null,
    o ? document.querySelector(`#${o}`) : null,
    e != null && e.appId ? document.querySelector(`[data-appid="${e.appId}"], [data-application-id="${e.appId}"]`) : null
  ];
  for (const f of s)
    if (f instanceof HTMLElement) return f;
  return null;
}
function ie(e, t = null) {
  var l;
  if (!((l = game.user) != null && l.isGM)) return;
  const i = re(e);
  if (!i) return;
  const n = pt(e, t);
  if (!n || n.querySelector(".hd-edit-equipment, [data-hd-edit-equipment]")) return;
  const a = n.querySelector(".window-header, header.window-header, .app-header, header");
  if (!a) return;
  const o = document.createElement("button");
  o.type = "button", o.className = "hd-edit-equipment hd-item-sheet-header-fallback", o.dataset.hdEditEquipment = "true", o.title = "HoloDock Ship Equipment", o.innerHTML = '<i class="fa-solid fa-shuttle-space"></i><span class="sr-only">Ship Equipment</span>', o.addEventListener("click", (c) => {
    c.preventDefault(), c.stopPropagation(), X(i);
  });
  const s = a.querySelector(".window-controls, .header-controls, .window-header-buttons, .window-buttons, menu"), r = a.querySelector(".close, [data-action='close']");
  s ? s.prepend(o) : r ? a.insertBefore(o, r) : a.append(o);
}
function ci(e, t = null) {
  ie(e, t), window.setTimeout(() => ie(e, t), 0), window.setTimeout(() => ie(e, t), 100), window.setTimeout(() => ie(e, t), 300);
}
function J(e, t = null) {
  ci(e, t);
  const i = pt(e, t), n = re(e);
  !i || !n || i.dataset.hdEquipmentHeaderListener === "true" || (i.dataset.hdEquipmentHeaderListener = "true", i.addEventListener("click", (a) => {
    var s, r;
    (r = (s = a.target) == null ? void 0 : s.closest) != null && r.call(s, "[data-action='holodockShipEquipment'], .hd-edit-equipment") && (a.preventDefault(), a.stopPropagation(), X(n));
  }));
}
class di extends At {
  constructor() {
    super(...arguments);
    K(this, "linkingSlotId", "");
    K(this, "linkResizeObserver");
    K(this, "renderFrame");
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holodock",
      title: "HoloDock - Ship Loadout",
      classes: ["holodock-window"],
      template: Ne,
      popOut: !0,
      resizable: !0,
      width: 1280,
      height: 820
    });
  }
  async getData() {
    return Qt();
  }
  requestRender() {
    if (!this.rendered || this.renderFrame) return;
    const i = globalThis.requestAnimationFrame ?? ((n) => window.setTimeout(n, 16));
    this.renderFrame = i(() => {
      this.renderFrame = void 0, this.render(!0);
    });
  }
  activateListeners(i) {
    var a, o;
    super.activateListeners(i);
    const n = Q(this, i);
    n && ((a = n.querySelector("[data-hd-profile-select]")) == null || a.addEventListener("change", (s) => {
      L = s.currentTarget.value, O = "", Ae(L).finally(() => this.requestRender());
    }), n.querySelectorAll("[data-hd-page]").forEach((s) => {
      s.addEventListener("click", (r) => {
        const l = r.currentTarget.dataset.hdPage ?? "overview";
        fe.some((c) => c.id === l) && ($ = l, this.requestRender());
      });
    }), n.querySelectorAll("[data-hd-select-equipment]").forEach((s) => {
      s.addEventListener("click", (r) => {
        const l = r.currentTarget.dataset.hdSelectEquipment ?? "", c = b(), d = c == null ? void 0 : c.slots.find((p) => p.id === l);
        d != null && d.itemUuid && (O = l, $ = "equipment", this.requestRender());
      });
    }), (o = n.querySelector("[data-hd-profile-form]")) == null || o.addEventListener("submit", async (s) => {
      s.preventDefault();
      const r = b();
      if (!r) return;
      const l = Object.fromEntries(new FormData(s.currentTarget).entries());
      await Qe(r.id, l);
    }), n.querySelectorAll("[data-hd-action]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        const l = r.currentTarget.dataset.hdAction, c = b();
        l === "create-profile" && await Je(), l === "delete-profile" && await nt(c == null ? void 0 : c.id), l === "create-slot" && Re(), l === "create-stat" && de(), l === "browse-image" && this.browseShipImage(), l === "save-power-preset" && ii(), l === "profile-permissions" && c && ti(c);
      });
    }), n.querySelectorAll("[data-hd-apply-power-preset]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        const l = b(), c = r.currentTarget.dataset.hdApplyPowerPreset ?? "";
        l && await it(l.id, c);
      });
    }), n.querySelectorAll("[data-hd-delete-power-preset]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        const l = b(), c = r.currentTarget.dataset.hdDeletePowerPreset ?? "";
        l && await tt(l.id, c);
      });
    }), n.querySelectorAll("[data-hd-edit-stat]").forEach((s) => {
      s.addEventListener("click", (r) => {
        const l = b(), c = l == null ? void 0 : l.stats.find((d) => d.id === r.currentTarget.dataset.hdEditStat);
        c && de(c);
      });
    }), n.querySelectorAll("[data-hd-add-stat-label]").forEach((s) => {
      s.addEventListener("click", (r) => {
        const l = r.currentTarget.dataset.hdAddStatLabel ?? "New Statistic";
        de({ label: l, value: "", note: "" });
      });
    }), n.querySelectorAll("[data-hd-stat-value]").forEach((s) => {
      const r = async (l) => {
        const c = b(), d = l.currentTarget;
        if (d.dataset.hdSavingValue !== "true" && c && !(!d.dataset.hdStatValue && d.value.trim() === "")) {
          d.dataset.hdSavingValue = "true";
          try {
            const p = d.dataset.hdStatNote || "", u = await $e(c.id, {
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
    }), n.querySelectorAll("[data-hd-delete-stat]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        const l = b(), c = r.currentTarget.dataset.hdDeleteStat ?? "";
        l && await at(l.id, c);
      });
    }), n.querySelectorAll("[data-hd-edit-slot]").forEach((s) => {
      s.addEventListener("click", (r) => {
        const l = b(), c = l == null ? void 0 : l.slots.find((d) => d.id === r.currentTarget.dataset.hdEditSlot);
        c && Re(c);
      });
    }), n.querySelectorAll("[data-hd-delete-slot]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        const l = b(), c = r.currentTarget.dataset.hdDeleteSlot ?? "";
        l && await st(l.id, c);
      });
    }), n.querySelectorAll("[data-hd-browse-equipment]").forEach((s) => {
      s.addEventListener("click", (r) => {
        const l = b(), c = r.currentTarget.dataset.hdBrowseEquipment ?? "";
        l && ri(l.id, c);
      });
    }), n.querySelectorAll("[data-hd-open-item]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        var p, u, m;
        const l = b(), c = l == null ? void 0 : l.slots.find((f) => f.id === r.currentTarget.dataset.hdOpenItem), d = await P((c == null ? void 0 : c.itemUuid) ?? "");
        (p = d == null ? void 0 : d.sheet) != null && p.render ? d.sheet.render(!0) : (m = (u = ui.notifications) == null ? void 0 : u.warn) == null || m.call(u, "That item could not be found.");
      });
    }), n.querySelectorAll("[data-hd-activate-equipment]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        var u, m, f, w, h, y, k, C, E, U, z, ee;
        const l = b(), c = r.currentTarget.dataset.hdActivateEquipment ?? "", d = l == null ? void 0 : l.slots.find((x) => x.id === c), p = await P((d == null ? void 0 : d.itemUuid) ?? "");
        if (!It(l)) {
          (m = (u = ui.notifications) == null ? void 0 : u.warn) == null || m.call(u, "Players have read-only access to this ship.");
          return;
        }
        if (!p || !l || !d) {
          (w = (f = ui.notifications) == null ? void 0 : f.warn) == null || w.call(f, "That ship equipment could not be found.");
          return;
        }
        try {
          const x = await Ye(p, { profile: l, slot: d });
          x.blocked || !x.ok ? (y = (h = ui.notifications) == null ? void 0 : h.warn) == null || y.call(h, x.message) : x.handled ? x.message && ((U = (E = ui.notifications) == null ? void 0 : E.info) == null || U.call(E, x.message)) : (C = (k = ui.notifications) == null ? void 0 : k.info) == null || C.call(k, x.message);
        } catch (x) {
          console.warn(`${S} | Failed to activate ship equipment.`, x), (ee = (z = ui.notifications) == null ? void 0 : z.warn) == null || ee.call(z, "HoloDock could not activate that equipment. Check the console for details.");
        }
      });
    }), n.querySelectorAll("[data-hd-durability-adjust]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        var m, f;
        const l = b(), c = r.currentTarget, d = l == null ? void 0 : l.slots.find((w) => w.id === c.dataset.hdDurabilityAdjust), p = await P((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (f = (m = ui.notifications) == null ? void 0 : m.warn) == null || f.call(m, "That ship equipment could not be found.");
          return;
        }
        const u = A(p);
        !u.enabled || !u.durability.enabled || await ae(p, u.durability.value + v(c.dataset.hdDurabilityDelta, 0));
      });
    }), n.querySelectorAll("[data-hd-durability-set]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        var p, u;
        const l = b(), c = l == null ? void 0 : l.slots.find((m) => m.id === r.currentTarget.dataset.hdDurabilitySet), d = await P((c == null ? void 0 : c.itemUuid) ?? "");
        d ? ai(d) : (u = (p = ui.notifications) == null ? void 0 : p.warn) == null || u.call(p, "That ship equipment could not be found.");
      });
    }), n.querySelectorAll("[data-hd-durability-value]").forEach((s) => {
      s.addEventListener("change", async (r) => {
        var u, m;
        const l = b(), c = r.currentTarget, d = l == null ? void 0 : l.slots.find((f) => f.id === c.dataset.hdDurabilityValue), p = await P((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (m = (u = ui.notifications) == null ? void 0 : u.warn) == null || m.call(u, "That ship equipment could not be found.");
          return;
        }
        await ae(p, v(c.value, 0));
      });
    }), n.querySelectorAll("[data-hd-power-toggle]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        var m, f;
        const l = b(), c = r.currentTarget, d = l == null ? void 0 : l.slots.find((w) => w.id === c.dataset.hdPowerToggle), p = await P((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (f = (m = ui.notifications) == null ? void 0 : m.warn) == null || f.call(m, "That ship equipment could not be found.");
          return;
        }
        const u = A(p);
        !u.enabled || !u.power.enabled || await ze(p, c.dataset.hdPowerOnline === "true");
      });
    }), n.querySelectorAll("[data-hd-power-adjust]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        var m, f;
        const l = b(), c = r.currentTarget, d = l == null ? void 0 : l.slots.find((w) => w.id === c.dataset.hdPowerAdjust), p = await P((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (f = (m = ui.notifications) == null ? void 0 : m.warn) == null || f.call(m, "That ship equipment could not be found.");
          return;
        }
        const u = A(p);
        !u.enabled || !u.power.enabled || await me(p, u.power.allocated + v(c.dataset.hdPowerDelta, 0));
      });
    }), n.querySelectorAll("[data-hd-power-allocation]").forEach((s) => {
      s.addEventListener("change", async (r) => {
        var u, m;
        const l = b(), c = r.currentTarget, d = l == null ? void 0 : l.slots.find((f) => f.id === c.dataset.hdPowerAllocation), p = await P((d == null ? void 0 : d.itemUuid) ?? "");
        if (!p) {
          (m = (u = ui.notifications) == null ? void 0 : u.warn) == null || m.call(u, "That ship equipment could not be found.");
          return;
        }
        await me(p, v(c.value, 0));
      });
    }), n.querySelectorAll("[data-hd-remove-item]").forEach((s) => {
      s.addEventListener("click", async (r) => {
        const l = b(), c = r.currentTarget.dataset.hdRemoveItem ?? "";
        l && await ye(l.id, c);
      });
    }), this.activateSlotDrops(n), this.activateSlotAnchors(n), window.requestAnimationFrame(() => this.syncShipLinks(n)), window.setTimeout(() => this.syncShipLinks(n), 100));
  }
  activateSlotDrops(i) {
    i.querySelectorAll("[data-hd-slot-id]").forEach((n) => {
      n.addEventListener("dragover", (a) => {
        const o = b(), s = n.dataset.hdSlotId ?? "", r = o == null ? void 0 : o.slots.find((l) => l.id === s);
        !o || !we(o) || r != null && r.itemUuid || (a.preventDefault(), n.classList.add("is-drop-hover"));
      }), n.addEventListener("dragleave", () => n.classList.remove("is-drop-hover")), n.addEventListener("drop", async (a) => {
        var d, p;
        n.classList.remove("is-drop-hover"), a.preventDefault();
        const o = b(), s = n.dataset.hdSlotId ?? "", r = o == null ? void 0 : o.slots.find((u) => u.id === s);
        if (!o || !we(o) || r != null && r.itemUuid) return;
        const l = Bt(a), c = l.uuid ?? l.documentUuid ?? l.itemUuid ?? "";
        if (!o || !c) {
          (p = (d = ui.notifications) == null ? void 0 : d.warn) == null || p.call(d, "Drop a Foundry Item onto an equipment slot.");
          return;
        }
        await Pe(o.id, s, c);
      }), n.addEventListener("contextmenu", async (a) => {
        var r;
        if (!((r = game.user) != null && r.isGM)) return;
        a.preventDefault();
        const o = b(), s = n.dataset.hdSlotId ?? "";
        o && await ye(o.id, s);
      });
    });
  }
  activateSlotAnchors(i) {
    var a, o, s;
    const n = i.querySelector("[data-hd-ship-map]");
    n && ((a = this.linkResizeObserver) == null || a.disconnect(), this.linkResizeObserver = void 0, typeof ResizeObserver < "u" && (this.linkResizeObserver = new ResizeObserver(() => this.syncShipLinks(i)), this.linkResizeObserver.observe(i.querySelector(".hd-stage") ?? i)), (o = i.querySelector(".hd-slot-rail")) == null || o.addEventListener("scroll", () => this.syncShipLinks(i)), (s = n.querySelector("img")) == null || s.addEventListener("load", () => this.syncShipLinks(i)), i.querySelectorAll("[data-hd-link-slot]").forEach((r) => {
      r.addEventListener("click", () => {
        var l;
        (l = game.user) != null && l.isGM && (this.linkingSlotId = r.dataset.hdLinkSlot ?? "", i.classList.toggle("is-linking-slot", !!this.linkingSlotId));
      });
    }), i.querySelectorAll("[data-hd-clear-link]").forEach((r) => {
      r.addEventListener("click", async () => {
        const l = b(), c = r.dataset.hdClearLink ?? "";
        l && await rt(l.id, c);
      });
    }), n.addEventListener("click", async (r) => {
      var p;
      if (!((p = game.user) != null && p.isGM) || !this.linkingSlotId) return;
      r.preventDefault();
      const l = b(), c = this.getImageAnchorPoint(n, r.clientX, r.clientY), d = this.linkingSlotId;
      this.linkingSlotId = "", i.classList.remove("is-linking-slot"), l && await ge(l.id, d, c.x, c.y);
    }), i.querySelectorAll("[data-hd-anchor-slot]").forEach((r) => {
      r.addEventListener("click", (l) => {
        var d;
        l.preventDefault(), l.stopPropagation();
        const c = r.dataset.hdAnchorSlot ?? "";
        !c || (d = game.user) != null && d.isGM || (O = c, $ = "equipment", this.requestRender());
      }), r.addEventListener("pointerdown", (l) => {
        var w;
        if (!((w = game.user) != null && w.isGM)) return;
        l.preventDefault();
        const c = r.dataset.hdAnchorSlot ?? "", d = l.clientX, p = l.clientY;
        let u = !1;
        const m = (h) => {
          (Math.abs(h.clientX - d) > 3 || Math.abs(h.clientY - p) > 3) && (u = !0);
          const y = this.getImageAnchorPoint(n, h.clientX, h.clientY);
          r.dataset.hdAnchorX = String(y.x), r.dataset.hdAnchorY = String(y.y), this.syncShipLinks(i);
        }, f = async (h) => {
          if (window.removeEventListener("pointermove", m), window.removeEventListener("pointerup", f), !u) {
            O = c, $ = "equipment", this.requestRender();
            return;
          }
          const y = b(), k = this.getImageAnchorPoint(n, h.clientX, h.clientY);
          y && await ge(y.id, c, k.x, k.y);
        };
        window.addEventListener("pointermove", m), window.addEventListener("pointerup", f);
      });
    }));
  }
  getImageAnchorPoint(i, n, a) {
    const o = this.getShipImageRect(i), s = Math.min(100, Math.max(0, (n - o.left) / o.width * 100)), r = Math.min(100, Math.max(0, (a - o.top) / o.height * 100));
    return { x: s, y: r };
  }
  getShipImageRect(i) {
    const n = i.querySelector("img"), a = n == null ? void 0 : n.getBoundingClientRect();
    if (a != null && a.width && (a != null && a.height) && (n != null && n.naturalWidth) && (n != null && n.naturalHeight)) {
      const o = n.naturalWidth / n.naturalHeight, s = a.width / a.height;
      if (o > s) {
        const c = a.width / o, d = a.top + (a.height - c) / 2;
        return new DOMRect(a.left, d, a.width, c);
      }
      const r = a.height * o, l = a.left + (a.width - r) / 2;
      return new DOMRect(l, a.top, r, a.height);
    }
    return a != null && a.width && (a != null && a.height) ? a : i.getBoundingClientRect();
  }
  positionSlotPins(i) {
    const n = i.querySelector("[data-hd-ship-map]");
    if (!n) return;
    const a = this.getShipImageRect(n), o = n.getBoundingClientRect();
    i.querySelectorAll("[data-hd-anchor-slot]").forEach((s) => {
      const r = Number(s.dataset.hdAnchorX), l = Number(s.dataset.hdAnchorY);
      if (!Number.isFinite(r) || !Number.isFinite(l)) return;
      const c = a.left - o.left + a.width * r / 100, d = a.top - o.top + a.height * l / 100;
      s.style.left = `${c}px`, s.style.top = `${d}px`;
    });
  }
  syncShipLinks(i) {
    this.positionSlotPins(i), this.drawSlotLinks(i);
  }
  getSlotCardVisibility(i, n) {
    const a = i.querySelector(".hd-slot-rail");
    if (!a) return 1;
    const o = a.getBoundingClientRect(), s = n.getBoundingClientRect();
    if (!s.height || !o.height) return 1;
    const r = Math.max(s.top, o.top), l = Math.min(s.bottom, o.bottom), c = Math.max(0, l - r);
    return Math.min(1, Math.max(0, c / s.height));
  }
  drawSlotLinks(i) {
    const n = i.querySelector("[data-hd-link-lines]"), a = i.querySelector("[data-hd-ship-map]");
    if (!n || !a) return;
    const o = n.getBoundingClientRect(), s = Math.max(1, Math.round(o.width)), r = Math.max(1, Math.round(o.height));
    n.setAttribute("viewBox", `0 0 ${s} ${r}`), n.setAttribute("width", String(s)), n.setAttribute("height", String(r)), n.innerHTML = "", i.querySelectorAll("[data-hd-anchor-slot]").forEach((l) => {
      const c = l.dataset.hdAnchorSlot ?? "", d = i.querySelector(`[data-hd-slot-card="${c}"]`);
      if (!d) return;
      const p = l.getBoundingClientRect(), u = d.getBoundingClientRect(), m = p.left + p.width / 2 - o.left, f = p.top + p.height / 2 - o.top, w = u.left - o.left, h = u.top + u.height / 2 - o.top, y = Math.max(40, Math.abs(w - m) / 2), C = 0.12 + this.getSlotCardVisibility(i, d) * 0.83, E = document.createElementNS("http://www.w3.org/2000/svg", "path");
      E.setAttribute("d", `M ${m} ${f} C ${m + y} ${f}, ${w - y} ${h}, ${w} ${h}`), E.setAttribute("class", `hd-link-line ${l.dataset.hdAnchorState || ""}`.trim()), E.style.opacity = C.toFixed(2), n.append(E);
    });
  }
  browseShipImage() {
    var a, o;
    if (!q("choose ship images")) return;
    const i = Q(this), n = i == null ? void 0 : i.querySelector("[data-hd-profile-form] input[name='image']");
    if (!n || typeof FilePicker > "u") {
      (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Foundry FilePicker is not available.");
      return;
    }
    new FilePicker({
      type: "image",
      current: n.value,
      callback: (s) => {
        n.value = s;
      }
    }).browse();
  }
  async close(i = {}) {
    var n;
    return this.renderFrame && ((globalThis.cancelAnimationFrame ?? window.clearTimeout)(this.renderFrame), this.renderFrame = void 0), (n = this.linkResizeObserver) == null || n.disconnect(), this.linkResizeObserver = void 0, B = null, super.close(i);
  }
}
async function ft() {
  return B || (B = new di()), await B.render(!0), B;
}
function pi() {
  game.settings.register(S, be, {
    name: "HoloDock Ship Profiles",
    hint: "World-level ship profile and loadout data.",
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: j
  }), game.settings.register(S, ve, {
    name: "HoloDock Slot Categories",
    hint: "Reusable equipment slot categories for HoloDock.",
    scope: "world",
    config: !1,
    type: Array,
    default: G,
    onChange: j
  }), game.settings.register(S, Se, {
    name: "HoloDock Default Ship Profile",
    hint: "The ship profile this user opens by default.",
    scope: "client",
    config: !1,
    type: String,
    default: "",
    onChange: j
  });
}
function fi() {
  const e = {
    open: ft,
    getProfiles: We,
    getProfile: _,
    createProfile: Je,
    updateProfileMetadata: Qe,
    updateProfilePermissions: Ze,
    deleteProfile: nt,
    capturePowerPreset: et,
    applyPowerPreset: it,
    deletePowerPreset: tt,
    upsertSlot: ot,
    deleteSlot: st,
    upsertStat: $e,
    deleteStat: at,
    setSlotAnchor: ge,
    clearSlotAnchor: rt,
    equipItem: Pe,
    unequipItem: ye,
    getCategories: Z,
    getShipPowerBudget: dt,
    getShipEquipmentData: A,
    isShipEquipment: Et,
    validateItemForSlot: se,
    setShipEquipmentData: V,
    updateShipEquipmentDurability: ae,
    updateShipEquipmentPowerState: ze,
    updateShipEquipmentPowerAllocation: me,
    activateEquipment: Ye
  };
  game.holodock = e;
  const t = game.modules.get(S);
  t && (t.api = e);
}
function mi() {
  const e = game.modules.get("holosuite-core");
  return (e != null && e.active ? e.api : null) ?? game.holosuite ?? globalThis.HoloSuiteCoreApi ?? null;
}
function ue() {
  const e = mi();
  if (!(e != null && e.registerApp)) return !1;
  const t = {
    id: S,
    title: "HoloDock",
    icon: "fa-solid fa-shuttle-space",
    premium: !1,
    playerVisible: !0,
    description: "View and manage system-agnostic ship loadouts.",
    open: () => ft()
  };
  return e.registerApp(t), !0;
}
function hi() {
  if (ue()) return;
  let e = 0;
  const t = () => {
    e += 1, !(ue() || e >= 20) && window.setTimeout(t, 250);
  };
  Hooks.once("holosuite-core.apiReady", () => ue()), window.setTimeout(t, 250);
}
Hooks.once("init", async () => {
  pi(), Handlebars.registerHelper("hdFallback", (e, t) => e || t), await loadTemplates([Ne]);
});
Hooks.once("ready", () => {
  fi(), Ht(), Hooks.on("getApplicationHeaderButtons", te), Hooks.on("getApplicationV1HeaderButtons", te), Hooks.on("getDocumentSheetHeaderButtons", te), Hooks.on("getItemSheetHeaderButtons", te), Hooks.on("getHeaderControlsApplicationV2", li), Hooks.on("renderItemSheet", J), Hooks.on("renderItemSheetV2", J), Hooks.on("renderApplication", J), Hooks.on("renderApplicationV1", J), Hooks.on("renderApplicationV2", J), Hooks.on("renderChatMessage", He), Hooks.on("renderChatMessageHTML", He), hi(), console.log(`${S} | Ready. API available at game.holodock.`);
});
