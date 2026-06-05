/**
 * Cert-Expert Command Center — HTML Dashboard V2
 * localStorage only — no Markdown sync
 */

(function () {
  "use strict";

  const STORAGE_PREFIX = "cert-expert-cc-v1";
  const CHECKBOX_KEY = `${STORAGE_PREFIX}:checkboxes`;
  const QUICK_CAPTURE_KEY = `${STORAGE_PREFIX}:quick-capture`;

  function loadCheckboxStates() {
    try {
      const raw = localStorage.getItem(CHECKBOX_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function saveCheckboxStates(states) {
    localStorage.setItem(CHECKBOX_KEY, JSON.stringify(states));
  }

  function updateTodayStats() {
    const todayTasks = document.querySelectorAll(
      '[data-today-task="true"] input[type="checkbox"]'
    );
    let open = 0;
    let done = 0;
    let criticalOpen = 0;

    todayTasks.forEach((box) => {
      const label = box.closest("[data-today-task]");
      const isCritical = label && label.dataset.todayCritical === "true";
      if (box.checked) {
        done += 1;
      } else {
        open += 1;
        if (isCritical) criticalOpen += 1;
      }
    });

    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val);
    };

    setText("stat-today-open", open);
    setText("stat-today-done", done);
    setText("pill-today-open", open);
    setText("pill-today-done", done);
    setText("pill-today-critical", criticalOpen);
  }

  function updateKanbanStats(card) {
    const countOpen = (selector) => {
      let n = 0;
      card.querySelectorAll(selector).forEach((box) => {
        if (!box.checked) {
          const text = box.closest(".task-item")?.querySelector("span")?.textContent?.trim();
          if (text && text !== "(leer)") n += 1;
        }
      });
      return n;
    };

    const offen = countOpen(".kanban-col--open input[type='checkbox']");
    const wartet = countOpen(".kanban-col--wait input[type='checkbox']");
    const intern = countOpen(".kanban-col--intern input[type='checkbox']");

    const setStat = (name, val) => {
      const el = card.querySelector(`[data-stat="${name}"]`);
      if (el) el.textContent = String(val);
    };

    setStat("offen", offen + wartet + intern);
    setStat("wartet", wartet);
    setStat("intern", intern);

    const countEl = (col, val) => {
      const el = col?.querySelector(".kanban-col__count");
      if (el) el.textContent = String(val);
    };

    countEl(card.querySelector(".kanban-col--open"), offen);
    countEl(card.querySelector(".kanban-col--wait"), wartet);
    countEl(card.querySelector(".kanban-col--intern"), intern);
  }

  function updateAllKanbanStats() {
    document.querySelectorAll(".kanban-card").forEach(updateKanbanStats);
  }

  function initCheckboxes() {
    const states = loadCheckboxStates();
    const boxes = document.querySelectorAll('input[type="checkbox"][data-task-id]');

    boxes.forEach((box) => {
      const id = box.dataset.taskId;
      if (Object.prototype.hasOwnProperty.call(states, id)) {
        box.checked = states[id];
      }
      box.addEventListener("change", () => {
        states[id] = box.checked;
        saveCheckboxStates(states);
        updateTodayStats();
        const card = box.closest(".kanban-card");
        if (card) updateKanbanStats(card);
      });
    });

    updateTodayStats();
    updateAllKanbanStats();
  }

  function initQuickCapture() {
    const textarea = document.getElementById("quick-capture-text");
    if (!textarea) return;

    const saved = localStorage.getItem(QUICK_CAPTURE_KEY);
    if (saved !== null) {
      textarea.value = saved;
    }

    let timer;
    textarea.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.setItem(QUICK_CAPTURE_KEY, textarea.value);
      }, 300);
    });
  }

  function setActiveFilter(btn) {
    document.querySelectorAll(".topbar__actions .btn").forEach((b) => {
      b.classList.toggle("is-active", b === btn);
    });
  }

  function initFilters() {
    const btnAll = document.getElementById("btn-show-all");
    const btnCritical = document.getElementById("btn-critical-only");
    const btnHighlight = document.getElementById("btn-highlight-open");

    if (btnAll) {
      btnAll.addEventListener("click", () => {
        document.body.classList.remove("filter-critical", "filter-open", "highlight-open");
        setActiveFilter(btnAll);
      });
      setActiveFilter(btnAll);
    }

    if (btnCritical) {
      btnCritical.addEventListener("click", () => {
        document.body.classList.remove("filter-open", "highlight-open");
        document.body.classList.add("filter-critical");
        setActiveFilter(btnCritical);
      });
    }

    if (btnHighlight) {
      btnHighlight.addEventListener("click", () => {
        document.body.classList.remove("filter-critical", "filter-open");
        const enabling = !document.body.classList.contains("highlight-open");
        document.body.classList.toggle("highlight-open");
        if (enabling) {
          setActiveFilter(btnHighlight);
        } else if (btnAll) {
          setActiveFilter(btnAll);
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initCheckboxes();
    initQuickCapture();
    initFilters();
  });
})();
