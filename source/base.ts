export const simplyDeepCopy = <T>(object: T) => <T>JSON.parse(JSON.stringify(object));
