# Audit AtelierLocal

## Binôme et environnement

- Membres : _à voir sur Discord_
- Navigateur et version : Opera One(version : 137.0.6036.63)

## Problème 1 - Parcours des détails d’un atelier

### Problème identifié

- Le bouton (c'est pas un bouton) `Détails de l’atelier` pour afficher les détails de l'atelier :
  - n'est pas sélectionnable au clavier ;
  - le lecteur d'écran n'a aucune indication de son rôle ni de son état ;
  - ne donne pas non plus l'information de l'atelier au lecteur d'écran ;
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
  - Y ajouter `type="button"` pour indiquer le rôle de bouton
  - Y ajouter `aria-expanded={expanded}` pour indiquer si les détails sont affichés ou masqués
  - Y ajouter ``aria-controls={`details-${workshop.id}`}`` pour informer de l'identifiant du conteneur
  - Y ajouter `aria-label={`Détails de l’atelier ${workshop.title}`}` pour indiquer l'atelier concerné
- Ajouter `hidden={!expanded}` sur le conteneur `details-panel` pour réellement retirer les détails, s'ils sont masqués
  - Y ajouter ``id={`details-${workshop.id}`}`` pour donner un identifiant au conteneur, utilisé par `aria-controls`

#### Résultat de la vérification

- Le bouton `Détails de l’atelier` est sélectionnable via un parcours au clavier
- Il peut être activer avec `Entrée` ou `Espace`
- Il transmet dynamiquement son rôle, son état et l'information de l'atelier au lecteur d'écran.
- La touche `Tab` saute le lien `Consulter les informations pratiques` si les détails sont masqués.

---

## Problème 2 - Focus invisible sur le bouton d'inscription

### Problème identifié

- Le bouton `M’inscrire à ...` d'un atelier ne montre aucun indicateur visuel lorsqu'il reçoit le focus :
  - la règle `.reserve-button:focus-visible` retire le contour avec `outline: none` et `box-shadow: none` ;
  - elle écrase le style de focus global défini pour tous les boutons de la page ;

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
  - Le bouton reprend ainsi le style de focus global `button:focus-visible` (`outline: 3px solid #4338a8` et `outline-offset: 4px`)

#### Résultat de la vérification

- Le rectangle de focus s'affiche autour du bouton `M’inscrire à ...` lors d'un parcours au clavier avec la touche `Tab`
- Le style du focus est identique à celui des autres boutons de la page

---

## Problème 3

### Problème identifié

#### Impact

### Reproduction

### Comportement attendu

### Correction à apporter

#### Résultat de la vérification

---

# Problème 4

### Problème identifié

#### Impact

### Reproduction

### Comportement attendu

### Correction à apporter

#### Résultat de la vérification

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
