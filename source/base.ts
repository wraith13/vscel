export const simplyDeepCopy = <T>(object: T): T =>
{
    switch(typeof object)
    {
        case "object":
            if (Array.isArray(object))
            {
                const result = <unknown[]>[ ];
                object.forEach((value, index) => result[index] = simplyDeepCopy(value));
                return <any>result;
            }
            else
            {
                const result = <T>{ };
                Object.keys(object).forEach(i => (<any>result)[i] = simplyDeepCopy((<any>object)[i]));
                return result;
            }
        case "function":
            // 関数の場合だけそのまま返す。
            return object;
        default:
            return <T>JSON.parse(JSON.stringify(object));
    }
};
