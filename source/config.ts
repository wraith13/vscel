import * as vscode from 'vscode';
import { Cache } from "./cache";
const sectionKeyRegExp = /^(.+)\.([^.]+)$/;
type PropertiesBaseType =
{
    [key: string]:
    {
        default?: any;
        minimum?: any;
        maximum?: any;
    }
};
interface PackageJson<PropertiesT extends PropertiesBaseType>
{
    contributes: PackageJsonContributes<PropertiesT>;
}
interface PackageJsonContributes<PropertiesT extends PropertiesBaseType>
{
    configuration: PackageJsonConfiguration<PropertiesT>[];
}
interface PackageJsonConfiguration<PropertiesT extends PropertiesBaseType>
{
    properties: PropertiesT;
}
export const makeRoot = <PropertiesT extends PropertiesBaseType>(packageJson: PackageJson<PropertiesT>) =>
    new Root(packageJson.contributes.configuration[0].properties);
export class Root<PropertiesT extends PropertiesBaseType>
{
    constructor(public properties: PropertiesT) { }
    public makeEntry = <valueT>
    (
        key: keyof PropertiesT & string,
        validator?: (value: valueT) => boolean
    ) => new Entry(this.properties, key, validator);
    public makeMapEntry = <ObjectT>
    (
        key: keyof PropertiesT & string,
        mapObject: ObjectT
    ) => new MapEntry(this.properties, key, mapObject);
};
export class Entry<PropertiesT extends PropertiesBaseType, valueT>
{
    public defaultValue: valueT;
    public minValue: valueT | undefined;
    public maxValue: valueT | undefined;
    public constructor
    (
        public properties: PropertiesT,
        public key: keyof PropertiesT & string,
        public validator?: (value: valueT) => boolean
    )
    {
        this.defaultValue = properties[key].default;
        this.minValue = properties[key].minimum;
        this.maxValue = properties[key].maximum;
    }
    regulate = (rawKey: string, value: valueT): valueT =>
    {
        let result = value;
        if (this.validator && !this.validator(result))
        {
            // settings.json をテキストとして直接編集してる時はともかく GUI での編集時に無駄にエラー表示が行われてしまうので、エンドユーザーに対するエラー表示は行わない。
            //vscode.window.showErrorMessage(`${rawKey} setting value is invalid! Please check your settings.`);
            console.error(`"${rawKey}" setting value(${JSON.stringify(value)}) is invalid! Please check your settings.`);
            result = this.defaultValue;
        }
        else
        {
            if (undefined !== this.minValue && result < this.minValue)
            {
                result = this.minValue;
            }
            else
            if (undefined !== this.maxValue && this.maxValue < result)
            {
                result = this.maxValue;
            }
        }
        return result;
    };
    cache = new Cache
    (
        (languageId: string): valueT =>
        {
            let result: valueT;
            if (undefined === languageId || null === languageId || 0 === languageId.length)
            {
                const key = this.key.replace(sectionKeyRegExp, "$1");
                const name = this.key.replace(sectionKeyRegExp, "$2");
                result = <valueT>vscode.workspace.getConfiguration(key)[name];
                if (undefined === result)
                {
                    result = this.defaultValue;
                }
                else
                {
                    result = this.regulate(this.key, result);
                }
            }
            else
            {
                const langSection = vscode.workspace.getConfiguration(`[${languageId}]`, null);
                result = <valueT>langSection[this.key];
                if (undefined === result)
                {
                    result = this.get("");
                }
                else
                {
                    result = this.regulate(`[${languageId}].${this.key}`, result);
                }
            }
            return result;
        }
    );
    public get = this.cache.get;
    public getCache = this.cache.getCache;
    public clear = this.cache.clear;
}
export class MapEntry<PropertiesT extends PropertiesBaseType, ObjectT>
{
    public constructor
    (
        public properties: PropertiesT,
        public key: keyof PropertiesT & string,
        public mapObject: ObjectT
    )
    {
    }
    config = new Entry<PropertiesT, keyof ObjectT>(this.properties, this.key, makeEnumValidator(this.mapObject));
    public get = (languageId: string) => this.mapObject[this.config.cache.get(languageId)];
    public getCache = (languageId: string) => this.mapObject[this.config.cache.getCache(languageId)];
    public clear = this.config.cache.clear;
}
export const makeEnumValidator = <ObjectT>(mapObject: ObjectT): (value: keyof ObjectT) => boolean => (value: keyof ObjectT): boolean => 0 <= Object.keys(mapObject).indexOf(value.toString());
export const stringArrayValidator = (value: string[]) => "[object Array]" === Object.prototype.toString.call(value) && value.map(i => "string" === typeof i).reduce((a, b) => a && b, true);
