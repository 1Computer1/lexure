[lexure](../README.md) › ["unordered"](_unordered_.md)

# Module: "unordered"

## Index

### Interfaces

* [UnorderedStrategy](../interfaces/_unordered_.unorderedstrategy.md)

### Functions

* [caseInsensitiveStrategy](_unordered_.md#caseinsensitivestrategy)
* [exactStrategy](_unordered_.md#exactstrategy)
* [longShortStrategy](_unordered_.md#longshortstrategy)
* [longStrategy](_unordered_.md#longstrategy)
* [noStrategy](_unordered_.md#nostrategy)
* [prefixedStrategy](_unordered_.md#prefixedstrategy)

## Functions

###  caseInsensitiveStrategy

▸ **caseInsensitiveStrategy**(`flags`: string[], `options`: string[], `compactOptions`: string[], `locale?`: string | string[]): *[UnorderedStrategy](../interfaces/_unordered_.unorderedstrategy.md)*

*Defined in [unordered.ts:182](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/unordered.ts#L182)*

Match unordered arguments according to a list of possible words in a case-insensitive manner.
Prefixes like '--' and separators like '=' should be apart of the word.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`flags` | string[] | Words usable as flags. |
`options` | string[] | Words usable as options. |
`compactOptions` | string[] | Words usable as the key of compact options. |
`locale?` | string &#124; string[] | The locale(s) to use to compare case. |

**Returns:** *[UnorderedStrategy](../interfaces/_unordered_.unorderedstrategy.md)*

The strategy.

___

###  exactStrategy

▸ **exactStrategy**(`flags`: string[], `options`: string[], `compactOptions`: string[]): *[UnorderedStrategy](../interfaces/_unordered_.unorderedstrategy.md)*

*Defined in [unordered.ts:153](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/unordered.ts#L153)*

Match unordered arguments according to a list of possible words in a case-sensitive manner.
Prefixes like '--' and separators like '=' should be apart of the word.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`flags` | string[] | Words usable as flags. |
`options` | string[] | Words usable as options. |
`compactOptions` | string[] | Words usable as the key of compact options. |

**Returns:** *[UnorderedStrategy](../interfaces/_unordered_.unorderedstrategy.md)*

The strategy.

___

###  longShortStrategy

▸ **longShortStrategy**(): *[UnorderedStrategy](../interfaces/_unordered_.unorderedstrategy.md)*

*Defined in [unordered.ts:68](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/unordered.ts#L68)*

Match unordered arguments according to conventional syntax.
'--flag' or '-f' is a flag.
'--opt=' is an option.
'--opt=123' or '-o123' is a compact option.

**Returns:** *[UnorderedStrategy](../interfaces/_unordered_.unorderedstrategy.md)*

The strategy.

___

###  longStrategy

▸ **longStrategy**(): *[UnorderedStrategy](../interfaces/_unordered_.unorderedstrategy.md)*

*Defined in [unordered.ts:46](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/unordered.ts#L46)*

Match unordered arguments according to conventional syntax.
'--flag' is a flag.
'--opt=' is an option.
'--opt=123' is a compact option.

**Returns:** *[UnorderedStrategy](../interfaces/_unordered_.unorderedstrategy.md)*

The strategy.

___

###  noStrategy

▸ **noStrategy**(): *[UnorderedStrategy](../interfaces/_unordered_.unorderedstrategy.md)*

*Defined in [unordered.ts:31](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/unordered.ts#L31)*

Do not match any unordered argument at all.

**Returns:** *[UnorderedStrategy](../interfaces/_unordered_.unorderedstrategy.md)*

The strategy.

___

###  prefixedStrategy

▸ **prefixedStrategy**(`prefixes`: string[], `separators`: string[]): *[UnorderedStrategy](../interfaces/_unordered_.unorderedstrategy.md)*

*Defined in [unordered.ts:91](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/unordered.ts#L91)*

Match unordered arguments with custom prefix and separator.
The prefix is the part the preceeds the key name, e.g. '--' in '--foo'.
The separator is the part that delimits the key and value e.g. '=' in '--key=value'.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`prefixes` | string[] | The prefixes to use for unordered arguments. |
`separators` | string[] | The symbol to use to separate the key and value in options. |

**Returns:** *[UnorderedStrategy](../interfaces/_unordered_.unorderedstrategy.md)*

The strategy.
