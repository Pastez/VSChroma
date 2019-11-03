import * as vscode from 'vscode';
import { ChromaApp, AvailableDevices, AppCategory, ChromaInstance, WaveAnimation, AppInfo, AuthorInfo } from '@pastez/chromajs';
import { VSCAnimation } from './animations/VSCAnimation';
import { VSCAnimationData, VSCAnimDataDebugStatus } from './animations/VSCAnimationData';

export function activate(context: vscode.ExtensionContext) {

	let chromaInstance: ChromaInstance | undefined;

	const chroma: ChromaApp = new ChromaApp(new AppInfo(
		'VSChroma',
		'Visual Studio Code Plugin for Razer Chroma',
		new AuthorInfo("pastezzz@gmai.com", "Tomasz Kwolek"),
		[AvailableDevices.Keyboard],
		AppCategory.Application
	));

	const connect = () => {
		chroma.Instance(true).then(instance => {
			if (instance) {
				chromaInstance = instance;
			}
			playVSAnim();
		});
	};

	connect();

	const config = () => { return vscode.workspace.getConfiguration('extension.vschroma'); };
	const diagnostics = () => { return vscode.languages.getDiagnostics().map(v => v[1]).flat(); };
	const animData: VSCAnimationData = {
		config: config(),
		debugStatus: VSCAnimDataDebugStatus.NONE,
		diagnostics: diagnostics(),
		openedTerminals: vscode.window.terminals.length
	};

	let disposableStart = vscode.commands.registerCommand('extension.vschroma.startAnimation', () => {
		if (chromaInstance) {
			chromaInstance.playAnimation(new WaveAnimation());
		}
	});

	let disposableStop = vscode.commands.registerCommand('extension.vschroma.stopAnimation', () => {
		if (chromaInstance) {
			playVSAnim();
		}
	});
	context.subscriptions.push(disposableStart, disposableStop);

	const playVSAnim = () => {
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

	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration('extension.vschroma')) {
			animData.config = config();
			playVSAnim();
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

	context.subscriptions.push(vscode.languages.onDidChangeDiagnostics(event => {
		animData.diagnostics = diagnostics();
		playVSAnim();
	}));

	context.subscriptions.push(vscode.window.onDidOpenTerminal(terminal => {
		animData.openedTerminals = vscode.window.terminals.length;
		playVSAnim();
	}));

	context.subscriptions.push(vscode.window.onDidCloseTerminal(terminal => {
		animData.openedTerminals = vscode.window.terminals.length;
		playVSAnim();
	}));
	
}

// this method is called when your extension is deactivated
export function deactivate() {

}
