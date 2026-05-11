type Painter = (value: string) => string;

const code = (open: number, close = 39): Painter => {
  return (value: string) => `\x1b[${open}m${value}\x1b[${close}m`;
};

export const colors = {
  bold: code(1, 22),
  dim: code(2, 22),
  danger: code(31),
  goblin: code(32),
  info: code(36),
  mystical: code(35),
  success: code(32),
  treasure: code(33),
  warning: code(33),
  frame: code(90),
  title: code(96)
};

export const symbols = {
  check: "[ok]",
  coin: "[gold]",
  gem: "[gem]",
  goblin: "[goblin]",
  lair: "[lair]",
  quest: "[quest]",
  scroll: "[scroll]",
  sparkles: "[spark]",
  spell: "[spell]",
  sword: "[str]",
  treasure: "[treasure]"
};
