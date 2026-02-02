# Script PowerShell pour configurer la base de données Thanout

Write-Host "🚀 Configuration de la base de données Thanout E-commerce" -ForegroundColor Cyan
Write-Host ""

# Vérifier si PostgreSQL est installé
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlPath) {
    Write-Host "❌ PostgreSQL n'est pas installé ou pas dans le PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "📖 Veuillez suivre le guide d'installation : INSTALLATION_POSTGRESQL.md" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📥 Téléchargez PostgreSQL ici :" -ForegroundColor Yellow
    Write-Host "   https://www.enterprisedb.com/downloads/postgres-postgresql-downloads" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ PostgreSQL est installé" -ForegroundColor Green

# Demander le mot de passe postgres
Write-Host ""
$postgresPassword = Read-Host "Entrez le mot de passe de l'utilisateur postgres" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($postgresPassword)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Créer la base de données
Write-Host ""
Write-Host "📦 Création de la base de données 'thanout_db'..." -ForegroundColor Cyan

$env:PGPASSWORD = $plainPassword
$createDbResult = psql -U postgres -c "CREATE DATABASE thanout_db;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Base de données créée avec succès" -ForegroundColor Green
} else {
    if ($createDbResult -like "*already exists*") {
        Write-Host "ℹ️  La base de données existe déjà" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Erreur lors de la création de la base de données" -ForegroundColor Red
        Write-Host $createDbResult -ForegroundColor Red
        exit 1
    }
}

# Mettre à jour le fichier .env
Write-Host ""
Write-Host "📝 Mise à jour du fichier .env..." -ForegroundColor Cyan

$envPath = Join-Path $PSScriptRoot ".env"
$envContent = Get-Content $envPath -Raw

$newDatabaseUrl = "DATABASE_URL=`"postgresql://postgres:$plainPassword@localhost:5432/thanout_db?schema=public`""
$envContent = $envContent -replace 'DATABASE_URL=.*', $newDatabaseUrl

Set-Content -Path $envPath -Value $envContent

Write-Host "✅ Fichier .env mis à jour" -ForegroundColor Green

# Générer le client Prisma
Write-Host ""
Write-Host "🔧 Génération du client Prisma..." -ForegroundColor Cyan
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la génération du client Prisma" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Client Prisma généré" -ForegroundColor Green

# Pousser le schéma vers la base de données
Write-Host ""
Write-Host "📊 Création des tables dans la base de données..." -ForegroundColor Cyan
npx prisma db push --accept-data-loss

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la création des tables" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Tables créées avec succès" -ForegroundColor Green

# Remplir la base de données avec des données de test
Write-Host ""
Write-Host "🌱 Remplissage de la base de données avec des données de test..." -ForegroundColor Cyan
node prisma/seed.js

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du remplissage de la base de données" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✨ Configuration terminée avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Informations de connexion :" -ForegroundColor Cyan
Write-Host ""
Write-Host "👤 Admin :" -ForegroundColor Yellow
Write-Host "   Email: admin@thanout.com"
Write-Host "   Mot de passe: Admin123!"
Write-Host ""
Write-Host "👤 Utilisateur test :" -ForegroundColor Yellow
Write-Host "   Email: user@test.com"
Write-Host "   Mot de passe: User123!"
Write-Host ""
Write-Host "🎫 Codes promo :" -ForegroundColor Yellow
Write-Host "   WELCOME10, THANOUT20, SAVE5000, FREESHIP"
Write-Host ""
Write-Host "🚀 Vous pouvez maintenant démarrer le serveur avec : npm start" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Pour voir vos données : npx prisma studio" -ForegroundColor Cyan
