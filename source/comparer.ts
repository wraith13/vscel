export type TypeOfResultType = "unknown" | "object" | "boolean" | "number" | "bigint" | "string" | "symbol" | "function" | string;
export type CompareResultType = -1 | 0 | 1;
export const basic = <valueT>(a: valueT, b: valueT): CompareResultType =>
    a < b ? -1:
    b < a ? 1:
    0;
export interface RawSource<objectT>
{
    raw: (a: objectT, b: objectT) => CompareResultType;
}
export interface Source<objectT, valueT, valueT2>
{
    condition?: ((a: objectT, b: objectT) => boolean) | TypeSource<objectT, valueT2>;
    getter: (object: objectT) => valueT;
}
export interface TypeSource<objectT, valueT>
{
    getter?: (object: objectT) => valueT;
    type: TypeOfResultType;
}
export const make = <objectT, valueT = unknown, valueT2 = unknown>
(
    source: ((object: objectT) => valueT) | RawSource<objectT> | Source<objectT, valueT, valueT2> |
        ((((object: objectT) => valueT) | RawSource<objectT> | Source<objectT, valueT, valueT2>)[])
): ((a: objectT, b: objectT) => CompareResultType) =>
{
    const invoker = <objectT>(i: ((object: objectT) => valueT) | RawSource<objectT> | Source<objectT, valueT, valueT2>): ((a: objectT, b: objectT) => CompareResultType) | undefined =>
    {
        const f = i as ((object: objectT) => valueT);
        if ("function" === typeof f)
        {
            return (a: objectT, b: objectT) => basic(f(a), f(b));
        }
        const r = i as RawSource<objectT>;
        if (undefined !== r?.raw)
        {
            return r.raw;
        }
        const s = i as Source<objectT, valueT, valueT2>;
        if (undefined !== s?.getter)
        {
            const body = (a: objectT, b: objectT) => basic(s.getter(a), s.getter(b));
            if (undefined === s.condition)
            {
                return body;
            }
            else
            {
                const f = s.condition as ((a: objectT, b: objectT) => boolean);
                if ("function" === typeof f)
                {
                    return (a: objectT, b: objectT) => f(a, b) ? body(a, b): 0;
                }
                else
                {
                    const t = (s.condition as TypeSource<objectT, valueT2>);
                    const getter = t.getter;
                    if (undefined === getter)
                    {
                        return (a: objectT, b: objectT) => t.type === typeof a && t.type === typeof b ? body(a, b): 0;
                    }
                    else
                    {
                        return (a: objectT, b: objectT) => t.type === typeof getter(a) && t.type === typeof getter(b) ? body(a, b): 0;
                    }
                }
            }
        }
        return undefined;
    };
    if (Array.isArray(source))
    {
        const comparerList = <((a: objectT, b: objectT) => CompareResultType)[]>source.map(invoker).filter(i => undefined !== i);
        return (a: objectT, b: objectT) =>
        {
            let result: CompareResultType  = 0;
            for(let i = 0; i < comparerList.length && 0 === result; ++i)
            {
                result = comparerList[i](a, b);
            }
            return result;
        };
    }
    else
    {
        return invoker(source) ?? (() => 0);
    }
};
export const lowerCase = make<string>([a => a.toLowerCase(), { raw:basic }]);
