[lexure](../README.md) › ["result"](_result_.md)

# Module: "result"

## Index

### Interfaces

* [Err](../interfaces/_result_.err.md)
* [Ok](../interfaces/_result_.ok.md)

### Type aliases

* [Result](_result_.md#result)

### Functions

* [err](_result_.md#err)
* [ok](_result_.md#ok)

## Type aliases

###  Result

Ƭ **Result**: *[Ok](../interfaces/_result_.ok.md)‹T› | [Err](../interfaces/_result_.err.md)‹E›*

*Defined in [result.ts:4](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/result.ts#L4)*

A type used to express computations that can fail.

## Functions

###  err

▸ **err**‹**T**›(`x`: T): *[Err](../interfaces/_result_.err.md)‹T›*

*Defined in [result.ts:50](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/result.ts#L50)*

Creates an Err.

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`x` | T | Value to use. |

**Returns:** *[Err](../interfaces/_result_.err.md)‹T›*

A Result.

___

###  ok

▸ **ok**‹**T**›(`x`: T): *[Ok](../interfaces/_result_.ok.md)‹T›*

*Defined in [result.ts:41](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/result.ts#L41)*

Creates an Ok.

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`x` | T | Value to use. |

**Returns:** *[Ok](../interfaces/_result_.ok.md)‹T›*

A Result.
