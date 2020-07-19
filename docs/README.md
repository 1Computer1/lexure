[lexure](README.md)

# lexure

## Index

### Classes

* [Args](classes/args.md)
* [Lexer](classes/lexer.md)
* [Parser](classes/parser.md)

### Interfaces

* [Token](interfaces/token.md)
* [ParserOutput](interfaces/parseroutput.md)
* [Some](interfaces/some.md)
* [None](interfaces/none.md)
* [Step](interfaces/step.md)
* [Finish](interfaces/finish.md)
* [Fail](interfaces/fail.md)
* [Ok](interfaces/ok.md)
* [Err](interfaces/err.md)
* [LoopStrategy](interfaces/loopstrategy.md)
* [LoopStrategyAsync](interfaces/loopstrategyasync.md)
* [UnorderedStrategy](interfaces/unorderedstrategy.md)

### Type aliases

* [MatchPrefix](README.md#matchprefix)
* [Option](README.md#option)
* [LoopAction](README.md#loopaction)
* [Result](README.md#result)

### Functions

* [joinTokens](README.md#jointokens)
* [extractCommand](README.md#extractcommand)
* [emptyOutput](README.md#emptyoutput)
* [mergeOutputs](README.md#mergeoutputs)
* [outputToJSON](README.md#outputtojson)
* [outputFromJSON](README.md#outputfromjson)
* [some](README.md#some)
* [none](README.md#none)
* [sliceTo](README.md#sliceto)
* [step](README.md#step)
* [step_](README.md#step_)
* [finish](README.md#finish)
* [fail](README.md#fail)
* [ok](README.md#ok)
* [err](README.md#err)
* [loop](README.md#loop)
* [loop1](README.md#loop1)
* [loopAsync](README.md#loopasync)
* [loop1Async](README.md#loop1async)
* [noStrategy](README.md#nostrategy)
* [longStrategy](README.md#longstrategy)
* [longShortStrategy](README.md#longshortstrategy)
* [prefixedStrategy](README.md#prefixedstrategy)
* [exactStrategy](README.md#exactstrategy)
* [caseInsensitiveStrategy](README.md#caseinsensitivestrategy)

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

###  LoopAction

* **LoopAction**: [Step](interfaces/step.md)\<A\> | [Finish](interfaces/finish.md)\<B\> | [Fail](interfaces/fail.md)\<E\>

A type used to express actions in the loop.
Each action can have a value with it.

___

###  Result

* **Result**: [Ok](interfaces/ok.md)\<T\> | [Err](interfaces/err.md)\<E\>

A type used to express computations that can fail.

## Functions

###  joinTokens

* **joinTokens**(tokens: [Token](interfaces/token.md)[], separator: string | null, raw: boolean): string

Joins tokens together.
By default, this keeps as much of the original input as possible.

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

###  sliceTo

* **sliceTo**(word: string, xs: string[]): string

**Parameters:**

Name | Type |
------ | ------ |
word | string |
xs | string[] |

**Returns:** string

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

###  loop

* **loop**\<**S**, **A**, **Z**, **E**\>(intialInput: A, state: S, strat: [LoopStrategy](interfaces/loopstrategy.md)\<S, A, Z, E\>): [Result](README.md#result)\<Z, E\>

Runs a loop which continuously gets input and attempts to parse it.
The loop strategy used will determine how the loop continues and ends.

**Type parameters:**

* **S**

Custom state type.

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
state | S | Custom state to thread along the loop. |
strat | [LoopStrategy](interfaces/loopstrategy.md)\<S, A, Z, E\> | The loop strategy to use. |

**Returns:** [Result](README.md#result)\<Z, E\>

Either the parsed value or an error.

___

###  loop1

* **loop1**\<**S**, **A**, **Z**, **E**\>(state: S, strat: [LoopStrategy](interfaces/loopstrategy.md)\<S, A, Z, E\>): [Result](README.md#result)\<Z, E\>

Runs a loop which continuously gets input and attempts to parse it.
The loop strategy used will determine how the loop continues and ends.
This variant has no initial input.

**Type parameters:**

* **S**

Custom state type.

* **A**

Input type.

* **Z**

Output type.

* **E**

Error type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
state | S | Custom state to thread along the loop. |
strat | [LoopStrategy](interfaces/loopstrategy.md)\<S, A, Z, E\> | The loop strategy to use. |

**Returns:** [Result](README.md#result)\<Z, E\>

Either the parsed value or an error.

___

###  loopAsync

* **loopAsync**\<**S**, **A**, **Z**, **E**\>(intialInput: A, state: S, strat: [LoopStrategyAsync](interfaces/loopstrategyasync.md)\<S, A, Z, E\>): Promise\<[Result](README.md#result)\<Z, E\>\>

Runs a loop which continuously gets input and attempts to parse it.
The loop strategy used will determine how the loop continues and ends.
This variant of the function is asynchronous using `Promise`.

**Type parameters:**

* **S**

Custom state type.

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
state | S | Custom state to thread along the loop. |
strat | [LoopStrategyAsync](interfaces/loopstrategyasync.md)\<S, A, Z, E\> | The loop strategy to use. |

**Returns:** Promise\<[Result](README.md#result)\<Z, E\>\>

Either the parsed value or an error.

___

###  loop1Async

* **loop1Async**\<**S**, **A**, **Z**, **E**\>(state: S, strat: [LoopStrategyAsync](interfaces/loopstrategyasync.md)\<S, A, Z, E\>): Promise\<[Result](README.md#result)\<Z, E\>\>

Runs a loop which continuously gets input and attempts to parse it.
The loop strategy used will determine how the loop continues and ends.
This variant has no initial input.
This variant of the function is asynchronous using `Promise`.

**Type parameters:**

* **S**

Custom state type.

* **A**

Input type.

* **Z**

Output type.

* **E**

Error type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
state | S | Custom state to thread along the loop. |
strat | [LoopStrategyAsync](interfaces/loopstrategyasync.md)\<S, A, Z, E\> | The loop strategy to use. |

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
'--flag' or '-f' is a flag.
'--opt=' is an option.
'--opt=123' or '-o123' is a compact option.

**Returns:** [UnorderedStrategy](interfaces/unorderedstrategy.md)

The strategy.

___

###  prefixedStrategy

* **prefixedStrategy**(prefixes: string[], separators: string[]): [UnorderedStrategy](interfaces/unorderedstrategy.md)

Match unordered arguments with custom prefix and separator.
The prefix is the part the preceeds the key name, e.g. '--' in '--foo'.
The separator is the part that delimits the key and value e.g. '=' in '--key=value'.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
prefixes | string[] | The prefixes to use for unordered arguments. |
separators | string[] | The symbol to use to separate the key and value in options. |

**Returns:** [UnorderedStrategy](interfaces/unorderedstrategy.md)

The strategy.

___

###  exactStrategy

* **exactStrategy**(flags: string[], options: string[], compactOptions: string[]): [UnorderedStrategy](interfaces/unorderedstrategy.md)

Match unordered arguments according to a list of possible words in a case-sensitive manner.
Prefixes like '--' and separators like '=' should be apart of the word.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
flags | string[] | Words usable as flags. |
options | string[] | Words usable as options. |
compactOptions | string[] | Words usable as the key of compact options. |

**Returns:** [UnorderedStrategy](interfaces/unorderedstrategy.md)

The strategy.

___

###  caseInsensitiveStrategy

* **caseInsensitiveStrategy**(flags: string[], options: string[], compactOptions: string[], locale?: string | string[]): [UnorderedStrategy](interfaces/unorderedstrategy.md)

Match unordered arguments according to a list of possible words in a case-insensitive manner.
Prefixes like '--' and separators like '=' should be apart of the word.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
flags | string[] | Words usable as flags. |
options | string[] | Words usable as options. |
compactOptions | string[] | Words usable as the key of compact options. |
locale? | string &#124; string[] | The locale(s) to use to compare case. |

**Returns:** [UnorderedStrategy](interfaces/unorderedstrategy.md)

The strategy.
