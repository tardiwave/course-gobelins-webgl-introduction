import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Velocity stretch',

  insight: `## La vitesse était déjà là

\`\`\`ts
const x = damp(current.x, target.x, 5, delta)
const y = damp(current.y, target.y, 5, delta)

velocity.set((x - current.x) / delta, (y - current.y) / delta)
current.set(x, y)
\`\`\`

La distance parcourue pendant la frame, divisée par sa durée, **est** la
vitesse. Pas de dérivée, pas d'historique : c'est la différence qu'il fallait de
toute façon calculer pour l'amortissement. Diviser par \`delta\` la rend
indépendante de l'écran : sans ça, la même trajectoire donnerait une vitesse
deux fois plus faible sur un écran 120 Hz.

C'est un bon exemple d'une habitude qui paie : quand une grandeur vous manque,
regardez d'abord si elle n'est pas déjà un sous-produit de ce que vous faites.

## Déformer l'espace, pas la forme

Le shader ne déforme jamais le cercle. Il écrase l'espace dans lequel le cercle
est mesuré :

\`\`\`glsl
offset -= direction
  * dot(offset, direction)
  * min(speed, 0.8);
\`\`\`

\`dot(offset, direction)\` est la projection du décalage sur l'axe du mouvement.
En la retranchant, on rapproche les points situés dans cette direction, donc le
masque les attrape de plus loin : le rond s'allonge.

Penser « je transforme la coordonnée » plutôt que « je transforme la forme »
est le réflexe qui permet d'écrire des effets sans jamais toucher à la
géométrie.

## Le min

\`min(speed, 0.8)\` est un garde-fou. Sans lui, un geste très rapide écrase
complètement l'axe et le masque devient une ligne infinie. Chaque fois qu'une
entrée utilisateur entre dans une formule, demandez-vous ce qui se passe
quand elle est énorme.`,

}

export default step
