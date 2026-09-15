import { pool } from "../db/pool.js";

const SELECT_COLS = `
  id, tour, discipline, rank, previous_rank, points, ranking_as_of,
  first_name, last_name, display_name, country_code, date_of_birth, height_cm,
  handedness, backhand, turned_pro_year, career_high_rank, career_high_date,
  career_titles, grand_slam_titles, ytd_wins, ytd_losses,
  prize_money_career_usd, prize_money_ytd_usd,
  photo_url, coach, birthplace, residence, bio
`;

/** Map DB row to API Player JSON (camelCase). */
export function rowToPlayer(row) {
  return {
    id: row.id,
    tour: row.tour,
    discipline: row.discipline,
    rank: row.rank,
    previousRank: row.previous_rank,
    points: row.points,
    rankingAsOf:
      row.ranking_as_of instanceof Date
        ? row.ranking_as_of.toISOString().slice(0, 10)
        : String(row.ranking_as_of).slice(0, 10),
    firstName: row.first_name,
    lastName: row.last_name,
    displayName: row.display_name,
    countryCode: row.country_code.trim(),
    dateOfBirth:
      row.date_of_birth instanceof Date
        ? row.date_of_birth.toISOString().slice(0, 10)
        : String(row.date_of_birth).slice(0, 10),
    heightCm: row.height_cm,
    handedness: row.handedness,
    backhand: row.backhand,
    turnedProYear: row.turned_pro_year,
    careerHighRank: row.career_high_rank,
    careerHighDate:
      row.career_high_date instanceof Date
        ? row.career_high_date.toISOString().slice(0, 10)
        : String(row.career_high_date).slice(0, 10),
    careerTitles: row.career_titles,
    grandSlamTitles: row.grand_slam_titles,
    ytdWins: row.ytd_wins,
    ytdLosses: row.ytd_losses,
    prizeMoneyCareerUsd: Number(row.prize_money_career_usd),
    prizeMoneyYtdUsd: Number(row.prize_money_ytd_usd),
    photoUrl: row.photo_url,
    coach: row.coach,
    birthplace: row.birthplace,
    residence: row.residence,
    bio: row.bio,
  };
}

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

const REQUIRED_STRINGS = ["id", "tour", "discipline", "firstName", "lastName", "displayName"];

/** Minimal body validation before write. */
export function validatePlayer(body) {
  if (!body || typeof body !== "object") return "Request body must be a JSON object.";
  for (const key of REQUIRED_STRINGS) {
    if (typeof body[key] !== "string" || body[key].trim() === "") {
      return `Missing or invalid field: ${key}`;
    }
  }
  if (typeof body.countryCode !== "string" || !/^[A-Za-z]{2}$/.test(body.countryCode)) {
    return "countryCode must be a 2-letter code.";
  }
  return null;
}

export async function listPlayers() {
  const { rows } = await pool.query(
    `SELECT ${SELECT_COLS} FROM players ORDER BY rank ASC`,
  );
  return rows.map(rowToPlayer);
}

export async function getPlayerById(id) {
  const { rows } = await pool.query(`SELECT ${SELECT_COLS} FROM players WHERE id = $1`, [id]);
  return rows[0] ? rowToPlayer(rows[0]) : null;
}

export async function createPlayer(player) {
  const { rows } = await pool.query(
    `
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
    RETURNING ${SELECT_COLS}
    `,
    playerToParams({ ...player, countryCode: player.countryCode.toUpperCase() }),
  );
  return rowToPlayer(rows[0]);
}

export async function updatePlayer(id, player) {
  const { rows } = await pool.query(
    `
    UPDATE players SET
      tour = $2, discipline = $3, rank = $4, previous_rank = $5, points = $6,
      ranking_as_of = $7, first_name = $8, last_name = $9, display_name = $10,
      country_code = $11, date_of_birth = $12, height_cm = $13,
      handedness = $14, backhand = $15, turned_pro_year = $16,
      career_high_rank = $17, career_high_date = $18,
      career_titles = $19, grand_slam_titles = $20, ytd_wins = $21, ytd_losses = $22,
      prize_money_career_usd = $23, prize_money_ytd_usd = $24,
      photo_url = $25, coach = $26, birthplace = $27, residence = $28, bio = $29
    WHERE id = $1
    RETURNING ${SELECT_COLS}
    `,
    playerToParams({ ...player, id, countryCode: player.countryCode.toUpperCase() }),
  );
  return rows[0] ? rowToPlayer(rows[0]) : null;
}

export async function deletePlayer(id) {
  const { rowCount } = await pool.query("DELETE FROM players WHERE id = $1", [id]);
  return rowCount > 0;
}
