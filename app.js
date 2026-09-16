const profile = window.PROFILE;
if (!profile) throw new Error("Profile content could not be loaded.");

const byId = (id) => document.getElementById(id);
const setText = (id, value) => {
  const element = byId(id);
  if (element) element.textContent = value;
};
const make = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

document.title = profile.pageTitle;
document.querySelector('meta[name="description"]').content = profile.description;
setText("brand-name", profile.shortName);
setText("brand-field", profile.field);
setText("eyebrow", profile.eyebrow);
setText("profile-name", profile.name);
setText("position", profile.position);
setText("affiliation", profile.affiliation);
setText("location", profile.location);
setText("bio", profile.bio);
setText("copyright", "© " + new Date().getFullYear() + " " + profile.name);

document.querySelectorAll("[data-email]").forEach((link) => {
  link.href = "mailto:" + profile.email;
  link.textContent = link.dataset.email === "full" ? profile.email + " ↗" : "Email";
});
byId("education-list").replaceChildren(
  ...profile.education.map((item) => {
    const row = make("article", "cv-row");
    const date = make("span", "cv-date", item.date);
    const body = make("div", "cv-body");
    body.append(make("h3", "", item.institution), make("p", "", item.degree));
    if (item.detail) body.append(make("span", "cv-detail", item.detail));
    row.append(date, body);
    return row;
  }),
);

byId("publication-list").replaceChildren(
  ...profile.publications.map((item, index) => {
    const row = make("article", "publication");
    row.append(make("span", "pub-index", String(index + 1).padStart(2, "0")));
    const body = make("div", "pub-body");
    const authors = make("p", "authors");
    item.authors.forEach((author, authorIndex) => {
      const authorElement = make(author.self ? "strong" : "span", "", author.name);
      if (author.equal) authorElement.append("#");
      if (author.corresponding) authorElement.append("*");
      authors.append(authorElement);
      if (authorIndex < item.authors.length - 1) authors.append(", ");
    });
    const title = make("p", "citation", "“" + item.title + "”");
    body.append(authors, title, make("p", "venue", item.venue));
    if (item.note) body.append(make("p", "pub-note", item.note));
    row.append(body);
    if (item.url) {
      const link = make("a", "pub-link", index === 0 ? "DOI ↗" : "OpenReview ↗");
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      row.append(link);
    }
    return row;
  }),
);

byId("honors-list").replaceChildren(
  ...profile.honors.map((item) => {
    const row = make("article", "honor-row");
    const body = make("div", "");
    body.append(make("h3", "", item.title), make("p", "", item.institution));
    row.append(body, make("span", "cv-date", item.year));
    return row;
  }),
);

const canvas = byId("dots");
const ctx = canvas.getContext("2d");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let width = 0;
let height = 0;
let dpr = 1;
let dots = [];
const pointer = { x: 0, y: 0, active: false };

function resize() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  width = innerWidth;
  height = innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  dots = Array.from(
    { length: Math.min(64, Math.max(32, Math.floor(width / 24))) },
    () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.75 + Math.random() * 1.25,
      vx: 0.05 + Math.random() * 0.13,
      vy: (Math.random() - 0.5) * 0.06,
      a: 0.16 + Math.random() * 0.3,
    }),
  );
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < dots.length; i += 1) {
    for (let j = i + 1; j < dots.length; j += 1) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const distance = Math.hypot(dx, dy);
      if (distance < 105) {
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.strokeStyle = "rgba(15,18,22," + ((1 - distance / 105) * 0.075) + ")";
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
    }
    const dx = pointer.x - dot.x;
    const dy = pointer.y - dot.y;
    const distance = Math.hypot(dx, dy);
    if (pointer.active && distance < 100 && distance > 0) {
      dot.x -= (dx / distance) * 0.25;
      dot.y -= (dy / distance) * 0.25;
    }
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(15,18,22," + dot.a + ")";
    ctx.fill();
  });
  requestAnimationFrame(draw);
}

addEventListener("resize", resize);
addEventListener("pointermove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.active = true;
});
addEventListener("pointerleave", () => {
  pointer.active = false;
});
resize();
draw();

const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
