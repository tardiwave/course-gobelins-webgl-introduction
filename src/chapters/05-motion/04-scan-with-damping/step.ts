import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Scan with damping',

  insight: `Le shader n'a pas changé d'une instruction. Tout ce qui a
changé tient en quelques lignes de JavaScript.

## L'amortissement exponentiel

L'idée tient en une ligne :

\`\`\`ts
current.x += (target.x - current.x) * 0.06
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

Écrite comme ça, elle dépend du nombre de frames, pas du temps. Sur un écran
144 Hz elle converge plus de deux fois plus vite que sur un 60 Hz : votre
animation n'a pas la même sensation selon la machine. Le code de l'étape
utilise donc la version correcte, rangée dans \`src/utils/maths.ts\` pour
servir dans tout le cours :

\`\`\`ts
export function lerp(from, to, t) {
  return from + (to - from) * t
}

export function damp(current, target, speed, delta) {
  return lerp(current, target, 1 - Math.exp(-speed * delta))
}

const delta = Math.min(Math.max(now - previous, 0), 33) / 1000
previous = now

current.x = damp(current.x, target.x, 3.7, delta)
\`\`\`

\`delta\` est le temps écoulé depuis la frame précédente, en secondes : la
différence entre deux \`now\` successifs que \`requestAnimationFrame\` passe à
votre fonction. Le 3.7 redonne exactement le 0.06 par frame à 60 Hz
(\`-ln(0.94) × 60\`).

Deux bornes, deux pièges. Le premier \`now\` peut être légèrement **antérieur**
au \`performance.now()\` lu juste avant, d'où le \`Math.max(…, 0)\`. Et un
onglet resté en arrière-plan revient avec plusieurs secondes d'écart : sans le
plafond de 33 ms, tout sauterait d'un coup.

Multiplier par \`delta * 60\` au lieu de passer par l'exponentielle est l'erreur
classique : c'est juste à 60 Hz et faux partout ailleurs.

## Jouer avec

Baissez le 3.7 pour quelque chose de plus lourd, montez-le vers 300 et vous
retombez pratiquement sur l'étape précédente.`,

  resources: [
    { label: "Rory Driscoll — Frame rate independent damping", url: "https://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/" },
  ],
}

export default step
