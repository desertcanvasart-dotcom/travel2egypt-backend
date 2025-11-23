export default ({ env }) => {
  const client = env("DATABASE_CLIENT", "sqlite");

  const connections: Record<string, any> = {
    sqlite: {
      client: "sqlite",
      connection: {
        filename: env("DATABASE_FILENAME", ".tmp/data.db"),
      },
      useNullAsDefault: true,
    },
    postgres: {
      client: "postgres",
      connection: {
        connectionString: env("DATABASE_URL"),
        ssl: env.bool("DATABASE_SSL", false) && {
          rejectUnauthorized: env.bool("DATABASE_SSL_REJECT_UNAUTHORIZED", false),
        },
      },
      pool: {
        min: env.int("DATABASE_POOL_MIN", 2),
        max: env.int("DATABASE_POOL_MAX", 10),
      },
    },
  };

  const connection = connections[client];

  if (!connection) {
    throw new Error(`Unknown DATABASE_CLIENT value: ${client}`);
  }

  return {
    connection,
    settings: {
      autoMigration: true, // 🔥 THIS IS THE KEY!
    },
  };
};
