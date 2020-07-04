[lexure](../README.md) › ["option"](_option_.md)

# Module: "option"

## Index

### Interfaces

* [None](../interfaces/_option_.none.md)
* [Some](../interfaces/_option_.some.md)

### Type aliases

* [Option](_option_.md#option)

### Functions

* [none](_option_.md#none)
* [some](_option_.md#some)

## Type aliases

###  Option

Ƭ **Option**: *[Some](../interfaces/_option_.some.md)‹T› | [None](../interfaces/_option_.none.md)*

*Defined in [option.ts:5](https://github.com/1Computer1/lexure/blob/abecae6/src/option.ts#L5)*

A type that can express the lack of a value.
Used in this library for when a generic type could be nullable.

## Functions

###  none

▸ **none**(): *[None](../interfaces/_option_.none.md)*

*Defined in [option.ts:45](https://github.com/1Computer1/lexure/blob/abecae6/src/option.ts#L45)*

Creates a None.

**Returns:** *[None](../interfaces/_option_.none.md)*

An Option.

___

###  some

▸ **some**‹**T**›(`x`: T): *[Some](../interfaces/_option_.some.md)‹T›*

*Defined in [option.ts:37](https://github.com/1Computer1/lexure/blob/abecae6/src/option.ts#L37)*

Creates a Some.

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`x` | T | Value to use. |

**Returns:** *[Some](../interfaces/_option_.some.md)‹T›*

An Option.
