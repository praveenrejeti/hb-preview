import 
   * 
 as vscode from "vscode";

import HtmlDocumentContentProvider from "./PreviewContentProvider";

export default () => {
    let PREVIEW_URI:undefined;
    //return commands.executeCommand("vscode.previewHtml", PREVIEW_URI, ViewColumn.Two, "Handlebars HTML Preview");
    let contentProvider = new HtmlDocumentContentProvider();
    let panel = vscode.window.createWebviewPanel("handleCoding","HB Editor Preview", vscode.ViewColumn.Two,{
        enableScripts:true
    });
    panel.webview.html = contentProvider.provideTextDocumentContent(PREVIEW_URI);

    let updateView = () =>{
        panel.webview.html = contentProvider.provideTextDocumentContent(PREVIEW_URI);
    }
    let hbVInterval = setInterval(updateView,1000);

    panel.onDidDispose(
        ()=>{
            clearInterval(hbVInterval);
        }
    )
}