import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Pixelate a texture',
  required: true,

  insight: `## On n'arrondit pas l'image, on arrondit les coordonnées

\`\`\`glsl
float size = 70.0;
vec2 cells = vec2(size * uResolution.x / uResolution.y, size);
vec2 snapped = (floor(vUv * cells) + 0.5) / cells;
\`\`\`

\`floor\` colle chaque UV dans sa cellule, donc tout un bloc de pixels écran finit
par lire le même endroit de l'image. Celle-ci n'est jamais modifiée, rien n'est
renvoyé au GPU, et changer \`size\` coûte exactement zéro.

C'est le motif général : en shader, déformer une image se fait presque toujours
en déformant la coordonnée de lecture, pas le résultat.

## Des carrés à l'écran, pas dans l'image

La grille est posée sur \`vUv\`, l'écran, et non sur les coordonnées de la
carte. La carte est deux fois plus large que haute et \`cover()\` ne met pas ses
deux axes à la même échelle : une grille régulière en coordonnées de texture
donnerait des blocs rectangulaires. On arrondit donc à l'écran, avec le ratio
de l'étape Aspect ratio, et on ne passe par \`cover()\` qu'ensuite.

## Le + 0.5, et pourquoi il n'est pas décoratif

\`floor(vUv * cells) / cells\` vise le **coin** de la cellule. Chaque bloc prend donc
la couleur de l'image exactement là où il commence — et un bloc à cheval sur
une côte hérite de la couleur de la frontière, c'est-à-dire d'un mélange de
terre et de mer qui n'existe nulle part dans la carte.

Le résultat se voit surtout là où le contraste est fort : sans le \`+ 0.5\`, la
bordure des banquises se couvre de blocs bleu pâle sortis de nulle part. Ajouter
un demi-cellule vise le **centre** du bloc, qui est une couleur représentative
de ce qu'il recouvre.

## Deux endroits peuvent pixeliser, il faut savoir lequel agit

Le filtrage de la texture — \`NEAREST\` ou \`LINEAR\` — décide de ce qui se passe
**entre** deux texels. Votre arrondi décide de **quel** texel est lu.

\`src/utils/texture.ts\` charge tout en \`LINEAR\` sans mipmaps, précisément pour
que ce que vous voyez vienne toujours de votre code. Si la source était déjà
pixelisée par le filtrage, vous perdriez un temps fou à chercher pourquoi votre
\`floor\` ne sert à rien.

Notez d'ailleurs que \`LINEAR\` reste actif ici : la coordonnée arrondie tombe
presque toujours entre deux texels, donc chaque bloc est en réalité un mélange
de ses voisins immédiats. Avec \`NEAREST\` vous liriez un texel et un seul —
c'est le bon choix pour du pixel art, et le mauvais pour une photo.`,

  resources: [
    { label: "WebGL Fundamentals — Textures", url: "https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html" },
  ],
}

export default step
