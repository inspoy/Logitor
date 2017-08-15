const electron = require('electron');
const {Menu} = electron
const {app} = electron;
const {BrowserWindow} = electron;
let win;
const  createWindow = function() {
    win = new BrowserWindow();
    win.loadURL(`file://${__dirname}/app/index.html`);
    win.on('closed', () => {
        win = null;
    });
    // Menu.setApplicationMenu(null)
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    app.quit();
});
