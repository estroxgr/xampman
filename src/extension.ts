import * as vscode from "vscode";
import { exec } from "child_process";

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
async function controlXampp(action: "start" | "stop", service: string) {
  try {
    let command = `sudo /opt/lampp/lampp ${action} ${service}`;
    let result = await runCommand(command);
    vscode.window.showInformationMessage(`XAMPP: ${service} ${action}ed`);
  } catch (error) {
    vscode.window.showErrorMessage(`XAMPP Error: ${error}`);
  }
}

/** This function will check if the service is running or not
 *
 * @param service
 * @returns
 */
async function checkXamppStatus(service: "apache" | "mysql"): Promise<boolean> {
  try {
    const result = await runCommand(
      `ps aux | grep '${service}' | grep -v grep`
    );
    return result.length > 0;
  } catch {
    return false;
  }
}

/**
 * 
 * @param apacheStatusBar 
 * @param mysqlStatusBar 
 */
async function updateStatusBar(
  apacheStatusBar: vscode.StatusBarItem,
  mysqlStatusBar: vscode.StatusBarItem
) {
  const apacheRunning = await checkXamppStatus("apache");
  const mysqlRunning = await checkXamppStatus("mysql");

  apacheStatusBar.text = `$(server) Apache: ${
    apacheRunning ? "Running 🟢" : "Stopped 🔴"
  }`;
  mysqlStatusBar.text = `$(database) MySQL: ${
    mysqlRunning ? "Running 🟢" : "Stopped 🔴"
  }`;

  apacheStatusBar.tooltip = apacheRunning
    ? "Click to Stop Apache"
    : "Click to Start Apache";
  mysqlStatusBar.tooltip = mysqlRunning
    ? "Click to Stop MySQL"
    : "Click to Start MySQL";

  apacheStatusBar.command = apacheRunning
    ? "xampp.stopApache"
    : "xampp.startApache";
  mysqlStatusBar.command = mysqlRunning
    ? "xampp.stopMySQL"
    : "xampp.startMySQL";

  apacheStatusBar.show();
  mysqlStatusBar.show();
}



/**
 * Activate
 * @param context
 */
export function activate(context: vscode.ExtensionContext) {
  let startApache = vscode.commands.registerCommand("xampp.startApache", () => {
    controlXampp("start", "apache");
  });

  let stopApache = vscode.commands.registerCommand("xampp.stopApache", () => {
    controlXampp("stop", "apache");
  });

  let startMySQL = vscode.commands.registerCommand("xampp.startMySQL", () => {
    controlXampp("start", "mysql");
  });

  let stopMySQL = vscode.commands.registerCommand("xampp.stopMySQL", () => {
    controlXampp("stop", "mysql");
  });

  context.subscriptions.push(startApache, stopApache, startMySQL, stopMySQL);
}

export function deactivate() {}
