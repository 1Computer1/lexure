[lexure](../README.md) › [LoopStrategyAsync](loopstrategyasync.md)

# Interface: LoopStrategyAsync \<**S, A, Z, E**\>

A strategy for running an input loop asynchronously via `Promise`.

## Type parameters

* **S**

Custom state type.

* **A**

Input type.

* **Z**

Output type.

* **E**

Error type.

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
