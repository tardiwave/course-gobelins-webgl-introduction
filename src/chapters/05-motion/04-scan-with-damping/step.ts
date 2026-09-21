import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Scan with damping',

  insight: `Le shader n'a pas changé d'une instruction. Tout ce qui a
changé tient en trois lignes de JavaScript.

## L'amortissement exponentiel

\`\`\`ts
current.x += (target.x - current.x) * 0.06
current.y += (target.y - current.y) * 0.06
\`\`\`

Au lieu d'envoyer le curseur, on envoie une valeur qui lui court après et
n'arrive jamais tout à fait. Un seizième de l'écart restant par frame : plus
elle est en retard, plus elle rattrape vite, donc elle démarre et s'arrête en
douceur sans qu'on ait écrit la moindre courbe d'easing.

C'est la ligne la plus réutilisée de tout le graphisme interactif. Presque rien
ne devrait être branché sur une entrée brute : une valeur qui traîne donne du
poids, masque les tremblements du capteur, et transforme une téléportation en
mouvement.

## Le défaut que personne ne corrige

Ce lissage dépend du nombre de frames, pas du temps. Sur un écran 144 Hz il
converge plus de deux fois plus vite que sur un 60 Hz, donc votre animation n'a pas la
même sensation selon la machine. La version correcte :

\`\`\`ts
const t = 1 - Math.exp(-3.7 * delta)
current.x += (target.x - current.x) * t
\`\`\`

\`delta\` est le temps écoulé depuis la frame précédente, en secondes : la
différence entre deux \`now\` successifs que \`requestAnimationFrame\` passe à
votre fonction. Le 3.7 redonne exactement le 0.06 par frame à 60 Hz. On garde la
version simple ici parce qu'elle est plus lisible, mais sachez que la vraie
existe — et qu'en production, c'est celle-là.

## Jouer avec

Baissez le 0.06 pour quelque chose de plus lourd, montez-le vers 1 et vous
retombez exactement sur l'étape précédente.`,

  resources: [
    { label: "Rory Driscoll — Frame rate independent damping", url: "https://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/" },
  ],
}

export default step
