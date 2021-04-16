import { resolve, join } from "path";
import { existsSync, readdirSync, readFileSync } from "fs";
const std = readdirSync(join(__dirname, "std")).map((v) =>
  v.replace(/(.ts|.js)$/, "")
);
import {
  Assign,
  Binary,
  Call,
  Export,
  Expr,
  ExprVisitor,
  Get,
  Grouping,
  Literal,
  Logical,
  Set,
  Super,
  This,
  Unary,
  Variable,
} from "../Parser/Expr";
import {
  StmtVisitor,
  Expression,
  Print,
  Stmt,
  Var,
  Block,
  If,
  While,
  Function,
  Return,
  Class,
  Import,
} from "../Parser/Stmt";
import { Unparser } from "../Parser/Unparse";
import { Token } from "../Util/Token";
import { pretty, stringify } from "../Util/util";
import { Environment, EnvironmentError } from "./Environment";
import { Resolver } from "./Resolver";
import { Parser } from "../Parser/Parser";
import { tokens } from "../Parser/Lexer";
export interface IInterpreterOptions {
  pretty: boolean;
  moduleFolder: string;
}
export enum FunctionType {
  METHOD,
  FUNCTION,
  NONE,
}
export enum ClassType {
  CLASS,
  SUBCLASS,
  NONE,
}
export type LoxType =
  | null
  | number
  | string
  | boolean
  | LoxCallable
  | LoxClass
  | LoxInstance;
export class Interpreter implements ExprVisitor<LoxType>, StmtVisitor<LoxType> {
  globals: Environment = new Environment();
  locals: Map<Expr, number> = new Map();
  exports: Map<string, LoxType> = new Map();
  environment = this.globals;
  constructor(readonly options: IInterpreterOptions) {
    this.globals.define(
      "clock",
      new ForeignFunction(() => {
        return Date.now() / 1000;
      }, 0)
    );
  }
  /**
   *
   * @param name The module name.
   * @returns An object of the module exports.
   *
   * If the module being imported exports `Test` as `"Moo"`, this function should return `{Test: "Moo"}`.
   */
  getModule(name: string): Record<string, LoxType> {
    const possibleLocalName = resolve(
      this.options.moduleFolder,
      name + ".sparkle"
    );
    if (std.includes(name)) {
      const lib = require(join(__dirname, "std", name + ".js"));

      return lib;
    } else if (existsSync(possibleLocalName)) {
      const newInterp = new Interpreter(this.options);
      const ast = new Parser(
        tokens(readFileSync(possibleLocalName).toString())
      ).parse();
      newInterp.interpret(ast);

      return fromEntries([...newInterp.exports.entries()]);
    } else {
      throw new ImportError(name);
    }
  }
  visitImportStmt(stmt: Import): LoxType {
    const imports = stmt.imports.map((v) => v.text);
    try {
      const mod = this.getModule(stmt.modName.text);
      Object.keys(mod)
        .filter((v) => imports.includes(v))
        .forEach((key) => this.environment.define(key, mod[key]));
      const undefinedImports = imports.filter(
        (v) => !Object.prototype.hasOwnProperty.call(mod, v)
      );
      if (undefinedImports.length > 0)
        throw new InterpreterError(
          stmt,
          `Module ${stmt.modName.text} does not export ${undefinedImports
            .map((v) => `"${v}"`)
            .join(", ")}.`,
          stmt.imports[0]
        );
    } catch (error) {
      if (error instanceof ImportError) {
        throw new InterpreterError(
          stmt,
          "Module " + error.missing + " not found",
          stmt.modName
        );
      } else throw error;
    }

    return null;
  }
  visitSuperExpr(expr: Super): LoxType {
    throw new InterpreterError(expr, "Method not implemented.");
  }
  visitLiteralExpr(expr: Literal) {
    return expr.value;
  }
  visitGroupingExpr(expr: Grouping) {
    return this.evaluate(expr.expression);
  }
  evaluate(expr: Expr): LoxType {
    return expr.accept<LoxType>(this);
  }
  visitExportExpr(expr: Export) {
    this.exports.set(expr.value.text, this.environment.get(expr.value.text));
    return null;
  }
  private isTruthy(object: LoxType) {
    if (object == null) return false;
    if (typeof object === "boolean") return object;
    return true;
  }
  visitBinaryExpr(expr: Binary) {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator.value) {
      case ">":
        return (left as number) > (right as number);
      case ">=":
        return (left as number) >= (right as number);
      case "<":
        return (left as number) < (right as number);
      case "<=":
        return (left as number) <= (right as number);
      case "-":
        return (left as number) - (right as number);
      case "/":
        return (left as number) / (right as number);
      case "*":
        return (left as number) * (right as number);
      case "+":
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }

        if (typeof left === "string" && typeof right === "string") {
          return left + right;
        }
        break;
      case "!=":
        return this.equals(left, right);
      case "==":
        return this.equals(left, right);

      default:
        break;
    }

    // Unreachable.
    return null;
  }
  equals(a: LoxType, b: LoxType): boolean {
    if (
      (typeof a === "number" && typeof b === "number") ||
      (typeof a === "string" && typeof b === "string")
    ) {
      return a === b;
    }
    if (a === null && b === null) return true;

    if (a === null) return false;
  }
  visitUnaryExpr(expr: Unary) {
    const right = this.evaluate(expr.right);
    switch (expr.operator.value) {
      case "-":
        return -right;
      case "!":
        return !right;
    }
    // Unreachable.
    return null;
  }

  interpret(statements: Stmt[]) {
    try {
      let returnValue = null;
      const resolver = new Resolver(this);
      resolver.resolve(statements);

      for (const statement of statements) {
        returnValue = this.execute(statement);
      }
      return returnValue;
    } catch (error) {
      if (error instanceof InterpreterError) console.log(error.report());
      else if (error instanceof EnvironmentError) console.log(error.report());
      else throw error;
    }
  }
  static interpret(statements: Stmt[], options?: IInterpreterOptions) {
    return new Interpreter(options).interpret(statements);
  }
  private execute(stmt: Stmt) {
    return stmt.accept(this);
  }
  visitReturnStmt(stmt: Return) {
    throw new ReturnErr(this.evaluate(stmt.value));
    // Unreachable.
    return null;
  }
  visitExpressionStmt(stmt: Expression) {
    const value = this.evaluate(stmt.expression);
    return value;
  }
  visitPrintStmt(stmt: Print) {
    const value = this.evaluate(stmt.expression);
    console.log(this.options.pretty ? pretty(value) : stringify(value));
    return null;
  }
  visitVarStmt(stmt: Var) {
    let value = null;
    if (stmt.initializer != null) {
      value = this.evaluate(stmt.initializer);
    }

    this.environment.define(stmt.name.value, value);
    return null;
  }
  visitWhileStmt(stmt: While) {
    while (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.body);
    }
    return null;
  }
  visitVariableExpr(expr: Variable) {
    return this.lookUpVariable(expr.name, expr);
  }
  lookUpVariable(name: Token, expr: Variable) {
    const distance = this.locals.get(expr);
    if (distance != null) {
      return this.environment.getAt(distance, name.value);
    } else {
      return this.globals.get(name.value);
    }
  }
  visitAssignExpr(expr: Assign) {
    const value = this.evaluate(expr.value);
    this.environment.assign(expr.name.value, value);
    return value;
  }
  visitBlockStmt(stmt: Block) {
    this.executeBlock(stmt.statements, new Environment(this.environment));
    return null;
  }
  executeBlock(statements: Stmt[], environment: Environment) {
    const previous = this.environment;
    try {
      this.environment = environment;

      for (const statement of statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }
  visitIfStmt(stmt: If) {
    if (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.thenBranch);
    } else if (stmt.elseBranch != null) {
      this.execute(stmt.elseBranch);
    }
    return null;
  }
  visitLogicalExpr(expr: Logical) {
    const left = this.evaluate(expr.left);

    if (expr.operator.value === "or") {
      if (this.isTruthy(left)) return left;
    } else {
      if (!this.isTruthy(left)) return left;
    }

    return this.evaluate(expr.right);
  }
  visitCallExpr(expr: Call) {
    const callee = this.evaluate(expr.callee);

    const args: LoxType[] = [];
    for (const argument of expr.args) {
      args.push(this.evaluate(argument));
    }
    if (
      !(
        callee instanceof LoxFunction ||
        callee instanceof ForeignFunction ||
        callee instanceof LoxClass
      )
    ) {
      throw new InterpreterError(expr, "Can only call functions and classes.");
    }

    const fn = callee as LoxCallable;

    if (args.length != fn.arity) {
      throw new InterpreterError(
        expr,
        "Expected " + fn.arity + " arguments but got " + args.length + "."
      );
    }

    return fn.call(this, args);
  }
  visitFunctionStmt(stmt: Function) {
    const fn = new LoxFunction(stmt, this.environment, false);
    this.environment.define(stmt.name.value, fn);
    return null;
  }
  visitClassStmt(stmt: Class) {
    let superclass = null;
    if (stmt.superclass != null) {
      superclass = this.evaluate(stmt.superclass);
      if (!(superclass instanceof LoxClass)) {
        throw new InterpreterError(stmt, "Superclass must be a class.");
      }
    }

    this.environment.define(stmt.name.value, null);
    const methods = new Map<String, LoxFunction>();
    for (const method of stmt.methods) {
      const fn = new LoxFunction(
        method,
        this.environment,
        method.name.value === "init"
      );
      methods.set(method.name.value, fn);
    }

    const klass = new LoxClass(stmt.name.value, <LoxClass>superclass, methods);
    this.environment.assign(stmt.name.value, klass);
    return null;
  }
  visitGetExpr(expr: Get) {
    const object = this.evaluate(expr.object);
    if (object instanceof LoxInstance) {
      return object.get(expr.name.value) || null;
    }

    throw new InterpreterError(expr, "Only instances have properties.");
  }
  visitSetExpr(expr: Set) {
    const object = this.evaluate(expr.object);

    if (!(object instanceof LoxInstance)) {
      throw new InterpreterError(expr, "Only instances have fields.");
    }

    const value = this.evaluate(expr.value);
    object.set(expr.name.value, value);
    return value;
  }
  visitThisExpr(expr: This) {
    return this.lookUpVariable(expr.keyword, new Variable(expr.keyword));
  }

  resolve(expr: Expr, depth: number) {
    this.locals.set(expr, depth);
  }
}

export interface LoxCallable {
  arity: number;

  call(interpreter: Interpreter, args: LoxType[]): LoxType;
}
export class LoxFunction implements LoxCallable {
  arity: number;
  closure: Environment;

  constructor(
    readonly declaration: Function,
    closure: Environment,
    private isInitializer: boolean
  ) {
    this.arity = declaration.params.length;
    this.closure = closure;
  }
  call(interpreter: Interpreter, args: LoxType[]) {
    const environment = new Environment(this.closure);
    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i].value, args[i]);
    }
    try {
      interpreter.executeBlock(this.declaration.body, environment);
    } catch (returnValue) {
      return (returnValue as ReturnErr).value;
    }
    if (this.isInitializer) return this.closure.getAt(0, "this");

    return null;
  }
  bind(instance: LoxInstance) {
    const environment = new Environment(this.closure);
    environment.define("this", instance);
    return new LoxFunction(this.declaration, environment, this.isInitializer);
  }
}
export class LoxClass implements LoxCallable {
  findMethod(name: string) {
    if (this.methods.has(name)) {
      return this.methods.get(name);
    }
    if (this.superclass) {
      return this.superclass.findMethod(name);
    }

    return null;
  }

  arity = 0;
  constructor(
    readonly name: string,
    readonly superclass: LoxClass,
    readonly methods: Map<String, LoxFunction>
  ) {}
  call(interpreter: Interpreter, args: LoxType[]) {
    const instance = new LoxInstance(this);
    const initializer = this.findMethod("init");
    if (initializer) {
      initializer.bind(instance).call(interpreter, args);
    }

    return instance;
  }
}
export class LoxInstance {
  klass: LoxClass;
  fields = new Map<String, LoxType>();

  constructor(klass: LoxClass) {
    this.klass = klass;
  }
  set(name: string, value: LoxType) {
    this.fields.set(name, value);
  }
  get(name: string) {
    const method = this.klass.findMethod(name);
    if (method) return method.bind(this);

    return this.fields.get(name);
  }
}
export class ForeignFunction implements LoxCallable {
  fn: (interpreter: Interpreter, args: LoxType[]) => void | LoxType;
  constructor(
    fn: (this: Interpreter, args: LoxType[]) => void | LoxType,
    public arity: number
  ) {
    this.fn = (interpreter: Interpreter, args: LoxType[]) => {
      return fn.call(interpreter, args);
    };
  }
  call(interpreter: Interpreter, args: LoxType[]) {
    const val = this.fn(interpreter, args);
    if (!val) return null;
    return val;
  }
}

class ReturnErr {
  constructor(readonly value: LoxType) {}
}
export class InterpreterError extends Error {
  constructor(
    public expr: Expr | Stmt,
    message: string,
    public badToken?: Token
  ) {
    super(message);
  }
  report() {
    const token =
      this.badToken ||
      Object.values(this.expr).find((v) => (v as Token).isToken);
    if (this.expr instanceof Expr) this.expr = new Expression(this.expr);
    return `Error on line ${token.line} col ${token.col}: ${this.message}

${Unparser.print([this.expr])}`;
  }
}
class ImportError extends Error {
  constructor(public missing: string) {
    super("Module " + missing + " not found");
  }
}
function fromEntries<T>(entries: [keyof T, T[keyof T]][]): T {
  return entries.reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    <T>{}
  );
}
