import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Fullscreen triangle',
  required: true,

  insight: `## Pourquoi un triangle et pas un rectangle

Tout le monde s'attend à un quad. Un triangle assez grand pour déborder de
l'écran fait le même travail avec trois sommets, et surtout il n'a pas de
diagonale au milieu. Le GPU colorie les pixels par blocs de 2×2 : le long de la
diagonale d'un quad, chaque bloc à cheval est calculé une fois par triangle,
donc deux fois. C'est pour ça que le triangle plein écran est la convention
des moteurs.

Ses coins sont hors du cadre, donc vous ne les verrez jamais.

## Les deux shaders

Le vertex shader tourne une fois par sommet — trois fois ici — et doit remplir
\`gl_Position\`. Le fragment shader tourne une fois par pixel couvert et doit
remplir \`gl_FragColor\`. Il n'y a pas d'étape intermédiaire que vous contrôlez.

Entre les deux, un \`varying\` est interpolé automatiquement :

\`\`\`glsl
// vertex
varying vec2 vUv;
void main() {
  vUv = uv;                    // écrit 3 fois
  gl_Position = vec4(position, 0.0, 1.0);
}
\`\`\`

Trois sommets portent une valeur, et le GPU en fabrique un dégradé continu pour
les deux millions de pixels entre eux. C'est gratuit et c'est le mécanisme qui
fait marcher à peu près tout le reste du cours.

## Ce que personne ne vous dit

\`position\` est déjà en **clip space** : -1 à gauche, +1 à droite. Aucune matrice
n'intervient tant qu'il n'y a pas de caméra.

Et \`vUv\` a son origine en bas à gauche, à l'inverse du DOM. Afficher les UV en
rouge/vert comme ici est le premier réflexe de debug en WebGL : si l'image
n'est pas un dégradé propre, le problème est en amont.

[WebGL Fundamentals — How it works](https://webglfundamentals.org/webgl/lessons/webgl-how-it-works.html)
détaille le pipeline étape par étape.`,

  resources: [
    { label: "WebGL Fundamentals — How it works", url: "https://webglfundamentals.org/webgl/lessons/webgl-how-it-works.html" },
    { label: "The Book of Shaders — Hello world", url: "https://thebookofshaders.com/02/" },
  ],
}

export default step
