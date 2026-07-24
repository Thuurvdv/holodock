var mt = Object.defineProperty;
var gt = (e, t, i) => t in e ? mt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var J = (e, t, i) => gt(e, typeof t != "symbol" ? t + "" : t, i);
function yt() {
  var e, t, i;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.applications) == null ? void 0 : t.api) ?? ((i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.api) ?? null;
}
function bt() {
  var e, t, i;
  return ((t = (e = globalThis.foundry) == null ? void 0 : e.appv1) == null ? void 0 : t.api) ?? ((i = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : i.api) ?? null;
}
function wt(e = {}, t = {}) {
  var a, n, o;
  const i = ((n = (a = globalThis.foundry) == null ? void 0 : a.utils) == null ? void 0 : n.mergeObject) ?? ((o = foundry == null ? void 0 : foundry.utils) == null ? void 0 : o.mergeObject);
  return typeof i == "function" ? i(e, t, { inplace: !1 }) : { ...e, ...t };
}
function vt() {
  var e, t, i, a, n;
  return ((i = (t = (e = globalThis.foundry) == null ? void 0 : e.utils) == null ? void 0 : t.randomID) == null ? void 0 : i.call(t, 8)) ?? ((n = (a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.randomID) == null ? void 0 : n.call(a, 8)) ?? Math.random().toString(36).slice(2, 10);
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
    constructor(a = {}) {
      const n = wt(new.target.defaultOptions ?? {}, a);
      super(xe(n));
      J(this, "_v1Options");
      this._v1Options = n;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return xe(this.defaultOptions ?? {});
    }
    activateListeners(a) {
    }
    async _renderHTML(a, n) {
      var c, d, u;
      const o = typeof this.getData == "function" ? await this.getData() : {}, s = ((c = this._v1Options) == null ? void 0 : c.template) ?? ((d = this.options) == null ? void 0 : d.template) ?? ((u = this.constructor.defaultOptions) == null ? void 0 : u.template);
      if (!s) return document.createDocumentFragment();
      const l = await globalThis.renderTemplate(s, o), r = document.createElement("template");
      return r.innerHTML = l.trim(), r.content;
    }
    _activateV1Form(a) {
      var o, s;
      if (typeof this._updateObject != "function") return;
      const n = (o = a.matches) != null && o.call(a, "form") ? a : (s = a.querySelector) == null ? void 0 : s.call(a, "form");
      n instanceof HTMLFormElement && n.addEventListener("submit", async (l) => {
        var r;
        l.preventDefault(), l.stopPropagation(), await this._updateObject(l, new FormData(n)), ((r = this._v1Options) == null ? void 0 : r.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(a, n, o) {
      var d, u, p, h;
      n.replaceChildren(a);
      const s = globalThis.jQuery ?? globalThis.$, l = ((d = n.closest) == null ? void 0 : d.call(n, ".window-app, .app, .application")) ?? n, r = s ? s(l) : l;
      try {
        Object.defineProperty(this, "element", {
          value: r,
          configurable: !0,
          writable: !0
        });
      } catch {
        try {
          this.element = r;
        } catch {
        }
      }
      const c = (u = this._v1Options) == null ? void 0 : u.classes;
      Array.isArray(c) && c.length && (n.classList.add(...c), (h = (p = n.closest) == null ? void 0 : p.call(n, ".window-app, .app, .application")) == null || h.classList.add(...c)), this._activateV1Form(n), typeof this.activateListeners == "function" && this.activateListeners(s ? s(n) : n);
    }
  };
}
function kt() {
  const e = yt(), t = bt(), i = globalThis.Application ?? (t == null ? void 0 : t.Application) ?? (e == null ? void 0 : e.ApplicationV1);
  if (i) return i;
  const a = e == null ? void 0 : e.ApplicationV2;
  return a ? St(a) : null;
}
const w = "holodock", Ne = "HoloDock", ke = "profiles", qe = "slotCategories", Ae = "defaultProfile", Ue = "chatCardsEnabled", me = "shipEquipment", Ge = `modules/${w}/templates/holodock.hbs`, oe = "modules/holodock/assets/SpaceshipDefault.webp", qt = "icons/svg/space-station.svg", V = ["Weapons", "Defense", "Utility", "Engines", "Cargo", "Special"];
function x(e) {
  var t, i;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.deepClone ? foundry.utils.deepClone(e) : (i = foundry == null ? void 0 : foundry.utils) != null && i.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e ?? {}));
}
function D(e = "hd") {
  var i, a, n;
  const t = ((a = (i = foundry == null ? void 0 : foundry.utils) == null ? void 0 : i.randomID) == null ? void 0 : a.call(i)) ?? ((n = crypto == null ? void 0 : crypto.randomUUID) == null ? void 0 : n.call(crypto)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${e}-${t}`;
}
function g(e) {
  var i;
  if ((i = foundry == null ? void 0 : foundry.utils) != null && i.escapeHTML) return foundry.utils.escapeHTML(String(e ?? ""));
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function A(e = "edit HoloDock") {
  var t, i, a;
  return (t = game.user) != null && t.isGM ? !0 : ((a = (i = ui.notifications) == null ? void 0 : i.warn) == null || a.call(i, `Only a GM can ${e}.`), !1);
}
const At = kt();
let B = null, Q = null, L = "", k = "overview", H = "", Le = "", Me = 0;
const pe = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map(), Ve = `module.${w}`, ge = [
  { id: "overview", label: "Overview", icon: "fa-solid fa-display" },
  { id: "systems", label: "Systems", icon: "fa-solid fa-microchip" },
  { id: "power", label: "Power Grid", icon: "fa-solid fa-bolt" },
  { id: "damage", label: "Damage", icon: "fa-solid fa-shield-halved" },
  { id: "speed", label: "Speed", icon: "fa-solid fa-gauge-high" },
  { id: "capacity", label: "Capacity", icon: "fa-solid fa-users" }
];
function N(e = {}) {
  const t = Number(e.anchorX), i = Number(e.anchorY), a = String(e.category || e.label || V[0]).trim() || V[0];
  return {
    id: String(e.id || D("slot")),
    label: a,
    category: a,
    description: String(e.description || "").trim(),
    requiredCategory: String(e.requiredCategory || "").trim(),
    requiredTags: Array.isArray(e.requiredTags) ? e.requiredTags.map((n) => String(n).trim()).filter(Boolean) : [],
    anchorX: Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : void 0,
    anchorY: Number.isFinite(i) ? Math.min(100, Math.max(0, i)) : void 0,
    itemUuid: String(e.itemUuid || "").trim() || void 0
  };
}
function O(e = {}) {
  return {
    id: String(e.id || D("stat")),
    label: String(e.label || "Statistic").trim() || "Statistic",
    value: String(e.value || "").trim(),
    note: String(e.note || "").trim()
  };
}
function je(e = {}) {
  return {
    hiddenFromPlayers: e.hiddenFromPlayers === !0,
    allowPlayerEquip: e.allowPlayerEquip === !0,
    allowPlayerActivate: e.allowPlayerActivate !== !1
  };
}
function U(e = {}) {
  const t = String(e.image || oe).trim() || oe;
  return {
    id: String(e.id || D("ship")),
    name: String(e.name || "Party Ship").trim() || "Party Ship",
    shipClass: String(e.shipClass || "").trim(),
    image: t === qt ? oe : t,
    powerCapacity: Math.max(0, S(e.powerCapacity, 0)),
    permissions: je(e.permissions),
    stats: Array.isArray(e.stats) ? e.stats.map(O) : [],
    slots: Array.isArray(e.slots) ? e.slots.map(N) : []
  };
}
function S(e, t = 0) {
  const i = Number(e);
  return Number.isFinite(i) ? i : t;
}
function _e(e) {
  return Array.isArray(e) ? e.map((t) => String(t).trim()).filter(Boolean) : String(e || "").split(",").map((t) => t.trim()).filter(Boolean);
}
function ce(e = {}) {
  var o, s, l, r, c, d, u, p, h, f, y, m, b, q, $, C, R;
  const t = Math.max(0, S((o = e.durability) == null ? void 0 : o.max, 0)), i = Math.min(t, Math.max(0, S((s = e.durability) == null ? void 0 : s.value, t))), a = String(e.category || V[0]).trim() || V[0], n = {
    enabled: e.enabled === !0,
    category: a,
    tags: _e(e.tags),
    activation: {
      enabled: ((l = e.activation) == null ? void 0 : l.enabled) === !0,
      label: String(((r = e.activation) == null ? void 0 : r.label) || "Activate").trim() || "Activate",
      actionType: String(((c = e.activation) == null ? void 0 : c.actionType) || "").trim(),
      cooldown: Math.max(0, S((d = e.activation) == null ? void 0 : d.cooldown, 0)),
      resourceCost: String(((u = e.activation) == null ? void 0 : u.resourceCost) || "").trim(),
      durabilityCost: Math.max(0, S((p = e.activation) == null ? void 0 : p.durabilityCost, 0)),
      blockWhenBroken: ((h = e.activation) == null ? void 0 : h.blockWhenBroken) !== !1,
      lastActivatedAt: Math.max(0, S((f = e.activation) == null ? void 0 : f.lastActivatedAt, 0))
    },
    durability: {
      enabled: ((y = e.durability) == null ? void 0 : y.enabled) === !0,
      value: i,
      max: t,
      brokenAt: Math.max(0, S((m = e.durability) == null ? void 0 : m.brokenAt, 0))
    },
    power: {
      enabled: ((b = e.power) == null ? void 0 : b.enabled) === !0,
      draw: Math.max(0, S((q = e.power) == null ? void 0 : q.draw, 0)),
      allocated: Math.max(0, S(($ = e.power) == null ? void 0 : $.allocated, ((C = e.power) == null ? void 0 : C.draw) ?? 0)),
      online: ((R = e.power) == null ? void 0 : R.online) !== !1
    }
  };
  return Et(n);
}
function Et(e) {
  const t = x(e), i = t.enabled && t.durability.enabled && t.durability.value <= t.durability.brokenAt, a = t.enabled && t.power.enabled && t.power.draw > 0 && t.power.allocated <= 0;
  return t.enabled && t.power.enabled && (a || i) && (t.power.online = !1), t;
}
function E(e) {
  var t;
  return ce(((t = e == null ? void 0 : e.getFlag) == null ? void 0 : t.call(e, w, me)) ?? {});
}
function Ct(e) {
  return E(e).enabled;
}
async function _(e, t, i = {}) {
  var o;
  if (i.requireGm !== !1 && !A("tag ship equipment") || !(e != null && e.setFlag)) return null;
  const a = E(e), n = ce({
    ...a,
    ...t,
    tags: t.tags ?? a.tags,
    activation: {
      ...a.activation,
      ...t.activation
    },
    durability: {
      ...a.durability,
      ...t.durability
    },
    power: {
      ...a.power,
      ...t.power
    }
  });
  return n.enabled ? (await e.setFlag(w, me, n), await be(n.category), G(), n) : (await ((o = e.unsetFlag) == null ? void 0 : o.call(e, w, me)), G(), n);
}
async function re(e, t, i = {}) {
  const a = E(e), n = Math.max(0, a.durability.max), o = Math.min(n, Math.max(0, S(t, a.durability.value)));
  return _(e, {
    enabled: a.enabled,
    durability: {
      ...a.durability,
      value: o
    }
  }, i);
}
async function ze(e, t) {
  const i = E(e);
  return !i.enabled || !i.power.enabled ? null : _(e, {
    enabled: i.enabled,
    power: {
      ...i.power,
      online: t === !0
    }
  });
}
async function ye(e, t) {
  const i = E(e);
  return !i.enabled || !i.power.enabled ? null : _(e, {
    enabled: i.enabled,
    power: {
      ...i.power,
      allocated: Math.max(0, S(t, i.power.allocated))
    }
  });
}
function Ee(e) {
  const t = e.durability, i = e.enabled && t.enabled, a = Math.max(0, t.max), n = Math.min(a, Math.max(0, t.value)), o = i && n <= t.brokenAt, s = i && !o && a > 0 && n < a;
  return { isBroken: o, isDamaged: s, value: n, max: a };
}
async function We(e, t = {}) {
  var n, o, s, l, r, c, d, u, p;
  if (!Ye()) return null;
  const i = globalThis.ChatMessage;
  if (!(i != null && i.create))
    return (o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, "Foundry chat is not available."), null;
  let a = { alias: ((s = game.user) == null ? void 0 : s.name) ?? Ne };
  try {
    a = ((c = i.getSpeaker) == null ? void 0 : c.call(i, { actor: ((l = game.user) == null ? void 0 : l.character) ?? void 0, alias: (r = game.user) == null ? void 0 : r.name })) ?? a;
  } catch (h) {
    console.debug(`${w} | Could not resolve chat speaker, using fallback.`, h);
  }
  try {
    return await i.create({
      user: (d = game.user) == null ? void 0 : d.id,
      speaker: a,
      content: e,
      flags: t
    });
  } catch (h) {
    return console.warn(`${w} | Failed to create HoloDock chat card.`, h), (p = (u = ui.notifications) == null ? void 0 : u.warn) == null || p.call(u, "HoloDock could not create a chat card. Check the console for details."), null;
  }
}
function Ye() {
  return game.settings.get(w, Ue) !== !1;
}
async function K(e, t, i = {}) {
  var c;
  const a = E(e), n = Ee(a), o = i.slot, s = i.profile, l = t.blocked || !t.ok ? "Blocked" : t.handled ? "Activated" : "Unhandled", r = `
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
        ${s ? `<div><dt>Ship</dt><dd>${g(s.name)}</dd></div>` : ""}
        ${o ? `<div><dt>Slot</dt><dd>${g(o.label)}</dd></div>` : ""}
        ${a.activation.actionType ? `<div><dt>Action</dt><dd>${g(a.activation.actionType)}</dd></div>` : ""}
        ${a.activation.resourceCost ? `<div><dt>Resource</dt><dd>${g(a.activation.resourceCost)}</dd></div>` : ""}
        ${a.activation.cooldown ? `<div><dt>Cooldown</dt><dd>${a.activation.cooldown} rounds</dd></div>` : ""}
        ${a.durability.enabled ? `<div><dt>Durability</dt><dd>${n.value} / ${n.max}</dd></div>` : ""}
      </dl>
      ${(c = t.consequences) != null && c.length ? `<ul>${t.consequences.map((d) => `<li>${g(d)}</li>`).join("")}</ul>` : ""}
      ${t.message ? `<p>${g(t.message)}</p>` : ""}
    </article>
  `;
  await We(r);
}
async function Xe(e, t = {}) {
  const i = E(e);
  if (!i.enabled || !i.activation.enabled)
    return { ok: !1, handled: !1, blocked: !0, message: "That item is not configured as activatable ship equipment." };
  if (i.power.enabled && !i.power.online) {
    const u = { ok: !1, handled: !1, blocked: !0, message: "That ship equipment is offline." };
    return await K(e, u, t), u;
  }
  if (i.power.enabled && i.power.allocated < i.power.draw) {
    const u = { ok: !1, handled: !1, blocked: !0, message: "That ship equipment does not have enough allocated power." };
    return await K(e, u, t), u;
  }
  const a = Ee(i);
  if (i.activation.blockWhenBroken && a.isBroken) {
    const u = { ok: !1, handled: !1, blocked: !0, message: "That ship equipment is broken." };
    return await K(e, u, t), u;
  }
  const n = Date.now();
  if (i.activation.durabilityCost > 0 && i.durability.enabled && a.value <= 0) {
    const u = {
      ok: !1,
      handled: !1,
      blocked: !0,
      message: "That ship equipment has no durability left to spend.",
      consequences: [`Required durability: ${i.activation.durabilityCost}`]
    };
    return await K(e, u, t), u;
  }
  const o = {
    item: e,
    equipment: i,
    durabilityState: a,
    handled: !1,
    blocked: !1,
    message: "",
    consequences: [],
    ...t
  };
  if (Hooks.callAll(`${w}.activateEquipment`, o), o.blocked) {
    const u = {
      ok: !1,
      handled: o.handled === !0,
      blocked: !0,
      message: String(o.message || "Ship equipment activation was blocked."),
      consequences: o.consequences
    };
    return await K(e, u, t), u;
  }
  const s = [...o.consequences], l = {
    enabled: i.enabled,
    activation: {
      ...i.activation,
      lastActivatedAt: n
    }
  };
  if (i.activation.durabilityCost > 0 && i.durability.enabled) {
    const u = Math.max(0, a.value - i.activation.durabilityCost);
    l.durability = {
      ...i.durability,
      value: u
    }, s.push(`Durability spent: ${i.activation.durabilityCost} (${u}/${a.max} remaining)`);
  }
  i.activation.resourceCost && s.push(`Resource cost: ${i.activation.resourceCost}`), i.activation.cooldown > 0 && s.push(`Cooldown started: ${i.activation.cooldown} round${i.activation.cooldown === 1 ? "" : "s"}`);
  let r = !1;
  try {
    r = await $t(e, l, t);
  } catch (u) {
    console.warn(`${Ne} | Failed to save activation consequences`, u);
  }
  !r && s.length && s.push("Consequence state could not be saved; check item permissions.");
  const c = o.handled === !0 || s.length > 0, d = {
    ok: !0,
    handled: c,
    blocked: !1,
    message: String(o.message || (c ? "Ship equipment activated." : "No system handled this ship equipment activation.")),
    consequences: s
  };
  return Hooks.callAll(`${w}.equipmentActivated`, { item: e, equipment: E(e), result: d, ...t }), await K(e, d, t), d;
}
async function $t(e, t, i = {}) {
  var s;
  if ((s = game.user) != null && s.isGM)
    return !!await _(e, t);
  const a = i.profile, n = i.slot;
  if (!(a != null && a.id) || !(n != null && n.id) || !(e != null && e.uuid)) return !1;
  const o = D("activate");
  return new Promise((l) => {
    var c;
    const r = window.setTimeout(() => {
      se.delete(o), l(!1);
    }, 5e3);
    se.set(o, (d) => {
      window.clearTimeout(r), l(d);
    }), W({
      action: "saveActivationConsequences",
      requestId: o,
      userId: (c = game.user) == null ? void 0 : c.id,
      profileId: a.id,
      slotId: n.id,
      itemUuid: e.uuid,
      equipmentData: t
    });
  });
}
function P() {
  const e = game.settings.get(w, ke);
  if (!e || typeof e != "object" || Array.isArray(e)) return {};
  const t = {};
  for (const i of Object.values(e)) {
    const a = U(i);
    t[a.id] = a;
  }
  return t;
}
function Ke() {
  return Object.values(P()).sort((e, t) => e.name.localeCompare(t.name));
}
function Je() {
  var t;
  const e = Ke();
  return (t = game.user) != null && t.isGM ? e : e.filter((i) => !i.permissions.hiddenFromPlayers);
}
function Qe() {
  return String(game.settings.get(w, Ae) || "");
}
async function Ce(e) {
  await game.settings.set(w, Ae, e);
}
async function M(e, t = {}) {
  t.requireGm !== !1 && !A("save ship loadouts") || (await game.settings.set(w, ke, e), G());
}
function te() {
  const e = game.settings.get(w, qe), t = Array.isArray(e) ? e.map((i) => String(i).trim()).filter(Boolean) : [];
  return t.length ? [...new Set(t)] : V;
}
async function be(e) {
  var a;
  const t = String(e || "").trim();
  if (!t || !((a = game.user) != null && a.isGM)) return;
  const i = te();
  i.some((n) => n.toLowerCase() === t.toLowerCase()) || await game.settings.set(w, qe, [...i, t]);
}
function v() {
  const e = Je();
  if (!e.length) return null;
  if (!L || !e.some((t) => t.id === L)) {
    const t = Qe();
    L = e.some((i) => i.id === t) ? t : e[0].id;
  }
  return e.find((t) => t.id === L) ?? null;
}
function j(e = L) {
  const t = P()[e];
  return t ? U(t) : null;
}
async function Ze() {
  if (!A("create ship profiles")) return null;
  const e = U({
    id: D("ship"),
    name: "New Ship",
    shipClass: "",
    image: oe,
    powerCapacity: 0,
    stats: [
      O({ id: D("stat"), label: "Speed", value: "6", note: "" }),
      O({ id: D("stat"), label: "Cruise Speed", value: "4", note: "Efficient travel" }),
      O({ id: D("stat"), label: "Fuel", value: "100%", note: "" }),
      O({ id: D("stat"), label: "Defense", value: "10", note: "" }),
      O({ id: D("stat"), label: "Capacity", value: "6", note: "Crew and passengers" }),
      O({ id: D("stat"), label: "Cargo", value: "2 tons", note: "Available hold" })
    ],
    slots: V.slice(0, 4).map((i) => N({
      id: D("slot"),
      label: i,
      category: i
    }))
  }), t = x(P());
  return t[e.id] = e, L = e.id, await Ce(e.id), await M(t), e;
}
async function et(e, t) {
  if (!A("update ship profiles")) return null;
  const i = x(P()), a = i[e];
  if (!a) return null;
  const n = U({
    ...a,
    name: t.name,
    shipClass: t.shipClass,
    image: t.image,
    powerCapacity: t.powerCapacity,
    permissions: a.permissions,
    stats: a.stats,
    slots: a.slots
  });
  return i[e] = n, await M(i), n;
}
async function tt(e, t) {
  if (!A("update HoloDock player rights")) return null;
  const i = x(P()), a = i[e];
  if (!a) return null;
  const n = U({
    ...a,
    permissions: {
      ...a.permissions,
      ...t
    }
  });
  return i[e] = n, await M(i), n;
}
async function it(e = L) {
  if (!A("delete ship profiles")) return !1;
  const t = j(e);
  if (!t || !await Dialog.confirm({
    title: "Delete Ship Profile",
    content: `<p>Delete <strong>${g(t.name)}</strong>?</p>`,
    defaultYes: !1
  })) return !1;
  const a = x(P());
  return delete a[e], L = Object.keys(a)[0] ?? "", Qe() === e && await Ce(L), await M(a), !0;
}
async function le(e, t) {
  if (!A("edit ship statistics")) return null;
  const i = x(P()), a = i[e];
  if (!a) return null;
  const n = O(t), o = a.stats.findIndex((s) => s.id === n.id);
  return o >= 0 ? a.stats[o] = { ...a.stats[o], ...n } : a.stats.push(n), i[e] = U(a), await M(i), n;
}
async function at(e, t) {
  if (!A("delete ship statistics")) return !1;
  const i = x(P()), a = i[e];
  if (!a) return !1;
  const n = a.stats.find((s) => s.id === t);
  return !n || !await Dialog.confirm({
    title: "Delete Ship Statistic",
    content: `<p>Delete <strong>${g(n.label)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (a.stats = a.stats.filter((s) => s.id !== t), i[e] = U(a), await M(i), !0);
}
async function nt(e, t) {
  if (!A("edit equipment slots")) return null;
  const i = x(P()), a = i[e];
  if (!a) return null;
  const n = a.slots.findIndex((s) => s.id === t.id), o = N(n >= 0 ? { ...a.slots[n], ...t } : t);
  return n >= 0 ? a.slots[n] = o : a.slots.push(o), i[e] = U(a), await be(o.category), o.requiredCategory && await be(o.requiredCategory), await M(i), o;
}
async function ot(e, t) {
  if (!A("delete equipment slots")) return !1;
  const i = x(P()), a = i[e];
  if (!a) return !1;
  const n = a.slots.find((s) => s.id === t);
  return !n || !await Dialog.confirm({
    title: "Delete Equipment Slot",
    content: `<p>Delete <strong>${g(n.label)}</strong>?</p>`,
    defaultYes: !1
  }) ? !1 : (a.slots = a.slots.filter((s) => s.id !== t), i[e] = U(a), await M(i), !0);
}
async function we(e, t, i, a) {
  var s;
  if (!A("place equipment links")) return !1;
  const n = x(P()), o = (s = n[e]) == null ? void 0 : s.slots.find((l) => l.id === t);
  return o ? (o.anchorX = Math.min(100, Math.max(0, Number(i))), o.anchorY = Math.min(100, Math.max(0, Number(a))), await M(n), !0) : !1;
}
async function st(e, t) {
  var n;
  if (!A("clear equipment links")) return !1;
  const i = x(P()), a = (n = i[e]) == null ? void 0 : n.slots.find((o) => o.id === t);
  return a ? (delete a.anchorX, delete a.anchorY, await M(i), !0) : !1;
}
function rt(e) {
  const t = [];
  return e.requiredCategory && t.push(`Category: ${e.requiredCategory}`), e.requiredTags.length && t.push(`Tags: ${e.requiredTags.join(", ")}`), t.join(" | ");
}
function $e(e, t) {
  const i = E(t);
  return i.enabled ? i : ce({
    ...i,
    enabled: !0,
    category: e.requiredCategory || e.category
  });
}
function de(e, t, i = $e(e, t)) {
  if (e.requiredCategory && i.category.toLowerCase() !== e.requiredCategory.toLowerCase())
    return { ok: !1, reason: `That slot requires ${e.requiredCategory} ship equipment.` };
  const a = new Set(i.tags.map((o) => o.toLowerCase())), n = e.requiredTags.filter((o) => !a.has(o.toLowerCase()));
  return n.length ? { ok: !1, reason: `That slot requires tag${n.length === 1 ? "" : "s"}: ${n.join(", ")}.` } : { ok: !0 };
}
async function It(e, t, i, a = !1) {
  return Dialog.confirm({
    title: a ? "Replace Ship Equipment" : "Install Ship Equipment",
    content: `
      <section class="hd-install-confirm">
        <i class="fas fa-rocket"></i>
        <div>
          <p>${a ? `Replace the current equipment in <strong>${g(e.label)}</strong> with <strong>${g((t == null ? void 0 : t.name) ?? "this item")}</strong>?` : `Install <strong>${g((t == null ? void 0 : t.name) ?? "this item")}</strong> into <strong>${g(e.label)}</strong>?`}</p>
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
function ve(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 || (e == null ? void 0 : e.permissions.allowPlayerEquip) === !0;
}
function Dt(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 || (e == null ? void 0 : e.permissions.allowPlayerActivate) === !0;
}
async function Ie(e, t, i, a = {}) {
  var p, h;
  const n = await T(i);
  if (!n)
    return { ok: !1, message: "Drop a Foundry Item onto the equipment slot." };
  const o = x(P()), s = o[e], l = s == null ? void 0 : s.slots.find((f) => f.id === t);
  if (!s || !l) return { ok: !1, message: "That ship slot could not be found." };
  if (!s.permissions.allowPlayerEquip && !((p = game.user) != null && p.isGM))
    return { ok: !1, message: "Players are not allowed to install equipment on this ship." };
  const r = N(l), c = E(n), d = $e(r, n), u = de(r, n, d);
  if (!u.ok)
    return { ok: !1, message: u.reason ?? "That item is not compatible with this ship slot." };
  if (!c.enabled) {
    const f = await _(n, d, { requireGm: ((h = game.user) == null ? void 0 : h.isGM) !== !0 ? !1 : void 0 });
    if (!(f != null && f.enabled)) return { ok: !1, message: "That item could not be converted into ship equipment." };
  }
  return l.itemUuid = n.uuid, await M(o), a.openEditor && !c.enabled && window.setTimeout(() => X(n), 50), { ok: !0, message: `${n.name ?? "Item"} installed in ${r.label}.` };
}
function He() {
  var a;
  const e = game.users, i = (Array.isArray(e) ? e : Array.isArray(e == null ? void 0 : e.contents) ? e.contents : Array.from(e ?? [])).filter((n) => (n == null ? void 0 : n.active) && (n == null ? void 0 : n.isGM)).sort((n, o) => String(n.id ?? "").localeCompare(String(o.id ?? "")));
  return String(((a = i[0]) == null ? void 0 : a.id) ?? "");
}
function W(e) {
  var t, i;
  (i = (t = game.socket) == null ? void 0 : t.emit) == null || i.call(t, Ve, e);
}
function Tt(e) {
  var a, n;
  const t = game.users, i = ((a = t == null ? void 0 : t.get) == null ? void 0 : a.call(t, e)) ?? ((n = t == null ? void 0 : t.find) == null ? void 0 : n.call(t, (o) => (o == null ? void 0 : o.id) === e));
  return String((i == null ? void 0 : i.name) || "A player");
}
async function Pt(e) {
  const t = j(String(e.profileId || "")), i = t == null ? void 0 : t.slots.find((n) => n.id === e.slotId), a = await T(String(e.itemUuid || ""));
  return !t || !i || !a ? !1 : Dialog.confirm({
    title: "Player Ship Equipment Install",
    content: `
      <section class="hd-install-confirm">
        <i class="fa-solid fa-user-shield"></i>
        <div>
          <p><strong>${g(Tt(e.userId))}</strong> wants to install <strong>${g(a.name ?? "this item")}</strong>.</p>
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
async function xt(e, t, i) {
  var r, c, d, u, p, h, f, y, m, b;
  const a = D("equip"), n = j(e), o = n == null ? void 0 : n.slots.find((q) => q.id === t), s = await T(i);
  return !n || !o || !s ? ((c = (r = ui.notifications) == null ? void 0 : r.warn) == null || c.call(r, "That ship equipment request could not be prepared."), !1) : Ye() ? await We(
    `
      <article class="hd-chat-card hd-install-request-card" data-hd-install-request="${g(a)}" data-hd-profile-id="${g(e)}" data-hd-slot-id="${g(t)}" data-hd-item-uuid="${g(i)}" data-hd-user-id="${g(((h = game.user) == null ? void 0 : h.id) ?? "")}">
        <header>
          <img src="${g(s.img || "icons/svg/item-bag.svg")}" alt="">
          <div>
            <p class="hd-kicker">HoloDock Install Request</p>
            <h3>${g(s.name ?? "Ship Equipment")}</h3>
          </div>
        </header>
        <dl>
          <div><dt>Player</dt><dd>${g(((f = game.user) == null ? void 0 : f.name) ?? "Player")}</dd></div>
          <div><dt>Ship</dt><dd>${g(n.name)}</dd></div>
          <div><dt>Slot</dt><dd>${g(o.label)}</dd></div>
        </dl>
        <p>A player wants to install this item as HoloDock ship equipment.</p>
        <footer class="hd-chat-actions">
          <button type="button" data-hd-install-approve="${g(a)}"><i class="fa-solid fa-check"></i> Approve</button>
          <button type="button" data-hd-install-reject="${g(a)}"><i class="fa-solid fa-xmark"></i> Reject</button>
        </footer>
      </article>
    `,
    {
      [w]: {
        installRequest: {
          requestId: a,
          userId: (y = game.user) == null ? void 0 : y.id,
          profileId: e,
          slotId: t,
          itemUuid: i,
          status: "pending"
        }
      }
    }
  ) ? ((b = (m = ui.notifications) == null ? void 0 : m.info) == null || b.call(m, "HoloDock posted the install request to chat."), !0) : !1 : (W({
    action: "equipItem",
    requestId: a,
    userId: (d = game.user) == null ? void 0 : d.id,
    profileId: e,
    slotId: t,
    itemUuid: i
  }), (p = (u = ui.notifications) == null ? void 0 : u.info) == null || p.call(u, "HoloDock sent the install request to the GM."), !0);
}
function Lt() {
  var e, t;
  (t = (e = game.socket) == null ? void 0 : e.on) == null || t.call(e, Ve, async (i) => {
    var s, l, r, c, d, u, p, h;
    if (!i || typeof i != "object") return;
    if (i.action === "activationConsequencesResult") {
      if (i.userId && i.userId !== ((s = game.user) == null ? void 0 : s.id)) return;
      const f = se.get(String(i.requestId || ""));
      if (!f) return;
      se.delete(String(i.requestId || "")), f(i.ok === !0), G();
      return;
    }
    if (i.action === "saveActivationConsequences") {
      if (!((l = game.user) != null && l.isGM) || game.user.id !== He()) return;
      const f = j(String(i.profileId || "")), y = f == null ? void 0 : f.slots.find((q) => q.id === i.slotId);
      if (!(f != null && f.permissions.allowPlayerActivate) || (y == null ? void 0 : y.itemUuid) !== i.itemUuid) {
        W({
          action: "activationConsequencesResult",
          requestId: i.requestId,
          userId: i.userId,
          ok: !1,
          message: "Players are not allowed to activate systems on this ship."
        });
        return;
      }
      const m = await T(String(i.itemUuid || ""));
      let b = !1;
      m && i.equipmentData && (b = !!await _(m, i.equipmentData)), W({
        action: "activationConsequencesResult",
        requestId: i.requestId,
        userId: i.userId,
        ok: b,
        message: b ? "Ship equipment activation saved." : "Ship equipment activation could not be saved."
      });
      return;
    }
    if (i.action === "equipItemResult") {
      if (i.userId && i.userId !== ((r = game.user) == null ? void 0 : r.id)) return;
      i.ok ? (d = (c = ui.notifications) == null ? void 0 : c.info) == null || d.call(c, i.message ?? "Ship equipment installed.") : (p = (u = ui.notifications) == null ? void 0 : u.warn) == null || p.call(u, i.message ?? "Ship equipment could not be installed."), G();
      return;
    }
    if (i.action !== "equipItem" || !((h = game.user) != null && h.isGM) || game.user.id !== He()) return;
    const a = j(String(i.profileId || ""));
    if (!(a != null && a.permissions.allowPlayerEquip)) {
      W({
        action: "equipItemResult",
        requestId: i.requestId,
        userId: i.userId,
        ok: !1,
        message: "Players are not allowed to install equipment on this ship."
      });
      return;
    }
    if (!await Pt(i)) {
      W({
        action: "equipItemResult",
        requestId: i.requestId,
        userId: i.userId,
        ok: !1,
        message: "The GM rejected the ship equipment install request."
      });
      return;
    }
    const o = await Ie(String(i.profileId || ""), String(i.slotId || ""), String(i.itemUuid || ""), { openEditor: !1 });
    W({
      action: "equipItemResult",
      requestId: i.requestId,
      userId: i.userId,
      ok: o.ok,
      message: o.message
    });
  });
}
function Mt(e, t = null) {
  const i = [e == null ? void 0 : e.document, e == null ? void 0 : e.message, e == null ? void 0 : e.object, e];
  for (const a of i)
    if (a != null && a.getFlag && (a != null && a.setFlag)) return a;
  return null;
}
async function Ht(e, t) {
  var n;
  const i = ((n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, w, "installRequest")) ?? {}, a = {
    requestId: String(i.requestId || t.dataset.hdInstallRequest || ""),
    userId: String(i.userId || t.dataset.hdUserId || ""),
    profileId: String(i.profileId || t.dataset.hdProfileId || ""),
    slotId: String(i.slotId || t.dataset.hdSlotId || ""),
    itemUuid: String(i.itemUuid || t.dataset.hdItemUuid || ""),
    status: String(i.status || "pending")
  };
  return a.requestId && a.profileId && a.slotId && a.itemUuid ? a : null;
}
async function Re(e, t, i) {
  var l, r, c;
  const a = ((l = e == null ? void 0 : e.getFlag) == null ? void 0 : l.call(e, w, "installRequest")) ?? {};
  await ((r = e == null ? void 0 : e.setFlag) == null ? void 0 : r.call(e, w, "installRequest", { ...a, status: t, resultMessage: i }));
  const n = String((e == null ? void 0 : e.content) || ""), o = `<p class="hd-install-request-status ${t === "approved" ? "is-approved" : "is-rejected"}">${g(i)}</p>`, s = n.replace(/<footer class="hd-chat-actions">[\s\S]*?<\/footer>/, o);
  s !== n && await ((c = e == null ? void 0 : e.update) == null ? void 0 : c.call(e, { content: s }));
}
function Oe(e, t = null) {
  const i = ee(null, t), a = Mt(e, t);
  !i || !a || i.querySelectorAll("[data-hd-install-request]").forEach((n) => {
    const o = (s, l) => {
      var r;
      (r = n.querySelector(s)) == null || r.addEventListener("click", async (c) => {
        var u, p, h;
        if (c.preventDefault(), c.stopPropagation(), !((u = game.user) != null && u.isGM)) {
          (h = (p = ui.notifications) == null ? void 0 : p.warn) == null || h.call(p, "Only the GM can answer ship equipment install requests.");
          return;
        }
        const d = await Ht(a, n);
        !d || d.status !== "pending" || await l(d);
      });
    };
    o("[data-hd-install-approve]", async (s) => {
      var r, c, d, u;
      const l = await Ie(s.profileId, s.slotId, s.itemUuid, { openEditor: !1 });
      await Re(a, l.ok ? "approved" : "rejected", l.message), l.ok ? (c = (r = ui.notifications) == null ? void 0 : r.info) == null || c.call(r, l.message) : (u = (d = ui.notifications) == null ? void 0 : d.warn) == null || u.call(d, l.message);
    }), o("[data-hd-install-reject]", async () => {
      var s, l;
      await Re(a, "rejected", "The GM rejected the ship equipment install request."), (l = (s = ui.notifications) == null ? void 0 : s.info) == null || l.call(s, "Ship equipment install request rejected.");
    });
  });
}
async function De(e, t, i) {
  var p, h, f, y, m, b, q, $, C;
  const a = j(e);
  if (!ve(a))
    return (h = (p = ui.notifications) == null ? void 0 : p.warn) == null || h.call(p, "Players are not allowed to install equipment on this ship."), !1;
  const n = await T(i);
  if (!n)
    return (y = (f = ui.notifications) == null ? void 0 : f.warn) == null || y.call(f, "Drop a Foundry Item onto the equipment slot."), !1;
  const o = a == null ? void 0 : a.slots.find((R) => R.id === t);
  if (!o) return !1;
  const s = !!o.itemUuid, l = E(n), r = $e(N(o), n), c = de(N(o), n, r);
  if (!c.ok)
    return (b = (m = ui.notifications) == null ? void 0 : m.warn) == null || b.call(m, c.reason ?? "That item is not compatible with this ship slot."), !1;
  if (!await It(N(o), n, !l.enabled, s)) return !1;
  if (!((q = game.user) != null && q.isGM)) return xt(e, t, i);
  const u = await Ie(e, t, i, { openEditor: !0 });
  return u.ok || (C = ($ = ui.notifications) == null ? void 0 : $.warn) == null || C.call($, u.message), u.ok;
}
async function Se(e, t) {
  var n;
  if (!A("remove equipped items")) return !1;
  const i = x(P()), a = (n = i[e]) == null ? void 0 : n.slots.find((o) => o.id === t);
  return a ? (delete a.itemUuid, await M(i), !0) : !1;
}
async function T(e) {
  const t = String(e || "").trim(), i = globalThis.fromUuid;
  if (!t || typeof i != "function") return null;
  const a = pe.get(t);
  if (a) return a;
  const n = (async () => {
    var s;
    try {
      const l = await i(t);
      return (l == null ? void 0 : l.documentName) === "Item" || ((s = l == null ? void 0 : l.constructor) == null ? void 0 : s.name) === "Item" ? l : null;
    } catch (l) {
      return console.warn(`${w} | Failed to resolve item UUID "${t}".`, l), null;
    }
  })();
  pe.set(t, n);
  const o = await n;
  return o || pe.delete(t), o;
}
function Rt(e) {
  var t, i, a;
  try {
    const n = globalThis.TextEditor ?? ((i = (t = foundry == null ? void 0 : foundry.applications) == null ? void 0 : t.ux) == null ? void 0 : i.TextEditor);
    if (n != null && n.getDragEventData) return n.getDragEventData(e);
  } catch {
  }
  try {
    return JSON.parse(((a = e.dataTransfer) == null ? void 0 : a.getData("text/plain")) || "{}");
  } catch {
    return {};
  }
}
function Ot(e) {
  var i, a, n;
  const t = ((a = (i = e == null ? void 0 : e.system) == null ? void 0 : i.description) == null ? void 0 : a.value) ?? ((n = e == null ? void 0 : e.system) == null ? void 0 : n.description) ?? (e == null ? void 0 : e.description) ?? "";
  return typeof t == "string" ? t.trim() : t != null && t.value ? String(t.value).trim() : "";
}
function lt(e) {
  if (!e.enabled) return "";
  const t = [`Ship Equipment: ${e.category}`];
  return e.durability.enabled && e.durability.max > 0 && t.push(`Durability ${e.durability.value}/${e.durability.max}`), e.power.enabled && e.power.draw > 0 && t.push(`Power ${e.power.allocated}/${e.power.draw} ${e.power.online ? "online" : "offline"}`), t.join(" | ");
}
function Ft(e) {
  if (!e.enabled) return [];
  const t = [e.category];
  return e.activation.enabled && t.push("Activatable"), e.durability.enabled && t.push("Durability"), e.power.enabled && t.push("Power"), t;
}
function Bt(e) {
  const t = e.durability, { isBroken: i, isDamaged: a, value: n, max: o } = Ee(e), s = e.power.enabled && !e.power.online, l = e.power.enabled && e.power.online && e.power.draw > 0 && e.power.allocated <= 0, r = e.power.enabled && e.power.online && !l && e.power.allocated < e.power.draw, c = Math.max(0, e.activation.cooldown) * 6e3, d = e.activation.lastActivatedAt + c, u = e.activation.enabled && c > 0 && e.activation.lastActivatedAt > 0 && d > Date.now(), p = u ? Math.max(1, Math.ceil((d - Date.now()) / 6e3)) : 0, h = s || l || r || e.activation.blockWhenBroken && i;
  return {
    ...e,
    badges: Ft(e),
    tagsText: e.tags.join(", "),
    hasTags: e.tags.length > 0,
    durability: {
      ...t,
      value: n,
      max: o,
      state: i ? "Broken" : a ? "Damaged" : "Intact",
      isBroken: i,
      isDamaged: a
    },
    power: {
      ...e.power,
      state: e.power.online ? l ? "No Power" : r ? "Low Power" : "Online" : "Offline",
      allocationText: `${e.power.allocated} / ${e.power.draw}`,
      allocationPercent: e.power.draw > 0 ? Math.min(100, Math.round(e.power.allocated / e.power.draw * 100)) : 100,
      isOffline: s,
      isNoPower: l,
      isUnderpowered: r
    },
    activation: {
      ...e.activation,
      isBlocked: h,
      isCoolingDown: u,
      cooldownRemaining: p,
      blockedReason: s ? "Equipment offline" : l ? "No power allocated" : r ? "Low allocated power" : i ? "Equipment broken" : "",
      cooldownText: u ? `Cooling down: ${p} round${p === 1 ? "" : "s"}` : ""
    }
  };
}
function ct(e) {
  const t = Math.max(0, S(e.powerCapacity, 0)), i = e.slots.reduce((l, r) => {
    var d, u;
    const c = (u = (d = r == null ? void 0 : r.item) == null ? void 0 : d.equipment) == null ? void 0 : u.power;
    return !(c != null && c.enabled) || c.online === !1 ? l : l + Math.max(0, S(c.allocated, c.draw ?? 0));
  }, 0), a = t > 0 ? t - i : 0, n = t > 0 ? Math.max(0, i - t) : 0, o = t > 0, s = o && i > t;
  return {
    capacity: t,
    used: i,
    remaining: a,
    overage: n,
    hasCapacity: o,
    isOverBudget: s,
    summary: o ? `${i} / ${t}` : `${i} draw`
  };
}
function Te(e, t) {
  const i = t.map((a) => a.toLowerCase());
  return e.filter((a) => i.some((n) => a.label.toLowerCase().includes(n)));
}
function Pe(e, t) {
  return Te(e, t)[0] ?? null;
}
function Y(e, t, i, a = "Unset", n = t) {
  var r;
  const o = Pe(e, i), s = !!((r = o == null ? void 0 : o.value) != null && r.trim());
  return {
    key: n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    label: t,
    value: (o == null ? void 0 : o.value) || a,
    inputValue: (o == null ? void 0 : o.value) || "",
    note: (o == null ? void 0 : o.note) || "",
    stat: o,
    statId: (o == null ? void 0 : o.id) || "",
    editLabel: (o == null ? void 0 : o.label) || n,
    isConfigured: s,
    hasValue: s,
    isVisible: s
  };
}
function dt(e, t, i, a) {
  var s;
  const n = e[0] ?? null, o = !!((s = n == null ? void 0 : n.value) != null && s.trim());
  return {
    key: i,
    label: t,
    value: (n == null ? void 0 : n.value) || "Unset",
    inputValue: (n == null ? void 0 : n.value) || "",
    note: (n == null ? void 0 : n.note) || (n ? n.label : "Add ship statistic"),
    icon: a,
    page: i,
    stateClass: o ? "is-ready" : "is-muted",
    stat: n,
    statId: (n == null ? void 0 : n.id) || "",
    editLabel: (n == null ? void 0 : n.label) || t,
    relatedStats: e.slice(1),
    hasRelatedStats: e.length > 1,
    isConfigured: o,
    hasValue: o,
    isVisible: o
  };
}
function Nt(e) {
  const t = Pe(e, ["speed"]), i = Te(e, ["max speed", "maximum speed", "top speed", "maximum"]).filter((o) => o.id !== (t == null ? void 0 : t.id)), a = [t, ...i].filter(Boolean);
  return {
    ...dt(a, "Speed", "speed", "fa-gauge-high"),
    metrics: [
      Y(e, "Cruise", ["cruise"], "Unset", "Cruise Speed"),
      Y(e, "Maximum", ["max speed", "maximum speed", "top speed", "maximum"], "Unset", "Maximum Speed"),
      Y(e, "Thrust", ["thrust", "acceleration"])
    ]
  };
}
function Ut(e) {
  const t = Pe(e, ["capacity", "occupancy"]), i = Te(e, ["passenger"]).filter((o) => o.id !== (t == null ? void 0 : t.id)), a = [t, ...i].filter(Boolean);
  return {
    ...dt(a, "Capacity", "capacity", "fa-users"),
    metrics: [
      Y(e, "Crew", ["crew"]),
      Y(e, "Berths", ["berth"]),
      Y(e, "Cargo", ["cargo", "hold"]),
      Y(e, "Life Support", ["life support", "life-support"])
    ]
  };
}
function Gt(e) {
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
function Vt(e) {
  const t = e.slots.length, i = e.slots.filter((f) => f.item && !f.item.missing).length, a = Math.max(0, t - i), n = e.slots.filter((f) => {
    var y, m;
    return (m = (y = f.item) == null ? void 0 : y.equipment) == null ? void 0 : m.enabled;
  }).map((f) => {
    const y = f.item.equipment, m = y.power, b = y.durability, q = b.enabled && b.isBroken, $ = b.enabled && b.isDamaged, C = m.enabled && m.isOffline, R = m.enabled && m.isNoPower, z = m.enabled && m.isUnderpowered, ie = y.activation.enabled, I = q ? "Broken" : C ? "Offline" : R ? "No Power" : z ? "Low Power" : $ ? "Damaged" : "Ready", ht = `is-${I.toLowerCase().replace(/\s+/g, "-")}`;
    return {
      slotId: f.id,
      slotLabel: f.label,
      itemName: f.item.name,
      itemImg: f.item.img,
      category: y.category,
      state: I,
      stateClass: ht,
      icon: q ? "fa-triangle-exclamation" : C ? "fa-power-off" : R ? "fa-battery-empty" : z ? "fa-gauge-simple-low" : $ ? "fa-screwdriver-wrench" : "fa-circle-check",
      canActivate: ie,
      activationLabel: y.activation.label,
      activationBlocked: y.activation.isBlocked,
      powerEnabled: m.enabled,
      powerDraw: m.draw,
      powerAllocated: m.allocated,
      powerAllocationText: m.allocationText,
      powerAllocationPercent: m.allocationPercent,
      powerState: m.state,
      durabilityEnabled: b.enabled,
      durabilityText: b.enabled ? `${b.value} / ${b.max}` : ""
    };
  }), o = n.filter((f) => f.state === "Broken").length, s = n.filter((f) => f.state === "Damaged").length, l = n.filter((f) => f.state === "Offline").length, r = n.filter((f) => f.state === "Low Power" || f.state === "No Power").length, c = n.filter((f) => f.powerEnabled).length, d = n.filter((f) => f.powerEnabled && f.powerState === "Online").length, u = Nt(e.stats), p = Ut(e.stats), h = Gt({ power: e.power, systems: n, brokenSystems: o, damagedSystems: s, offlineSystems: l, underpoweredSystems: r });
  return {
    totalSlots: t,
    equippedSlots: i,
    emptySlots: a,
    systems: n,
    hasSystems: n.length > 0,
    brokenSystems: o,
    damagedSystems: s,
    offlineSystems: l,
    underpoweredSystems: r,
    poweredSystems: c,
    onlineSystems: d,
    condition: h,
    hasAlerts: e.power.isOverBudget || o > 0 || s > 0 || l > 0 || r > 0,
    speed: u,
    capacity: p,
    tiles: [
      { label: "Systems", value: `${i}/${t}`, note: a ? `${a} empty` : "All slots filled", icon: "fa-layer-group", page: "systems", stateClass: a ? "is-muted" : "is-ready" },
      { label: "Power", value: e.power.summary, note: e.power.hasCapacity ? `${e.power.remaining} remaining` : "capacity untracked", icon: e.power.isOverBudget ? "fa-triangle-exclamation" : "fa-bolt", page: "power", stateClass: e.power.isOverBudget ? "is-danger" : "is-ready" },
      { label: "Online", value: `${d}/${c}`, note: r ? `${r} underpowered` : c ? "powered systems" : "No power draw", icon: "fa-power-off", page: "systems", stateClass: l || r ? "is-warning" : "is-ready" },
      { label: "Integrity", value: o ? `${o} broken` : s ? `${s} damaged` : "Nominal", note: n.length ? "ship equipment" : "No systems", icon: o ? "fa-triangle-exclamation" : "fa-shield-halved", page: "damage", stateClass: o ? "is-danger" : s ? "is-warning" : "is-ready" },
      u,
      p
    ]
  };
}
function jt(e) {
  var i;
  const t = /* @__PURE__ */ new Map();
  for (const a of e) {
    const n = String(a.category || "Unassigned");
    t.has(n) || t.set(n, []), (i = t.get(n)) == null || i.push({
      ...a,
      isSelectedEquipment: a.id === H
    });
  }
  return Array.from(t.entries()).map(([a, n]) => ({
    category: a,
    count: n.length,
    equippedCount: n.filter((o) => o.item && !o.item.missing).length,
    slots: n
  }));
}
function _t(e) {
  const t = e.filter((i) => i.item);
  return t.length ? ((!H || !t.some((i) => i.id === H)) && (H = t[0].id), t.find((i) => i.id === H) ?? null) : (H = "", null);
}
function zt(e, t) {
  const i = e.filter((a) => {
    var n, o, s;
    return (s = (o = (n = a.item) == null ? void 0 : n.equipment) == null ? void 0 : o.power) == null ? void 0 : s.enabled;
  }).map((a) => {
    const n = a.item.equipment.power;
    return {
      slotId: a.id,
      label: a.label,
      itemName: a.item.name,
      category: a.category,
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
    nodes: i,
    hasNodes: i.length > 0,
    reactorLabel: t.hasCapacity ? `${t.used} / ${t.capacity}` : `${t.used} allocated`
  };
}
async function Wt(e) {
  const t = Number.isFinite(e.anchorX) && Number.isFinite(e.anchorY), i = rt(e), a = {
    ...e,
    hasAnchor: t,
    compatibilitySummary: i,
    hasCompatibilityRules: !!i
  };
  if (!e.itemUuid) return { ...a, item: null };
  const n = await T(e.itemUuid);
  if (!n)
    return {
      ...a,
      item: {
        name: "Missing Item",
        img: "icons/svg/hazard.svg",
        status: "Stored UUID no longer resolves",
        missing: !0
      }
    };
  const o = E(n), s = lt(o), l = Bt(o), r = l.durability.isBroken ? "is-broken" : l.power.isOffline ? "is-offline" : l.power.isNoPower ? "is-no-power" : l.power.isUnderpowered ? "is-low-power" : l.durability.isDamaged ? "is-damaged" : l.enabled ? "is-online" : "is-untagged";
  return {
    ...a,
    item: {
      name: n.name ?? "Unnamed Item",
      img: n.img || "icons/svg/item-bag.svg",
      status: s,
      description: Ot(n),
      uuid: n.uuid,
      equipment: l
    },
    pinStateClass: r,
    statusClass: r,
    statusLabel: l.durability.isBroken ? "Broken" : l.power.state || l.durability.state
  };
}
async function Yt() {
  var l, r, c;
  const e = v();
  let t = null;
  const i = ((l = game.user) == null ? void 0 : l.isGM) === !0;
  let a = i, n = i;
  if (e) {
    a = i || e.permissions.allowPlayerEquip, n = i || e.permissions.allowPlayerActivate;
    const d = await Promise.all(e.slots.map(Wt)), u = ct({ ...e, slots: d }), p = Vt({ slots: d, power: u, stats: e.stats });
    !i && k === "speed" && !p.speed.hasValue && (k = "overview"), !i && k === "capacity" && !p.capacity.hasValue && (k = "overview");
    const h = new Set([
      (r = p.speed.stat) == null ? void 0 : r.id,
      (c = p.capacity.stat) == null ? void 0 : c.id,
      ...p.speed.relatedStats.map((m) => m.id),
      ...p.capacity.relatedStats.map((m) => m.id),
      ...p.speed.metrics.map((m) => {
        var b;
        return (b = m.stat) == null ? void 0 : b.id;
      }),
      ...p.capacity.metrics.map((m) => {
        var b;
        return (b = m.stat) == null ? void 0 : b.id;
      })
    ].filter(Boolean));
    p.tiles = p.tiles.filter((m) => i || m.isVisible !== !1).map((m) => ({
      ...m,
      isActive: m.page === k || m.page === "systems" && k === "equipment" && m.label === "Systems"
    }));
    const f = _t(d), y = d.map((m) => ({
      ...m,
      isSelectedEquipment: m.id === H
    }));
    t = {
      ...e,
      slots: y,
      power: u,
      dashboard: p,
      additionalStats: e.stats.filter((m) => !h.has(m.id)),
      hasAdditionalStats: e.stats.some((m) => !h.has(m.id)),
      equipmentCategories: jt(y),
      selectedEquipmentSlot: f,
      hasSelectedEquipment: !!f,
      powerGrid: zt(d, u)
    };
  }
  const o = Je().map((d) => ({
    ...d,
    isSelected: d.id === L
  }));
  return !new Set(ge.map((d) => d.id)).has(k) && k !== "equipment" && (k = "overview"), {
    canEdit: i,
    canEquip: a,
    canActivateSystems: n,
    hasProfiles: o.length > 0,
    profiles: o,
    selectedProfile: t,
    pages: ge.map((d) => ({
      ...d,
      isActive: d.id === k
    })).filter((d) => i || (d.id !== "speed" || (t == null ? void 0 : t.dashboard.speed.hasValue)) && (d.id !== "capacity" || (t == null ? void 0 : t.dashboard.capacity.hasValue))),
    activePage: k,
    isOverview: k === "overview",
    isSystems: k === "systems",
    isEquipment: k === "equipment",
    isPower: k === "power",
    isDamage: k === "damage",
    isSpeed: k === "speed",
    isCapacity: k === "capacity",
    categories: te()
  };
}
function ee(e, t = null) {
  var i;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (i = e == null ? void 0 : e.element) != null && i[0] ? e.element[0] : (e == null ? void 0 : e.element) ?? null;
}
function G() {
  B != null && B.rendered && B.requestRender();
}
function ut(e) {
  var a, n;
  const t = (e == null ? void 0 : e[0]) ?? e, i = ((a = t == null ? void 0 : t.querySelector) == null ? void 0 : a.call(t, "form")) ?? ((n = t == null ? void 0 : t.closest) == null ? void 0 : n.call(t, "form"));
  return Object.fromEntries(new FormData(i).entries());
}
function Xt(e) {
  var o, s;
  const t = (e == null ? void 0 : e[0]) ?? e, i = ((o = t == null ? void 0 : t.querySelector) == null ? void 0 : o.call(t, "form")) ?? ((s = t == null ? void 0 : t.closest) == null ? void 0 : s.call(t, "form")), a = new FormData(i), n = String(a.get("category") || "");
  return {
    id: String(a.get("id") || ""),
    label: n,
    category: n,
    description: String(a.get("description") || ""),
    requiredCategory: String(a.get("requiredCategory") || ""),
    requiredTags: _e(a.get("requiredTags"))
  };
}
function Kt(e) {
  var n, o;
  const t = (e == null ? void 0 : e[0]) ?? e, i = ((n = t == null ? void 0 : t.querySelector) == null ? void 0 : n.call(t, "form")) ?? ((o = t == null ? void 0 : t.closest) == null ? void 0 : o.call(t, "form")), a = new FormData(i);
  return {
    hiddenFromPlayers: F(a, "hiddenFromPlayers"),
    allowPlayerEquip: F(a, "allowPlayerEquip"),
    allowPlayerActivate: F(a, "allowPlayerActivate")
  };
}
function Jt(e) {
  if (!A("set HoloDock player rights")) return;
  const t = je(e.permissions), i = (a) => a ? "checked" : "";
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
        callback: (a) => tt(e.id, Kt(a))
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
function Fe(e = {}) {
  if (!A("edit equipment slots")) return;
  const t = v();
  if (!t) return;
  const i = N({ label: "New Slot", category: V[0], ...e }), a = te().map((n) => `<option value="${g(n)}">`).join("");
  new Dialog({
    title: e.id ? "Edit Equipment Slot" : "Add Equipment Slot",
    content: `
      <form class="hd-dialog-form">
        <input type="hidden" name="id" value="${g(i.id)}">
        <label>
          <span>Slot Type</span>
          <input type="text" name="category" value="${g(i.category)}">
          <datalist id="hd-slot-categories">${a}</datalist>
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
        callback: (n) => nt(t.id, Xt(n))
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
function fe(e = {}) {
  if (!A("edit ship statistics")) return;
  const t = v();
  if (!t) return;
  const i = O({ label: "New Statistic", ...e });
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
        callback: (a) => le(t.id, ut(a))
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
function F(e, t) {
  return e.get(t) === "on";
}
function Qt(e) {
  var o, s;
  const t = (e == null ? void 0 : e[0]) ?? e, i = ((o = t == null ? void 0 : t.querySelector) == null ? void 0 : o.call(t, "form")) ?? ((s = t == null ? void 0 : t.closest) == null ? void 0 : s.call(t, "form")), a = new FormData(i), n = String(a.get("tags") || "").split(",").map((l) => l.trim()).filter(Boolean);
  return ce({
    enabled: F(a, "enabled"),
    category: String(a.get("category") || ""),
    tags: n,
    activation: {
      enabled: F(a, "activation.enabled"),
      label: String(a.get("activation.label") || ""),
      actionType: String(a.get("activation.actionType") || ""),
      cooldown: S(a.get("activation.cooldown"), 0),
      resourceCost: String(a.get("activation.resourceCost") || ""),
      durabilityCost: S(a.get("activation.durabilityCost"), 0),
      blockWhenBroken: F(a, "activation.blockWhenBroken")
    },
    durability: {
      enabled: F(a, "durability.enabled"),
      value: S(a.get("durability.value"), 0),
      max: S(a.get("durability.max"), 0),
      brokenAt: S(a.get("durability.brokenAt"), 0)
    },
    power: {
      enabled: F(a, "power.enabled"),
      draw: S(a.get("power.draw"), 0),
      allocated: S(a.get("power.allocated"), S(a.get("power.draw"), 0)),
      online: F(a, "power.online")
    }
  });
}
function X(e) {
  if (!A("tag ship equipment") || !e) return;
  const t = String(e.uuid ?? e.id ?? e.name ?? "item"), i = Date.now();
  if (t === Le && i - Me < 500) return;
  Le = t, Me = i;
  const a = E(e), n = te().map((s) => `<option value="${g(s)}">`).join(""), o = (s) => s ? "checked" : "";
  new Dialog({
    title: `Ship Equipment: ${e.name ?? "Item"}`,
    content: `
      <form class="hd-dialog-form hd-equipment-form">
        <label class="hd-check">
          <input type="checkbox" name="enabled" ${o(a.enabled)}>
          <span>Ship Equipment</span>
        </label>
        <label>
          <span>Category</span>
          <input type="text" name="category" value="${g(a.category)}" list="hd-equipment-categories">
          <datalist id="hd-equipment-categories">${n}</datalist>
        </label>
        <label>
          <span>Tags</span>
          <input type="text" name="tags" value="${g(a.tags.join(", "))}" placeholder="turret, external, sensor">
        </label>

        <fieldset>
          <legend>Activation</legend>
          <label class="hd-check">
            <input type="checkbox" name="activation.enabled" ${o(a.activation.enabled)}>
            <span>Can be activated</span>
          </label>
          <div class="hd-form-grid">
            <label>
              <span>Button Label</span>
              <input type="text" name="activation.label" value="${g(a.activation.label)}">
            </label>
            <label>
              <span>Action Type</span>
              <input type="text" name="activation.actionType" value="${g(a.activation.actionType)}" placeholder="attack, scan, repair">
            </label>
            <label>
              <span>Cooldown</span>
              <input type="number" min="0" step="1" name="activation.cooldown" value="${a.activation.cooldown}">
            </label>
            <label>
              <span>Resource Cost</span>
              <input type="text" name="activation.resourceCost" value="${g(a.activation.resourceCost)}">
            </label>
            <label>
              <span>Durability Cost</span>
              <input type="number" min="0" step="1" name="activation.durabilityCost" value="${a.activation.durabilityCost}">
            </label>
          </div>
          <label class="hd-check">
            <input type="checkbox" name="activation.blockWhenBroken" ${o(a.activation.blockWhenBroken)}>
            <span>Block activation when broken</span>
          </label>
        </fieldset>

        <fieldset>
          <legend>Durability</legend>
          <label class="hd-check">
            <input type="checkbox" name="durability.enabled" ${o(a.durability.enabled)}>
            <span>Has durability</span>
          </label>
          <div class="hd-form-grid">
            <label>
              <span>Current</span>
              <input type="number" min="0" step="1" name="durability.value" value="${a.durability.value}">
            </label>
            <label>
              <span>Maximum</span>
              <input type="number" min="0" step="1" name="durability.max" value="${a.durability.max}">
            </label>
            <label>
              <span>Broken At</span>
              <input type="number" min="0" step="1" name="durability.brokenAt" value="${a.durability.brokenAt}">
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Power</legend>
          <label class="hd-check">
            <input type="checkbox" name="power.enabled" ${o(a.power.enabled)}>
            <span>Requires power</span>
          </label>
          <label class="hd-check">
            <input type="checkbox" name="power.online" ${o(a.power.online)}>
            <span>Online</span>
          </label>
          <label>
            <span>Power Draw</span>
            <input type="number" min="0" step="1" name="power.draw" value="${a.power.draw}">
          </label>
          <label>
            <span>Starting Allocation</span>
            <input type="number" min="0" step="1" name="power.allocated" value="${a.power.allocated}">
          </label>
        </fieldset>
      </form>
    `,
    buttons: {
      save: {
        icon: '<i class="fa-solid fa-floppy-disk"></i>',
        label: "Save",
        callback: (s) => _(e, Qt(s))
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
function Zt(e) {
  if (!A("edit ship equipment durability")) return;
  const t = E(e);
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
          const a = ut(i);
          return re(e, S(a.value, t.durability.value));
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
function ei() {
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
function ti(e) {
  return ei().filter((t) => {
    var i;
    return (t == null ? void 0 : t.documentName) === "Item" || ((i = t == null ? void 0 : t.constructor) == null ? void 0 : i.name) === "Item";
  }).map((t) => {
    const i = E(t), a = de(e, t);
    return {
      id: String(t.id ?? t.uuid ?? D("item")),
      uuid: String(t.uuid ?? ""),
      name: String(t.name ?? "Unnamed Item"),
      img: String(t.img || "icons/svg/item-bag.svg"),
      type: String(t.type || "Item"),
      status: lt(i),
      compatible: a.ok,
      reason: a.reason ?? "",
      shipEquipment: i.enabled,
      category: i.enabled ? i.category : "",
      tagsText: i.tags.join(", ")
    };
  }).filter((t) => t.uuid).sort((t, i) => t.compatible !== i.compatible ? t.compatible ? -1 : 1 : t.shipEquipment !== i.shipEquipment ? t.shipEquipment ? -1 : 1 : t.name.localeCompare(i.name));
}
function Be(e) {
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
function ii(e, t) {
  if (!A("equip items")) return;
  const i = j(e), a = i == null ? void 0 : i.slots.find((c) => c.id === t);
  if (!i || !a) return;
  const n = N(a), o = ti(n), s = o.filter((c) => c.compatible), l = o.filter((c) => !c.compatible), r = new Dialog({
    title: `Choose Equipment: ${a.label}`,
    content: `
      <section class="hd-equipment-browser">
        <p class="hd-muted">${g(rt(n) || "No slot compatibility rules set.")}</p>
        <div class="hd-equipment-pick-list">
          ${s.length ? s.map(Be).join("") : '<p class="hd-muted">No compatible world items found.</p>'}
        </div>
        ${l.length ? `
          <details class="hd-incompatible-equipment">
            <summary>${l.length} incompatible item${l.length === 1 ? "" : "s"}</summary>
            <div class="hd-equipment-pick-list">
              ${l.map(Be).join("")}
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
  r.render(!0), window.setTimeout(() => {
    const c = ee(r);
    c == null || c.querySelectorAll("[data-hd-pick-item]").forEach((d) => {
      d.addEventListener("click", async () => {
        const u = d.dataset.hdPickItem ?? "";
        await De(i.id, a.id, u) && r.close();
      });
    });
  }, 0);
}
function ue(e) {
  var i, a, n;
  const t = [
    e == null ? void 0 : e.document,
    e == null ? void 0 : e.item,
    e == null ? void 0 : e.object,
    e == null ? void 0 : e._document,
    (i = e == null ? void 0 : e.options) == null ? void 0 : i.document
  ];
  for (const o of t) {
    if (!o) continue;
    const s = o.documentName ?? ((a = o.constructor) == null ? void 0 : a.documentName), l = String(((n = o.constructor) == null ? void 0 : n.name) ?? "");
    if (s === "Item" || l.includes("Item") && o.type !== void 0 && o.setFlag && o.getFlag) return o;
  }
  return null;
}
function ae(e, t) {
  var n;
  if (!((n = game.user) != null && n.isGM)) return;
  const i = ue(e);
  if (!i || !Array.isArray(t) || t.some((o) => (o == null ? void 0 : o.class) === "hd-edit-equipment" || (o == null ? void 0 : o.className) === "hd-edit-equipment")) return;
  const a = {
    label: "Ship Equipment",
    title: "HoloDock Ship Equipment",
    class: "hd-edit-equipment",
    className: "hd-edit-equipment",
    icon: "fas fa-rocket",
    onclick: () => X(i),
    onClick: () => X(i)
  };
  t.unshift(a);
}
function ai(e, t) {
  var a;
  if (!((a = game.user) != null && a.isGM)) return;
  const i = ue(e);
  !i || !Array.isArray(t) || t.some((n) => (n == null ? void 0 : n.action) === "holodockShipEquipment" || (n == null ? void 0 : n.class) === "hd-edit-equipment") || t.unshift({
    action: "holodockShipEquipment",
    label: "Ship Equipment",
    title: "HoloDock Ship Equipment",
    icon: "fas fa-rocket",
    class: "hd-edit-equipment",
    visible: !0,
    ownership: "OWNER",
    onClick: () => X(i),
    onclick: () => X(i)
  });
}
function pt(e, t = null) {
  var l, r, c, d, u, p, h;
  const i = ee(null, t), a = ((l = e == null ? void 0 : e.element) == null ? void 0 : l[0]) ?? (e == null ? void 0 : e.element) ?? ((r = e == null ? void 0 : e._element) == null ? void 0 : r[0]) ?? (e == null ? void 0 : e._element), n = ((c = e == null ? void 0 : e.window) == null ? void 0 : c.element) ?? ((d = e == null ? void 0 : e.window) == null ? void 0 : d.frame), o = e != null && e.id && ((u = globalThis.CSS) != null && u.escape) ? CSS.escape(e.id) : "", s = [
    n,
    (p = a == null ? void 0 : a.closest) == null ? void 0 : p.call(a, ".application, .app, .window-app"),
    a,
    (h = i == null ? void 0 : i.closest) == null ? void 0 : h.call(i, ".application, .app, .window-app"),
    e != null && e.id ? document.getElementById(e.id) : null,
    o ? document.querySelector(`#${o}`) : null,
    e != null && e.appId ? document.querySelector(`[data-appid="${e.appId}"], [data-application-id="${e.appId}"]`) : null
  ];
  for (const f of s)
    if (f instanceof HTMLElement) return f;
  return null;
}
function ne(e, t = null) {
  var r;
  if (!((r = game.user) != null && r.isGM)) return;
  const i = ue(e);
  if (!i) return;
  const a = pt(e, t);
  if (!a || a.querySelector(".hd-edit-equipment, [data-hd-edit-equipment]")) return;
  const n = a.querySelector(".window-header, header.window-header, .app-header, header");
  if (!n) return;
  const o = document.createElement("button");
  o.type = "button", o.className = "hd-edit-equipment hd-item-sheet-header-fallback", o.dataset.hdEditEquipment = "true", o.title = "HoloDock Ship Equipment", o.innerHTML = '<i class="fas fa-rocket"></i><span class="sr-only">Ship Equipment</span>', o.addEventListener("click", (c) => {
    c.preventDefault(), c.stopPropagation(), X(i);
  });
  const s = n.querySelector(".window-controls, .header-controls, .window-header-buttons, .window-buttons, menu"), l = n.querySelector(".close, [data-action='close']");
  s ? s.prepend(o) : l ? n.insertBefore(o, l) : n.append(o);
}
function ni(e, t = null) {
  ne(e, t), window.setTimeout(() => ne(e, t), 0), window.setTimeout(() => ne(e, t), 100), window.setTimeout(() => ne(e, t), 300);
}
function Z(e, t = null) {
  ni(e, t);
  const i = pt(e, t), a = ue(e);
  !i || !a || i.dataset.hdEquipmentHeaderListener === "true" || (i.dataset.hdEquipmentHeaderListener = "true", i.addEventListener("click", (n) => {
    var s, l;
    (l = (s = n.target) == null ? void 0 : s.closest) != null && l.call(s, "[data-action='holodockShipEquipment'], .hd-edit-equipment") && (n.preventDefault(), n.stopPropagation(), X(a));
  }));
}
class oi extends At {
  constructor() {
    super(...arguments);
    J(this, "linkingSlotId", "");
    J(this, "linkResizeObserver");
    J(this, "renderFrame");
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holodock",
      title: "HoloDock - Ship Loadout",
      classes: ["holodock-window"],
      template: Ge,
      popOut: !0,
      resizable: !0,
      width: 1280,
      height: 820
    });
  }
  async getData() {
    return Yt();
  }
  requestRender() {
    if (!this.rendered || this.renderFrame) return;
    const i = globalThis.requestAnimationFrame ?? ((a) => window.setTimeout(a, 16));
    this.renderFrame = i(() => {
      this.renderFrame = void 0, this.render(!0);
    });
  }
  activateListeners(i) {
    var n, o;
    super.activateListeners(i);
    const a = ee(this, i);
    a && ((n = a.querySelector("[data-hd-profile-select]")) == null || n.addEventListener("change", (s) => {
      L = s.currentTarget.value, H = "", Ce(L).finally(() => this.requestRender());
    }), a.querySelectorAll("[data-hd-page]").forEach((s) => {
      s.addEventListener("click", (l) => {
        const r = l.currentTarget.dataset.hdPage ?? "overview";
        ge.some((c) => c.id === r) && (k = r, this.requestRender());
      });
    }), a.querySelectorAll("[data-hd-select-equipment]").forEach((s) => {
      s.addEventListener("click", (l) => {
        const r = l.currentTarget.dataset.hdSelectEquipment ?? "", c = v(), d = c == null ? void 0 : c.slots.find((u) => u.id === r);
        d != null && d.itemUuid && (H = r, k = "equipment", this.requestRender());
      });
    }), (o = a.querySelector("[data-hd-profile-form]")) == null || o.addEventListener("submit", async (s) => {
      s.preventDefault();
      const l = v();
      if (!l) return;
      const r = Object.fromEntries(new FormData(s.currentTarget).entries());
      await et(l.id, r);
    }), a.querySelectorAll("[data-hd-action]").forEach((s) => {
      s.addEventListener("click", async (l) => {
        const r = l.currentTarget.dataset.hdAction, c = v();
        r === "create-profile" && await Ze(), r === "delete-profile" && await it(c == null ? void 0 : c.id), r === "create-slot" && Fe(), r === "create-stat" && fe(), r === "browse-image" && this.browseShipImage(), r === "profile-permissions" && c && Jt(c);
      });
    }), a.querySelectorAll("[data-hd-edit-stat]").forEach((s) => {
      s.addEventListener("click", (l) => {
        const r = v(), c = r == null ? void 0 : r.stats.find((d) => d.id === l.currentTarget.dataset.hdEditStat);
        c && fe(c);
      });
    }), a.querySelectorAll("[data-hd-add-stat-label]").forEach((s) => {
      s.addEventListener("click", (l) => {
        const r = l.currentTarget.dataset.hdAddStatLabel ?? "New Statistic";
        fe({ label: r, value: "", note: "" });
      });
    }), a.querySelectorAll("[data-hd-stat-value]").forEach((s) => {
      const l = async (r) => {
        const c = v(), d = r.currentTarget;
        if (d.dataset.hdSavingValue !== "true" && c && !(!d.dataset.hdStatValue && d.value.trim() === "")) {
          d.dataset.hdSavingValue = "true";
          try {
            const u = d.dataset.hdStatNote || "", p = await le(c.id, {
              id: d.dataset.hdStatValue || void 0,
              label: d.dataset.hdStatLabel || "Ship Statistic",
              value: d.value,
              note: u === "Not configured" || u === "Add ship statistic" ? "" : u
            });
            p != null && p.id && (d.dataset.hdStatValue = p.id);
          } finally {
            delete d.dataset.hdSavingValue;
          }
        }
      };
      s.addEventListener("change", l), s.addEventListener("blur", l);
    }), a.querySelectorAll("[data-hd-unset-stat]").forEach((s) => {
      s.addEventListener("click", async (l) => {
        const r = v(), c = l.currentTarget, d = a.querySelector(`[data-hd-stat-key="${c.dataset.hdUnsetStat}"]`);
        if (!r || !d || (d.value = "", !d.dataset.hdStatValue)) return;
        const u = d.dataset.hdStatNote || "";
        await le(r.id, {
          id: d.dataset.hdStatValue,
          label: d.dataset.hdStatLabel || "Ship Statistic",
          value: "",
          note: u === "Not configured" || u === "Add ship statistic" ? "" : u
        });
      });
    }), a.querySelectorAll("[data-hd-delete-stat]").forEach((s) => {
      s.addEventListener("click", async (l) => {
        const r = v(), c = l.currentTarget.dataset.hdDeleteStat ?? "";
        r && await at(r.id, c);
      });
    }), a.querySelectorAll("[data-hd-edit-slot]").forEach((s) => {
      s.addEventListener("click", (l) => {
        const r = v(), c = r == null ? void 0 : r.slots.find((d) => d.id === l.currentTarget.dataset.hdEditSlot);
        c && Fe(c);
      });
    }), a.querySelectorAll("[data-hd-delete-slot]").forEach((s) => {
      s.addEventListener("click", async (l) => {
        const r = v(), c = l.currentTarget.dataset.hdDeleteSlot ?? "";
        r && await ot(r.id, c);
      });
    }), a.querySelectorAll(".hd-entry-menu").forEach((s) => {
      s.addEventListener("toggle", () => {
        s.open && (a.querySelectorAll(".hd-entry-menu[open]").forEach((l) => {
          l !== s && (l.open = !1);
        }), window.requestAnimationFrame(() => this.positionEntryMenu(s)));
      });
    }), a.querySelectorAll("[data-hd-browse-equipment]").forEach((s) => {
      s.addEventListener("click", (l) => {
        const r = v(), c = l.currentTarget.dataset.hdBrowseEquipment ?? "";
        r && ii(r.id, c);
      });
    }), a.querySelectorAll("[data-hd-open-item]").forEach((s) => {
      s.addEventListener("click", async (l) => {
        var u, p, h;
        const r = v(), c = r == null ? void 0 : r.slots.find((f) => f.id === l.currentTarget.dataset.hdOpenItem), d = await T((c == null ? void 0 : c.itemUuid) ?? "");
        (u = d == null ? void 0 : d.sheet) != null && u.render ? d.sheet.render(!0) : (h = (p = ui.notifications) == null ? void 0 : p.warn) == null || h.call(p, "That item could not be found.");
      });
    }), a.querySelectorAll("[data-hd-activate-equipment]").forEach((s) => {
      s.addEventListener("click", async (l) => {
        var p, h, f, y, m, b, q, $, C, R, z, ie;
        const r = v(), c = l.currentTarget.dataset.hdActivateEquipment ?? "", d = r == null ? void 0 : r.slots.find((I) => I.id === c), u = await T((d == null ? void 0 : d.itemUuid) ?? "");
        if (!Dt(r)) {
          (h = (p = ui.notifications) == null ? void 0 : p.warn) == null || h.call(p, "Players have read-only access to this ship.");
          return;
        }
        if (!u || !r || !d) {
          (y = (f = ui.notifications) == null ? void 0 : f.warn) == null || y.call(f, "That ship equipment could not be found.");
          return;
        }
        try {
          const I = await Xe(u, { profile: r, slot: d });
          I.blocked || !I.ok ? (b = (m = ui.notifications) == null ? void 0 : m.warn) == null || b.call(m, I.message) : I.handled ? I.message && ((R = (C = ui.notifications) == null ? void 0 : C.info) == null || R.call(C, I.message)) : ($ = (q = ui.notifications) == null ? void 0 : q.info) == null || $.call(q, I.message);
        } catch (I) {
          console.warn(`${w} | Failed to activate ship equipment.`, I), (ie = (z = ui.notifications) == null ? void 0 : z.warn) == null || ie.call(z, "HoloDock could not activate that equipment. Check the console for details.");
        }
      });
    }), a.querySelectorAll("[data-hd-durability-adjust]").forEach((s) => {
      s.addEventListener("click", async (l) => {
        var h, f;
        const r = v(), c = l.currentTarget, d = r == null ? void 0 : r.slots.find((y) => y.id === c.dataset.hdDurabilityAdjust), u = await T((d == null ? void 0 : d.itemUuid) ?? "");
        if (!u) {
          (f = (h = ui.notifications) == null ? void 0 : h.warn) == null || f.call(h, "That ship equipment could not be found.");
          return;
        }
        const p = E(u);
        !p.enabled || !p.durability.enabled || await re(u, p.durability.value + S(c.dataset.hdDurabilityDelta, 0));
      });
    }), a.querySelectorAll("[data-hd-durability-set]").forEach((s) => {
      s.addEventListener("click", async (l) => {
        var u, p;
        const r = v(), c = r == null ? void 0 : r.slots.find((h) => h.id === l.currentTarget.dataset.hdDurabilitySet), d = await T((c == null ? void 0 : c.itemUuid) ?? "");
        d ? Zt(d) : (p = (u = ui.notifications) == null ? void 0 : u.warn) == null || p.call(u, "That ship equipment could not be found.");
      });
    }), a.querySelectorAll("[data-hd-durability-value]").forEach((s) => {
      s.addEventListener("change", async (l) => {
        var p, h;
        const r = v(), c = l.currentTarget, d = r == null ? void 0 : r.slots.find((f) => f.id === c.dataset.hdDurabilityValue), u = await T((d == null ? void 0 : d.itemUuid) ?? "");
        if (!u) {
          (h = (p = ui.notifications) == null ? void 0 : p.warn) == null || h.call(p, "That ship equipment could not be found.");
          return;
        }
        await re(u, S(c.value, 0));
      });
    }), a.querySelectorAll("[data-hd-power-toggle]").forEach((s) => {
      s.addEventListener("click", async (l) => {
        var h, f;
        const r = v(), c = l.currentTarget, d = r == null ? void 0 : r.slots.find((y) => y.id === c.dataset.hdPowerToggle), u = await T((d == null ? void 0 : d.itemUuid) ?? "");
        if (!u) {
          (f = (h = ui.notifications) == null ? void 0 : h.warn) == null || f.call(h, "That ship equipment could not be found.");
          return;
        }
        const p = E(u);
        !p.enabled || !p.power.enabled || await ze(u, c.dataset.hdPowerOnline === "true");
      });
    }), a.querySelectorAll("[data-hd-power-adjust]").forEach((s) => {
      s.addEventListener("click", async (l) => {
        var h, f;
        const r = v(), c = l.currentTarget, d = r == null ? void 0 : r.slots.find((y) => y.id === c.dataset.hdPowerAdjust), u = await T((d == null ? void 0 : d.itemUuid) ?? "");
        if (!u) {
          (f = (h = ui.notifications) == null ? void 0 : h.warn) == null || f.call(h, "That ship equipment could not be found.");
          return;
        }
        const p = E(u);
        !p.enabled || !p.power.enabled || await ye(u, p.power.allocated + S(c.dataset.hdPowerDelta, 0));
      });
    }), a.querySelectorAll("[data-hd-power-allocation]").forEach((s) => {
      s.addEventListener("change", async (l) => {
        var p, h;
        const r = v(), c = l.currentTarget, d = r == null ? void 0 : r.slots.find((f) => f.id === c.dataset.hdPowerAllocation), u = await T((d == null ? void 0 : d.itemUuid) ?? "");
        if (!u) {
          (h = (p = ui.notifications) == null ? void 0 : p.warn) == null || h.call(p, "That ship equipment could not be found.");
          return;
        }
        await ye(u, S(c.value, 0));
      });
    }), a.querySelectorAll("[data-hd-remove-item]").forEach((s) => {
      s.addEventListener("click", async (l) => {
        const r = v(), c = l.currentTarget.dataset.hdRemoveItem ?? "";
        r && await Se(r.id, c);
      });
    }), this.activateSlotDrops(a), this.activateSlotAnchors(a), window.requestAnimationFrame(() => this.syncShipLinks(a)), window.setTimeout(() => this.syncShipLinks(a), 100));
  }
  activateSlotDrops(i) {
    i.querySelectorAll("[data-hd-slot-id]").forEach((a) => {
      a.addEventListener("dragover", (n) => {
        const o = v(), s = a.dataset.hdSlotId ?? "", l = o == null ? void 0 : o.slots.find((r) => r.id === s);
        !o || !ve(o) || !l || (n.preventDefault(), a.classList.add("is-drop-hover"));
      }), a.addEventListener("dragleave", () => a.classList.remove("is-drop-hover")), a.addEventListener("drop", async (n) => {
        var d, u;
        a.classList.remove("is-drop-hover"), n.preventDefault();
        const o = v(), s = a.dataset.hdSlotId ?? "", l = o == null ? void 0 : o.slots.find((p) => p.id === s);
        if (!o || !ve(o) || !l) return;
        const r = Rt(n), c = r.uuid ?? r.documentUuid ?? r.itemUuid ?? "";
        if (!o || !c) {
          (u = (d = ui.notifications) == null ? void 0 : d.warn) == null || u.call(d, "Drop a Foundry Item onto an equipment slot.");
          return;
        }
        await De(o.id, s, c);
      }), a.addEventListener("contextmenu", async (n) => {
        var l;
        if (!((l = game.user) != null && l.isGM)) return;
        n.preventDefault();
        const o = v(), s = a.dataset.hdSlotId ?? "";
        o && await Se(o.id, s);
      });
    });
  }
  positionEntryMenu(i) {
    const a = i.querySelector("summary"), n = i.querySelector("div");
    if (!a || !n) return;
    const o = a.getBoundingClientRect(), s = Math.max(150, n.offsetWidth || 150), l = Math.max(160, n.offsetHeight || 160), r = 8, c = Math.min(window.innerWidth - s - r, Math.max(r, o.right - s)), u = o.bottom + l + r > window.innerHeight && o.top - l - r > r ? o.top - l - 4 : o.bottom + 4;
    n.style.setProperty("--hd-entry-menu-left", `${c}px`), n.style.setProperty("--hd-entry-menu-top", `${Math.max(r, u)}px`);
  }
  activateSlotAnchors(i) {
    var n, o, s;
    const a = i.querySelector("[data-hd-ship-map]");
    a && ((n = this.linkResizeObserver) == null || n.disconnect(), this.linkResizeObserver = void 0, typeof ResizeObserver < "u" && (this.linkResizeObserver = new ResizeObserver(() => this.syncShipLinks(i)), this.linkResizeObserver.observe(i.querySelector(".hd-stage") ?? i)), (o = i.querySelector(".hd-slot-rail")) == null || o.addEventListener("scroll", () => this.syncShipLinks(i)), (s = a.querySelector("img")) == null || s.addEventListener("load", () => this.syncShipLinks(i)), i.querySelectorAll("[data-hd-link-slot]").forEach((l) => {
      l.addEventListener("click", () => {
        var r;
        (r = game.user) != null && r.isGM && (this.linkingSlotId = l.dataset.hdLinkSlot ?? "", i.classList.toggle("is-linking-slot", !!this.linkingSlotId));
      });
    }), i.querySelectorAll("[data-hd-clear-link]").forEach((l) => {
      l.addEventListener("click", async () => {
        const r = v(), c = l.dataset.hdClearLink ?? "";
        r && await st(r.id, c);
      });
    }), a.addEventListener("click", async (l) => {
      var u;
      if (!((u = game.user) != null && u.isGM) || !this.linkingSlotId) return;
      l.preventDefault();
      const r = v(), c = this.getImageAnchorPoint(a, l.clientX, l.clientY), d = this.linkingSlotId;
      this.linkingSlotId = "", i.classList.remove("is-linking-slot"), r && await we(r.id, d, c.x, c.y);
    }), i.querySelectorAll("[data-hd-anchor-slot]").forEach((l) => {
      l.addEventListener("click", (r) => {
        var d;
        r.preventDefault(), r.stopPropagation();
        const c = l.dataset.hdAnchorSlot ?? "";
        !c || (d = game.user) != null && d.isGM || (H = c, k = "equipment", this.requestRender());
      }), l.addEventListener("pointerdown", (r) => {
        var y;
        if (!((y = game.user) != null && y.isGM)) return;
        r.preventDefault();
        const c = l.dataset.hdAnchorSlot ?? "", d = r.clientX, u = r.clientY;
        let p = !1;
        const h = (m) => {
          (Math.abs(m.clientX - d) > 3 || Math.abs(m.clientY - u) > 3) && (p = !0);
          const b = this.getImageAnchorPoint(a, m.clientX, m.clientY);
          l.dataset.hdAnchorX = String(b.x), l.dataset.hdAnchorY = String(b.y), this.syncShipLinks(i);
        }, f = async (m) => {
          if (window.removeEventListener("pointermove", h), window.removeEventListener("pointerup", f), !p) {
            H = c, k = "equipment", this.requestRender();
            return;
          }
          const b = v(), q = this.getImageAnchorPoint(a, m.clientX, m.clientY);
          b && await we(b.id, c, q.x, q.y);
        };
        window.addEventListener("pointermove", h), window.addEventListener("pointerup", f);
      });
    }));
  }
  getImageAnchorPoint(i, a, n) {
    const o = this.getShipImageRect(i), s = Math.min(100, Math.max(0, (a - o.left) / o.width * 100)), l = Math.min(100, Math.max(0, (n - o.top) / o.height * 100));
    return { x: s, y: l };
  }
  getShipImageRect(i) {
    const a = i.querySelector("img"), n = a == null ? void 0 : a.getBoundingClientRect();
    if (n != null && n.width && (n != null && n.height) && (a != null && a.naturalWidth) && (a != null && a.naturalHeight)) {
      const o = a.naturalWidth / a.naturalHeight, s = n.width / n.height;
      if (o > s) {
        const c = n.width / o, d = n.top + (n.height - c) / 2;
        return new DOMRect(n.left, d, n.width, c);
      }
      const l = n.height * o, r = n.left + (n.width - l) / 2;
      return new DOMRect(r, n.top, l, n.height);
    }
    return n != null && n.width && (n != null && n.height) ? n : i.getBoundingClientRect();
  }
  positionSlotPins(i) {
    const a = i.querySelector("[data-hd-ship-map]");
    if (!a) return;
    const n = this.getShipImageRect(a), o = a.getBoundingClientRect();
    i.querySelectorAll("[data-hd-anchor-slot]").forEach((s) => {
      const l = Number(s.dataset.hdAnchorX), r = Number(s.dataset.hdAnchorY);
      if (!Number.isFinite(l) || !Number.isFinite(r)) return;
      const c = n.left - o.left + n.width * l / 100, d = n.top - o.top + n.height * r / 100;
      s.style.left = `${c}px`, s.style.top = `${d}px`;
    });
  }
  syncShipLinks(i) {
    this.positionSlotPins(i), this.drawSlotLinks(i);
  }
  getSlotCardVisibility(i, a) {
    const n = i.querySelector(".hd-slot-rail");
    if (!n) return 1;
    const o = n.getBoundingClientRect(), s = a.getBoundingClientRect();
    if (!s.height || !o.height) return 1;
    const l = Math.max(s.top, o.top), r = Math.min(s.bottom, o.bottom), c = Math.max(0, r - l);
    return Math.min(1, Math.max(0, c / s.height));
  }
  drawSlotLinks(i) {
    const a = i.querySelector("[data-hd-link-lines]"), n = i.querySelector("[data-hd-ship-map]");
    if (!a || !n) return;
    const o = a.getBoundingClientRect(), s = Math.max(1, Math.round(o.width)), l = Math.max(1, Math.round(o.height));
    a.setAttribute("viewBox", `0 0 ${s} ${l}`), a.setAttribute("width", String(s)), a.setAttribute("height", String(l)), a.innerHTML = "", i.querySelectorAll("[data-hd-anchor-slot]").forEach((r) => {
      const c = r.dataset.hdAnchorSlot ?? "", d = i.querySelector(`[data-hd-slot-card="${c}"]`);
      if (!d) return;
      const u = r.getBoundingClientRect(), p = d.getBoundingClientRect(), h = u.left + u.width / 2 - o.left, f = u.top + u.height / 2 - o.top, y = p.left - o.left, m = p.top + p.height / 2 - o.top, b = Math.max(40, Math.abs(y - h) / 2), $ = 0.12 + this.getSlotCardVisibility(i, d) * 0.83, C = document.createElementNS("http://www.w3.org/2000/svg", "path");
      C.setAttribute("d", `M ${h} ${f} C ${h + b} ${f}, ${y - b} ${m}, ${y} ${m}`), C.setAttribute("class", `hd-link-line ${r.dataset.hdAnchorState || ""}`.trim()), C.style.opacity = $.toFixed(2), a.append(C);
    });
  }
  browseShipImage() {
    var n, o;
    if (!A("choose ship images")) return;
    const i = ee(this), a = i == null ? void 0 : i.querySelector("[data-hd-profile-form] input[name='image']");
    if (!a || typeof FilePicker > "u") {
      (o = (n = ui.notifications) == null ? void 0 : n.warn) == null || o.call(n, "Foundry FilePicker is not available.");
      return;
    }
    new FilePicker({
      type: "image",
      current: a.value,
      callback: (s) => {
        a.value = s;
      }
    }).browse();
  }
  async close(i = {}) {
    var a;
    return this.renderFrame && ((globalThis.cancelAnimationFrame ?? window.clearTimeout)(this.renderFrame), this.renderFrame = void 0), (a = this.linkResizeObserver) == null || a.disconnect(), this.linkResizeObserver = void 0, B = null, super.close(i);
  }
}
async function ft() {
  return Q || (Q = (async () => (B || (B = new oi()), await B.render(!0), B))().finally(() => {
    Q = null;
  }), Q);
}
function si() {
  game.settings.register(w, ke, {
    name: "HoloDock Ship Profiles",
    hint: "World-level ship profile and loadout data.",
    scope: "world",
    config: !1,
    type: Object,
    default: {},
    onChange: G
  }), game.settings.register(w, qe, {
    name: "HoloDock Slot Categories",
    hint: "Reusable equipment slot categories for HoloDock.",
    scope: "world",
    config: !1,
    type: Array,
    default: V,
    onChange: G
  }), game.settings.register(w, Ae, {
    name: "HoloDock Default Ship Profile",
    hint: "The ship profile this user opens by default.",
    scope: "client",
    config: !1,
    type: String,
    default: "",
    onChange: G
  }), game.settings.register(w, Ue, {
    name: "Enable Chat Cards",
    hint: "Post HoloDock activation results and install request cards to chat.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  });
}
function ri() {
  const e = {
    open: ft,
    getProfiles: Ke,
    getProfile: j,
    createProfile: Ze,
    updateProfileMetadata: et,
    updateProfilePermissions: tt,
    deleteProfile: it,
    upsertSlot: nt,
    deleteSlot: ot,
    upsertStat: le,
    deleteStat: at,
    setSlotAnchor: we,
    clearSlotAnchor: st,
    equipItem: De,
    unequipItem: Se,
    getCategories: te,
    getShipPowerBudget: ct,
    getShipEquipmentData: E,
    isShipEquipment: Ct,
    validateItemForSlot: de,
    setShipEquipmentData: _,
    updateShipEquipmentDurability: re,
    updateShipEquipmentPowerState: ze,
    updateShipEquipmentPowerAllocation: ye,
    activateEquipment: Xe
  };
  game.holodock = e;
  const t = game.modules.get(w);
  t && (t.api = e);
}
function li() {
  const e = game.modules.get("holosuite-core");
  return (e != null && e.active ? e.api : null) ?? game.holosuite ?? globalThis.HoloSuiteCoreApi ?? null;
}
function he() {
  var i;
  const e = li();
  if (!(e != null && e.registerApp)) return !1;
  const t = {
    id: w,
    title: "HoloDock",
    icon: "fas fa-rocket",
    premium: !1,
    playerVisible: !0,
    description: "View and manage system-agnostic ship loadouts.",
    open: () => ft()
  };
  return e.registerApp(t), (i = e.registerWhatsNew) == null || i.call(e, {
    moduleId: w,
    title: "HoloDock",
    tier: "free",
    version: "1.0.0",
    updated: "2026-07-22",
    icon: "fas fa-rocket",
    url: "https://github.com/Thuurvdv/holodock/releases/tag/v1.0.0",
    entries: [
      {
        title: "Ship loadouts join HoloSuite",
        summary: "Create system-agnostic ship profiles with equipment slots, power allocation, damage tracking, ship-image pins, and player-facing install or activation permissions.",
        tags: ["Ships", "Loadouts", "Power", "Foundry v12-v14"]
      }
    ]
  }), !0;
}
function ci() {
  if (he()) return;
  let e = 0;
  const t = () => {
    e += 1, !(he() || e >= 20) && window.setTimeout(t, 250);
  };
  Hooks.once("holosuite-core.apiReady", () => he()), window.setTimeout(t, 250);
}
Hooks.once("init", async () => {
  si(), Handlebars.registerHelper("hdFallback", (e, t) => e || t), await loadTemplates([Ge]);
});
Hooks.once("ready", () => {
  ri(), Lt(), Hooks.on("getApplicationHeaderButtons", ae), Hooks.on("getApplicationV1HeaderButtons", ae), Hooks.on("getDocumentSheetHeaderButtons", ae), Hooks.on("getItemSheetHeaderButtons", ae), Hooks.on("getHeaderControlsApplicationV2", ai), Hooks.on("renderItemSheet", Z), Hooks.on("renderItemSheetV2", Z), Hooks.on("renderApplication", Z), Hooks.on("renderApplicationV1", Z), Hooks.on("renderApplicationV2", Z), Hooks.on("renderChatMessage", Oe), Hooks.on("renderChatMessageHTML", Oe), ci(), console.log(`${w} | Ready. API available at game.holodock.`);
});
