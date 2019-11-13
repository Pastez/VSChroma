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
	const diagnostics = () => {
		return vscode.languages.getDiagnostics()
			.map(v => v[1])
			.flat();
	};
	const animData: VSCAnimationData = {
		config: config(),
		debugStatus: VSCAnimDataDebugStatus.NONE,
		diagnostics: diagnostics(),
		tasks: vscode.tasks.taskExecutions,
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

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('extension.vschroma')) {
				animData.config = config();
				playVSAnim();
			}
		}),
		vscode.debug.onDidStartDebugSession(session => {
			animData.debugStatus = VSCAnimDataDebugStatus.ACTIVE;
			playVSAnim();
		}),
		vscode.debug.onDidTerminateDebugSession(session => {
			animData.debugStatus = VSCAnimDataDebugStatus.NONE;
			playVSAnim();
		}),
		vscode.languages.onDidChangeDiagnostics(event => {
			animData.diagnostics = diagnostics();
			playVSAnim();
		}),
		vscode.tasks.onDidStartTask(task => {
			animData.tasks = vscode.tasks.taskExecutions;
			playVSAnim();
		}),
		vscode.tasks.onDidEndTask(task => {
			animData.tasks = vscode.tasks.taskExecutions;
			playVSAnim();
		}),
		vscode.window.onDidOpenTerminal(terminal => {
			animData.openedTerminals = vscode.window.terminals.length;
			playVSAnim();
		}),
		vscode.window.onDidCloseTerminal(terminal => {
			animData.openedTerminals = vscode.window.terminals.length;
			playVSAnim();
		})
	);
}

export function deactivate() {
	
}
