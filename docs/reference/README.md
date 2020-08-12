[lexure](README.md)

# lexure

## Index

### Enumerations

* [LoopTag](enums/looptag.md)

### Classes

* [Args](classes/args.md)
* [Lexer](classes/lexer.md)
* [Parser](classes/parser.md)

### Interfaces

* [Token](interfaces/token.md)
* [ParserOutput](interfaces/parseroutput.md)
* [Some](interfaces/some.md)
* [None](interfaces/none.md)
* [Ok](interfaces/ok.md)
* [Err](interfaces/err.md)
* [ArgsState](interfaces/argsstate.md)
* [Step](interfaces/step.md)
* [Finish](interfaces/finish.md)
* [Fail](interfaces/fail.md)
* [LoopStrategy](interfaces/loopstrategy.md)
* [LoopStrategyAsync](interfaces/loopstrategyasync.md)
* [UnorderedStrategy](interfaces/unorderedstrategy.md)

### Type aliases

* [MatchPrefix](README.md#matchprefix)
* [Option](README.md#option)
* [Result](README.md#result)
* [LoopAction](README.md#loopaction)
* [Pairing](README.md#pairing)

### Functions

* [joinTokens](README.md#jointokens)
* [extractCommand](README.md#extractcommand)
* [emptyOutput](README.md#emptyoutput)
* [mergeOutputs](README.md#mergeoutputs)
* [outputToJSON](README.md#outputtojson)
* [outputFromJSON](README.md#outputfromjson)
* [some](README.md#some)
* [none](README.md#none)
* [maybeOption](README.md#maybeoption)
* [orOption](README.md#oroption)
* [ok](README.md#ok)
* [err](README.md#err)
* [err_](README.md#err_)
* [maybeResult](README.md#mayberesult)
* [orResultAll](README.md#orresultall)
* [orResultFirst](README.md#orresultfirst)
* [orResultLast](README.md#orresultlast)
* [step](README.md#step)
* [step_](README.md#step_)
* [finish](README.md#finish)
* [fail](README.md#fail)
* [fail_](README.md#fail_)
* [loop](README.md#loop)
* [loop1](README.md#loop1)
* [loopAsync](README.md#loopasync)
* [loop1Async](README.md#loop1async)
* [noStrategy](README.md#nostrategy)
* [longStrategy](README.md#longstrategy)
* [longShortStrategy](README.md#longshortstrategy)
* [prefixedStrategy](README.md#prefixedstrategy)
* [matchingStrategy](README.md#matchingstrategy)
* [mapKeys](README.md#mapkeys)
* [renameKeys](README.md#renamekeys)
* [someToOk](README.md#sometook)
* [okToSome](README.md#oktosome)
* [errToSome](README.md#errtosome)
* [someToStep](README.md#sometostep)
* [someToFinish](README.md#sometofinish)
* [okToStep](README.md#oktostep)
* [okToFinish](README.md#oktofinish)

## Type aliases

###  MatchPrefix

* **MatchPrefix**: function

A function to match a prefix.

**`param`** A string that may start with the prefix.

**`returns`** The length of the prefix if there is one.

#### Type declaration:

* (s: string): number | null

**Parameters:**

Name | Type |
------ | ------ |
s | string |

___

###  Option

* **Option**: [Some](interfaces/some.md)\<T\> | [None](interfaces/none.md)

A type that can express the lack of a value.
Used in this library for when a generic type could be nullable.

___

###  Result

* **Result**: [Ok](interfaces/ok.md)\<T\> | [Err](interfaces/err.md)\<E\>

A type used to express computations that can fail.

___

###  LoopAction

* **LoopAction**: [Step](interfaces/step.md)\<A\> | [Finish](interfaces/finish.md)\<B\> | [Fail](interfaces/fail.md)\<E\>

A type used to express actions in the loop.
Each action can have a value with it.

___

###  Pairing

* **Pairing**: Record\<string, string[]\>

Pairing of flag/option names to the words usable for them.

## Functions

###  joinTokens

* **joinTokens**(tokens: [Token](interfaces/token.md)[], separator: string | null, raw: boolean): string

Joins tokens together.
By default, this keeps as much of the original input as possible.

```ts
// Note three trailing spaces.
const tokens = new Lexer('hello   "world"')
  .setQuotes([['"', '"']])
  .lex();

console.log(joinTokens(tokens));
>>> 'hello   "world"'

console.log(joinTokens(tokens, ' ', false));
>>> 'hello world'
```

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
tokens | [Token](interfaces/token.md)[] | - | Tokens to join. |
separator | string &#124; null | null | The separator, if null, will use original trailing whitespace; defaults to null. |
raw | boolean | true | Whether to use raw values e.g. with quotes; defaults to true. |

**Returns:** string

The joined string.

___

###  extractCommand

* **extractCommand**(matchPrefix: [MatchPrefix](README.md#matchprefix), tokens: [Token](interfaces/token.md)[], mutate: boolean): [Token](interfaces/token.md) | null

Extracts a command from the first one or two tokens from a list of tokens.
The command format is '<prefix> <command>', and the space is optional.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
matchPrefix | [MatchPrefix](README.md#matchprefix) | - | A function that gives the length of the prefix if there is one. |
tokens | [Token](interfaces/token.md)[] | - | Tokens to check. |
mutate | boolean | true | Whether to mutate the list of tokens. |

**Returns:** [Token](interfaces/token.md) | null

The token containing the name of the command.
This may be a token from the list or a new token.

___

###  emptyOutput

* **emptyOutput**(): [ParserOutput](interfaces/parseroutput.md)

Creates an empty parser output.

**Returns:** [ParserOutput](interfaces/parseroutput.md)

An empty output.

___

###  mergeOutputs

* **mergeOutputs**(...ps: [ParserOutput](interfaces/parseroutput.md)[]): [ParserOutput](interfaces/parseroutput.md)

Merges multiple outputs into one.
Flags and options that appear later will be preferred if there are duplicates.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
...ps | [ParserOutput](interfaces/parseroutput.md)[] | The outputs to merge. |

**Returns:** [ParserOutput](interfaces/parseroutput.md)

The merged output.

___

###  outputToJSON

* **outputToJSON**(p: [ParserOutput](interfaces/parseroutput.md)): Record\<string, unknown\>

Converts an output to JSON, where the flags and options are turned into arrays of entries.
You can recover the output with 'outputFromJSON'.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
p | [ParserOutput](interfaces/parseroutput.md) | The output. |

**Returns:** Record\<string, unknown\>

The JSON.

___

###  outputFromJSON

* **outputFromJSON**(obj: Record\<string, unknown\>): [ParserOutput](interfaces/parseroutput.md)

Converts JSON to a parser output.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
obj | Record\<string, unknown\> | A valid JSON input, following the schema from 'outputToJSON'. |

**Returns:** [ParserOutput](interfaces/parseroutput.md)

The output.

___

###  some

* **some**\<**T**\>(x: T): [Some](interfaces/some.md)\<T\>

Creates a Some.

**Type parameters:**

* **T**

Type of results.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | T | Value to use. |

**Returns:** [Some](interfaces/some.md)\<T\>

An Option.

___

###  none

* **none**(): [None](interfaces/none.md)

Creates a None.

**Returns:** [None](interfaces/none.md)

An Option.

___

###  maybeOption

* **maybeOption**\<**T**\>(x: T | null | undefined): [Option](README.md#option)\<T\>

Creates an Option from a value that could be null or undefined.

```ts
console.log(maybeOption(1));
>>> { exists: true, value: 1 }

console.log(maybeOption(null));
>>> { exists: false }

console.log(maybeOption(undefined));
>>> { exists: false }
```

**Type parameters:**

* **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | T &#124; null &#124; undefined | A nullable value. |

**Returns:** [Option](README.md#option)\<T\>

An Option.

___

###  orOption

* **orOption**\<**T**\>(...xs: [Option](README.md#option)\<T\>[]): [Option](README.md#option)\<T\>

Gets the first Some from many Options.

**Type parameters:**

* **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
...xs | [Option](README.md#option)\<T\>[] | The Options. |

**Returns:** [Option](README.md#option)\<T\>

The first Some, or None if there were no Some.

___

###  ok

* **ok**\<**T**\>(x: T): [Ok](interfaces/ok.md)\<T\>

Creates an Ok.

**Type parameters:**

* **T**

Type of results.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | T | Value to use. |

**Returns:** [Ok](interfaces/ok.md)\<T\>

A Result.

___

###  err

* **err**\<**E**\>(x: E): [Err](interfaces/err.md)\<E\>

Creates an Err.

**Type parameters:**

* **E**

Type of errors.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | E | Value to use. |

**Returns:** [Err](interfaces/err.md)\<E\>

A Result.

___

###  err_

* **err_**(): [Err](interfaces/err.md)\<null\>

Creates an Err with null value.

**Returns:** [Err](interfaces/err.md)\<null\>

A Result.

___

###  maybeResult

* **maybeResult**\<**T**, **E**\>(x: T | null | undefined, e: E): [Result](README.md#result)\<T, E\>

Creates a Result from a value that could be null or undefined.

```ts
console.log(maybeResult(1, 'bad'));
>>> { success: true, value: 1 }

console.log(maybeResult(null, 'bad'));
>>> { success: false, error: 'bad' }

console.log(maybeResult(undefined, 'bad'));
>>> { success: false, error: 'bad' }
```

**Type parameters:**

* **T**

* **E**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | T &#124; null &#124; undefined | A nullable value. |
e | E | The error to use. |

**Returns:** [Result](README.md#result)\<T, E\>

A Result.

___

###  orResultAll

* **orResultAll**\<**T**, **E**\>(x: [Result](README.md#result)\<T, E\>, ...xs: [Result](README.md#result)\<T, E\>[]): [Result](README.md#result)\<T, E[]\>

Gets the first Ok from many Results.

**Type parameters:**

* **T**

* **E**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | [Result](README.md#result)\<T, E\> | The first Result. |
...xs | [Result](README.md#result)\<T, E\>[] | The remaining Results; this encoding is to ensure there is at least one Result. |

**Returns:** [Result](README.md#result)\<T, E[]\>

The first Ok, or all the Errs if there were no Ok.

___

###  orResultFirst

* **orResultFirst**\<**T**, **E**\>(x: [Result](README.md#result)\<T, E\>, ...xs: [Result](README.md#result)\<T, E\>[]): [Result](README.md#result)\<T, E\>

Gets the first Ok from many Results.

**Type parameters:**

* **T**

* **E**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | [Result](README.md#result)\<T, E\> | The first Result. |
...xs | [Result](README.md#result)\<T, E\>[] | The remaining Results; this encoding is to ensure there is at least one Result. |

**Returns:** [Result](README.md#result)\<T, E\>

The first Ok, or the first Err if there were no Ok.

___

###  orResultLast

* **orResultLast**\<**T**, **E**\>(x: [Result](README.md#result)\<T, E\>, ...xs: [Result](README.md#result)\<T, E\>[]): [Result](README.md#result)\<T, E\>

Gets the first Ok from many Results.

**Type parameters:**

* **T**

* **E**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | [Result](README.md#result)\<T, E\> | The first Result. |
...xs | [Result](README.md#result)\<T, E\>[] | The remaining Results; this encoding is to ensure there is at least one Result. |

**Returns:** [Result](README.md#result)\<T, E\>

The first Ok, or the last Err if there were no Ok.

___

###  step

* **step**\<**A**\>(x: A): [Step](interfaces/step.md)\<A\>

Creates a Step.

**Type parameters:**

* **A**

Type of step results.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | A | Value to use. |

**Returns:** [Step](interfaces/step.md)\<A\>

A LoopAction.

___

###  step_

* **step_**(): [Step](interfaces/step.md)\<null\>

Creates a Step with null value.

**Returns:** [Step](interfaces/step.md)\<null\>

A LoopAction.

___

###  finish

* **finish**\<**B**\>(x: B): [Finish](interfaces/finish.md)\<B\>

Creates a Finish.

**Type parameters:**

* **B**

Type of finish results.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | B | Value to use. |

**Returns:** [Finish](interfaces/finish.md)\<B\>

A LoopAction.

___

###  fail

* **fail**\<**E**\>(x: E): [Fail](interfaces/fail.md)\<E\>

Creates a Fail.

**Type parameters:**

* **E**

Type of errors.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | E | Value to use. |

**Returns:** [Fail](interfaces/fail.md)\<E\>

A LoopAction.

___

###  fail_

* **fail_**(): [Fail](interfaces/fail.md)\<null\>

Creates a Fail with null value.

**Returns:** [Fail](interfaces/fail.md)\<null\>

A LoopAction.

___

###  loop

* **loop**\<**A**, **Z**, **E**\>(intialInput: A, strat: [LoopStrategy](interfaces/loopstrategy.md)\<A, Z, E\>): [Result](README.md#result)\<Z, E\>

Runs a loop which continuously gets input and attempts to parse it.
The loop strategy used will determine how the loop continues and ends.

```ts
const getInputFromSomewhere = () => '2';

const x = loop('1', {
  getInput() {
    const i = getInputFromSomewhere();
    return i == null ? fail('no input') : step(i);
  },

  parse(x: string) {
    const n = Number(x);
    return isNaN(n) ? fail('bad input') : finish(n);
  }
});

console.log(x);
>>> 1
```

**Type parameters:**

* **A**

Input type.

* **Z**

Output type.

* **E**

Error type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
intialInput | A | The first input to parse. |
strat | [LoopStrategy](interfaces/loopstrategy.md)\<A, Z, E\> | The loop strategy to use. |

**Returns:** [Result](README.md#result)\<Z, E\>

Either the parsed value or an error.

___

###  loop1

* **loop1**\<**A**, **Z**, **E**\>(strat: [LoopStrategy](interfaces/loopstrategy.md)\<A, Z, E\>): [Result](README.md#result)\<Z, E\>

Runs a loop which continuously gets input and attempts to parse it.
The loop strategy used will determine how the loop continues and ends.
This variant has no initial input.

```ts
const getInputFromSomewhere = () => '2';

const x = loop1({
  getInput() {
    const i = getInputFromSomewhere();
    return i == null ? fail('no input') : step(i);
  },

  parse(x: string) {
    const n = Number(x);
    return isNaN(n) ? fail('bad input') : finish(n);
  }
});

console.log(x);
>>> 2
```

**Type parameters:**

* **A**

Input type.

* **Z**

Output type.

* **E**

Error type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
strat | [LoopStrategy](interfaces/loopstrategy.md)\<A, Z, E\> | The loop strategy to use. |

**Returns:** [Result](README.md#result)\<Z, E\>

Either the parsed value or an error.

___

###  loopAsync

* **loopAsync**\<**A**, **Z**, **E**\>(intialInput: A, strat: [LoopStrategyAsync](interfaces/loopstrategyasync.md)\<A, Z, E\>): Promise\<[Result](README.md#result)\<Z, E\>\>

Runs a loop which continuously gets input and attempts to parse it.
The loop strategy used will determine how the loop continues and ends.
This variant of the function is asynchronous using `Promise`.

**Type parameters:**

* **A**

Input type.

* **Z**

Output type.

* **E**

Error type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
intialInput | A | The first input to parse. |
strat | [LoopStrategyAsync](interfaces/loopstrategyasync.md)\<A, Z, E\> | The loop strategy to use. |

**Returns:** Promise\<[Result](README.md#result)\<Z, E\>\>

Either the parsed value or an error.

___

###  loop1Async

* **loop1Async**\<**A**, **Z**, **E**\>(strat: [LoopStrategyAsync](interfaces/loopstrategyasync.md)\<A, Z, E\>): Promise\<[Result](README.md#result)\<Z, E\>\>

Runs a loop which continuously gets input and attempts to parse it.
The loop strategy used will determine how the loop continues and ends.
This variant has no initial input.
This variant of the function is asynchronous using `Promise`.

**Type parameters:**

* **A**

Input type.

* **Z**

Output type.

* **E**

Error type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
strat | [LoopStrategyAsync](interfaces/loopstrategyasync.md)\<A, Z, E\> | The loop strategy to use. |

**Returns:** Promise\<[Result](README.md#result)\<Z, E\>\>

Either the parsed value or an error.

___

###  noStrategy

* **noStrategy**(): [UnorderedStrategy](interfaces/unorderedstrategy.md)

Do not match any unordered argument at all.

**Returns:** [UnorderedStrategy](interfaces/unorderedstrategy.md)

The strategy.

___

###  longStrategy

* **longStrategy**(): [UnorderedStrategy](interfaces/unorderedstrategy.md)

Match unordered arguments according to conventional syntax.
'--flag' is a flag.
'--opt=' is an option.
'--opt=123' is a compact option.

**Returns:** [UnorderedStrategy](interfaces/unorderedstrategy.md)

The strategy.

___

###  longShortStrategy

* **longShortStrategy**(): [UnorderedStrategy](interfaces/unorderedstrategy.md)

Match unordered arguments according to conventional syntax.
'--flag' or '-flag' is a flag.
'--opt=' or '-opt=' is an option.
'--opt=123' or '-opt=123' is a compact option.

**Returns:** [UnorderedStrategy](interfaces/unorderedstrategy.md)

The strategy.

___

###  prefixedStrategy

* **prefixedStrategy**(prefixes: string[], separators: string[]): [UnorderedStrategy](interfaces/unorderedstrategy.md)

Match unordered arguments with custom prefix and separator.
The prefix is the part the preceeds the key name, e.g. '--' in '--foo'.
The separator is the part that delimits the key and value e.g. '=' in '--key=value'.
It is expected that there are no spaces in the prefixes and separators.
The matching is done in a case-sensitive manner.
Also note that if the input contains multiple of the separators, the matching may be ambiguous.

```ts
const st = prefixedStrategy(['--'], ['=']);
console.log(st.matchFlag('--f'));
>>> 'f'

console.log(st.matchOption('--opt='));
>>> 'opt'

console.log(st.matchCompactOption('--opt=15'));
>>> ['opt', '15']
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
prefixes | string[] | The prefixes to use for unordered arguments. They should be ordered by length in non-increasing order. |
separators | string[] | The symbols to use to separate the key and value in options. They should be ordered by length in non-increasing order. |

**Returns:** [UnorderedStrategy](interfaces/unorderedstrategy.md)

The strategy.

___

###  matchingStrategy

* **matchingStrategy**(flags: [Pairing](README.md#pairing), options: [Pairing](README.md#pairing), locales?: string | string[] | undefined, collatorOptions?: Intl.CollatorOptions): [UnorderedStrategy](interfaces/unorderedstrategy.md)

Match unordered arguments according to a record of the names to the list of words.
Prefixes like '--' and separators like '=' should be a part of the word.
This function uses
[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)
which can compare in different locales and different sensitivities.
Note that this only works for en-US if you are below Node 13.0.0.

```ts
const st = matchingStrategy({ flag: ['--flag', '-f'] }, {});
console.log(st.matchFlag('--flag'));
>>> 'flag'

console.log(st.matchOption('-f'));
>>> 'flag'

const stbase = matchingStrategy({ flag: ['--flag'] }, {}, 'en-US', { sensitivity: 'base' });
console.log(stbase.matchFlag('--FLAG'));
>>> 'flag'

console.log(stbase.matchFlag('--flág'));
>>> 'flag'
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
flags | [Pairing](README.md#pairing) | Words usable as flags. |
options | [Pairing](README.md#pairing) | Words usable as options. They should be ordered by length in non-increasing order. |
locales? | string &#124; string[] &#124; undefined | Locale(s) to use. |
collatorOptions? | Intl.CollatorOptions | Options for comparing strings. See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator) for more information. |

**Returns:** [UnorderedStrategy](interfaces/unorderedstrategy.md)

The strategy.

___

###  mapKeys

* **mapKeys**(strat: [UnorderedStrategy](interfaces/unorderedstrategy.md), f: function): [UnorderedStrategy](interfaces/unorderedstrategy.md)

Creates a new strategy that maps the names of flags and options in an unordered strategy.
```ts
const st1 = longStrategy();

console.log(st1.matchFlag('--foo'), st1.matchFlag('--FOO'));
>>> 'foo' 'FOO'

const st2 = mapStrategy(longStrategy(), k => k.toLowerCase());

console.log(st2.matchFlag('--foo'), st1.matchFlag('--FOO'));
>>> 'foo' 'foo'
```

**Parameters:**

* **strat**: [UnorderedStrategy](interfaces/unorderedstrategy.md)

A strategy.

* **f**: function

Creates a new name from the old name, or return null to not include it.

* (s: string): string | null

**Parameters:**

Name | Type |
------ | ------ |
s | string |

**Returns:** [UnorderedStrategy](interfaces/unorderedstrategy.md)

A new strategy.

___

###  renameKeys

* **renameKeys**(strat: [UnorderedStrategy](interfaces/unorderedstrategy.md), keys: [Pairing](README.md#pairing), keepNotFound: boolean, locales?: string | string[] | undefined, collatorOptions?: Intl.CollatorOptions): [UnorderedStrategy](interfaces/unorderedstrategy.md)

Creates a new strategy that renames the names of flags and options of another strategy.
This is done according to a record of the names to a list of words.
This function uses
[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)
which can compare in different locales and different sensitivities.
Note that this only works for en-US if you are below Node 13.0.0.

```ts
const st = renameStrategy(longStrategy(), { foo: ['bar'] });

console.log(st.matchFlag('--bar'));
>>> 'foo'
```

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
strat | [UnorderedStrategy](interfaces/unorderedstrategy.md) | - | A strategy. |
keys | [Pairing](README.md#pairing) | - | The pairing of keys. |
keepNotFound | boolean | true | Whether to keep keys that are not found in `keys`; defaults to true. |
locales? | string &#124; string[] &#124; undefined | - | Locale(s) to use. |
collatorOptions? | Intl.CollatorOptions | - | Options for comparing strings. See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator) for more information. |

**Returns:** [UnorderedStrategy](interfaces/unorderedstrategy.md)

A new strategy.

___

###  someToOk

* **someToOk**\<**T**, **E**\>(x: [Option](README.md#option)\<T\>, error: E): [Result](README.md#result)\<T, E\>

Converts an Option to a Result.
- Some -> Ok
- None -> Err

**Type parameters:**

* **T**

* **E**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | [Option](README.md#option)\<T\> | The Option. |
error | E | The error if None. |

**Returns:** [Result](README.md#result)\<T, E\>

A Result.

___

###  okToSome

* **okToSome**\<**T**, **E**\>(x: [Result](README.md#result)\<T, E\>): [Option](README.md#option)\<T\>

Converts a Result to an Option.
- Ok -> Some
- Err -> None

**Type parameters:**

* **T**

* **E**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | [Result](README.md#result)\<T, E\> | The Result. |

**Returns:** [Option](README.md#option)\<T\>

An Option.

___

###  errToSome

* **errToSome**\<**T**, **E**\>(x: [Result](README.md#result)\<T, E\>): [Option](README.md#option)\<E\>

Converts a Result to an Option.
- Ok -> None
- Err -> Some

**Type parameters:**

* **T**

* **E**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | [Result](README.md#result)\<T, E\> | The Result. |

**Returns:** [Option](README.md#option)\<E\>

An Option.

___

###  someToStep

* **someToStep**\<**A**, **B**, **E**\>(x: [Option](README.md#option)\<A\>, error: E): [LoopAction](README.md#loopaction)\<A, B, E\>

Converts an Option to a LoopAction.
- Some -> Step
- None -> Fail

**Type parameters:**

* **A**

* **B**

* **E**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | [Option](README.md#option)\<A\> | The Option. |
error | E | The error if None. |

**Returns:** [LoopAction](README.md#loopaction)\<A, B, E\>

A LoopAction.

___

###  someToFinish

* **someToFinish**\<**A**, **B**, **E**\>(x: [Option](README.md#option)\<B\>, error: E): [LoopAction](README.md#loopaction)\<A, B, E\>

Converts an Option to a LoopAction.
- Some -> Finish
- None -> Fail

**Type parameters:**

* **A**

* **B**

* **E**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | [Option](README.md#option)\<B\> | The Option. |
error | E | The error if None. |

**Returns:** [LoopAction](README.md#loopaction)\<A, B, E\>

A LoopAction.

___

###  okToStep

* **okToStep**\<**A**, **B**, **E**\>(x: [Result](README.md#result)\<A, E\>): [LoopAction](README.md#loopaction)\<A, B, E\>

Converts a Result to a LoopAction.
- Ok -> Step
- Err -> Fail

**Type parameters:**

* **A**

* **B**

* **E**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | [Result](README.md#result)\<A, E\> | The Result. |

**Returns:** [LoopAction](README.md#loopaction)\<A, B, E\>

A LoopAction.

___

###  okToFinish

* **okToFinish**\<**A**, **B**, **E**\>(x: [Result](README.md#result)\<B, E\>): [LoopAction](README.md#loopaction)\<A, B, E\>

Converts a Result to a LoopAction.
- Ok -> Finish
- Err -> Fail

**Type parameters:**

* **A**

* **B**

* **E**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | [Result](README.md#result)\<B, E\> | The Result. |

**Returns:** [LoopAction](README.md#loopaction)\<A, B, E\>

A LoopAction.
