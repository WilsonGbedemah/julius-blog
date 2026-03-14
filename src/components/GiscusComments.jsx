// ─────────────────────────────────────────────────────────────────────────────
// GiscusComments — GitHub Discussions-powered comments
//
// ONE-TIME SETUP (free, ~5 minutes):
//  1. Go to github.com/WilsonGbedemah/julius-blog → Settings → Features
//     → tick "Discussions" → Save
//  2. Visit https://github.com/apps/giscus → Install → select this repo
//  3. Go to https://giscus.app, paste "WilsonGbedemah/julius-blog", pick a
//     Discussion category (e.g. "General"), copy the categoryId it shows.
//  4. Replace the GISCUS_CATEGORY_ID placeholder below with that value.
//
// Until step 4 is done this component renders a friendly placeholder.
// ─────────────────────────────────────────────────────────────────────────────

import Giscus from '@giscus/react'

// ← paste your category ID from https://giscus.app after enabling Discussions
const GISCUS_CATEGORY_ID = ''

const REPO = 'WilsonGbedemah/julius-blog'
const REPO_ID = 'R_kgDORm8WRQ'

export default function GiscusComments({ theme = 'light' }) {
  const ready = Boolean(GISCUS_CATEGORY_ID)

  if (!ready) {
    return (
      <div className="mt-10 p-7 border border-dashed border-border rounded-card text-center">
        <p className="font-mono text-[12px] text-ink-3 mb-1 tracking-wide uppercase">Comments</p>
        <p className="text-[14px] text-ink-2">
          Comments are powered by{' '}
          <a
            href="https://giscus.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2"
          >
            Giscus
          </a>
          . Enable GitHub Discussions on this repo to activate them —{' '}
          <a
            href="https://github.com/WilsonGbedemah/julius-blog/settings"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2"
          >
            see setup instructions
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="mt-10">
      <Giscus
        repo={REPO}
        repoId={REPO_ID}
        category="General"
        categoryId={GISCUS_CATEGORY_ID}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={theme === 'dark' ? 'dark_dimmed' : 'light'}
        lang="en"
        loading="lazy"
      />
    </div>
  )
}
