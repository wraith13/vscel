import * as vscode from 'vscode';
const sectionKeyRegExp = /^(.+)\.([^.]+)$/;
type PropertiesEntry<valueT> =
{
    default?: valueT;
    minimum?: valueT;
    maximum?: valueT;
}
type PropertiesBaseType =
{
    [key: string]: PropertiesEntry<any>;
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
export class Entry<valueT>
{
    public constructor
    (
        public data:
        {
            key: string,
            properties?: PropertiesEntry<valueT>,
            validator?: (value: valueT) => boolean
        }
    )
    { }
    regulate = (rawKey: string, value: valueT | undefined): valueT =>
    {
        if (undefined === value)
        {
            return <valueT>this.data.properties?.default;
        }
        else
        if (this.data.validator && !this.data.validator(value))
        {
            // settings.json をテキストとして直接編集してる時はともかく GUI での編集時に無駄にエラー表示が行われてしまうので、エンドユーザーに対するエラー表示は行わない。
            //vscode.window.showErrorMessage(`${rawKey} setting value is invalid! Please check your settings.`);
            console.error(`"${rawKey}" setting value(${JSON.stringify(value)}) is invalid! Please check your settings.`);
            return <valueT>this.data.properties?.default;
        }
        else
        {
            if (undefined !== this.data.properties?.minimum && value < this.data.properties?.minimum)
            {
                return this.data.properties?.minimum;
            }
            else
            if (undefined !== this.data.properties?.maximum && this.data.properties?.maximum < value)
            {
                return this.data.properties?.maximum;
            }
        }
        return value;
    }
    getBase = (scope?: vscode.ConfigurationScope | null) =>
        vscode.workspace.getConfiguration(this.data.key.replace(sectionKeyRegExp, "$1"), scope);
    getBaseByLanguageId = (languageId: string, scope?: vscode.ConfigurationScope | null) =>
        vscode.workspace.getConfiguration(`[${languageId}]`, scope);
    public get = (scope?: vscode.ConfigurationScope | null) =>
        this.regulate(this.data.key, this.getBase(scope).get(this.data.key.replace(sectionKeyRegExp, "$2")));
    public getByActiveTextEditor = () => this.get(vscode.window.activeTextEditor?.document);
    public getByLanguageId = (languageId: string, scope?: vscode.ConfigurationScope | null) =>
    {
        const languageValue: valueT | undefined = this.getBaseByLanguageId(languageId, scope).get(this.data.key);
        if (undefined !== languageValue)
        {
            return this.regulate(`[${languageId}].${this.data.key}`, languageValue);
        }
        else
        {
            return this.get(scope);
        }
    }
    public inspect = (scope?: vscode.ConfigurationScope | null) =>
        this.getBase(scope).inspect(this.data.key.replace(sectionKeyRegExp, "$2")) as InspectResultType<valueT>;
    public inspectByActiveTextEditor = () => this.inspect(vscode.window.activeTextEditor?.document) as InspectResultType<valueT>;
    public set =
    async (
        value: valueT | undefined,
        scope?: vscode.ConfigurationScope | null,
        configurationTarget?: vscode.ConfigurationTarget,
        overrideInLanguage?: boolean
    ) =>
    {
        const name = this.data.key.replace(sectionKeyRegExp, "$2");
        const config = this.getBase(scope);
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
    public setByActiveTextEditor =
    async (
        value: valueT | undefined,
        configurationTarget?: vscode.ConfigurationTarget,
        overrideInLanguage?: boolean
    ) =>
        await this.set(value, vscode.window.activeTextEditor?.document, configurationTarget, overrideInLanguage);
    public setByLanguageId =
    async (
        languageId: string,
        value: valueT | undefined,
        scope?: vscode.ConfigurationScope | null,
        configurationTarget?: vscode.ConfigurationTarget
    ) =>
    {
        const config = this.getBaseByLanguageId(languageId, scope);
        if (undefined !== configurationTarget)
        {
            await config.update(this.data.key, value, configurationTarget);
        }
        else
        {
            const inspectResult = config.inspect(this.data.key);
            // if (undefined !== inspectResult?.workspaceFolderLanguageValue)
            // {
            //     await config.update(this.data.key, value, vscode.ConfigurationTarget.WorkspaceFolder, true);
            // }
            // else
            // if (undefined !== inspectResult?.workspaceLanguageValue)
            // {
            //     await config.update(this.data.key, value, vscode.ConfigurationTarget.Workspace, true);
            // }
            // else
            // if (undefined !== inspectResult?.globalLanguageValue)
            // {
            //     await config.update(this.data.key, value, vscode.ConfigurationTarget.Global, true);
            // }
            if (undefined !== inspectResult?.workspaceFolderValue)
            {
                await config.update(this.data.key, value, vscode.ConfigurationTarget.WorkspaceFolder, false);
            }
            else
            if (undefined !== inspectResult?.workspaceValue)
            {
                await config.update(this.data.key, value, vscode.ConfigurationTarget.Workspace, false);
            }
            else
            //if (undefined !== inspectResult?.globalValue)
            {
                await config.update(this.data.key, value, vscode.ConfigurationTarget.Global, false);
            }
        }

    }
}
export class MapEntry<ObjectT>
{
    public constructor
    (
        public data:
        {
            key: string,
            mapObject: ObjectT
            properties?: PropertiesEntry<keyof ObjectT>,
        }
    )
    {
    }
    config = new Entry<keyof ObjectT>
    ({
        key:this.data.key,
        properties: this.data.properties,
        validator: makeEnumValidator(this.data.mapObject)
    });
    public getKey = (scope?: vscode.ConfigurationScope | null) => this.config.get(scope);
    public getKeyByActiveTextEditor = () => this.config.getByActiveTextEditor();
    public getKeyByLanguageId = (languageId: string, scope?: vscode.ConfigurationScope | null) =>
        this.config.getByLanguageId(languageId, scope);
    public get = (scope?: vscode.ConfigurationScope | null) => this.data.mapObject[this.getKey(scope)];
    public getByActiveTextEditor = () => this.data.mapObject[this.getKeyByActiveTextEditor()];
    public getByLanguageId = (languageId: string, scope?: vscode.ConfigurationScope | null) =>
        this.data.mapObject[this.getKeyByLanguageId(languageId, scope)];
    public inspectKey = (scope?: vscode.ConfigurationScope | null) => this.config.inspect(scope);
    public inspectKeyByActiveTextEditor = () => this.config.inspectByActiveTextEditor();
    public setKey =
    async (
        key: keyof ObjectT | undefined,
        scope?: vscode.ConfigurationScope | null,
        configurationTarget?: vscode.ConfigurationTarget,
        overrideInLanguage?: boolean
    ) =>
        await this.config.set(key, scope, configurationTarget, overrideInLanguage);
    public setKeyByActiveTextEditor =
        async (
            key: keyof ObjectT | undefined,
            configurationTarget?: vscode.ConfigurationTarget,
            overrideInLanguage?: boolean
        ) =>
            await this.config.setByActiveTextEditor(key, configurationTarget, overrideInLanguage);
        public setByLanguageId =
    async (
        languageId: string,
        key: keyof ObjectT | undefined,
        scope?: vscode.ConfigurationScope | null,
        configurationTarget?: vscode.ConfigurationTarget
    ) =>
        await this.config.setByLanguageId(languageId, key, scope, configurationTarget);
}
export const makeEnumValidator = <ObjectT>(mapObject: ObjectT):
    (value: keyof ObjectT) => boolean =>
        (value: keyof ObjectT): boolean =>
            0 <= Object.keys(mapObject).indexOf(value.toString());
export const stringArrayValidator = (value: string[]) =>
    "[object Array]" === Object.prototype.toString.call(value) &&
    value.map(i => "string" === typeof i).reduce((a, b) => a && b, true);
export type IEntry<valueT> = Entry<valueT> | MapEntry<valueT>;
export class Root<PropertiesT extends PropertiesBaseType>
{
    constructor(public properties: PropertiesT) { }
    public makeEntry = <valueT>
    (
        key: keyof PropertiesT & string,
        validator?: (value: valueT) => boolean
    ) => this.register(new Entry({key, validator, properties: this.properties[key]}))
    public makeMapEntry = <ObjectT>
    (
        key: keyof PropertiesT & string,
        mapObject: ObjectT
    ) => this.register(new MapEntry({key, mapObject, properties: this.properties[key]}))
    public entries = <IEntry<unknown>[]>[];
    private register = <valueT extends IEntry<any>>(entry: valueT): valueT =>
    {
        this.entries.push(entry);
        return entry;
    }
}
export const makeRoot = <PropertiesT extends PropertiesBaseType>(packageJson: PackageJson<PropertiesT>) =>
    new Root(packageJson.contributes.configuration[0].properties);
