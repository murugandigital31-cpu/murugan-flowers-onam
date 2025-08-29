$url = "https://i.pinimg.com/originals/fa/1a/97/fa1a97d5f4e7fc274e0d507abd3b4a75.jpg"
$output = "D:\Web_App\Onam\backend\uploads\placeholder-preview.jpg"
Invoke-WebRequest -Uri $url -OutFile $output
Write-Host "Placeholder image downloaded to $output"