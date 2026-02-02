# Collection Postman - API Thanout

Guide d'utilisation de l'API avec des exemples de requêtes.

## 🔐 Configuration initiale

### Variables d'environnement Postman

Créez un environnement avec ces variables :

```
base_url: http://localhost:5000
api_url: {{base_url}}/api
access_token: (sera rempli automatiquement après login)
```

## 📝 Exemples de requêtes

### 1. Authentification

#### Inscription
```http
POST {{api_url}}/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!@#",
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "0555123456"
}
```

Réponse :
```json
{
  "message": "Inscription réussie",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "firstName": "Jean",
    "lastName": "Dupont"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Connexion
```http
POST {{api_url}}/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!@#"
}
```

Script Post-response (Tests) :
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("access_token", jsonData.accessToken);
}
```

#### Obtenir le profil
```http
GET {{api_url}}/auth/profile
Authorization: Bearer {{access_token}}
```

### 2. Produits

#### Liste des produits avec filtres
```http
GET {{api_url}}/products?page=1&limit=20&categoryId=1&minPrice=1000&maxPrice=50000&search=smartphone&sortBy=price&sortOrder=asc
```

Paramètres disponibles :
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre de résultats (défaut: 20)
- `categoryId` : Filtrer par catégorie
- `brandId` : Filtrer par marque
- `minPrice` : Prix minimum
- `maxPrice` : Prix maximum
- `search` : Recherche textuelle
- `isFeatured` : true/false
- `isNew` : true/false
- `isBestseller` : true/false
- `sortBy` : createdAt, price, name (défaut: createdAt)
- `sortOrder` : asc, desc (défaut: desc)

#### Détails d'un produit
```http
GET {{api_url}}/products/smartphone-samsung-galaxy-s23
```

#### Créer un produit (Admin)
```http
POST {{api_url}}/products
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "name": "Smartphone Samsung Galaxy S23",
  "slug": "smartphone-samsung-galaxy-s23",
  "categoryId": 1,
  "brandId": 2,
  "description": "Smartphone haut de gamme avec caméra 50MP",
  "shortDescription": "Galaxy S23 - Performance ultime",
  "price": 89990,
  "oldPrice": 109990,
  "stockQuantity": 25,
  "sku": "SAMS23-128GB-BLK",
  "images": [
    {
      "url": "/images/samsung-s23-front.jpg",
      "alt": "Samsung Galaxy S23 - Vue de face"
    },
    {
      "url": "/images/samsung-s23-back.jpg",
      "alt": "Samsung Galaxy S23 - Vue de dos"
    }
  ],
  "features": [
    {
      "name": "Écran",
      "value": "6.1 pouces AMOLED 120Hz"
    },
    {
      "name": "Processeur",
      "value": "Snapdragon 8 Gen 2"
    }
  ]
}
```

### 3. Panier

#### Obtenir le panier
```http
GET {{api_url}}/cart
X-Session-Id: votre-session-id
```
(Authentification optionnelle)

#### Ajouter au panier
```http
POST {{api_url}}/cart/items
Content-Type: application/json
X-Session-Id: votre-session-id

{
  "productId": 1,
  "quantity": 2,
  "variantId": 5
}
```

#### Mettre à jour la quantité
```http
PUT {{api_url}}/cart/items/123
Content-Type: application/json
X-Session-Id: votre-session-id

{
  "quantity": 3
}
```

#### Supprimer du panier
```http
DELETE {{api_url}}/cart/items/123
X-Session-Id: votre-session-id
```

#### Vider le panier
```http
DELETE {{api_url}}/cart
X-Session-Id: votre-session-id
```

### 4. Commandes

#### Valider un code promo
```http
POST {{api_url}}/orders/validate-promo
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "code": "WELCOME10",
  "cartTotal": 25000
}
```

#### Créer une commande
```http
POST {{api_url}}/orders
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "variantId": 5,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ],
  "paymentMethod": "cash_on_delivery",
  "promoCode": "WELCOME10",
  "shippingAddress": {
    "fullName": "Jean Dupont",
    "phone": "0555123456",
    "addressLine1": "123 Rue de la Liberté",
    "addressLine2": "Appartement 4",
    "city": "Alger",
    "wilaya": "Alger",
    "postalCode": "16000",
    "country": "Algérie"
  },
  "notes": "Livrer entre 14h et 18h"
}
```

#### Liste des commandes
```http
GET {{api_url}}/orders?page=1&status=pending
Authorization: Bearer {{access_token}}
```

#### Détails d'une commande
```http
GET {{api_url}}/orders/1
Authorization: Bearer {{access_token}}
```

#### Annuler une commande
```http
POST {{api_url}}/orders/1/cancel
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "reason": "J'ai changé d'avis"
}
```

### 5. Avis produits

#### Obtenir les avis d'un produit
```http
GET {{api_url}}/reviews/product/1?page=1&rating=5&sortBy=helpful
```

#### Créer un avis
```http
POST {{api_url}}/reviews/product/1
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "rating": 5,
  "title": "Excellent produit !",
  "comment": "Très satisfait de mon achat. Le produit correspond exactement à la description. Livraison rapide."
}
```

#### Marquer un avis comme utile
```http
POST {{api_url}}/reviews/123/helpful
Authorization: Bearer {{access_token}}
```

#### Supprimer son avis
```http
DELETE {{api_url}}/reviews/123
Authorization: Bearer {{access_token}}
```

### 6. Favoris

#### Liste des favoris
```http
GET {{api_url}}/favorites
Authorization: Bearer {{access_token}}
```

#### Ajouter aux favoris
```http
POST {{api_url}}/favorites/1
Authorization: Bearer {{access_token}}
```

#### Retirer des favoris
```http
DELETE {{api_url}}/favorites/1
Authorization: Bearer {{access_token}}
```

#### Vérifier si un produit est en favori
```http
GET {{api_url}}/favorites/1/check
Authorization: Bearer {{access_token}}
```

### 7. Catégories

#### Liste des catégories
```http
GET {{api_url}}/categories
```

#### Détails d'une catégorie
```http
GET {{api_url}}/categories/electronique
```

### 8. Newsletter

#### S'abonner
```http
POST {{api_url}}/newsletter/subscribe
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Se désabonner
```http
GET {{api_url}}/newsletter/unsubscribe/token-abc123
```

#### Liste des abonnés (Admin)
```http
GET {{api_url}}/newsletter/subscribers?page=1&isSubscribed=true
Authorization: Bearer {{access_token}}
```

### 9. Contact

#### Envoyer un message
```http
POST {{api_url}}/contact
Content-Type: application/json

{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "subject": "Question sur un produit",
  "message": "Bonjour, j'aimerais savoir si le produit X est disponible en stock..."
}
```

#### Liste des messages (Admin)
```http
GET {{api_url}}/contact?page=1&status=new
Authorization: Bearer {{access_token}}
```

#### Répondre à un message (Admin)
```http
POST {{api_url}}/contact/1/respond
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "response": "Bonjour, merci pour votre message. Le produit est bien en stock..."
}
```

## 🔒 Codes d'état HTTP

- `200 OK` : Requête réussie
- `201 Created` : Ressource créée
- `400 Bad Request` : Erreur de validation
- `401 Unauthorized` : Non authentifié
- `403 Forbidden` : Accès refusé
- `404 Not Found` : Ressource non trouvée
- `409 Conflict` : Conflit (ex: email déjà utilisé)
- `429 Too Many Requests` : Rate limit dépassé
- `500 Internal Server Error` : Erreur serveur

## 📊 Format des erreurs

```json
{
  "error": "Message d'erreur principal",
  "details": {
    "field1": "Message d'erreur spécifique",
    "field2": "Autre message d'erreur"
  }
}
```

## 🧪 Tests avec Postman

### Collection Tests

Ajoutez ces scripts dans l'onglet "Tests" pour automatiser les vérifications :

```javascript
// Vérifier le status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Vérifier le format JSON
pm.test("Response is JSON", function () {
    pm.response.to.be.json;
});

// Vérifier la présence de champs
pm.test("Response has required fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("user");
    pm.expect(jsonData).to.have.property("accessToken");
});

// Sauvegarder le token
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("access_token", jsonData.accessToken);
}
```

## 🚀 Import dans Postman

1. Ouvrir Postman
2. Cliquer sur "Import"
3. Sélectionner le fichier JSON de collection
4. Créer un environnement avec les variables mentionnées
5. Commencer à tester !

## 📝 Notes

- Les tokens JWT expirent après 1 heure
- Le rate limiting est de 100 requêtes par 15 minutes pour les routes générales
- Les routes d'authentification sont limitées à 5 tentatives par 15 minutes
- Le panier utilise soit l'ID utilisateur (si connecté) soit un ID de session
