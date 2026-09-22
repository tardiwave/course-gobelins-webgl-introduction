import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: "Compositing",

  insight: `Trois effets à l'écran : l'aberration chromatique et le grain des deux étapes
précédentes, plus un bloom. Le compositing, c'est l'art de les enchaîner, et la
vraie question est : **lesquels partagent une passe, lesquels en ont besoin
d'une à eux** ?

## La chaîne

\`\`\`text
scène      → render   pleine résolution
seuil      → bright   demi-résolution
flou  ↔    → first
flou  ↕    → second
composite  → écran    aberration + bloom + grain
\`\`\`

Cinq rendus pour trois effets. Les trois vignettes en bas sont les textures
intermédiaires : **cliquez-en une** pour la voir en grand, cliquez encore pour
revenir.

## Même passe ou passe séparée

Un fragment shader ne voit que **son** pixel du résultat qu'il est en train
d'écrire. Il peut lire n'importe où dans une texture d'entrée, mais jamais le
pixel voisin de ce qu'il calcule lui-même. D'où la règle :

**Même passe** pour un effet qui ne regarde que le pixel courant (grain,
vignettage, courbe de couleur), ou qui lit une entrée déjà rendue à côté du
pixel : l'aberration décale ses trois lectures de \`tScene\`, qui existe déjà.

**Passe séparée** dès qu'un effet a besoin des **voisins du résultat d'un
autre effet**. Le flou vertical doit lire le flou horizontal fini, qui doit
lire le seuil fini : trois passes, impossible à fusionner.

Chaque passe coûte une écriture et une relecture complète de l'image. Les
moteurs rangent donc tout ce qui peut l'être dans une seule passe finale,
qu'on appelle souvent un **uber shader**.

## L'ordre compte

\`\`\`glsl
vec3 color = 1.0 - (1.0 - sharp) * (1.0 - bloom * uAmount);
color += grain * uGrain * window;
\`\`\`

Le grain vient en dernier. Ajouté dans la scène avant le seuil, il serait passé
dans le flou et aurait disparu, lissé. À l'inverse, l'aberration ne s'applique
ici qu'à l'image nette : la lueur est déjà floue, décaler ses canaux de deux
pixels ne se verrait pas.

## Le flou séparable

Un flou gaussien 2D est **séparable** : le faire en travers puis de haut en bas
donne exactement le même résultat qu'en une passe. Le calcul :

\`\`\`text
9 × 9 en une passe  → 81 lectures / pixel
9 puis 9            → 18 lectures / pixel
\`\`\`

Et l'écart grandit avec le carré du rayon. Presque tous les flous que vous
verrez dans un moteur sont en deux passes — c'est rarement expliqué, c'est
toujours fait.

## La demi-résolution

La lueur est floutée de toute façon, donc le détail jeté n'allait pas survivre.
Un quart des pixels, et personne ne le remarque. Un vrai bloom descend
généralement par paliers successifs, chacun deux fois plus petit.

## Le mode screen

\`\`\`glsl
vec3 color = 1.0 - (1.0 - sharp) * (1.0 - bloom * uAmount);
\`\`\`

\`screen\` s'approche du blanc sans jamais y être écrêté, donc la planète garde sa
couleur sous la lueur. Une addition aurait aplati son bord lumineux en une
tache blanche uniforme.

## Ce que la passe de seuil ne fait pas

Elle **soustrait** le seuil au lieu de masquer avec :

\`\`\`glsl
float keep = max(luminance - uThreshold, 0.0)
           / max(luminance, 0.0001);
\`\`\`

Masquer laisserait un contour net en travers de l'image, exactement là où le
seuil tombe, et ce contour grouillerait dès que la scène bouge. Soustraire fait
apparaître la lueur progressivement.

Le \`max(luminance, 0.0001)\` évite une division par zéro sur les pixels noirs —
une NaN ici se propagerait dans tout le flou.`,

  resources: [
    { label: "WebGL Fundamentals — Render to texture", url: "https://webglfundamentals.org/webgl/lessons/webgl-render-to-texture.html" },
    { label: "Learn OpenGL — Bloom", url: "https://learnopengl.com/Advanced-Lighting/Bloom" },
    { label: "Wikipedia — Blend modes", url: "https://en.wikipedia.org/wiki/Blend_modes" },
  ],
}

export default step
