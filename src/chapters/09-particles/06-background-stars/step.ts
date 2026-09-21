import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Background stars',
  required: true,

  insight: `Les mêmes points qu'à l'étape First points, repoussés beaucoup plus loin — et enfin
dotées d'une forme.

## gl_PointCoord

\`\`\`glsl
vec2 uv = gl_PointCoord * 2.0 - 1.0;
float circle = exp(-length(uv) * 5.0);
\`\`\`

C'est la seule coordonnée qu'un point vous offre gratuitement : 0 à 1 à travers
le sprite, aucun attribut à déclarer, aucun UV à interpoler. Recentrez-la et le
cercle doux du chapitre formes s'y pose tel quel.

Une différence à connaître : \`gl_PointCoord\` a son origine en **haut** à gauche,
contrairement à \`vUv\`. Pour un motif symétrique comme ici ça ne se voit pas ;
pour une texture, il faut inverser y.

## Une constante qui doit changer

Là-bas la décroissance valait 4 et \`uv\` couvrait tout le canvas. Ici elle vaut
5 et \`uv\` couvre quelques pixels. **Une exponentielle n'est jamais plus nette
que la coordonnée qu'on lui donne** : la régler n'est pas un bricolage, c'est
l'échelle de la forme.

## discard et la profondeur

\`\`\`glsl
if (alpha < 0.02) discard;
\`\`\`

\`discard\` abandonne le pixel : rien n'est écrit, ni couleur ni profondeur. Ici
les étoiles sont créées avec \`depthWrite: false\`, donc leurs coins
transparents n'abîment rien et \`discard\` ne fait qu'économiser du mélange.

Il devient indispensable dès qu'un sprite **écrit** la profondeur : ses coins,
invisibles mais présents dans le depth buffer, cachent tout ce qui est dessiné
derrière après lui, et le ciel se couvre de carrés vides.

À savoir quand même : \`discard\` désactive certaines optimisations de profondeur
sur le GPU. Sur un effet plein écran, c'est parfois plus lent que d'écrire un
alpha nul.

## Répartir sur une sphère

\`\`\`ts
const phi = Math.acos(Math.random() * 2 - 1)
\`\`\`

Deux randoms ordinaires pour la longitude et la latitude entassent les étoiles
aux pôles, parce que des pas de latitude égaux couvrent de moins en moins de
sphère à mesure qu'on monte. L'\`acos\` corrige la densité —
[la démonstration est ici](https://mathworld.wolfram.com/SpherePointPicking.html).

Elles tournent aussi vingt-cinq fois moins vite que la ceinture : la parallaxe est
l'essentiel de ce qui indique une distance à l'œil, et ici elle coûte un
nombre.`,

  resources: [
    { label: "Khronos — gl_PointCoord", url: "https://registry.khronos.org/OpenGL-Refpages/gl4/html/gl_PointCoord.xhtml" },
    { label: "Wolfram MathWorld — Sphere point picking", url: "https://mathworld.wolfram.com/SpherePointPicking.html" },
  ],
}

export default step
