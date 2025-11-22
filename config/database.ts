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
        host: env("DATABASE_HOST", "127.0.0.1"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "strapi"),
        user: env("DATABASE_USERNAME", "strapi"),
        password: env("DATABASE_PASSWORD", "strapi"),
        ssl: env.bool("DATABASE_SSL", false) && {
          rejectUnauthorized: false,
        },
      },
    },
  };

  const connection = connections[client];

  if (!connection) {
    throw new Error(`Unknown DATABASE_CLIENT value: ${client}`);
  }

  return {
    connection,
  };
};

