@echo off
goto start


:start
node bot.js
timeout 20
goto start

pause