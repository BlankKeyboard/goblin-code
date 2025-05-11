export class LairBuilder {
  private level = 1;
  private readonly features = [
    "Workbench of suspiciously good ideas",
    "Shortcut tunnel to the build folder",
    "Wall of named TODOs",
    "Trapdoor for scope creep",
    "Lantern rack for debugging sessions"
  ];

  constructor(private readonly name: string) {}

  upgradeLair(): number {
    this.level += 1;
    return this.level;
  }

  getLairStatus(): string {
    return `${this.name}\nLevel: ${this.level}\nFeatures unlocked: ${this.getFeatures().length}`;
  }

  getFeatures(): string[] {
    return this.features.slice(0, Math.max(0, this.level - 1));
  }
}
