/**
 * Created by inspoy on 2017/3/3.
 */
'use strict';

const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let win = null;

const createWindow = function () {
    win = new BrowserWindow({
        width: 1600,
        height: 900,
        resizable: false
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'app/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.on('closed', function () {
        win = null;
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    app.quit();
});
