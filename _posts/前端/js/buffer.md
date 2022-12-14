## `Endianness`

字节序，或字节顺序（"Endian"、"endianness" 或 "byte-order"），描述了计算机如何组织字节，组成对应的数字。

每个内存存储位置都有一个索引或地址。每一 字节可以存储一个8位数字（即 介于`0x00` 和 `0xff` 之间），因此，你必须保留不止一个字节来储存一个更大的数字。现在，大部分需占用多个字节的数字排序方式是 **little-endian**（译者注：可称小字节序、低字节序，即低位字节排放在内存的低地址端，高位字节排放在内存的高地址端。与之对应的 big-endian 排列方式相反，可称大字节序、高字节序）

## `ArrayBuffer`

**`ArrayBuffer`** 对象用来表示通用的、固定长度的原始二进制数据缓冲区。

它是一个字节数组，通常在其他语言中称为“byte array”。

你**不能直接操作 `ArrayBuffer` 的内容**，而是要通过[类型数组对象(TypedArray)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)或 [`DataView`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView) 对象来操作，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。

`ArrayBuffer` 构造函数用来创建一个指定字节长度的 `ArrayBuffer` 对象。也可以从`Base64`字符串或本地文件中获取`ArrayBuffer`。

## `DataView`

**`DataView`** 视图是一个可以从 二进制[`ArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 对象中读写多种数值类型的底层接口，使用它时，不用考虑不同平台的[字节序](https://developer.mozilla.org/zh-CN/docs/Glossary/Endianness)问题。

## `TypedArray`

一个**类型化数组**（**`TypedArray`**）对象描述了一个底层的[二进制数据缓冲区](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)（binary data buffer）的一个类数组视图（view）。事实上，没有名为 `TypedArray` 的全局属性，也没有一个名为 `TypedArray` 的构造函数。

```javascript
// 下面代码是语法格式，不能直接运行，
// TypedArray 关键字需要替换为底部列出的构造函数。
new TypedArray();
new TypedArray(length);
new TypedArray(typedArray);
new TypedArray(object);
new TypedArray(buffer [, byteOffset [, length]]);

// TypedArray 指的是以下的其中之一：

Int8Array();
Uint8Array();
Uint8ClampedArray(); // 8位无符号整型固定数组
Int16Array();
Uint16Array();
Int32Array();
Uint32Array();
Float32Array();
Float64Array();
```

