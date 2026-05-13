# Portfolio Refresh Design

Date: 2026-05-14
Project: `juicevik/main` portfolio site (`kalyakin.github.io`)

## Goal

Refresh Viktor Kalyakin's personal portfolio site as a professional business-card website while preserving the current dark neon identity. The update should make the site more current, clearer for clients, better on mobile, and healthier technically and for SEO.

## Scope

This iteration keeps the existing Create React App and React Router architecture. It does not migrate the project to Next.js or Vite. The work should be a focused evolution of the existing site, not a full redesign.

In scope:

- Update the homepage copy and visual polish.
- Keep the homepage as a single-screen business-card view with no extra content blocks.
- Preserve the existing top-right menu button and separate-page navigation model.
- Add an `About` page with detailed skills, services, experience, and SEO-friendly copy.
- Add English versions for every public page.
- Refresh the portfolio carousel and add WorkerWP Store.
- Fix technical SEO files and metadata.
- Improve mobile behavior, accessibility, and WebGL resilience.

Out of scope for this iteration:

- Migrating away from Create React App.
- Adding a backend or contact form.
- Rebuilding the site as a multi-section landing page.
- Replacing the current brand style with a completely different design.

## Routes

Russian routes:

- `/` - homepage.
- `/about` - detailed "About me" page.
- `/portfolio` - portfolio carousel.
- `/privacy-policy` - privacy policy.

English routes:

- `/en` - English homepage.
- `/en/about` - English about page.
- `/en/portfolio` - English portfolio page.
- `/en/privacy-policy` - English privacy policy.

Unknown routes should redirect to `/`.

## Homepage

The homepage remains a minimal, one-screen portfolio business card. It should not become scroll-based and should not include separate content blocks.

Content:

- Name: `VIKTOR KALYAKIN`.
- Role and compact description updated for current practice.
- Python must be explicitly included in the visible skills line.
- Keep a contact CTA.
- Keep the menu button in the top-right corner.

Suggested Russian positioning:

`Веб-разработчик, Python-разработчик и специалист по автоматизации. React, Node.js, Python, HTML/CSS, техническое SEO, ведение SEO, парсинг и веб-интеграции.`

Suggested English positioning:

`Web developer, Python developer, and automation specialist. React, Node.js, Python, HTML/CSS, technical SEO, ongoing SEO support, scraping, and web integrations.`

Visual updates:

- Preserve the dark neon base.
- Slightly improve the background animation, keeping it lightweight.
- Add subtle liquid glass styling to the menu button and CTA.
- Avoid adding new homepage sections.

## Navigation

The current top-right menu button remains. It should be visually refined, not replaced.

Menu behavior:

- Opens a side panel as it does now.
- Links navigate to separate pages, not homepage anchors.
- The panel should be usable on mobile and desktop.

Russian menu links:

- `Главная` -> `/`
- `Обо мне` -> `/about`
- `Мои работы` -> `/portfolio`
- `Связаться` -> Telegram link
- `English` -> `/en`
- `Политика конфиденциальности` -> `/privacy-policy`

English menu links:

- `Home` -> `/en`
- `About` -> `/en/about`
- `Portfolio` -> `/en/portfolio`
- `Contact` -> Telegram link
- `Русский` -> `/`
- `Privacy Policy` -> `/en/privacy-policy`

Visual treatment:

- Subtle liquid glass panel.
- Transparent dark background with blur.
- Soft cyan border and highlights.
- Keyboard focus states for buttons and links.

## About Page

The about page carries the content and SEO weight that should not be added to the homepage.

Russian page content should cover:

- Short personal intro.
- Core skills: Python, React, Node.js, HTML/CSS, technical SEO, ongoing SEO support, automation, scraping, integrations, WordPress or landing/store work where relevant.
- Main services: SEO audit, technical SEO optimization, ongoing SEO maintenance, business-card websites, landing pages, portfolio sites, store/catalog pages, automation scripts, and parsing/scraping.
- Working style: practical, performance-minded, clean responsive layout, and attention to long-term SEO health.
- Contact CTA.

English page content should mirror the same meaning naturally, not as a word-for-word literal translation.

Visual treatment:

- Separate page with readable content.
- Use restrained glass cards or sections.
- Keep typography compact and professional.
- Avoid marketing-heavy hero blocks.

## Portfolio Page

The portfolio page remains a separate route and keeps the carousel concept.

Projects:

- Rodina - `https://rodina.vercel.app/`
- Geometriya - `https://geometriya.vercel.app/`
- Kalyakin Desktop - `https://kalyakin-desktop.vercel.app/`
- WorkerWP Store - `https://workerwp-store.vercel.app`

Behavior:

- Remove duplicated project entries from the current array.
- Keep the carousel looped in both directions.
- Desktop: show three cards, with the center card visually emphasized.
- Mobile: show one card at a time.
- Each card should include preview image, project name, short localized description, and an open-project link.

WorkerWP preview:

- If no preview image exists in the repo, create `public/workerwp-store-preview.jpg` from the live site during implementation.

Carousel controls:

- Replace the current square neon arrows with more polished glass-style controls.
- Controls need visible hover and focus states.
- Controls need accessible labels.

## Privacy Policy

Keep the privacy policy as a separate page.

Required fixes:

- Keep route `/privacy-policy`.
- Add English version at `/en/privacy-policy`.
- Align sitemap URLs with actual routes.
- Keep analytics disclosure consistent with Yandex Metrika and Vercel Analytics if both remain active.

## Visual Direction

Use the approved "subtle liquid glass" direction.

Principles:

- Current dark neon identity remains the base.
- Glass styling is an accent for menu, buttons, cards, panels, and carousel controls.
- Avoid heavy iOS-like glass everywhere because the site should still read as a professional portfolio.
- Use blur, translucent surfaces, soft borders, and small highlights.
- Avoid excessive glow, large decorative blobs, or one-note blue-only styling.
- Animations should be smooth but not distracting.

## SEO And Metadata

Fix the current SEO issues:

- Replace default Create React App meta description.
- Add localized page titles and descriptions.
- Add Open Graph and Twitter metadata with usable image URLs.
- Add canonical URLs.
- Add `hreflang` alternates for Russian and English routes.
- Fix `robots.txt`, including the broken sitemap URL.
- Fix `sitemap.xml`, including broken homepage URL and wrong privacy URL.
- Include all Russian and English public routes in the sitemap.
- Use concrete `lastmod` dates no later than the implementation date.

Because this iteration stays on Create React App, SEO metadata should be split into static fallbacks and route-aware updates:

- `public/index.html` should contain a correct global title, description, Open Graph image, and base metadata.
- React should update `document.title`, description, canonical, and language alternates when routes change.
- `sitemap.xml` should list every public route so search engines can discover them even though the app is an SPA.

Canonical domain:

- Use `https://kalyakin.github.io` unless the canonical production domain changes during release.

## Accessibility And Mobile

Required improvements:

- Add `aria-label` to icon-only buttons.
- Keep menu usable by keyboard.
- Ensure focus states are visible.
- Ensure text does not overflow on 320px wide screens.
- Ensure portfolio arrows do not cover card text on mobile.
- Preserve meaningful alt text for portfolio previews.
- Add a graceful fallback if WebGL2 is unavailable.
- Respect reduced-motion preferences by reducing or disabling heavy animations.

## Technical Notes

The current project builds successfully with `npm run build`.

Observed technical issues before implementation:

- `public/robots.txt` has a broken sitemap URL.
- `public/sitemap.xml` has a broken homepage URL, outdated dates, and wrong privacy route.
- `public/index.html` still has the default CRA description.
- Portfolio project entries are duplicated.
- Portfolio WebGL assumes WebGL2 is available and lacks a user-safe fallback.
- Portfolio resize handling assigns `window.onresize`, which can conflict with other resize listeners.
- Existing CRA dependency chain reports `36` npm audit vulnerabilities, mostly through `react-scripts`. A framework migration is intentionally deferred to a later phase.

## Verification Plan

Before completion:

- Run `npm run build`.
- Verify main routes render locally: `/`, `/about`, `/portfolio`, `/privacy-policy`, `/en`, `/en/about`, `/en/portfolio`, `/en/privacy-policy`.
- Check desktop and mobile layouts in a browser.
- Check generated `robots.txt` and `sitemap.xml`.
- Re-run `npm audit` and report remaining CRA/react-scripts warnings if not resolved in this scope.
