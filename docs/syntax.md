---
title: Syntax
---

The syntax of Sparkle is C-ish.

## Types

Booleans, <abbr title="UTF-16 strings">strings</abbr>, <abbr title="Double precison numbers">numbers</abbr>. (And functions!)

```
var bool = true;
var str = "Hello, World!";
var num = 123456;
```

## Arithmetic

Works as you expect.

```
print 100 / 10 * 10 / 10; // 10
```

## Boolean logic

Not is `!`. And is `and` and or is `or`.

```
var a = true;
var b = true;

print a and b; // false
print a or b; // true
```

## Strings

You can concatenate them.

```
var a = "Hello, "
var b = "World!"
print a + b; // Hello, World!
```

## Variables

Declare 'em with `var` and mutate them with `=`.

```
var a = 3;
var b = 4;
```

## Blocks

Stick something in a pair of brackets and everything inside will be scoped locally.

```
var a = "Moo";
{
  var a = "Cow";
  print a; // Cow
}
print a; // Moo
```

## Functions

`function` and the name plus parameters work. If you call with the wrong number of parameters, it'll error.

```
function moo(thing) {
  print "MOOOO AM " + thing;
}
moo("COW");
```

You can pass 'em around, too! And use closures!

```
function enclosing(msg) {
  return function closure() {
    print msg;
  };
}
var abc = enclosing("MOO")
abc()
```

## Modules

Actually surprisingly simple!

```plain title="mod.sparkle"
function MOO() {
  print("MOOAOOAOOAOAOAOOAO");
}
export MOO;
```

```plain title="main.sparkle"
from mod import MOO;
MOO(); // MOOAOOAOOAOAOAOOAO
```

The modules will try to be resolved to the standard library, then if that fails it will load `.sparkle` files in the same folder.
