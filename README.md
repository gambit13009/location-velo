LOCATION DE VELO 

Vous devez développer une page de type "Single page Application" simulant la réservation de vélos dans une ville. Ces vélos sont répartis dans de nombreuses stations dans la ville. L'utilisateur doit pouvoir réserver un vélo depuis son navigateur (à condition qu'il reste des vélos disponibles à la station !). La réservation est alors temporairement enregistrée sur le navigateur du visiteur.

Cette application doit notamment, en s'appuyant sur JavaScript, afficher une carte avec la liste des stations de location de vélos disponibles dans la ville. 

Instructions

Diaporama

Vous devez afficher en haut de la page un diaporama de photos et de textes expliquant le fonctionnement de l'application. La logique du diaporama doit être écrite par vos soins. L’utilisation de tout plugin automatisant la logique de l’application est proscrite.

Le diaporama passe automatiquement à la diaporama suivante toutes les 5 secondes. L’utilisateur peut toutefois choisir de mettre le diaporama en pause. Il peut également reculer ou avancer manuellement à l’aide d’un clic de souris, ainsi qu’avec les touches gauche et droite de son clavier.

Carte des vélos

En-dessous du diaporama se trouve une carte affichant en temps réel la liste des stations de location de vélos ainsi que leur disponibilité.  La localisation de toutes les stations de vélos est affichée à l’aide de marqueurs.

La localisation et l'état de chaque station (ouverte, en travaux, combien de vélos et de places sont disponibles, etc.) est fourni via la plateforme OpenData de JC Decaux.

Réservation d'un vélo

Il doit être possible de réserver un vélo disponible à la station sélectionnée en :

- indiquant son nom et son prénom,
- signant dans un champ libre implémenté à l’aide de l’API HTML5 Canvas.

Les données de réservation seront stockées dans le navigateur à l’aide de l’API Web Storage et affichées en dessous du panneau. L'état de la réservation (s’il y en a une) est ainsi affiché, avec un décompte dynamique du temps restant avant expiration de la réservation.

Une réservation expire automatiquement au bout de 20 minutes et également lorsque le navigateur web se referme.

