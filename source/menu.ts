import * as vscode from 'vscode';
export interface CommandMenuItem extends vscode.QuickPickItem
{
    when?: (menus: CommandMenuItem[]) => boolean;
    preview?: () => Promise<unknown>;
    command?: () => Promise<unknown>;
    tags?: string[];
}
export interface QuickPickOptions extends vscode.QuickPickOptions
{
    rollback?: () => Promise<unknown>;
    strictRollback?: () => Promise<unknown>;
    debug?: boolean;
    preview?: boolean; // default: true
    command?: <CommandMenuItemEx extends CommandMenuItem>(selected: CommandMenuItemEx) => Promise<unknown>;
}
export const showQuickPick = async <T extends CommandMenuItem>
(
    items: T[] | Thenable<T[]>,
    options?: QuickPickOptions,
    token?: vscode.CancellationToken
) =>
{
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
                }
            },
            options ?? { },
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
            options?.command(result);
        }
    }
    else
    {
        if (options?.preview ?? true)
        {
            await apply(options ?.rollback);
        }
    }
    return result;
};
