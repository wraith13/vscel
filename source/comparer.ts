export const simple = <valueT>(a: valueT, b: valueT) =>
    a < b ? -1:
    b < a ? 1:
    0;
export const make = <objectT, valueT>(getValue: (object: objectT) => valueT) =>
    (a: objectT, b: objectT) => simple(getValue(a), getValue(b));
export const makeTypeCondition = <objectT, valueT>(type: string, getValue: (object: objectT) => valueT) =>
    undefined === getValue ?
        (a: objectT, b: objectT) => type === typeof a && type === typeof b:
        (a: objectT, b: objectT) => type === typeof getValue(a) && type === typeof getValue(b);
export const withCondition = <objectT, valueT>(conditionOrType: (a: objectT, b: objectT) => boolean, getValue: (object: objectT) => valueT) =>
    (a: objectT, b: objectT) => conditionOrType(a, b) ? make(getValue)(a, b): 0;
export const merge = <valueT>(comparerList: ((a: valueT, b: valueT) => number)[]) => (a: valueT, b: valueT) =>
{
    let result = 0;
    for(let i = 0; i < comparerList.length && 0 === result; ++i)
    {
        result = comparerList[i](a, b);
    }
    return result;
};
export const lowerCase = merge<string>([make(a => a.toLowerCase()), simple]);
