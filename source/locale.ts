import * as vscode from 'vscode';
export interface LocaleEntry
{
    [key : string] : string;
}
export const make = <LocaleEntryType extends LocaleEntry>(basicLocale: LocaleEntryType, locales: { [language: string]: LocaleEntryType }) =>
    new Locale(basicLocale, locales);
export interface ShowMessageOptionsBase
{
    modal?: boolean;
}
export interface ShowMessageOptionsRegular extends ShowMessageOptionsBase
{
    message: string;
}
export interface ShowMessageOptionsTyped<LocaleEntryType extends LocaleEntry> extends ShowMessageOptionsBase
{
    map: keyof LocaleEntryType & string;
}
export type ShowMessageOptions<LocaleEntryType extends LocaleEntry> =
    ShowMessageOptionsRegular | ShowMessageOptionsTyped<LocaleEntryType>
export class Locale<LocaleEntryType extends LocaleEntry>
{
    constructor(private basicLocale: LocaleEntryType, private locales: { [language: string]: LocaleEntryType }) { }
    //type KeyType = keyof typeof localeEn;
    localeTableKey = vscode.env.language; // <string>JSON.parse(<string>process.env.VSCODE_NLS_CONFIG).locale;
    localeTable = Object.assign(JSON.parse(JSON.stringify(this.basicLocale)), (this.locales[this.localeTableKey] ?? { }));
    public isTypealbeLocale =
    [
        "zh-CN",
        "zh-TW",
        "ja",
        "ko",
    ].indexOf(this.localeTableKey) < 0;
    public string = (key : string) : string => this.localeTable[key] || key;
    public map = (key : keyof LocaleEntryType & string) : string => this.string(key);
    public typeableMap = (key : keyof LocaleEntryType & string) : string =>
        this.isTypealbeLocale ?
            this.string(key):
            `${this.string(key)} ( ${this.basicLocale[key]} )`;
    public key = (text: string | undefined): (keyof LocaleEntryType & string) | undefined =>
        undefined === text ?
            undefined:
            Object.entries(this.localeTable).filter(i => i[1] === text).map(i => i[0])[0];
    public showMessage =
    async (
        target:
            typeof vscode.window.showInformationMessage |
            typeof vscode.window.showWarningMessage |
            typeof vscode.window.showErrorMessage,
        options: ShowMessageOptions<LocaleEntryType>,
        ...items: (keyof LocaleEntryType & string)[]
    ) => this.key
    (
        await target
        (
            (<ShowMessageOptionsRegular>options).message ?? // 呼び出し側の都合を考えると、通常 message は動的に作られた文字列になるので message の方を優先する。
            (
                undefined !== (<ShowMessageOptionsTyped<LocaleEntryType>>options).map ?
                    this.map((<ShowMessageOptionsTyped<LocaleEntryType>>options).map):
                    "no message" // 型を壊されてない限りここに到達することない
            ),
            {
                modal: options.modal
            },
            ...items.map(this.map)
        )
    );
    public showInformationMessage =
    (
        options: ShowMessageOptions<LocaleEntryType>,
        ...items: (keyof LocaleEntryType & string)[]
    ) => this.showMessage
    (
        vscode.window.showInformationMessage,
        options,
        ...items
    );
    public showWarningMessage =
    (
        options: ShowMessageOptions<LocaleEntryType>,
        ...items: (keyof LocaleEntryType & string)[]
    ) => this.showMessage
    (
        vscode.window.showWarningMessage,
        options,
        ...items
    );
    public showErrorMessage =
    (
        options: ShowMessageOptions<LocaleEntryType>,
        ...items: (keyof LocaleEntryType & string)[]
    ) => this.showMessage
    (
        vscode.window.showErrorMessage,
        options,
        ...items
    );
}
