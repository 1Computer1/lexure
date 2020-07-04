[lexure](../README.md) › ["tokens"](_tokens_.md)

# Module: "tokens"

## Index

### Interfaces

* [Token](../interfaces/_tokens_.token.md)

### Functions

* [extractCommand](_tokens_.md#extractcommand)
* [joinTokens](_tokens_.md#jointokens)

## Functions

###  extractCommand

▸ **extractCommand**(`matchPrefix`: function, `tokens`: [Token](../interfaces/_tokens_.token.md)[], `mutate`: boolean): *[Token](../interfaces/_tokens_.token.md) | null*

*Defined in [tokens.ts:55](https://github.com/1Computer1/lexure/blob/abecae6/src/tokens.ts#L55)*

Extracts a command from the first one or two tokens from a list of tokens.
The command format is '<prefix> <command>', and the space is optional.

**Parameters:**

▪ **matchPrefix**: *function*

A function that gives the length of the prefix if there is one.

▸ (`s`: string): *number | null*

**Parameters:**

Name | Type |
------ | ------ |
`s` | string |

▪ **tokens**: *[Token](../interfaces/_tokens_.token.md)[]*

Tokens to check.

▪`Default value`  **mutate**: *boolean*= true

Whether to mutate the list of tokens.

**Returns:** *[Token](../interfaces/_tokens_.token.md) | null*

The token containing the name of the command.
This may be a token from the list or a new token.

___

###  joinTokens

▸ **joinTokens**(`tokens`: [Token](../interfaces/_tokens_.token.md)[], `separator`: string | null, `raw`: boolean): *string*

*Defined in [tokens.ts:29](https://github.com/1Computer1/lexure/blob/abecae6/src/tokens.ts#L29)*

Joins tokens together.
By default, this keeps as much of the original input as possible.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`tokens` | [Token](../interfaces/_tokens_.token.md)[] | - | Tokens to join. |
`separator` | string &#124; null | null | The separator, if null, will use original trailing whitespace; defaults to null. |
`raw` | boolean | true | Whether to use raw values e.g. with quotes; defaults to true. |

**Returns:** *string*

The joined string.
