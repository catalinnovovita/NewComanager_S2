
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   AI Co-Manager S2 - GitHub Setup Agent" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Această fereastră te va ajuta să urci codul pe GitHub."
Write-Host "Codul este deja pregătit în folderul NewComanager_S2."
Write-Host ""
Write-Host "Pasul 1: Mergi la https://github.com/new"
Write-Host "Pasul 2: Creează un repository nou (Public sau Private)."
Write-Host "Pasul 3: NU bifa 'Initialize with README' (lasă-l gol)."
Write-Host "Pasul 4: Copiază link-ul HTTPS (ex: https://github.com/user/repo.git)"
Write-Host ""

$repoUrl = Read-Host "Lipește link-ul aici și apasă Enter"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Error "Nu ai introdus niciun link."
    exit 1
}

Write-Host "Configurare remote origin..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin $repoUrl

Write-Host "Redenumire branch principal..." -ForegroundColor Yellow
git branch -M main

Write-Host "Se încarcă fișierele (Push)..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ GATA! Codul a fost urcat cu succes." -ForegroundColor Green
    Write-Host "Acum poți merge în Railway -> New Project -> Deploy from generated repo." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ A apărut o eroare la push." -ForegroundColor Red
    Write-Host "Verifică dacă ai drepturi de scriere pe repository-ul respectiv."
}

Read-Host "Apasă Enter pentru a închide..."
