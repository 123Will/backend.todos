"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
async function init() {
    const db = await (0, database_1.openDb)();
    await db.exec(`
    CREATE TABLE IF NOT EXISTS rides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id TEXT NOT NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      distance REAL NOT NULL,
      duration TEXT NOT NULL,
      driver_id INTEGER NOT NULL,
      driver_name TEXT NOT NULL,
      value REAL NOT NULL,
      date TEXT NOT NULL
    );
  `);
    await db.close();
    console.log('Database initialized');
}
init();
