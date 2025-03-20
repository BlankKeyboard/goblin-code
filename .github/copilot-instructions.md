<!-- Copilot instructions for GoblinCraft CLI project -->

# GoblinCraft CLI - Development Guide

## Project Overview

GoblinCraft is an interactive CLI tool built with TypeScript and Node.js. It's a goblin empire management game where users recruit goblins, steal treasures, build lairs, complete quests, and cast spells.

## Key Project Structure

- **src/cli.ts** - Main entry point using Commander.js framework
- **src/systems/** - Core game systems (engine, treasure, quests, lair)
- **src/commands/** - Command handlers for each feature
- **src/utils/** - Utilities for colors, ASCII art, and helpers
- **src/data/** - JSON files with game data (goblins, treasures, quests, spells)
- **src/config.ts** - Type definitions and configuration

## Technology Stack

- **Language**: TypeScript
- **Runtime**: Node.js 16+
- **CLI Framework**: Commander.js
- **Styling**: Chalk.js
- **Module System**: ES Modules

## Development Workflow

1. **Make changes** to TypeScript files in `src/`
2. **Build**: `npm run build` (compiles to `dist/`)
3. **Test**: `npm start <command>` (runs compiled version)
4. **Dev Mode**: `npm run dev <command>` (runs directly with ts-node)

## Common Commands

```bash
npm install              # Install dependencies
npm run build           # Build TypeScript
npm start welcome       # Show welcome screen
npm start goblin recruit    # Recruit a goblin
npm start hoard steal       # Steal treasure
npm start quest generate    # Generate quest
```

## Architecture Notes

- **GoblinEngine** - Central game state manager
- **Systems** - Modular game mechanics (treasure, quests, lair, spells)
- **Commands** - CLI command handlers using Commander
- **Data** - Procedurally used data files in JSON format

## Adding New Features

1. Create new data in `src/data/<feature>.json`
2. Create system class in `src/systems/<feature>.ts`
3. Create command handler in `src/commands/<feature>.ts`
4. Register command in `src/cli.ts`

## File Naming Conventions

- Systems: PascalCase (e.g., `GoblinEngine`, `TreasureSystem`)
- Commands: kebab-case in CLI, file names match
- Data files: JSON with plural names
- Utilities: kebab-case filenames, exported as modules

## Type Safety

- All interfaces defined in `src/config.ts`
- Use strict TypeScript settings (strict: true)
- Import types explicitly where needed

## Color & Styling

- Use `colors` object from `src/utils/colors.ts`
- Use `symbols` for emoji/unicode characters
- Functions like `printHeader()`, `printSuccess()` for consistency
