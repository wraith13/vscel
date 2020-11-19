import * as vscode from 'vscode';
import * as base from './base';
import * as locale from './locale';
export interface CommandMenuItem extends vscode.QuickPickItem
{
    when?: (menus: CommandMenuItem[]) => boolean;
    preview?: () => Promise<unknown>;
    command?: () => Promise<unknown>;
    tags?: string[];
}
export interface QuickPickOptions<CommandMenuItemEx extends CommandMenuItem> extends vscode.QuickPickOptions
{
    rollback?: () => Promise<unknown>;
    strictRollback?: () => Promise<unknown>;
    debug?: boolean;
    preview?: boolean; // default: true
    command?: (selected: CommandMenuItemEx) => Promise<unknown>;
    onCancel?: () => Promise<unknown>
}
export const showQuickPick = async <T extends CommandMenuItem>
(
    items: T[] | Thenable<T[]>,
    options?: QuickPickOptions<T>,
    token?: vscode.CancellationToken
) =>
{
    const vscodeOptions = base.simplyDeepCopy(options ?? <QuickPickOptions<T>>{ });
    vscodeOptions.rollback = undefined;
    vscodeOptions.strictRollback = undefined;
    vscodeOptions.debug = undefined;
    vscodeOptions.preview = undefined;
    vscodeOptions.command = undefined;
    vscodeOptions.onCancel = undefined;
    let lastPreview = options ?.strictRollback ?? options ?.rollback;
    const apply = async (method: (() => Promise<unknown>) | undefined) =>
    {
        if (method && lastPreview !== method)
        {
            lastPreview = method;
            if (options?.debug)
            {
                await method();
            }
            else
            {
                try
                {
                    await method();
                }
                catch
                {
                    //  適用のキャンセルにより、大量の `rejected promise not handled` でログを汚すことになってしまうので握り潰す。
                    //  握り潰す代わりになにかログを吐いてしまうと結局同じ事だし・・・
                    //  尚、ここでエラーになったからと言って、 return false しちゃうのはロジック的にダメ
                }
            }
            return true;
        }
        return false;
    };
    const solidItems = await items;
    const result = await vscode.window.showQuickPick
    (
        solidItems
            .filter(i => undefined === i.when || i.when(solidItems)),
        Object.assign
        (
            {
                onDidSelectItem: async (item: T) =>
                {
                    if (options?.preview ?? true)
                    {
                        await apply(options?.strictRollback);
                        // tslint:disable-next-line: no-unused-expression
                        await apply(item?.preview) || await apply(options?.rollback);
                    }
                    return options?.onDidSelectItem?.(item);
                }
            },
            vscodeOptions,
        ),
        token
    );
    await apply(options?.strictRollback);
    if (result)
    {
        // tslint:disable-next-line: no-unused-expression
        await apply(result.command) || await apply(result.preview);
        if (options?.command)
        {
            await options?.command(result);
        }
    }
    else
    {
        if (options?.preview ?? true)
        {
            await apply(options ?.rollback);
        }
        if (options?.onCancel)
        {
            await options?.onCancel();
        }
    }
    return result;
};
export interface InputBoxOptions extends vscode.InputBoxOptions
{
    preview?: boolean;
    command?: (input: string) => Promise<unknown>;
    rollback?: () => Promise<unknown>;
    onCancel?: () => Promise<unknown>
}
export const showInputBox = async <T extends InputBoxOptions>(options?: T, token?: vscode.CancellationToken) =>
{
    const preview = options?.preview ?? true;
    const command = options?.command;
    const rollback = options?.rollback;
    const onCancel = options?.onCancel;
    const vscodeOptions = base.simplyDeepCopy(options ?? <T>{ });
    vscodeOptions.preview = undefined;
    vscodeOptions.command = undefined;
    vscodeOptions.rollback = undefined;
    vscodeOptions.onCancel = undefined;
    if (preview)
    {
        vscodeOptions.validateInput = async input =>
        {
            const result = options?.validateInput?.(input);
            if (undefined === result || null === result)
            {
                if (preview)
                {
                    await command?.(input);
                }
            }
            else
            {
                await rollback?.();
            }
            return result;
        };
    }
    const result = await vscode.window.showInputBox(vscodeOptions, token);
    if (undefined !== result)
    {
        await command?.(result);
    }
    else
    {
        await rollback?.();
        await onCancel?.();
    }
    return result;
}
export interface ShowMessageOptionsBase<LocaleEntryType extends locale.LocaleEntry>
{
    locale: locale.Locale<LocaleEntryType>;
    modal?: boolean;
}
export interface ShowMessageOptionsRegular<LocaleEntryType extends locale.LocaleEntry> extends ShowMessageOptionsBase<LocaleEntryType>
{
    message: string;
}
export interface ShowMessageOptionsTyped<LocaleEntryType extends locale.LocaleEntry> extends ShowMessageOptionsBase<LocaleEntryType>
{
    typedMessage: keyof LocaleEntryType & string;
}
export type ShowMessageOptions<LocaleEntryType extends locale.LocaleEntry> =
    ShowMessageOptionsRegular<LocaleEntryType> | ShowMessageOptionsTyped<LocaleEntryType>
export const showMessage = <LocaleEntryType extends locale.LocaleEntry>
(
    target:
        typeof vscode.window.showInformationMessage |
        typeof vscode.window.showWarningMessage |
        typeof vscode.window.showErrorMessage,
    options: ShowMessageOptions<LocaleEntryType>,
    ...items: (keyof LocaleEntryType & string)[]
) => target
(
    (<ShowMessageOptionsRegular<LocaleEntryType>>options).message ?? // 呼び出し側の都合を考えると、通常 message は動的に作られた文字列になるので message の方を優先する。
    (
        undefined !== (<ShowMessageOptionsTyped<LocaleEntryType>>options).typedMessage ?
            options.locale.map((<ShowMessageOptionsTyped<LocaleEntryType>>options).typedMessage):
            "no message" // 型を壊されてない限りここに到達することない
    ),
    {
        modal: options.modal
    },
    ...items.map(options.locale.map)
);
export const showInformationMessage = <LocaleEntryType extends locale.LocaleEntry>
(
    options: ShowMessageOptions<LocaleEntryType>,
    ...items: (keyof LocaleEntryType & string)[]
) => showMessage
(
    vscode.window.showInformationMessage,
    options,
    ...items
);
export const showWarningMessage = <LocaleEntryType extends locale.LocaleEntry>
(
    options: ShowMessageOptions<LocaleEntryType>,
    ...items: (keyof LocaleEntryType & string)[]
) => showMessage
(
    vscode.window.showWarningMessage,
    options,
    ...items
);
export const showErrorMessage = <LocaleEntryType extends locale.LocaleEntry>
(
    options: ShowMessageOptions<LocaleEntryType>,
    ...items: (keyof LocaleEntryType & string)[]
) => showMessage
(
    vscode.window.showErrorMessage,
    options,
    ...items
);
