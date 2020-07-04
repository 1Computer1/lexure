[lexure](../README.md) › ["parserOutput"](_parseroutput_.md)

# Module: "parserOutput"

## Index

### Interfaces

* [ParserOutput](../interfaces/_parseroutput_.parseroutput.md)

### Functions

* [emptyOutput](_parseroutput_.md#emptyoutput)
* [mergeOutputs](_parseroutput_.md#mergeoutputs)
* [outputFromJSON](_parseroutput_.md#outputfromjson)
* [outputToJSON](_parseroutput_.md#outputtojson)

## Functions

###  emptyOutput

▸ **emptyOutput**(): *[ParserOutput](../interfaces/_parseroutput_.parseroutput.md)*

*Defined in [parserOutput.ts:27](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/parserOutput.ts#L27)*

Creates an empty parser output.

**Returns:** *[ParserOutput](../interfaces/_parseroutput_.parseroutput.md)*

An empty output.

___

###  mergeOutputs

▸ **mergeOutputs**(...`ps`: [ParserOutput](../interfaces/_parseroutput_.parseroutput.md)[]): *[ParserOutput](../interfaces/_parseroutput_.parseroutput.md)*

*Defined in [parserOutput.ts:41](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/parserOutput.ts#L41)*

Merges multiple outputs into one.
Flags and options that appear later will be preferred if there are duplicates.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...ps` | [ParserOutput](../interfaces/_parseroutput_.parseroutput.md)[] | The outputs to merge. |

**Returns:** *[ParserOutput](../interfaces/_parseroutput_.parseroutput.md)*

The merged output.

___

###  outputFromJSON

▸ **outputFromJSON**(`obj`: Record‹string, unknown›): *[ParserOutput](../interfaces/_parseroutput_.parseroutput.md)*

*Defined in [parserOutput.ts:88](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/parserOutput.ts#L88)*

Converts JSON to a parser output.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`obj` | Record‹string, unknown› | A valid JSON input, following the schema from 'outputToJSON'. |

**Returns:** *[ParserOutput](../interfaces/_parseroutput_.parseroutput.md)*

The output.

___

###  outputToJSON

▸ **outputToJSON**(`p`: [ParserOutput](../interfaces/_parseroutput_.parseroutput.md)): *Record‹string, unknown›*

*Defined in [parserOutput.ts:75](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/parserOutput.ts#L75)*

Converts an output to JSON, where the flags and options are turned into arrays of entries.
You can recover the output with 'outputFromJSON'.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`p` | [ParserOutput](../interfaces/_parseroutput_.parseroutput.md) | The output. |

**Returns:** *Record‹string, unknown›*

The JSON.
