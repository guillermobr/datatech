# Generate simple placeholder icons using ImageMagick (if available)
# Run this script after installing ImageMagick

$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)
$iconDir = "icons"

# Create icons directory if it doesn't exist
if (-not (Test-Path $iconDir)) {
    New-Item -ItemType Directory -Path $iconDir
}

foreach ($size in $sizes) {
    $filename = "icon-${size}x${size}.png"
    $filepath = Join-Path $iconDir $filename

    # Create a simple colored square as placeholder
    # You should replace these with your actual beauty studio icons
    if (Get-Command "magick" -ErrorAction SilentlyContinue) {
        & magick -size "${size}x${size}" xc:"#ff6b9d" -fill "white" -gravity center -pointsize $([math]::Floor($size/4)) -annotate +0+0 "✨" $filepath
        Write-Host "Created $filename"
    } else {
        Write-Host "ImageMagick not found. Please create $filename manually or install ImageMagick."
    }
}

Write-Host "`nIcon generation complete!"
Write-Host "Note: These are placeholder icons. Replace them with professional beauty studio icons."
