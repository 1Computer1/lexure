[lexure](../README.md) › [LoopStrategy](loopstrategy.md)

# Interface: LoopStrategy \<**S, A, Z, E**\>

A strategy for running an input loop.

## Type parameters

* **S**

* **A**

* **Z**

* **E**

## Hierarchy

* **LoopStrategy**

## Index

### Methods

* [getInput](loopstrategy.md#getinput)
* [parse](loopstrategy.md#parse)
* [onInputError](loopstrategy.md#optional-oninputerror)
* [onParseError](loopstrategy.md#optional-onparseerror)

## Methods

###  getInput

* **getInput**(state: S): [LoopAction](../README.md#loopaction)\<A, Z, E\>

*Defined in [loop.ts:13](https://github.com/1Computer1/lexure/blob/de74dcc/src/loop.ts#L13)*

Gets new input from somewhere e.g. reading a line.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
state | S | Custom state. |

**Returns:** [LoopAction](../README.md#loopaction)\<A, Z, E\>

A loop action that can: step with the input; finish with some parsed value; fail due to an error.

___

###  parse

* **parse**(input: A, state: S): [LoopAction](../README.md#loopaction)\<null, Z, E\>

*Defined in [loop.ts:21](https://github.com/1Computer1/lexure/blob/de74dcc/src/loop.ts#L21)*

Parses given input into the desired type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
input | A | The input. |
state | S | Custom state. |

**Returns:** [LoopAction](../README.md#loopaction)\<null, Z, E\>

A loop action that can: step on; finish with some parsed value; fail due to an error.

___

### optional onInputError

* **onInputError**(error: E, state: S): [LoopAction](../README.md#loopaction)\<null, Z, E\>

*Defined in [loop.ts:30](https://github.com/1Computer1/lexure/blob/de74dcc/src/loop.ts#L30)*

Handles error on getting new input.
This function intercepts the `fail` case of `getInput`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
error | E | The error encountered. |
state | S | Custom state. |

**Returns:** [LoopAction](../README.md#loopaction)\<null, Z, E\>

A loop action that can: step on; finish with some parsed value; fail due to an error.

___

### optional onParseError

* **onParseError**(error: E, input: A, state: S): [LoopAction](../README.md#loopaction)\<null, Z, E\>

*Defined in [loop.ts:40](https://github.com/1Computer1/lexure/blob/de74dcc/src/loop.ts#L40)*

Handles error on parsing input.
This function intercepts the `fail` case of `parse`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
error | E | The error encountered. |
input | A | The input that could not be parsed. |
state | S | Custom state. |

**Returns:** [LoopAction](../README.md#loopaction)\<null, Z, E\>

A loop action that can: step on; finish with some parsed value; fail due to an error.
