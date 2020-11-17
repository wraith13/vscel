import * as vscode from 'vscode';
export const createItem =
(
    properties :
    {
        alignment ? : vscode.StatusBarAlignment,
        priority?: number,
        text ? : string,
        command ? : string,
        tooltip ? : string,
        withShow? : boolean,
    }
)
: vscode.StatusBarItem =>
{
    const result = vscode.window.createStatusBarItem
    (
        properties.alignment,
        properties.priority
    );
    if (undefined !== properties.text)
    {
        result.text = properties.text;
    }
    if (undefined !== properties.command)
    {
        result.command = properties.command;
    }
    if (undefined !== properties.tooltip)
    {
        result.tooltip = properties.tooltip;
    }
    if (properties.withShow)
    {
        result.show();
    }
    return result;
};
