const { test, expect } = require("@playwright/test");
const fs = require("node:fs");

const bibliography = fs.readFileSync("_bibliography/papers.bib", "utf8");
const entries = bibliography.split(/(?=^@\w+\{)/m).filter((entry) => entry.startsWith("@"));
const keys = entries.map((entry) => entry.match(/^@\w+\{([^,]+)/)[1]);
const selected = entries.filter((entry) => /selected\s*=\s*\{true\}/.test(entry));
const newsCount = fs.readdirSync("_news").filter((name) => name.endsWith(".md")).length;

test.beforeEach(async ({ page }) => {
  // Prevent verification visits from being recorded in production analytics.
  await page.route(/google-analytics\.com|googletagmanager\.com/, (route) => route.abort());
});

test("home preserves biography, selected publications, news and contact links", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("Lizhi Yang");
  await expect(page.locator("article")).toContainText("Mechanical Engineering PhD candidate");
  await expect(page.locator(".profile .more-info")).toContainText("Pasadena, CA 91125");
  await expect(page.locator(".publications ol.bibliography > li")).toHaveCount(selected.length);
  await expect(page.locator(".news tbody tr")).toHaveCount(Math.min(3, newsCount));
  await expect(page.locator(".contact-icons a[href='https://github.com/lzyang2000']")).toBeVisible();
  await expect(page.locator(".contact-icons a[href='https://orcid.org/0000-0002-6101-7610']")).toBeVisible();
  await expect(page.locator(".contact-icons a[href*='jEf5Q-4AAAAJ']")).toBeVisible();
  await expect(page.locator(".contact-icons a[href*='linkedin.com/in/lzyang']")).toBeVisible();
  await expect(page.locator(".contact-icons a[href^='mailto:']")).toHaveCount(1);
  await expect(page.locator("#search-toggle, #light-toggle")).toHaveCount(0);
  expect(await page.locator(":root").evaluate((el) => getComputedStyle(el).getPropertyValue("--global-theme-color").trim())).toBe("#0076df");
  for (const image of await page.locator(".profile img, .affiliations img").all()) {
    await expect.poll(() => image.evaluate((el) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
});

test("publications retain all entries and expand abstracts and author lists", async ({ page }) => {
  await page.goto("/publications/");
  await expect(page.locator("ol.bibliography > li")).toHaveCount(keys.length);
  for (const key of keys) {
    await expect(page.locator(`[id="${key}"]`)).toHaveCount(1);
  }
  const publication = page
    .locator("ol.bibliography > li")
    .filter({ has: page.locator("a.abstract") })
    .first();
  const abstract = publication.locator("div.abstract").first();
  await expect(abstract).toHaveCSS("max-height", "0px");
  await publication.locator("a.abstract").first().click();
  await expect.poll(() => abstract.evaluate((el) => el.clientHeight)).toBeGreaterThan(50);
  await publication.locator("a.abstract").first().click();
  await expect(abstract).toHaveCSS("max-height", "0px");
  const authors = page.locator(".more-authors").first();
  const collapsed = await authors.textContent();
  await authors.click();
  await expect(authors).not.toHaveText(collapsed);
  await expect(page.locator("a[href='https://anxingxiao.com/']").first()).toBeAttached();
});

test("CV renders every section and links the existing PDF", async ({ page, request }) => {
  await page.goto("/cv/");
  await expect(page.locator(".cv .card-title")).toHaveText([
    "Experience",
    "General Information",
    "Research Interests",
    "Education",
    "Technical Skills",
    "Awards and Honors",
    "Projects",
    "Publications",
    "Invited Talks",
    "Academic Service",
    "Outreach and Community Service",
  ]);
  for (const text of [
    "Expected 2027",
    "Arthur M. Hopkin Award",
    "MorphMimic",
    "99.7%",
    "Best Oral Presentation Finalist",
    "Best Service Robotics Paper Finalist",
    "From Performance to Safety: Bringing Robots Into the Real World",
    "IEEE Transactions on Robot Learning",
    "English (Fluent), Mandarin (Native)",
  ]) {
    await expect(page.locator(".cv")).toContainText(text);
  }
  await expect(page.locator(".post-header a[href='/assets/pdf/CV.pdf']")).toBeVisible();
  const pdf = await request.get("/assets/pdf/CV.pdf");
  expect(pdf.ok()).toBe(true);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  expect(await pdf.body()).toEqual(fs.readFileSync("assets/pdf/CV.pdf"));
});

test("full news retains every announcement", async ({ page }) => {
  await page.goto("/news/");
  await expect(page.locator(".news tbody tr")).toHaveCount(newsCount);
});

test("navigation, theme assets and page layout work at this viewport", async ({ page, isMobile }, testInfo) => {
  const errors = [];
  const missing = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.url().startsWith("http://127.0.0.1:4173/") && response.status() >= 400) missing.push(response.url());
  });
  for (const route of ["/", "/cv/", "/publications/", "/projects/", "/news/", "/books/", "/teaching/", "/404.html"]) {
    const response = await page.goto(route);
    expect(response.ok()).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
  await page.goto("/");
  if (isMobile) {
    const toggle = page.getByRole("button", { name: "Toggle navigation" });
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  }
  await expect(page.locator("#navbarNav .nav-link")).toHaveText([/About/, /CV/, /Publications/, /Projects/]);
  await page.locator("#navbarNav .nav-link").filter({ hasText: "CV" }).click();
  await expect(page).toHaveURL(/\/cv\/$/);
  await page.goto("/");
  await page.screenshot({ path: `output/${testInfo.project.name}-home.png`, fullPage: true });
  await page.goto("/cv/");
  await page.screenshot({ path: `output/${testInfo.project.name}-cv.png`, fullPage: true });
  await page.goto("/publications/");
  await page.screenshot({ path: `output/${testInfo.project.name}-publications.png`, fullPage: true });
  expect(missing).toEqual([]);
  expect(errors).toEqual([]);
});
