import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Tile a texture',

  insight: `## Dépasser 1.0 n'est pas une erreur

\`\`\`glsl
vec2 uv = vUv * uRepeat;
float n = texture2D(tMap, uv).r;
\`\`\`

Ce qui se passe au-delà de 1 a été décidé **au chargement**, pas ici, par le
mode de bouclage : \`REPEAT\` recommence l'image, \`CLAMP_TO_EDGE\` étire la
dernière rangée de pixels à l'infini. C'est le matériel qui boucle, donc aucun
\`fract()\` n'est nécessaire.

Un \`fract()\` donnerait ici le même résultat, mais il devient nuisible dès que
la texture a des mipmaps : le GPU choisit le niveau de mipmap d'après l'écart
de coordonnées entre pixels voisins, et cet écart explose là où \`fract\` saute
de 1 à 0. Une ligne d'un pixel apparaît alors sur chaque couture.

## Une texture qui se répète a été fabriquée pour

Activez \`borders\` : les traits marquent l'endroit exact où une copie s'arrête
et où la suivante commence. Aucune tache du bruit ne s'interrompt dessus. Ce
n'est pas de la chance, c'est la définition d'une texture *seamless* : son bord
droit prolonge son bord gauche, son bord haut prolonge son bord bas.

Essayez la même chose avec \`earth.png\` et le raccord entre le haut et le bas saute aux yeux :
il n'y a aucune raison pour que le pôle Nord ressemble au pôle Sud. C'est pour
ça que \`src/utils/texture.ts\` sépare les deux axes :

\`\`\`ts
// longitude : boucle. latitude : surtout pas.
wrapS: gl.REPEAT,
wrapT: tile ? gl.REPEAT : gl.CLAMP_TO_EDGE,
\`\`\`

## Garder les carreaux carrés

\`vUv\` va de 0 à 1 dans les deux sens, y compris sur un écran large : multiplier
les deux axes par le même nombre donne des carreaux étirés. Il faut compenser
avec le ratio du canvas, donc afficher **plus** de copies horizontalement, pas
des copies plus larges :

\`\`\`glsl
vec2 uv = vUv * uRepeat * vec2(uResolution.x / uResolution.y, 1.0);
\`\`\`

## La contrainte que vous allez rencontrer

En WebGL 1, \`REPEAT\` n'est autorisé que sur les textures dont les deux
dimensions sont des **puissances de deux** — ce bruit fait 256 × 256. En
WebGL brut, une image 500 × 300 en \`REPEAT\` s'affiche en noir, avec un simple
avertissement dans la console.

OGL fait pire, parce que c'est silencieux : il remplace \`REPEAT\` par
\`CLAMP_TO_EDGE\` sans rien dire, et votre texture s'étire au lieu de se
répéter. C'est l'un des pièges les plus courants du
[chargement de textures](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL).`,

  resources: [
    { label: "WebGL Fundamentals — Textures", url: "https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html" },
  ],
}

export default step
