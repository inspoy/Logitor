let newFileFlag = false;
let warningCount = 0;
let errorCount = 0;

const refreshHeight = function() {
    // 适应页面高度
    const mainHeight = window.innerHeight - 80; // container的高度，80是其margin和padding
    const upperHeight = $('#upper').height() + 20; // 20是h1的margin
    $('.doc-table').height(mainHeight - upperHeight);
}

const refreshErrorCount = function() {
    $('#warning_count').css("color","#000");
    $('#warning_count').css("font-weight", "normal");
    $('#error_count').css("color","#000");
    $('#error_count').css("font-weight", "normal");
    if (warningCount > 0) {
        $('#warning_count').css("color","#f70");
        $('#warning_count').css("font-weight", "bold");
    }
    if (errorCount > 0) {
        $('#error_count').css("color","#f00");
        $('#error_count').css("font-weight", "bold");
    }
    $('#warning_count').text(warningCount);
    $('#error_count').text(errorCount);
}

const onGetOutput = function(msg) {
    msg = msg.substring(2,msg.length-1);
    msg = unescape(msg.replace(/\\\\u/g, '%u'));
    console.log(msg);
    if (msg.startsWith("$NEW_FILE$")) {
        $('#log_table tr:not(:first)').remove();
        warningCount = 0;
        errorCount = 0;
        newFileFlag = true;
        refreshErrorCount();
        $('#log_count').text(msg.substring(msg.indexOf('@') + 1));
        $('#filename').text(msg.substring(10, msg.indexOf('@')));
    }
    else {
        if (newFileFlag) {
            // 这一行是日志的第一行
            newFileFlag = false;
            const gameName = msg.substring(1, msg.indexOf(']'));
            let luanchTime = msg.substring(msg.indexOf(' - ') + 3);
            luanchTime = luanchTime.replace('/', '年');
            luanchTime = luanchTime.replace('/', '月');
            luanchTime = luanchTime.replace(' ', '日 ');
            $('#game_name').text(gameName);
            $('#luanch_time').text(luanchTime);
        }
        else {
            const rownum=$("#log_table tr").length - 1;
            if (msg.match(/\d\d:\d\d:\d\d\.\d\d-\[.*/g) == null) {
                // 一条日志有多行
                const cur = $(`#log_table tr:eq(${rownum}) td:nth-child(3)`).html();
                $(`#log_table tr:eq(${rownum}) td:nth-child(3)`).html(cur+'<br />'+msg);
            }
            else {
                // 加入表格
                const logTime = msg.substring(0, 11);
                const logType = msg.substring(13,msg.indexOf(']'));
                const logContent = msg.substring(msg.indexOf(']') + 1);
                let classType = "";
                if (logType == "Log") {
                    classType = "info";
                }
                else if (logType == "Warning") {
                    classType = "warning";
                    warningCount += 1;
                }
                else {
                    classType = "danger";
                    errorCount += 1;
                }
                if (logType != "Log") {
                    refreshErrorCount();
                }
                const row = $(`<tr class="${classType}">`+
                `<td class="td-time">${logTime}</td>`+
                `<td class="td-type">${logType}</td>`+
                `<td class="td-info">${logContent}</td></tr>`);
                row.insertAfter($(`#log_table tr:eq(${rownum})`));
                $('.doc-table').scrollTop($('#log_table').height());
            }
        }
    }
};

$(document).ready(() => {
    const cp = require('child_process');
    watcher = cp.spawn('python', [__dirname + '\\watcher.py']);
    // watcher = cp.spawn('cmd');
    watcher.stdout.on('data', function(data){
        const lines = data.toString().replace(/\r/g, '').split('\n')
        for(let i = 0; i < lines.length; ++i) {
            if (lines[i] != "") {
                if (lines[i] != "b''")
                onGetOutput(lines[i]);
            }
        }
    });
    watcher.stderr.on('data', function(data){
        console.log('stderr:' + data.toString());
    });
    watcher.on('exit', function(code, signal){
        console.log('exit:' + code);
    });
    $('#log_table_header').hide();
    refreshHeight();
});

$(window).resize(function(){
    refreshHeight();
});

$('.doc-table').scroll(function(){
    if ($('.doc-table').scrollTop() > 30) {
        $('#log_table_header').show();
    }
    else {
        $('#log_table_header').hide();
    }
    refreshHeight()
})
