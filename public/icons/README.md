# Instructions pour les icônes PWA

Pour compléter la configuration PWA, vous devez créer les icônes suivantes dans le dossier `public/icons/`:

## Icônes requises :

- icon-72x72.png (72x72 pixels)
- icon-96x96.png (96x96 pixels)
- icon-128x128.png (128x128 pixels)
- icon-144x144.png (144x144 pixels)
- icon-152x152.png (152x152 pixels)
- icon-192x192.png (192x192 pixels)
- icon-384x384.png (384x384 pixels)
- icon-512x512.png (512x512 pixels)

## Comment créer les icônes :

1. Créez un logo de 512x512 pixels pour votre application
2. Utilisez un outil en ligne comme https://realfavicongenerator.net/ ou https://www.pwabuilder.com/
3. Téléchargez votre logo et générez toutes les tailles d'icônes
4. Placez les icônes générées dans le dossier `public/icons/`

## Ou utilisez ImageMagick en ligne de commande :

```bash
# Créez d'abord un dossier icons
mkdir public/icons

# Redimensionnez votre logo original (logo.png) en différentes tailles
convert logo.png -resize 72x72 public/icons/icon-72x72.png
convert logo.png -resize 96x96 public/icons/icon-96x96.png
convert logo.png -resize 128x128 public/icons/icon-128x128.png
convert logo.png -resize 144x144 public/icons/icon-144x144.png
convert logo.png -resize 152x152 public/icons/icon-152x152.png
convert logo.png -resize 192x192 public/icons/icon-192x192.png
convert logo.png -resize 384x384 public/icons/icon-384x384.png
convert logo.png -resize 512x512 public/icons/icon-512x512.png
```

## Caractéristiques des icônes :

- Format : PNG
- Fond : Transparent ou couleur unie (selon votre marque)
- Design : Simple et reconnaissable même à petite taille
- Padding : Laissez environ 10% d'espace autour du logo pour le "safe zone"

## Test PWA :

1. Déployez votre application
2. Ouvrez Chrome DevTools > Application > Manifest
3. Vérifiez que toutes les icônes sont correctement chargées
4. Testez l'installation de la PWA sur mobile et desktop
