const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const path = require('path');
const fs = require('fs')
const os = require('os')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,

    webPreferences: {
      webviewTag: true,
      worldSafeExecuteJavaScript: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },

  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Print after 10 seconds.
  // setTimeout(printPlease, 10 * 1000);

  function printPlease() {
    console.log("About to print!");
    mainWindow.webContents.print();

    // On run, crashes with the following output in the system terminal:

    // About to print!
    // Gtk-Message: 05:19:06.120: GtkDialog mapped without a transient parent. This is discouraged.
    // Crashing due to FD ownership violation:
    // #0 0x55fe024c8483 <unknown>
    // #1 0x55fe025744bc <unknown>
    // #2 0x55fe02574481 <unknown>
    // #3 0x7f7efacf1a0b <unknown>
  }

  function generatePDFPlease() {
    console.log("About to print!");;
    const pdfPath = path.join(os.homedir(), 'Desktop', 'temp.pdf')
    mainWindow.webContents.printToPDF({}).then(data => {
      fs.writeFile(pdfPath, data, (error) => {
        if (error) throw error
        console.log(`Wrote PDF successfully to ${pdfPath}`)
      })
    }).catch(error => {
      console.log(`Failed to write PDF to ${pdfPath}: `, error)
    })

    // On run, generates "About to print!" message but then does nothing until the application is quit, at which point it outputs the following:

    // [5211:0423/051336.937002:ERROR:print_preview_message_handler.cc(141)] Compositing pdf failed with error kCompositingFailure
    // [5211:0423/051336.937063:ERROR:print_preview_message_handler.cc(159)] Compositing pdf failed on page: 0 with error: kCompositingFailure
    // Failed to write PDF to /home/georgehill/Desktop/temp.pdf:  [Error: Failed to generate PDF]
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

app.on('ready', () => {
  const { session } = require('electron')

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['default-src \'unsafe-eval\' \'unsafe-inline\' ws: http: https: protocolname: file:']
      }
    })
  })
});

const files = {};

app.whenReady().then(() => {
  const protocolName = "protocolname";
  protocol.registerFileProtocol(
    protocolName,
    (request, callback) => {
      console.log(`request: ${"v".repeat(60)}`);
      console.log(request);
      console.log(`request: ${"^".repeat(60)}`);
      const theUrl = request.url;
      const theUrlParts = theUrl.split("/");
      const fileIdString = theUrlParts[theUrlParts.length - 1];
      const fileId = parseInt(fileIdString, 10);
      console.log("fileId:", fileId);
      if (files[fileId]) {
        const resolvedPath = files[fileId];
        // console.log(`\n\nServing:\n\n` + resolvedPath);
        callback(resolvedPath);
      } else {
        callback(404);
      }
    });
});

ipcMain.handle(
  "serveFile",
  (event, filePath) => {
    console.log(event, filePath);
    const id = Math.floor(Math.random() * 1000 * 1000 * 1000);
    console.log(`\n\nSetting id ${id} --> ${filePath}\n\n`);
    files[id] = filePath;
    return id;
  }
);
