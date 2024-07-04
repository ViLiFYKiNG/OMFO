// FOR MIGRATION GENERATION
npm run migration:generate -- src/migration/[MIGRATION_NAME] -d src/config/data-source.ts

//FOR MIGRATION RUN
npm run migration:run -- -d src/config/data-source.ts
