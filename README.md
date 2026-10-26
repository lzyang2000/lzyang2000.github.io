# Lizhi Yang’s website

Personal academic website at [lzyang2000.github.io](https://lzyang2000.github.io), based on [al-folio v1.2](https://github.com/alshedivat/al-folio/releases/tag/v1.2) (`b95d6d61a1b0663529094b1b5f4fbe8aa41f8a04`).

The theme and feature runtime come from the released Ruby gems pinned in `Gemfile` and `Gemfile.lock`. Site content, data, media, and configuration stay in this repository.

## Local preview

Install Ruby 3.3, Python 3, and ImageMagick. Node.js 22 or newer is used for formatting and browser checks. On macOS with Homebrew:

```sh
brew install ruby@3.3 imagemagick
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
```

Install project dependencies and start Jekyll:

```sh
bundle config set --local path vendor/bundle
bundle install
python3 -m venv .venv
.venv/bin/python -m pip install nbconvert
source .venv/bin/activate
bundle exec jekyll serve
```

Open [localhost:4000](http://localhost:4000). The personal GitHub Pages site uses an empty `baseurl`.

## Verification

With Ruby and the Python virtual environment on `PATH`:

```sh
bundle exec al-folio upgrade audit
bundle exec al-folio upgrade overrides audit
JEKYLL_ENV=production bundle exec jekyll build
npm ci
npx playwright install chromium
npm run test:site -- --workers=2
```

Browser checks cover desktop and mobile navigation, all publication entries, abstract and author expansion, selected papers, announcements, CV sections and PDF, contact links, local runtime assets, and horizontal overflow. They block Google Analytics requests during testing. Screenshots are written to the ignored `output/` directory.

GitHub Actions runs the migration audits and browser checks before deploying pushes to `master` or `main` to `gh-pages`. The theme ships its own CSS; do not run the former PurgeCSS step.

## Editing the site

- Biography and page settings: `_pages/`.
- Announcements: `_news/`.
- Publications: `_bibliography/papers.bib`; coauthor lookup keys in `_data/coauthors.yml` are lowercase.
- CV: `_data/cv.yml`, using the v1 RenderCV structure under `cv.sections`; PDF at `assets/pdf/CV.pdf`.
- Contact links: `_data/socials.yml`.
- Feature flags, analytics, and plugin activation: `_config.yml`.

The intentional `assets/css/main.scss` override keeps the blue accent and responsive affiliation logos. It is tracked in `.al-folio-overrides.yml`; review its diff and acknowledge it again after changing it or upgrading its owning gem. Layouts, includes, and feature scripts otherwise come directly from the gems.

For future upgrades, update exact gem pins and the corresponding `_config.yml` plugin entries together, install dependencies, then rerun the audits and browser checks. See upstream’s [v1 migration guide](https://github.com/alshedivat/al-folio/blob/v1.2/docs/INSTALL.md#upgrading-from-a-previous-version) and [customization guide](https://github.com/alshedivat/al-folio/blob/v1.2/docs/CUSTOMIZE.md).
