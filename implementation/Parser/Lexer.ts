import * as moo from "moo";
import { Token } from "../Util/Token";
import { ParserError } from "./Parser";
export const lexerDef = {
  WS: /[ \t]+/,
  comment: /\/\/.*?$/,
  number: /\d*\.?\d+/,
  string: /"(?:\\["\\]|[^\n"\\])*"/,
  lparen: "(",
  rparen: ")",
  lbrack: "{",
  rbrack: "}",
  keyword: [
    "true",
    "false",
    "var",
    "if",
    "else",
    "while",
    "for",
    "function",
    "null",
    "return",
    "class",
    "export",
    "from",
    "import",
  ],
  NL: { match: /\n/, lineBreaks: true },
  operator: [
    "+",
    "-",
    "*",
    "/",
    "<",
    "<=",
    ">=",
    ">",
    "==",
    "!=",
    "!",
    "and",
    "or",
    "=",
    "var",
  ],
  semi: ";",
  comma: ",",
  dot: ".",
  identifier: /\w+/,
  error: moo.error,
};
const lexer = moo.compile(lexerDef);
export function tokens(str: string): Token[] {
  lexer.reset(str);
  const tokens: moo.Token[] = [...lexer];
  if (tokens[tokens.length - 1] && tokens[tokens.length - 1].type === "error") {
    const errToken = tokens[tokens.length - 1];
    //@ts-expect-error
    throw new ParserError({ ...errToken, isToken: true }, "Failed to tokenize");
  }
  //@ts-expect-error
  return tokens
    .filter((v) => v.type !== "WS" && v.type !== "comment" && v.type !== "NL")
    .map((v) => ({ ...v, isToken: true }));
}
