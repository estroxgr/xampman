import * as vscode from 'vscode';
import { exec } from 'child_process';

/**
 * Run Command
 * 
 * @param command
 */

function runCommand(command: string): Promise<string> {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(`Error: ${stderr}`);
			} else {
				resolve(stdout);
			}
		});
	});
}

/**
 * Control XAMPP Services
 * @param action 
 * @param service 
 */
async function controlXampp(action: 'start' | 'stop', service: string) {
	try {
		let command = `sudo /opt/lampp/lampp ${action} ${service}`;
		let result = await runCommand(command);
		vscode.window.showInformationMessage(`XAMPP: ${service} ${action}ed`);
	} catch (error) {
		vscode.window.showErrorMessage(`XAMPP Error: ${error}`);
	}
}

/**
 * Activate
 * @param context 
 */
export function activate(context: vscode.ExtensionContext) {
	let startApache = vscode.commands.registerCommand('xampp.startApache', () => {
		controlXampp('start', 'apache');
	});

	let stopApache = vscode.commands.registerCommand('xampp.stopApache', () => {
		controlXampp('stop', 'apache');
	});

	let startMySQL = vscode.commands.registerCommand('xampp.startMySQL', () => {
		controlXampp('start', 'mysql');
	});

	let stopMySQL = vscode.commands.registerCommand('xampp.stopMySQL', () => {
		controlXampp('stop', 'mysql');
	});

	context.subscriptions.push(startApache, stopApache, startMySQL, stopMySQL);
}

export function deactivate() { }
