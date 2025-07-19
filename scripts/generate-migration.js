import fs from 'fs';
import { execSync } from 'child_process';
import { argv } from 'process';
import path from 'path';

const name = argv[2] || 'Migration';
const timestamp = Date.now();
const fileName = `src/migrations/${timestamp}-${name}`;
const className = `M${name}${timestamp}`.replace(/[^a-zA-Z0-9]/g, '');

const command = `npx typeorm-ts-node-esm migration:generate ${fileName} -d src/config/database.js --outputJs`;

try {
    console.log(`Generating migration: ${fileName}.js`);
    execSync(command, { stdio: 'inherit' });

    // Find the most recent .js migration file
    const files = fs.readdirSync('src/migrations')
        .filter(f => f.endsWith('.js'))
        .map(f => ({
            name: f,
            time: fs.statSync(path.join('src/migrations', f)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);

    if (!files.length) {
        throw new Error('No migration file found.');
    }

    const latestFile = `src/migrations/${files[0].name}`;
    let content = fs.readFileSync(latestFile, 'utf-8');

    // Replace CommonJS export with ES module export
    // 1) Replace "module.exports = class OldName" → "export class NewName"
    content = content.replace(/module\.exports\s*=\s*class\s+(\w+)/, `export class ${className}`);

    // 2) Replace old class name in the `name` property, e.g. name = 'OldName'
    content = content.replace(/name\s*=\s*['"`][\w\d]+['"`]/, `name = '${className}'`);

    fs.writeFileSync(latestFile, content);

    console.log(`Updated class name and export in ${files[0].name} to ${className}`);
} catch (err) {
    console.error('Migration generation failed:', err.message);
}
