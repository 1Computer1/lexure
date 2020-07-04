[lexure](../README.md) › ["loop"](_loop_.md)

# Module: "loop"

## Index

### Interfaces

* [LoopStrategy](../interfaces/_loop_.loopstrategy.md)
* [LoopStrategyAsync](../interfaces/_loop_.loopstrategyasync.md)

### Functions

* [loop](_loop_.md#loop)
* [loop1](_loop_.md#loop1)
* [loop1Async](_loop_.md#loop1async)
* [loopAsync](_loop_.md#loopasync)

## Functions

###  loop

▸ **loop**‹**S**, **A**, **Z**, **E**›(`intialInput`: A, `state`: S, `strat`: [LoopStrategy](../interfaces/_loop_.loopstrategy.md)‹S, A, Z, E›): *[Result](_result_.md#result)‹Z, E›*

*Defined in [loop.ts:90](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/loop.ts#L90)*

Runs a loop which continuously gets input and attempts to parse it.
The loop strategy used will determine how the loop continues and ends.

**Type parameters:**

▪ **S**

▪ **A**

▪ **Z**

▪ **E**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`intialInput` | A | The first input to parse. |
`state` | S | Custom state to thread along the loop. |
`strat` | [LoopStrategy](../interfaces/_loop_.loopstrategy.md)‹S, A, Z, E› | The loop strategy to use. |

**Returns:** *[Result](_result_.md#result)‹Z, E›*

Either the parsed value or an error.

___

###  loop1

▸ **loop1**‹**S**, **A**, **Z**, **E**›(`state`: S, `strat`: [LoopStrategy](../interfaces/_loop_.loopstrategy.md)‹S, A, Z, E›): *[Result](_result_.md#result)‹Z, E›*

*Defined in [loop.ts:147](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/loop.ts#L147)*

Runs a loop which continuously gets input and attempts to parse it.
The loop strategy used will determine how the loop continues and ends.
This variant has no initial input.

**Type parameters:**

▪ **S**

▪ **A**

▪ **Z**

▪ **E**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`state` | S | Custom state to thread along the loop. |
`strat` | [LoopStrategy](../interfaces/_loop_.loopstrategy.md)‹S, A, Z, E› | The loop strategy to use. |

**Returns:** *[Result](_result_.md#result)‹Z, E›*

Either the parsed value or an error.

___

###  loop1Async

▸ **loop1Async**‹**S**, **A**, **Z**, **E**›(`state`: S, `strat`: [LoopStrategyAsync](../interfaces/_loop_.loopstrategyasync.md)‹S, A, Z, E›): *Promise‹[Result](_result_.md#result)‹Z, E››*

*Defined in [loop.ts:260](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/loop.ts#L260)*

Runs a loop which continuously gets input and attempts to parse it.
The loop strategy used will determine how the loop continues and ends.
This variant has no initial input.
This variant of the function is asynchronous using `Promise`.

**Type parameters:**

▪ **S**

▪ **A**

▪ **Z**

▪ **E**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`state` | S | Custom state to thread along the loop. |
`strat` | [LoopStrategyAsync](../interfaces/_loop_.loopstrategyasync.md)‹S, A, Z, E› | The loop strategy to use. |

**Returns:** *Promise‹[Result](_result_.md#result)‹Z, E››*

Either the parsed value or an error.

___

###  loopAsync

▸ **loopAsync**‹**S**, **A**, **Z**, **E**›(`intialInput`: A, `state`: S, `strat`: [LoopStrategyAsync](../interfaces/_loop_.loopstrategyasync.md)‹S, A, Z, E›): *Promise‹[Result](_result_.md#result)‹Z, E››*

*Defined in [loop.ts:202](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/loop.ts#L202)*

Runs a loop which continuously gets input and attempts to parse it.
The loop strategy used will determine how the loop continues and ends.
This variant of the function is asynchronous using `Promise`.

**Type parameters:**

▪ **S**

▪ **A**

▪ **Z**

▪ **E**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`intialInput` | A | The first input to parse. |
`state` | S | Custom state to thread along the loop. |
`strat` | [LoopStrategyAsync](../interfaces/_loop_.loopstrategyasync.md)‹S, A, Z, E› | The loop strategy to use. |

**Returns:** *Promise‹[Result](_result_.md#result)‹Z, E››*

Either the parsed value or an error.
