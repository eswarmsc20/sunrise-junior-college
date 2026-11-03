# Sunrise Junior College - GitHub Push Script
param(
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl
)

$gitPath = "C:\Program Files\Git\cmd\git.exe"

Write-Host "Connecting to GitHub repository: $RepoUrl" -ForegroundColor Cyan
& $gitPath remote remove origin 2>$null
& $gitPath remote add origin $RepoUrl
& $gitPath branch -M main

Write-Host "Pushing code to GitHub..." -ForegroundColor Yellow
& $gitPath push -u origin main

Write-Host "`nSuccessfully pushed to GitHub!" -ForegroundColor Green
Write-Host "Next Step: In your GitHub Repository, go to Settings -> Pages -> Source, and choose 'GitHub Actions'." -ForegroundColor White
