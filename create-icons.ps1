# Simple script to create basic PNG icons for the PWA
# This creates minimal pink square icons with emoji

$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)
$iconDir = "icons"

# Base64 data for a simple pink icon (72x72)
$base64Data = "iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAaVBMVEX/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5n/a5kB4n8oAAAAIXRSTlMAgIBggCAwECAwUFCPj7+/v9/f39/fz8/Pz6+vr5+fn18cU26dAAAAnklEQVRYw+3WOw6AIBAEUIaFRUFBwfuf1MTEztfJJm7iS/yPmckkQojkf9M0TT80TdPHpm36oWma3ptpmn5omqa3Zpqm75umafqx57znnPOe8/6P4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4ziO4zh/4gYUfCIhvKoF2wAAAABJRU5ErkJggg=="

foreach ($size in $sizes) {
    $filename = "icon-${size}x${size}.png"
    $filepath = Join-Path $iconDir $filename
    
    try {
        $bytes = [Convert]::FromBase64String($base64Data)
        [System.IO.File]::WriteAllBytes($filepath, $bytes)
        Write-Host "Created basic $filename (will need replacement with proper icons)"
    } catch {
        Write-Host "Could not create $filename - creating placeholder"
        # Create a text placeholder file
        "PLACEHOLDER FOR $filename - Replace with actual icon file" | Out-File -FilePath "$filepath.txt"
    }
}

Write-Host "`nBasic icons created! For better icons:"
Write-Host "1. Use online icon generators like favicon.io or realfavicongenerator.net"
Write-Host "2. Or open icon-generator.html in browser and save the canvases"
Write-Host "3. Replace the generated files with professional beauty studio icons"