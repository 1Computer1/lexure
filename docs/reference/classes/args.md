[lexure](../README.md) › [Args](args.md)

# Class: Args

A wrapper around the parser output for retrieving command arguments.

## Hierarchy

* **Args**

## Implements

* IterableIterator\<string\>

## Index

### Constructors

* [constructor](args.md#constructor)

### Properties

* [parserOutput](args.md#readonly-parseroutput)
* [state](args.md#state)

### Accessors

* [finished](args.md#finished)
* [length](args.md#length)
* [remaining](args.md#remaining)

### Methods

* [next](args.md#next)
* [single](args.md#single)
* [singleMap](args.md#singlemap)
* [singleMapAsync](args.md#singlemapasync)
* [singleParse](args.md#singleparse)
* [singleParseAsync](args.md#singleparseasync)
* [singleFromEnd](args.md#singlefromend)
* [many](args.md#many)
* [manyFromEnd](args.md#manyfromend)
* [flag](args.md#flag)
* [option](args.md#option)
* [options](args.md#options)
* [findMap](args.md#findmap)
* [findMapAsync](args.md#findmapasync)
* [findParse](args.md#findparse)
* [findParseAsync](args.md#findparseasync)
* [filterMap](args.md#filtermap)
* [filterMapAsync](args.md#filtermapasync)
* [save](args.md#save)
* [restore](args.md#restore)

## Constructors

###  constructor

* **new Args**(parserOutput: [ParserOutput](../interfaces/parseroutput.md)): [Args](args.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
parserOutput | [ParserOutput](../interfaces/parseroutput.md) | The parser output.  |

**Returns:** [Args](args.md)

## Properties

### readonly parserOutput

* **parserOutput**: [ParserOutput](../interfaces/parseroutput.md)

The parser output.

___

###  state

* **state**: [ArgsState](../interfaces/argsstate.md)

The state of this instance.

## Accessors

###  finished

* **get finished**(): boolean

Whether all ordered tokens have been used.

**Returns:** boolean

___

###  length

* **get length**(): number

The amount of ordered tokens.

**Returns:** number

___

###  remaining

* **get remaining**(): number

The amount of remaining ordered tokens.

**Returns:** number

## Methods

###  next

* **next**(): IteratorResult\<string\>

Gets the next ordered argument.

**Returns:** IteratorResult\<string\>

An iterator result containing a string.

___

###  single

* **single**(): string | null

Retrieves the value of the next unused ordered token.
That token will now be consider used.

```ts
// Suppose args are from '1 2 3'.
console.log(args.single());
>>> '1'

console.log(args.single());
>>> '2'

console.log(args.single());
>>> '3'

console.log(args.single());
>>> null
```

**Returns:** string | null

The value if there are tokens left.

___

###  singleMap

* **singleMap**\<**T**\>(f: function, useAnyways: boolean): [Option](../README.md#option)\<T\> | null

Retrieves the value of the next unused ordered token, but only if it could be transformed.
That token will now be consider used if the transformation succeeds.

```ts
// Suppose args are from '1 2 3'.
const parse = (x: string) => {
  const n = Number(x);
  return isNaN(n) ? none() : some(n);
};

console.log(args.singleMap(parse));
>>> { exists: true, value: 1 }
```

**Type parameters:**

* **T**

Output type.

**Parameters:**

* **f**: function

Gives an option of either the resulting value, or nothing if failed.

* (x: string): [Option](../README.md#option)\<T\>

**Parameters:**

Name | Type |
------ | ------ |
x | string |

*default value  **useAnyways**: boolean= false

Whether to consider the token used even if the transformation fails; defaults to false.

**Returns:** [Option](../README.md#option)\<T\> | null

The value if the transformation succeeds.
If there are no tokens left, null is returned.

___

###  singleMapAsync

* **singleMapAsync**\<**T**\>(f: function, useAnyways: boolean): Promise\<[Option](../README.md#option)\<T\> | null\>

Retrieves the value of the next unused ordered token, but only if it could be transformed.
This variant of the function is asynchronous using `Promise`.
That token will now be consider used if the transformation succeeds.

**Type parameters:**

* **T**

Output type.

**Parameters:**

* **f**: function

Gives an option of either the resulting value, or nothing if failed.

* (x: string): Promise\<[Option](../README.md#option)\<T\>\>

**Parameters:**

Name | Type |
------ | ------ |
x | string |

*default value  **useAnyways**: boolean= false

Whether to consider the token used even if the transformation fails; defaults to false.

**Returns:** Promise\<[Option](../README.md#option)\<T\> | null\>

The value if the transformation succeeds.
If there are no tokens left, null is returned.

___

###  singleParse

* **singleParse**\<**T**, **E**\>(f: function, useAnyways: boolean): [Result](../README.md#result)\<T, E\> | null

Retrieves the value of the next unused ordered token, but only if it could be transformed.
That token will now be consider used if the transformation succeeds.
This is a variant of {@linkcode Args#singleMap} that allows for a Result to be returned.

```ts
// Suppose args are from '1 a'.
const parse = (x: string) => {
  const n = Number(x);
  return isNaN(n) ? err(x + ' is not a number') : ok(n);
};

console.log(args.singleParse(parse));
>>> { success: true, value: 1 }

console.log(args.singleParse(parse));
>>> { success: false, error: 'a is not a number' }

console.log(args.singleParse(parse));
>>> null
```

**Type parameters:**

* **T**

Output type.

* **E**

Error type.

**Parameters:**

* **f**: function

Gives a result of either the resulting value, or an error.

* (x: string): [Result](../README.md#result)\<T, E\>

**Parameters:**

Name | Type |
------ | ------ |
x | string |

*default value  **useAnyways**: boolean= false

Whether to consider the token used even if the transformation fails; defaults to false.

**Returns:** [Result](../README.md#result)\<T, E\> | null

The result which succeeds if the transformation succeeds.
If there are no tokens left, null is returned.

___

###  singleParseAsync

* **singleParseAsync**\<**T**, **E**\>(f: function, useAnyways: boolean): Promise\<[Result](../README.md#result)\<T, E\> | null\>

Retrieves the value of the next unused ordered token, but only if it could be transformed.
That token will now be consider used if the transformation succeeds.
This variant of the function is asynchronous using `Promise`.
This is a variant of {@linkcode Args#singleMapAsync} that allows for a Result to be returned.

**Type parameters:**

* **T**

Output type.

* **E**

Error type.

**Parameters:**

* **f**: function

Gives a result of either the resulting value, or an error.

* (x: string): Promise\<[Result](../README.md#result)\<T, E\>\>

**Parameters:**

Name | Type |
------ | ------ |
x | string |

*default value  **useAnyways**: boolean= false

Whether to consider the token used even if the transformation fails; defaults to false.

**Returns:** Promise\<[Result](../README.md#result)\<T, E\> | null\>

The result which succeeds if the transformation succeeds.
If there are no tokens left, null is returned.

___

###  singleFromEnd

* **singleFromEnd**(): string | null

Retrieves the value of the next unused ordered token from the end.
That token will now be consider used.

```ts
// Suppose args are from '1 2 3'.
console.log(args.singleFromEnd());
>>> '3'

console.log(args.singleFromEnd());
>>> '2'

console.log(args.singleFromEnd());
>>> '1'

console.log(args.singleFromEnd());
>>> null
```

**Returns:** string | null

The value if there are tokens left.

___

###  many

* **many**(limit: number, from: number): [Token](../interfaces/token.md)[]

Retrieves many unused tokens.

```ts
// Suppose args are from '1 2 3'.
const xs = args.many();
console.log(joinTokens(xs));
>>> '1 2 3'

// Suppose args are from '1 2 3'.
const xs = args.many(2);
console.log(joinTokens(xs));
>>> '1 2'
```

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
limit | number | Infinity | The limit on the amount of tokens to retrieve; defaults to infinite. |
from | number | this.state.position | Where to start looking for tokens; defaults to current position. |

**Returns:** [Token](../interfaces/token.md)[]

The tokens.

___

###  manyFromEnd

* **manyFromEnd**(limit: number, from: number): [Token](../interfaces/token.md)[]

Retrieves many unused tokens from the end.
Note that the order of retrieved tokens will be the same order as in the ordered tokens list.

```ts
// Suppose args are from '1 2 3'.
const xs = args.manyFromEnd();
console.log(joinTokens(xs));
>>> '1 2 3'

// Suppose args are from '1 2 3'.
const xs = args.manyFromEnd(2);
console.log(joinTokens(xs));
>>> '2 3'
```

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
limit | number | Infinity | The limit on the amount of tokens to retrieve; defaults to infinite. |
from | number | this.state.positionFromEnd | Where to start looking for tokens; defaults to current position from end. |

**Returns:** [Token](../interfaces/token.md)[]

The tokens.

___

###  flag

* **flag**(...keys: string[]): boolean

Checks if a flag was given.

```ts
// Suppose args are from '--f --g'.
console.log(args.flag('f'));
>>> true

console.log(args.flag('g', 'h'));
>>> true

console.log(args.flag('h'));
>>> false
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
...keys | string[] | The name(s) of the flag. |

**Returns:** boolean

Whether the flag was given.

___

###  option

* **option**(...keys: string[]): string | null

Gets the last value of an option.

```ts
// Suppose args are from '--a=1 --b=2 --c=3'.
console.log(args.option('a'));
>>> '1'

console.log(args.option('b', 'c'));
>>> '2'

console.log(args.option('d'));
>>> null
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
...keys | string[] | The name(s) of the option. |

**Returns:** string | null

The last value of the option if it was given.
When there are multiple names, the last value of the first found name is given.

___

###  options

* **options**(...keys: string[]): string[] | null

Gets all the values of an option.

```ts
// Suppose args are from '--a=1 --a=1 --b=2 --c=3'.
console.log(args.options('a'));
>>> ['1', '1']

console.log(args.option('b', 'c'));
>>> ['2', '3']

console.log(args.option('d'));
>>> null
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
...keys | string[] | The name(s) of the option. |

**Returns:** string[] | null

The values of the option if it was given.

___

###  findMap

* **findMap**\<**T**\>(f: function, from: number): [Option](../README.md#option)\<T\>

Finds and retrieves the first unused token that could be transformed.
That token will now be consider used.

```ts
// Suppose args are from '1 2 3'.
const parse = (x: string) => {
  const n = Number(x);
  return isNaN(n) || n === 1 ? none() : some(n);
};

console.log(args.findMap(parse));
>>> { exists: true, value: 2 }
```

**Type parameters:**

* **T**

Output type.

**Parameters:**

* **f**: function

Gives an option of either the resulting value, or nothing if failed.

* (x: string): [Option](../README.md#option)\<T\>

**Parameters:**

Name | Type |
------ | ------ |
x | string |

*default value  **from**: number= this.state.position

Where to start looking for tokens; defaults to current position.

**Returns:** [Option](../README.md#option)\<T\>

The resulting value if it was found.

___

###  findMapAsync

* **findMapAsync**\<**T**\>(f: function, from: number): Promise\<[Option](../README.md#option)\<T\>\>

Finds and retrieves the first unused token that could be transformed.
This variant of the function is asynchronous using `Promise`.
That token will now be consider used.

**Type parameters:**

* **T**

Output type.

**Parameters:**

* **f**: function

Gives an option of either the resulting value, or nothing if failed.

* (x: string): Promise\<[Option](../README.md#option)\<T\>\>

**Parameters:**

Name | Type |
------ | ------ |
x | string |

*default value  **from**: number= this.state.position

Where to start looking for tokens; defaults to current position.

**Returns:** Promise\<[Option](../README.md#option)\<T\>\>

The resulting value if it was found.

___

###  findParse

* **findParse**\<**T**, **E**\>(f: function, from: number): [Result](../README.md#result)\<T, E[]\>

Finds and retrieves the first unused token that could be transformed.
That token will now be consider used.
This is a variant of {@linkcode Args#findMap} that allows for a Result to be returned.

**Type parameters:**

* **T**

Output type.

* **E**

Error type.

**Parameters:**

* **f**: function

Gives a result of either the resulting value, or an error.

* (x: string): [Result](../README.md#result)\<T, E\>

**Parameters:**

Name | Type |
------ | ------ |
x | string |

*default value  **from**: number= this.state.position

Where to start looking for tokens; defaults to current position.

**Returns:** [Result](../README.md#result)\<T, E[]\>

The resulting value if it was found or a list of errors during parsing.

___

###  findParseAsync

* **findParseAsync**\<**T**, **E**\>(f: function, from: number): Promise\<[Result](../README.md#result)\<T, E[]\>\>

Finds and retrieves the first unused token that could be transformed.
That token will now be consider used.
This variant of the function is asynchronous using `Promise`.
This is a variant of {@linkcode Args#findMapAsync} that allows for a Result to be returned.

**Type parameters:**

* **T**

Output type.

* **E**

Error type.

**Parameters:**

* **f**: function

Gives a result of either the resulting value, or an error.

* (x: string): Promise\<[Result](../README.md#result)\<T, E\>\>

**Parameters:**

Name | Type |
------ | ------ |
x | string |

*default value  **from**: number= this.state.position

Where to start looking for tokens; defaults to current position.

**Returns:** Promise\<[Result](../README.md#result)\<T, E[]\>\>

The resulting value if it was found or a list of errors during parsing.

___

###  filterMap

* **filterMap**\<**T**\>(f: function, limit: number, from: number): T[]

Filters and retrieves all unused tokens that could be transformed.
Those tokens will now be consider used.

```ts
// Suppose args are from '1 2 3'.
const parse = (x: string) => {
  const n = Number(x);
  return isNaN(n) || n === 1 ? none() : some(n);
};

console.log(args.filterMap(parse));
>>> [2, 3]
```

**Type parameters:**

* **T**

Output type.

**Parameters:**

* **f**: function

Gives an option of either the resulting value, or nothing if failed.

* (x: string): [Option](../README.md#option)\<T\>

**Parameters:**

Name | Type |
------ | ------ |
x | string |

*default value  **limit**: number= Infinity

The limit on the amount of tokens to retrieve; defaults to infinite.

*default value  **from**: number= this.state.position

Where to start looking for tokens; defaults to current position.

**Returns:** T[]

The resulting values.

___

###  filterMapAsync

* **filterMapAsync**\<**T**\>(f: function, limit: number, from: number): Promise\<T[]\>

Filters and retrieves all unused tokens that could be transformed.
This variant of the function is asynchronous using `Promise`.
Those tokens will now be consider used.

**Type parameters:**

* **T**

Output type.

**Parameters:**

* **f**: function

Gives an option of either the resulting value, or nothing if failed.

* (x: string): Promise\<[Option](../README.md#option)\<T\>\>

**Parameters:**

Name | Type |
------ | ------ |
x | string |

*default value  **limit**: number= Infinity

The limit on the amount of tokens to retrieve; defaults to infinite.

*default value  **from**: number= this.state.position

Where to start looking for tokens; defaults to current position.

**Returns:** Promise\<T[]\>

The resulting values.

___

###  save

* **save**(): [ArgsState](../interfaces/argsstate.md)

Saves the current state that can then be restored later by using {@linkcode Args#restore}.

**Returns:** [ArgsState](../interfaces/argsstate.md)

The current state.

___

###  restore

* **restore**(state: [ArgsState](../interfaces/argsstate.md)): void

Sets the current state to the given state from {@linkcode Args#save}.
Use this to backtrack after a series of retrievals.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
state | [ArgsState](../interfaces/argsstate.md) | State to restore to.  |

**Returns:** void
