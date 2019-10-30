// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ChromaApp, AvailableDevices, AppCategory, ChromaInstance, WaveAnimation, AppInfo, AuthorInfo } from '@pastez/chromajs';
import { VSCAnimationData, VSCAnimDataDebugStatus, VSCAnimation } from './VSCAnimation';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	var chroma: ChromaApp = new ChromaApp(new AppInfo(
		'VSChroma',
		'Visual Studio Code Plugin for Razer Chroma',
		new AuthorInfo("pastezzz@gmai.com", "Tomasz Kwolek"),
		[AvailableDevices.Keyboard],
		AppCategory.Application
	));

	var chromaInstance: ChromaInstance | undefined;
	chroma.Instance(true).then(instance => {
		if(instance) {
			chromaInstance = instance;
		}
		playVSAnim();
	});

	var animData: VSCAnimationData = {
		debugStatus: VSCAnimDataDebugStatus.NONE
	};

	let disposableStart = vscode.commands.registerCommand('extension.startAnimation', () => {
		if (chromaInstance) {
			chromaInstance.playAnimation(new WaveAnimation());
		}
	});

	let disposableStop = vscode.commands.registerCommand('extension.stopAnimation', () => {
		if (chromaInstance) {
			chromaInstance.stopAnimation();
		}
	});

	var playVSAnim = () => {
		if (chromaInstance) {
			chromaInstance.playAnimation(new VSCAnimation(animData));
		}
	};

	var stopVSAnim = () => {
		if (chromaInstance) {
			chromaInstance.playAnimation(new VSCAnimation(animData));
		}
	};

	context.subscriptions.push(vscode.window.onDidChangeWindowState(({focused}) => {
		if (focused) {
			//playVSAnim();
		} else {
			// stopVSAnim();
		}
	}));

	context.subscriptions.push(vscode.debug.onDidStartDebugSession(session => {
		animData.debugStatus = VSCAnimDataDebugStatus.ACTIVE;
		playVSAnim();
	}));
	context.subscriptions.push(vscode.debug.onDidTerminateDebugSession(session => {
		animData.debugStatus = VSCAnimDataDebugStatus.NONE;
		playVSAnim();
	}));

	context.subscriptions.push(disposableStart, disposableStop);
}

// this method is called when your extension is deactivated
export function deactivate() {

}
