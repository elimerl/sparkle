import { Parser } from "../implementation/Parser/Parser";
import test from "ava";
import { tokens } from "../implementation/Parser/Lexer";
import { Stmt } from "../implementation/Parser/Stmt";
import {
  Interpreter,
  LoxFunction,
} from "../implementation/Interpreter/Interpreter";

const parse = (code: string) => new Parser(tokens(code)).parse();
const interp = (code: string) => {
  const interpreter = new Interpreter({
    pretty: false,
    moduleFolder: __dirname + "/moduleFolder/",
  });
  return { interpreter, result: interpreter.interpret(parse(code)) };
};
test("Exporting", (t) => {
  const { interpreter } = interp(`var moo = "Cow";
  function fn() {
  	return "Hello world!";
  }
  export moo;
  export fn;`);
  t.is(interpreter.exports.get("moo"), "Cow");
  t.assert(interpreter.exports.get("fn") instanceof LoxFunction);
});
test("Importing", (t) => {
  t.is(interp("from moo import fn;fn()").result, 1);
});
