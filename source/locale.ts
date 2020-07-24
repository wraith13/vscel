export interface LocaleEntry
{
    [key : string] : string;
}
export const make = <LocaleEntryType extends LocaleEntry>(basicLocale: LocaleEntryType, locales: { [language: string]: LocaleEntryType }) =>
    new Locale(basicLocale, locales);
export class Locale<LocaleEntryType extends LocaleEntry>
{
    constructor(private basicLocale: LocaleEntryType, private locales: { [language: string]: LocaleEntryType }) { }
    //type KeyType = keyof typeof localeEn;
    localeTableKey = <string>JSON.parse(<string>process.env.VSCODE_NLS_CONFIG).locale;
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
        this.isTypealbeLocale ? this.string(key): `${this.string(key)} ( ${this.basicLocale[key]} )`;
}
