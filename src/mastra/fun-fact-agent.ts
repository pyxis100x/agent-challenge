import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

const FACTS_FILE = path.join(__dirname, 'fun-facts.json');

interface FunFact {
  id: number;
  text: string;
  addedBy?: string;
}

// Load facts from file or use default
function loadFacts(): FunFact[] {
  if (fs.existsSync(FACTS_FILE)) {
    return JSON.parse(fs.readFileSync(FACTS_FILE, 'utf-8'));
  }
  return [
    { id: 1, text: 'Honey never spoils.' },
    { id: 2, text: 'Bananas are berries.' },
    { id: 3, text: 'A group of flamingos is called a "flamboyance".' }
  ];
}

function saveFacts(facts: FunFact[]) {
  fs.writeFileSync(FACTS_FILE, JSON.stringify(facts, null, 2));
}

let facts: FunFact[] = loadFacts();
let nextId = facts.length ? Math.max(...facts.map(f => f.id)) + 1 : 1;

app.get('/fun-fact', (req, res) => {
  if (!facts.length) return res.json({ error: 'No facts available.' });
  const fact = facts[Math.floor(Math.random() * facts.length)];
  res.json(fact);
});

app.post('/add-fact', (req, res) => {
  const { text, addedBy } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Fact text is required.' });
  }
  const newFact: FunFact = { id: nextId++, text, addedBy };
  facts.push(newFact);
  saveFacts(facts);
  res.json(newFact);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mastra Fun Fact agent running on port ${PORT}`);
});
