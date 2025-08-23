#!/usr/bin/env node

/**
 * generate-types.js
 * ----------------
 * Reads your NestJS Entity classes (with .entity.ts) and emits matching
 * TS interfaces—including inherited properties—using ts-morph.
 *
 * Usage:
 *   pnpm run generate:types
 */

import fs from 'fs';
import path from 'path';
import {glob} from 'glob';
import { Project, SyntaxKind } from 'ts-morph';
import { fileURLToPath } from 'url';

// Shim __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generate() {
  // Initialize ts-morph with your backend tsconfig
  const project = new Project({
    tsConfigFilePath: path.join(__dirname, '../../heartly-backend/tsconfig.json'),
  });

  // Match all .entity.ts files
  const entityFiles = glob.sync(
    path.join(__dirname, '../../heartly-backend/src/**/*.entity.ts')
  );

  // Prepare output directory
  const outDir = path.join(__dirname, '../../heartly-frontend/generated/types');
  fs.mkdirSync(outDir, { recursive: true });

  for (const filePath of entityFiles) {
    const source = project.addSourceFileAtPath(filePath);
    const classes = source.getClasses().filter(c => c.isExported());

    for (const cls of classes) {
      const typeName = cls.getName();
      if (!typeName) continue;
      console.log(`Generating ${typeName}…`);

      // Recursively collect properties from class and its base classes
      const collectProps = (c) => {
        let props = [];
        // Own properties
        for (const member of c.getMembers()) {
          if (member.getKind() === SyntaxKind.PropertyDeclaration) {
            const name = member.getName();
            const optional = member.hasQuestionToken();
            const typeText = member.getType().getText(member);
            props.push({ name, type: typeText, optional });
          }
        }
        // Base class
        const base = c.getBaseClass();
        if (base) {
          props = [...collectProps(base), ...props];
        }
        return props;
      };

      const props = collectProps(cls);

      // Build interface string
      const lines = [`export interface ${typeName} {`];
      for (const { name, type, optional } of props) {
        lines.push(`  ${name}${optional ? '?' : ''}: ${type};`);
      }
      lines.push('}');

      const iface = lines.join('\n') + '\n';
      const outFile = path.join(outDir, `${typeName}.d.ts`);
      fs.writeFileSync(outFile, iface, 'utf8');
      console.log(` → ${typeName}.d.ts`);
    }
  }
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
