import time
import os
import sys
import conf

g_folder_name = conf.folder_name
g_log_file_prefix = "GameLog"
g_log_count = 0


def output(msg):
    print(msg.encode('unicode-escape'))
    sys.stdout.flush()


def check_new():
    latest = 0
    global g_folder_name
    global g_log_file_prefix
    global g_log_count
    files = os.listdir(g_folder_name)
    g_log_count = 0
    for filename in files:
        try:
            if not filename.startswith(g_log_file_prefix):
                continue
            g_log_count += 1
            date = int(filename[7:len(filename) - 4])
            if date > latest:
                latest = date
        except ValueError:
            pass
    return "%s%d.txt" % (g_log_file_prefix, latest)
    pass  # end of check_new


def main():
    global g_folder_name
    global g_log_count
    filename = check_new()
    output("$NEW_FILE$%s@%d" % (g_folder_name + filename, g_log_count))
    log_file = open(g_folder_name + filename, 'r', encoding='UTF-8')
    lines = log_file.readlines()
    for line in lines:
        output(line.rstrip("\n"))
    file_length = len(lines)
    while True:
        try:
            latest = check_new()
            if latest != filename:
                filename = latest
                file_length = 0
                output("$NEW_FILE$%s@%d" % (g_folder_name + filename, g_log_count))
            log_file = open(g_folder_name + filename, 'r', encoding='UTF-8')
            lines = log_file.readlines()
            cur_length = len(lines)
            if cur_length > file_length:
                new_lines = lines[file_length:cur_length]
                for line in new_lines:
                    output(line.rstrip())
                file_length = cur_length
            log_file.close()
        except PermissionError:
            pass
        time.sleep(0.1)
        pass  # end of while
    pass  # end of main


if __name__ == '__main__':
    main()
