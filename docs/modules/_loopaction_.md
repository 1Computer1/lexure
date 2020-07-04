[lexure](../README.md) › ["loopAction"](_loopaction_.md)

# Module: "loopAction"

## Index

### Interfaces

* [Fail](../interfaces/_loopaction_.fail.md)
* [Finish](../interfaces/_loopaction_.finish.md)
* [Step](../interfaces/_loopaction_.step.md)

### Type aliases

* [LoopAction](_loopaction_.md#loopaction)

### Functions

* [fail](_loopaction_.md#fail)
* [finish](_loopaction_.md#finish)
* [step](_loopaction_.md#step)
* [step_](_loopaction_.md#step_)

## Type aliases

###  LoopAction

Ƭ **LoopAction**: *[Step](../interfaces/_loopaction_.step.md)‹A› | [Finish](../interfaces/_loopaction_.finish.md)‹B› | [Fail](../interfaces/_loopaction_.fail.md)‹E›*

*Defined in [loopAction.ts:5](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/loopAction.ts#L5)*

A type used to express actions in the loop.
Each action can have a value with it.

## Functions

###  fail

▸ **fail**‹**T**›(`x`: T): *[Fail](../interfaces/_loopaction_.fail.md)‹T›*

*Defined in [loopAction.ts:83](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/loopAction.ts#L83)*

Creates a Fail.

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`x` | T | Value to use. |

**Returns:** *[Fail](../interfaces/_loopaction_.fail.md)‹T›*

A LoopAction.

___

###  finish

▸ **finish**‹**T**›(`x`: T): *[Finish](../interfaces/_loopaction_.finish.md)‹T›*

*Defined in [loopAction.ts:74](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/loopAction.ts#L74)*

Creates a Finish.

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`x` | T | Value to use. |

**Returns:** *[Finish](../interfaces/_loopaction_.finish.md)‹T›*

A LoopAction.

___

###  step

▸ **step**‹**T**›(`x`: T): *[Step](../interfaces/_loopaction_.step.md)‹T›*

*Defined in [loopAction.ts:57](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/loopAction.ts#L57)*

Creates a Step.

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`x` | T | Value to use. |

**Returns:** *[Step](../interfaces/_loopaction_.step.md)‹T›*

A LoopAction.

___

###  step_

▸ **step_**(): *[Step](../interfaces/_loopaction_.step.md)‹null›*

*Defined in [loopAction.ts:65](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/loopAction.ts#L65)*

Creates a Step with null value.

**Returns:** *[Step](../interfaces/_loopaction_.step.md)‹null›*

A LoopAction.
