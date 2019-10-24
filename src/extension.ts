// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { PSChroma, PSChromaEffect } from './ps.chroma';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vschroma" is now active!');

	var chroma: PSChroma | undefined;
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		if (!chroma) {
			chroma = new PSChroma();
		}
		chroma.init((chroma, uri) => {
			vscode.window.showInformationMessage(`Chroma connected ${uri}`);
			// chroma.clearAll();
			chroma.createKeyboardEffect(PSChromaEffect.CHROMA_CUSTOM_KEY, {
				color: [
					[255, 255, 255, 255, 255, 65280, 65280, 65280, 65280, 65280, 16711680, 16711680, 16711680, 16711680, 16711680, 16776960, 16776960, 16776960, 65535, 65535, 65535, 65535, 65535, 65535],
					[255, 255, 255, 255, 255, 65280, 65280, 65280, 65280, 65280, 16711680, 16711680, 16711680, 16711680, 16711680, 16776960, 16776960, 16776960, 65535, 65535, 65535, 65535, 65535, 65535],
					[255, 255, 255, 255, 255, 65280, 65280, 65280, 65280, 65280, 16711680, 16711680, 16711680, 16711680, 16711680, 16776960, 16776960, 16776960, 65535, 65535, 65535, 65535, 65535, 65535],
					[255, 255, 255, 255, 255, 65280, 65280, 65280, 65280, 65280, 16711680, 16711680, 16711680, 16711680, 16711680, 16776960, 16776960, 16776960, 65535, 65535, 65535, 65535, 65535, 65535],
					[255, 255, 255, 255, 255, 65280, 65280, 65280, 65280, 65280, 16711680, 16711680, 16711680, 16711680, 16711680, 16776960, 16776960, 16776960, 65535, 65535, 65535, 65535, 65535, 65535],
					[255, 255, 255, 255, 255, 65280, 65280, 65280, 65280, 65280, 16711680, 16711680, 16711680, 16711680, 16711680, 16776960, 16776960, 16776960, 65535, 65535, 65535, 65535, 65535, 65535]
				],
				key: [
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, (16777216 | ~255), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, (16777216 | ~255), (16777216 | ~255), (16777216 | ~255), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, (16777216 | ~16776960), 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, (16777216 | ~16776960), (16777216 | ~16776960), (16777216 | ~16776960), 0, 0, 0, 0]
				]
			}, (res, id) => {
				chroma.showEffect(id);
			});
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log('VSChroma deactivate');
}
