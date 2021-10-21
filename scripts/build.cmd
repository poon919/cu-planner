@echo off
rmdir /S /Q ..\dist
cmd /c .\build-server
cd ..\client
call yarn build
move .\build ..\dist\app