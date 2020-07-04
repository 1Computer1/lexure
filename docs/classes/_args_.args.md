[lexure](../README.md) › ["args"](../modules/_args_.md) › [Args](_args_.args.md)

# Class: Args

A wrapper around the parser output for retrieving command arguments.

## Hierarchy

* **Args**

## Index

### Constructors

* [constructor](_args_.args.md#constructor)

### Properties

* [parserOutput](_args_.args.md#readonly-parseroutput)
* [position](_args_.args.md#position)
* [positionFromEnd](_args_.args.md#positionfromend)
* [usedIndices](_args_.args.md#readonly-usedindices)

### Accessors

* [finished](_args_.args.md#finished)
* [length](_args_.args.md#length)
* [remaining](_args_.args.md#remaining)

### Methods

* [filterMap](_args_.args.md#filtermap)
* [findMap](_args_.args.md#findmap)
* [flag](_args_.args.md#flag)
* [many](_args_.args.md#many)
* [manyFromEnd](_args_.args.md#manyfromend)
* [option](_args_.args.md#option)
* [options](_args_.args.md#options)
* [single](_args_.args.md#single)
* [singleFromEnd](_args_.args.md#singlefromend)

## Constructors

###  constructor

\+ **new Args**(`parserOutput`: [ParserOutput](../interfaces/_parseroutput_.parseroutput.md)): *[Args](_args_.args.md)*

*Defined in [args.ts:29](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/args.ts#L29)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parserOutput` | [ParserOutput](../interfaces/_parseroutput_.parseroutput.md) | The parser output.  |

**Returns:** *[Args](_args_.args.md)*

## Properties

### `Readonly` parserOutput

• **parserOutput**: *[ParserOutput](../interfaces/_parseroutput_.parseroutput.md)*

*Defined in [args.ts:12](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/args.ts#L12)*

The parser output.

___

###  position

• **position**: *number* = 0

*Defined in [args.ts:23](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/args.ts#L23)*

The current position in the ordered tokens.
Increments from 0.

___

###  positionFromEnd

• **positionFromEnd**: *number*

*Defined in [args.ts:29](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/args.ts#L29)*

The current position backwards in the ordered tokens.
Decrements from the end.

___

### `Readonly` usedIndices

• **usedIndices**: *Set‹number›* = new Set()

*Defined in [args.ts:17](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/args.ts#L17)*

The indices of the ordered tokens already retrieved.

## Accessors

###  finished

• **get finished**(): *boolean*

*Defined in [args.ts:42](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/args.ts#L42)*

Whether all ordered tokens have been used.

**Returns:** *boolean*

___

###  length

• **get length**(): *number*

*Defined in [args.ts:49](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/args.ts#L49)*

The amount of ordered tokens.

**Returns:** *number*

___

###  remaining

• **get remaining**(): *number*

*Defined in [args.ts:56](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/args.ts#L56)*

The amount of remaining ordered tokens.

**Returns:** *number*

## Methods

###  filterMap

▸ **filterMap**‹**T**›(`f`: function, `limit`: number, `from`: number): *T[]*

*Defined in [args.ts:199](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/args.ts#L199)*

Filters and retrieves all unused tokens that could be transformed.
Those tokens will now be consider used.

**Type parameters:**

▪ **T**

**Parameters:**

▪ **f**: *function*

Gives a pair of whether the transformation worked, and the resulting value.

▸ (`x`: string): *[Option](../modules/_option_.md#option)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`x` | string |

▪`Default value`  **limit**: *number*= Infinity

The limit on the amount of tokens to retrieve; defaults to infinite.

▪`Default value`  **from**: *number*= this.position

Where to start looking for tokens; defaults to current position.

**Returns:** *T[]*

The resulting values.

___

###  findMap

▸ **findMap**‹**T**›(`f`: function, `from`: number): *[Option](../modules/_option_.md#option)‹T›*

*Defined in [args.ts:174](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/args.ts#L174)*

Finds and retrieves the first unused token that could be transformed.
That token will now be consider used.

**Type parameters:**

▪ **T**

**Parameters:**

▪ **f**: *function*

Gives a pair of whether the transformation worked, and the resulting value.

▸ (`x`: string): *[Option](../modules/_option_.md#option)‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`x` | string |

▪`Default value`  **from**: *number*= this.position

Where to start looking for tokens; defaults to current position.

**Returns:** *[Option](../modules/_option_.md#option)‹T›*

The resulting value if it was found.

___

###  flag

▸ **flag**(`key`: string): *boolean*

*Defined in [args.ts:142](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/args.ts#L142)*

Checks if a flag was given.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | The name of the flag. |

**Returns:** *boolean*

Whether the flag was given.

___

###  many

▸ **many**(`limit`: number, `from`: number): *[Token](../interfaces/_tokens_.token.md)[]*

*Defined in [args.ts:102](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/args.ts#L102)*

Retrieves many unused tokens.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`limit` | number | Infinity | The limit on the amount of tokens to retrieve; defaults to infinite. |
`from` | number | this.position | Where to start looking for tokens; defaults to current position. |

**Returns:** *[Token](../interfaces/_tokens_.token.md)[]*

The tokens.

___

###  manyFromEnd

▸ **manyFromEnd**(`limit`: number, `from`: number): *[Token](../interfaces/_tokens_.token.md)[]*

*Defined in [args.ts:123](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/args.ts#L123)*

Retrieves many unused tokens from the end.
Note that the order of retrieved tokens will be the same order as in the ordered tokens list.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`limit` | number | Infinity | The limit on the amount of tokens to retrieve; defaults to infinite. |
`from` | number | this.positionFromEnd | Where to start looking for tokens; defaults to current position from end. |

**Returns:** *[Token](../interfaces/_tokens_.token.md)[]*

The tokens.

___

###  option

▸ **option**(`key`: string): *string | null*

*Defined in [args.ts:151](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/args.ts#L151)*

Gets the last value of an option.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | The name of the option. |

**Returns:** *string | null*

The lastvalue of the option if it was given.

___

###  options

▸ **options**(`key`: string): *string[] | null*

*Defined in [args.ts:161](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/args.ts#L161)*

Gets all the values of an option.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | The name of the option. |

**Returns:** *string[] | null*

The value of the option if it was given.

___

###  single

▸ **single**(): *string | null*

*Defined in [args.ts:65](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/args.ts#L65)*

Retrieves the value of the next unused ordered token.
That token will now be consider used.

**Returns:** *string | null*

The value if there are tokens left.

___

###  singleFromEnd

▸ **singleFromEnd**(): *string | null*

*Defined in [args.ts:83](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/args.ts#L83)*

Retrieves the value of the next unused ordered token from the end.
That token will now be consider used.

**Returns:** *string | null*

The value if there are tokens left.
