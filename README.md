# Julius Dornyo — Personal Blog

A modern, fast personal blog built with **React 18**, **Vite**, and **Tailwind CSS v3**.

## ✨ Features

- ⚡ Vite for fast dev and optimised builds
- 🎨 Tailwind CSS with custom design tokens
- 🌙 Dark / Light mode (persists in localStorage)
- 📖 Reading progress bar on all pages
- 📑 Auto-generated sticky Table of Contents with scroll-spy
- 🔍 Live search with debouncing
- 🏷️ Category filter pills
- 📧 Newsletter signup form
- 🔗 Twitter, LinkedIn & copy-link share buttons
- 📱 Fully mobile responsive
- 🔀 React Router v6 with proper SPA routing
- 🚀 One-click Netlify deploy

---

## 🗂️ Project Structure

```
julius-blog/
├── public/                 # Static assets (favicon, etc.)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── PostCard.jsx
│   │   ├── NewsletterForm.jsx
│   │   ├── NewsletterSection.jsx
│   │   ├── ReadingProgress.jsx
│   │   └── TableOfContents.jsx
│   ├── pages/              # Route-level page components
│   │   ├── Home.jsx
│   │   ├── Blog.jsx
│   │   ├── Post.jsx
│   │   └── About.jsx
│   ├── data/
│   │   └── posts.js        # ← ADD NEW POSTS HERE
│   ├── hooks/
│   │   ├── useTheme.js
│   │   ├── useScrollReveal.js
│   │   └── useReadingProgress.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
├── netlify.toml            # Netlify deploy config
└── package.json
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/julius-blog.git
cd julius-blog
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the site hot-reloads on every save.

### 4. Build for production

```bash
npm run build
```

The output goes to `dist/`.

---

## ✍️ How to Publish a New Post

Open `src/data/posts.js` and add a new object at the **top** of the `POSTS` array:

```js
{
  id: 7,                                    // increment from last post
  slug: 'my-new-post-title',               // URL-friendly, no spaces
  title: 'My New Post Title',
  excerpt: 'A short 1-2 sentence summary shown on cards.',
  category: 'Lifestyle',                   // must match a category pill
  tags: ['tag1', 'tag2'],
  date: 'March 10, 2026',
  dateISO: '2026-03-10',
  readTime: '5 min read',
  featured: false,                          // set true to show in hero
  cover: 'https://images.unsplash.com/...', // any image URL
  content: `
    <p>Your article content in HTML here.</p>
    <h2>Section Heading</h2>
    <p>More content...</p>
    <blockquote>A quote here.<cite>— Source</cite></blockquote>
  `,
},
```

Save the file — the post appears everywhere automatically (homepage grid, blog archive, search, related posts).

---

## 🌐 Deploying to Netlify (Free)

### Option A — Netlify Drop (no account needed)

1. Run `npm run build`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist/` folder onto the page
4. Get a free `*.netlify.app` URL instantly

### Option B — GitHub + Netlify (recommended for ongoing updates)

1. Push this repo to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Select your GitHub repo
4. Build settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy site**
6. Rename your site to `juliusdornyo.netlify.app` in **Site settings → General**

Every time you push to `main`, Netlify auto-deploys. ✅

---

## 🎨 Customising the Design

All design tokens are in `tailwind.config.js`:

```js
colors: {
  accent: { DEFAULT: '#B85C2A', ... },  // ← change your brand colour here
  ink: { DEFAULT: '#19160F', ... },
  paper: { DEFAULT: '#FAFAF7', ... },
}
fontFamily: {
  display: ['Fraunces', ...],           // ← swap for any Google Font
  body: ['Lora', ...],
}
```

Update the font names in `index.html` Google Fonts link and `tailwind.config.js` to match.

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI framework |
| `react-router-dom` | Client-side routing |
| `lucide-react` | Icons |
| `tailwindcss` | Utility CSS |
| `@tailwindcss/typography` | Prose styling for articles |
| `vite` | Build tool |
