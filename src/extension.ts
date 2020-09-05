// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { window, workspace, commands, ExtensionContext, TextEditorSelectionChangeEvent, TextDocumentChangeEvent, Uri } from 'vscode';
import PreviewContentProvider from './lib/PreviewContentProvider';
import preview from './lib/preview';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	let provider = new PreviewContentProvider();

	let PREVIEW_URL: Uri;
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hb-preview" is now active!');

	context.subscriptions.push(
		workspace.registerTextDocumentContentProvider("hb-preview.preview", provider),

		// Global handlers
		window.onDidChangeTextEditorSelection((e: TextEditorSelectionChangeEvent) => {
			if (e.textEditor === window.activeTextEditor) {
				provider.update(PREVIEW_URL);
			}
		}),
		workspace.onDidChangeTextDocument((e: TextDocumentChangeEvent) => {
			if (window.activeTextEditor !== undefined && e.document === window.activeTextEditor.document) {
				provider.update(PREVIEW_URL);
			}
		}),

		// Commands
		commands.registerCommand('hbeditor.preview', preview)
	)

}

// this method is called when your extension is deactivated
export function deactivate() { }
