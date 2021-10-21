@echo off
cmd /c .\build-server
start ..\dist\server.exe -addr 127.0.0.1 -port 7777
cd ..\client
yarn start