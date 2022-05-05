<?php 

$old_path = getcwd();
chdir('.');
//make sure to make the shell file executeable first before running the shell_exec function
$output = shell_exec('./shell-script.sh');
chdir($old_path);

echo $output;

/*
function execPrint($command) {
    $result = array();
    exec($command, $result);
    print("<pre>");
    foreach ($result as $line) {
        print($line . "\n");
    }
    print("</pre>");
}
// Print the exec output inside of a pre element
execPrint("git pull");
execPrint("git status");
*/