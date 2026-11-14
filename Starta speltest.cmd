@echo off
cd /d "%~dp0"
"C:\Users\freyj\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "%~dp0trusted\lan-server.cjs"
pause
