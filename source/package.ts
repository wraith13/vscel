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
export type ViewsWelcomeView = "explorer" | "debug" | "scm";
export interface ViewsWelcome
{
    view: ViewsWelcomeView;
    contents: string;
    when?: string;
}
export interface Keybinding
{
    command: string;
    args: unknown;
    key: string;
    mac?: string;
    linux?: string;
    win?: string;
    when?: string;
}
export interface Language
{
    id: string;
    aliases?: string[];
    extensions?: string[];
    filenames?: string[];
    filenamePatterns?: string[];
    mimetypes?: string[];
    firstLine?: string;
    configuration?: string;
}
export interface CodeActionAction
{
    kind: string;
    title: string;
    description?: string;
}
export interface CodeAction
{
    languages: string[];
    actions: CodeActionAction;
}
export interface DocumentationRefactoring
{
    title: string;
    when: string;
    command: string;
}
export interface Documentation
{
    refactoring: DocumentationRefactoring;
}
export interface CustomEditorSelector
{
    filenamePattern: string;
}
type CustomEditorPriority = "default" | "option";
export interface CustomEditor
{
    viewType: string;
    displayName: string;
    selector: CustomEditorSelector[];
    priority: CustomEditorPriority;
}
export interface Snippet
{
    language?: string;
    path?: string;
}
export interface ResourceLabelFormatterFormatting
{
    label: string;
    separator: string;
    stripPathStartingSeparator: boolean;
    tildify: boolean;
    workspaceSuffix: string;
}
export interface ResourceLabelFormatter
{
    scheme: string;
    authority: string;
    formatting: ResourceLabelFormatterFormatting;

}
export interface Grammars
{
    language?: string;
    scopeName: string;
    path: string;
    embeddedLanguages?: { [key: string]: string };
    tokenTypes?: { [key: string]: string };
    injectTo: string[];
}
type ColorIdentifier =
    "foreground" |
    "errorForeground" |
    "descriptionForeground" |
    "icon.foreground" |
    "focusBorder" |
    "contrastBorder" |
    "contrastActiveBorder" |
    "selection.background" |
    "textSeparator.foreground" |
    "textLink.foreground" |
    "textLink.activeForeground" |
    "textPreformat.foreground" |
    "textBlockQuote.background" |
    "textBlockQuote.border" |
    "textCodeBlock.background" |
    "widget.shadow" |
    "input.background" |
    "input.foreground" |
    "input.border" |
    "inputOption.activeBorder" |
    "inputOption.activeBackground" |
    "inputOption.activeForeground" |
    "input.placeholderForeground" |
    "inputValidation.infoBackground" |
    "inputValidation.infoForeground" |
    "inputValidation.infoBorder" |
    "inputValidation.warningBackground" |
    "inputValidation.warningForeground" |
    "inputValidation.warningBorder" |
    "inputValidation.errorBackground" |
    "inputValidation.errorForeground" |
    "inputValidation.errorBorder" |
    "dropdown.background" |
    "dropdown.listBackground" |
    "dropdown.foreground" |
    "dropdown.border" |
    "checkbox.background" |
    "checkbox.foreground" |
    "checkbox.border" |
    "button.foreground" |
    "button.background" |
    "button.hoverBackground" |
    "button.secondaryForeground" |
    "button.secondaryBackground" |
    "button.secondaryHoverBackground" |
    "badge.background" |
    "badge.foreground" |
    "scrollbar.shadow" |
    "scrollbarSlider.background" |
    "scrollbarSlider.hoverBackground" |
    "scrollbarSlider.activeBackground" |
    "progressBar.background" |
    "editorError.foreground" |
    "editorError.border" |
    "editorWarning.foreground" |
    "editorWarning.border" |
    "editorInfo.foreground" |
    "editorInfo.border" |
    "editorHint.foreground" |
    "editorHint.border" |
    "editor.background" |
    "editor.foreground" |
    "editorWidget.background" |
    "editorWidget.foreground" |
    "editorWidget.border" |
    "editorWidget.resizeBorder" |
    "quickInput.background" |
    "quickInput.foreground" |
    "quickInputTitle.background" |
    "pickerGroup.foreground" |
    "pickerGroup.border" |
    "editor.selectionBackground" |
    "editor.selectionForeground" |
    "editor.inactiveSelectionBackground" |
    "editor.selectionHighlightBackground" |
    "editor.selectionHighlightBorder" |
    "editor.findMatchBackground" |
    "editor.findMatchHighlightBackground" |
    "editor.findRangeHighlightBackground" |
    "editor.findMatchBorder" |
    "editor.findMatchHighlightBorder" |
    "editor.findRangeHighlightBorder" |
    "searchEditor.findMatchBackground" |
    "searchEditor.findMatchBorder" |
    "editor.hoverHighlightBackground" |
    "editorHoverWidget.background" |
    "editorHoverWidget.foreground" |
    "editorHoverWidget.border" |
    "editorHoverWidget.statusBarBackground" |
    "editorLink.activeForeground" |
    "editorLightBulb.foreground" |
    "editorLightBulbAutoFix.foreground" |
    "diffEditor.insertedTextBackground" |
    "diffEditor.removedTextBackground" |
    "diffEditor.insertedTextBorder" |
    "diffEditor.removedTextBorder" |
    "diffEditor.border" |
    "diffEditor.diagonalFill" |
    "list.focusBackground" |
    "list.focusForeground" |
    "list.activeSelectionBackground" |
    "list.activeSelectionForeground" |
    "list.inactiveSelectionBackground" |
    "list.inactiveSelectionForeground" |
    "list.inactiveFocusBackground" |
    "list.hoverBackground" |
    "list.hoverForeground" |
    "list.dropBackground" |
    "list.highlightForeground" |
    "list.invalidItemForeground" |
    "list.errorForeground" |
    "list.warningForeground" |
    "listFilterWidget.background" |
    "listFilterWidget.outline" |
    "listFilterWidget.noMatchesOutline" |
    "list.filterMatchBackground" |
    "list.filterMatchBorder" |
    "tree.indentGuidesStroke" |
    "list.deemphasizedForeground" |
    "menu.border" |
    "menu.foreground" |
    "menu.background" |
    "menu.selectionForeground" |
    "menu.selectionBackground" |
    "menu.selectionBorder" |
    "menu.separatorBackground" |
    "editor.snippetTabstopHighlightBackground" |
    "editor.snippetTabstopHighlightBorder" |
    "editor.snippetFinalTabstopHighlightBackground" |
    "editor.snippetFinalTabstopHighlightBorder" |
    "breadcrumb.foreground" |
    "breadcrumb.background" |
    "breadcrumb.focusForeground" |
    "breadcrumb.activeSelectionForeground" |
    "breadcrumbPicker.background" |
    "merge.currentHeaderBackground" |
    "merge.currentContentBackground" |
    "merge.incomingHeaderBackground" |
    "merge.incomingContentBackground" |
    "merge.commonHeaderBackground" |
    "merge.commonContentBackground" |
    "merge.border" |
    "editorOverviewRuler.currentContentForeground" |
    "editorOverviewRuler.incomingContentForeground" |
    "editorOverviewRuler.commonContentForeground" |
    "editorOverviewRuler.findMatchForeground" |
    "editorOverviewRuler.selectionHighlightForeground" |
    "minimap.findMatchHighlight" |
    "minimap.selectionHighlight" |
    "minimap.errorHighlight" |
    "minimap.warningHighlight" |
    "minimap.background" |
    "minimapSlider.background" |
    "minimapSlider.hoverBackground" |
    "minimapSlider.activeBackground" |
    "problemsErrorIcon.foreground" |
    "problemsWarningIcon.foreground" |
    "problemsInfoIcon.foreground" |
    "editor.lineHighlightBackground" |
    "editor.lineHighlightBorder" |
    "editor.rangeHighlightBackground" |
    "editor.rangeHighlightBorder" |
    "editor.symbolHighlightBackground" |
    "editor.symbolHighlightBorder" |
    "editorCursor.foreground" |
    "editorCursor.background" |
    "editorWhitespace.foreground" |
    "editorIndentGuide.background" |
    "editorIndentGuide.activeBackground" |
    "editorLineNumber.foreground" |
    "editorActiveLineNumber.foreground" |
    "editorLineNumber.activeForeground" |
    "editorRuler.foreground" |
    "editorCodeLens.foreground" |
    "editorBracketMatch.background" |
    "editorBracketMatch.border" |
    "editorOverviewRuler.border" |
    "editorOverviewRuler.background" |
    "editorGutter.background" |
    "editorUnnecessaryCode.border" |
    "editorUnnecessaryCode.opacity" |
    "editorOverviewRuler.rangeHighlightForeground" |
    "editorOverviewRuler.errorForeground" |
    "editorOverviewRuler.warningForeground" |
    "editorOverviewRuler.infoForeground" |
    "editorOverviewRuler.bracketMatchForeground" |
    "symbolIcon.arrayForeground" |
    "symbolIcon.booleanForeground" |
    "symbolIcon.classForeground" |
    "symbolIcon.colorForeground" |
    "symbolIcon.constantForeground" |
    "symbolIcon.constructorForeground" |
    "symbolIcon.enumeratorForeground" |
    "symbolIcon.enumeratorMemberForeground" |
    "symbolIcon.eventForeground" |
    "symbolIcon.fieldForeground" |
    "symbolIcon.fileForeground" |
    "symbolIcon.folderForeground" |
    "symbolIcon.functionForeground" |
    "symbolIcon.interfaceForeground" |
    "symbolIcon.keyForeground" |
    "symbolIcon.keywordForeground" |
    "symbolIcon.methodForeground" |
    "symbolIcon.moduleForeground" |
    "symbolIcon.namespaceForeground" |
    "symbolIcon.nullForeground" |
    "symbolIcon.numberForeground" |
    "symbolIcon.objectForeground" |
    "symbolIcon.operatorForeground" |
    "symbolIcon.packageForeground" |
    "symbolIcon.propertyForeground" |
    "symbolIcon.referenceForeground" |
    "symbolIcon.snippetForeground" |
    "symbolIcon.stringForeground" |
    "symbolIcon.structForeground" |
    "symbolIcon.textForeground" |
    "symbolIcon.typeParameterForeground" |
    "symbolIcon.unitForeground" |
    "symbolIcon.variableForeground" |
    "editor.foldBackground" |
    "editorGutter.foldingControlForeground" |
    "editor.onTypeRenameBackground" |
    "editorSuggestWidget.background" |
    "editorSuggestWidget.border" |
    "editorSuggestWidget.foreground" |
    "editorSuggestWidget.selectedBackground" |
    "editorSuggestWidget.highlightForeground" |
    "editor.wordHighlightBackground" |
    "editor.wordHighlightStrongBackground" |
    "editor.wordHighlightBorder" |
    "editor.wordHighlightStrongBorder" |
    "editorOverviewRuler.wordHighlightForeground" |
    "editorOverviewRuler.wordHighlightStrongForeground" |
    "peekViewTitle.background" |
    "peekViewTitleLabel.foreground" |
    "peekViewTitleDescription.foreground" |
    "peekView.border" |
    "peekViewResult.background" |
    "peekViewResult.lineForeground" |
    "peekViewResult.fileForeground" |
    "peekViewResult.selectionBackground" |
    "peekViewResult.selectionForeground" |
    "peekViewEditor.background" |
    "peekViewEditorGutter.background" |
    "peekViewResult.matchHighlightBackground" |
    "peekViewEditor.matchHighlightBackground" |
    "peekViewEditor.matchHighlightBorder" |
    "editorMarkerNavigationError.background" |
    "editorMarkerNavigationWarning.background" |
    "editorMarkerNavigationInfo.background" |
    "editorMarkerNavigation.background" |
    "tab.activeBackground" |
    "tab.unfocusedActiveBackground" |
    "tab.inactiveBackground" |
    "tab.unfocusedInactiveBackground" |
    "tab.activeForeground" |
    "tab.inactiveForeground" |
    "tab.unfocusedActiveForeground" |
    "tab.unfocusedInactiveForeground" |
    "tab.hoverBackground" |
    "tab.unfocusedHoverBackground" |
    "tab.hoverForeground" |
    "tab.unfocusedHoverForeground" |
    "tab.activeBorder" |
    "tab.unfocusedActiveBorder" |
    "tab.activeBorderTop" |
    "tab.unfocusedActiveBorderTop" |
    "tab.hoverBorder" |
    "tab.unfocusedHoverBorder" |
    "tab.activeModifiedBorder" |
    "tab.inactiveModifiedBorder" |
    "tab.unfocusedActiveModifiedBorder" |
    "tab.unfocusedInactiveModifiedBorder" |
    "tab.border" |
    "editorPane.background" |
    "editorGroup.background" |
    "editorGroup.emptyBackground" |
    "editorGroup.focusedEmptyBorder" |
    "editorGroupHeader.tabsBackground" |
    "editorGroupHeader.tabsBorder" |
    "editorGroupHeader.noTabsBackground" |
    "editorGroupHeader.border" |
    "editorGroup.border" |
    "editorGroup.dropBackground" |
    "imagePreview.border" |
    "panel.background" |
    "panel.border" |
    "panelTitle.activeForeground" |
    "panelTitle.inactiveForeground" |
    "panelTitle.activeBorder" |
    "panelInput.border" |
    "panel.dropBorder" |
    "panelSection.dropBackground" |
    "panelSectionHeader.background" |
    "panelSectionHeader.foreground" |
    "panelSectionHeader.border" |
    "panelSection.border" |
    "statusBar.foreground" |
    "statusBar.noFolderForeground" |
    "statusBar.background" |
    "statusBar.noFolderBackground" |
    "statusBar.border" |
    "statusBar.noFolderBorder" |
    "statusBarItem.activeBackground" |
    "statusBarItem.hoverBackground" |
    "statusBarItem.prominentForeground" |
    "statusBarItem.prominentBackground" |
    "statusBarItem.prominentHoverBackground" |
    "activityBar.background" |
    "activityBar.foreground" |
    "activityBar.inactiveForeground" |
    "activityBar.border" |
    "activityBar.activeBorder" |
    "activityBar.activeFocusBorder" |
    "activityBar.activeBackground" |
    "activityBar.dropBorder" |
    "activityBarBadge.background" |
    "activityBarBadge.foreground" |
    "statusBarItem.remoteBackground" |
    "statusBarItem.remoteForeground" |
    "extensionBadge.remoteBackground" |
    "extensionBadge.remoteForeground" |
    "sideBar.background" |
    "sideBar.foreground" |
    "sideBar.border" |
    "sideBarTitle.foreground" |
    "sideBar.dropBackground" |
    "sideBarSectionHeader.background" |
    "sideBarSectionHeader.foreground" |
    "sideBarSectionHeader.border" |
    "titleBar.activeForeground" |
    "titleBar.inactiveForeground" |
    "titleBar.activeBackground" |
    "titleBar.inactiveBackground" |
    "titleBar.border" |
    "menubar.selectionForeground" |
    "menubar.selectionBackground" |
    "menubar.selectionBorder" |
    "notificationCenter.border" |
    "notificationToast.border" |
    "notifications.foreground" |
    "notifications.background" |
    "notificationLink.foreground" |
    "notificationCenterHeader.foreground" |
    "notificationCenterHeader.background" |
    "notifications.border" |
    "notificationsErrorIcon.foreground" |
    "notificationsWarningIcon.foreground" |
    "notificationsInfoIcon.foreground" |
    "window.activeBorder" |
    "window.inactiveBorder" |
    "editorGutter.commentRangeForeground" |
    "editor.stackFrameHighlightBackground" |
    "editor.focusedStackFrameHighlightBackground" |
    "terminal.background" |
    "terminal.foreground" |
    "terminalCursor.foreground" |
    "terminalCursor.background" |
    "terminal.selectionBackground" |
    "terminal.border" |
    "walkThrough.embeddedEditorBackground" |
    "statusBar.debuggingBackground" |
    "statusBar.debuggingForeground" |
    "statusBar.debuggingBorder" |
    "welcomePage.buttonBackground" |
    "welcomePage.buttonHoverBackground" |
    "welcomePage.background" |
    "settings.headerForeground" |
    "settings.modifiedItemIndicator" |
    "settings.dropdownBackground" |
    "settings.dropdownForeground" |
    "settings.dropdownBorder" |
    "settings.dropdownListBorder" |
    "settings.checkboxBackground" |
    "settings.checkboxForeground" |
    "settings.checkboxBorder" |
    "settings.textInputBackground" |
    "settings.textInputForeground" |
    "settings.textInputBorder" |
    "settings.numberInputBackground" |
    "settings.numberInputForeground" |
    "settings.numberInputBorder" |
    "debugExceptionWidget.border" |
    "debugExceptionWidget.background" |
    "editorGutter.modifiedBackground" |
    "editorGutter.addedBackground" |
    "editorGutter.deletedBackground" |
    "minimapGutter.modifiedBackground" |
    "minimapGutter.addedBackground" |
    "minimapGutter.deletedBackground" |
    "editorOverviewRuler.modifiedForeground" |
    "editorOverviewRuler.addedForeground" |
    "editorOverviewRuler.deletedForeground" |
    "searchEditor.textInputBorder" |
    "debugIcon.breakpointForeground" |
    "debugIcon.breakpointDisabledForeground" |
    "debugIcon.breakpointUnverifiedForeground" |
    "debugIcon.breakpointCurrentStackframeForeground" |
    "debugIcon.breakpointStackframeForeground" |
    "debugToolBar.background" |
    "debugToolBar.border" |
    "debugIcon.startForeground" |
    "debugIcon.pauseForeground" |
    "debugIcon.stopForeground" |
    "debugIcon.disconnectForeground" |
    "debugIcon.restartForeground" |
    "debugIcon.stepOverForeground" |
    "debugIcon.stepIntoForeground" |
    "debugIcon.stepOutForeground" |
    "debugIcon.continueForeground" |
    "debugIcon.stepBackForeground" |
    "debugTokenExpression.name" |
    "debugTokenExpression.value" |
    "debugTokenExpression.string" |
    "debugTokenExpression.boolean" |
    "debugTokenExpression.number" |
    "debugTokenExpression.error" |
    "debugView.exceptionLabelForeground" |
    "debugView.exceptionLabelBackground" |
    "debugView.stateLabelForeground" |
    "debugView.stateLabelBackground" |
    "debugView.valueChangedHighlight" |
    "debugConsole.infoForeground" |
    "debugConsole.warningForeground" |
    "debugConsole.errorForeground" |
    "debugConsole.sourceForeground" |
    "debugConsoleInputIcon.foreground" |
    "extensionButton.prominentBackground" |
    "extensionButton.prominentForeground" |
    "extensionButton.prominentHoverBackground" |
    "notebook.cellBorderColor" |
    "notebook.focusedEditorBorder" |
    "notebookStatusSuccessIcon.foreground" |
    "notebookStatusErrorIcon.foreground" |
    "notebookStatusRunningIcon.foreground" |
    "notebook.outputContainerBackgroundColor" |
    "notebook.cellToolbarSeparator" |
    "notebook.focusedCellBackground" |
    "notebook.cellHoverBackground" |
    "notebook.focusedCellBorder" |
    "notebook.cellStatusBarItemHoverBackground" |
    "notebook.cellInsertionIndicator" |
    "notebookScrollbarSlider.background" |
    "notebookScrollbarSlider.hoverBackground" |
    "notebookScrollbarSlider.activeBackground" |
    "notebook.symbolHighlightBackground" |
    "scm.providerBorder" |
    "terminal.ansiBlack" |
    "terminal.ansiRed" |
    "terminal.ansiGreen" |
    "terminal.ansiYellow" |
    "terminal.ansiBlue" |
    "terminal.ansiMagenta" |
    "terminal.ansiCyan" |
    "terminal.ansiWhite" |
    "terminal.ansiBrightBlack" |
    "terminal.ansiBrightRed" |
    "terminal.ansiBrightGreen" |
    "terminal.ansiBrightYellow" |
    "terminal.ansiBrightBlue" |
    "terminal.ansiBrightMagenta" |
    "terminal.ansiBrightCyan" |
    "terminal.ansiBrightWhite" |
    "gitDecoration.addedResourceForeground" |
    "gitDecoration.modifiedResourceForeground" |
    "gitDecoration.deletedResourceForeground" |
    "gitDecoration.untrackedResourceForeground" |
    "gitDecoration.ignoredResourceForeground" |
    "gitDecoration.conflictingResourceForeground" |
    "gitDecoration.submoduleResourceForeground";
type ColorValue = string; // "format": "color-hex"
export interface Color
{
    id: string;
    description: string;
    defaults:
    {
        dark?: ColorIdentifier | ColorValue;
        light?: ColorIdentifier | ColorValue;
        highContrast?: ColorIdentifier | ColorValue;
    };
}
export interface SemanticTokenType
{
    id: string;
    superType: string;
    description: string;
}
export interface SemanticTokenModifier
{
    id: string;
    description: string;
}
export interface SemanticTokenScope
{
    language: string;
    scopes: { [key: string]: string[] };
}
export type UiTheme = "vs" | "vs-dark" | "hc-black";
export interface Theme
{
    id?: string;
    label?: string;
    uiTheme: UiTheme;
    path: string;
}
export interface IconTheme
{
    id: string;
    label?: string;
    path: string;
}
export interface ProductIconTheme
{
    id: string;
    label?: string;
    path: string;
}
export interface LocalizationTranslation
{
    id: string;
    path: string;
}
export interface Localization
{
    languageId: string;
    languageName: string;
    localizedLanguageName: string;
    translations: LocalizationTranslation[];
}
export interface ViewsContainerActivitybar
{
    id: string;
    title: string;
    icon: string;
}
export interface ViewsContainerPanel
{
    id: string;
    title: string;
    icon: string;
}
export interface ViewsContainer
{
    activitybar: ViewsContainerActivitybar[];
    panel: ViewsContainerPanel[];
}
export type ViewVisibility = "visible" | "hidden" | "collapsed";
export interface ViewExplorer
{
    id: string;
    name: string;
    when: string;
    icon: string;
    contextualTitle: string;
    visibility: ViewVisibility;
}
export interface ViewDebug
{
    id: string;
    name: string;
    when: string;
    icon: string;
    contextualTitle: string;
    visibility: ViewVisibility;
}
export interface ViewScm
{
    id: string;
    name: string;
    when: string;
    icon: string;
    contextualTitle: string;
    visibility: ViewVisibility;
}
export interface ViewTest
{
    id: string;
    name: string;
    when: string;
    icon: string;
    contextualTitle: string;
    visibility: ViewVisibility;
}
export interface ViewRemote
{
    id: string;
    name: string;
    when: string;
    group: string;
    remoteName: string | string[];
}
export interface View
{
    explorer: ViewExplorer[];
    debug: ViewDebug[];
    scm: ViewScm[];
    test: ViewTest[];
    remote: ViewRemote[];
}
export interface RemoteHelp
{
    getStarted: string;
    documentation: string;
    feedback: string;
    issues: string;
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
    viewsWelcome?: ViewsWelcome[];
    keybindings?: Keybinding | Keybinding[];
    languages?: Language[];
    codeActions?: CodeAction[];
    documentation?: Documentation;
    customEditors?: CustomEditor[];
    snippets?: Snippet[];
    resourceLabelFormatters?: ResourceLabelFormatter[];
    grammars?: Grammars[];
    colors?: Color[];
    semanticTokenTypes?: SemanticTokenType[];
    semanticTokenModifiers?: SemanticTokenModifier[];
    semanticTokenScopes?: SemanticTokenScope[];
    themes?: Theme[];
    iconThemes?: IconTheme[];
    productIconThemes?: ProductIconTheme[];
    localizations?: Localization[];
    viewsContainers?: ViewsContainer[];
    views?: View;
    remoteHelp?: RemoteHelp;
}
export enum ThemeEnum
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
export interface Badge
{
    url: string;
    href: string;
    description: string;
}
export type MarkdownEnum = "github" | "standard";
export type ExtensionKindEnum = "ui" | "workspace" | "web";
export interface Root
{
    engines:
    {
        vscode: string;
    };
    publisher?: string;
    displayName?: string;
    categories?: Category[];
    galleryBanner?:
    {
        color?: string;
        theme?: ThemeEnum;
    };
    contributes: Contributes;
    preview: boolean;
    activationEvents: string[];
    badges: Badge[];
    markdown: MarkdownEnum;
    qna: string | false;
    extensionDependencies: string[];
    extensionPack: string[];
    extensionKind: ExtensionKindEnum[];
    name: string;
    description: string;
    version: string;
    icon?: string;
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
    keywords?: string[];
    main?: string;
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
