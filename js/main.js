/* =====================================================================
   KASHTI EDUCARE · main.js
   Renders everything listed in data.js and wires up the interactive
   pieces: desk calendar, 3-step planner, catalogue + detail view,
   gallery lightbox, partner tabs, enquiry form, cookie consent.
   ===================================================================== */
(function () {
  "use strict";
  const D = window.KASHTI;
  if (!D) return;

  /* ---------- helpers ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const icon = (n) => `<svg class="icon" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const src = (p) => (p && (/^https?:/.test(p) || !p.startsWith("/")) ? p : D.config.img + p); /* "images/x.jpg" = local file, "/images/x.jpg" = live site */
  const img = (p, alt, eager) => `<img src="${esc(src(p))}" alt="${esc(alt)}" ${eager ? "" : 'loading="lazy"'} decoding="async">`;
  const fitImgs = (p, alt) => `<img class="ph-fill" src="${esc(src(p))}" alt="" aria-hidden="true" loading="lazy" decoding="async"><img class="ph-img" src="${esc(src(p))}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
  const ph = (p, alt, color, cls = "") => `<div class="ph ph-fit ${cls}" data-label="${esc(alt)}" style="--c:${color || "#0F3E9E"}">${fitImgs(p, alt)}</div>`;
  const slug = (s) => s.toLowerCase().replace(/&/g, "and").replace(/\(.*?\)/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const params = new URLSearchParams(location.search);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };

  const THEMES = Object.fromEntries(D.themes.map((t) => [t.id, t]));
  const AUD = { school: "School", he: "Higher Education" };
  D.programmes.forEach((p) => { p.id = slug(p.name) + "-" + p.aud; });
  const PROG = Object.fromEntries(D.programmes.map((p) => [p.id, p]));
  const primaryTheme = (p) => THEMES[p.themes[0]] || { name: p.group || "Higher Education", color: "#0F3E9E", icon: "cap", id: "" };
  const fmtChips = (p) => p.formats.map((f) => `<span class="fmt ${f}">${D.formatLabels[f]}</span>`).join("");
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const MON = MONTHS.map((m) => m.slice(0, 3));

  /* ---------- missing images degrade to a tinted placeholder ---------- */
  const markMissing = (im) => {
    const box = im.closest(".ph, .logo-tile, .portrait, .brand");
    if (box) box.classList.add("ph--missing");
  };
  document.addEventListener("error", (e) => { if (e.target && e.target.tagName === "IMG") markMissing(e.target); }, true);
  const sweepImages = (root = document) => $$("img", root).forEach((im) => { if (im.complete && im.naturalWidth === 0 && im.getAttribute("src")) markMissing(im); });

  /* ---------- header ---------- */
  const header = $(".site-header");
  const onScroll = () => header && header.classList.toggle("is-stuck", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const burger = $(".burger"), mnav = $("#mobile-nav");
  if (burger && mnav) {
    const place = () => {
      const top = Math.max(0, header.getBoundingClientRect().bottom);
      mnav.style.top = top + "px";
      mnav.style.maxHeight = `calc(100dvh - ${top}px)`;
    };
    window.addEventListener("scroll", () => { if (mnav.classList.contains("open")) place(); }, { passive: true });
    const set = (open) => {
      if (open) place();
      mnav.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      burger.innerHTML = icon(open ? "x" : "menu");
    };
    burger.addEventListener("click", () => set(!mnav.classList.contains("open")));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && mnav.classList.contains("open")) { set(false); burger.focus(); } });
    $$("a", mnav).forEach((a) => a.addEventListener("click", () => set(false)));
  }

  /* =====================================================================
     SIMPLE RENDERERS
     ===================================================================== */
  const R = {};

  R.featured = (el) => {
    const items = D.featured;
    let i = 0;
    const draw = () => {
      const f = items[i];
      el.innerHTML = `${ph(f.img, f.alt, "#1B3B7E")}
        <div class="fc-body"><span class="fc-kicker">${esc(f.kicker)}</span><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p>
        ${items.length > 1 ? `<div class="fc-dots" role="group" aria-label="Featured stories">${items.map((it, k) => `<button type="button" aria-label="${esc(it.title)}" aria-current="${k === i}" data-k="${k}"></button>`).join("")}</div>` : ""}</div>`;
      $$(".fc-dots button", el).forEach((b) => b.addEventListener("click", () => { i = +b.dataset.k; draw(); $(`.fc-dots button[data-k="${i}"]`, el).focus(); }));
      sweepImages(el);
    };
    draw();
  };

  R.notices = (el) => {
    el.innerHTML = D.notices.map((n, k) => {
      const d = new Date(n.date + "T00:00:00");
      return `<li><a class="notice${k === 0 ? " is-new" : ""}" href="${esc(n.href || "#")}">
        <time datetime="${n.date}"><b>${String(d.getDate()).padStart(2, "0")}</b><span>${MON[d.getMonth()]} ${String(d.getFullYear()).slice(2)}</span></time>
        <span><span class="n-tag">${esc(n.tag || "Update")}</span><span class="n-title">${esc(n.title)}</span></span></a></li>`;
    }).join("");
  };

  R.downloads = (el) => {
    el.innerHTML = D.downloads.map((d) => {
      const has = !!d.url;
      const href = has ? d.url : `mailto:${D.config.email}?subject=${encodeURIComponent("Request: " + d.title)}&body=${encodeURIComponent("Hello Kashti team,\n\nPlease send me the " + d.title + ".\n\nName:\nInstitution:\n")}`;
      return `<li><a href="${esc(href)}"${has ? " download" : ""}><span><span class="dl-t">${esc(d.title)}</span><span class="dl-m">${has ? esc(d.meta) : esc(d.meta) + " · request by email"}</span></span><span class="dl-i">${icon(has ? "download" : "mail")}</span></a></li>`;
    }).join("");
  };

  R.stats = (el) => {
    el.innerHTML = D.stats.map((s) => `<li style="--c:${s.c}"><span class="ic ic-sm" style="--c:${s.c}">${icon(s.icon)}</span><span class="num">${s.n}${s.suffix}</span><span class="lbl">${esc(s.label)}</span></li>`).join("");
  };

  R.values = (el) => {
    el.innerHTML = D.values.map((v) => `<article class="outcome"><span class="ic ic-sm">${icon(v.icon)}</span><div><h3>${esc(v.t)}</h3><p>${esc(v.d)}</p></div></article>`).join("");
  };
  R["values-cards"] = (el) => {
    const cs = ["#0F3E9E", "#0E8F86", "#C98A00"];
    el.innerHTML = D.values.map((v, k) => `<article class="icon-card"><span class="ic" style="--c:${cs[k % 3]}">${icon(v.icon)}</span><h3>${esc(v.t)}</h3><p>${esc(v.d)}</p></article>`).join("");
  };
  R.standfor = (el) => {
    el.innerHTML = D.standFor.map((v) => `<article class="icon-card"><span class="ic" style="--c:${v.c}">${icon(v.icon)}</span><h3>${esc(v.t)}</h3><p>${esc(v.d)}</p></article>`).join("");
  };

  R.council = (el) => {
    el.innerHTML = D.council.map((c) => `<article class="council-card" style="--c:${c.c}"><div class="cc-top"><span class="ic">${icon(c.icon)}</span></div><div class="cc-body"><h3>${esc(c.t)}</h3><p>${esc(c.d)}</p><span class="badge" style="--c:${c.c}">${esc(c.badge)}</span></div></article>`).join("");
  };

  R.expeditions = (el) => {
    el.innerHTML = D.expeditions.map((x) => {
      const t = THEMES[x.theme];
      return `<article class="exp-card" style="--c:${t.color}"><span class="ic">${icon(t.icon)}</span><time>${esc(x.when)}</time><h4>${esc(x.title)}</h4><p>${icon("pin")}${esc(x.where)}</p><a class="link-arrow" href="programs.html?p=${esc(x.id)}">About this programme ${icon("arrow")}</a></article>`;
    }).join("");
    const track = el;
    const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 14 : 240);
    const prev = $("[data-exp-prev]"), next = $("[data-exp-next]");
    prev && prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: reduced ? "auto" : "smooth" }));
    next && next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: reduced ? "auto" : "smooth" }));
  };

  const programmesFor = (themeId, aud) => D.programmes.filter((p) => p.themes.includes(themeId) && (aud === "all" || !aud || p.aud === aud));

  R.pathways = (el) => {
    const draw = (aud) => {
      el.innerHTML = D.themes.map((t) => {
        const n = programmesFor(t.id, aud).length;
        const href = `programs.html?theme=${t.id}${aud !== "all" ? `&audience=${aud}` : ""}#catalogue`;
        return `<article class="path-card" style="--c:${t.color}"${n === 0 ? " hidden" : ""}>
          <span class="pc-no" aria-hidden="true">${t.no}</span>
          <div class="pc-body">
            <span class="ic">${icon(t.icon)}</span>
            <h3><a class="pc-link" href="${href}">${esc(t.name)}</a></h3>
            <p class="pc-tag">${esc(t.tagline)}</p>
            <p class="pc-desc">${esc(t.offers.slice(0, 3).join(", "))} and more.</p>
            <span class="pc-aud">${n} programme${n === 1 ? "" : "s"} · ${esc(aud === "all" ? t.audience : AUD[aud])}</span>
          </div>
          <div class="pc-img ph ph-fit" data-label="${esc(t.imgAlt)}" style="--c:${t.color}">${fitImgs(t.img, t.imgAlt)}<span class="pc-go" aria-hidden="true">${icon("arrow")}</span></div>
        </article>`;
      }).join("");
      sweepImages(el);
    };
    draw("all");
    const tabs = $("[data-path-tabs]");
    if (tabs) {
      $$("button", tabs).forEach((b) => b.addEventListener("click", () => {
        $$("button", tabs).forEach((x) => x.setAttribute("aria-selected", String(x === b)));
        draw(b.dataset.aud);
      }));
    }
  };

  const CTA = { stem: "Explore STEM programmes", lead: "Explore leadership programmes", adv: "Explore experiences", career: "Explore industry & career programmes", uni: "Explore university programmes", culture: "Explore culture & wellness", global: "Explore global programmes", ent: "Explore entrepreneurship programmes" };
  R["theme-rows"] = (el) => {
    el.innerHTML = D.themes.map((t) => {
      const n = programmesFor(t.id).length;
      return `<article class="theme-row" id="theme-${t.id}" style="--c:${t.color}">
        <div class="tr-body">
          <div class="tr-top"><span class="ic">${icon(t.icon)}</span><span class="tr-no">${t.no} / 08</span></div>
          <h3>${esc(t.name)}</h3>
          <p class="tr-tag">${esc(t.tagline)}</p>
          <p>${esc(t.desc)}</p>
          <ul class="tr-offers">${t.offers.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>
          <div class="btn-row" style="align-items:center"><a class="btn btn-primary btn-sm" href="programs.html?theme=${t.id}#catalogue" data-theme-go="${t.id}">${CTA[t.id]} ${icon("arrow")}</a><span class="tr-count">${n} programmes in the catalogue</span></div>
        </div>
        <div class="tr-media"><span class="tr-aud">${esc(t.audience)}</span>${ph(t.img, t.imgAlt, t.color)}</div>
      </article>`;
    }).join("");
    sweepImages(el);
  };

  /* ---------- people behind the idea ---------- */
  const PEOPLE = D.people || [];
  const pid = (p) => "p-" + slug(p.name.replace(/^(Dr\.|Coach)\s+/i, ""));
  const portrait = (p, size = "") => `<div class="portrait ${size}" style="--pc:${p.color}">${p.photo ? `<img src="${esc(src(p.photo))}" alt="${esc(p.name)}" loading="lazy" decoding="async">` : ""}<span class="pt-initials" aria-hidden="true">${esc(p.initials)}</span></div>`;
  const links = (p) => (p.links || []).map((l) => `<a class="pp-link" href="${esc(l.url)}" target="_blank" rel="noopener">${icon("link")}${esc(l.label)}</a>`).join("");
  const highlights = (p) => `<ul class="pp-highlights">${p.highlights.map((x) => `<li>${icon("check")}<span>${esc(x)}</span></li>`).join("")}</ul>`;
  const tags = (p) => `<div class="pp-tags">${p.tags.map((t) => `<span class="badge" style="--c:${p.color}">${esc(t)}</span>`).join("")}</div>`;

  R["people-faces"] = (el) => {
    el.innerHTML = PEOPLE.map((p) => `<a class="face" href="#${pid(p)}" style="--pc:${p.color}">${portrait(p, "md")}<b>${esc(p.name)}</b><span class="r">${esc(p.role)}</span></a>`).join("") ;
  };

  R.founder = (el) => {
    el.innerHTML = PEOPLE.filter((p) => p.group === "founder").map((p) => `<article class="founder-card" id="${pid(p)}" style="--pc:${p.color}">
        <div class="fc-left">${portrait(p, "xl")}<div class="pp-links">${links(p)}</div></div>
        <div class="fc-right">
          <p class="pp-role">${esc(p.role)}</p>
          <h3 class="pp-name">${esc(p.name)}</h3>
          <p class="pp-headline">${esc(p.headline)}</p>
          <p class="pp-bio">${esc(p.bio)}</p>
          ${highlights(p)}
          ${tags(p)}
        </div>
      </article>`).join("");
  };

  R.advisors = (el) => {
    el.innerHTML = PEOPLE.filter((p) => p.group === "advisor").map((p) => `<article class="advisor" id="${pid(p)}" style="--pc:${p.color}">
        <div class="ad-top" aria-hidden="true"></div>
        ${portrait(p, "lg")}
        <div class="ad-body">
          <div class="ad-head"><p class="pp-role">${esc(p.role)}</p><h3 class="pp-name">${esc(p.name)}</h3><p class="pp-headline">${esc(p.headline)}</p></div>
          <p class="pp-bio">${esc(p.bio)}</p>
          ${highlights(p)}
          ${tags(p)}
          <div class="pp-links">${links(p)}</div>
        </div>
      </article>`).join("");
  };

  R["people-upcoming"] = (el) => {
    el.innerHTML = (D.peopleUpcoming || []).map((u) => `<article class="seat"><span class="seat-ic">${icon(u.icon)}</span><span class="seat-tag">Seat opening soon</span><h3>${esc(u.t)}</h3><p>${esc(u.d)}</p></article>`).join("") +
      `<article class="seat seat-join"><span class="seat-ic">${icon("user-plus")}</span><h3>Want to be part of this?</h3><p>Educators, researchers, industry leaders and institutions: we'd love to hear from you.</p><a class="btn btn-saffron btn-sm" href="contact.html?intent=institutional-partner">Join the council ${icon("arrow")}</a></article>`;
  };

  R["people-teaser"] = (el) => {
    el.innerHTML = PEOPLE.map((p) => `<article class="p-card" style="--pc:${p.color}">
        ${portrait(p)}
        <span class="r">${esc(p.role)}</span>
        <h3><a href="people.html#${pid(p)}">${esc(p.name)}</a></h3>
        <p>${esc(p.headline)}</p>
      </article>`).join("") +
      `<article class="p-card more"><span class="seat-ic">${icon("user-plus")}</span><h3><a href="people.html#more">More people joining</a></h3><p>Academic advisors, industry mentors and guest faculty are next.</p></article>`;
  };

  /* partner & collaborator logos: a running strip (brochure page 04 style) */
  R["partner-marquee"] = (el) => {
    const all = Object.values(D.partners).flat();
    const row = all.map((p) => `<li class="pm-item" title="${esc(p.full)}"><span class="logo-tile pm-logo">${img(p.logo, p.full)}<span class="lt-name">${esc(p.name)}</span></span></li>`).join("");
    el.innerHTML = `<ul class="pm-row">${row}</ul><ul class="pm-row" aria-hidden="true">${row}</ul>`;
  };

  /* home: Led by the visionaries */
  R.visionaries = (el) => {
    el.innerHTML = (D.people || []).filter((p) => p.group === "advisor").map((p) => `<article class="vision-card" style="--pc:${p.color}">
        ${portrait(p, "lg")}
        <div class="vc-body">
          <h3>${esc(p.name)}</h3>
          <p class="vc-des">${esc(p.designation || p.role)}</p>
          <a class="link-arrow" href="people.html#${pid(p)}" aria-label="Read more about ${esc(p.name)}">Read more ${icon("arrow")}</a>
        </div>
      </article>`).join("");
  };

  /* home: eight pathways in a compact two-column index */
  R["pathway-list"] = (el) => {
    el.innerHTML = D.themes.map((t) => {
      const n = programmesFor(t.id).length;
      return `<li class="pw-item" style="--c:${t.color}">
        <span class="pw-ic">${icon(t.icon)}</span>
        <span class="pw-no">${t.no}</span>
        <div class="pw-text"><h3><a href="programs.html?theme=${t.id}#catalogue">${esc(t.name)}</a></h3><p>${esc(t.tagline)}</p></div>
        <span class="pw-meta">${n} programmes<small>${esc(t.audience)}</small></span>
        <span class="pw-go" aria-hidden="true">${icon("arrow")}</span>
      </li>`;
    }).join("");
  };

  /* home: notice board, expeditions and downloads in one tabbed panel */
  R["nd-updates"] = (el) => {
    el.innerHTML = D.notices.map((n, k) => {
      const d = new Date(n.date + "T00:00:00");
      return `<li><a class="nd-row" href="${esc(n.href || "#")}"><time datetime="${n.date}">${String(d.getDate()).padStart(2, "0")} ${MON[d.getMonth()]} ${d.getFullYear()}</time><span class="nd-tag${k === 0 ? " new" : ""}">${esc(n.tag || "Update")}</span><span class="nd-title">${esc(n.title)}</span>${icon("arrow")}</a></li>`;
    }).join("");
  };
  R["nd-expeditions"] = (el) => {
    el.innerHTML = D.expeditions.map((x) => {
      const t = THEMES[x.theme];
      return `<li><a class="nd-row" href="programs.html?p=${esc(x.id)}" style="--c:${t.color}"><time>${esc(x.when)}</time><span class="nd-tag theme">${icon(t.icon)}${esc(t.name.split(" & ")[0])}</span><span class="nd-title">${esc(x.title)}<small>${icon("pin")}${esc(x.where)}</small></span>${icon("arrow")}</a></li>`;
    }).join("");
  };
  R["nd-downloads"] = (el) => {
    el.innerHTML = D.downloads.map((d) => {
      const has = !!d.url;
      const href = has ? d.url : `mailto:${D.config.email}?subject=${encodeURIComponent("Request: " + d.title)}&body=${encodeURIComponent("Hello Kashti team,\n\nPlease send me the " + d.title + ".\n\nName:\nInstitution:\n")}`;
      return `<li><a class="nd-row" href="${esc(href)}"${has ? " download" : ""}><time>${esc(d.meta.split(" · ")[0])}</time><span class="nd-tag">${has ? "Download" : "On request"}</span><span class="nd-title">${esc(d.title)}<small>${esc(d.meta)}${has ? "" : " · we email it to you"}</small></span>${icon(has ? "download" : "mail")}</a></li>`;
    }).join("");
  };
  $$("[data-newsdesk]").forEach((nd) => {
    const tabs = $$("[role=tab]", nd);
    const select = (b) => {
      tabs.forEach((x) => { const on = x === b; x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1; $("#" + x.getAttribute("aria-controls")).hidden = !on; });
    };
    tabs.forEach((b, i) => {
      b.addEventListener("click", () => select(b));
      b.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const n = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
        n.focus(); select(n);
      });
    });
    select(tabs[0]);
  });

  /* home: testimonials from students and teachers */
  R.testimonials = (el) => {
    const list = D.testimonials || [];
    const card = (t) => `<figure class="tm-card" data-who="${esc(t.who || "student")}">
        <span class="qm" aria-hidden="true">“</span>
        <blockquote>${esc(t.quote)}</blockquote>
        <figcaption><span class="tm-who">${t.who === "teacher" ? "Teacher" : "Student"}</span><b>${esc(t.source)}</b><span>${esc(t.detail || "")}</span></figcaption>
      </figure>`;
    const share = `<div class="tm-card tm-share"><span class="seat-ic" aria-hidden="true">${icon("quote")}</span><h3>Been on a Kashti programme?</h3><p>Students and teachers: tell us what stayed with you. We feature selected stories here.</p><a class="btn btn-saffron btn-sm" href="contact.html?intent=testimonial">Share your experience ${icon("arrow")}</a></div>`;
    el.innerHTML = list.map(card).join("") + share;
    const tabs = $$("[data-tm-tabs] button");
    tabs.forEach((b) => b.addEventListener("click", () => {
      tabs.forEach((x) => x.setAttribute("aria-selected", String(x === b)));
      $$(".tm-card[data-who]", el).forEach((c) => { c.hidden = b.dataset.who !== "all" && c.dataset.who !== b.dataset.who; });
    }));
  };

  R.testimonial = (el) => {
    const t = D.testimonials && D.testimonials[0];
    if (!t) { el.hidden = true; return; }
    el.innerHTML = `<span class="qm" aria-hidden="true">“</span><blockquote>${esc(t.quote)}</blockquote><figcaption class="q-by"><b>${esc(t.source)}</b><span>${esc(t.detail)}</span></figcaption>`;
  };

  R.faq = (el) => {
    el.innerHTML = D.faq.map((f, k) => `<details${k === 0 ? " open" : ""}><summary>${esc(f.q)}${icon("plus")}</summary><p>${esc(f.a)}</p></details>`).join("");
  };

  /* partner logos */
  const logoTile = (p) => `<div class="logo-tile" title="${esc(p.full)}">${img(p.logo, p.full)}<span class="lt-name">${esc(p.name)}</span></div>`;
  R["footer-logos"] = (el) => {
    el.innerHTML = Object.values(D.partners).flat().map(logoTile).join("");
  };
  $$("[data-partners]").forEach((panel) => {
    const tabs = $(".ptabs", panel), grid = $(".logo-grid", panel);
    const keys = Object.keys(D.partnerTabs);
    tabs.innerHTML = keys.map((k, i) => `<button type="button" role="tab" id="pt-${k}-${Math.random().toString(36).slice(2, 6)}" aria-selected="${i === 0}" data-k="${k}">${esc(D.partnerTabs[k])}</button>`).join("");
    const show = (k) => {
      grid.innerHTML = D.partners[k].map(logoTile).join("");
      sweepImages(grid);
    };
    $$("button", tabs).forEach((b, i, all) => {
      b.addEventListener("click", () => { all.forEach((x) => x.setAttribute("aria-selected", String(x === b))); show(b.dataset.k); });
      b.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const n = all[(i + (e.key === "ArrowRight" ? 1 : -1) + all.length) % all.length];
        n.focus(); n.click();
      });
    });
    show(keys[0]);
  });

  /* =====================================================================
     CINEMATIC YEAR STAGE (home hero)
     Each month has a mood: sky, land, light, particles and a silhouette.
     The calendar is the light source; the player walks the year.
     ===================================================================== */
  const stage = $("[data-stage]");
  const cal = $("[data-calendar]");
  if (stage && cal) {
    const page = $(".cal-page", cal);
    const strip = $(".month-strip", stage);
    const backs = $$(".cal-back", cal);          /* [farther, nearer] */
    const tourBtn = $("[data-tour]", stage), tourLabel = $("[data-tour-label]", stage);
    const plCount = $("[data-pl-count]", stage), plTitle = $("[data-pl-title]", stage), plSub = $("[data-pl-sub]", stage), plFill = $("[data-pl-fill]", stage);
    const ghostA = $("[data-ghost-a]", stage), ghostB = $("[data-ghost-b]", stage);
    const dial = $(".h-dial", cal);
    const motifs = $$(".motif", cal);
    const rm = D.roadmap;
    const today = new Date();
    let current = -1, busy = false;

    /* ---------- moods: [s1, s2, s3, s4, far, mid, near, cap, sil, corona, ray, cloud, stars, fx, motif] ---------- */
    const M = (a) => ({ s1: a[0], s2: a[1], s3: a[2], s4: a[3], far: a[4], mid: a[5], near: a[6], cap: a[7], sil: a[8], corona: a[9], ray: a[10], cloud: a[11], stars: a[12], fx: a[13], motif: a[14] });
    const MOODS = {
      night: M(["#03071A", "#081032", "#121A46", "#1E2458", "#161B44", "#0F1534", "#090E28", "#56628F", "#060A22", "#FFC46B", 0, 0, 1, "none", null]),
      cover: M(["#0A1433", "#2A2F6E", "#9B5C8F", "#F7A85E", "#4A4C8A", "#2C3470", "#172152", "#F3D9E8", "#0E1640", "#FFC46B", .55, .25, .55, "motes", null]),
      0: M(["#3F8FE0", "#86C3F2", "#CBE8FB", "#FFE6C2", "#7B9FD6", "#3FA36B", "#2E7D4A", "#FFFFFF", "#1C4A33", "#FFF0CC", .35, .75, 0, "petals", "tents"]),
      1: M(["#2A86DE", "#76BDF3", "#C9E7FB", "#FFE3A0", "#8EA6C9", "#93A94B", "#6B7F2E", "#FFFFFF", "#3B4718", "#FFF8DC", .5, .4, 0, "motes", "temple"]),
      2: M(["#33497F", "#77819F", "#D69A7B", "#F4BE88", "#5D6390", "#4F6A4A", "#34492F", "#E9E0E6", "#1E2A1B", "#FFC48A", .4, .85, 0, "dust", "tower"]),
      3: M(["#3A5068", "#6C8496", "#A6B8C2", "#C9D5DA", "#5F7385", "#2F6B4B", "#1F5236", "#E6EDF2", "#163826", "#EAF2F7", .14, 1, 0, "rain", "gears"]),
      4: M(["#46739C", "#83ABC5", "#C1D8E1", "#E5EEE2", "#6D8DA8", "#2F8A55", "#1F6B3E", "#F2F7FA", "#14402A", "#F4FAFF", .22, .9, 0, "drizzle", "factory"]),
      5: M(["#2C82D4", "#77BBEF", "#C4E4FA", "#FFF0CC", "#7FA2D3", "#3E9B5F", "#2B7A45", "#FFFFFF", "#183F2A", "#FFF4D4", .45, .5, 0, "motes", "campus"]),
      6: M(["#1A2462", "#583C8B", "#D5607A", "#FFB25E", "#4E4683", "#2D3A6A", "#1A2350", "#F2C9D8", "#0D1336", "#FFB36B", .65, .2, .3, "embers", "rocket"]),
      7: M(["#070D2E", "#1A1E5A", "#452C74", "#A9527A", "#2E2C66", "#1D2350", "#10173A", "#B8B3D9", "#080C26", "#FFD58A", .55, 0, .9, "lanterns", "campfire"]),
      8: M(["#061030", "#122862", "#2C519C", "#7BA3D6", "#3B5A92", "#CFDCF0", "#AFC3E0", "#FFFFFF", "#0C1638", "#DCE7FF", .38, .1, 1, "snow", "pagoda"]),
      9: M(["#3A6BB4", "#A6C3E6", "#FBE2C0", "#F6A35C", "#8AA2C8", "#E6EEF6", "#2E8B4A", "#FFFFFF", "#1B3A2A", "#FFD7A0", .6, .3, 0, "marigold", "tricolour"]),
      10: M(["#3689DB", "#88C5F4", "#CFEAFC", "#EEF6FF", "#9DB7DA", "#EDF3FA", "#3E8C55", "#FFFFFF", "#1D3B4F", "#FFFFFF", .45, .3, 0, "snow-light", "summit"]),
      11: M(["#4699E6", "#95CFF6", "#DBEFFB", "#FFE0B6", "#8FA9D8", "#4BAA5E", "#2F8547", "#FFFFFF", "#1C3B2B", "#FFF1CE", .5, .4, 0, "holi", "skyline"])
    };

    /* ---------- particles ---------- */
    const fx = (() => {
      const cv = $(".st-fx", stage);
      if (!cv || reduced) return { set() {}, start() {}, stop() {}, stars() {} };
      const ctx = cv.getContext("2d");
      let W = 0, H = 0, dpr = 1, maxDpr = 1.5, scale = 1, type = "none", target = 0, live = 0;
      let starLevel = 0, starTarget = 0, running = false, t = 0, last = 0, ema = 16, slowFor = 0;
      const P = [];
      const R = (a, b) => a + Math.random() * (b - a);
      const pick = (a) => a[(Math.random() * a.length) | 0];
      const STARS = Array.from({ length: 170 }, () => ({ x: Math.random(), y: Math.random() * .6, r: R(.3, 1.5), s: R(.6, 2.4), ph: R(0, 6.28) }));
      const PAL = {
        petals: ["#FFC1D6", "#FFFFFF", "#FFB0C8", "#FFDDE8"],
        marigold: ["#FF9933", "#FFFFFF", "#138808", "#FFB347", "#FFD27A"],
        gold: ["#FFD27A", "#FFE7A8", "#FFFFFF"],
        embers: ["#FFB347", "#FFD27A", "#FF8A3D"],
        holi: ["#FF4FA3", "#FFD23F", "#3EC300", "#2BB3FF", "#FF7A2B", "#B467FF"]
      };
      const SPEC = {
        none: { n: 0 },
        petals: { n: 48 }, marigold: { n: 56 }, motes: { n: 64 }, dust: { n: 60 },
        rain: { n: 170 }, drizzle: { n: 80 }, embers: { n: 80 }, lanterns: { n: 16 },
        snow: { n: 140 }, "snow-light": { n: 60 }, holi: { n: 34 }
      };

      /* ---- sprites: drawn once, stamped every frame (same pixels as the old per-frame paths) ---- */
      const S = 64, HALF = S / 2;
      const sprite = (paint) => { const c = document.createElement("canvas"); c.width = c.height = S; paint(c.getContext("2d")); return c; };
      const disc = {};          /* solid circle, radius = HALF */
      const glow = {};          /* motes: outer ring (r = 4u, alpha .12) + core (r = 1u, alpha .9), added */
      const puff = {};          /* holi: colour fading to transparent white */
      const discOf = (c) => disc[c] || (disc[c] = sprite((g) => { g.fillStyle = c; g.beginPath(); g.arc(HALF, HALF, HALF, 0, 6.283); g.fill(); }));
      const glowOf = (c) => glow[c] || (glow[c] = sprite((g) => {
        g.globalCompositeOperation = "lighter"; g.fillStyle = c;
        g.globalAlpha = .12; g.beginPath(); g.arc(HALF, HALF, HALF, 0, 6.283); g.fill();
        g.globalAlpha = .9; g.beginPath(); g.arc(HALF, HALF, HALF / 4, 0, 6.283); g.fill();
      }));
      const puffOf = (c) => puff[c] || (puff[c] = sprite((g) => {
        const gr = g.createRadialGradient(HALF, HALF, 0, HALF, HALF, HALF);
        gr.addColorStop(0, c); gr.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gr; g.beginPath(); g.arc(HALF, HALF, HALF, 0, 6.283); g.fill();
      }));
      const lanternGlow = sprite((g) => {
        const gr = g.createRadialGradient(HALF, HALF, 0, HALF, HALF, HALF);
        gr.addColorStop(0, "rgba(255,206,120,.5)"); gr.addColorStop(1, "rgba(255,170,60,0)");
        g.fillStyle = gr; g.beginPath(); g.arc(HALF, HALF, HALF, 0, 6.283); g.fill();
      });
      const WHITE = discOf("#FFFFFF");
      const stamp = (img, x, y, r) => ctx.drawImage(img, x - r, y - r, r * 2, r * 2);

      const make = (k, anywhere) => {
        const p = { k, a: 0, dead: false };
        switch (k) {
          case "petals": case "marigold":
            Object.assign(p, { x: R(-40, W), y: anywhere ? R(-20, H) : R(-60, -10), vx: R(.3, 1.1), vy: R(.5, 1.3), sz: R(3, 6.5), rot: R(0, 6.28), vr: R(-.05, .05), sw: R(0, 6.28), c: pick(PAL[k === "petals" ? "petals" : "marigold"]) }); break;
          case "motes":
            Object.assign(p, { x: R(0, W), y: anywhere ? R(0, H) : H + 10, vx: R(-.15, .15), vy: R(-.4, -.1), sz: R(.8, 2.2), sw: R(0, 6.28) }); p.img = glowOf(pick(PAL.gold)); break;
          case "dust":
            Object.assign(p, { x: anywhere ? R(0, W) : R(-80, -10), y: R(H * .25, H), vx: R(1.4, 3.2), vy: R(-.15, .15), len: R(6, 18), al: R(.12, .32) }); break;
          case "rain": case "drizzle":
            Object.assign(p, { x: R(0, W + 120), y: anywhere ? R(-H, H) : R(-H * .4, -10), vx: k === "rain" ? -2 : -1.2, vy: k === "rain" ? R(10, 14) : R(6, 9), len: k === "rain" ? R(14, 24) : R(8, 14) }); break;
          case "embers":
            Object.assign(p, { x: R(0, W), y: anywhere ? R(H * .3, H) : H + R(0, 30), vx: R(-.35, .35), vy: R(-1.5, -.5), sz: R(.8, 2.4), sw: R(0, 6.28) }); p.img = discOf(pick(PAL.embers)); break;
          case "lanterns":
            Object.assign(p, { x: R(W * .25, W), y: anywhere ? R(H * .2, H) : H + R(20, 80), vx: R(-.12, .12), vy: R(-.5, -.22), sz: R(5, 10), sw: R(0, 6.28) }); break;
          case "snow": case "snow-light":
            Object.assign(p, { x: R(0, W), y: anywhere ? R(0, H) : R(-40, -5), vx: R(-.3, .3), vy: R(.35, 1.1), sz: R(.8, 2.8), sw: R(0, 6.28) }); break;
          case "holi":
            Object.assign(p, { x: R(0, W), y: anywhere ? R(H * .3, H) : H + R(0, 60), vx: R(-.35, .35), vy: R(-.7, -.25), sz: R(10, 24), grow: R(.04, .12), life: 1 }); p.img = puffOf(pick(PAL.holi)); break;
        }
        return p;
      };
      const resize = () => {
        const r = cv.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
        W = r.width; H = r.height;
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        comp = "source-over";
        scale = Math.max(.35, Math.min(1.2, (W * H) / (1440 * 860)));
        target = Math.round((SPEC[type] || SPEC.none).n * scale);
      };

      /* move + draw one particle; returns false once it has left the stage */
      let comp = "source-over";
      const blend = (m) => { if (comp !== m) { ctx.globalCompositeOperation = m; comp = m; } };
      let rainPath = null;
      const step = (p, dt) => {
        const A = p.a;
        switch (p.k) {
          case "petals": case "marigold": {
            p.x += p.vx + Math.sin(t * 1.6 + p.sw) * .7; p.y += p.vy; p.rot += p.vr;
            const c = Math.cos(p.rot) * dpr, s = Math.sin(p.rot) * dpr;
            blend("source-over");
            ctx.setTransform(c, s, -s, c, p.x * dpr, p.y * dpr);
            ctx.globalAlpha = A * .9; ctx.fillStyle = p.c;
            ctx.beginPath(); ctx.ellipse(0, 0, p.sz, p.sz * .55, 0, 0, 6.283); ctx.fill();
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            return p.y < H + 20 && p.x < W + 40;
          }
          case "motes": {
            p.x += p.vx + Math.sin(t + p.sw) * .25; p.y += p.vy;
            blend("lighter");
            ctx.globalAlpha = A * (.55 + .45 * Math.sin(t * 2 + p.sw));
            stamp(p.img, p.x, p.y, p.sz * 4);
            return p.y > -20;
          }
          case "dust":
            p.x += p.vx; p.y += p.vy;
            blend("source-over");
            ctx.globalAlpha = A * p.al; ctx.strokeStyle = "#F7E2C4"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.len, p.y + .6); ctx.stroke();
            return p.x < W + 40;
          case "rain": case "drizzle":
            p.x += p.vx; p.y += p.vy;
            if (A >= 1 && rainPath) { rainPath.moveTo(p.x, p.y); rainPath.lineTo(p.x + p.vx * 1.6, p.y + p.len); }
            else {
              blend("source-over");
              ctx.globalAlpha = A * (p.k === "rain" ? .62 : .45); ctx.strokeStyle = "#E4F0FF"; ctx.lineWidth = p.k === "rain" ? 1.3 : 1;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.vx * 1.6, p.y + p.len); ctx.stroke();
            }
            return p.y < H + 30;
          case "embers": {
            p.x += p.vx + Math.sin(t * 3 + p.sw) * .4; p.y += p.vy;
            const fl = .5 + .5 * Math.sin(t * 9 + p.sw);
            blend("lighter");
            ctx.globalAlpha = A * .18 * fl; stamp(p.img, p.x, p.y, p.sz * 4);
            ctx.globalAlpha = A * (.6 + .4 * fl); stamp(p.img, p.x, p.y, p.sz);
            return p.y > -20;
          }
          case "lanterns": {
            p.x += p.vx + Math.sin(t * .8 + p.sw) * .3; p.y += p.vy;
            const fl = .85 + .15 * Math.sin(t * 6 + p.sw);
            blend("lighter"); ctx.globalAlpha = A * fl; stamp(lanternGlow, p.x, p.y, p.sz * 5);
            blend("source-over");
            ctx.globalAlpha = A; ctx.fillStyle = "#FFB347";
            ctx.beginPath(); ctx.moveTo(p.x - p.sz * .7, p.y - p.sz); ctx.lineTo(p.x + p.sz * .7, p.y - p.sz); ctx.lineTo(p.x + p.sz * .5, p.y + p.sz); ctx.lineTo(p.x - p.sz * .5, p.y + p.sz); ctx.closePath(); ctx.fill();
            ctx.globalAlpha = A * fl; stamp(discOf("#FFEBB0"), p.x, p.y + p.sz * .5, p.sz * .32);
            return p.y > -60;
          }
          case "snow": case "snow-light":
            p.x += p.vx + Math.sin(t * 1.2 + p.sw) * .4; p.y += p.vy;
            blend("source-over"); ctx.globalAlpha = A * .85; stamp(WHITE, p.x, p.y, p.sz);
            return p.y < H + 10;
          case "holi": {
            p.x += p.vx; p.y += p.vy; p.sz += p.grow; p.life -= .0022 * (dt / 16);
            blend("source-over"); ctx.globalAlpha = A * .32 * Math.max(0, p.life); stamp(p.img, p.x, p.y, p.sz);
            return p.life > 0 && p.y > -60;
          }
        }
        return false;
      };

      const frame = (now) => {
        if (!running) return;
        const dt = Math.min(48, now - (last || now)); last = now; t += dt / 1000;
        /* if this device can't hold the frame rate, render the particles at 1x (they're soft; nothing else changes) */
        ema += (dt - ema) * .05;
        if (dpr > 1 && ema > 24) { if ((slowFor += dt) > 1500) { maxDpr = 1; resize(); slowFor = 0; } } else slowFor = 0;

        ctx.clearRect(0, 0, W, H);
        starLevel += (starTarget - starLevel) * Math.min(1, dt / 900);
        if (starLevel > .01) {
          blend("source-over");
          for (let i = 0; i < STARS.length; i++) {
            const s = STARS[i], tw = Math.sin(t * s.s + s.ph);
            ctx.globalAlpha = starLevel * (.45 + .55 * tw * tw);
            stamp(WHITE, s.x * W, s.y * H, s.r);
          }
        }
        rainPath = (type === "rain" || type === "drizzle") ? new Path2D() : null;
        for (let i = P.length - 1; i >= 0; i--) {
          const p = P[i];
          p.a = p.dead ? Math.max(0, p.a - dt / 700) : Math.min(1, p.a + dt / 900);
          const alive = step(p, dt);
          if ((p.dead && p.a <= 0) || !alive) {
            const lastP = P.pop();                         /* swap-remove: O(1) */
            if (i < P.length) P[i] = lastP;
            if (!p.dead) {
              live--;
              if (!alive && p.k === type && live < target) { P.push(make(type, false)); live++; }
            }
          }
        }
        if (rainPath) {
          blend("source-over");
          ctx.globalAlpha = type === "rain" ? .62 : .45; ctx.strokeStyle = "#E4F0FF"; ctx.lineWidth = type === "rain" ? 1.3 : 1;
          ctx.stroke(rainPath);
        }
        blend("source-over");
        ctx.globalAlpha = 1;
        for (let n = Math.min(4, target - live); n > 0; n--) { P.push(make(type, true)); live++; }
        requestAnimationFrame(frame);
      };
      let rz = 0;
      window.addEventListener("resize", () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(resize); }, { passive: true });
      resize();
      return {
        set(k) {
          for (let i = 0; i < P.length; i++) P[i].dead = true;
          live = 0;
          type = SPEC[k] ? k : "none"; target = Math.round(SPEC[type].n * scale);
        },
        stars(v) { starTarget = v; },
        start() { if (!running) { running = true; last = 0; requestAnimationFrame(frame); } },
        stop() { running = false; }
      };
    })();

    /* ---------- calendar faces ---------- */
    const ym = (r) => r.m.split("-").map(Number);
    const progOf = (r) => D.programmes.find((p) => p.aud === "school" && p.name === r.prog);
    const grid = (y, m, on, plain) => {
      const first = new Date(y, m - 1, 1).getDay();
      const days = new Date(y, m, 0).getDate();
      const isNow = today.getFullYear() === y && today.getMonth() === m - 1;
      let cells = ["S", "M", "T", "W", "T", "F", "S"].map((d) => `<span class="${plain ? "" : "dow"}">${d}</span>`).join("");
      for (let i = 0; i < first; i++) cells += `<span class="blank"></span>`;
      for (let d = 1; d <= days; d++) {
        const c = [on.includes(d) ? "on" : "", (first + d - 1) % 7 === 0 ? "sun" : "", isNow && d === today.getDate() ? "today" : ""].filter(Boolean).join(" ");
        cells += `<span${c ? ` class="${c}"` : ""}>${d}</span>`;
      }
      return { cells, isNow };
    };
    const monthPage = (r) => {
      const [y, m] = ym(r);
      const t = THEMES[r.theme];
      const prog = progOf(r);
      const g = grid(y, m, r.days);
      return `<div class="mp-band" style="--tc:${t.color}">
          <div><p class="mp-month">${MONTHS[m - 1]} ${y}</p><p class="mp-sub"><span>${esc(r.stage)} stage</span><span>${esc(t.name)}</span></p></div>
          <span class="mp-badge" aria-hidden="true">${icon(t.icon)}</span>
        </div>
        <div class="mp-grid" style="--tc:${t.color}" aria-hidden="true">${g.cells}</div>
        <p class="mp-legend" style="--tc:${t.color}"><span><i></i>Programme days</span>${g.isNow ? `<span><i class="t"></i>Today</span>` : ""}</p>
        <div class="mp-prog" style="--tc:${t.color}">
          ${ph(t.img, t.imgAlt, t.color)}
          <strong>${esc(r.prog)}</strong>
          <p>${esc(r.note)}</p>
          <div class="mp-meta"><span>${esc(r.fmt)}</span>${prog ? `<a href="programs.html?p=${prog.id}">View programme ${icon("arrow")}</a>` : ""}</div>
        </div>`;
    };
    const setBacks = (i) => {
      [2, 1].forEach((step, k) => {
        const r = rm[(i + step + 12) % 12];
        const [y, m] = ym(r);
        const t = THEMES[r.theme];
        const el = backs[k];
        if (!el) return;
        el.style.setProperty("--bc", t.color);
        el.innerHTML = `<div class="cb-band">${MONTHS[m - 1].toUpperCase()} ${y}<small>${esc(r.prog)}</small></div><div class="cb-grid">${grid(y, m, r.days, true).cells}</div>`;
      });
    };

    /* the cover lists the whole year; each tile opens its month */
    const glance = $("[data-glance]", page);
    if (glance) glance.innerHTML = rm.map((r, i) => {
      const [, m] = ym(r); const t = THEMES[r.theme];
      return `<button type="button" data-go="${i}" style="--tc:${t.color}" aria-label="Open ${MONTHS[m - 1]}: ${esc(r.prog)}"><span class="g-top">${MON[m - 1].toUpperCase()}${icon(t.icon)}</span><span class="g-name">${esc(r.prog)}</span></button>`;
    }).join("");
    const coverHTML = page.innerHTML;

    strip.innerHTML = rm.map((r, i) => {
      const [y, m] = ym(r); const t = THEMES[r.theme];
      return `<button type="button" aria-pressed="false" data-i="${i}" style="--tc:${t.color}" aria-label="${MONTHS[m - 1]} ${y}: ${esc(r.prog)}">${icon(t.icon)}${MON[m - 1].toUpperCase()}</button>`;
    }).join("");
    const btns = $$("button", strip);

    /* ---------- mood + captions ---------- */
    const L = {
      sky: $(".st-sky", stage), clouds: $(".st-clouds", stage),
      far: $(".land-far", stage), mid: $(".land-mid", stage), near: $(".land-near", stage),
      corona: $(".st-corona", cal), rays: $(".st-rays", cal), motifs: $(".motifs", cal), card: $(".cal", cal),
      ghost: $(".st-ghost", stage)
    };
    const setVars = (el, md, keys) => { if (el) for (const k of keys) el.style.setProperty("--" + k, md[k]); };
    const applyMood = (key) => {
      const md = MOODS[key];
      setVars(L.sky, md, ["s1", "s2", "s3", "s4"]);
      setVars(L.clouds, md, ["cloud"]);
      setVars(L.far, md, ["far", "cap"]);
      setVars(L.mid, md, ["mid"]);
      setVars(L.near, md, ["near"]);
      setVars(L.corona, md, ["corona", "ray"]);
      setVars(L.rays, md, ["corona", "ray"]);
      setVars(L.motifs, md, ["sil", "s4", "corona"]);
      setVars(L.card, md, ["corona"]);
      fx.set(md.fx);
      fx.stars(md.stars);
      motifs.forEach((g) => g.classList.toggle("on", g.dataset.motif === md.motif));
    };
    let ghostFront = ghostA;
    const setGhost = (text) => {
      const back = ghostFront === ghostA ? ghostB : ghostA;
      back.textContent = text;
      back.classList.remove("out");
      ghostFront.classList.add("out");
      ghostFront = back;
    };
    const setCaption = (i) => {
      if (i < 0) {
        plCount.textContent = "Prologue";
        plTitle.textContent = "A year of possibilities";
        plSub.textContent = "12 months · 12 experiences · press play or pick a month";
        return;
      }
      const r = rm[i]; const [, m] = ym(r); const t = THEMES[r.theme];
      plCount.textContent = `Month ${String(i + 1).padStart(2, "0")} of 12`;
      plTitle.textContent = `${MONTHS[m - 1]} · ${r.prog}`;
      plSub.textContent = `${r.stage} stage · ${r.fmt} · ${t.name}`;
    };
    const setDial = (i) => {
      if (dial) dial.style.transform = `rotate(${i < 0 ? 0 : -i * 30}deg)`;
      $$(".h-tick, .h-lbl", cal).forEach((el) => el.classList.toggle("on", +el.dataset.h === i));
    };

    const show = (i, force) => {
      if ((busy || i === current) && !force) return;
      const html = i < 0 ? coverHTML : monthPage(rm[i]);
      btns.forEach((b, k) => { b.setAttribute("aria-pressed", String(k === i)); b.classList.toggle("past", k < i); });
      current = i;
      elapsed = 0;
      setBacks(i);
      applyMood(i < 0 ? "cover" : i);
      setGhost(i < 0 ? "2026–27" : MONTHS[ym(rm[i])[1] - 1]);
      setCaption(i);
      setDial(i);
      const pressed = btns[i];
      if (pressed && strip.scrollWidth > strip.clientWidth) strip.scrollTo({ left: pressed.offsetLeft - strip.clientWidth / 2 + pressed.offsetWidth / 2, behavior: reduced ? "auto" : "smooth" });
      if (reduced) { page.innerHTML = html; sweepImages(page); return; }
      busy = true;
      page.classList.remove("flip-in");
      page.classList.add("flip-out");
      setTimeout(() => {
        page.innerHTML = html;
        sweepImages(page);
        page.classList.remove("flip-out");
        void page.offsetWidth;
        page.classList.add("flip-in");
        busy = false;
      }, 250);
    };

    /* ---------- the player ---------- */
    const DUR = 5200, COVER_DUR = 4200;
    let playing = !reduced, hovering = false, inView = true, elapsed = reduced ? 0 : -2800; /* let the opening breathe */
    const setPlaying = (v) => {
      playing = v;
      tourBtn.setAttribute("aria-pressed", String(v));
      tourBtn.setAttribute("aria-label", v ? "Pause the tour" : "Play the tour");
      tourLabel.textContent = v ? "Pause the tour" : "Play the tour";
    };
    setPlaying(playing);
    const next = () => show(current >= rm.length - 1 ? -1 : current + 1);
    const prev = () => show(current <= -1 ? rm.length - 1 : current - 1);
    tourBtn.addEventListener("click", () => { if (!playing && current === rm.length - 1 && elapsed >= DUR) show(-1); setPlaying(!playing); });
    $("[data-next]", stage).addEventListener("click", () => { elapsed = 0; next(); });
    $("[data-prev]", stage).addEventListener("click", () => { elapsed = 0; prev(); });
    btns.forEach((b, i) => {
      b.addEventListener("click", () => { setPlaying(false); show(current === i ? -1 : i); });
      b.addEventListener("keydown", (e) => {
        const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!dir) return;
        e.preventDefault(); setPlaying(false);
        const n = (i + dir + btns.length) % btns.length;
        btns[n].focus(); show(n);
      });
    });
    page.addEventListener("click", (e) => { const g = e.target.closest("[data-go]"); if (g) { setPlaying(false); show(+g.dataset.go); } });
    const wrap = $(".cal-wrap", cal);
    wrap.addEventListener("mouseenter", () => { hovering = true; });
    wrap.addEventListener("mouseleave", () => { hovering = false; });
    cal.addEventListener("focusin", () => { hovering = true; });
    cal.addEventListener("focusout", () => { hovering = false; });

    /* parallax depths: [layer, px per unit x, px per unit y] (same travel as before) */
    const DEPTH = [[L.far, -10, -4], [L.mid, -20, -6], [L.near, -32, -8], [L.ghost, 14, 0], [L.motifs, -16, 0]];
    let lastT = 0, tx = 0, ty = 0, cx = 0, cy = 0, wx = 0, wy = 0, ptr = null, fillTxt = "", ticking = false;
    const tick = (now) => {
      if (!inView || document.hidden) { ticking = false; return; }
      const dt = Math.min(250, now - (lastT || now)); lastT = now;
      if (playing && !hovering && !busy) {
        elapsed += dt;
        if (elapsed >= (current < 0 ? COVER_DUR : DUR)) next();
      }
      const frac = Math.min(1, elapsed / (current < 0 ? COVER_DUR : DUR));
      const pos = current < 0 ? frac * .5 : Math.min(12, current + .5 + (playing ? frac : 0));
      const ft = `inset(0 ${(100 - (pos / 12) * 100).toFixed(2)}% 0 0)`;
      if (ft !== fillTxt) { plFill.style.clipPath = ft; fillTxt = ft; }
      if (ptr) {                                   /* read the pointer once per frame, before any writes */
        const r = stage.getBoundingClientRect();
        tx = ((ptr.x - r.left) / r.width - .5) * 2; ty = ((ptr.y - r.top) / r.height - .5) * 2;
        ptr = null;
      }
      const k = 1 - Math.exp(-dt / 420);           /* frame-rate independent easing */
      cx += (tx - cx) * k; cy += (ty - cy) * k;
      if (Math.abs(cx - wx) > .0005 || Math.abs(cy - wy) > .0005) {
        wx = cx; wy = cy;
        for (const [el, mx, my] of DEPTH) if (el) el.style.transform = `translate3d(${(cx * mx).toFixed(2)}px, ${(cy * my).toFixed(2)}px, 0)`;
      }
      requestAnimationFrame(tick);
    };
    const startTick = () => { if (!ticking && inView && !document.hidden) { ticking = true; lastT = 0; requestAnimationFrame(tick); } };
    if (!reduced && window.matchMedia("(pointer: fine)").matches) {
      stage.addEventListener("pointermove", (e) => { ptr = { x: e.clientX, y: e.clientY }; }, { passive: true });
      stage.addEventListener("pointerleave", () => { ptr = null; tx = 0; ty = 0; }, { passive: true });
    }
    if ("IntersectionObserver" in window) new IntersectionObserver((es) => es.forEach((e) => {
      inView = e.isIntersecting;
      if (inView) { fx.start(); startTick(); } else fx.stop();
    }), { threshold: 0.15 }).observe(stage);
    document.addEventListener("visibilitychange", () => { if (document.hidden) fx.stop(); else if (inView) { fx.start(); startTick(); } });

    /* ---------- opening: night falls away, the year rises ---------- */
    setBacks(-1);
    setCaption(-1);
    setDial(-1);
    if (reduced) {
      stage.classList.remove("is-intro");
      applyMood("cover");
    } else {
      stage.style.setProperty("--mood-t", "0s");
      applyMood("night");
      void stage.offsetWidth;
      fx.start();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        stage.style.setProperty("--mood-t", "3.2s");
        applyMood("cover");
        stage.classList.remove("is-intro");
        setTimeout(() => stage.style.removeProperty("--mood-t"), 3400);
      }));
    }
    startTick();
  }

  /* =====================================================================
     3-STEP PLANNER (home)
     ===================================================================== */
  const planner = $("[data-planner]");
  if (planner) {
    const LEVELS = { school: ["Grades 1–5", "Grades 6–8", "Grades 9–10", "Grades 11–12"], he: ["Undergraduate", "Postgraduate", "Faculty", "Alumni"] };
    const SLOTS = { 3: [4, 8, 10], 6: [1, 3, 5, 7, 9, 11], 12: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] };
    const AY = Array.from({ length: 12 }, (_, i) => { const m = (3 + i) % 12; return { m, y: i < 9 ? 2026 : 2027 }; });
    const S = { aud: "school", levels: new Set(["Grades 6–8", "Grades 9–10"]), themes: new Set(), pace: 6, intl: true, inst: "", city: "" };

    const levelsEl = $("[data-p-levels]", planner), themesEl = $("[data-p-themes]", planner);
    const list = $("[data-pv-list]", planner), title = $("[data-pv-title]", planner), sub = $("[data-pv-sub]", planner), send = $("[data-pv-send]", planner);

    const drawLevels = () => {
      levelsEl.innerHTML = LEVELS[S.aud].map((l) => `<button type="button" class="chip" aria-pressed="${S.levels.has(l)}" data-v="${esc(l)}">${esc(l)}</button>`).join("");
      $$("button", levelsEl).forEach((b) => b.addEventListener("click", () => { const v = b.dataset.v; S.levels.has(v) ? S.levels.delete(v) : S.levels.add(v); b.setAttribute("aria-pressed", String(S.levels.has(v))); plan(); }));
    };
    const msBtn = $("[data-ms-btn]", themesEl), msPop = $("[data-ms-pop]", themesEl);
    const msLabel = () => {
      const n = S.themes.size;
      msBtn.textContent = n === 0 ? "All focus areas (a balanced mix)" : n === 1 ? THEMES[[...S.themes][0]].name : `${n} focus areas selected`;
    };
    const msOpen = (v) => { msPop.hidden = !v; msBtn.setAttribute("aria-expanded", String(v)); };
    msBtn.addEventListener("click", () => msOpen(msPop.hidden));
    document.addEventListener("click", (e) => { if (!themesEl.contains(e.target)) msOpen(false); });
    themesEl.addEventListener("keydown", (e) => { if (e.key === "Escape" && !msPop.hidden) { msOpen(false); msBtn.focus(); } });
    const drawThemes = () => {
      msPop.innerHTML = D.themes.map((t) => {
        const off = S.aud === "school" && programmesFor(t.id, "school").length === 0;
        return `<label class="ms-opt${off ? " off" : ""}" style="--c:${t.color}"><input type="checkbox" value="${t.id}"${S.themes.has(t.id) ? " checked" : ""}${off ? " disabled" : ""}><span class="dot"></span>${esc(t.name)}${off ? `<small>Higher education only</small>` : ""}</label>`;
      }).join("") + `<div class="ms-foot"><button type="button" class="reset" data-ms-clear>Clear</button><button type="button" class="btn btn-primary btn-sm" data-ms-done>Done</button></div>`;
      $$("input", msPop).forEach((c) => c.addEventListener("change", () => { c.checked ? S.themes.add(c.value) : S.themes.delete(c.value); msLabel(); plan(); }));
      $("[data-ms-clear]", msPop).addEventListener("click", () => { S.themes.clear(); drawThemes(); plan(); });
      $("[data-ms-done]", msPop).addEventListener("click", () => { msOpen(false); msBtn.focus(); });
      msLabel();
    };

    const score = (p, monthIdx, k, n, prevTheme) => {
      let s = 0;
      const intlOK = [1, 2, 8, 9].includes(monthIdx); /* May–Jun, Dec–Jan breaks */
      if (p.formats.includes("intl")) s += intlOK ? 6 : -1000;
      if (p.name === "STEM Tours") s += monthIdx >= 6 ? 4 : -4; /* Oct–Mar season */
      const long = p.formats.includes("res") || (p.formats.includes("multi") && !p.formats.includes("one"));
      const pos = n > 1 ? k / (n - 1) : 0.5;
      if (long) s += pos > 0.35 ? 2 : -1; else s += pos < 0.5 ? 2 : 0;
      if (long && [6, 7, 8, 9, 10, 2].includes(monthIdx)) s += 1; /* cooler months & summer camp */
      if (prevTheme && p.themes[0] === prevTheme) s -= 3;
      if (S.themes.size && p.themes.some((t) => S.themes.has(t))) s += 10;
      return s;
    };

    const plan = () => {
      const slots = SLOTS[S.pace];
      const pool = D.programmes.filter((p) => p.aud === S.aud && (S.intl || !p.formats.includes("intl")));
      const used = new Set();
      let prevTheme = null;
      const rows = slots.map((mi, k) => {
        let best = null, bestS = -Infinity;
        pool.forEach((p, idx) => {
          if (used.has(p.id)) return;
          const s = score(p, mi, k, slots.length, prevTheme) - idx * 0.01;
          if (s > bestS) { bestS = s; best = p; }
        });
        if (!best || bestS < -500) return { mi, p: null };
        used.add(best.id);
        prevTheme = best.themes[0];
        return { mi, p: best };
      });
      title.textContent = S.inst ? `${S.inst} · 2026–27 calendar` : "Your 2026–27 experiential calendar";
      const lv = Array.from(S.levels);
      sub.textContent = [AUD[S.aud], lv.length ? lv.join(", ") : null, S.city || null, `${rows.filter((r) => r.p).length} experiences`].filter(Boolean).join(" · ");
      list.innerHTML = rows.map((r) => {
        const a = AY[r.mi];
        if (!r.p) return `<li class="pv-item"><span class="pv-m">${MON[a.m]}<small>${a.y}</small></span><div><strong>Open month</strong><div class="pv-sub"><span class="pv-fmt">We'll suggest something that fits</span></div></div></li>`;
        const t = primaryTheme(r.p);
        const matched = !S.themes.size || r.p.themes.some((x) => S.themes.has(x));
        return `<li class="pv-item"><span class="pv-m">${MON[a.m]}<small>${a.y}</small></span><div><strong>${esc(r.p.name)}</strong><div class="pv-sub"><span class="pv-theme" style="--tc:${t.color}">${esc(t.name)}</span><span class="pv-fmt">${r.p.formats.map((f) => D.formatLabels[f]).join(" / ")}</span>${matched ? "" : `<span class="pv-stage">To balance the year</span>`}</div></div></li>`;
      }).join("");
      const lines = [
        "Draft 2026–27 calendar from the website planner",
        `Institution type: ${AUD[S.aud]}`,
        lv.length ? `Learners: ${lv.join(", ")}` : "",
        S.city ? `City: ${S.city}` : "",
        S.themes.size ? `Focus areas: ${Array.from(S.themes).map((x) => THEMES[x].name).join("; ")}` : "",
        `Pace: ${S.pace} experiences`,
        "",
        ...rows.map((r) => `${MON[AY[r.mi].m]} ${AY[r.mi].y}: ${r.p ? r.p.name : "open"}`)
      ].filter((l, i) => l !== "" || i === 6);
      const q = new URLSearchParams({ intent: "design-experience", role: S.aud === "school" ? "School" : "Higher Education Institution", msg: lines.join("\n") });
      if (S.inst) q.set("org", S.inst);
      send.href = "contact.html?" + q.toString();
    };

    $$("[data-p-aud] button", planner).forEach((b) => b.addEventListener("click", () => {
      $$("[data-p-aud] button", planner).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      S.aud = b.dataset.v;
      S.levels = new Set(S.aud === "school" ? ["Grades 6–8", "Grades 9–10"] : ["Undergraduate"]);
      if (S.aud === "school") S.themes.delete("ent");
      drawLevels(); drawThemes(); plan();
    }));
    $$("[data-p-pace] button", planner).forEach((b) => b.addEventListener("click", () => {
      $$("[data-p-pace] button", planner).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      S.pace = +b.dataset.v; plan();
    }));
    $("[data-p-intl]", planner).addEventListener("change", (e) => { S.intl = e.target.checked; plan(); });
    $("[name=inst]", planner).addEventListener("input", (e) => { S.inst = e.target.value.trim(); plan(); });
    $("[name=city]", planner).addEventListener("input", (e) => { S.city = e.target.value.trim(); plan(); });
    $("form", planner).addEventListener("submit", (e) => e.preventDefault());
    drawLevels(); drawThemes(); plan();
  }

  /* =====================================================================
     CATALOGUE + PROGRAMME DETAIL (programs page)
     ===================================================================== */
  const catalogue = $("[data-catalogue]");
  const modal = $("[data-modal]");
  let lastFocus = null;

  const openModal = (id, push = true) => {
    const p = PROG[id];
    if (!p || !modal) return;
    const t = primaryTheme(p);
    const facts = p.details ? Object.entries(p.details) : [["Audience", AUD[p.aud]], ["Formats", p.formats.map((f) => D.formatLabels[f]).join(", ")]];
    let related = D.programmes.filter((x) => x.id !== p.id && x.aud === p.aud && x.themes.some((th) => p.themes.includes(th)));
    if (related.length < 3) related = related.concat(D.programmes.filter((x) => x.id !== p.id && x.aud !== p.aud && x.themes.some((th) => p.themes.includes(th))));
    if (!p.themes.length) related = D.programmes.filter((x) => x.id !== p.id && x.group === p.group);
    related = related.slice(0, 3);
    $("[data-modal-body]", modal).innerHTML = `
      <header class="md-head" style="--c:${t.color}">
        <span class="md-theme">${icon(t.icon || "cap")}${esc(t.name)}</span>
        <h2 id="md-title">${esc(p.name)}</h2>
        <div class="md-tags"><span class="badge" style="--c:${t.color}">${AUD[p.aud]}${p.group ? " · " + esc(p.group) : ""}</span>${fmtChips(p)}</div>
      </header>
      <div class="md-body">
        <p>${esc(p.desc)}</p>
        <dl class="md-facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        ${p.circuits ? `<div><p class="md-sub">Featured geo-circuits</p><ul class="md-circuits">${p.circuits.map((c) => `<li>${icon("route")}${esc(c)}</li>`).join("")}</ul></div>` : ""}
        <p class="md-note">Group size and timing are estimates for planning, confirmed with a programme manager at proposal stage.</p>
        ${related.length ? `<div><p class="md-sub">Related programmes</p><div class="md-related">${related.map((r) => `<button type="button" data-open="${r.id}">${esc(r.name)}<small>${AUD[r.aud]}</small></button>`).join("")}</div></div>` : ""}
        <div class="btn-row">
          <a class="btn btn-primary" href="contact.html?program=${encodeURIComponent(p.name)}&aud=${p.aud}">Enquire now ${icon("arrow")}</a>
          <a class="btn btn-outline" href="contact.html?intent=design-experience">Design an experience</a>
        </div>
      </div>`;
    $$("[data-open]", modal).forEach((b) => b.addEventListener("click", () => openModal(b.dataset.open)));
    if (!modal.classList.contains("open")) lastFocus = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const card = $(".modal-card", modal);
    card.scrollTop = 0;
    card.focus();
    if (push) { const u = new URL(location.href); u.searchParams.set("p", id); history.replaceState(null, "", u); }
  };
  const closeModal = () => {
    if (!modal || !modal.classList.contains("open")) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    const u = new URL(location.href); u.searchParams.delete("p"); history.replaceState(null, "", u);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  if (modal) {
    $$("[data-modal-close]", modal).forEach((b) => b.addEventListener("click", closeModal));
    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("open")) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "Tab") {
        const f = $$('a[href], button:not([disabled]), [tabindex="0"]', modal).filter((x) => x.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === $(".modal-card", modal))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  if (catalogue) {
    const F = {
      aud: ["school", "he"].includes(params.get("audience")) ? params.get("audience") : "all",
      theme: THEMES[params.get("theme")] ? params.get("theme") : "",
      format: D.formatLabels[params.get("format")] ? params.get("format") : "",
      q: params.get("q") || ""
    };
    const grid = $("[data-cat-grid]"), count = $("[data-cat-count]"), ttl = $("[data-cat-title]"), sub = $("[data-cat-sub]");
    const themeChips = $("[data-f-theme]"), fmtChipsEl = $("[data-f-format]"), qIn = $("[data-f-q]");
    themeChips.innerHTML = D.themes.map((t) => `<button type="button" class="chip" style="--c:${t.color}" aria-pressed="false" data-v="${t.id}"><span class="dot"></span>${esc(t.name)}</button>`).join("");
    fmtChipsEl.innerHTML = Object.entries(D.formatLabels).map(([k, v]) => `<button type="button" class="chip" aria-pressed="false" data-v="${k}">${v}</button>`).join("");
    qIn.value = F.q;

    const COPY = {
      all: ["All programmes", "Eight themes across school and higher education."],
      school: ["Real-world learning for school students", "Twelve programmes spanning discipline, adventure, career exposure and global immersion, built for classrooms, not campuses."],
      he: ["Built for campus life, end to end", "Seven portfolio areas covering students, alumni and the faculty who teach them."]
    };

    const sync = () => {
      $$("[data-f-aud] button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === F.aud)));
      $$("button", themeChips).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === F.theme)));
      $$("button", fmtChipsEl).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === F.format)));
      const q = F.q.toLowerCase().trim();
      const list = D.programmes.filter((p) =>
        (F.aud === "all" || p.aud === F.aud) &&
        (!F.theme || p.themes.includes(F.theme)) &&
        (!F.format || p.formats.includes(F.format)) &&
        (!q || (p.name + " " + p.desc + " " + (p.group || "") + " " + p.themes.map((t) => THEMES[t].name).join(" ")).toLowerCase().includes(q))
      );
      ttl.textContent = F.theme ? THEMES[F.theme].name : COPY[F.aud][0];
      sub.textContent = F.theme ? THEMES[F.theme].tagline + (F.aud !== "all" ? ` · ${AUD[F.aud]}` : "") : COPY[F.aud][1];
      count.textContent = `Showing ${list.length} of ${D.programmes.length}`;
      grid.innerHTML = list.length ? list.map((p) => {
        const t = primaryTheme(p);
        return `<button type="button" class="prog-card" style="--c:${t.color}" data-open="${p.id}">
          <span class="pg-meta"><span class="pg-aud">${AUD[p.aud]}</span><span class="small muted">${esc(p.group || t.name)}</span></span>
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.desc)}</p>
          <span class="pg-fmts">${fmtChips(p)}</span>
          <span class="pg-open">View programme ${icon("arrow")}</span>
        </button>`;
      }).join("") : `<div class="cat-empty"><b>No programmes match these filters.</b><span>Try another format or interest, or tell us what you need and we'll design it.</span><button class="btn btn-outline btn-sm" type="button" data-f-reset>Clear all filters</button></div>`;
      $$("[data-open]", grid).forEach((b) => b.addEventListener("click", () => openModal(b.dataset.open)));
      $$("[data-f-reset]", grid).forEach((b) => b.addEventListener("click", reset));
      const u = new URL(location.href);
      ["audience", "theme", "format", "q"].forEach((k) => u.searchParams.delete(k));
      if (F.aud !== "all") u.searchParams.set("audience", F.aud);
      if (F.theme) u.searchParams.set("theme", F.theme);
      if (F.format) u.searchParams.set("format", F.format);
      if (F.q) u.searchParams.set("q", F.q);
      history.replaceState(null, "", u);
    };
    const reset = () => { F.aud = "all"; F.theme = ""; F.format = ""; F.q = ""; qIn.value = ""; sync(); };

    $$("[data-f-aud] button").forEach((b) => b.addEventListener("click", () => { F.aud = b.dataset.v; sync(); }));
    $$("button", themeChips).forEach((b) => b.addEventListener("click", () => { F.theme = F.theme === b.dataset.v ? "" : b.dataset.v; sync(); }));
    $$("button", fmtChipsEl).forEach((b) => b.addEventListener("click", () => { F.format = F.format === b.dataset.v ? "" : b.dataset.v; sync(); }));
    let qt;
    qIn.addEventListener("input", () => { clearTimeout(qt); qt = setTimeout(() => { F.q = qIn.value; sync(); }, 150); });
    $$("aside [data-f-reset]").forEach((b) => b.addEventListener("click", reset));
    const ft = $(".filter-toggle"), fl = $("#filters");
    ft && ft.addEventListener("click", () => { const o = !fl.classList.contains("open"); fl.classList.toggle("open", o); ft.setAttribute("aria-expanded", String(o)); });

    document.addEventListener("click", (e) => {
      const a = e.target.closest("[data-theme-go]");
      if (!a) return;
      e.preventDefault();
      F.theme = a.dataset.themeGo; F.aud = "all"; F.format = ""; F.q = ""; qIn.value = "";
      sync();
      document.getElementById("catalogue").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    });
    sync();
  }

  /* =====================================================================
     GALLERY + LIGHTBOX
     ===================================================================== */
  R.gallery = (el) => {
    const filters = $("[data-gal-filters]");
    const lb = $("[data-lightbox]");
    let cat = "all", visible = [], idx = 0, opener = null;
    const counts = D.gallery.reduce((a, g) => ((a[g.cat] = (a[g.cat] || 0) + 1), a), {});
    filters.innerHTML = [["all", `All (${D.gallery.length})`], ...Object.entries(D.galleryCats).map(([k, v]) => [k, `${v} (${counts[k] || 0})`])]
      .map(([k, v]) => `<button type="button" class="chip" aria-pressed="${k === "all"}" data-v="${k}">${esc(v)}</button>`).join("");
    el.innerHTML = D.gallery.map((g, i) => `<button type="button" class="gal-item" data-i="${i}" data-cat="${g.cat}"><span class="ph" data-label="${esc(g.alt)}" style="--c:${["#0F3E9E", "#0E8F86", "#6544CC", "#C98A00", "#1584C7", "#3D8B33"][i % 6]}">${img(g.src, g.alt)}</span><span class="gal-cap">${esc(g.alt)}</span></button>`).join("");
    const items = $$(".gal-item", el);
    const apply = () => {
      items.forEach((it) => { it.hidden = cat !== "all" && it.dataset.cat !== cat; });
      visible = items.filter((it) => !it.hidden).map((it) => +it.dataset.i);
    };
    $$("button", filters).forEach((b) => b.addEventListener("click", () => {
      cat = b.dataset.v;
      $$("button", filters).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      apply();
    }));
    apply();
    const lbImg = $("[data-lb-img]", lb), lbPh = $("[data-lb-ph]", lb), lbCap = $("[data-lb-cap]", lb);
    const showLb = (k) => {
      idx = (k + visible.length) % visible.length;
      const g = D.gallery[visible[idx]];
      lbPh.classList.remove("ph--missing");
      lbPh.dataset.label = g.alt;
      lbImg.src = src(g.src);
      lbImg.alt = g.alt;
      lbCap.textContent = `${g.alt} · ${idx + 1} of ${visible.length}`;
    };
    const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; opener && opener.focus(); };
    items.forEach((it) => it.addEventListener("click", () => {
      opener = it;
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
      showLb(visible.indexOf(+it.dataset.i));
      $("[data-lb-close]", lb).focus();
    }));
    $("[data-lb-close]", lb).addEventListener("click", close);
    $("[data-lb-prev]", lb).addEventListener("click", () => showLb(idx - 1));
    $("[data-lb-next]", lb).addEventListener("click", () => showLb(idx + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showLb(idx - 1);
      if (e.key === "ArrowRight") showLb(idx + 1);
    });
  };

  /* =====================================================================
     CONTACT FORM
     ===================================================================== */
  const form = $("[data-contact]");
  if (form) {
    const sel = $("[data-prog-select]", form);
    sel.innerHTML += ["school", "he"].map((a) => `<optgroup label="${AUD[a]}">${D.programmes.filter((p) => p.aud === a).map((p) => `<option value="${esc(p.name)} (${AUD[a]})">${esc(p.name)}</option>`).join("")}</optgroup>`).join("");

    const banner = $("[data-intent-banner]");
    const say = (t) => { banner.hidden = false; $("span", banner).textContent = t; };
    const intent = params.get("intent"), program = params.get("program"), aud = params.get("aud");
    const role = $("[name=role]", form);
    if (intent === "design-experience") say("You're designing an experience. Tell us about your learners and goals.");
    if (intent === "testimonial") { role.value = role.value || "Other"; say("Share your Kashti experience: the programme, when you went and what stayed with you."); }
    if (intent === "institutional-partner") { role.value = "Advisor & Institutional Partner"; say("Partnering with Kashti. Tell us how you'd like to work together."); }
    if (params.get("role")) role.value = params.get("role");
    if (params.get("org")) $("[name=org]", form).value = params.get("org");
    if (params.get("msg")) $("[name=message]", form).value = params.get("msg");
    if (params.get("msg") && intent === "design-experience") say("Your draft calendar is in the message below. Add your details and send.");
    if (program) {
      const opts = $$("option", sel);
      const want = aud && AUD[aud] ? `${program} (${AUD[aud]})` : null;
      const hit = opts.find((o) => o.value === want) || opts.find((o) => o.value.startsWith(program + " ("));
      if (hit) sel.value = hit.value;
      if (!role.value && aud === "school") role.value = "School";
      if (!role.value && aud === "he") role.value = "Higher Education Institution";
      say(`Enquiring about ${program}.`);
    }

    const status = $("[data-form-status]", form);
    const setStatus = (ok, html) => { status.className = "form-status " + (ok ? "ok" : "err"); status.innerHTML = icon(ok ? "check" : "info") + `<span>${html}</span>`; };
    const check = (name, test) => {
      const f = form.elements[name];
      const okv = test(f.value.trim());
      f.closest(".field").classList.toggle("invalid", !okv);
      return okv;
    };
    $$("input, select, textarea", form).forEach((el) => el.addEventListener("input", () => { const fl = el.closest(".field"); fl && fl.classList.remove("invalid"); }));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const v = [
        check("role", (x) => !!x),
        check("name", (x) => x.length > 1),
        check("org", (x) => x.length > 1),
        check("email", (x) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(x)),
        check("phone", (x) => x.replace(/\D/g, "").length >= 10)
      ];
      const consent = form.elements.consent.checked;
      $("[data-consent-err]", form).style.display = consent ? "none" : "block";
      if (v.includes(false) || !consent) {
        const bad = $(".field.invalid input, .field.invalid select", form);
        (bad || form.elements.consent).focus();
        return;
      }
      if (form.elements.website.value) { setStatus(true, "Message sent. We'll reply with a tailored proposal."); form.reset(); return; }
      const data = Object.fromEntries(new FormData(form).entries());
      delete data.website;
      const btn = $("button[type=submit]", form);
      if (D.config.formEndpoint) {
        btn.disabled = true;
        try {
          const res = await fetch(D.config.formEndpoint, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
          if (!res.ok) throw new Error(res.status);
          setStatus(true, "Message sent. We'll reply with a tailored proposal.");
          form.reset();
        } catch (err) {
          setStatus(false, `Your message didn't send. Check your connection and try again, or email <a href="mailto:${D.config.email}">${D.config.email}</a>.`);
        } finally { btn.disabled = false; }
      } else {
        const body = [
          `Reaching out as: ${data.role}`,
          `Name: ${data.name}`,
          `Institution / Organisation: ${data.org}`,
          `Email: ${data.email}`,
          `Phone: ${data.phone}`,
          data.programme ? `Programme of interest: ${data.programme}` : "",
          data.learners ? `Learners / grades: ${data.learners}` : "",
          "",
          data.message || ""
        ].filter((l, i) => l !== "" || i === 7).join("\n");
        location.href = `mailto:${D.config.email}?subject=${encodeURIComponent(`Enquiry: ${data.org} (${data.role})`)}&body=${encodeURIComponent(body)}`;
        setStatus(true, `Your email app should open with the message ready. Press send to reach us. If it didn't open, write to <a href="mailto:${D.config.email}">${D.config.email}</a>.`);
      }
    });
  }

  /* =====================================================================
     COOKIE CONSENT
     ===================================================================== */
  const cookie = $(".cookie");
  if (cookie) {
    const KEY = "kashti-consent";
    const choice = store.get(KEY);
    if (!choice) setTimeout(() => cookie.classList.add("show"), 900);
    if (choice === "accept" && typeof window.KASHTI_ON_CONSENT === "function") window.KASHTI_ON_CONSENT();
    $$("[data-consent]", cookie).forEach((b) => b.addEventListener("click", () => {
      store.set(KEY, b.dataset.consent);
      cookie.classList.remove("show");
      if (b.dataset.consent === "accept" && typeof window.KASHTI_ON_CONSENT === "function") window.KASHTI_ON_CONSENT();
    }));
    $$("[data-cookie-open]").forEach((b) => b.addEventListener("click", () => cookie.classList.add("show")));
  }

  /* ---------- run renderers ---------- */
  $$("[data-render]").forEach((el) => { const fn = R[el.dataset.render]; if (fn) fn(el); });
  sweepImages();

  /* deep link: programs.html?p=stem-tours-school */
  if (params.get("p")) openModal(params.get("p"), false);
})();
