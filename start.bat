@echo off
cd /d "%~dp0"
if not exist "node_modules\ws" (
  echo Dang cai thu vien can thiet lan dau...
  npm install
  if errorlevel 1 (
    echo Cai dat that bai. Hay kiem tra Node.js va ket noi Internet.
    pause
    exit /b 1
  )
)
npm start
pause
