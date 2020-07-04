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
* [UnorderedStrategy](interfaces/unorderedstrategy.md)

### Type aliases

* [Option](README.md#option)

### Functions

* [joinTokens](README.md#jointokens)
* [extractCommand](README.md#extractcommand)
* [emptyOutput](README.md#emptyoutput)
* [mergeOutputs](README.md#mergeoutputs)
* [outputToJSON](README.md#outputtojson)
* [outputFromJSON](README.md#outputfromjson)
* [some](README.md#some)
* [none](README.md#none)
* [noStrategy](README.md#nostrategy)
* [longStrategy](README.md#longstrategy)
* [longShortStrategy](README.md#longshortstrategy)
* [prefixedStrategy](README.md#prefixedstrategy)
* [exactStrategy](README.md#exactstrategy)
* [caseInsensitiveStrategy](README.md#caseinsensitivestrategy)

## Type aliases

###  Option

* **Option**: [Some](interfaces/some.md)\<T\> | [None](interfaces/none.md)

*Defined in [option.ts:5](https://github.com/1Computer1/lexure/blob/1fda5db/src/option.ts#L5)*

A type that can express the lack of a value.
Used in this library for when a generic type could be nullable.

## Functions

###  joinTokens

* **joinTokens**(tokens: [Token](interfaces/token.md)[], separator: string | null, raw: boolean): string

*Defined in [tokens.ts:29](https://github.com/1Computer1/lexure/blob/1fda5db/src/tokens.ts#L29)*

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

* **extractCommand**(matchPrefix: function, tokens: [Token](interfaces/token.md)[], mutate: boolean): [Token](interfaces/token.md) | null

*Defined in [tokens.ts:55](https://github.com/1Computer1/lexure/blob/1fda5db/src/tokens.ts#L55)*

Extracts a command from the first one or two tokens from a list of tokens.
The command format is '<prefix> <command>', and the space is optional.

**Parameters:**

* **matchPrefix**: function

A function that gives the length of the prefix if there is one.

* (s: string): number | null

**Parameters:**

Name | Type |
------ | ------ |
s | string |

* **tokens**: [Token](interfaces/token.md)[]

Tokens to check.

*default value  **mutate**: boolean= true

Whether to mutate the list of tokens.

**Returns:** [Token](interfaces/token.md) | null

The token containing the name of the command.
This may be a token from the list or a new token.

___

###  emptyOutput

* **emptyOutput**(): [ParserOutput](interfaces/parseroutput.md)

*Defined in [parserOutput.ts:27](https://github.com/1Computer1/lexure/blob/1fda5db/src/parserOutput.ts#L27)*

Creates an empty parser output.

**Returns:** [ParserOutput](interfaces/parseroutput.md)

An empty output.

___

###  mergeOutputs

* **mergeOutputs**(...ps: [ParserOutput](interfaces/parseroutput.md)[]): [ParserOutput](interfaces/parseroutput.md)

*Defined in [parserOutput.ts:41](https://github.com/1Computer1/lexure/blob/1fda5db/src/parserOutput.ts#L41)*

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

*Defined in [parserOutput.ts:75](https://github.com/1Computer1/lexure/blob/1fda5db/src/parserOutput.ts#L75)*

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

*Defined in [parserOutput.ts:88](https://github.com/1Computer1/lexure/blob/1fda5db/src/parserOutput.ts#L88)*

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

*Defined in [option.ts:37](https://github.com/1Computer1/lexure/blob/1fda5db/src/option.ts#L37)*

Creates a Some.

**Type parameters:**

* **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
x | T | Value to use. |

**Returns:** [Some](interfaces/some.md)\<T\>

An Option.

___

###  none

* **none**(): [None](interfaces/none.md)

*Defined in [option.ts:45](https://github.com/1Computer1/lexure/blob/1fda5db/src/option.ts#L45)*

Creates a None.

**Returns:** [None](interfaces/none.md)

An Option.

___

###  noStrategy

* **noStrategy**(): [UnorderedStrategy](interfaces/unorderedstrategy.md)

*Defined in [unordered.ts:31](https://github.com/1Computer1/lexure/blob/1fda5db/src/unordered.ts#L31)*

Do not match any unordered argument at all.

**Returns:** [UnorderedStrategy](interfaces/unorderedstrategy.md)

The strategy.

___

###  longStrategy

* **longStrategy**(): [UnorderedStrategy](interfaces/unorderedstrategy.md)

*Defined in [unordered.ts:46](https://github.com/1Computer1/lexure/blob/1fda5db/src/unordered.ts#L46)*

Match unordered arguments according to conventional syntax.
'--flag' is a flag.
'--opt=' is an option.
'--opt=123' is a compact option.

**Returns:** [UnorderedStrategy](interfaces/unorderedstrategy.md)

The strategy.

___

###  longShortStrategy

* **longShortStrategy**(): [UnorderedStrategy](interfaces/unorderedstrategy.md)

*Defined in [unordered.ts:68](https://github.com/1Computer1/lexure/blob/1fda5db/src/unordered.ts#L68)*

Match unordered arguments according to conventional syntax.
'--flag' or '-f' is a flag.
'--opt=' is an option.
'--opt=123' or '-o123' is a compact option.

**Returns:** [UnorderedStrategy](interfaces/unorderedstrategy.md)

The strategy.

___

###  prefixedStrategy

* **prefixedStrategy**(prefixes: string[], separators: string[]): [UnorderedStrategy](interfaces/unorderedstrategy.md)

*Defined in [unordered.ts:91](https://github.com/1Computer1/lexure/blob/1fda5db/src/unordered.ts#L91)*

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

*Defined in [unordered.ts:153](https://github.com/1Computer1/lexure/blob/1fda5db/src/unordered.ts#L153)*

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

*Defined in [unordered.ts:182](https://github.com/1Computer1/lexure/blob/1fda5db/src/unordered.ts#L182)*

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
