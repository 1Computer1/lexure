[lexure](../README.md) › ["loop"](../modules/_loop_.md) › [LoopStrategy](_loop_.loopstrategy.md)

# Interface: LoopStrategy ‹**S, A, Z, E**›

A strategy for running an input loop.

## Type parameters

▪ **S**

▪ **A**

▪ **Z**

▪ **E**

## Hierarchy

* **LoopStrategy**

## Index

### Methods

* [getInput](_loop_.loopstrategy.md#getinput)
* [onInputError](_loop_.loopstrategy.md#optional-oninputerror)
* [onParseError](_loop_.loopstrategy.md#optional-onparseerror)
* [parse](_loop_.loopstrategy.md#parse)

## Methods

###  getInput

▸ **getInput**(`state`: S): *[LoopAction](../modules/_loopaction_.md#loopaction)‹A, Z, E›*

*Defined in [loop.ts:13](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/loop.ts#L13)*

Gets new input from somewhere e.g. reading a line.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`state` | S | Custom state. |

**Returns:** *[LoopAction](../modules/_loopaction_.md#loopaction)‹A, Z, E›*

A loop action that can: step with the input; finish with some parsed value; fail due to an error.

___

### `Optional` onInputError

▸ **onInputError**(`error`: E, `state`: S): *[LoopAction](../modules/_loopaction_.md#loopaction)‹null, Z, E›*

*Defined in [loop.ts:30](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/loop.ts#L30)*

Handles error on getting new input.
This function intercepts the `fail` case of `getInput`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`error` | E | The error encountered. |
`state` | S | Custom state. |

**Returns:** *[LoopAction](../modules/_loopaction_.md#loopaction)‹null, Z, E›*

A loop action that can: step on; finish with some parsed value; fail due to an error.

___

### `Optional` onParseError

▸ **onParseError**(`error`: E, `input`: A, `state`: S): *[LoopAction](../modules/_loopaction_.md#loopaction)‹null, Z, E›*

*Defined in [loop.ts:40](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/loop.ts#L40)*

Handles error on parsing input.
This function intercepts the `fail` case of `parse`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`error` | E | The error encountered. |
`input` | A | The input that could not be parsed. |
`state` | S | Custom state. |

**Returns:** *[LoopAction](../modules/_loopaction_.md#loopaction)‹null, Z, E›*

A loop action that can: step on; finish with some parsed value; fail due to an error.

___

###  parse

▸ **parse**(`input`: A, `state`: S): *[LoopAction](../modules/_loopaction_.md#loopaction)‹null, Z, E›*

*Defined in [loop.ts:21](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/loop.ts#L21)*

Parses given input into the desired type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`input` | A | The input. |
`state` | S | Custom state. |

**Returns:** *[LoopAction](../modules/_loopaction_.md#loopaction)‹null, Z, E›*

A loop action that can: step on; finish with some parsed value; fail due to an error.
