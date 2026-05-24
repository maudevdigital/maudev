# Script PowerShell para hacer commit + push de los cambios de tracking/afiliados.
# Uso: abrir PowerShell en la carpeta del proyecto y ejecutar:
#   .\COMMIT_PUSH.ps1
#
# Si PowerShell bloquea la ejecución, primero corré:
#   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

# Posicionarse en la raíz del repo
Set-Location -Path $PSScriptRoot

Write-Host "=== Estado inicial ===" -ForegroundColor Cyan
git status --short

Write-Host "`n=== Verificando lock ===" -ForegroundColor Cyan
if (Test-Path ".git\index.lock") {
    Write-Host "Removiendo .git\index.lock..." -ForegroundColor Yellow
    Remove-Item ".git\index.lock" -Force -ErrorAction SilentlyContinue
}

Write-Host "`n=== Agregando todos los cambios ===" -ForegroundColor Cyan
git add -A

Write-Host "`n=== Commit ===" -ForegroundColor Cyan
git commit -m "feat(monetization): GA4 tracking, AffiliateLink component + disclosure

- Activa GA4 (G-5R3Z9C6Y9Q) con Consent Mode v2 denegado por default
- Agrega meta tag de verificación Impact.com para programa Semrush
- Crea componente <AffiliateLink> con event tracking en gtag
- Crea config central de programas afiliados (Hostinger, Semrush, Unbounce,
  GetResponse, Jotform, Systeme.io, TradingView, FTMO, PineConnector)
- Crea <AffiliateDisclosure> para compliance Ley 19.628 (CL) + FTC
- Integra disclosure compact al footer del blog post layout
- Documenta plan de monetización en MONETIZATION_PLAN.md

Próximos pasos: aprobación Hostinger (5 días), pegar tracking IDs en
affiliate-config.ts a medida que aprueben, encender Google Ads en cola larga
con presupuesto de \$30-50/mes."

Write-Host "`n=== Push a origin/main ===" -ForegroundColor Cyan
git push origin main

Write-Host "`n=== Listo ===" -ForegroundColor Green
Write-Host "Si Railway tiene auto-deploy on, en 2-5 min deberías ver el nuevo deploy en railway.app"
