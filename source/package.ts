// ここの型情報は vscode.extensions.all.map(i => i.packageJSON) の為のモノで、これはオリジナルの package.json と微妙に異なっており
// 実際のデータとオリジナルの package.json のスキーマ情報( `https://json.schemastore.org/package` と `vscode://schemas/vscode-extensions` )
// を参考に書き起こした型情報となります。

export type PrimaryConfigurationType = "null" | "boolean" | "string" | "integer" | "number" | "array" | "object";
export type ConfigurationType = PrimaryConfigurationType | PrimaryConfigurationType[];
export type ConfigurationScope = "application" | "machine" | "window" | "resource" | "language-overridable" | "machine-overridable";
export type LocalizableString = string | { value: string; original: string; };
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
    deprecationMessage?: string;
    markdownDeprecationMessage?: string;
    tags?: string[];
}
export interface Configuration extends ConfigurationBase
{
    id?: string;
    order?: number;
    type?: ConfigurationType;
    title: string;
}
export interface JsonValidation
{
    fileMatch: string | string[];
    url: string;
}
export interface Command
{
    original?: string;
    command: string;
    title: LocalizableString;
    description?: string;
    category?: LocalizableString;
    enablement?: string;
    icon?: string |
    {
        dark: string;
        light: string;
    };
}
export interface SubmenuItem
{
    kd: string;
    label: string;
    icon?: string |
    {
        dark: string;
        light: string;
    };
}
export interface MenuItem
{
    command: string;
    when?: string;
    alt?: string;
    group?: string;
}
export interface MenuItemSub
{
    submenu: string;
    when?: string;
    group?: string;
}
export interface Menus
{
    "commandPalette"?: MenuItem[];
    "touchBar"?: MenuItem[];
    "editor/title"?: (MenuItem | MenuItemSub)[];
    "editor/context"?: (MenuItem | MenuItemSub)[];
    "explorer/context"?: (MenuItem | MenuItemSub)[];
    "editor/title/context"?: (MenuItem | MenuItemSub)[];
    "debug/callstack/context"?: (MenuItem | MenuItemSub)[];
    "debug/toolBar"?: (MenuItem | MenuItemSub)[];
    "menuBar/webNavigation"?: MenuItem[];
    "scm/title"?: (MenuItem | MenuItemSub)[];
    "scm/sourceControl"?: (MenuItem | MenuItemSub)[];
    "scm/resourceState/context"?: (MenuItem | MenuItemSub)[];
    "scm/resourceFolder/context"?: (MenuItem | MenuItemSub)[];
    "scm/resourceGroup/context"?: (MenuItem | MenuItemSub)[];
    "scm/change/title"?: (MenuItem | MenuItemSub)[];
    "view/title"?: (MenuItem | MenuItemSub)[];
    "view/item/context"?: (MenuItem | MenuItemSub)[];
    "comments/commentThread/title"?: (MenuItem | MenuItemSub)[];
    "comments/commentThread/context"?: MenuItem[];
    "comments/comment/title"?: (MenuItem | MenuItemSub)[];
    "comments/comment/context"?: MenuItem[];
    "notebook/cell/title"?: (MenuItem | MenuItemSub)[];
    "extension/context"?: (MenuItem | MenuItemSub)[];
    "timeline/title"?: (MenuItem | MenuItemSub)[];
    "timeline/item/context"?: (MenuItem | MenuItemSub)[];
}
export interface Debugger
{
    type: string;
    label: string;
    program: string;
    args: unknown[];
    runtime: string;
    runtimeArgs: unknown[];
    variables: object;
    initialConfigurations: unknown[] | string;
    languages: unknown[];
    configurationSnippets: unknown[];
    configurationAttributes: object;
    windows:
    {
        runtime: string;
    };
    "osx":
    {
        runtime: string;
    };
    "linux":
    {
        runtime: string;
    };
}
export interface Breakpoint
{
    language?: string;
}
export interface NotebookProvider
{
    viewType: string;
    displayName: string;
    selector:
    {
        filenamePattern: string;
        excludeFileNamePattern: string;
    }[];
    priority?: "default" | "option";
}
export interface NotebookOutputRenderer
{
    viewType: string;
    displayName: string;
    mimeTypes: string[];
}
export interface ProblemPatternCore
{
    regexp: string;
    kind: string;
    file: number;
    location: number;
    line: number;
    column: number;
    endLine: number;
    endColumn: number;
    severity: number;
    code: number;
    message: number;
    loop: boolean;
}
export interface ProblemPatternFlat extends ProblemPatternCore
{
    name: string;
}
export interface ProblemPatternArray
{
    name: string;
    patterns: ProblemPatternCore[];
}
export type ProblemSeverity = "error" | "warning" | "info";
export type ProblemApplyTarget = "allDocuments" | "openDocuments" | "closedDocuments";
export type ProblemFileLocation = "absolute" | "relative" | "autoDetect";
export interface ProblemMatcherPattern
{
    regexp: string;
    file: number;
}
export interface ProblemMatcherBackground
{
    beginsPattern: string | ProblemMatcherPattern;
    endsPattern: string | ProblemMatcherPattern;
}
export interface ProblemMatcherWatching
{
    activeOnStart: boolean;
    beginsPattern: string | ProblemMatcherPattern;
    endsPattern: string | ProblemMatcherPattern;
}
export interface ProblemMatcher
{
    base: string;
    owner: string;
    source: string;
    severity: ProblemSeverity;
    applyTo: ProblemApplyTarget;
    pattern: string | ProblemPatternCore | ProblemPatternCore[];
    fileLocation: ProblemFileLocation | string[];
    background: ProblemMatcherBackground;
    watching: ProblemMatcherWatching;
    name: string;
    label: string;
}
export interface TaskDefinition
{
    type: string;
    required: string[];
    properties: object; // "http://json-schema.org/draft-07/schema#"
    when: string;
}
export interface TerminalType
{
    command: string;
    title: string;
}
export interface Terminal
{
    types: TerminalType[];
}
export interface Keybinding
{
    key: string;
    mac?: string;
    command: string;
    when?: string;
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
}
export interface Contributes
{
    configurationDefaults?: object;
    configuration?: Configuration;
    jsonValidation?: JsonValidation[];
    commands?: Command | Command[];
    submenus?: SubmenuItem[];
    menus?: Menus;
    debuggers?: Debugger[];
    breakpoints?: Breakpoint[];
    notebookProvider?: NotebookProvider[];
    notebookOutputRenderer?: NotebookOutputRenderer[];
    problemPatterns?: (ProblemPatternFlat | ProblemPatternArray)[];
    problemMatchers?: ProblemMatcher[];
    taskDefinitions?: TaskDefinition[];
    terminal?: Terminal;
    viewsWelcome?: unknown[];
    keybindings?: Keybinding[];
    languages?: Language[];
    codeActions?: unknown[];
    documentation?: unknown;
    customEditors?: unknown[];
    snippets?: Snippet[];
    resourceLabelFormatters?: unknown[];
    grammars?: Grammars[];
    colors?: Color[];
    semanticTokenTypes?: unknown[];
    semanticTokenModifiers?: unknown[];
    semanticTokenScopes?: SemanticTokenScope[];
    themes?: unknown[];
    iconThemes?: unknown[];
    productIconThemes?: unknown[];
    localizations?: unknown[];
    viewsContainers?: unknown[];
    views?: unknown[];
    remoteHelp?: unknown;
}
export enum Theme
{
    "dark",
    "light",
}
export enum Category
{
    "Azure",
    "Data Science",
    "Debuggers",
    "Extension Packs",
    "Formatters",
    "Keymaps",
    "Language Packs",
    "Linters",
    "Machine Learning",
    "Notebooks",
    "Programming Languages",
    "SCM Providers",
    "Snippets",
    "Themes",
    "Testing",
    "Visualization",
    "Other"
}
export interface Scripts
{
    install?: string;
    postinstall?: string;
    postpack?: string;
    postpublish?: string;
    postrestart?: string;
    poststart?: string;
    poststop?: string;
    posttest?: string;
    postuninstall?: string;
    postversion?: string;
    preinstall?: string;
    prepack?: string;
    prepare?: string;
    prepublish?: string;
    prepublishOnly?: string;
    prerestart?: string;
    prestart?: string;
    prestop?: string;
    pretest?: string;
    preuninstall?: string;
    preversion?: string;
    publish?: string;
    restart?: string;
    start?: string;
    stop?: string;
    test?: string;
    uninstall?: string;
    version?: string;
    "vscode:prepublish"?: string;
    "vscode:uninstall"?: string;
}
export interface Root
{
    name: string;
    displayName?: string;
    description: string;
    version: string;
    publisher?: string;
    icon?: string;
    galleryBanner?:
    {
        color?: string;
        theme?: Theme;
    };
    homepage: string;
    author?: string |
    {
        email?: string;
        name: string;
        url?: string;
    };
    bugs?: string |
    {
        email?: string;
        url?: string;
    };
    repository?: string |
    {
        directory?: string;
        type?: string;
        url?: string;
    };
    engines?:
    {
        vscode?: string;
    };
    categories?: Category[];
    keywords?: string[];
    activationEvents: string[];
    main?: string;
    contributes: Contributes;
    scripts?: Scripts;
    devDependencies?: { [key: string]: string };
    dependencies?: { [key: string]: string };
    uuid: string;
    isBuiltin: boolean;
    isUnderDevelopment: boolean;
    id: string;
    identifier:
    {
        value: string;
        _lower: string;
    };
    extensionLocation:
    {
        $mid: number;
        fsPath: string;
        path: string;
        scheme: string;
    };
}
