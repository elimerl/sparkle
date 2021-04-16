import { Parser } from "../implementation/Parser/Parser";
import test from "ava";
import { tokens } from "../implementation/Parser/Lexer";
import { Stmt } from "../implementation/Parser/Stmt";
import { Interpreter } from "../implementation/Interpreter/Interpreter";

const parse = (code: string) => new Parser(tokens(code)).parse();
const interp = (code: string) =>
  new Interpreter({
    pretty: false,
    moduleFolder: __dirname + "/moduleFolder/",
  }).interpret(parse(code));
// numbers
test("Numbers", (t) => {
  t.is(interp("3"), 3);
  t.is(interp("-3"), -3);
});
test("Simple arithmetic", (t) => {
  t.is(interp("1 + 1"), 2);
  t.is(interp("2 * 2"), 4);
  t.is(interp("4 / 2"), 2);
  t.is(interp("1 - 1"), 0);
});
test("Arithmetic with precedence", (t) => {
  t.is(interp("1 + 2 * 3"), interp("1 + (2 * 3)"));
});
test("Unary invert number", (t) => {
  t.is(interp("-(1 + 3)"), -4);
});
test("Decimal", (t) => {
  t.is(interp("1.3 + 3"), 4.3);
});
// booleans
test("Booleans", (t) => {
  t.is(interp("true"), true);
  t.is(interp("false"), false);
});
test("Unary not", (t) => {
  t.is(interp("!true"), false);
});
// Strings
test("Strings", (t) => {
  t.is(interp('"Moo"'), "Moo");
});
test("Concatenating", (t) => {
  t.is(interp('"a" + "b"'), "ab");
});
