// FOR MIGRATION GENERATION
npm run migration:generate -- src/migration/[MIGRATION_NAME] -d <path/to/datasource>

//FOR MIGRATION RUN
npm run migration:run -- -d <path/to/datasource>

//FOR MIGRATION CREATE
typeorm migration:generate -d <path/to/datasource> path/to/migrations/<migration-name>
