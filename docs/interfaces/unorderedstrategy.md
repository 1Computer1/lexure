[lexure](../README.md) › [UnorderedStrategy](unorderedstrategy.md)

# Interface: UnorderedStrategy

A strategy to match unordered arguments in parsing.

## Hierarchy

* **UnorderedStrategy**

## Index

### Methods

* [matchFlag](unorderedstrategy.md#matchflag)
* [matchOption](unorderedstrategy.md#matchoption)
* [matchCompactOption](unorderedstrategy.md#matchcompactoption)

## Methods

###  matchFlag

* **matchFlag**(s: string): string | null

*Defined in [unordered.ts:10](https://github.com/1Computer1/lexure/blob/de74dcc/src/unordered.ts#L10)*

Match a flag.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
s | string | The string. |

**Returns:** string | null

The name of the flag.

___

###  matchOption

* **matchOption**(s: string): string | null

*Defined in [unordered.ts:17](https://github.com/1Computer1/lexure/blob/de74dcc/src/unordered.ts#L17)*

Match an option.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
s | string | The string. |

**Returns:** string | null

The name of the option.

___

###  matchCompactOption

* **matchCompactOption**(s: string): [string, string] | null

*Defined in [unordered.ts:24](https://github.com/1Computer1/lexure/blob/de74dcc/src/unordered.ts#L24)*

Match a compact option.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
s | string | The string. |

**Returns:** [string, string] | null

A pair containing the name of the option and the value.
