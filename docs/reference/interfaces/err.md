[lexure](../README.md) › [Err](err.md)

# Interface: Err \<**E**\>

The computation failed.

## Type parameters

* **E**

Type of errors.

## Hierarchy

* **Err**

## Index

### Properties

* [success](err.md#readonly-success)
* [error](err.md#readonly-error)

## Properties

### readonly success

* **success**: false

If this an Err, this is false.

___

### readonly error

* **error**: E

The resulting error, which only exists on an Err.
