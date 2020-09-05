import {
    workspace, window, commands, 
    TextDocumentContentProvider,
    Event, Uri, EventEmitter, Disposable 
} from "vscode";
import { dirname } from "path";
import { existsSync, readFileSync } from "fs";
import renderContent from "./render";

const resolveFileOrText = (fileName:string) => {
    console.log(fileName, workspace.textDocuments.map(x => x.fileName));
    let document = workspace.textDocuments.find(e => e.fileName === fileName);

    if (document) {
        return document.getText();
    }
    if (dirname(fileName) && existsSync(fileName)) {
        return readFileSync(fileName, "utf8");
    }
}

export default class HtmlDocumentContentProvider implements TextDocumentContentProvider {
    private _onDidChange = new EventEmitter<Uri>();
    private _fileName: string;
    private _dataFileName: string;
    
    constructor() {
        this._fileName ='';
        this._dataFileName= this._fileName;

    }

    public provideTextDocumentContent(uri: Uri|undefined): string {
        let templateSource:string | undefined = '';
        let dataSource;
        
        if (window.activeTextEditor && window.activeTextEditor.document) {
            let currentFileName = window.activeTextEditor.document.fileName;
            let dataFileName;
            let fileName;

           
            if (currentFileName === this._fileName
                 || currentFileName === this._dataFileName) {
                // User swtiched editor to context, just use stored on
                fileName = this._fileName;
                dataFileName = this._dataFileName;
            } else {
                dataFileName = currentFileName + '.json';
                fileName = currentFileName;
            }

            this._fileName = fileName;
            this._dataFileName = dataFileName;
            templateSource = resolveFileOrText(fileName);
            dataSource = resolveFileOrText(dataFileName);
        }
        
        return renderContent(templateSource as string, dataSource);
    }

    get onDidChange(): Event<Uri> {
        return this._onDidChange.event;
    }

    public update(uri: Uri) {
        this._onDidChange.fire(uri);
    }
}
