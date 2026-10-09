@echo off
title AlgoPulse DSA Command Center
echo Starting AlgoPulse DSA Prep Tracker...
cd /d "%~dp0"
start http://localhost:5173/
npm run dev
pause
