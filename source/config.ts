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
export interface InspectResultType<valueT>
{
    key: string,
    defaultValue?: valueT,
    globalValue?: valueT,
    workspaceValue?: valueT,
    workspaceFolderValue?: valueT,
    defaultLanguageValue?: valueT,
    globalLanguageValue?: valueT,
    workspaceLanguageValue?: valueT,
    workspaceFolderLanguageValue?: valueT,
    languageIds?: string[],
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
    }
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
    inspectCache = new Cache
    (
        (languageId: string): InspectResultType<valueT> =>
        {
            let result: InspectResultType<valueT>;
            if (undefined === languageId || null === languageId || 0 === languageId.length)
            {
                const key = this.key.replace(sectionKeyRegExp, "$1");
                const name = this.key.replace(sectionKeyRegExp, "$2");
                result = <InspectResultType<valueT>>vscode.workspace.getConfiguration(key).inspect(name);
            }
            else
            {
                const langSection = vscode.workspace.getConfiguration(`[${languageId}]`, null);
                result = <InspectResultType<valueT>>langSection.inspect(this.key);
            }
            return result;
        }
    );
    public get = this.cache.get;
    public getCache = this.cache.getCache;
    public inspect = this.inspectCache.get;
    public getInspectCache = this.inspectCache.getCache;
    public clear = () =>
    {
        this.cache.clear();
        this.inspectCache.clear();
    }
    public set =
    async (
        value: valueT,
        scope?: vscode.ConfigurationScope | null,
        configurationTarget?: vscode.ConfigurationTarget,
        overrideInLanguage?: boolean
    ) =>
    {
        const key = this.key.replace(sectionKeyRegExp, "$1");
        const name = this.key.replace(sectionKeyRegExp, "$2");
        const config = vscode.workspace.getConfiguration(key, scope);
        if (undefined !== configurationTarget)
        {
            await config.update(name, value, configurationTarget, overrideInLanguage);
        }
        else
        {
            const inspectResult = config.inspect(name);
            if (undefined !== inspectResult?.workspaceFolderLanguageValue)
            {
                await config.update(name, value, vscode.ConfigurationTarget.WorkspaceFolder, true);
            }
            else
            if (undefined !== inspectResult?.workspaceLanguageValue)
            {
                await config.update(name, value, vscode.ConfigurationTarget.Workspace, true);
            }
            else
            if (undefined !== inspectResult?.globalLanguageValue || true === overrideInLanguage)
            {
                await config.update(name, value, vscode.ConfigurationTarget.Global, true);
            }
            if (undefined !== inspectResult?.workspaceFolderValue)
            {
                await config.update(name, value, vscode.ConfigurationTarget.WorkspaceFolder, false);
            }
            else
            if (undefined !== inspectResult?.workspaceValue)
            {
                await config.update(name, value, vscode.ConfigurationTarget.Workspace, false);
            }
            else
            //if (undefined !== inspectResult?.globalValue)
            {
                await config.update(name, value, vscode.ConfigurationTarget.Global, false);
            }
        }
    }
    public setByLanguageId =
    async (
        languageId: string,
        value: valueT,
        scope?: vscode.ConfigurationScope | null,
        configurationTarget?: vscode.ConfigurationTarget
    ) =>
    {
        await vscode.workspace.getConfiguration(`[${languageId}]`, scope).update(this.key, value, configurationTarget);
        const config = vscode.workspace.getConfiguration(`[${languageId}]`, scope);
        if (undefined !== configurationTarget)
        {
            await config.update(this.key, value, configurationTarget);
        }
        else
        {
            const inspectResult = config.inspect(this.key);
            // if (undefined !== inspectResult?.workspaceFolderLanguageValue)
            // {
            //     await config.update(this.key, value, vscode.ConfigurationTarget.WorkspaceFolder, true);
            // }
            // else
            // if (undefined !== inspectResult?.workspaceLanguageValue)
            // {
            //     await config.update(this.key, value, vscode.ConfigurationTarget.Workspace, true);
            // }
            // else
            // if (undefined !== inspectResult?.globalLanguageValue)
            // {
            //     await config.update(this.key, value, vscode.ConfigurationTarget.Global, true);
            // }
            if (undefined !== inspectResult?.workspaceFolderValue)
            {
                await config.update(this.key, value, vscode.ConfigurationTarget.WorkspaceFolder, false);
            }
            else
            if (undefined !== inspectResult?.workspaceValue)
            {
                await config.update(this.key, value, vscode.ConfigurationTarget.Workspace, false);
            }
            else
            //if (undefined !== inspectResult?.globalValue)
            {
                await config.update(this.key, value, vscode.ConfigurationTarget.Global, false);
            }
        }

    }
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
    public getKey = (languageId: string) => this.config.cache.get(languageId);
    public get = (languageId: string) => this.mapObject[this.getKey(languageId)];
    public getCache = (languageId: string) => this.mapObject[this.config.cache.getCache(languageId)];
    public inspect = this.config.inspectCache.get;
    public getInspectCache = this.config.inspectCache.getCache;
    public clear =this.config.clear;
}
export const makeEnumValidator = <ObjectT>(mapObject: ObjectT): (value: keyof ObjectT) => boolean => (value: keyof ObjectT): boolean => 0 <= Object.keys(mapObject).indexOf(value.toString());
export const stringArrayValidator = (value: string[]) => "[object Array]" === Object.prototype.toString.call(value) && value.map(i => "string" === typeof i).reduce((a, b) => a && b, true);
export type IEntry<PropertiesT extends PropertiesBaseType, valueT> = Entry<PropertiesT, valueT> | MapEntry<PropertiesT, valueT>;
export class Root<PropertiesT extends PropertiesBaseType>
{
    constructor(public properties: PropertiesT) { }
    public makeEntry = <valueT>
    (
        key: keyof PropertiesT & string,
        validator?: (value: valueT) => boolean
    ) => this.register(new Entry(this.properties, key, validator))
    public makeMapEntry = <ObjectT>
    (
        key: keyof PropertiesT & string,
        mapObject: ObjectT
    ) => this.register(new MapEntry(this.properties, key, mapObject))
    public entries = <IEntry<PropertiesT, unknown>[]>[];
    private register = <valueT extends IEntry<PropertiesT, any>>(entry: valueT): valueT =>
    {
        this.entries.push(entry);
        return entry;
    }
}
export const makeRoot = <PropertiesT extends PropertiesBaseType>(packageJson: PackageJson<PropertiesT>) =>
    new Root(packageJson.contributes.configuration[0].properties);
