import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Smooth circle',
  required: true,

  insight: `Une seule ligne, et elle mérite qu'on s'y arrête :

\`\`\`glsl
float circle = exp(-radius * 4.0);
\`\`\`

## Une forme sans bord

Toutes les formes vues jusqu'ici avaient un bord. \`step\` en donne un net,
\`smoothstep\` un doux, mais les deux **s'arrêtent** : passé le second seuil le
résultat vaut exactement zéro et la forme est finie.

\`exp()\` ne s'arrête jamais. Elle chute vite près du centre puis continue de
descendre, s'approchant de zéro sans jamais y arriver. C'est exactement le
comportement de la lumière autour d'un point brillant, et c'est pour ça qu'un
point flou ne se fabrique pas avec \`smoothstep\`, quels que soient les seuils.

L'étape optionnelle Circle, plus loin dans ce chapitre, dessine la version
disque : comparez les deux.

## Le nombre est tout le design

4.0 est le taux de décroissance. Montez-le et le point se resserre, baissez-le
et il s'étale. Retenez la règle : **une exponentielle n'est jamais plus nette
que la coordonnée qu'on lui donne**. Ici \`uv\` couvre tout l'écran ; quand cette
même formule reviendra sur un sprite de vingt pixels, dans le chapitre
particules, la constante devra être complètement différente pour un résultat
visuellement identique.

## Le recentrage

\`vUv * 2.0 - 1.0\` fait passer de 0..1 à -1..1, pour que \`length()\` mesure depuis
le centre plutôt que depuis le coin. Vous verrez cette ligne en tête de presque
tous les shaders de forme.

La ligne suivante, avec \`uResolution\`, empêche le rond de s'étirer en ovale
sur un écran large. L'étape Aspect ratio explique pourquoi.`,

  resources: [
    { label: "The Book of Shaders — Shaping functions", url: "https://thebookofshaders.com/05/" },
  ],
}

export default step
