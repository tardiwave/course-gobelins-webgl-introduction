import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Pixelate with the mouse',

  insight: `Le chapitre mouvement pixelisait une image plate autour du curseur. Sur une
sphère, ça pose une question qui n'existait pas avant : **le curseur est sur
l'écran, la texture est sur un objet. À qui appartient l'effet ?**

## Espace écran ou espace objet

Le faire en espace écran en ferait un post-effet : une loupe tenue devant la
planète, qui ne bougerait pas quand vous tournez autour. Ici l'effet appartient
à la planète. On tire un rayon depuis la caméra à travers le curseur, on
demande où il touche le mesh, et on masque autour de **ce** point.

Lâchez et faites tourner : la tache pixelisée reste sur le même continent.

\`\`\`ts
raycast.castMouse(camera, pointer)
const [hit] = raycast.intersectMeshes([mesh])
if (hit?.hit?.localPoint) {
  target.copy(hit.hit.localPoint).normalize()
}
\`\`\`

## Pourquoi comparer des directions et pas des UV

\`Raycast\` rend le point d'impact dans l'espace **propre** du mesh, et c'est
celui que le shader peut comparer. La comparaison se fait donc entre deux
directions sur la sphère :

\`\`\`glsl
float d = length(normalize(vLocal) - uPoint);
\`\`\`

Ça évite les deux pièges d'une carte UV, tous deux visibles dès la première
étape de ce chapitre : la couture dans le dos, où \`u\` saute de 1 à 0, et le
pincement aux pôles, où un même écart en UV correspond à une distance réelle
minuscule. Un masque calculé en UV se déchire à la couture et s'étire aux
pôles.

**La règle générale** : quand vous devez mesurer une distance sur une surface,
faites-le dans un espace continu, pas dans l'espace de texture.

## Une grille à la mesure de la carte

\`\`\`glsl
vec2 cells = vec2(size * 2.0, size);
\`\`\`

Deux fois plus de cellules en largeur qu'en hauteur : la carte fait 360° autour
de l'équateur et 180° d'un pôle à l'autre, donc une grille régulière en UV
donnerait à l'équateur des blocs deux fois plus larges que hauts. Ils restent
étirés vers les pôles — c'est la projection qui veut ça, pas le code.`,

  resources: [
    { label: "OGL — Raycast source", url: "https://github.com/oframe/ogl/blob/master/src/extras/Raycast.js" },
    { label: "WebGL Fundamentals — Picking", url: "https://webglfundamentals.org/webgl/lessons/webgl-picking.html" },
  ],
}

export default step
