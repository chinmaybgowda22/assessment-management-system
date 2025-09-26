Assessment Management System
Generate PDF assessment reports from predefined session data using an Express backend and JSON configs.

Run locally
Backend
cd backend
npm install
npm run start

Opens API at http://localhost:5000
Frontend
cd frontend
npm install
npm start

Opens app at http://localhost:3000

Generate a report
Hit the API directly:

GET http://localhost:5000/generate-report?session_id=session_001

Response includes the PDF link, for example:

/generated/report-session_001.pdf

Or use the Generate page in the UI and enter a session_id.

Project structure
backend/src/index.js — server + static /generated

backend/src/routes/report.js — builds HTML and creates PDFs

backend/src/configs/ — per‑assessment JSON configs (as_hr_02.json, as_card_01.json)

backend/data.js — sample sessions (session_001, session_002)

frontend/ — React client
