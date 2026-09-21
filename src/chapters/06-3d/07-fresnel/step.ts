import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Fresnel',

  insight: `Regardez n'importe quelle surface brillante sous un angle rasant — une table,
un lac, un écran de téléphone. Elle réfléchit bien plus que de face. C'est
l'[effet Fresnel](https://fr.wikipedia.org/wiki/Coefficient_de_Fresnel), et
c'est l'essentiel de ce qui empêche une sphère rendue de ressembler à une
balle en plastique.

## Encore un produit scalaire

\`\`\`glsl
float facing = max(dot(surface, viewDir), 0.0);
float fresnel = pow(1.0 - facing, uRim);
\`\`\`

Cette fois entre la normale et la direction qui revient vers la caméra. De face
\`dot\` vaut 1, à la silhouette 0, donc \`1.0 - dot\` est un liseré. \`pow\` décide de
sa finesse : tirez le curseur et regardez-le se resserrer.

L'exposant vient de l'[approximation de
Schlick](https://en.wikipedia.org/wiki/Schlick%27s_approximation), la formule
du rendu physique, qui utilise une puissance 5. On descend ici à 3 pour un
liseré plus large : c'est un choix de style, pas de physique.

## La direction de vue change à chaque point

\`\`\`glsl
vView = normalize(cameraPosition - world.xyz);
\`\`\`

Il faut la position monde du sommet, donc \`modelMatrix * position\`, et non la
position locale. Et \`cameraPosition\` est un uniform qu'OGL fournit
automatiquement — ce n'est pas un mot-clé GLSL, c'est une convention du moteur.
Dans three.js elle existe aussi ; ailleurs, il faut la passer soi-même.

## Deux détails qui décident de tout

Il utilise la normale **géométrique**, pas celle de la normal map. La
silhouette est une propriété de la sphère ; laisser la texture la faire
trembler fait grouiller le liseré sur les continents.

Et il est **ajouté**, pas mélangé, puis multiplié par la lumière. Mélanger
remplacerait la couleur du sol par de la peinture bleue ; sans le terme de
lumière, la face nuit brillerait — une planète éclairée par-derrière par rien.`,

  resources: [
    { label: "Wikipedia — Fresnel equations", url: "https://en.wikipedia.org/wiki/Fresnel_equations" },
    { label: "Wikipedia — Schlick's approximation", url: "https://en.wikipedia.org/wiki/Schlick%27s_approximation" },
  ],
}

export default step
