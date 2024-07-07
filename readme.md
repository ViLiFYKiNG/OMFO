// HELLO ANSHU BABU
// FOR MIGRATION GENERATION
npm run migration:generate -- src/migration/[MIGRATION_NAME] -d <path/to/datasource>

//FOR MIGRATION RUN
npm run migration:run -- -d <path/to/datasource>

//FOR MIGRATION CREATE
typeorm migration:generate -d <path/to/datasource> path/to/migrations/<migration-name>

// READ PRIVSTE KEY FORM FILE
let privateKey: Buffer;

    try {
      privateKey = fs.readFileSync(
        path.join(__dirname, '../../certs/private.pem'),
      );
    } catch (err) {
      const error = createHttpError(
        500,
        'Fail to read private key. Make sure the private.pem file is present in the certs folder.',
      );

      throw error;
    }
