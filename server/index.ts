import express, { type NextFunction, type Request, type Response } from "express";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes, randomUUID, scryptSync } from "node:crypto";

type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  name: string;
  partnerName: string;
  anniversaryDate: string;
  createdAt: string;
};

type SessionRecord = {
  token: string;
  userId: string;
  createdAt: string;
};

type MemoryRecord = {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  createdAt: string;
};

type DatabaseShape = {
  users: UserRecord[];
  sessions: SessionRecord[];
  memories: MemoryRecord[];
};

type AuthenticatedRequest = Request & {
  user: UserRecord;
  token: string;
};

const PORT = Number(process.env.PORT ?? 3001);
const dataFile = path.resolve(process.cwd(), "server", "data.json");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

async function ensureDbFile() {
  try {
    await fs.access(dataFile);
  } catch {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(
      dataFile,
      JSON.stringify({ users: [], sessions: [], memories: [] } satisfies DatabaseShape, null, 2),
      "utf8"
    );
  }
}

async function readDb(): Promise<DatabaseShape> {
  await ensureDbFile();
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw) as DatabaseShape;
}

async function writeDb(db: DatabaseShape) {
  await fs.writeFile(dataFile, JSON.stringify(db, null, 2), "utf8");
}

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString("hex");
}

function createPasswordRecord(password: string) {
  const salt = randomBytes(16).toString("hex");
  return {
    salt,
    passwordHash: hashPassword(password, salt),
  };
}

function serializeUser(user: UserRecord) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    partnerName: user.partnerName,
    anniversaryDate: user.anniversaryDate,
    createdAt: user.createdAt,
  };
}

function requireFields(body: Record<string, unknown>, fields: string[]) {
  for (const field of fields) {
    const value = body[field];
    if (typeof value !== "string" || !value.trim()) {
      return field;
    }
  }
  return null;
}

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  const db = await readDb();
  const session = db.sessions.find((entry) => entry.token === token);
  const user = session ? db.users.find((entry) => entry.id === session.userId) : null;

  if (!session || !user) {
    res.status(401).json({ error: "Session expired. Please log in again." });
    return;
  }

  (req as AuthenticatedRequest).user = user;
  (req as AuthenticatedRequest).token = token;
  next();
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/register", async (req, res) => {
  const missing = requireFields(req.body ?? {}, [
    "email",
    "password",
    "name",
    "partnerName",
    "anniversaryDate",
  ]);

  if (missing) {
    res.status(400).json({ error: `${missing} is required.` });
    return;
  }

  const email = String(req.body.email).trim().toLowerCase();
  const password = String(req.body.password);
  const name = String(req.body.name).trim();
  const partnerName = String(req.body.partnerName).trim();
  const anniversaryDate = String(req.body.anniversaryDate);

  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters." });
    return;
  }

  const db = await readDb();
  if (db.users.some((user) => user.email === email)) {
    res.status(409).json({ error: "An account with that email already exists." });
    return;
  }

  const passwordRecord = createPasswordRecord(password);
  const user: UserRecord = {
    id: randomUUID(),
    email,
    passwordHash: passwordRecord.passwordHash,
    salt: passwordRecord.salt,
    name,
    partnerName,
    anniversaryDate,
    createdAt: new Date().toISOString(),
  };
  const token = randomBytes(32).toString("hex");

  db.users.push(user);
  db.sessions.push({
    token,
    userId: user.id,
    createdAt: new Date().toISOString(),
  });

  await writeDb(db);
  res.status(201).json({ token, user: serializeUser(user) });
});

app.post("/api/auth/login", async (req, res) => {
  const missing = requireFields(req.body ?? {}, ["email", "password"]);
  if (missing) {
    res.status(400).json({ error: `${missing} is required.` });
    return;
  }

  const email = String(req.body.email).trim().toLowerCase();
  const password = String(req.body.password);
  const db = await readDb();
  const user = db.users.find((entry) => entry.email === email);

  if (!user || hashPassword(password, user.salt) !== user.passwordHash) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const token = randomBytes(32).toString("hex");
  db.sessions.push({
    token,
    userId: user.id,
    createdAt: new Date().toISOString(),
  });
  await writeDb(db);

  res.json({ token, user: serializeUser(user) });
});

app.post("/api/auth/logout", authMiddleware, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const db = await readDb();
  db.sessions = db.sessions.filter((session) => session.token !== authReq.token);
  await writeDb(db);
  res.json({ ok: true });
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  res.json({ user: serializeUser(authReq.user) });
});

app.patch("/api/profile", authMiddleware, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const db = await readDb();
  const user = db.users.find((entry) => entry.id === authReq.user.id);

  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const nextName = typeof req.body.name === "string" ? req.body.name.trim() : user.name;
  const nextPartnerName =
    typeof req.body.partnerName === "string" ? req.body.partnerName.trim() : user.partnerName;
  const nextAnniversaryDate =
    typeof req.body.anniversaryDate === "string"
      ? req.body.anniversaryDate
      : user.anniversaryDate;

  user.name = nextName;
  user.partnerName = nextPartnerName;
  user.anniversaryDate = nextAnniversaryDate;

  await writeDb(db);
  res.json({ user: serializeUser(user) });
});

app.get("/api/memories", authMiddleware, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const db = await readDb();
  const memories = db.memories
    .filter((memory) => memory.userId === authReq.user.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  res.json({ memories });
});

app.post("/api/memories", authMiddleware, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const missing = requireFields(req.body ?? {}, ["title", "description", "date"]);
  if (missing) {
    res.status(400).json({ error: `${missing} is required.` });
    return;
  }

  const db = await readDb();
  const memory: MemoryRecord = {
    id: randomUUID(),
    userId: authReq.user.id,
    title: String(req.body.title).trim(),
    description: String(req.body.description).trim(),
    date: String(req.body.date),
    image: typeof req.body.image === "string" ? req.body.image : undefined,
    createdAt: new Date().toISOString(),
  };

  db.memories.push(memory);
  await writeDb(db);
  res.status(201).json({ memory });
});

app.delete("/api/memories/:id", authMiddleware, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const db = await readDb();
  db.memories = db.memories.filter(
    (memory) => !(memory.id === req.params.id && memory.userId === authReq.user.id)
  );
  await writeDb(db);
  res.json({ ok: true });
});

app.delete("/api/account", authMiddleware, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const db = await readDb();
  db.users = db.users.filter((user) => user.id !== authReq.user.id);
  db.memories = db.memories.filter((memory) => memory.userId !== authReq.user.id);
  db.sessions = db.sessions.filter((session) => session.userId !== authReq.user.id);
  await writeDb(db);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Everlasting API running on http://127.0.0.1:${PORT}`);
});
