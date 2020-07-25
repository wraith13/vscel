export const simple = <valueT>(a: valueT, b: valueT) =>
    a < b ? -1:
    b < a ? 1:
    0;
export const make = <objectT, valueT>(getValue: (object: objectT) => valueT) =>
    (a: objectT, b: objectT) => simple(getValue(a), getValue(b));
export const makeTypeCondition = <valueT>(type: string) => (a: valueT, b: valueT) => type === typeof a && type === typeof b;
export const withCondition = <valueT>(conditionOrType: (a: valueT, b: valueT) => boolean, comparer: (a: valueT, b: valueT) => number) =>
    (a: valueT, b: valueT) => conditionOrType(a, b) ? comparer(a, b): 0;
export const makeWithCondition = <objectT, valueT>(getValue: (object: objectT) => valueT, condition: (a: valueT, b: valueT) => boolean) =>
    withCondition((a: objectT, b: objectT) => condition(getValue(a), getValue(b)), make(getValue));
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
export const json = make(a => JSON.stringify(a));
