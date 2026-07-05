# Workshop: CI/CD in der modernen Webentwicklung

Willkommen! In diesem Workshop bringst du Schritt für Schritt eine
**CI/CD-Pipeline** mit **GitHub Actions** zum Laufen. Du arbeitest mit einer
kleinen, bereits fertigen Beispiel-API (Express) und ergänzt nach und nach die
fehlenden Teile der Pipeline.

> **CI/CD** = *Continuous Integration / Continuous Delivery*. Kurz gesagt: Bei
> jedem Push wird dein Code automatisch getestet, damit Fehler früh auffallen.

workshop-cicd/ <br>
│── .devcontainer/devcontainer.json   // Node-20-Umgebung für Codespaces (npm install automatisch) <br>
│── .github/workflows/ci.yml          // 2 unabhängige Jobs mit allen TODO-Lücken + Lösungen <br>
│── api/server.js                     // Express Dummy-API (4 Endpunkte, keine DB) <br>
│── tests/ <br>
│   │── unit/api.test.js              // 6 fertige Unit-Tests (Jest + supertest) <br> — Block 1 <br>
│   └── postman/ <br>
│       │── collection.json           // Newman-Tests inkl. eingebautem Bug + secret-data-Test <br>
│       └── environment.json          // nur baseUrl + leeres apiKey-Feld <br>
│── package.json                      // ein einziges install (express, jest, supertest, newman) <br>
│── .gitignore                        // node_modules, .env <br>
│── README.md                         // Schritt-für-Schritt für Teilnehmende <br>
└── LICENSE <br>

## Was du NICHT installieren musst

**Für den Workshop musst du nichts lokal installieren.** GitHub Actions führt
alles in der Cloud aus. Du editierst Dateien,
committest, und schaust der Pipeline beim Laufen zu.

---

## Einmalige Einrichtung

1. **Repository forken:** Klicke oben rechts auf **Fork** und erstelle eine
   Kopie in deinem eigenen GitHub-Account.
2. **Actions aktivieren:** Öffne in deinem Fork den Tab **Actions**. Beim ersten Mal fragt GitHub,
   ob du Workflows aktivieren möchtest.
3. **Editor öffnen**

### Wo finde ich was auf GitHub?

| Was | Wo |
|-----|-----|
| Deine Pipeline-Läufe | Tab **Actions** → links der Workflow **CI** → ein Lauf → die Jobs `unit-tests` / `api-tests` |
| Die Logs eines Steps | In einem Job auf den jeweiligen Step klicken (Pfeil aufklappen) |
| Secrets & Variables | **Settings → Secrets and variables → Actions** (Reiter *Secrets* bzw. *Variables*) |
| Environments | **Settings → Environments** |
| Die Workflow-Datei | Im Repo unter `.github/workflows/ci.yml` |

---

## Block 1 — Die erste Pipeline zum Laufen bringen

Die Pipeline enthält bereits Checkout, Node-Setup und `npm install` — aber der
Schritt, der die Tests ausführt, fehlt noch.

**Deine Aufgabe:**
1. Öffne `.github/workflows/ci.yml`.
2. Suche im Job `unit-tests` den Kommentar `# TODO (Block 1, Aufgabe 1)`.
3. Ergänze dort den fehlenden Step, der die Unit-Tests startet.
4. Committe und pushe die Änderung.
5. Öffne den Tab **Actions** und beobachte, wie der Job `unit-tests` grün wird.

**Ziel:** Zum ersten Mal eine Pipeline auslösen und den Log lesen lernen.

---

## Block 2 — API-Testing mit Newman

Jetzt testen wir die laufende API von außen mit **Newman** (dem
Kommandozeilen-Runner für Postman-Collections). Die Collection liegt in
`tests/postman/collection.json`.

**Aufgabe 1 — Newman-Step ergänzen:**
1. Suche im Job `api-tests` den Kommentar `# TODO (Block 2, Aufgabe 1)`.
2. Ergänze den Step, der Newman ausführt, committe und pushe.
3. Beobachte den Log: **Ein Test schlägt bewusst fehl.** Finde heraus, *welcher*
   und *warum*.

**Aufgabe 2 — Fehlerhaften Test korrigieren:**
1. Öffne `tests/postman/collection.json` und suche den Test für `POST /users`.
2. Korrigiere den Fehler (welchen Code liefert die API laut
   `api/server.js` wirklich für eine erfolgreiche Erstellung?).
3. Pushe und beobachte, wie der Job grün wird.

**Aufgabe 3 — Eigenen Test ergänzen:**
Füge der Collection einen eigenen API-Test hinzu, committe
und pushe.

> **Hinweis:** In Block 2 laufen alle Tests **ohne API-Key**. Der Test für
> `/secret-data` ist bereits vorhanden, überspringt seine Prüfungen aber
> automatisch, solange kein Key da ist. Du musst hier nichts aktivieren — das
> kommt in Block 3.

---

## Block 3 — Secrets & Variables

Der Endpunkt `/secret-data` verlangt einen API-Key. Diesen dürfen wir **nicht
in den Code schreiben**, er soll aus einem GitHub Secret kommen.

**Aufgabe 1 — Secret und Variable anlegen:**
Gehe zu **Settings → Secrets and variables → Actions** und lege an:

- Reiter **Secrets** → *New repository secret*:
  - Name: `API_KEY` — Wert: `workshop-secret-123`
- Reiter **Variables** → *New repository variable*:
  - Name: `API_ENV_NAME` — Wert: `staging`

Dann in `.github/workflows/ci.yml` im Job `api-tests`:
- Ergänze den `env:`-Block, der `API_KEY` und `API_ENV_NAME` bereitstellt.
- Passe den Newman-Step an, sodass der Key an Newman übergeben wird.

**Aufgabe 2 — Pushen und Log prüfen:**
Beobachte im Actions-Log:
- `API_ENV_NAME` erscheint im **Klartext** (`staging`).
- `API_KEY` erscheint **maskiert** als `***` — GitHub schützt Secrets automatisch.
- Der `/secret-data`-Test läuft jetzt und wird **grün**.

> **Warum ist `environment.json` (fast) leer?** Sie enthält nur die unkritische
> `baseUrl`. Der geheime `apiKey` steht bewusst NICHT drin, sondern wird zur
> Laufzeit aus dem Secret injiziert. Geheimes gehört nie ins Repository.

---

## Block 4 — Environments

Ein **Environment** in GitHub bündelt Werte für eine bestimmte Zielumgebung
(z. B. `staging` oder `production`) — und kann Repository-Werte überschreiben.

**Aufgabe 1 — Environment `staging` anlegen:**
Gehe zu **Settings → Environments → New environment**, nenne es `staging` und
hinterlege dort **andere Werte als im Repository**:

- Environment secret `API_KEY` → `workshop-secret-456`
- Environment variable `API_ENV_NAME` → `staging-environment`

**Aufgabe 2 — Job an das Environment binden:**
Ergänze in `.github/workflows/ci.yml` im Job `api-tests` das
`environment` namens `staging`, pushe und
beobachte den Unterschied.

**Was ändert sich?** Sobald der Job an das Environment gebunden ist, gewinnen die
Environment-Werte bei gleichem Namen. In der `/secret-data`-Antwort steht jetzt
`"env": "staging-environment"` statt `"staging"` — im Newman-Log sichtbar
(`Aktuelle Umgebung (env): ...`). Der API-Key wurde ebenfalls ausgetauscht
(auf `...456`), bleibt aber weiterhin maskiert. Das zeigt: Auch verdeckte Werte
kann ein Environment überschreiben.

## Die Endpunkte der Beispiel-API

| Methode & Pfad | Antwort |
|----------------|---------|
| `GET /health` | `200 { "status": "ok" }` |
| `GET /users` | `200 { "users": [...] }` |
| `POST /users` | `201 { id, name }` — oder `400 { error }` ohne Namen |
| `GET /secret-data` | `401` ohne gültigen `x-api-key`, sonst `200` mit `env`-Info |
