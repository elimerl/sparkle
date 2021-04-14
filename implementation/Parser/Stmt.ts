import type { Token } from "../Util/Token";
import type { LoxType } from "../Interpreter/Interpreter";
import { Expr, Variable } from "./Expr";
export abstract class Stmt {
  abstract accept<R>(visitor: StmtVisitor<R>): R;
}
export class Block extends Stmt {
  constructor(readonly statements: Stmt[]) {
    super();
  }
  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitBlockStmt(this);
  }
}
export class Class extends Stmt {
  constructor(
    readonly name: Token,
    readonly superclass: Variable,
    readonly methods: Function[]
  ) {
    super();
  }
  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitClassStmt(this);
  }
}
export class Expression extends Stmt {
  constructor(readonly expression: Expr) {
    super();
  }
  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitExpressionStmt(this);
  }
}
export class Function extends Stmt {
  constructor(
    readonly name: Token,
    readonly params: Token[],
    readonly body: Stmt[]
  ) {
    super();
  }
  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitFunctionStmt(this);
  }
}
export class If extends Stmt {
  constructor(
    readonly condition: Expr,
    readonly thenBranch: Stmt,
    readonly elseBranch: Stmt
  ) {
    super();
  }
  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitIfStmt(this);
  }
}
export class Print extends Stmt {
  constructor(readonly expression: Expr) {
    super();
  }
  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitPrintStmt(this);
  }
}
export class Return extends Stmt {
  constructor(readonly keyword: Token, readonly value: Expr) {
    super();
  }
  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitReturnStmt(this);
  }
}
export class Var extends Stmt {
  constructor(readonly name: Token, readonly initializer: Expr) {
    super();
  }
  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitVarStmt(this);
  }
}
export class While extends Stmt {
  constructor(readonly condition: Expr, readonly body: Stmt) {
    super();
  }
  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitWhileStmt(this);
  }
}
export class Import extends Stmt {
  constructor(readonly modName: Token, readonly imports: Token[]) {
    super();
  }
  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitImportStmt(this);
  }
}
export interface StmtVisitor<R> {
  visitBlockStmt(stmt: Block): R;
  visitClassStmt(stmt: Class): R;
  visitExpressionStmt(stmt: Expression): R;
  visitFunctionStmt(stmt: Function): R;
  visitIfStmt(stmt: If): R;
  visitPrintStmt(stmt: Print): R;
  visitReturnStmt(stmt: Return): R;
  visitVarStmt(stmt: Var): R;
  visitWhileStmt(stmt: While): R;
  visitImportStmt(stmt: Import): R;
}
