# Prem Mohan — QA Engineer Portfolio

Premium, dark-first, fully responsive personal portfolio built **only** from the CV (`Prem_Mohan.pdf`).
No companies, titles, skills, projects or stats were invented.

**Profile:** QA Engineer · Test Automation · Azure DevOps · Playwright · Python · Selenium — High Wycombe, UK.

## Structure

```
portfolio/
├── index.html
├── assets/
│   └── resume.pdf          ← your downloadable CV (already copied from Prem_Mohan.pdf)
├── css/
│   └── style.css
├── js/
│   └── script.js
├── Prem_Mohan.pdf          ← original source CV
└── README.md
```

## Run locally

No build step. Vanilla HTML/CSS/JS.

**Option 1 — just open it:**
Double-click `index.html` → opens in your browser.

**Option 2 — local server (recommended, avoids `file://` quirks):**

```powershell
# PowerShell — from the portfolio folder:
python -m http.server 8000
# then open http://localhost:8000
```

or with Node:

```powershell
npx serve .
```

## Resume download button

All “Download Resume” buttons point to:

```
assets/resume.pdf
```

To update your CV later, just replace that file with your new PDF keeping the same name. No code change needed.

## Features

- Sticky blurred nav + active-section indicator + animated mobile menu
- Full-screen hero with code-window visual, floating chips, particles (canvas, paused off-screen), scroll hint
- Scroll progress bar, reveal-on-scroll via IntersectionObserver, animated timeline progress
- Animated counters for profile numbers (2 yrs experience, 3 projects, 8 testing types)
- Expandable experience + project cards (`aria-expanded`, keyboard accessible)
- Dark / light theme toggle (persisted in localStorage)
- Copy-email button + `mailto:` CTA (no fake backend form)
- Subtle custom cursor (fine-pointer desktop only), back-to-top, dynamic footer year
- `prefers-reduced-motion` respected throughout
- Semantic HTML, skip link, ARIA labels, visible focus, SEO + Open Graph + JSON-LD Person schema

## Content source mapping (CV → site)

| CV section | Site section |
|---|---|
| Name, title, location, email, phone, LinkedIn, GitHub, summary | Hero + Contact + Footer |
| Professional summary | Hero lead + About copy (rewritten, same meaning) |
| Technical Skills (Testing Types, API, CI/CD, Programming, Frameworks, AI) | Expertise + Skills (badges only, no fake %) |
| QA Engineer @ ACS (Aug 2025–Present) | Experience timeline (current, highlighted) |
| QA Intern @ ACS (Oct 2024–Aug 2025) | Experience timeline |
| Customer Assistant @ M&S (Sep 2024–Feb 2025) | Experience timeline |
| AutoTest AI, TestForge AI, QA Test Manager | Projects (exact stacks + descriptions) |
| MSc Oxford Brookes, B.Tech SRM | Education |
| English (Expert), Tamil (Native) | Skills → Languages + Education card |

No certifications section — none exist in the CV (per brief, none invented).

## Customising

- Colours/fonts: edit `:root` variables in `css/style.css`.
- Accent: `--accent` / `--accent-2`.
- Add a photo: place in `assets/images/` and reference with `loading="lazy"`.

## Deploy

Static hosting works as-is: GitHub Pages, Netlify, Vercel, Azure Static Web Apps. Upload the whole folder; keep `assets/resume.pdf` alongside `index.html`.
