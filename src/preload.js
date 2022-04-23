import { ipcRenderer, contextBridge } from "electron";

console.log();
console.log("preload.js has been called!");
console.log();

contextBridge.exposeInMainWorld("electron", {
    ipcApi: {
        askForFileToBeServed(desiredPath) {
            const theId = ipcRenderer.invoke("serveFile", desiredPath);
            return theId;
        },
    },
});
