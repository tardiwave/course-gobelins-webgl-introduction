import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Looping band',
  required: true,

  insight: `## Un shader n'a pas de mémoire

Il ne sait rien de la frame précédente, ne stocke rien, et recommence de zéro
deux millions de fois par image. L'animation n'existe que parce que le
JavaScript lui envoie un \`uTime\` frais à chaque frame :

\`\`\`ts
program.uniforms.uTime.value = time
\`\`\`

C'est la contrainte la plus structurante du cours. Tout mouvement doit
s'exprimer comme une **fonction du temps**, jamais comme un état qu'on
incrémente. On y reviendra au chapitre particules, où elle devient un avantage.

## fract fait la boucle

\`fract(uTime * 0.25)\` transforme un nombre qui grandit sans fin en une rampe
propre de 0 à 1 qui se répète. C'est la même fonction qu'à l'étape Grid, ici
appliquée au temps plutôt qu'à l'espace.

## Les marges, et pourquoi elles sont là

\`\`\`glsl
float width = 0.06;
float position = mix(-width, 1.0 + width, trip);
\`\`\`

Si la bande allait de 0 à 1, elle se téléporterait : au moment où \`fract\`
revient à zéro, sa moitié droite est encore visible à l'écran. En partant juste
hors du cadre à gauche et en finissant juste hors du cadre à droite, elle a le
temps de sortir complètement avant de revenir.

Ce genre de détail ne se voit pas dans le code, seulement à l'œil, et c'est
typiquement ce qui sépare une animation qui « marche » d'une animation propre.

## La précision du temps

\`uTime\` est déclaré sans précision, donc il hérite du \`mediump\` de
\`palette.glsl\`. Sur un ordinateur ça ne change rien : les GPU de bureau
calculent tout en 32 bits. Sur beaucoup de téléphones, \`mediump\` est un vrai
flottant 16 bits, avec à peine trois chiffres significatifs : passé une
minute, \`uTime\` avance par paliers et l'animation saccade.

Deux remèdes : déclarer \`uniform highp float uTime;\`, comme le fera le chapitre
vertex shaders, ou envoyer un temps qui reste petit — \`time % 60\` pour une
boucle de quatre secondes, qui se répète de toute façon.`,

  resources: [
    { label: "The Book of Shaders — Shaping functions", url: "https://thebookofshaders.com/05/" },
  ],
}

export default step
