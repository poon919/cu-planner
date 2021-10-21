@echo off
cmd /c .\build
cd ..\dist
start ..\dist\server.exe -addr 127.0.0.1 -port 7777