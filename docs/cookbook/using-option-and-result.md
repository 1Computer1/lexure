# Using Option and Result

Within lexure, `Option` and `Result` are often used, usually around the argument retriever and the loop functions.  
These types are often known as algebraic data types or tagged union types, which you may be unfamiliar with.  
Thankfully though, most of the time you will only construct them and not actually manipulate them.  
This guide will go through why they are used and how to use them.  

## The Semipredicate Problem

This is a fancy term for the fact that the type `T | U` can lose information if `T` can contain `U` or vice-versa.  
Suppose for example, that we have this function to return a value from a map or a default value if it is not there:  

```ts
function defaultGet<K, V>(map: Map<K, V>, key: K, defaultValue: V): V {
    // Note that `Map#get` returns undefined when the key isn't a member.
    return map.get(key) ?? defaultValue;
}
```

This looks innocuous at first, but when `V` is substituted with a type that contains `undefined`, we see a problem.  

```ts
const map: Map<string, number | null> = new Map();
map.set('abc', 1);
map.set('xyz', undefined);

console.log(defaultGet(map, 'abc', 100));
>>> 1

// This should be undefined!
console.log(defaultGet(map, 'xyz', 100));
>>> 2
```

The solution to this are tagged union types like `Option` and `Result`, which explicitly state with type is which.  

## Examples of Usage

In lexure, the `Option<T>` type replaces `T | null` with either:  

- `Some<T> = { exists: true, value: T }`
- `None = { exists: false }`

Similarly, the `Result<T, E>` type replaces `T | E` with either:  

- `Ok<T> = { success: true, value: T }`
- `Err<E> = { success: false, error: E }`

Cases of `T | null` where `T` is not generic e.g. `string | null` are not replaced with `Option`.  
This is because the operators `??` and `?.` are very convenient when working with these kinds of types.  

With `Args#singleMap` and related methods, the usual pattern is like the following.  
Note we can use `some` and `none` to construct an `Option`, and `ok` and `err` to construct a `Result`.  

```ts
const x = args.singleMap(s => {
    if (valid) {
        return some(s);
    }

    return none();
});

if (x.exists) {
    doSomething(x.value);
} else {
    doSomethingElse();
}

const y = args.singleParse(s => {
    if (valid) {
        return some(s);
    }

    return err('an error occurred');
});

if (y.success) {
    doSomething(y.value);
} else {
    doSomethingElse(y.error);
}
```

In the case where you have an existing function that gives `T | null`, you can convert it to an `Option` or `Result`:  

```ts
function number(x: string): number | null {
    const n = Number(x);
    if (isNaN(n)) {
        return null;
    }

    return x;
}

// `maybeOption` turns null and undefined into `None`.
const x = args.singleMap(x => maybeOption(number(x)));

// `maybeResult` turns null and undefined into an `Err` containing your error.
const y = args.singleParse(x => maybeResult(number(x), 'not a number'));
```

There are also various conversion functions between `Option` and `Result`:  

```ts
console.log(okToSome(ok(1)));
>>> { exists: true, value: 1 }

console.log(okToSome(err('bad')));
>>> { exists: false }

console.log(someToOk(some(1), 'was none'));
>>> { success: true, value: 1 }

console.log(someToOk(none(1), 'was none'));
>>> { success: false, error: 'was none' }
```

## Loop Actions

The loop strategies require that you return a `LoopAction<A, B, E>`.  
It too is a tagged union type like `Option` or `Result`; specifically, it is a union of three types:  

- `Step<A> = { action: 'step', value: A }`
- `Finish<B> = { action: 'finish', value: B }`
- `Fail<E> = { action: 'fail', error: E }`

These have special meanings when used inside a loop strategy to control the behavior of an input loop.  
Do read the documentation and the [Parsing With Loops](./parsing-with-loops.md) guide to see what they do.  

They can be constructed with `step`, `finish`, and `fail` respectively.  
There are conversion functions from a `Option` or a `Result` to a `LoopAction` as well.  
