import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { pool } from "./pool.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const INSERT_SQL = `
INSERT INTO players (
  id, tour, discipline, rank, previous_rank, points, ranking_as_of,
  first_name, last_name, display_name, country_code, date_of_birth, height_cm,
  handedness, backhand, turned_pro_year, career_high_rank, career_high_date,
  career_titles, grand_slam_titles, ytd_wins, ytd_losses,
  prize_money_career_usd, prize_money_ytd_usd,
  photo_url, coach, birthplace, residence, bio
) VALUES (
  $1, $2, $3, $4, $5, $6, $7,
  $8, $9, $10, $11, $12, $13,
  $14, $15, $16, $17, $18,
  $19, $20, $21, $22,
  $23, $24,
  $25, $26, $27, $28, $29
)
ON CONFLICT (id) DO NOTHING
`;

function playerToParams(p) {
  return [
    p.id,
    p.tour,
    p.discipline,
    p.rank,
    p.previousRank,
    p.points,
    p.rankingAsOf,
    p.firstName,
    p.lastName,
    p.displayName,
    p.countryCode,
    p.dateOfBirth,
    p.heightCm,
    p.handedness,
    p.backhand,
    p.turnedProYear,
    p.careerHighRank,
    p.careerHighDate,
    p.careerTitles,
    p.grandSlamTitles,
    p.ytdWins,
    p.ytdLosses,
    p.prizeMoneyCareerUsd,
    p.prizeMoneyYtdUsd,
    p.photoUrl,
    p.coach,
    p.birthplace,
    p.residence,
    p.bio,
  ];
}

/** Insert mock roster when the table is empty. */
export async function seedIfEmpty() {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM players");
  if (rows[0].count > 0) {
    console.log("Seed skipped: players table already has data.");
    return;
  }

  const seedPath = join(__dirname, "../data/players.seed.json");
  const players = JSON.parse(readFileSync(seedPath, "utf8"));

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const p of players) {
      await client.query(INSERT_SQL, playerToParams(p));
    }
    await client.query("COMMIT");
    console.log(`Seeded ${players.length} players.`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/** CLI entry: npm run db:seed */
async function main() {
  const { initDb } = await import("./init.js");
  await initDb();
  await seedIfEmpty();
  await pool.end();
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
