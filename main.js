const { app, BrowserWindow, shell, session } = require("electron");
const { registerMenuHandling } = require("./menuBarHandling");

const createWindow = () => {
  const win = new BrowserWindow({
    autoHideMenuBar: true,
    icon: __dirname + "/build/icons/icon.png",
    webPreferences: {
      spellcheck: false,
    },
  });

  win.maximize();
  session.defaultSession.setUserAgent("Chrome");
  win.loadURL("https://notion.so", { userAgent: "Chrome" });

  registerMenuHandling(win);

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith("https://www.notion.so")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });
};

app.on("ready", () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders["User-Agent"] = "Chrome";
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  createWindow();
});
