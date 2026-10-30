Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("C:\Work2\ronie-show\img\palco-trocar.jpeg")
Write-Output "$($img.Width) x $($img.Height)"
$img.Dispose()
