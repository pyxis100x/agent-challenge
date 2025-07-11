const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const FACTS_FILE = './funFacts.json';

// Load facts from file or initialize with defaults
let facts = [];
if (fs.existsSync(FACTS_FILE)) {
  facts = JSON.parse(fs.readFileSync(FACTS_FILE));
} else {
  facts = [
    { id: 1, text: "Honey never spoils.", addedBy: "system" },
    { id: 2, text: "Bananas are berries.", addedBy: "system" },
    { id: 3, text: "Octopuses have three hearts.", addedBy: "system" }
  ];
  fs.writeFileSync(FACTS_FILE, JSON.stringify(facts, null, 2));
}

// GET /fun-fact: return a random fact
app.get('/fun-fact', (req, res) => {
  if (facts.length === 0) {
    return res.json({ error: "No fun facts available." });
  }
  const fact = facts[Math.floor(Math.random() * facts.length)];
  res.json(fact);
});

// POST /add-fact: add a new fact
app.post('/add-fact', (req, res) => {
  const { text, addedBy } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: "Missing or invalid 'text' field." });
  }
  const newFact = {
    id: facts.length ? facts[facts.length - 1].id + 1 : 1,
    text,
    addedBy: addedBy || null
  };
  facts.push(newFact);
  fs.writeFileSync(FACTS_FILE, JSON.stringify(facts, null, 2));
  res.json(newFact);
});

app.listen(PORT, () => {
  console.log(`Mastra AI agent running on port ${PORT}`);
});