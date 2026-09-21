import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Blue gradient',
  required: true,

  insight: `## mix, la fonction que vous utiliserez le plus

\`mix(a, b, t)\` est une interpolation linéaire : \`a\` quand \`t\` vaut 0, \`b\` quand
il vaut 1, et le mélange proportionnel entre les deux.

\`\`\`glsl
vec3 color = mix(NIGHT, BLUE, vUv.x);
\`\`\`

Elle accepte des flottants, des vecteurs ou des couleurs, et elle ne borne
rien : passez-lui \`t = 2.0\` et elle extrapole au-delà de \`b\`. Si vous ne voulez
pas de ça, encadrez avec \`clamp(t, 0.0, 1.0)\`.

## Les couleurs

\`NIGHT\` et \`BLUE\` ne sont pas des mots-clés GLSL : ce sont des constantes
définies dans \`src/shaders/chunks/palette.glsl\`, qui est collé devant chaque shader du
cours. GLSL n'a pas de \`#include\`, donc « importer » un fichier veut dire
concaténer deux chaînes de caractères en JavaScript.

Ce fichier commence aussi par \`precision mediump float;\`. Un fragment shader
WebGL 1 **n'a pas de précision par défaut** pour les flottants : sans cette
ligne, il refuse de compiler. Le vertex shader, lui, est en \`highp\` par
défaut — une différence qui reviendra mordre au chapitre vertex shaders.

[The Book of Shaders — Colors](https://thebookofshaders.com/06/) va plus loin
sur les espaces de couleur.`,

  resources: [
    { label: "The Book of Shaders — Colors", url: "https://thebookofshaders.com/06/" },
  ],
}

export default step
