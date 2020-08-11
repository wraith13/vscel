//  ここの型情報は vscode.extensions.all.map(i => i.packageJSON) の為のモノで、これはオリジナルの package.json と微妙に異なっており
//  実際のデータと `https://json.schemastore.org/package` と `vscode://schemas/vscode-extensions` を付き合わせたモノです。

export type PrimaryConfigurationType = "null" | "boolean" | "string" | "integer" | "number" | "array" | "object";
export type ConfigurationType = PrimaryConfigurationType | PrimaryConfigurationType[];
export type ConfigurationScope = "application" | "machine" | "window" | "resource" | "language-overridable" | "machine-overridable";
export type LocalizableString = string | { value: string; original: string };
export interface ConfigurationBase
{
    properties: { [key: string]: ConfigurationProperty };
}
export interface ConfigurationProperty extends ConfigurationBase
{
    type: ConfigurationType;
    scope?: ConfigurationScope;
    default?: any;
    items?: ConfigurationProperty;
    enum?: string[];
    pattern?: string;
    errorMessage?: string;
    minimum?: number;
    maximum?: number;
    overridable?: boolean;
    description?: string;
    enumDescriptions?: string[];
    markdownDescription?: string;
    markdownEnumDescriptions?: string[];
    tags?: string[];
}
export interface Configuration extends ConfigurationBase
{
    id?: string;
    order?: number;
    type?: ConfigurationType;
    title: string;
}
export interface Command
{
    command: string;
    title: LocalizableString;
    description?: string;
    category?: LocalizableString;
    icon?: string |
    {
        dark: string;
        light: string;
    };
}
export interface Keybinding
{
    key: string;
    mac?: string;
    command: string;
    when?: string;
}
export interface MenuItem
{
    command: string;
    when: string;
    alt: string;
    group: string;
}
export interface Menus
{
    "commandPalette"?: MenuItem[];
    "touchBar"?: MenuItem[];
    "editor/title"?: MenuItem[];
    "editor/context"?: MenuItem[];
    "explorer/context"?: MenuItem[];
    "editor/title/context"?: MenuItem[];
    "debug/callstack/context"?: MenuItem[];
    "debug/toolBar"?: MenuItem[];
    "menuBar/webNavigation"?: MenuItem[];
    "scm/title"?: MenuItem[];
    "scm/sourceControl"?: MenuItem[];
    "scm/resourceGroup/context"?: MenuItem[];
    "scm/resourceState/context"?: MenuItem[];
    "scm/resourceFolder/context"?: MenuItem[];
    "scm/change/title"?: MenuItem[];
    "view/title"?: MenuItem[];
    "view/item/context"?: MenuItem[];
    "comments/commentThread/title"?: MenuItem[];
    "comments/commentThread/context"?: MenuItem[];
    "comments/comment/title"?: MenuItem[];
    "comments/comment/context"?: MenuItem[];
    "notebook/cell/title"?: MenuItem[];
    "extension/context"?: MenuItem[];
    "timeline/title"?: MenuItem[];
    "timeline/item/context"?: MenuItem[];
}
export interface Language
{
    id: string;
    extensions?: string[];
    aliases?: string[];
    firstLine?: string;
    mimetypes?: string[];
    configuration?: string;
}
export interface JsonValidation
{
    fileMatch: string;
    url: string;
}
export interface Grammars
{
    language?: string;
    scopeName: string;
    path: string;
    embeddedLanguages?: { [key: string]: string };
    tokenTypes?: { [key: string]: string };
}
export interface SemanticTokenScope
{
    language?: string;
    scopes?: { [key: string]: string[] };
}
export interface Breakpoint
{
    language?: string;
}
export interface Snippet
{
    language?: string;
    path?: string;
}
export interface Color
{
    id: string;
    description?: string;
    defaults?:
    {
        dark?: string;
        light?: string;
        highContrast?: string;
    };
};
export interface Contributes
{
    configuration?: Configuration;
    configurationDefaults?: object;
    viewsContainers?: unknown;
    views?: unknown;
    customEditors?: unknown[];
    commands?: Command[];
    keybindings?: Keybinding[];
    menus?: Menus;
    languages?: Language[];
    jsonValidation?: JsonValidation;
    taskDefinitions?: unknown[];
    grammars?: Grammars[];
    semanticTokenScopes?: SemanticTokenScope[];
    breakpoints?: Breakpoint[];
    debuggers?: unknown[];
    snippets?: Snippet[];
    colors?: Color[];
}
// エンジンの互換性。
export interface Engines {
    // VS Code 拡張機能の場合、拡張機能と互換性のある VS Code バージョンを指定します。* を指定することはできません。たとえば、^0.10.5 は最小の VS Code バージョン 0.10.5 との互換性を示します。
    vscode?: string;
}
// VS Code マーケットプレースで使用されるバナー。
export interface GalleryBanner {
    // VS Code マーケットプレース ページ ヘッダー上のバナーの色。
    color?: string;
    // バナーで使用されるフォントの配色テーマ。
    theme?: Theme;
}
// バナーで使用されるフォントの配色テーマ。
export enum Theme {
    Dark = "dark",
    Light = "light",
}
export interface Scripts {
    /**
     * パッケージが VS Code 拡張機能として公開される前に実行されるスクリプト。
     */
    "vscode:prepublish"?: string;
    /**
     * VS コード拡張機能のフックをアンインストールします。 VS
     * コードから拡張機能を完全にアンインストールした時に実行されるスクリプトです。スクリプトは、拡張機能をアンインストールした後に VS コードを再起動 (シャット
     * ダウンしてから起動) したときに実行されます。Node スクリプトのみがサポートされます。
     */
    "vscode:uninstall"?: string;
}
export interface Root
{
    name: string;
    description: string;
    version: string;
    /**
     * VS Code ギャラリーで拡張機能の分類に使用されるカテゴリ。
     */
    categories?: string[];
    /**
     * VS Code ギャラリーで使用される拡張機能の表示名。
     */
    displayName?: string;
    /**
     * エンジンの互換性。
     */
    engines?: Engines;
    /**
     * VS Code マーケットプレースで使用されるバナー。
     */
    galleryBanner?: GalleryBanner;
    /**
     * 128x128 ピクセルのアイコンへのパス。
     */
    icon?: string;
    /**
     * VS Code 拡張機能の公開元。
     */
    publisher?: string;
    contributes: Contributes;
    scripts?:   Scripts;

};
