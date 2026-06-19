@echo off
setlocal EnableExtensions

set "ROOT=%~dp0"
if exist "C:\Program Files\BellSoft\LibericaJDK-17\bin\java.exe" (
  set "JAVA_HOME=C:\Program Files\BellSoft\LibericaJDK-17"
) else if exist "D:\JDK17\bin\java.exe" (
  set "JAVA_HOME=D:\JDK17"
) else if exist "D:\JDK18\bin\java.exe" (
  set "JAVA_HOME=D:\JDK18"
) else if exist "D:\JDK\bin\java.exe" (
  set "JAVA_HOME=D:\JDK"
) else (
  set "JAVA_HOME="
)
if defined JAVA_HOME set "PATH=%JAVA_HOME%\bin;%PATH%"
set "APP_URL=http://localhost:8080/app/"
set "JAR=%ROOT%target\travel-cloud-map-0.0.1-SNAPSHOT.jar"
set "LOG=%ROOT%target\server.log"
set "ERR_LOG=%ROOT%target\server-error.log"

title Molu Xunqian - one click restart

echo.
echo [1/6] Using JAVA_HOME=%JAVA_HOME%
java -version
if errorlevel 1 (
  echo Java is not available. Check JAVA_HOME in run.bat.
  pause
  exit /b 1
)

where mvn >nul 2>nul
if errorlevel 1 (
  echo Maven is not installed or not in PATH.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js/npm is not installed or not in PATH.
  pause
  exit /b 1
)

echo.
echo [2/6] Stopping old Spring Boot app if it is still running...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$root = (Resolve-Path '%ROOT%').Path; Get-CimInstance Win32_Process | Where-Object { $_.Name -match 'java|javaw' -and $_.CommandLine -and (($_.CommandLine -like '*com.zhuly.TravelCloudMapApplication*') -or ($_.CommandLine -like '*travel-cloud-map-0.0.1-SNAPSHOT.jar*') -or (($_.CommandLine -like '*spring-boot:run*') -and ($_.CommandLine -like ('*' + $root + '*')))) } | ForEach-Object { Write-Host ('Stopping PID ' + $_.ProcessId); Stop-Process -Id $_.ProcessId -Force }"

echo.
echo [3/6] Building frontend and syncing static files...
pushd "%ROOT%frontend"
if not exist node_modules (
  call npm install
  if errorlevel 1 (
    popd
    pause
    exit /b 1
  )
)
call npm run build
if errorlevel 1 (
  popd
  pause
  exit /b 1
)
popd

echo.
echo [4/6] Packaging latest Spring Boot app...
pushd "%ROOT%"
call mvn -q -DskipTests clean package
if errorlevel 1 (
  popd
  pause
  exit /b 1
)
popd

if not exist "%JAR%" (
  echo Cannot find app jar: %JAR%
  pause
  exit /b 1
)

echo.
echo Checking packaged frontend assets...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$jar='%JAR%'; $hasCss = (& jar tf $jar) -match '^BOOT-INF/classes/static/app/assets/.+\.css$'; if (-not $hasCss) { Write-Host 'Packaged jar is missing CSS assets. Rebuilding once after frontend sync...'; exit 2 }"
if errorlevel 2 (
  pushd "%ROOT%"
  call mvn -q -DskipTests clean package
  if errorlevel 1 (
    popd
    pause
    exit /b 1
  )
  popd
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$jar='%JAR%'; $hasCss = (& jar tf $jar) -match '^BOOT-INF/classes/static/app/assets/.+\.css$'; if (-not $hasCss) { Write-Host 'ERROR: CSS assets are still missing from the jar. Please check frontend build output.'; exit 1 }"
if errorlevel 1 (
  pause
  exit /b 1
)

echo.
echo [5/6] Starting app on port 8080...
if defined JAVA_HOME (
  set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
) else (
  set "JAVA_EXE=java"
)
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$p = Start-Process -FilePath '%JAVA_EXE%' -ArgumentList '-jar','%JAR%' -WorkingDirectory '%ROOT%' -WindowStyle Hidden -RedirectStandardOutput '%LOG%' -RedirectStandardError '%ERR_LOG%' -PassThru; Set-Content -Path '%ROOT%target\server.pid' -Value $p.Id"

echo Waiting for %APP_URL% ...
set "READY="
for /L %%i in (1,1,45) do (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing '%APP_URL%' -TimeoutSec 2; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>nul
  if not errorlevel 1 (
    set "READY=1"
    goto open_browser
  )
  timeout /t 1 /nobreak >nul
)

:open_browser
echo.
if "%READY%"=="1" (
  echo [6/6] App is ready. Opening browser...
) else (
  echo [6/6] ERROR: Server failed to become ready.
  echo.
  echo Last server log:
  powershell -NoProfile -ExecutionPolicy Bypass -Command "if (Test-Path '%LOG%') { Get-Content '%LOG%' -Tail 25 }; if (Test-Path '%ERR_LOG%') { Get-Content '%ERR_LOG%' -Tail 25 }"
  echo.
  echo Logs: %LOG%
  pause
  exit /b 1
)
start "" "%APP_URL%"

echo.
echo Done. Keep the server window open while using the site.
echo URL: %APP_URL%
pause
