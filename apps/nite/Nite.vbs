Option Explicit

Dim objShell, X, objFSO, objDrive, objWMIService, colItems, objItem, strMsg
Dim appName, appPath, fileName
Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objWMIService = GetObject("winmgmts:\\.\root\cimv2")

' Function to search for a VBS file in given paths
Function FindFile(name, fileType)
    Dim path, file
    Dim paths
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

Do
    X = InputBox("Enter command (start with '$'):", "Nite Application")

    Select Case LCase(X)
        Case "$pc"
            ' Disk Space Information
            Set objDrive = objFSO.GetDrive(objFSO.GetDriveName(objFSO.GetSpecialFolder(0)))
            Dim freeSpace, totalSpace
            freeSpace = objDrive.FreeSpace / 1024 / 1024 / 1024
            totalSpace = objDrive.TotalSize / 1024 / 1024 / 1024

            ' CPU Usage Information
            Dim cpuUsage
            Set colItems = objWMIService.ExecQuery("Select * from Win32_Processor")
            For Each objItem In colItems
                cpuUsage = objItem.LoadPercentage & "%"
            Next

            ' Memory Usage Information
            Dim totalMemory, freeMemory, usedMemory
            Set colItems = objWMIService.ExecQuery("Select * from Win32_OperatingSystem")
            For Each objItem In colItems
                totalMemory = objItem.TotalVisibleMemorySize / 1024 / 1024 & " GB"
                freeMemory = objItem.FreePhysicalMemory / 1024 / 1024 & " GB"
                usedMemory = (objItem.TotalVisibleMemorySize - objItem.FreePhysicalMemory) / 1024 / 1024 & " GB"
            Next

            ' Network Information
            Dim networkInfo
            Set colItems = objWMIService.ExecQuery("Select * from Win32_NetworkAdapterConfiguration Where IPEnabled = True")
            networkInfo = ""
            For Each objItem In colItems
                networkInfo = networkInfo & "Description: " & objItem.Description & vbCrLf & _
                              "IP Address: " & Join(objItem.IPAddress, ", ") & vbCrLf & _
                              "MAC Address: " & objItem.MACAddress & vbCrLf & vbCrLf
            Next

            ' OS Information
            Dim osInfo
            Set colItems = objWMIService.ExecQuery("Select * from Win32_OperatingSystem")
            For Each objItem In colItems
                osInfo = "OS: " & objItem.Caption & vbCrLf & _
                         "Version: " & objItem.Version & vbCrLf & _
                         "Architecture: " & objItem.OSArchitecture
            Next

            ' Battery Information (if applicable)
            Dim batteryInfo
            Set colItems = objWMIService.ExecQuery("Select * from Win32_Battery")
            batteryInfo = ""
            For Each objItem In colItems
                batteryInfo = "Battery Status:" & vbCrLf & _
                              "Battery Status: " & objItem.Status & vbCrLf & _
                              "Estimated Charge Remaining: " & objItem.EstimatedChargeRemaining & "%" & vbCrLf
            Next

            ' Create the status message
            strMsg = "PC Status:" & vbCrLf & _
                     "Free Disk Space: " & Round(freeSpace, 2) & " GB" & vbCrLf & _
                     "Total Disk Space: " & Round(totalSpace, 2) & " GB" & vbCrLf & vbCrLf & _
                     "CPU Usage: " & cpuUsage & vbCrLf & vbCrLf & _
                     "Memory Usage:" & vbCrLf & _
                     "Total Memory: " & totalMemory & vbCrLf & _
                     "Free Memory: " & freeMemory & vbCrLf & _
                     "Used Memory: " & usedMemory & vbCrLf & vbCrLf & _
                     "Network Information:" & vbCrLf & networkInfo & vbCrLf & _
                     osInfo & vbCrLf & _
                     batteryInfo & vbCrLf & _
                     "Current System Time: " & Now

            MsgBox strMsg, vbInformation, "Nite - PC Check"

        Case "$dev"
            MsgBox "The developer of this app is Nikhil Tiwari.", vbInformation, "Nite"
        Case "$info"
            MsgBox "Info: This application is made in VBScript. Developer: Nikhil Tiwari. Created on 12-09-2021.", vbInformation, "Nite"
        Case "$open"
            ' Get the common name of the file to open
            appName = InputBox("Enter the common name of the application or script to open (e.g., 'myScript'):", "Nite - Open Application")
            
            ' Search for the file with .vbs extension
            fileName = appName
            appPath = FindFile(fileName, ".vbs")

            ' Open the application or script if a suitable path is found
            If appPath <> "" Then
                On Error Resume Next
                objShell.Run Chr(34) & appPath & Chr(34), 1, False
                If Err.Number <> 0 Then
                    MsgBox "Error: Unable to open the file. Please check the file name and try again.", vbCritical, "Nite - Error"
                End If
                On Error GoTo 0
            Else
                MsgBox "Error: File not found. Please ensure the name is correct.", vbCritical, "Nite - Error"
            End If

        Case "$update"
            MsgBox "Redirecting to the update page.", vbInformation, "Nite - Updater"
            objShell.Run "https://nikhilt8144.github.io/apps/Nite.vbs"
        Case "$version"
            MsgBox "The version of the application is v1.0", vbInformation, "Nite - Version"
        Case "$time"
            MsgBox "Current Time: " & Now, vbInformation, "Nite"
        Case "$commands"
            MsgBox "Commands: $pc, $dev, $info, $open, $update, $version, $time, $exit", vbInformation, "Nite - Help"
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
