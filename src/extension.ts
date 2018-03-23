'use strict';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import {EOL} from 'os';

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.openScratchpadMd', () => {
        const config = vscode.workspace.getConfiguration('scratchpadmd')
        const fullPath = config.get('path') as string;

        if (!fs.existsSync(fullPath)) {
            fs.writeFileSync(fullPath, '');
        }

        vscode.workspace.openTextDocument(fullPath).then((doc) => {
            vscode.window.showTextDocument(doc).then(editor => {
                const length = doc.getText().length;
                const pos = editor.document.positionAt(length);
                editor.selection = new vscode.Selection(pos, pos);
                editor.edit(e => {
                    e.insert(pos, newLine(length === 0));
                });
            });
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}

function newLine(firstLine = false) {
    const now = new Date();
    return (firstLine ? '' : EOL)
        + '### '
        + now.toJSON().slice(0, 10) + ' '
        + now.toLocaleTimeString('fullwise', {hour12: false})
        + ' ###' + EOL;
}