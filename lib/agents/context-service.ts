import fs from 'fs';
import path from 'path';

/**
 * Reads the Prisma schema to give the agent understanding of the database.
 */
function getDatabaseSchema(): string {
  try {
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    if (fs.existsSync(schemaPath)) {
      return fs.readFileSync(schemaPath, 'utf-8');
    }
    return '// schema.prisma not found';
  } catch (error) {
    console.error('Failed to read schema:', error);
    return '// Error reading schema';
  }
}

/**
 * Reads package.json to understand installed dependencies and stack.
 */
function getPackageContext(): string {
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packagePath)) {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

      const relevantDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      };

      // Filter for key technologies to kep content size manageable
      const keyTechs = [
        'next', 'react', 'typescript', 'tailwindcss', 'prisma',
        'lucide-react', 'framer-motion', 'zod', 'ai', 'openai', 'next-auth'
      ];

      const filteredDeps = Object.keys(relevantDeps)
        .filter(key => keyTechs.some(tech => key.includes(tech)))
        .join(', ');

      return `Detected Stack: ${filteredDeps}`;

      // ... (skipping unchanged lines in thought, verify locally) - I will use specific chunks

    } catch (error) {
      return '// Error reading package context';
    }
  }

// ...

        if (item.isDirectory()) {
    lines.push(`- ${relativePath}/`);
    lines = [...lines, ...getStructure(path.join(dir, item.name), depth + 1)];
  } else if (item.name.endsWith('page.tsx') || item.name.endsWith('layout.tsx') || item.name.endsWith('route.ts')) {
    lines.push(`- ${relativePath}`);
  }
  // ...
  return `
=== ACTIVE PROJECT CONTEXT ===

--- DATABASE SCHEMA (Prisma) ---
${schema}

--- TECH STACK ---
${deps}

--- PROJECT STRUCTURE (Key Files) ---
${structure}

==============================
Use this context to write code that perfectly matches the existing project.
If the user asks for a new feature, use existing DB models if possible.
If the user asks for UI, use existing Tailwind patterns visible in the structure.
`;
}
