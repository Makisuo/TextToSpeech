@echo off

:start
node standard.js
echo Abgestuerzt am %Date% um %Time% mit Error %ErrorLevel%
echo Strg + C wenn nicht automatisch gerestartet werden soll#

goto start



