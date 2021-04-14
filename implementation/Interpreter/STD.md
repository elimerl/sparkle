# Adding a module to the standard library

Create a file in [std/](std/) and call it `your module name.ts`.
`export` primitives the normal way, but functions need to be `ForeignFunctions`.
For example, to subtract a number:

```ts
import { ForeignFunction } from "../Interpreter";

export const add = new ForeignFunction((args: [number, number]) => {
  return args[0] - args[1];
}, 2);
```

Concatenate two strings:

```ts
import { ForeignFunction } from "../Interpreter";

export const concat = new ForeignFunction((args: [string, string]) => {
  return args[0] + args[1];
}, 2);
```

Access the interpreter using `this`. (Make sure to use a normal function and not an arrow function!)

```ts

```
