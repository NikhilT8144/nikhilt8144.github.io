Option Explicit

' ---------------------------------------------------------------------------------
' Script Name: Nite Application
' Description: A utility script for system information and various commands
' Developer: Nikhil Tiwari
' Created on: 12-09-2021
' Version: 1.2
' Digital Signature: Nikhil Tiwari - Verified Developer
' ---------------------------------------------------------------------------------

Dim objShell, objFSO, objWMIService, objDrive
Dim strMsg, appName, cmdToRun, X
Dim freeSpace, totalSpace, cpuUsage, totalMemory, freeMemory, usedMemory
Dim networkInfo, osInfo, batteryInfo, productKey

Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objWMIService = GetObject("winmgmts:\\.\root\cimv2")

' Function to search for a file in given paths
Function FindFile(name, fileType)
    Dim path, file, paths
    paths = Array("C:\Windows\System32\", "C:\Program Files\", "C:\Program Files (x86)\", "C:\")
    
    For Each path In paths
        file = path & name & fileType
        If objFSO.FileExists(file) Then
            FindFile = file
            Exit Function
        End If
    Next
    FindFile = ""
End Function

' Function to gather system information
Sub GatherSystemInfo()
    On Error Resume Next

    ' Disk Space Information
    Set objDrive = objFSO.GetDrive(objFSO.GetDriveName(objFSO.GetSpecialFolder(0)))
    freeSpace = Round(objDrive.FreeSpace / 1024 / 1024 / 1024, 2)
    totalSpace = Round(objDrive.TotalSize / 1024 / 1024 / 1024, 2)

    ' CPU Usage Information
    Dim cpuItem
    Set cpuItem = objWMIService.ExecQuery("Select * from Win32_Processor").ItemIndex(0)
    cpuUsage = cpuItem.LoadPercentage & "%"

    ' Memory Usage Information
    Dim memItem
    Set memItem = objWMIService.ExecQuery("Select * from Win32_OperatingSystem").ItemIndex(0)
    totalMemory = Round(memItem.TotalVisibleMemorySize / 1024 / 1024, 2) & " GB"
    freeMemory = Round(memItem.FreePhysicalMemory / 1024 / 1024, 2) & " GB"
    usedMemory = Round((memItem.TotalVisibleMemorySize - memItem.FreePhysicalMemory) / 1024 / 1024, 2) & " GB"

    ' Network Information
    Dim netItem
    networkInfo = ""
    For Each netItem In objWMIService.ExecQuery("Select * from Win32_NetworkAdapterConfiguration Where IPEnabled = True")
        networkInfo = networkInfo & "Description: " & netItem.Description & vbCrLf & _
                      "IP Address: " & Join(netItem.IPAddress, ", ") & vbCrLf & _
                      "MAC Address: " & netItem.MACAddress & vbCrLf & vbCrLf
    Next

    ' OS Information
    Dim osItem
    Set osItem = objWMIService.ExecQuery("Select * from Win32_OperatingSystem").ItemIndex(0)
    osInfo = "OS: " & osItem.Caption & vbCrLf & _
             "Version: " & osItem.Version & vbCrLf & _
             "Architecture: " & osItem.OSArchitecture

    ' Battery Information (if applicable)
    batteryInfo = ""
    For Each batteryItem In objWMIService.ExecQuery("Select * from Win32_Battery")
        batteryInfo = batteryInfo & "Battery Status:" & vbCrLf & _
                      "Battery Status: " & batteryItem.Status & vbCrLf & _
                      "Estimated Charge Remaining: " & batteryItem.EstimatedChargeRemaining & "%" & vbCrLf
    Next

    ' OS Product Key Information
    productKey = GetOSProductKey()

    On Error GoTo 0
End Sub

' Function to get OS Product Key from the registry
Function GetOSProductKey()
    Dim regPath, regKey, regValue, objReg
    regPath = "SOFTWARE\Microsoft\Windows NT\CurrentVersion"
    regKey = "ProductId"
    Set objReg = CreateObject("WScript.Shell")
    On Error Resume Next
    regValue = objReg.RegRead("HKEY_LOCAL_MACHINE\" & regPath & "\" & regKey)
    If Err.Number <> 0 Then
        GetOSProductKey = "Unable to retrieve product key."
    Else
        GetOSProductKey = regValue
    End If
    On Error GoTo 0
End Function

Do
    X = LCase(InputBox("Enter command (start with '$'):", "Nite Application"))

    Select Case X
        Case "$pc"
            GatherSystemInfo()

            ' Create the status message
            strMsg = "PC Status:" & vbCrLf & _
                     "Free Disk Space: " & freeSpace & " GB" & vbCrLf & _
                     "Total Disk Space: " & totalSpace & " GB" & vbCrLf & vbCrLf & _
                     "CPU Usage: " & cpuUsage & vbCrLf & vbCrLf & _
                     "Memory Usage:" & vbCrLf & _
                     "Total Memory: " & totalMemory & vbCrLf & _
                     "Free Memory: " & freeMemory & vbCrLf & _
                     "Used Memory: " & usedMemory & vbCrLf & vbCrLf & _
                     "Network Information:" & vbCrLf & networkInfo & vbCrLf & _
                     osInfo & vbCrLf & _
                     batteryInfo & vbCrLf & _
                     "OS Product Key: " & productKey & vbCrLf & _
                     "Current System Time: " & Now

            MsgBox strMsg, vbInformation, "Nite - PC Check"

        Case "$dev"
            MsgBox "The developer of this app is Nikhil Tiwari. \nDigital Signature: Nikhil Tiwari - Verified Developer.", vbInformation, "Nite"
            
        Case "$info"
            MsgBox "Info: This application is made in VBScript. Developer: Nikhil Tiwari. Created on 12-09-2021. \nDigital Signature: Nikhil Tiwari - Verified Developer.", vbInformation, "Nite"
            
        Case "$run"
            appName = InputBox("Enter the common name of the application or script to run (e.g., 'notepad', 'calc'):", "Nite - Run Application")
            
            ' Execute the command as if using the Run dialog
            cmdToRun = appName
            On Error Resume Next
            objShell.Run cmdToRun, 1, False
            If Err.Number <> 0 Then
                MsgBox "Error: Unable to run the application or script. Please check the name and try again.", vbCritical, "Nite - Error"
            End If
            On Error GoTo 0

        Case "$update"
            MsgBox "Redirecting to the update page.", vbInformation, "Nite - Updater"
            objShell.Run "https://nikhilt8144.github.io/apps/Nite.vbs"
            
        Case "$version"
            MsgBox "The version of the application is v1.2", vbInformation, "Nite - Version"
            
        Case "$time"
            MsgBox "Current Time: " & Now, vbInformation, "Nite"
            
        Case "$commands"
            MsgBox "Commands: $pc, $dev, $info, $run, $update, $version, $time, $help, $exit", vbInformation, "Nite - Help"
            
        Case "$help"
            MsgBox "Help: Use the following commands to interact with the application: " & vbCrLf & _
                   "$pc - Display PC status" & vbCrLf & _
                   "$dev - Show developer information" & vbCrLf & _
                   "$info - Show application info" & vbCrLf & _
                   "$run - Run an application or script" & vbCrLf & _
                   "$update - Check for updates" & vbCrLf & _
                   "$version - Display application version" & vbCrLf & _
                   "$time - Show current time" & vbCrLf & _
                   "$commands - List all commands" & vbCrLf & _
                   "$help - Show this help message" & vbCrLf & _
                   "$exit - Exit the application", vbInformation, "Nite - Help"

        Case "$exit"
            MsgBox "App Terminated!", vbInformation, "Nite - System"
            Exit Do
            
        Case Else
            MsgBox "Error: The command entered was invalid.", vbCritical, "Nite - Error"
    End Select
Loop

Set objShell = Nothing
Set objFSO = Nothing
Set objDrive = Nothing
Set objWMIService = Nothing
