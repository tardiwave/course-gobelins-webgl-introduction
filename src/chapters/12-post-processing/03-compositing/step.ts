import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: "Compositing",

  insight: `Un effet, une passe : c'était vrai jusqu'ici. Le compositing, c'est quand une
image est construite à partir de plusieurs versions d'elle-même.

## La chaîne

Cinq rendus. La scène atterrit dans une texture. Une passe en extrait tout ce
qui dépasse un seuil. Deux autres floutent ça en travers puis de haut en bas.
La dernière lit le rendu d'origine **et** les deux textures intermédiaires.

Les trois vignettes en bas sont ces textures : **cliquez-en une** pour la voir
en grand, cliquez encore pour revenir. Une vignette de deux centimètres ne
suffit pas à juger un seuil.

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
