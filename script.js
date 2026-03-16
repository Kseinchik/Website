const statValues = document.querySelectorAll(".stat-value[data-target]");

function animateStat(el, duration = 1400) {
  const end = Number(el.dataset.target || 0);
  const suffix = el.dataset.suffix || "";
  if (!Number.isFinite(end) || end < 1) return;

  const start = 1;
  const startTime = performance.now();

  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);
    el.textContent = `${current}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  el.textContent = `${start}${suffix}`;
  requestAnimationFrame(frame);
}

function initStatCounters() {
  if (!statValues.length) return;

  const run = () => {
    statValues.forEach((el, index) => {
      if (el.dataset.counted === "true") return;
      el.dataset.counted = "true";
      animateStat(el, 1200 + index * 180);
    });
  };

  if (!("IntersectionObserver" in window)) {
    run();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run();
        observer.disconnect();
      });
    },
    { threshold: 0.4 },
  );

  observer.observe(statValues[0]);
}

initStatCounters();

function initMindsetSection() {
  const mindsetMapEl = document.querySelector(".mindset-map");
  const titleEl = document.getElementById("mindset-title");
  const descEl = document.getElementById("mindset-description");
  const achEl = document.getElementById("mindset-achievement");

  if (!mindsetMapEl || !titleEl || !descEl || !achEl) return;

  const mindsetData = {
    entj: {
      titleHtml:
        'ENTJ-A: Assertive Commander <a class="mindset-footnote" href="https://www.16personalities.com/" target="_blank" rel="noopener noreferrer">[1]</a>',
      description:
        "Commanders are bold, imaginative, and strong-willed, always finding a way - or making one. These decisive types love momentum and accomplishment, often acting on their creative visions. People with this type bring a lot of desirable skills to the table, including excellent leadership and communication skills, a hard-working attitude, and an ability to plan for the future.",
      detailHtml: "<strong>Weakness:</strong> Impatience, Bluntness, Overcommitment, Overconfidence",
    },
    pmm: {
      title: "Vision and launch execution.",
      description:
        "ENTJs excel in visionary planning and decisive execution, making them ideal for defining product positioning and leading launches.",
      detail:
        "Achievement: Repositioning graphic editor on CIS market leading to 8% sales increase and 10x increase in free version download.",
      mitigation:
        "Weakness mitigation: To avoid bluntness, and deliver feedback that was both diplomatic and persuasive I leveraged cultural intelligence and active listening.",
    },
    mi: {
      title: "Data into foresight.",
      description:
        "ENTJ-As thrive in synthesizing vast data into actionable foresight, enabling intelligence teams to outthink competitors on trends and risk.",
      detail:
        "Achievement: Contributed to market share growth by creating comprehensive competitive analysis that uncovered weak spots and offset opportunities.",
      mitigation:
        "Weakness mitigation: To mitigate overconfidence, I adopted a 'devil's advocate' approach, examining the problem from opposing perspectives and bouncing my assumptions off colleagues to gain a broader point of view.",
    },
    strategy: {
      title: "Long-horizon prioritization.",
      description:
        "ENTJs own the corporate chessboard, architecting long-term plays that seize market share through clear and disciplined prioritization.",
      detail:
        "Achievement: Supported 2035 vision development, helping shift a client from product-based toward consulting-based value.",
      mitigation:
        "Weakness mitigation: To mitigate impatience I practiced proactive problem solving via regular meetings to follow the progress and address any possible road blockers in advance.",
    },
    ar: {
      title: "Narrative influence and positioning.",
      description:
        "ENTJ-A traits align with analyst relations by shaping narrative, influencing third-party opinion leaders, and sharpening strategic positioning.",
      detail:
        "Achievement: Repositioned a global BPO from standard provider to digital leader, contributing to 24% digital services revenue growth.",
      mitigation:
        'Weakness mitigation: To avoid overcommitting I focused on the "North Star" and checked whether any ideas I had would move the company closer to strategic goals.',
    },
  };

  const keyMap = {
    entj: "entj",
    pmm: "pmm",
    mi: "mi",
    ar: "ar",
    strategy: "strategy",
    str: "strategy",
  };

  const nodes = mindsetMapEl.querySelectorAll(".node");
  const targets = mindsetMapEl.querySelectorAll("[data-key]");

  function setMindset(key) {
    const data = mindsetData[key];
    if (!data) return;

    titleEl.innerHTML = data.titleHtml || data.title || "";
    descEl.textContent = data.description || "";

    if (data.detailHtml) {
      achEl.innerHTML = data.detailHtml;
    } else {
      const detail = data.detail || "";
      const mitigation = data.mitigation || "";
      const detailHtml = detail.replace(/^Achievement:/, "<strong>Achievement:</strong>");
      const mitigationHtml = mitigation.replace(
        /^Weakness mitigation:/,
        "<strong>Weakness mitigation:</strong>",
      );
      achEl.innerHTML = mitigationHtml ? `${detailHtml}<br/>${mitigationHtml}` : detailHtml;
    }

    nodes.forEach((node) => {
      node.classList.toggle("active", key !== "entj" && node.dataset.key === key);
    });
  }

  function handleSelection(target) {
    if (!(target instanceof HTMLElement)) return;
    const key = keyMap[String(target.dataset.key || "").toLowerCase()];
    if (!key) return;

    setMindset(key);
  }

  targets.forEach((target) => {
    target.addEventListener("click", () => handleSelection(target));
    target.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      handleSelection(target);
    });
  });

  setMindset("entj");
}

initMindsetSection();


function spinSegmentOnce(element, className) {
  return new Promise((resolve) => {
    if (!element) {
      resolve();
      return;
    }

    const finish = () => {
      element.classList.remove(className);
      resolve();
    };

    element.addEventListener(
      "animationend",
      () => {
        finish();
      },
      { once: true },
    );

    element.classList.remove("spin-cw", "spin-ccw");

    // Force reflow so repeated clicks always retrigger animation.
    void element.getBoundingClientRect();
    element.classList.add(className);
  });
}

function initSignalCycleMotion() {
  const miTrigger = document.getElementById("cycle-mi-trigger");
  const arSeg = document.getElementById("cycle-seg-ar");
  const strategySeg = document.getElementById("cycle-seg-strategy");
  const pmmSeg = document.getElementById("cycle-seg-pmm");
  const stageImage = document.getElementById("cycle-stage-image");
  const cycleDefaultWindow = document.getElementById("cycle-default-window");
  const cycleDefaultTitle = document.getElementById("cycle-default-title");
  const cycleGraphExample = document.getElementById("cycle-graph-example");

  if (!miTrigger || !arSeg || !strategySeg || !pmmSeg) return;

  const stageSrcs = ["./1.png", "./2.png", "./3.png", "./4.png"];
  stageSrcs.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  function setCycleImage(stageIndex) {
    if (!stageImage) return;
    const nextSrc = stageSrcs[stageIndex - 1];
    if (!nextSrc) return;

    stageImage.classList.add("is-fading");
    window.setTimeout(() => {
      stageImage.src = nextSrc;
      stageImage.alt = "Cycle stage " + String(stageIndex);
      stageImage.classList.remove("is-fading");
    }, 120);
  }

  function setCycleInfo(state) {
    if (!cycleDefaultWindow || !cycleDefaultTitle || !cycleGraphExample) return;

    cycleDefaultWindow.classList.remove("is-mi", "is-ar", "is-strategy", "is-pmm");
    cycleGraphExample.classList.remove("is-mi", "is-ar", "is-strategy", "is-pmm");

    if (state === "ar") {
      cycleDefaultWindow.classList.add("is-ar");
      cycleGraphExample.classList.add("is-ar");
      cycleDefaultTitle.textContent = "AR validates the signal with expert.";
      cycleGraphExample.innerHTML =
        "<strong>Example:</strong> Verified the market potential for semi-professional photo-editor with reports issued by IDC and local industry analysts.";
      return;
    }

    if (state === "strategy") {
      cycleDefaultWindow.classList.add("is-strategy");
      cycleGraphExample.classList.add("is-strategy");
      cycleDefaultTitle.textContent = "Strategist decides how to bet on that signal:";
      cycleGraphExample.innerHTML =
        "<strong>Example:</strong> Strategy was re-evaluated and changes to the website, product, and channels were proposed.";
      return;
    }

    if (state === "pmm") {
      cycleDefaultWindow.classList.add("is-pmm");
      cycleGraphExample.classList.add("is-pmm");
      cycleDefaultTitle.textContent = "PMM turns those signals in the story that sells.";
      cycleGraphExample.innerHTML =
        '<strong>Example:</strong> Changes were made to website, product and channels that led to 8% sales increase and 10x first time downloads. <a href="./case-studies.html?case=zoner">Read more</a>.';
      return;
    }

    cycleDefaultWindow.classList.add("is-mi");
    cycleGraphExample.classList.add("is-mi");
    cycleDefaultTitle.textContent = "MI finds the signals in the noise.";
    cycleGraphExample.innerHTML =
      "<strong>Example:</strong> Udentified the gap between global positioning and user perception in CIS markets for sem-professional photo editor.";
  }

  setCycleImage(1);
  setCycleInfo("mi");

  let isRunning = false;

  miTrigger.addEventListener("click", async () => {
    if (isRunning) return;

    isRunning = true;
    miTrigger.disabled = true;

    setCycleInfo("ar");
    setCycleImage(2);
    await spinSegmentOnce(arSeg, "spin-cw");

    setCycleInfo("strategy");
    setCycleImage(3);
    await spinSegmentOnce(strategySeg, "spin-ccw");

    setCycleInfo("pmm");
    setCycleImage(4);
    await spinSegmentOnce(pmmSeg, "spin-cw");

    miTrigger.disabled = false;
    isRunning = false;
  });
}

initSignalCycleMotion();

function initComparisonTable() {
  const compareCells = document.querySelectorAll(".compare-cell");
  if (!compareCells.length) return;

  compareCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const isOpen = cell.getAttribute("aria-expanded") === "true";
      cell.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });
  });
}

initComparisonTable();

function initAiLabSection() {
  const boardEl = document.getElementById("ai-lab-board");
  const orbEl = document.getElementById("ai-lab-rail-orb");
  const railEl = boardEl ? boardEl.querySelector(".ai-lab-rail") : null;
  const cards = document.querySelectorAll("[data-ai-lab-card]");
  const detailEl = document.getElementById("ai-lab-detail");
  const titleEl = document.getElementById("ai-lab-detail-title");
  const bodyEl = document.getElementById("ai-lab-detail-body");
  const kickerEl = document.getElementById("ai-lab-detail-kicker");
  const statusEl = document.getElementById("ai-lab-detail-status");

  if (!boardEl || !orbEl || !railEl || !cards.length || !detailEl || !titleEl || !bodyEl || !kickerEl || !statusEl) return;

  const cardData = {
    ar: {
      kicker: "AI Lab tool",
      title: "Analyst Relations Maturity Assessment",
      status: "Waiting to be published",
      body:
        "This simple tool allows any company to evaluate its maturity when it comes to the analyst relations function. It provides current-level visibility together with recommendations for moving to the next stage of maturity.",
    },
    competition: {
      kicker: "AI Lab system",
      title: "Competition Analysis",
      status: "In development",
      body:
        "Different departments analyse competition differently. For example, information about hiring trends is important for strategy, but less so for marketing or analyst relations. I am currently working on a tool that would be a single point of truth.",
    },
    creative: {
      kicker: "AI Lab creative",
      title: "Creative AI",
      status: "In development",
      body:
        'This is an outlet for my creative side. Sometimes I lean towards Bosch, sometimes its Van Gogh, on peaceful days it\'s Monet stylised AI pictures, short clips, visuals. Why it is important: Logical part of me focuses on "what is," but creativity asks "what if," challenging assumptions and revealing unseen opportunities in planning, such as unconventional market entry or problem-solving.',
    },
    dystopian: {
      kicker: "AI Lab experiment",
      title: "Dystopian AI World",
      status: "In development",
      body:
        "What will happen if we give full freedom to AI characters in a certain set-up? Will they turn the world for the better, or will they intensify the existing conflict? This is my personal curiosity inspired by many dystopian novels I admire. All context, visuals, and behaviour are AI-generated, with me acting as the operator who provides the initial input.",
    },
  };

  let activeKey = "";

  function clearActiveCard() {
    cards.forEach((card) => {
      card.classList.remove("active");
      card.setAttribute("aria-pressed", "false");
    });

    detailEl.classList.add("is-hidden");
    activeKey = "";
    requestOrbUpdate();
  }

  function setActiveCard(key) {
    const next = cardData[key];
    if (!next) return;

    cards.forEach((card) => {
      const isActive = card.dataset.key === key;
      card.classList.toggle("active", isActive);
      card.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    const activeCard = Array.from(cards).find((card) => card.dataset.key === key);
    if (activeCard) {
      activeCard.insertAdjacentElement("afterend", detailEl);
    }

    kickerEl.textContent = next.kicker;
    titleEl.textContent = next.title;
    statusEl.textContent = next.status;
    bodyEl.textContent = next.body;
    detailEl.classList.remove("is-hidden");
    activeKey = key;

    requestOrbUpdate();
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const key = String(card.dataset.key || "");
      if (key === activeKey) {
        clearActiveCard();
        return;
      }

      setActiveCard(key);
    });
  });

  let ticking = false;

  function updateOrbPosition() {
    ticking = false;

    const railRect = railEl.getBoundingClientRect();
    const cardRects = Array.from(cards).map((card) => card.getBoundingClientRect());
    const viewportHeight = window.innerHeight || 1;
    const viewportCenter = viewportHeight / 2;
    const topRowCenter =
      (cardRects[0].top + cardRects[0].height / 2 + cardRects[2].top + cardRects[2].height / 2) / 2;
    const bottomRowCenter =
      (cardRects[1].top + cardRects[1].height / 2 + cardRects[3].top + cardRects[3].height / 2) / 2;
    const startY = topRowCenter - railRect.top - orbEl.offsetHeight / 2;
    const endY = bottomRowCenter - railRect.top - orbEl.offsetHeight / 2;
    const topDistance = Math.abs(viewportCenter - topRowCenter);
    const bottomDistance = Math.abs(viewportCenter - bottomRowCenter);
    const translateY = bottomDistance < topDistance ? endY : startY;

    const boundedY = Math.min(Math.max(translateY, 0), Math.max(railRect.height - orbEl.offsetHeight, 0));

    orbEl.style.transform = `translate(-50%, ${boundedY}px)`;
  }

  function requestOrbUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateOrbPosition);
  }

  window.addEventListener("scroll", requestOrbUpdate, { passive: true });
  window.addEventListener("resize", requestOrbUpdate);

  clearActiveCard();
  updateOrbPosition();
}

initAiLabSection();

function initCaseStudiesSection() {
  const triggers = document.querySelectorAll("[data-case-study]");
  const templates = document.querySelectorAll("template[data-case-study-detail]");
  const detailStage = document.getElementById("case-study-detail-stage");
  const detailPanel = document.getElementById("case-study-detail-panel");

  if (!triggers.length || !templates.length || !detailStage || !detailPanel) return;

  function setOpenCase(key) {
    triggers.forEach((trigger) => {
      const isOpen = trigger.dataset.caseStudy === key;
      trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      trigger.classList.toggle("is-open", isOpen);
    });

    detailPanel.innerHTML = "";

    if (!key) {
      detailStage.hidden = true;
      detailStage.classList.add("is-hidden");
      return;
    }

    const template = Array.from(templates).find((entry) => entry.dataset.caseStudyDetail === key);
    if (!template) {
      detailStage.hidden = true;
      detailStage.classList.add("is-hidden");
      return;
    }

    detailPanel.appendChild(template.content.cloneNode(true));
    detailStage.hidden = false;
    detailStage.classList.remove("is-hidden");
  }

  function getInitialCaseKey() {
    const url = new URL(window.location.href);
    const queryKey = url.searchParams.get("case");
    if (queryKey) return queryKey;

    const hashKey = window.location.hash.replace(/^#/, "");
    return hashKey || "";
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const key = String(trigger.dataset.caseStudy || "");
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      setOpenCase(isOpen ? "" : key);
    });
  });

  const initialKey = getInitialCaseKey();
  const hasInitialMatch = Array.from(triggers).some((trigger) => trigger.dataset.caseStudy === initialKey);

  setOpenCase(hasInitialMatch ? initialKey : "");

  if (hasInitialMatch) {
    window.requestAnimationFrame(() => {
      detailStage.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }
}

initCaseStudiesSection();

