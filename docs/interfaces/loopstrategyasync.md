[lexure](../README.md) › [LoopStrategyAsync](loopstrategyasync.md)

# Interface: LoopStrategyAsync \<**S, A, Z, E**\>

A strategy for running an input loop asynchronously via `Promise`.

## Type parameters

* **S**

* **A**

* **Z**

* **E**

## Hierarchy

* **LoopStrategyAsync**

## Index

### Methods

* [getInput](loopstrategyasync.md#getinput)
* [parse](loopstrategyasync.md#parse)
* [onInputError](loopstrategyasync.md#optional-oninputerror)
* [onParseError](loopstrategyasync.md#optional-onparseerror)

## Methods

###  getInput

* **getInput**(state: S): Promise\<[LoopAction](../README.md#loopaction)\<A, Z, E\>\>

*Defined in [loop.ts:52](https://github.com/1Computer1/lexure/blob/f9054d8/src/loop.ts#L52)*

Gets new input from somewhere e.g. reading a line.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
state | S | Custom state. |

**Returns:** Promise\<[LoopAction](../README.md#loopaction)\<A, Z, E\>\>

A loop action that can: step with the input; finish with some parsed value; fail due to an error.

___

###  parse

* **parse**(input: A, state: S): Promise\<[LoopAction](../README.md#loopaction)\<null, Z, E\>\>

*Defined in [loop.ts:60](https://github.com/1Computer1/lexure/blob/f9054d8/src/loop.ts#L60)*

Parses given input into the desired type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
input | A | The input. |
state | S | Custom state. |

**Returns:** Promise\<[LoopAction](../README.md#loopaction)\<null, Z, E\>\>

A loop action that can: step on; finish with some parsed value; fail due to an error.

___

### optional onInputError

* **onInputError**(error: E, state: S): Promise\<[LoopAction](../README.md#loopaction)\<null, Z, E\>\>

*Defined in [loop.ts:69](https://github.com/1Computer1/lexure/blob/f9054d8/src/loop.ts#L69)*

Handles error on getting new input.
This function intercepts the `fail` case of `getInput`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
error | E | The error encountered. |
state | S | Custom state. |

**Returns:** Promise\<[LoopAction](../README.md#loopaction)\<null, Z, E\>\>

A loop action that can: step on; finish with some parsed value; fail due to an error.

___

### optional onParseError

* **onParseError**(error: E, input: A, state: S): Promise\<[LoopAction](../README.md#loopaction)\<null, Z, E\>\>

*Defined in [loop.ts:79](https://github.com/1Computer1/lexure/blob/f9054d8/src/loop.ts#L79)*

Handles error on parsing input.
This function intercepts the `fail` case of `parse`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
error | E | The error encountered. |
input | A | The input that could not be parsed. |
state | S | Custom state. |

**Returns:** Promise\<[LoopAction](../README.md#loopaction)\<null, Z, E\>\>

A loop action that can: step on; finish with some parsed value; fail due to an error.
