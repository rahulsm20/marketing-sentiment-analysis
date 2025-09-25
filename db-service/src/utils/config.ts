export const config = {
  PORT: process.env.PORT || 4004,
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/postgres",
};
