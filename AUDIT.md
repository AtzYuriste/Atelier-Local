# Audit AtelierLocal

## Binôme et environnement

- Membres : _à voir sur Discord_
- Navigateur et version : Opera One(version : 137.0.6036.63)

## Problème 1 - Parcours des détails d’un atelier

### Problème identifié

- Le bouton (c'est pas un bouton) `Détails de l’atelier` pour afficher les détails de l'atelier :
  - n'est pas sélectionnable au clavier ;
  - le lecteur d'écran n'a aucune indication de son rôle ni de son état ;
  - ne donne pas non plus l'information de l'atelier au lecteur d'écran
- Lorsque les détails sont repliés, le lien `Consulter les informations pratiques` reste sélectionnable via un parcours au clavier

#### Impact

- Pour une personne naviguant au clavier : impossibilité d’ouvrir ou de fermer les détails, et perte du focus à cause de la sélection d'un élément masqué
- Pour un utilisateur de lecteur d'écran : aucune information sur le rôle ou l'état du bouton ni le contexte sur l'atelier concerné

### Reproduction

- Ouvrir la page dans un nouvel onglet pour être au neuf
- Sélectionner la barre de recherche des ateliers de la page et parcourir la carte d’un atelier avec la touche `Tab`
- Le focus passe au-dessus de `Détails de l’atelier` sans s'y arrêter
- Le focus atteint directement le lien hypertexte `Consulter les informations pratiques` qui est masqué par défaut

### Comportement attendu

- Pouvoir sélectionner le bouton `Détails de l’atelier` avec la touche `Tab`, l’activer avec les touches `Entrée` ou `Espace`
- Pouvoir entendre son rôle, son état et l'atelier concerné
- Ignorer le lien hypertexte `Consulter les informations pratiques` avec la navigation par clavier lorsque les `Détails de l’atelier` ne sont pas affichés

### Correction à apporter

- Remplacer la zone cliquable `<div>` de `details-trigger` par un bouton `<button>`
  - Y ajouter `type="button"` pour indiquer le rôle de bouton ;
  - Y ajouter `aria-expanded={expanded}` pour indiquer si les détails sont affichés ou masqués ; 
  - Y ajouter ``aria-controls={`details-${workshop.id}`}`` pour informer de l'identifiant du conteneur ;
  - Y ajouter `aria-label={`Détails de l’atelier ${workshop.title}`}` pour indiquer l'atelier concerné
- Ajouter `hidden={!expanded}` sur le conteneur `details-panel` pour réellement retirer les détails, s'ils sont masqués
  - Y ajouter ``id={`details-${workshop.id}`}`` pour donner un identifiant au conteneur, utilisé par `aria-controls`

#### Résultat de la vérification

- Le bouton `Détails de l’atelier` est sélectionnable via un parcours au clavier
- Il peut être activer avec `Entrée` ou `Espace`
- Il transmet dynamiquement son rôle, son état et l'information de l'atelier au lecteur d'écran
- La touche `Tab` saute le lien `Consulter les informations pratiques` si les détails sont masqués

---

## Problème 2 - Focus invisible sur le bouton d'inscription

### Problème identifié

- Le bouton `M’inscrire à ...` d'un atelier ne montre aucun indicateur visuel lorsqu'il reçoit le focus :
  - la règle `.reserve-button:focus-visible` retire le contour avec `outline: none` et `box-shadow: none` ;
  - elle écrase le style de focus global défini pour tous les boutons de la page

#### Impact

- Pour une personne naviguant au clavier : impossibilité de savoir que le focus est sur le bouton `M’inscrire à ...`, avec un risque de perdre sa position dans la page ou d'activer un bouton sans le savoir

### Reproduction

- Ouvrir la page dans un nouvel onglet pour être au neuf
- Sélectionner la barre de recherche des ateliers de la page et parcourir la carte d’un atelier ouvert aux inscriptions avec la touche `Tab`
- Le rectangle de focus est visible sur `Détails de l’atelier`, puis disparaît en arrivant sur le bouton `M’inscrire à ...`
- Le focus réapparaît seulement sur l'élément suivant

### Comportement attendu

- Voir clairement le rectangle de focus sur le bouton `M’inscrire à ...` lors d'un parcours au clavier, comme sur les autres boutons de la page

### Correction à apporter

- Retirer la règle `.reserve-button:focus-visible` de `src/styles.css`
  - Le bouton reprend ainsi le style de focus global `button:focus-visible`

#### Résultat de la vérification

- Le rectangle de focus s'affiche autour du bouton `M’inscrire à ...` lors d'un parcours au clavier avec la touche `Tab`
- Le style du focus est identique à celui des autres boutons de la page

---

## Problème 3 - Absence d'étiquetage accessible sur le champ de recherche

### Problème identifié

- Le champ de recherche d'ateliers ne dispose d'aucune étiquette accessible :
  - le texte `Rechercher un atelier` utilise un simple paragraphe `<p class="search-label">` ;
  - le lecteur d'écran annonce le champ comme une simple zone de saisie sans indiquer son nom accessible ni sa fonction ;
  - le texte d'aide `Saisissez un titre ou une ville.` n'est pas associé au champ via `aria-describedby` ;
  - un clic sur l'intitulé textuel ne transfère pas le focus dans le champ de recherche

#### Impact

- Pour un utilisateur de lecteur d'écran : impossibilité d'identifier la fonction du champ d'entrer lors du parcours et perte de l'information d'aide sur les critères de recherche
- Pour une personne naviguant à la souris : perte du comportement standard où le clic sur l'intitulé active le champ

### Reproduction

- Ouvrir la page dans un nouvel onglet pour être au neuf
- Activer un lecteur d'écran et atteindre le champ de recherche avec la touche `Tab`
- Le lecteur d'écran vocalise uniquement le rôle sans annoncer ni l'intitulé du champ de recherche, ni le texte d'aide
- Cliquer à la souris sur l'intitulé ne donne pas le focus au champ de saisie

### Comportement attendu

- Associer le champ à son étiquette afin que le lecteur d'écran annonce l'intitulé du champ de recherche lors de sa sélection 
- Lier le texte d'aide comme description accessible afin qu'il soit vocalisé à la prise de focus
- Permettre d'activer et de donner le focus au champ en cliquant sur son libellé

### Correction à apporter

- Remplacer `<p className="search-label">` par `<label className="search-label" htmlFor="workshop-search">` dans `src/App.tsx` pour lier le libellé au champ via son `id`
- Ajouter `id="search-help"` sur le paragraphe `<p className="search-help">`
- Ajouter `aria-describedby="search-help"` sur l'élément `<input>` du champ de recherche pour associer la description d'aide

#### Résultat de la vérification

- Le lecteur d'écran annonce le libellé du champ de recherche et son texte d'aide lors de la prise de focus
- Cliquer sur le libellé transfère immédiatement le focus dans le champ de recherche

---

## Problème 4 - Alternative textuelle manquante sur l'image d'un atelier

### Problème identifié

- L'image de la carte de l'atelier `serigraphie` n'a pas d'attribut `alt` :
  - le lecteur d'écran n'a aucune alternative textuelle et annonce à la place le nom du fichier ou l'URL de l'image ;
  - les images des autres ateliers ont `alt=""` : elles sont ignorées par le lecteur d'écran, donc le traitement des images est incohérent d'une carte à l'autre

#### Impact

- Pour un utilisateur de lecteur d'écran : information parasite (nom de fichier) pour l'atelier `serigraphie`, et aucune information sur l'image pour les autres ateliers

### Reproduction

- Activer un lecteur d'écran et parcourir les cartes d'ateliers avec les touches de lecture
- Sur la carte `serigraphie`, l'image est annoncée avec son nom de fichier
- Sur les autres cartes, l'image n'est pas annoncée

### Comportement attendu

- Chaque image d'atelier possède un attribut `alt` et est traitée de la même façon par le lecteur d'écran

### Correction à apporter

- Supprimer la condition sur `workshop.id === "serigraphie"` dans `WorkshopCard.tsx` et afficher la même balise `<img>` pour tous les ateliers
  - Y ajouter ``alt={`Icone de ${workshop.id}`}`` pour donner une alternative textuelle à chaque image

#### Résultat de la vérification

- Le lecteur d'écran n'annonce plus de nom de fichier pour l'atelier `serigraphie`
- Toutes les images d'atelier ont une alternative textuelle identique dans sa forme

---

# Problème 5

### Problème identifié

#### Impact

### Reproduction

### Comportement attendu

### Correction à apporter

#### Résultat de la vérification

---

# Problème 6

### Problème identifié

#### Impact

### Reproduction

### Comportement attendu

### Correction à apporter

#### Résultat de la vérification
