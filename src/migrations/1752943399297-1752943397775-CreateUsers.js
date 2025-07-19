/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export class MCreateUsers1752943397775 {
    name = 'MCreateUsers1752943397775'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`age\` int NOT NULL, \`email\` varchar(100) NOT NULL, \`address\` varchar(255) NOT NULL, \`occupation\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE \`users\``);
    }
}
