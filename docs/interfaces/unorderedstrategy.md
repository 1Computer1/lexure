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

Match a compact option.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
s | string | The string. |

**Returns:** [string, string] | null

A pair containing the name of the option and the value.
