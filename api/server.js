// -----------------------------------------------------------------------------
// Dummy-API für den CI/CD-Workshop
//
// Bewusst simpel gehalten: keine Datenbank, nur ein hardcodiertes Array.
// Der Fokus des Workshops liegt auf CI/CD, nicht auf Code-Komplexität.
//
// An dieser Datei müssen die Teilnehmenden NICHTS ändern.
// -----------------------------------------------------------------------------

const express = require('express');
const app = express();
app.use(express.json());

// Diese beiden Werte kommen im Workshop später aus GitHub Secrets/Variables.
// Lokal greifen die Defaults, damit "npm start" ohne Setup funktioniert.
const API_KEY = process.env.API_KEY || 'workshop-secret-123';
const API_ENV_NAME = process.env.API_ENV_NAME || 'local';

// Hardcodierte "Datenbank"
const users = [
  { id: 1, name: 'Ada Lovelace' },
  { id: 2, name: 'Alan Turing' },
  { id: 3, name: 'Grace Hopper' },
];

// GET /health -> 200 { status: "ok" }
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// GET /users -> 200 { users: [...] }
app.get('/users', (req, res) => {
  res.status(200).json({ users });
});

// POST /users -> 201 { id, name }  oder  400 { error }  wenn kein Name
// Block 2, Aufgabe 3: Diesen Endpunkt (Fehlerfall) können Sie nutzen, um einen weiteren Test zu schreiben
app.post('/users', (req, res) => {
  const { name } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }
  const newUser = { id: users.length + 1, name };
  users.push(newUser);
  res.status(201).json(newUser);
});

// GET /secret-data -> 401 ohne gültigen API-Key, sonst 200
// Gibt den aktuellen Umgebungsnamen (API_ENV_NAME) im Klartext zurück,
// damit der Unterschied zwischen Repo-Werten (Block 3) und Environment (Block 4)
// sichtbar wird, OHNE dass der Secret-Wert selbst angezeigt werden muss.
app.get('/secret-data', (req, res) => {
  const key = req.header('x-api-key');
  if (key !== API_KEY) {
    return res.status(401).json({ error: 'invalid or missing API key' });
  }
  res.status(200).json({
    message: 'Access granted',
    env: API_ENV_NAME,
    secret: 'Die geheimen Workshop-Daten',
  });
});

const PORT = process.env.PORT || 3000;

// Nur einen echten Server starten, wenn die Datei direkt ausgeführt wird
// (node api/server.js). Beim Import in den Unit-Tests bleibt das aus.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API läuft auf http://localhost:${PORT} (env: ${API_ENV_NAME})`);
  });
}

module.exports = app;
