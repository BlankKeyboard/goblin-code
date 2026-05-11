# Goblin-code

```81XYBmugKJ7SEKLBHeJ4KMQ14wXVCjZdGUxsA6ctpump```

> A mischievous TypeScript CLI that turns vague coding sparks into named quests, useful project plans, and tiny goblin empire rituals.

Goblin-code is part developer tool, part project oracle, part command-line toy box. It helps you take a messy idea like "make my repo cooler" and get back something you can actually act on: a codename, pitch, constraints, file structure, next commands, and a few weirdly practical quests.

It also contains a miniature goblin empire simulator because useful tools are better when they have a little smoke coming out of them.

```bash
goblin-code conjure "a terminal app that helps me finish side projects"
goblin-code oracle "find the next useful improvement" .
goblin-code goblin mode
goblin-code goblin recruit
goblin-code quest generate
```

```81XYBmugKJ7SEKLBHeJ4KMQ14wXVCjZdGUxsA6ctpump```

## What It Is

Goblin-code is built around two connected modes:

| Mode | Commands | Purpose |
| --- | --- | --- |
| Workshop | `conjure`, `name`, `rune`, `inspect`, `horde` | Turn ideas and folders into structured next steps. |
| Empire | `goblin`, `quest`, `hoard`, `lair`, `spell` | Play with a tiny goblin-flavored productivity sim. |

The workshop side is deterministic and automation-friendly. The empire side is deliberately theatrical: recruit goblins, generate quests, collect treasure, upgrade your lair, and learn spells that sound suspiciously like good engineering habits.

## Installation

Requirements:

- Node.js 18 or newer
- npm

```bash
npm install
npm run build
```

Run from source during development:

```bash
npm run dev -- conjure "a CLI for taming TODO lists"
npm run dev -- oracle "review this repo for missing tests" .
npm run dev -- goblin mode
```

Run after building:

```bash
node dist/cli.js conjure "a CLI for taming TODO lists"
```

If you link the package locally:

```bash
npm link
goblin-code --help
goblin-code goblin mode
goblin --help
```

## Quick Start

```bash
# Turn a vague idea into a buildable plan
goblin-code conjure "a cozy terminal dashboard for habits"

# Generate a goblin-style project codename
goblin-code name "terminal productivity app"

# Create a tiny deterministic rune from any phrase
goblin-code rune "ship the thing"

# Inspect a project folder and get practical signals
goblin-code inspect .

# Open the strange inventory drawer
goblin-code horde
```

Machine-readable mode:

```bash
goblin-code conjure "a tiny multiplayer dungeon planner" --json
goblin-code inspect . --json
```

## OpenAI Oracle

`oracle` turns Goblin-code into a useful repo-aware assistant. It reads a bounded snapshot of the current project and asks OpenAI for a concise engineering report.

Set your API key first:

```bash
export OPENAI_API_KEY="your_api_key_here"
```

Then ask a codebase question:

```bash
npm run dev -- oracle "find the riskiest TODOs and missing tests" .
npm run dev -- oracle "suggest the smallest useful feature to build next" .
npm run dev -- oracle "review this CLI for confusing user experience" .
```

By default it uses `gpt-5`. You can override that:

```bash
GOBLIN_OPENAI_MODEL="gpt-5-mini" npm run dev -- oracle "summarize this repo" .
```

## Command Grimoire

### `conjure`

Transforms a loose idea into a compact project brief.

```bash
goblin-code conjure "a local-first notebook for game masters"
```

Returns:

- codename
- one-line pitch
- goblin omen
- feature quests
- constraints
- starter file structure
- next shell commands

Use this when the project is still foggy and you need the first concrete shape.

### `name`

Generates a stable goblin-flavored name from input text.

```bash
goblin-code name "AI notebook"
```

The same input gives the same name, which makes it handy for repeatable prototypes, branches, and little internal tools.

### `rune`

Creates a deterministic pseudo-rune.

```bash
goblin-code rune "finish README"
```

Good for build labels, secret-ish project tags, placeholder release names, or dramatic terminal output.

### `inspect`

Scans a folder and reports project signals.

```bash
goblin-code inspect .
```

It looks for things like:

- `package.json`
- `tsconfig.json`
- `README.md`
- `src/`
- test folders
- smoke scripts

It ignores heavy/generated folders such as `node_modules`, `dist`, `.git`, `.next`, and `coverage`.

### `horde`

Prints a small inventory of odd developer artifacts.

```bash
goblin-code horde
```

This command is mostly for flavor, but the items are meant to nudge real work: break down features, delete dead code, improve configs, and ship something small.

## Empire Commands

The empire commands are powered by a tiny in-memory simulation. They are playful on purpose, but each action maps to the same spirit as the workshop commands: make progress visible.

```bash
goblin-code goblin recruit
goblin-code goblin list
goblin-code goblin status
```

For the most visual demo, launch the interactive terminal interface:

```bash
goblin-code goblin mode
```

Inside goblin mode, try:

```text
recruit
quest
steal
ask review this repo for missing tests
status
help
exit
```

```bash
goblin-code quest generate
goblin-code quest list
goblin-code quest complete
```

```bash
goblin-code hoard steal
goblin-code hoard list
goblin-code hoard value
```

```bash
goblin-code lair view
goblin-code lair upgrade
goblin-code lair features
```

```bash
goblin-code spell learn
goblin-code spell cast
goblin-code spell grimoire
```

Current empire state is kept in memory for a single process run. Persistence would be an excellent future upgrade.

## Example Output

```text
Goblin-code workshop CLI for unruly ideas

Moss Wrench
A CLI concept that turns "make my repo cooler" into a tangible, shippable artifact.

Omen: Your first version should feel like a tool stolen from the future.

Quests
  - Forge one delightful command around: make my repo cooler.
  - Add a plain JSON mode so the magic can feed other tools.
  - Make the default output beautiful enough that people want to run it twice.
  - Create one inspection command that helps users understand their current workspace.
```

## Architecture

```text
src/
  cli.ts                 Main entrypoint and command router
  commands/
    conjure.ts           Idea forge command
    inspect.ts           Folder inspection command
    name.ts              Name and rune commands
    horde.ts             Flavor inventory command
    empire.ts            Commander bridge for empire commands
    goblin.ts            Goblin army actions
    quest.ts             Quest actions
    hoard.ts             Treasure actions
    lair.ts              Lair actions
    spells.ts            Spell actions
  core/
    conjure.ts           Deterministic plan/name/rune generation
    inspect.ts           Local project inspection
    format.ts            Terminal and JSON output formatting
    hash.ts              Stable hashing helpers
  systems/
    goblinEngine.ts      In-memory empire state
    questGenerator.ts    Random quest generation
    treasureSystem.ts    Treasure generation and value math
    lairBuilder.ts       Lair upgrade model
  data/
    goblinWords.ts       Name parts, omens, horde items
    spells.json          Spell definitions
  utils/
    colors.ts            ANSI colors and symbols
    helpers.ts           Output and random helpers
  types.ts               Shared TypeScript interfaces
```

## Design Principles

- Local first: core commands do not require network access or API keys.
- Scriptable: important workshop commands support `--json`.
- Fast first run: output should appear immediately.
- Small modules: command routing, generation, formatting, and systems live separately.
- Useful before clever: every joke should still point toward a real developer action.
- Weird enough to remember: the CLI should feel like a tool someone actually wants to run.

## Development

```bash
npm install
npm run build
npm run smoke
```

Useful scripts:

| Script | What it does |
| --- | --- |
| `npm run dev -- <command>` | Runs the CLI from TypeScript with `tsx`. |
| `npm run build` | Compiles TypeScript into `dist/`. |
| `npm run start -- <command>` | Runs the compiled CLI. |
| `npm run check` | Type-checks without emitting files. |
| `npm run smoke` | Builds, runs `conjure --json`, and inspects the repo. |

Example development loop:

```bash
npm run dev -- conjure "a spooky changelog assistant"
npm run dev -- inspect .
npm run check
```

## JSON Output

`conjure`, `name`, `rune`, and `inspect` support `--json`.

```bash
goblin-code conjure "a visual git history explorer" --json
```

That makes Goblin-code usable inside scripts:

```bash
node dist/cli.js conjure "release checklist generator" --json
```

The JSON shape is intentionally plain: strings, arrays, and small objects. No hidden terminal escape codes, no network-only fields, no surprise side effects.

## Roadmap

Ideas that would fit naturally:

- Persistent empire state in a local `.goblin-code/` folder.
- `goblin-code scaffold` to create starter project files from a conjured plan.
- `goblin-code daily` to generate a small quest list from repo inspection.
- `goblin-code readme` to draft a project README from package metadata.
- Configurable themes for terminal output.
- Test coverage around deterministic generation and folder inspection.
- More structured JSON schemas for automation.

## Philosophy

Most project tools pretend software is orderly. Goblin-code assumes the beginning of a project is usually a pile of sparks, half-names, ambition, stale snacks, and one command that almost works.

So the CLI does not ask you to be perfectly clear before you start. It gives the idea a name, breaks the fog into quests, and hands you the next command.

That is the whole spell: make the next step visible.

## License

MIT
