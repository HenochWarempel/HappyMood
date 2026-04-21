(() => {
  const PANEL_ID = "hsc-panel";
  const LABEL_CLASS = "hsc-label";
  const HIGHLIGHT_CLASS = "hsc-highlight";
  const ISSUE_ATTR = "data-hsc-issue";

  const LEVEL_COLORS = {
    H1: "#6366f1",
    H2: "#0ea5e9",
    H3: "#10b981",
    H4: "#f59e0b",
    H5: "#f97316",
    H6: "#ef4444",
  };

  let active = false;

  function getHeadings() {
    return Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).filter(
      (el) => !el.closest(`#${PANEL_ID}`)
    );
  }

  function analyzeHeadings(headings) {
    const issues = [];
    let firstHeadingLevel = null;
    let prevLevel = 0;
    const levelCounts = { H1: 0, H2: 0, H3: 0, H4: 0, H5: 0, H6: 0 };
    const headingData = [];

    headings.forEach((el, index) => {
      const tag = el.tagName.toUpperCase();
      const level = parseInt(tag[1]);
      const text = el.textContent.trim();
      const elementIssues = [];

      levelCounts[tag]++;

      if (text === "") {
        elementIssues.push("Lege heading");
      }

      if (firstHeadingLevel === null) {
        firstHeadingLevel = level;
        if (level !== 1) {
          issues.push({
            type: "warning",
            msg: `Pagina begint met <${tag}> — verwacht <H1> als eerste heading`,
            el,
            index,
          });
          elementIssues.push("Eerste heading is geen H1");
        }
      } else if (level > prevLevel + 1) {
        const skipped = [];
        for (let s = prevLevel + 1; s < level; s++) skipped.push(`H${s}`);
        issues.push({
          type: "error",
          msg: `Niveau overgeslagen: van H${prevLevel} naar <${tag}> (${skipped.join(", ")} ontbreekt)`,
          el,
          index,
        });
        elementIssues.push(`Overslaat ${skipped.join(", ")}`);
      }

      if (text === "") {
        issues.push({
          type: "error",
          msg: `Lege <${tag}> (positie ${index + 1})`,
          el,
          index,
        });
      }

      prevLevel = level;
      headingData.push({ el, tag, level, text, index, issues: elementIssues });
    });

    if (levelCounts["H1"] === 0) {
      issues.unshift({ type: "error", msg: "Geen H1 gevonden op deze pagina", el: null, index: -1 });
    } else if (levelCounts["H1"] > 1) {
      issues.push({
        type: "warning",
        msg: `Meerdere H1's gevonden (${levelCounts["H1"]}x) — idealiter slechts 1 per pagina`,
        el: null,
        index: -1,
      });
    }

    return { issues, headingData, levelCounts };
  }

  function buildTree(headingData) {
    let html = '<ul class="hsc-tree">';
    headingData.forEach(({ tag, level, text, index, issues }) => {
      const color = LEVEL_COLORS[tag];
      const hasIssue = issues.length > 0;
      const issueTitle = issues.join(" · ");
      html += `
        <li class="hsc-tree-item hsc-level-${level}${hasIssue ? " hsc-tree-issue" : ""}"
            data-hsc-index="${index}"
            title="${hasIssue ? issueTitle : ""}"
            style="--hsc-color:${color}">
          <span class="hsc-tree-tag" style="background:${color}">${tag}</span>
          <span class="hsc-tree-text">${text || "<leeg>"}</span>
          ${hasIssue ? '<span class="hsc-tree-warn">⚠</span>' : ""}
        </li>`;
    });
    html += "</ul>";
    return html;
  }

  function buildIssueList(issues) {
    if (issues.length === 0) {
      return '<p class="hsc-no-issues">✓ Geen problemen gevonden</p>';
    }
    return (
      '<ul class="hsc-issues">' +
      issues
        .map(
          (iss) =>
            `<li class="hsc-issue hsc-issue-${iss.type}" data-hsc-index="${iss.index}">
              <span class="hsc-issue-icon">${iss.type === "error" ? "✕" : "⚠"}</span>
              ${iss.msg}
            </li>`
        )
        .join("") +
      "</ul>"
    );
  }

  function buildPanel(headings) {
    const { issues, headingData, levelCounts } = analyzeHeadings(headings);
    const totalHeadings = headings.length;
    const errorCount = issues.filter((i) => i.type === "error").length;
    const warnCount = issues.filter((i) => i.type === "warning").length;

    const statsHtml = Object.entries(levelCounts)
      .map(
        ([tag, count]) =>
          `<span class="hsc-stat${count === 0 ? " hsc-stat-zero" : ""}" style="--hsc-color:${LEVEL_COLORS[tag]}">
            ${tag} <strong>${count}</strong>
          </span>`
      )
      .join("");

    const panel = document.createElement("div");
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="hsc-header">
        <div class="hsc-header-left">
          <span class="hsc-logo">H</span>
          <span class="hsc-title">H-Structuur Checker</span>
          <div class="hsc-badges">
            ${errorCount > 0 ? `<span class="hsc-badge hsc-badge-error">${errorCount} fout${errorCount !== 1 ? "en" : ""}</span>` : ""}
            ${warnCount > 0 ? `<span class="hsc-badge hsc-badge-warn">${warnCount} waarschuwing${warnCount !== 1 ? "en" : ""}</span>` : ""}
            ${errorCount === 0 && warnCount === 0 ? '<span class="hsc-badge hsc-badge-ok">Alles OK</span>' : ""}
          </div>
        </div>
        <div class="hsc-header-right">
          <button class="hsc-btn" id="hsc-copy" title="Kopieer structuur">⎘ Kopieer</button>
          <button class="hsc-btn" id="hsc-minimize" title="Minimaliseren">−</button>
          <button class="hsc-btn hsc-btn-close" id="hsc-close" title="Sluiten">✕</button>
        </div>
      </div>
      <div class="hsc-body" id="hsc-body">
        <div class="hsc-stats">${statsHtml}</div>
        <div class="hsc-columns">
          <div class="hsc-col">
            <div class="hsc-col-header">Problemen <span class="hsc-col-count">${issues.length}</span></div>
            <div class="hsc-col-content">${buildIssueList(issues)}</div>
          </div>
          <div class="hsc-col hsc-col-tree">
            <div class="hsc-col-header">Heading-structuur <span class="hsc-col-count">${totalHeadings}</span></div>
            <div class="hsc-col-content">${buildTree(headingData)}</div>
          </div>
        </div>
      </div>
    `;
    return { panel, headingData, issues };
  }

  function addLabels(headingData) {
    headingData.forEach(({ el, tag, issues }) => {
      const color = LEVEL_COLORS[tag];
      const hasIssue = issues.length > 0;
      const label = document.createElement("span");
      label.className = `${LABEL_CLASS}${hasIssue ? " hsc-label-issue" : ""}`;
      label.textContent = tag;
      label.style.setProperty("--hsc-color", color);
      label.title = hasIssue ? issues.join(" · ") : tag;
      el.setAttribute(ISSUE_ATTR, hasIssue ? "true" : "false");

      const wrapper = document.createElement("span");
      wrapper.className = "hsc-wrapper";
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
      wrapper.appendChild(label);
    });
  }

  function removeLabels() {
    document.querySelectorAll(".hsc-wrapper").forEach((wrapper) => {
      const heading = wrapper.querySelector("h1,h2,h3,h4,h5,h6");
      if (heading) {
        wrapper.parentNode.insertBefore(heading, wrapper);
        heading.removeAttribute(ISSUE_ATTR);
      }
      wrapper.remove();
    });
    document.querySelectorAll(`.${LABEL_CLASS}`).forEach((el) => el.remove());
  }

  function scrollToHeading(index) {
    const headings = getHeadings();
    const target = headings[index];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add(HIGHLIGHT_CLASS);
      setTimeout(() => target.classList.remove(HIGHLIGHT_CLASS), 2000);
    }
  }

  function copyStructure(headingData) {
    const lines = headingData.map(({ tag, level, text }) => {
      const indent = "  ".repeat(level - 1);
      return `${indent}[${tag}] ${text || "<leeg>"}`;
    });
    const text = `H-Structuur — ${document.title}\n${"─".repeat(40)}\n${lines.join("\n")}`;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById("hsc-copy");
      if (btn) {
        btn.textContent = "✓ Gekopieerd";
        setTimeout(() => (btn.textContent = "⎘ Kopieer"), 2000);
      }
    });
  }

  function activate() {
    if (document.getElementById(PANEL_ID)) return;
    const headings = getHeadings();
    const { panel, headingData } = buildPanel(headings);

    document.body.prepend(panel);
    addLabels(headingData);

    let minimized = false;
    const body = document.getElementById("hsc-body");

    document.getElementById("hsc-minimize").addEventListener("click", () => {
      minimized = !minimized;
      body.style.display = minimized ? "none" : "";
      document.getElementById("hsc-minimize").textContent = minimized ? "+" : "−";
    });

    document.getElementById("hsc-close").addEventListener("click", deactivate);

    document.getElementById("hsc-copy").addEventListener("click", () =>
      copyStructure(headingData)
    );

    panel.addEventListener("click", (e) => {
      const item = e.target.closest("[data-hsc-index]");
      if (item) {
        const idx = parseInt(item.dataset.hscIndex);
        if (idx >= 0) scrollToHeading(idx);
      }
    });

    active = true;
  }

  function deactivate() {
    const panel = document.getElementById(PANEL_ID);
    if (panel) panel.remove();
    removeLabels();
    active = false;
  }

  function toggle() {
    active ? deactivate() : activate();
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "toggle") toggle();
    if (msg.action === "activate") activate();
    if (msg.action === "deactivate") deactivate();
    if (msg.action === "getState") return Promise.resolve({ active });
  });
})();
