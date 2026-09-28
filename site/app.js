const profile = window.PROFILE;
if (!profile) throw new Error("Profile content could not be loaded.");

const byId = (id) => document.getElementById(id);
const setText = (id, value) => {
  const element = byId(id);
  if (element && value) element.textContent = value;
};
const make = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};
const external = (element, url) => {
  element.href = url;
  element.target = "_blank";
  element.rel = "noreferrer";
  return element;
};
const rich = (text) =>
  text.split(/\*\*(.+?)\*\*/).map((part, index) => (index % 2 ? make("strong", "", part) : part));
const when = (date, upcoming) => {
  const element = make("span", "when", date);
  if (upcoming) element.append(make("em", "", "upcoming"));
  return element;
};

document.title = profile.pageTitle;
document.querySelector('meta[name="description"]').content = profile.description;
setText("profile-name", profile.name);
setText("position", profile.position);
setText("location", profile.location);
setText("status", profile.status);
setText("bio", profile.bio);
setText("photo-label", profile.photoLabel);
setText("copyright", "© " + new Date().getFullYear() + " " + profile.name);
if (profile.photo) byId("photo").src = profile.photo;

document.querySelectorAll("[data-email]").forEach((link) => {
  link.href = "mailto:" + profile.email;
  link.textContent = profile.email;
});
document.querySelectorAll("[data-github]").forEach((link) => {
  link.href = profile.github;
  link.textContent = profile.github.replace(/^https?:\/\//, "");
});

const clockFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: profile.timezone,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZoneName: "short",
});
function tick() {
  const parts = Object.fromEntries(clockFormat.formatToParts(new Date()).map((part) => [part.type, part.value]));
  setText("clock", parts.hour + ":" + parts.minute + " " + parts.timeZoneName);
}
tick();
setInterval(tick, 20000);

byId("news-list").replaceChildren(
  ...profile.news.map((item) => {
    const row = make("article", "item");
    const text = make("p", "news-text");
    if (item.url) text.append(external(make("a"), item.url));
    (text.firstChild || text).append(...rich(item.text));
    row.append(when(item.date, item.upcoming), text);
    return row;
  }),
);

byId("publication-list").replaceChildren(
  ...profile.publications.map((item, index) => {
    const row = make("article", "paper");
    const links = Object.entries(item.links || {}).filter(([, url]) => url);

    const title = make("h3");
    if (links.length) title.append(external(make("a", "", item.title), links[0][1]));
    else title.textContent = item.title;

    const authors = make("p", "authors");
    item.authors.forEach((author, authorIndex) => {
      authors.append(make(author.self ? "strong" : "span", "", author.name));
      const marks = (author.equal ? "#" : "") + (author.corresponding ? "*" : "");
      if (marks) authors.append(make("sup", "", marks));
      if (authorIndex < item.authors.length - 1) authors.append(", ");
    });

    row.append(make("p", "paper-venue", item.venue), title, authors);

    const actions = make("div", "actions");
    links.forEach(([label, url]) => actions.append(external(make("a", "", label + " ↗"), url)));

    if (item.bibtex) {
      const toggle = make("button", "", "BibTeX");
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", "bib-" + index);
      actions.append(toggle);

      const panel = make("div", "bib");
      panel.id = "bib-" + index;
      panel.hidden = true;
      const copy = make("button", "", "copy");
      copy.type = "button";
      copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(item.bibtex);
          copy.textContent = "copied";
        } catch {
          copy.textContent = "select to copy";
        }
        setTimeout(() => (copy.textContent = "copy"), 1600);
      });
      panel.append(make("pre", "", item.bibtex), copy);

      toggle.addEventListener("click", () => {
        panel.hidden = !panel.hidden;
        toggle.setAttribute("aria-expanded", String(!panel.hidden));
      });
      row.append(actions, panel);
    } else if (links.length) {
      row.append(actions);
    }
    return row;
  }),
);

byId("workshop-list").replaceChildren(
  ...profile.workshops.map((item) => {
    const row = make("article", "item");
    const body = make("div");
    body.append(make("h3", "", item.title), make("p", "", item.role), make("p", "fine", item.host));
    row.append(when(item.date, item.upcoming), body);
    return row;
  }),
);

byId("honors-list").replaceChildren(
  ...profile.honors.map((item) => {
    const row = make("article", "item");
    const body = make("div");
    body.append(make("h3", "", item.title), make("p", "", item.institution));
    row.append(when(item.year), body);
    return row;
  }),
);

byId("education-list").replaceChildren(
  ...profile.education.map((item) => {
    const row = make("article", "item");
    const body = make("div");
    body.append(make("h3", "", item.institution), make("p", "", item.degree));
    if (item.detail) body.append(make("p", "fine", item.detail));
    row.append(when(item.date), body);
    return row;
  }),
);

/* scroll progress + active section */
const nav = document.querySelector(".nav");
let queued = false;
addEventListener(
  "scroll",
  () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      nav.style.setProperty("--progress", max > 0 ? (scrollY / max).toFixed(4) : 0);
      queued = false;
    });
  },
  { passive: true },
);
const navLinks = [...document.querySelectorAll(".links a")];
const sectionObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      navLinks.forEach((link) => {
        if (entry.isIntersecting) link.classList.toggle("active", link.dataset.section === entry.target.id);
        else if (link.dataset.section === entry.target.id) link.classList.remove("active");
      });
    }),
  { rootMargin: "-40% 0px -55% 0px" },
);
navLinks.forEach((link) => sectionObserver.observe(byId(link.dataset.section)));

/* background dots */
const canvas = byId("dots");
const ctx = canvas.getContext("2d");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let width = 0;
let height = 0;
let dots = [];
const pointer = { x: 0, y: 0, active: false };

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  width = innerWidth;
  height = innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  dots = Array.from({ length: Math.min(64, Math.max(32, Math.floor(width / 24))) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 0.75 + Math.random() * 1.25,
    vx: 0.05 + Math.random() * 0.13,
    vy: (Math.random() - 0.5) * 0.06,
    a: 0.16 + Math.random() * 0.3,
  }));
  if (reduced) draw();
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < dots.length; i += 1) {
    for (let j = i + 1; j < dots.length; j += 1) {
      const distance = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y);
      if (distance < 105) {
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.strokeStyle = "rgba(15,18,22," + (1 - distance / 105) * 0.075 + ")";
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
  dots.forEach((dot) => {
    if (!reduced) {
      dot.x += dot.vx;
      dot.y += dot.vy;
      if (dot.x > width + 5) dot.x = -5;
      if (dot.y > height + 5) dot.y = -5;
      if (dot.y < -5) dot.y = height + 5;
      const dx = pointer.x - dot.x;
      const dy = pointer.y - dot.y;
      const distance = Math.hypot(dx, dy);
      if (pointer.active && distance < 100 && distance > 0) {
        dot.x -= (dx / distance) * 0.25;
        dot.y -= (dy / distance) * 0.25;
      }
    }
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(15,18,22," + dot.a + ")";
    ctx.fill();
  });
}

function loop() {
  draw();
  requestAnimationFrame(loop);
}

addEventListener("resize", resize);
addEventListener("pointermove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.active = true;
});
document.addEventListener("pointerleave", () => {
  pointer.active = false;
});
resize();
if (!reduced) loop();

/* reveal on scroll */
const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    }),
  { threshold: 0.08 },
);
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
