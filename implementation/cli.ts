import { Interpreter } from "./Interpreter/Interpreter";
import { tokens } from "./Parser/Lexer";
import { Parser } from "./Parser/Parser";
import { Command } from "commander";
import { readFileSync, existsSync } from "fs";
import { join, normalize, resolve, extname, dirname } from "path";

import { sync as pkgDir } from "pkg-dir";
const dir = pkgDir(__dirname);
const pkgJson = JSON.parse(
  readFileSync(join(dir, "package.json")).toString()
) as {
  version: string;
  name: string;
};
const program = new Command();
program.name(pkgJson.name);
program.description("The Sparkle programming language CLI");
program.version(pkgJson.version);
program.usage("<file to run> [options]");
program.arguments("<file>");
program.parse();
const file = program.args[0];
if (!file) {
  console.log("file not specified");
  process.exit(1);
}
const normalized = resolve(process.cwd(), normalize(file));
if (!existsSync(normalized)) {
  console.log("cannot find file");
  process.exit(1);
}
if (extname(normalized) !== ".sparkle") {
  console.log("not a .sparkle file");
  process.exit(1);
}
const prog = readFileSync(normalized, "utf-8");
const lexed = tokens(prog);
const parser = new Parser(lexed);
const ast = parser.parse();
const interpreter = new Interpreter({
  pretty: true,
  moduleFolder: dirname(normalized),
});
interpreter.interpret(ast);
