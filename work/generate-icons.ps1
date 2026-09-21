Add-Type -AssemblyName System.Drawing

$outputDirectory = Join-Path $PSScriptRoot "..\outputs\kana-card\icons"
$outputDirectory = [System.IO.Path]::GetFullPath($outputDirectory)
[System.IO.Directory]::CreateDirectory($outputDirectory) | Out-Null

function New-RoundedRectanglePath {
  param(
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [float]$Radius
  )

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $Radius * 2
  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function New-Icon {
  param(
    [int]$Size,
    [string]$FileName
  )

  $bitmap = New-Object System.Drawing.Bitmap $Size, $Size
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.Clear([System.Drawing.Color]::Transparent)

  $scale = $Size / 512.0
  $graphics.ScaleTransform($scale, $scale)

  $backgroundPath = New-RoundedRectanglePath 0 0 512 512 108
  $backgroundBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#172a2e"))
  $graphics.FillPath($backgroundBrush, $backgroundPath)

  $accentBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#d95b46"))
  $graphics.FillEllipse($accentBrush, 356, 70, 84, 84)

  $whitePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), 42
  $whitePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $whitePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $whitePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

  $tealPen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#8fd0cc")), 42
  $tealPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $tealPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

  $graphics.DrawLine($whitePen, 110, 175, 264, 175)
  $graphics.DrawArc($whitePen, 170, 175, 186, 156, 270, 180)
  $graphics.DrawArc($whitePen, 170, 253, 186, 154, 270, 180)
  $graphics.DrawLine($whitePen, 143, 175, 143, 481)
  $graphics.DrawLine($whitePen, 217, 175, 217, 481)
  $graphics.DrawLine($tealPen, 119, 326, 275, 326)

  $path = Join-Path $outputDirectory $FileName
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)

  $tealPen.Dispose()
  $whitePen.Dispose()
  $accentBrush.Dispose()
  $backgroundBrush.Dispose()
  $backgroundPath.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

New-Icon -Size 180 -FileName "apple-touch-icon.png"
New-Icon -Size 192 -FileName "icon-192.png"
New-Icon -Size 512 -FileName "icon-512.png"

Write-Output "Generated icons in $outputDirectory"
