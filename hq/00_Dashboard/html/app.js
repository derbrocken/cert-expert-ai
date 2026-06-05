/**
 * Cert-Expert HQ — Übersicht oben, Auswahl unten
 */

let state = null;
let financeState = null;
let financeEditMode = false;
let incomeState = null;
let incomeEditMode = false;
let financeTab = "overview";
let currentView = "day";

const FINANCE_KATEGORIEN = [
  "Tools",
  "Büro",
  "Telekommunikation",
  "Personal",
  "Hardware",
  "Buchhaltung",
  "Sonstiges",
];

const FINANCE_CHART_COLORS = {
  Tools: "#e30613",
  Büro: "#2563eb",
  Telekommunikation: "#7c3aed",
  Personal: "#059669",
  Hardware: "#d97706",
  Buchhaltung: "#0891b2",
  Sonstiges: "#6b7280",
};

const INCOME_STATUSES = [
  "Warten",
  "Erwartet",
  "Offen",
  "Rechnung noch anlegen",
  "Nicht erwartet",
  "Sonstiges",
];

const INCOME_CHART_COLORS = {
  Warten: "#d97706",
  Erwartet: "#059669",
  Offen: "#2563eb",
  "Rechnung noch anlegen": "#7c3aed",
  "Nicht erwartet": "#6b7280",
  Sonstiges: "#9ca3af",
};
let busy = false;

const $ = (sel) => document.querySelector(sel);

const THEME_DISPLAY = {
  vertrieb: "Vertrieb",
  forderungen: "Forderungen",
  intern: "Intern",
  privat: "Privat",
  dfss: "DFSS",
};

function setStatus(msg, isError = false) {
  const el = $("#status-msg");
  if (!el) return;
  el.textContent = msg;
  el.style.color = isError ? "var(--danger)" : "var(--muted)";
}

function isLocalServer() {
  return location.protocol === "http:" || location.protocol === "https:";
}

async function api(path, body) {
  if (!isLocalServer()) {
    throw new Error("Bitte über den lokalen Server öffnen (python3 hq/scripts/serve_dashboard.py)");
  }
  const opts = body
    ? {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    : { method: "GET" };
  const res = await fetch(path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

async function loadData() {
  if (!isLocalServer()) {
    throw new Error("Datei direkt geöffnet — Server starten: python3 hq/scripts/serve_dashboard.py");
  }
  const res = await fetch("/api/data");
  if (!res.ok) throw new Error("Daten konnten nicht geladen werden");
  state = await res.json();
}

function patchItemInState(itemId, patch) {
  const id = String(itemId);
  const index = state?.items_index;
  if (index?.[id]) Object.assign(index[id], patch);
  for (const g of state?.pins?.groups || []) {
    for (const it of g.items || []) {
      if (it.id === id) Object.assign(it, patch);
    }
  }
  for (const sec of state?.backlog?.sections || []) {
    for (const it of sec.items || []) {
      if (it.id === id) Object.assign(it, patch);
    }
  }
}

function captureOpenDetails() {
  return [...document.querySelectorAll("details[data-fold-id][open]")].map(
    (el) => el.dataset.foldId
  );
}

function restoreOpenDetails(ids) {
  for (const id of ids) {
    const el = document.querySelector(`details[data-fold-id="${CSS.escape(id)}"]`);
    if (el) el.open = true;
  }
}

function focusTaskRow(taskId) {
  const el = document.querySelector(
    `.task-item[data-id="${CSS.escape(String(taskId))}"]`
  );
  if (el) el.scrollIntoView({ block: "nearest", behavior: "instant" });
}

async function refreshAll(opts = {}) {
  const { focusTaskId = null, keepFolds = true, openFoldIds = null } = opts;
  const scrollY = window.scrollY;
  const openFolds = keepFolds
    ? [...new Set([...captureOpenDetails(), ...(openFoldIds || [])])]
    : openFoldIds || [];
  await loadData();
  render();
  restoreOpenDetails(openFolds);
  if (focusTaskId) {
    const row = document.querySelector(
      `.task-item[data-id="${CSS.escape(String(focusTaskId))}"]`
    );
    const pf = row?.closest("details.project-fold");
    const folder = row?.closest("details.folder");
    if (pf) pf.open = true;
    if (folder) folder.open = true;
    focusTaskRow(focusTaskId);
  } else {
    window.scrollTo(0, scrollY);
  }
}

async function withBusy(fn) {
  if (busy) return;
  busy = true;
  try {
    await fn();
  } finally {
    busy = false;
  }
}

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s ?? "";
  return d.innerHTML;
}

function groupDomId(g, index) {
  if (g.slug) return `ov-${g.slug}`;
  if (g.theme) return `ov-theme-${g.theme}`;
  return `ov-group-${index}`;
}

function openItems(sec) {
  return (sec.items || []).filter((t) => !t.done);
}

function sectionItems(sec) {
  return sec.items || [];
}

function sectionAllInOverview(sec) {
  const open = openItems(sec);
  return open.length > 0 && open.every((t) => t.in_overview);
}

function overviewSectionIdForGroup(g) {
  if (g.slug) return `customer-${g.slug}`;
  if (g.theme) return `theme-${g.theme}`;
  return null;
}

function applyDoneLook(li, item) {
  const isDone = !!item.done;
  li.classList.toggle("done", isDone);
  if (isDone) li.dataset.done = "1";
  else delete li.dataset.done;
}

function createAddTaskForm(sec) {
  const form = document.createElement("div");
  form.className = "add-task-form";

  const textIn = document.createElement("input");
  textIn.type = "text";
  textIn.className = "add-task-text";
  textIn.placeholder = "Neue Aufgabe …";
  textIn.required = true;

  const dateIn = document.createElement("input");
  dateIn.type = "date";
  dateIn.className = "add-task-frist";
  const d = new Date();
  d.setDate(d.getDate() + 7);
  dateIn.value = d.toISOString().slice(0, 10);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn small";
  btn.textContent = "+ Hinzufügen";
  btn.addEventListener("click", async (e) => {
    e.stopPropagation();
    const aufgabe = textIn.value.trim();
    if (!aufgabe) {
      setStatus("Bitte Aufgabentext eingeben.", true);
      return;
    }
    await withBusy(async () => {
      try {
        setStatus("Lege Aufgabe an …");
        const r = await api("/api/add-task", {
          slug: sec.slug,
          aufgabe,
          frist: dateIn.value,
          add_to_overview: true,
        });
        textIn.value = "";
        await refreshAll({
          focusTaskId: r.id,
          keepFolds: true,
          openFoldIds: [sec.id, "folder-projects"],
        });
        setStatus(`Angelegt (${r.id}) — in Übersicht & ToDos.md.`);
      } catch (err) {
        setStatus(err.message, true);
      }
    });
  });

  textIn.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      btn.click();
    }
  });

  form.append(textIn, dateIn, btn);
  return form;
}

function renderLiveMessungPanel(slug) {
  const lm = state?.live_messung?.[slug];
  if (!lm) return null;

  const det = document.createElement("details");
  det.className = "live-messung-panel";
  det.dataset.foldId = `live-${slug}`;

  const summary = document.createElement("summary");
  summary.innerHTML = `<span class="live-messung-label">Live-Messung</span><span class="theme-meta">${esc(lm.summary || "—")}</span>`;

  const body = document.createElement("div");
  body.className = "live-messung-body";

  const hint = document.createElement("p");
  hint.className = "hint live-messung-hint";
  hint.textContent =
    "Parallele DFSS-O2C-Messung — erscheint nicht in der Tages-Übersicht. Füllt später den Pilot Validation Report.";
  body.append(hint);

  const grid = document.createElement("div");
  grid.className = "live-messung-grid";

  const f = lm.fields || {};
  const addDate = (label, key) => {
    const wrap = document.createElement("label");
    wrap.className = "live-messung-field";
    wrap.innerHTML = `<span>${esc(label)}</span>`;
    const inp = document.createElement("input");
    inp.type = "date";
    inp.dataset.field = key;
    inp.value = (f[key]?.date || "").slice(0, 10);
    wrap.append(inp);
    grid.append(wrap);
  };

  addDate("Willkommens-Mail", "willkommens_mail");
  addDate("Unterlagen-Link", "unternehmensunterlagen_link");
  addDate("Formular begonnen", "formular_begonnen");

  const blockWrap = document.createElement("label");
  blockWrap.className = "live-messung-field";
  blockWrap.innerHTML = `<span>Blockiert seit</span>`;
  const blockDate = document.createElement("input");
  blockDate.type = "date";
  blockDate.dataset.field = "blockiert_seit_date";
  blockDate.value = (f.blockiert_seit?.date || "").slice(0, 10);
  const blockGrund = document.createElement("input");
  blockGrund.type = "text";
  blockGrund.className = "live-messung-text";
  blockGrund.placeholder = "Grund …";
  blockGrund.dataset.field = "blockiert_grund";
  blockGrund.value = f.blockiert_seit?.grund || "";
  blockWrap.append(blockDate, blockGrund);
  grid.append(blockWrap);

  const missWrap = document.createElement("label");
  missWrap.className = "live-messung-field live-messung-field-wide";
  missWrap.innerHTML = `<span>Fehlender Nachweis</span>`;
  const missIn = document.createElement("input");
  missIn.type = "text";
  missIn.className = "live-messung-text";
  missIn.dataset.field = "fehlender_nachweis";
  missIn.value = f.fehlender_nachweis?.text || "";
  missWrap.append(missIn);
  grid.append(missWrap);

  const rqWrap = document.createElement("label");
  rqWrap.className = "live-messung-field";
  rqWrap.innerHTML = `<span>Rückfragen</span>`;
  const rqIn = document.createElement("input");
  rqIn.type = "number";
  rqIn.min = "0";
  rqIn.dataset.field = "rueckfragen_anzahl";
  rqIn.value = String(f.rueckfragen_anzahl ?? 0);
  rqWrap.append(rqIn);
  grid.append(rqWrap);

  const startWrap = document.createElement("label");
  startWrap.className = "live-messung-field";
  startWrap.innerHTML = `<span>Start (Tage-Messung)</span>`;
  const startIn = document.createElement("input");
  startIn.type = "date";
  startIn.dataset.field = "started_at";
  startIn.value = (lm.started_at || "").slice(0, 10);
  startWrap.append(startIn);
  grid.append(startWrap);

  const m1Wrap = document.createElement("label");
  m1Wrap.className = "live-messung-field";
  m1Wrap.innerHTML = `<span>Meilenstein 1</span>`;
  const m1In = document.createElement("input");
  m1In.type = "date";
  m1In.dataset.field = "milestone_1_at";
  m1In.value = (lm.milestone_1_at || "").slice(0, 10);
  m1Wrap.append(m1In);
  grid.append(m1Wrap);

  body.append(grid);

  const meta = document.createElement("p");
  meta.className = "theme-meta live-messung-meta";
  const days = lm.days_to_milestone_1;
  meta.textContent =
    days != null
      ? `Tage bis M1: ${days} · ${lm.milestone_1_label || ""}`
      : lm.milestone_1_label || "";
  body.append(meta);

  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.className = "btn small secondary";
  saveBtn.textContent = "Live-Messung speichern";
  saveBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    const patch = {
      slug,
      started_at: startIn.value,
      milestone_1_at: m1In.value,
      fields: {
        willkommens_mail: { date: grid.querySelector('[data-field="willkommens_mail"]')?.value || "" },
        unternehmensunterlagen_link: {
          date: grid.querySelector('[data-field="unternehmensunterlagen_link"]')?.value || "",
        },
        formular_begonnen: { date: grid.querySelector('[data-field="formular_begonnen"]')?.value || "" },
        blockiert_seit: { date: blockDate.value, grund: blockGrund.value },
        fehlender_nachweis: { text: missIn.value },
        rueckfragen_anzahl: rqIn.value,
      },
    };
    await withBusy(async () => {
      try {
        setStatus("Speichere Live-Messung …");
        await api("/api/live-messung", patch);
        await refreshAll({ keepFolds: true, openFoldIds: [det.dataset.foldId, `customer-${slug}`, "folder-projects"] });
        setStatus("Live-Messung gespeichert.");
      } catch (err) {
        setStatus(err.message, true);
      }
    });
  });
  body.append(saveBtn);

  det.append(summary, body);
  return det;
}

function createOverviewGroupRemoveButton(g) {
  const sectionId = overviewSectionIdForGroup(g);
  if (!sectionId) return null;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn small secondary group-remove";
  btn.textContent = "Gruppe aus Übersicht";
  btn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await withBusy(async () => {
      try {
        await api("/api/overview-section", { section_id: sectionId, select: false });
        await refreshAll();
        setStatus("Gruppe aus Übersicht entfernt.");
      } catch (err) {
        setStatus(err.message, true);
      }
    });
  });
  return btn;
}

/** Übersicht immer aus selected + items_index (inkl. erledigt). */
function buildOverviewGroups() {
  const selected = state.pins?.selected || [];
  const index = state.items_index || {};
  const customersBySlug = {};
  for (const c of state.customers || []) {
    customersBySlug[c.slug] = c;
  }

  const buckets = new Map();
  const order = [];

  for (const sid of selected) {
    const it = index[String(sid)];
    if (!it) continue;
    let key;
    let gtype;
    let title;
    let slug = null;
    let theme = null;
    let header_extra = "";

    if (it.slug) {
      key = `p:${it.slug}`;
      gtype = "project";
      slug = it.slug;
      title = customersBySlug[it.slug]?.display_name || it.slug;
      header_extra = customersBySlug[it.slug]?.audit_label || "";
    } else if (it.theme) {
      key = `t:${it.theme}`;
      gtype = "theme";
      theme = it.theme;
      title = THEME_DISPLAY[it.theme] || it.theme;
    } else {
      key = "other";
      gtype = "other";
      title = "Sonstiges";
    }

    if (!buckets.has(key)) {
      buckets.set(key, {
        type: gtype,
        slug,
        theme,
        title,
        header_extra,
        items: [],
      });
      order.push(key);
    }
    buckets.get(key).items.push({ ...it, in_overview: true });
  }

  return order.map((k) => buckets.get(k));
}

function getOverviewGroups() {
  const built = buildOverviewGroups();
  if (built.length) return built;
  return state.pins?.groups || [];
}

function renderFristField(item, li) {
  const wrap = document.createElement("label");
  wrap.className =
    "frist-field" + (item.frist_provisional ? " frist-provisional" : "");
  wrap.title = item.frist_provisional
    ? "Provisorisch (+7 Tage) — Datum wählen speichert in ToDos.md"
    : "Frist in ToDos.md";

  const inp = document.createElement("input");
  inp.type = "date";
  inp.className = "frist-input";
  inp.value = item.frist_display || item.frist || "";
  inp.disabled = !!item.done || !inp.value || item.id.startsWith("bk-");
  if (!item.done && inp.value && !item.id.startsWith("bk-")) {
    inp.addEventListener("click", (e) => e.stopPropagation());
    inp.addEventListener("change", async (e) => {
      e.stopPropagation();
      if (busy || !inp.value) return;
      await withBusy(async () => {
        try {
          setStatus("Speichere Frist …");
          await api("/api/set-frist", { id: item.id, frist: inp.value });
          await refreshAll();
          setStatus("Frist gespeichert.");
        } catch (err) {
          setStatus(err.message, true);
        }
      });
    });
  }

  const lbl = document.createElement("span");
  lbl.className = "frist-label";
  lbl.textContent = item.frist_label || "—";
  wrap.append(inp, lbl);
  li.append(wrap);
}

function renderDoneCheckbox(item, li) {
  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.className = "cb-done";
  cb.checked = !!item.done;
  cb.title = "Erledigt";
  cb.addEventListener("click", (e) => e.stopPropagation());
  cb.addEventListener("change", async (e) => {
    e.stopPropagation();
    if (busy) {
      cb.checked = !cb.checked;
      return;
    }
    const want = cb.checked;
    patchItemInState(item.id, { done: want });
    applyDoneLook(li, { ...item, done: want });
    const textEl = li.querySelector(".task-text");
    if (textEl && textEl.tagName === "SPAN" && want) {
      const del = document.createElement("del");
      del.className = "task-text";
      del.textContent = textEl.textContent;
      textEl.replaceWith(del);
    } else if (textEl && textEl.tagName === "DEL" && !want) {
      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = textEl.textContent;
      textEl.replaceWith(span);
    }
    await withBusy(async () => {
      try {
        setStatus("Speichere …");
        await api("/api/check", { id: item.id, done: want });
        await refreshAll({ focusTaskId: item.id, keepFolds: true });
        setStatus(want ? "Erledigt — bleibt sichtbar." : "Wieder offen — bleibt in der Liste.");
      } catch (err) {
        cb.checked = !want;
        patchItemInState(item.id, { done: !want });
        applyDoneLook(li, { ...item, done: !want });
        setStatus(err.message, true);
      }
    });
  });
  li.append(cb);
}

function renderOverviewCheckbox(item, li) {
  const ov = document.createElement("input");
  ov.type = "checkbox";
  ov.className = "cb-overview";
  ov.checked = !!item.in_overview;
  ov.title = "In Übersicht";
  ov.addEventListener("click", (e) => e.stopPropagation());
  ov.addEventListener("change", async (e) => {
    e.stopPropagation();
    if (busy) {
      ov.checked = !ov.checked;
      return;
    }
    const want = ov.checked;
    await withBusy(async () => {
      try {
        setStatus("Speichere Auswahl …");
        await api("/api/toggle-overview", { id: item.id, on: want });
        await refreshAll();
        setStatus(want ? "In Übersicht." : "Entfernt.");
      } catch (err) {
        ov.checked = !want;
        setStatus(err.message, true);
      }
    });
  });
  const label = document.createElement("label");
  label.className = "overview-pick";
  const span = document.createElement("span");
  span.textContent = "Übersicht";
  label.append(ov, span);
  li.append(label);
}

function renderTaskItem(item, mode) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.id = item.id;
  applyDoneLook(li, item);

  if (mode === "overview") {
    renderDoneCheckbox(item, li);
    renderFristField(item, li);
    if (item.done) {
      const badge = document.createElement("span");
      badge.className = "badge-done";
      badge.textContent = "Erledigt";
      li.append(badge);
    }
    const text = document.createElement(item.done ? "del" : "span");
    text.className = "task-text";
    text.textContent = item.aufgabe;
    const idSpan = document.createElement("span");
    idSpan.className = "task-id";
    idSpan.textContent = item.id;
    li.append(text, idSpan);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn secondary small";
    btn.textContent = "Entfernen";
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      await withBusy(async () => {
        try {
          await api("/api/toggle-overview", { id: item.id, on: false });
          await refreshAll();
          setStatus("Aus Übersicht entfernt.");
        } catch (err) {
          setStatus(err.message, true);
        }
      });
    });
    li.append(btn);
    return li;
  }

  renderDoneCheckbox(item, li);
  renderFristField(item, li);
  const text = document.createElement(item.done ? "del" : "span");
  text.className = "task-text";
  text.textContent = item.aufgabe;
  const idSpan = document.createElement("span");
  idSpan.className = "task-id";
  idSpan.textContent = item.id;
  if (item.done) {
    const badge = document.createElement("span");
    badge.className = "badge-done";
    badge.textContent = "Erledigt";
    li.append(badge, text, idSpan);
  } else {
    li.append(text, idSpan);
  }
  if (item.kommunikation) {
    const tag = document.createElement("span");
    tag.className = "tag-komm";
    tag.textContent = "Komm.";
    tag.title = "Kundenkommunikation (ToDos)";
    li.insertBefore(tag, text);
  }
  renderOverviewCheckbox(item, li);
  return li;
}

function renderOverviewStrip() {
  const strip = $("#overview-strip");
  const chips = $("#overview-chips");
  if (!strip || !chips) return;
  chips.innerHTML = "";
  const groups = getOverviewGroups();
  if (!groups.length) {
    strip.classList.add("hidden");
    return;
  }
  strip.classList.remove("hidden");
  groups.forEach((g, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "overview-chip";
    const items = g.items || [];
    const openN = items.filter((t) => !t.done).length;
    const doneN = items.length - openN;
    btn.textContent =
      doneN && !openN
        ? `${g.title} (✓ ${doneN})`
        : `${g.title} (${openN}${doneN ? ` · ${doneN} erl.` : ""})`;
    btn.addEventListener("click", () => {
      document.getElementById(groupDomId(g, i))?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    chips.append(btn);
  });
}

function renderPinZone() {
  const container = $("#pin-groups");
  const empty = $("#pin-empty");
  container.innerHTML = "";
  const groups = getOverviewGroups();

  if (!groups.length) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  groups.forEach((g, i) => {
    const items = g.items || [];
    const openN = items.filter((t) => !t.done).length;
    const box = document.createElement("div");
    box.className = "pin-group";
    if (items.length && openN === 0) box.classList.add("pin-group-all-done");
    box.id = groupDomId(g, i);

    const head = document.createElement("div");
    head.className = "pin-group-head";
    const typeLabel = g.type === "project" ? "Projekt" : "Thema";
    const stats =
      items.length && openN < items.length
        ? ` (${openN} offen, ${items.length - openN} erledigt)`
        : items.length
          ? ` (${openN} offen)`
          : "";
    const auditSub = g.header_extra ? ` · ${esc(g.header_extra)}` : "";
    head.innerHTML = `<div><h3>${esc(typeLabel)} · ${esc(g.title)}<span class="sub">${esc(stats)}${auditSub}</span></h3></div>`;
    const groupBtn = createOverviewGroupRemoveButton(g);
    if (groupBtn) head.append(groupBtn);
    box.append(head);

    const ul = document.createElement("ul");
    ul.className = "task-list";
    for (const item of items) {
      ul.append(renderTaskItem(item, "overview"));
    }
    box.append(ul);
    container.append(box);
  });
}

const KIND_LABEL = {
  customer: "Projekt",
  theme: "Thema",
  pflege: "Pflege",
};

function renderSectionBlock(sec) {
  const items = sectionItems(sec);
  if (!items.length) return null;

  const open = openItems(sec);
  const box = document.createElement("section");
  box.className =
    "backlog-section" + (sectionAllInOverview(sec) ? " section-active" : "");
  if (open.length === 0) box.classList.add("section-all-done");
  box.dataset.sectionId = sec.id;

  const head = document.createElement("div");
  head.className = "backlog-section-head";
  const kind = KIND_LABEL[sec.kind] || sec.kind;
  head.innerHTML = `
      <div>
        <div class="backlog-kind">${esc(kind)}</div>
        <h3>${esc(sec.title)} <span class="theme-meta">(${open.length} offen${items.length - open.length ? `, ${items.length - open.length} erledigt` : ""})</span></h3>
      </div>
    `;
  head.append(createSectionToggleButton(sec));
  box.append(head);

  const ul = document.createElement("ul");
  ul.className = "task-list";
  for (const item of items) {
    ul.append(renderTaskItem(item, "auswahl"));
  }
  box.append(ul);
  return box;
}

function renderProjectFold(sec) {
  const items = sectionItems(sec);
  if (!items.length) return null;

  const open = openItems(sec);
  const det = document.createElement("details");
  det.className =
    "project-fold" + (sectionAllInOverview(sec) ? " section-active" : "");
  if (open.length === 0) det.classList.add("project-fold-all-done");
  det.dataset.sectionId = sec.id;
  det.dataset.foldId = sec.id;

  const summary = document.createElement("summary");
  summary.className = "project-fold-summary";
  summary.innerHTML = `<span class="project-name">${esc(sec.title)}</span><span class="theme-meta">${open.length} offen${items.length - open.length ? ` · ${items.length - open.length} erledigt` : ""}</span>`;

  const body = document.createElement("div");
  body.className = "project-fold-body";

  const actions = document.createElement("div");
  actions.className = "backlog-section-head";
  actions.append(createSectionToggleButton(sec));
  body.append(actions);

  if (sec.slug) {
    body.append(createAddTaskForm(sec));
    const livePanel = renderLiveMessungPanel(sec.slug);
    if (livePanel) body.append(livePanel);
  }

  const ul = document.createElement("ul");
  ul.className = "task-list project-task-list";
  for (const item of items) {
    ul.append(renderTaskItem(item, "auswahl"));
  }
  body.append(ul);
  det.append(summary, body);
  return det;
}

function createSectionToggleButton(sec) {
  const allOn = sectionAllInOverview(sec);
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn small section-toggle" + (allOn ? " pin-active" : "");
  btn.textContent = allOn ? "Aus Übersicht entfernen (Gruppe)" : "Alle zur Übersicht";
  btn.addEventListener("click", async (e) => {
    e.stopPropagation();
    await withBusy(async () => {
      try {
        setStatus(allOn ? "Entferne Gruppe …" : "Übernehme Gruppe …");
        await api("/api/overview-section", {
          section_id: sec.id,
          select: !allOn,
        });
        await refreshAll();
        setStatus(allOn ? "Gruppe entfernt." : "Gruppe in Übersicht.");
      } catch (err) {
        setStatus(err.message, true);
      }
    });
  });
  return btn;
}

function appendFolder(root, title, children, { openDefault = true, foldId = "folder" } = {}) {
  const nodes = children.filter(Boolean);
  if (!nodes.length) return;
  const folder = document.createElement("details");
  folder.className = "folder";
  folder.dataset.foldId = foldId;
  if (openDefault) folder.open = true;
  const summary = document.createElement("summary");
  summary.className = "folder-summary";
  summary.innerHTML = title;
  folder.append(summary);
  const inner = document.createElement("div");
  inner.className = "folder-inner";
  for (const node of nodes) inner.append(node);
  folder.append(inner);
  root.append(folder);
}

function renderAuswahl() {
  const root = $("#auswahl-sections");
  if (!root) return;
  root.innerHTML = "";
  const sections = state.backlog?.sections || [];
  if (!sections.length) {
    root.innerHTML =
      '<p class="empty">Keine Auswahl-Abschnitte — zuerst build_dashboard.py ausführen.</p>';
    return;
  }

  const projects = sections.filter((s) => s.kind === "customer");
  const pflege = sections.filter((s) => s.kind === "pflege");
  const themes = sections.filter((s) => s.kind === "theme");

  const projectFolds = projects.map((s) => renderProjectFold(s)).filter(Boolean);
  const openProjects = projects.reduce((n, s) => n + openItems(s).length, 0);
  appendFolder(
    root,
    `<strong>Projekte</strong> <span class="theme-meta">${projectFolds.length} Projekte · ${openProjects} offen</span>`,
    projectFolds,
    { openDefault: true, foldId: "folder-projects" }
  );

  const themeBlocks = themes.map((s) => renderSectionBlock(s)).filter(Boolean);
  if (themeBlocks.length) {
    const openThemes = themes.reduce((n, s) => n + openItems(s).length, 0);
    appendFolder(
      root,
      `<strong>Querschnitt</strong> <span class="theme-meta">${themeBlocks.length} · ${openThemes} offen</span>`,
      themeBlocks,
      { openDefault: false, foldId: "folder-themes" }
    );
  }

  const pflegeBlocks = pflege.map((s) => renderSectionBlock(s)).filter(Boolean);
  if (pflegeBlocks.length) {
    const openPflege = pflege.reduce((n, s) => n + openItems(s).length, 0);
    appendFolder(
      root,
      `<strong>Pflege-Backlog</strong> <span class="theme-meta">${openPflege} offen</span>`,
      pflegeBlocks,
      { openDefault: false, foldId: "folder-pflege" }
    );
  }
}

function renderKpis() {
  const row = $("#kpi-row");
  if (!row || !state) return;
  const selected = (state.pins?.selected || []).length;
  const groups = getOverviewGroups();
  const inOverview = groups.reduce((n, g) => n + (g.items?.length || 0), 0);
  const openOverview = groups.reduce(
    (n, g) => n + (g.items || []).filter((t) => !t.done).length,
    0
  );
  let openAll = 0;
  for (const sec of state.backlog?.sections || []) {
    openAll += openItems(sec).length;
  }
  const openInOv = groups.reduce((n, g) => n + (g.items || []).filter((t) => !t.done).length, 0);
  row.innerHTML = `
    <div class="kpi-card accent"><strong>${inOverview}</strong><span>In Übersicht</span></div>
    <div class="kpi-card"><strong>${openInOv}</strong><span>Davon offen</span></div>
    <div class="kpi-card"><strong>${openAll}</strong><span>Backlog offen</span></div>
    <div class="kpi-card"><strong>${state.today || "—"}</strong><span>Stand</span></div>
  `;
}

function render() {
  if (!state) return;
  $("#meta-line").textContent = `Generiert ${state.generated_at?.slice(0, 19) || "—"}`;
  renderKpis();
  renderOverviewStrip();
  renderPinZone();
  renderAuswahl();
}

function showFileWarning() {
  const el = $("#file-warning");
  if (!el) return;
  el.classList.toggle("hidden", isLocalServer());
}

async function loadFinance(force = false) {
  const cached = state?.finance;
  const cacheOk =
    cached?.items?.length &&
    cached.items.every((it) => it.id) &&
    (Array.isArray(cached.categories) || cached.items.some((it) => it.kategorie));
  if (!force && cacheOk) {
    financeState = cached;
    return;
  }
  financeState = await api("/api/finance");
  if (state) state.finance = financeState;
}

function financeCategorySelect(name, selected) {
  const opts = (financeState?.kategorien || FINANCE_KATEGORIEN)
    .map(
      (k) =>
        `<option value="${escapeHtml(k)}"${k === selected ? " selected" : ""}>${escapeHtml(k)}</option>`
    )
    .join("");
  return `<select class="finance-inp finance-sel" data-field="${name}">${opts}</select>`;
}

function financeCategoryBadge(kat) {
  const k = kat || "Sonstiges";
  const color = FINANCE_CHART_COLORS[k] || FINANCE_CHART_COLORS.Sonstiges;
  return `<span class="finance-cat-badge" style="--cat-color:${color}">${escapeHtml(k)}</span>`;
}

function financeRowInputs(row) {
  const kat = row.kategorie || "Tools";
  return `
    <td><input type="text" class="finance-inp" data-field="posten" value="${escapeHtml(row.posten)}" required /></td>
    <td>${financeCategorySelect("kategorie", kat)}</td>
    <td><input type="text" class="finance-inp" data-field="anbieter" value="${escapeHtml(row.anbieter === "—" ? "" : row.anbieter || "")}" /></td>
    <td class="num"><input type="text" class="finance-inp" data-field="amount" value="${escapeHtml(row.amount_display || "")}" required inputmode="decimal" /></td>
    <td><input type="text" class="finance-inp" data-field="note" value="${escapeHtml(row.note || "")}" /></td>
  `;
}

function formatEuroDe(n) {
  const v = Number(n) || 0;
  return (
    v.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
    " €"
  );
}

function financeRowAmount(row) {
  if (row.amount != null && !Number.isNaN(Number(row.amount))) {
    return Number(row.amount);
  }
  const raw = String(row.amount_display || "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const v = parseFloat(raw);
  return Number.isFinite(v) ? v : 0;
}

/** Fallback wenn Server noch keine categories liefert */
function financeCategoriesForChart() {
  if (financeState?.categories?.length) {
    return financeState.categories;
  }
  const buckets = {};
  for (const row of financeState?.items || []) {
    const cat = row.kategorie || "Sonstiges";
    buckets[cat] = (buckets[cat] || 0) + financeRowAmount(row);
  }
  const total = Object.values(buckets).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(buckets)
    .filter(([, amount]) => amount > 0)
    .map(([kategorie, amount]) => ({
      kategorie,
      amount: Math.round(amount * 100) / 100,
      percent: Math.round((1000 * amount) / total) / 10,
    }))
    .sort((a, b) => b.amount - a.amount);
}

function renderFinancePieChart(
  chartEl = $("#finance-chart"),
  legendEl = $("#finance-chart-legend"),
  panelEl = $("#finance-chart-panel")
) {
  if (!chartEl || !legendEl || !financeState) return;

  const slices = financeCategoriesForChart();
  if (panelEl) panelEl.classList.toggle("hidden", !slices.length);

  if (!slices.length) {
    chartEl.innerHTML = `<p class="hint">Noch keine Kosten mit Betrag.</p>`;
    legendEl.innerHTML = "";
    return;
  }

  const cx = 100;
  const cy = 100;
  const r = 88;
  let angle = -Math.PI / 2;
  const paths = [];

  for (const s of slices) {
    const frac = (s.percent || 0) / 100;
    const sweep = frac * Math.PI * 2;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    const color = FINANCE_CHART_COLORS[s.kategorie] || FINANCE_CHART_COLORS.Sonstiges;
    if (frac >= 0.999) {
      paths.push(
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" />`
      );
      break;
    }
    if (frac <= 0) continue;
    paths.push(
      `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z" fill="${color}" />`
    );
  }

  chartEl.innerHTML = `
    <svg class="finance-pie-svg" viewBox="0 0 200 200" role="img" aria-label="Kostenverteilung">
      ${paths.join("")}
      <circle cx="${cx}" cy="${cy}" r="46" fill="var(--surface)" />
    </svg>
  `;

  legendEl.innerHTML = slices
    .map((s) => {
      const color = FINANCE_CHART_COLORS[s.kategorie] || FINANCE_CHART_COLORS.Sonstiges;
      return `<li>
        <span class="finance-legend-swatch" style="background:${color}"></span>
        <span class="finance-legend-label">${escapeHtml(s.kategorie)}</span>
        <span class="finance-legend-val">${formatEuroDe(s.amount)} · ${escapeHtml(String(s.percent))}%</span>
      </li>`;
    })
    .join("");
}

function fillFinanceAddKategorieSelect() {
  const sel = $("#finance-add-kategorie");
  if (!sel) return;
  const list = financeState?.kategorien || FINANCE_KATEGORIEN;
  sel.innerHTML = list
    .map((k) => `<option value="${escapeHtml(k)}">${escapeHtml(k)}</option>`)
    .join("");
  sel.value = "Tools";
}

function renderFinanceToolbar() {
  const pen = $("#btn-finance-edit");
  const actions = $("#finance-edit-actions");
  const addForm = $("#finance-add-form");
  if (pen) pen.classList.toggle("hidden", financeEditMode);
  if (actions) actions.classList.toggle("hidden", !financeEditMode);
  if (addForm) addForm.classList.toggle("finance-add-disabled", financeEditMode);
}

function collectFinanceItemsFromTable() {
  const tbody = $("#finance-tbody");
  if (!tbody) return [];
  return [...tbody.querySelectorAll("tr[data-item-id]")].map((tr) => ({
    id: tr.dataset.itemId,
    posten: tr.querySelector('[data-field="posten"]')?.value?.trim() ?? "",
    kategorie: tr.querySelector('[data-field="kategorie"]')?.value?.trim() ?? "Tools",
    anbieter: tr.querySelector('[data-field="anbieter"]')?.value?.trim() ?? "",
    amount: tr.querySelector('[data-field="amount"]')?.value?.trim() ?? "",
    note: tr.querySelector('[data-field="note"]')?.value?.trim() ?? "",
  }));
}

function renderFinance() {
  const tbody = $("#finance-tbody");
  const tfoot = $("#finance-tfoot");
  const summary = $("#finance-summary");
  if (!tbody || !financeState) return;

  tbody.innerHTML = "";
  (financeState.items || []).forEach((row, index) => {
    const tr = document.createElement("tr");
    const id = row.id || `idx-${index}`;
    tr.dataset.itemId = id;
    if (financeEditMode) {
      tr.className = "finance-row-edit";
      tr.innerHTML = financeRowInputs(row);
    } else {
      const note = row.note || "";
      const noteCls =
        /privat/i.test(note) && /umstellen|firma/i.test(note)
          ? "finance-note-privat"
          : "";
      tr.innerHTML = `
        <td>${escapeHtml(row.posten)}</td>
        <td>${financeCategoryBadge(row.kategorie)}</td>
        <td>${escapeHtml(row.anbieter || "—")}</td>
        <td class="num">${escapeHtml(row.amount_display || "—")}</td>
        <td class="${noteCls}">${escapeHtml(note)}</td>
      `;
    }
    tbody.append(tr);
  });

  renderFinanceToolbar();

  if (tfoot) {
    tfoot.innerHTML = `
      <tr>
        <td colspan="4">Summe (monatlich)</td>
        <td class="num">${escapeHtml(financeState.total_display || "")}</td>
      </tr>
    `;
  }

  renderFinancePieChart();
  fillFinanceAddKategorieSelect();

  if (summary) {
    const pending = financeState.pending || [];
    summary.innerHTML = `
      <div class="finance-kpi">
        <strong>${escapeHtml(financeState.total_display || "—")}</strong>
        <span>Cert Expert Fixkosten / Monat</span>
      </div>
      <div class="finance-kpi">
        <strong>${(financeState.items || []).length}</strong>
        <span>Posten mit Betrag</span>
      </div>
      <div class="finance-kpi">
        <strong>${pending.length}</strong>
        <span>Offen (ohne Betrag)</span>
      </div>
    `;
  }

  const zone = $("#finance-zone");
  let pendingBlock = zone?.querySelector(".finance-pending");
  const pending = financeState.pending || [];
  if (pending.length && zone) {
    if (!pendingBlock) {
      pendingBlock = document.createElement("div");
      pendingBlock.className = "finance-pending";
      const form = $("#finance-add-form");
      form?.parentNode?.insertBefore(pendingBlock, form);
    }
    pendingBlock.innerHTML = `
      <h3 class="finance-form-title">Noch ohne Betrag</h3>
      <ul class="finance-pending-list">
        ${pending
          .map(
            (p) =>
              `<li><strong>${escapeHtml(p.posten)}</strong>${p.anbieter ? ` · ${escapeHtml(p.anbieter)}` : ""}${p.note ? ` — <span>${escapeHtml(p.note)}</span>` : ""}</li>`
          )
          .join("")}
      </ul>
    `;
  } else if (pendingBlock) {
    pendingBlock.remove();
  }
}

async function onFinanceSaveAll() {
  const items = collectFinanceItemsFromTable();
  await withBusy(async () => {
    try {
      setStatus("Speichere alle Kosten …");
      const r = await api("/api/finance/save-all", { items });
      financeState = r;
      if (state) state.finance = r;
      financeEditMode = false;
      if (financeTab === "overview") renderFinanceHubOverview();
      else renderFinance();
      setStatus("Alle Kosten gespeichert.");
    } catch (err) {
      setStatus(err.message, true);
    }
  });
}

async function loadIncome(force = false) {
  const cached = state?.finance_income;
  const cacheOk =
    cached?.items?.length && cached.items.every((it) => it.id);
  if (!force && cacheOk) {
    incomeState = cached;
    return;
  }
  incomeState = await api("/api/finance/income");
  if (state) state.finance_income = incomeState;
}

function incomeStatusSelect(name, selected) {
  const opts = (incomeState?.statuses || INCOME_STATUSES)
    .map(
      (s) =>
        `<option value="${escapeHtml(s)}"${s === selected ? " selected" : ""}>${escapeHtml(s)}</option>`
    )
    .join("");
  return `<select class="finance-inp finance-sel" data-field="${name}">${opts}</select>`;
}

function incomeStatusBadge(status) {
  const s = status || "Sonstiges";
  const color = INCOME_CHART_COLORS[s] || INCOME_CHART_COLORS.Sonstiges;
  return `<span class="income-status-badge" style="--cat-color:${color}">${escapeHtml(s)}</span>`;
}

function incomeRowInputs(row) {
  const est = row.is_estimate ? " checked" : "";
  return `
    <td><input type="text" class="finance-inp" data-field="kunde" value="${escapeHtml(row.kunde)}" required /></td>
    <td class="num">
      <input type="text" class="finance-inp" data-field="amount" value="${escapeHtml(row.amount_display || "")}" required inputmode="decimal" />
      <label class="finance-check-field finance-check-inline"><input type="checkbox" class="finance-inp" data-field="is_estimate"${est} /> ~</label>
    </td>
    <td>${incomeStatusSelect("status", row.status)}</td>
    <td><input type="text" class="finance-inp" data-field="hq_ref" value="${escapeHtml(row.hq_ref || "")}" /></td>
  `;
}

function incomeRowAmount(row) {
  if (row.amount != null && !Number.isNaN(Number(row.amount))) {
    return Number(row.amount);
  }
  const raw = String(row.amount_display || "")
    .replace(/[^\d,.~-]/g, "")
    .replace(/^~/, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const v = parseFloat(raw);
  return Number.isFinite(v) ? v : 0;
}

function incomeByStatusForChart() {
  if (incomeState?.by_status?.length) {
    return incomeState.by_status;
  }
  const buckets = {};
  for (const row of incomeState?.items || []) {
    const st = row.status || "Sonstiges";
    const amt = incomeRowAmount(row);
    if (amt <= 0) continue;
    buckets[st] = (buckets[st] || 0) + amt;
  }
  const total = Object.values(buckets).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(buckets)
    .map(([status, amount]) => ({
      status,
      amount: Math.round(amount * 100) / 100,
      percent: Math.round((1000 * amount) / total) / 10,
    }))
    .sort((a, b) => b.amount - a.amount);
}

function renderIncomePieChart(
  chartEl = $("#income-chart"),
  legendEl = $("#income-chart-legend")
) {
  if (!chartEl || !legendEl || !incomeState) return;

  const slices = incomeByStatusForChart();
  if (!slices.length) {
    chartEl.innerHTML = `<p class="hint">Noch keine Beträge &gt; 0.</p>`;
    legendEl.innerHTML = "";
    return;
  }

  const cx = 100;
  const cy = 100;
  const r = 88;
  let angle = -Math.PI / 2;
  const paths = [];

  for (const s of slices) {
    const frac = (s.percent || 0) / 100;
    const sweep = frac * Math.PI * 2;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    const color = INCOME_CHART_COLORS[s.status] || INCOME_CHART_COLORS.Sonstiges;
    if (frac >= 0.999) {
      paths.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" />`);
      break;
    }
    if (frac <= 0) continue;
    paths.push(
      `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z" fill="${color}" />`
    );
  }

  chartEl.innerHTML = `
    <svg class="finance-pie-svg" viewBox="0 0 200 200" role="img" aria-label="Pipeline nach Status">
      ${paths.join("")}
      <circle cx="${cx}" cy="${cy}" r="46" fill="var(--surface)" />
    </svg>
  `;

  legendEl.innerHTML = slices
    .map((s) => {
      const color = INCOME_CHART_COLORS[s.status] || INCOME_CHART_COLORS.Sonstiges;
      return `<li>
        <span class="finance-legend-swatch" style="background:${color}"></span>
        <span class="finance-legend-label">${escapeHtml(s.status)}</span>
        <span class="finance-legend-val">${formatEuroDe(s.amount)} · ${escapeHtml(String(s.percent))}%</span>
      </li>`;
    })
    .join("");
}

function fillIncomeAddStatusSelect() {
  const sel = $("#income-add-status");
  if (!sel) return;
  const list = incomeState?.statuses || INCOME_STATUSES;
  sel.innerHTML = list.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join("");
}

function renderIncomeToolbar() {
  const pen = $("#btn-income-edit");
  const actions = $("#income-edit-actions");
  const addForm = $("#income-add-form");
  if (pen) pen.classList.toggle("hidden", incomeEditMode);
  if (actions) actions.classList.toggle("hidden", !incomeEditMode);
  if (addForm) addForm.classList.toggle("finance-add-disabled", incomeEditMode);
}

function collectIncomeItemsFromTable() {
  const tbody = $("#income-tbody");
  if (!tbody) return [];
  return [...tbody.querySelectorAll("tr")].map((tr) => {
    const get = (field) => {
      const el = tr.querySelector(`[data-field="${field}"]`);
      if (!el) return "";
      if (el.type === "checkbox") return el.checked;
      return el.value;
    };
    return {
      id: tr.dataset.itemId,
      kunde: get("kunde"),
      amount: get("amount"),
      status: get("status"),
      hq_ref: get("hq_ref"),
      is_estimate: get("is_estimate"),
    };
  });
}

function renderFinanceHubOverview() {
  const summary = $("#finance-hub-summary");
  const compare = $("#finance-hub-compare");
  if (!financeState || !incomeState) return;

  renderFinancePieChart(
    $("#finance-overview-chart"),
    $("#finance-overview-chart-legend")
  );
  renderIncomePieChart(
    $("#income-overview-chart"),
    $("#income-overview-chart-legend")
  );

  const costs = financeState.total_display || "—";
  const confirmed = incomeState.total_confirmed_display || "—";
  const estimate = incomeState.total_estimate_display || "—";
  const maximum = incomeState.total_maximum_display || "—";
  const months =
    incomeState.total_confirmed && financeState.total
      ? (incomeState.total_confirmed / financeState.total).toFixed(1)
      : null;

  if (summary) {
    summary.innerHTML = `
      <div class="finance-kpi">
        <strong>${escapeHtml(costs)}</strong>
        <span>Ausgaben / Monat</span>
      </div>
      <div class="finance-kpi">
        <strong>${escapeHtml(confirmed)}</strong>
        <span>Einnahmen fest (Pipeline)</span>
      </div>
      <div class="finance-kpi">
        <strong>${escapeHtml(estimate)}</strong>
        <span>noch zu fakturieren</span>
      </div>
      <div class="finance-kpi">
        <strong>${escapeHtml(maximum)}</strong>
        <span>Pipeline Maximum</span>
      </div>
    `;
  }

  if (compare) {
    compare.innerHTML = `
      <span>Ausgaben <strong>${escapeHtml(costs)}</strong>/Monat</span>
      <span>·</span>
      <span>Pipeline fest <strong>${escapeHtml(confirmed)}</strong></span>
      ${
        months
          ? `<span>·</span><span>≈ <strong>${escapeHtml(months)}</strong> Monate Fixkosten bei vollem Zahlungseingang</span>`
          : ""
      }
    `;
  }
}

function setFinanceTab(tab) {
  financeTab = tab;
  const overview = $("#finance-overview-zone");
  const costs = $("#finance-zone");
  const income = $("#income-zone");
  overview?.classList.toggle("hidden", tab !== "overview");
  costs?.classList.toggle("hidden", tab !== "costs");
  income?.classList.toggle("hidden", tab !== "income");

  document.querySelectorAll("[data-finance-tab]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.financeTab === tab);
  });

  if (tab === "overview") renderFinanceHubOverview();
  else if (tab === "costs") renderFinance();
  else if (tab === "income") renderIncome();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderIncome() {
  const tbody = $("#income-tbody");
  const tfoot = $("#income-tfoot");
  const summary = $("#income-summary");
  if (!tbody || !incomeState) return;

  tbody.innerHTML = "";
  (incomeState.items || []).forEach((row, index) => {
    const tr = document.createElement("tr");
    const id = row.id || `idx-${index}`;
    tr.dataset.itemId = id;
    if (row.is_estimate) tr.classList.add("income-estimate");
    if (incomeEditMode) {
      tr.className = "finance-row-edit";
      tr.innerHTML = incomeRowInputs(row);
    } else {
      tr.innerHTML = `
        <td>${escapeHtml(row.kunde)}</td>
        <td class="num">${escapeHtml(row.amount_display || "—")}</td>
        <td>${incomeStatusBadge(row.status)}</td>
        <td>${escapeHtml(row.hq_ref || "")}</td>
      `;
    }
    tbody.appendChild(tr);
  });

  renderIncomeToolbar();

  if (tfoot && !incomeEditMode) {
    tfoot.innerHTML = `
      <tr>
        <td colspan="2">Fest (ohne Schätzungen)</td>
        <td colspan="2" class="num">${escapeHtml(incomeState.total_confirmed_display || "")}</td>
      </tr>
      <tr>
        <td colspan="2">Noch zu fakturieren (Schätzung)</td>
        <td colspan="2" class="num">${escapeHtml(incomeState.total_estimate_display || "")}</td>
      </tr>
      <tr>
        <td colspan="2">Maximum Pipeline</td>
        <td colspan="2" class="num">${escapeHtml(incomeState.total_maximum_display || "")}</td>
      </tr>
    `;
  } else if (tfoot) {
    tfoot.innerHTML = "";
  }

  renderIncomePieChart();
  fillIncomeAddStatusSelect();

  if (summary) {
    const n = (incomeState.items || []).filter(
      (r) => incomeRowAmount(r) > 0
    ).length;
    summary.innerHTML = `
      <div class="finance-kpi">
        <strong>${escapeHtml(incomeState.total_confirmed_display || "—")}</strong>
        <span>Fest in Pipeline</span>
      </div>
      <div class="finance-kpi">
        <strong>${escapeHtml(incomeState.total_estimate_display || "—")}</strong>
        <span>Schätzung (noch fakturieren)</span>
      </div>
      <div class="finance-kpi">
        <strong>${n}</strong>
        <span>Posten mit Betrag &gt; 0</span>
      </div>
    `;
  }
}

async function onIncomeSaveAll() {
  const items = collectIncomeItemsFromTable();
  await withBusy(async () => {
    try {
      setStatus("Speichere alle Einnahmen …");
      const r = await api("/api/finance/income/save-all", { items });
      incomeState = r;
      if (state) state.finance_income = r;
      incomeEditMode = false;
      if (financeTab === "overview") renderFinanceHubOverview();
      else renderIncome();
      setStatus("Alle Einnahmen gespeichert.");
    } catch (err) {
      setStatus(err.message, true);
    }
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function setView(view, scrollId = null) {
  currentView = view;
  const isFinanzView = view === "finance";
  $("#pin-zone")?.classList.toggle("hidden", isFinanzView);
  $("#auswahl-zone")?.classList.toggle("hidden", isFinanzView);
  $("#finance-hub")?.classList.toggle("hidden", !isFinanzView);
  $("#kpi-row")?.classList.toggle("hidden", isFinanzView);
  document.querySelector(".persist-note")?.classList.toggle("hidden", isFinanzView);

  const h1 = document.querySelector(".topbar-intro h1");
  if (h1) h1.textContent = isFinanzView ? "Cert Expert Kosten" : "Mein Tag";

  document.querySelectorAll(".side-link[data-view]").forEach((el) => {
    const v = el.dataset.view;
    if (v === "finance") {
      el.classList.toggle("is-active", isFinanzView);
    } else {
      el.classList.toggle(
        "is-active",
        view === "day" && el.dataset.scroll === (scrollId || "pin-zone")
      );
    }
  });

  if (isFinanzView) {
    Promise.all([loadFinance(true), loadIncome(true)])
      .then(() => {
        setFinanceTab(financeTab);
        setStatus("Finanzdaten geladen.");
      })
      .catch((e) => setStatus(e.message, true));
  } else {
    financeEditMode = false;
    incomeEditMode = false;
  }
}

async function init() {
  showFileWarning();

  $("#btn-rebuild")?.addEventListener("click", async () => {
    await withBusy(async () => {
      try {
        setStatus("Baue Daten neu …");
        await api("/api/rebuild");
        await refreshAll();
        setStatus("Aktualisiert.");
      } catch (e) {
        setStatus(e.message, true);
      }
    });
  });

  $("#btn-jump-auswahl")?.addEventListener("click", () => {
    setView("day", "auswahl-zone");
    document.getElementById("auswahl-zone")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.querySelectorAll(".side-link[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view || "day";
      const scrollId = btn.dataset.scroll;
      if (view === "finance") financeTab = "overview";
      setView(view, scrollId || (view === "day" ? "pin-zone" : null));
      if (scrollId && view === "day") {
        document.getElementById(scrollId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  document.querySelectorAll("[data-finance-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.financeTab || "overview";
      if (financeState && incomeState) {
        setFinanceTab(tab);
      } else {
        Promise.all([loadFinance(true), loadIncome(true)])
          .then(() => setFinanceTab(tab))
          .catch((e) => setStatus(e.message, true));
      }
    });
  });

  $("#btn-finance-edit")?.addEventListener("click", () => {
    financeEditMode = true;
    renderFinance();
    setStatus("Bearbeitungsmodus — alle Zeilen änderbar.");
  });

  $("#btn-finance-cancel-edit")?.addEventListener("click", async () => {
    financeEditMode = false;
    await loadFinance(true);
    renderFinance();
    setStatus("Bearbeitung abgebrochen.");
  });

  $("#btn-finance-save-all")?.addEventListener("click", () => onFinanceSaveAll());

  $("#btn-income-edit")?.addEventListener("click", () => {
    incomeEditMode = true;
    renderIncome();
    setStatus("Bearbeitungsmodus — alle Zeilen änderbar.");
  });

  $("#btn-income-cancel-edit")?.addEventListener("click", async () => {
    incomeEditMode = false;
    await loadIncome(true);
    renderIncome();
    setStatus("Bearbeitung abgebrochen.");
  });

  $("#btn-income-save-all")?.addEventListener("click", () => onIncomeSaveAll());

  $("#income-add-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (incomeEditMode) {
      setStatus("Zuerst „Fertig“ oder „Abbrechen“ im Bearbeitungsmodus.", true);
      return;
    }
    const form = e.target;
    await withBusy(async () => {
      try {
        setStatus("Speichere Einnahme …");
        const r = await api("/api/finance/income/add", {
          kunde: form.kunde.value,
          amount: form.amount.value,
          status: form.status.value,
          hq_ref: form.hq_ref.value,
          is_estimate: form.is_estimate.checked,
        });
        incomeState = r;
        if (state) state.finance_income = r;
        if (financeTab === "overview") renderFinanceHubOverview();
        else renderIncome();
        form.reset();
        setStatus("Gespeichert — Datei aktualisiert.");
      } catch (err) {
        setStatus(err.message, true);
      }
    });
  });

  $("#finance-add-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (financeEditMode) {
      setStatus("Zuerst „Fertig“ oder „Abbrechen“ im Bearbeitungsmodus.", true);
      return;
    }
    const form = e.target;
    await withBusy(async () => {
      try {
        setStatus("Speichere in Finanz_Arbeitsgrundlage …");
        const payload = {
          posten: form.posten.value,
          kategorie: form.kategorie?.value || "Tools",
          anbieter: form.anbieter.value,
          amount: form.amount.value,
          note: form.note.value,
        };
        const r = await api("/api/finance/add", payload);
        financeState = r;
        if (state) state.finance = r;
        if (financeTab === "overview") renderFinanceHubOverview();
        else renderFinance();
        form.reset();
        setStatus("Gespeichert — Datei aktualisiert.");
      } catch (err) {
        setStatus(err.message, true);
      }
    });
  });

  try {
    setStatus("Lade Dashboard …");
    await loadData();
    await Promise.all([
      loadFinance(true).catch(() => null),
      loadIncome(true).catch(() => null),
    ]);
    render();
    setStatus("Bereit.");
  } catch (e) {
    setStatus(e.message, true);
  }
}

init();
