# static-newlist — Frontend build

This repository contains frontend assets (SCSS/JS) for the `newlist` page. The workspace includes a `package.json` with frontend-only dependencies and scripts. No backend packages are included.

Getting started (frontend only)

1. Install dependencies

```bash
npm install
```

2. Build CSS once (compiles `app.scss` -> `app.css`)

```bash
npm run build
# or (if you only want to compile SCSS with sass directly)
# npx sass --no-source-map app.scss app.css
```

3. Watch for changes during development

```bash
npm run watch
# or use the sass watcher:
# npx sass --watch --no-source-map app.scss:app.css
```

Notes
- The `package.json` is frontend-only. If you use Symfony or another backend framework, keep backend package management separate.
- If you want npm-managed Bootstrap and to use its Sass source for variable overrides, you can import Bootstrap's SCSS from `node_modules/bootstrap/scss/bootstrap.scss` instead of the CDN link in `app.scss`.

```
static-newlist
├─ assets
│  ├─ app.js
│  ├─ bootstrap.js
│  ├─ controllers
│  │  ├─ components
│  │  │  ├─ choices_div_controller.js
│  │  │  ├─ confirm_modal_controller.js
│  │  │  ├─ flatpickr_controller.js
│  │  │  └─ multiple_select_controller.js
│  │  └─ tag_filter_controller.js
│  ├─ controllers.json
│  ├─ coophuma.js
│  ├─ fonts
│  │  ├─ YWFT-Poster-Black.otf
│  │  ├─ YWFT-Poster-Bold.otf
│  │  ├─ YWFT-Poster-Extra-Bold.otf
│  │  ├─ YWFT-Poster-Extra-Light.otf
│  │  ├─ YWFT-Poster-Light.otf
│  │  ├─ YWFT-Poster-Medium.otf
│  │  ├─ YWFT-Poster-Regular.otf
│  │  ├─ YWFT-Poster-Semi-Bold.otf
│  │  └─ YWFT-Poster-Thin.otf
│  ├─ home.js
│  ├─ images
│  │  ├─ background.jpg
│  │  ├─ checkbox-checked.svg
│  │  ├─ circle-arrow-left.svg
│  │  ├─ circle-arrow-right.svg
│  │  ├─ footer-bg-2.png
│  │  ├─ horloge.svg
│  │  ├─ icon-calendar.svg
│  │  ├─ restaurant-location-icon.png
│  │  └─ underline.svg
│  ├─ leaflet.js
│  ├─ location.js
│  └─ styles
│     ├─ app.scss
│     ├─ components
│     │  ├─ choices_div.scss
│     │  ├─ flatpickr.scss
│     │  ├─ _cards.scss
│     │  ├─ _event_show.scss
│     │  ├─ _navigation_cards.scss
│     │  ├─ _paginator.scss
│     │  ├─ _section_header.scss
│     │  ├─ _tabs.scss
│     │  └─ _upcoming-events-carousel-section.scss
│     ├─ events.scss
│     ├─ home
│     │  ├─ animate.css
│     │  ├─ bootstrap.css
│     │  └─ responsive.css
│     ├─ home.css
│     ├─ location.scss
│     ├─ variables.scss
│     └─ _utilities.scss
├─ build-temp.scss
├─ home.css
├─ newlist.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ build
│     ├─ app.js
│     ├─ entrypoints.json
│     ├─ manifest.json
│     └─ runtime.js
├─ README.md
├─ src
│  └─ index.js
└─ webpack.config.js

```