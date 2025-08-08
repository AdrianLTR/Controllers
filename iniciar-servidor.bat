@echo off
echo ===================================================
echo    SERVIDOR LOCAL PARA CONTROLLERS RD
echo ===================================================
echo.
echo Iniciando servidor HTTP local en puerto 8000...
echo.
echo Una vez iniciado, abre tu navegador y ve a:
echo http://localhost:8000
echo.
echo Presiona Ctrl+C para detener el servidor
echo.
echo ===================================================

cd /d "%~dp0"

:: Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python no está instalado o no está en el PATH
    echo.
    echo Por favor instala Python desde https://python.org
    echo o usa otro servidor HTTP como Live Server en VS Code
    echo.
    pause
    exit /b 1
)

:: Iniciar servidor HTTP
echo Servidor iniciado correctamente!
echo.
python -m http.server 8000
