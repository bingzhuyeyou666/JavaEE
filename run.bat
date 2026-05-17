@echo off
set "JAVA_HOME=D:\JDK18"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Using JAVA_HOME=%JAVA_HOME%
java -version

where mvn >nul 2>nul
if errorlevel 1 (
  echo.
  echo Maven is not installed or not in PATH.
  echo Please install Maven, then run this file again.
  echo.
  pause
  exit /b 1
)

mvn spring-boot:run
pause
