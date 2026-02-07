# Kunal D Soni — Fintech Product Manager Portfolio

A modern, responsive portfolio website built for a Fintech Product Manager based in the UAE.

## Live Preview

Open `index.html` in any browser — no build tools or server required.

## Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Grid, Flexbox, animations, dark/light theme
- **Vanilla JavaScript** — No frameworks, zero dependencies
- **Google Fonts** — Inter + Space Grotesk

## Features

- Dark / Light theme toggle (persists in localStorage)
- Animated particle canvas hero background with mouse interaction
- Cursor glow effect
- Scroll-triggered reveal animations (Intersection Observer API)
- Animated stat counters
- Animated skill progress bars
- 3D tilt effect on project cards
- Testimonials carousel with autoplay, dots, arrows & touch swipe
- Case study modals with keyboard (Escape) support
- Floating label contact form
- Responsive hamburger navigation
- Active nav link highlighting on scroll
- Custom scrollbar styling
- Fully responsive (mobile-first)

## Project Structure

```
Website/
├── index.html      # Main HTML file with all sections
├── styles.css      # All styling, animations & responsive design
├── script.js       # Interactivity, canvas, carousel, modals
├── Dockerfile      # Nginx-based Docker image
└── README.md       # This file
```

## Sections

| Section | Description |
|---|---|
| Hero | Name, tagline, stats, animated particle background |
| About | Bio, floating badges, highlight cards |
| Experience | Timeline with Astratech/Botim, Dopay, Mintok, Novo |
| Case Studies | 4 project cards with hover effects & detail modals |
| Skills & Tools | Animated skill bars + tool tag cloud |
| Testimonials | Auto-playing carousel |
| Insights | Blog articles grid (fintech-focused) |
| Contact | Form, phone, email, social links |

## Run Locally

Just open the file:

```bash
open index.html
```

Or use any local server:

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .
```

## Run with Docker

```bash
docker build -t pm-website .
docker run -d -p 8080:80 pm-website
```

Then visit `http://localhost:8080`.

## Customization

All content is in `index.html`. Key areas to edit:

- **Personal info** — Hero section (name, subtitle, stats)
- **Experience** — Timeline items (dates, roles, descriptions)
- **Projects** — Card content + modal data in `script.js` (`caseStudies` object)
- **Skills** — Skill names & `data-width` values (0–100)
- **Tools** — Tag list inside `.tool-tags`
- **Testimonials** — Quote cards in the carousel
- **Blog** — Article titles, dates, excerpts
- **Contact** — Email, phone, location, social links

## Deployment

This is a static site — deploy anywhere:

- **Netlify** — Drag & drop the folder
- **Vercel** — Connect repo or CLI
- **GitHub Pages** — Push to repo, enable Pages
- **Cloudflare Pages** — Connect repo
- **Docker** — Use the included Dockerfile on any cloud provider

## Contact

- **Email:** soni.kunal.dilip@gmail.com
- **Phone:** (+971) 529397033
- **LinkedIn:** [linkedin.com/in/kunaldsoni](https://www.linkedin.com/in/kunaldsoni/)
- **GitHub:** [github.com/KunalDSoni](https://github.com/KunalDSoni)
