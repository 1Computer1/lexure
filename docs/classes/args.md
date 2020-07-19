[lexure](../README.md) › [Args](args.md)

# Class: Args

A wrapper around the parser output for retrieving command arguments.

## Hierarchy

* **Args**

## Index

### Constructors

* [constructor](args.md#constructor)

### Properties

* [parserOutput](args.md#readonly-parseroutput)
* [usedIndices](args.md#readonly-usedindices)
* [position](args.md#position)
* [positionFromEnd](args.md#positionfromend)

### Accessors

* [finished](args.md#finished)
* [length](args.md#length)
* [remaining](args.md#remaining)

### Methods

* [single](args.md#single)
* [singleFromEnd](args.md#singlefromend)
* [many](args.md#many)
* [manyFromEnd](args.md#manyfromend)
* [flag](args.md#flag)
* [option](args.md#option)
* [options](args.md#options)
* [findMap](args.md#findmap)
* [filterMap](args.md#filtermap)

## Constructors

###  constructor

* **new Args**(parserOutput: [ParserOutput](../interfaces/parseroutput.md)): [Args](args.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
parserOutput | [ParserOutput](../interfaces/parseroutput.md) | The parser output.  |

**Returns:** [Args](args.md)

## Properties

### readonly parserOutput

* **parserOutput**: [ParserOutput](../interfaces/parseroutput.md)

The parser output.

___

### readonly usedIndices

* **usedIndices**: Set\<number\> = new Set()

The indices of the ordered tokens already retrieved.

___

###  position

* **position**: number = 0

The current position in the ordered tokens.
Increments from 0.

___

###  positionFromEnd

* **positionFromEnd**: number

The current position backwards in the ordered tokens.
Decrements from the end.

## Accessors

###  finished

* **get finished**(): boolean

Whether all ordered tokens have been used.

**Returns:** boolean

___

###  length

* **get length**(): number

The amount of ordered tokens.

**Returns:** number

___

###  remaining

* **get remaining**(): number

The amount of remaining ordered tokens.

**Returns:** number

## Methods

###  single

* **single**(): string | null

Retrieves the value of the next unused ordered token.
That token will now be consider used.

**Returns:** string | null

The value if there are tokens left.

___

###  singleFromEnd

* **singleFromEnd**(): string | null

Retrieves the value of the next unused ordered token from the end.
That token will now be consider used.

**Returns:** string | null

The value if there are tokens left.

___

###  many

* **many**(limit: number, from: number): [Token](../interfaces/token.md)[]

Retrieves many unused tokens.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
limit | number | Infinity | The limit on the amount of tokens to retrieve; defaults to infinite. |
from | number | this.position | Where to start looking for tokens; defaults to current position. |

**Returns:** [Token](../interfaces/token.md)[]

The tokens.

___

###  manyFromEnd

* **manyFromEnd**(limit: number, from: number): [Token](../interfaces/token.md)[]

Retrieves many unused tokens from the end.
Note that the order of retrieved tokens will be the same order as in the ordered tokens list.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
limit | number | Infinity | The limit on the amount of tokens to retrieve; defaults to infinite. |
from | number | this.positionFromEnd | Where to start looking for tokens; defaults to current position from end. |

**Returns:** [Token](../interfaces/token.md)[]

The tokens.

___

###  flag

* **flag**(key: string): boolean

Checks if a flag was given.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
key | string | The name of the flag. |

**Returns:** boolean

Whether the flag was given.

___

###  option

* **option**(key: string): string | null

Gets the last value of an option.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
key | string | The name of the option. |

**Returns:** string | null

The last value of the option if it was given.

___

###  options

* **options**(key: string): string[] | null

Gets all the values of an option.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
key | string | The name of the option. |

**Returns:** string[] | null

The value of the option if it was given.

___

###  findMap

* **findMap**\<**T**\>(f: function, from: number): [Option](../README.md#option)\<T\>

Finds and retrieves the first unused token that could be transformed.
That token will now be consider used.

**Type parameters:**

* **T**

Output type.

**Parameters:**

* **f**: function

Gives a pair of whether the transformation worked, and the resulting value.

* (x: string): [Option](../README.md#option)\<T\>

**Parameters:**

Name | Type |
------ | ------ |
x | string |

*default value  **from**: number= this.position

Where to start looking for tokens; defaults to current position.

**Returns:** [Option](../README.md#option)\<T\>

The resulting value if it was found.

___

###  filterMap

* **filterMap**\<**T**\>(f: function, limit: number, from: number): T[]

Filters and retrieves all unused tokens that could be transformed.
Those tokens will now be consider used.

**Type parameters:**

* **T**

Output type.

**Parameters:**

* **f**: function

Gives a pair of whether the transformation worked, and the resulting value.

* (x: string): [Option](../README.md#option)\<T\>

**Parameters:**

Name | Type |
------ | ------ |
x | string |

*default value  **limit**: number= Infinity

The limit on the amount of tokens to retrieve; defaults to infinite.

*default value  **from**: number= this.position

Where to start looking for tokens; defaults to current position.

**Returns:** T[]

The resulting values.
