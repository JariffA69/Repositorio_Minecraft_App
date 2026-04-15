param(
  [ValidateSet("enable","disable","status")]
  [string]$Action = "status",

  [string]$InterfaceAlias = "Ethernet"
)

$ErrorActionPreference = "Stop"

function Test-Admin {
  $current = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = New-Object Security.Principal.WindowsPrincipal($current)
  return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-Admin)) {
  Write-Error "Ejecuta este script como Administrador."
  exit 1
}

$ruleNames = @(
  "Expo LAN TCP 8081",
  "Expo LAN TCP 19000-19002",
  "Expo LAN UDP 19000-19002"
)

function Enable-ExpoLan {
  try {
    Set-NetConnectionProfile -InterfaceAlias $InterfaceAlias -NetworkCategory Private -ErrorAction Stop
    Write-Host "Perfil de red cambiado a Private en '$InterfaceAlias'."
  } catch {
    Write-Warning "No se pudo cambiar el perfil de red (posible política de grupo o falta de permisos): $($_.Exception.Message)"
  }

  foreach ($name in $ruleNames) {
    Get-NetFirewallRule -DisplayName $name -ErrorAction SilentlyContinue | Remove-NetFirewallRule -ErrorAction SilentlyContinue
  }

  New-NetFirewallRule `
    -DisplayName "Expo LAN TCP 8081" `
    -Direction Inbound `
    -Action Allow `
    -Protocol TCP `
    -LocalPort 8081 `
    -Profile Private `
    -RemoteAddress LocalSubnet | Out-Null

  New-NetFirewallRule `
    -DisplayName "Expo LAN TCP 19000-19002" `
    -Direction Inbound `
    -Action Allow `
    -Protocol TCP `
    -LocalPort 19000-19002 `
    -Profile Private `
    -RemoteAddress LocalSubnet | Out-Null

  New-NetFirewallRule `
    -DisplayName "Expo LAN UDP 19000-19002" `
    -Direction Inbound `
    -Action Allow `
    -Protocol UDP `
    -LocalPort 19000-19002 `
    -Profile Private `
    -RemoteAddress LocalSubnet | Out-Null

  Write-Host "Expo LAN habilitado (solo Private + LocalSubnet)."
}

function Disable-ExpoLan {
  foreach ($name in $ruleNames) {
    Get-NetFirewallRule -DisplayName $name -ErrorAction SilentlyContinue | Remove-NetFirewallRule -ErrorAction SilentlyContinue
  }
  Write-Host "Reglas de Expo LAN eliminadas."
}

function Show-Status {
  Write-Host "=== Perfil de red ==="
  Get-NetConnectionProfile | Select-Object Name, InterfaceAlias, NetworkCategory, IPv4Connectivity | Format-Table -AutoSize

  Write-Host "`n=== Reglas Expo LAN ==="
  Get-NetFirewallRule -DisplayName "Expo LAN *" -ErrorAction SilentlyContinue |
    Select-Object DisplayName, Enabled, Profile, Direction, Action |
    Format-Table -AutoSize
}

switch ($Action) {
  "enable"  { Enable-ExpoLan; Show-Status }
  "disable" { Disable-ExpoLan; Show-Status }
  "status"  { Show-Status }
}
