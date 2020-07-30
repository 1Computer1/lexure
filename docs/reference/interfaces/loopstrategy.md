[lexure](../README.md) › [LoopStrategy](loopstrategy.md)

# Interface: LoopStrategy \<**A, Z, E**\>

A strategy for running an input loop.

## Type parameters

* **A**

Input type.

* **Z**

Output type.

* **E**

Error type.

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

* **getInput**(): [LoopAction](../README.md#loopaction)\<A, Z, E\>

Gets new input from somewhere e.g. reading a line.

**Returns:** [LoopAction](../README.md#loopaction)\<A, Z, E\>

A loop action that can: step with the input; finish with some parsed value; fail due to an error.

___

###  parse

* **parse**(input: A): [LoopAction](../README.md#loopaction)\<null, Z, E\>

Parses given input into the desired type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
input | A | The input. |

**Returns:** [LoopAction](../README.md#loopaction)\<null, Z, E\>

A loop action that can: step on; finish with some parsed value; fail due to an error.

___

### optional onInputError

* **onInputError**(error: E): [LoopAction](../README.md#loopaction)\<null, Z, E\>

Handles error on getting new input.
This function intercepts the `fail` case of `getInput`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
error | E | The error encountered. |

**Returns:** [LoopAction](../README.md#loopaction)\<null, Z, E\>

A loop action that can: step on; finish with some parsed value; fail due to an error.

___

### optional onParseError

* **onParseError**(error: E, input: A): [LoopAction](../README.md#loopaction)\<null, Z, E\>

Handles error on parsing input.
This function intercepts the `fail` case of `parse`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
error | E | The error encountered. |
input | A | The input that could not be parsed. |

**Returns:** [LoopAction](../README.md#loopaction)\<null, Z, E\>

A loop action that can: step on; finish with some parsed value; fail due to an error.
