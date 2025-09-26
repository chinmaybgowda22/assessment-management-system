const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const puppeteer = require("puppeteer");
const jsonpath = require("jsonpath");

const router = express.Router();
const data = require("../../data");

// Output folder is backend/generated (same as index.js serves)
const OUTPUT_DIR = path.join(__dirname, "generated"); // backend/src/generated

// Configs folder is backend/src/configs
const CONFIG_DIR = path.join(__dirname, "..", "configs");

router.get("/generate-report", async (req, res) => {
  try {
    const { session_id } = req.query || {};
    if (!session_id) return res.status(400).json({ error: "Missing session_id" });

    const session = data.find(d => String(d.session_id) === String(session_id));
    if (!session) return res.status(404).json({ error: "Session not found" });

    const configPath = path.join(CONFIG_DIR, `${session.assessment_id}.json`);
    console.log("CONFIG PATH:", configPath); // debug
    const hasConfig = await fs.pathExists(configPath);
    if (!hasConfig) return res.status(404).json({ error: "Config not found for assessment" });
    const config = await fs.readJson(configPath);

    // Build HTML from config
    let html = `
      <html>
        <head>
          <meta charset="utf-8"/>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { font-size: 22px; margin-bottom: 8px; }
            h2 { font-size: 18px; margin: 18px 0 8px; }
            ul { margin: 0 0 12px 18px; }
            li { margin: 4px 0; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>${config.report_title}</h1>
    `;

    for (const section of config.sections) {
      html += `<h2>${section.title}</h2><ul>`;
      for (const field of section.fields) {
        let value;
        try {
          const results = jsonpath.query(session, field.path);
          value = Array.isArray(results) ? results[0] : results;
        } catch {
          value = undefined;
        }
        if (value === undefined || value === null || value === "") value = field.default;

        if (field.classifications) {
          const num = Number(value);
          if (!isNaN(num)) {
            const cls = field.classifications.find(c => num >= c.min && num <= c.max);
            if (cls) value = `${value} (${cls.label})`;
          }
        }

        html += `<li><span class="label">${field.label}:</span> ${value}</li>`;
      }
      html += `</ul>`;
    }

    html += `</body></html>`;

    await fs.ensureDir(OUTPUT_DIR);
    const outPath = path.join(OUTPUT_DIR, `report-${session_id}.pdf`);

    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({ path: outPath, format: "A4", printBackground: true });
    await browser.close();

    return res.json({ message: "Report generated", url: `/generated/report-${session_id}.pdf` });
  } catch (err) {
    console.error("Generate report error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
