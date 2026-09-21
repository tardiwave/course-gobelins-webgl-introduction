import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Noise terrain',
  required: true,

  insight: `## Un argument à relire deux fois

\`\`\`glsl
float height(vec3 p) {
  float h = fbm(p * 1.25 + uTime * 0.05) - 0.05;

  return h > 0.0 ? h * h * 3.0 : h;
}
\`\`\`

C'est \`fbm(position)\`, pas \`fbm(uv)\`. Nourrir le bruit avec la **position**
ancre le relief à la sphère, donc il survit à la rotation au lieu de glisser
dessus. Un bruit en UV se déchirerait aussi sur la couture et se pincerait aux
pôles, exactement comme la texture.

## Deux nombres décident de tout l'aspect

La **fréquence** décide de la taille des continents. 1.25 en donne quelques-uns
de grande taille ; montez à 4 et vous obtenez des confettis.

Le **profil** décide de ce à quoi ressemble la terre. Le \`fbm\` brut est fait de
collines partout, à toutes les altitudes, ce qui donne un chou-fleur. Élever la
partie positive au carré écrase les basses terres et ne laisse dépasser que les
sommets. Remplacez \`h * h * 3.0\` par \`h\` pour voir la différence.

## La même fonction dans les deux shaders

C'est le point le plus important de l'étape, et il ne se devine pas.

\`height.glsl\` est collé devant **les deux** shaders. Le vertex shader appelle
\`height()\` pour **déplacer** la surface ; le fragment shader la rappelle, à
l'identique, pour la **colorer** et l'**éclairer**.

On pourrait croire qu'il suffit de passer la hauteur en varying. Le résultat
serait un trait de côte en marches d'escalier, quel que soit le nombre de
sommets.

La raison : **un varying est interpolé linéairement sur un triangle**. La ligne
de rivage, elle, est plus fine qu'un triangle. Le seuil tombe donc au milieu
d'un triangle, l'interpolation le rend rectiligne, et les triangles voisins
forment un zigzag aligné sur la grille de la sphère.

Recalculer par pixel coûte des évaluations de bruit par pixel, et rend le
rendu **indépendant du maillage**. 128 segments — 8 400 sommets — suffisent :
le maillage ne porte plus que la silhouette.

La règle générale : si une grandeur varie plus vite qu'un triangle, elle ne
doit pas voyager en varying.

## Reconstruire les normales

Il n'y a **aucun attribut à corriger** : le terrain n'existe pas tant que le
shader n'a pas tourné, donc personne n'a pu calculer les bonnes normales à
l'avance. On mesure la pente de la surface elle-même, un petit pas vers l'est
et un petit pas vers le nord :

\`\`\`glsl
float here = lift(n);
float slopeEast = (lift(normalize(n + east * step)) - here) / step;
float slopeNorth = (lift(normalize(n + north * step)) - here) / step;

vec3 tilt = vTangent * slopeEast + vBitangent * slopeNorth;
vec3 normal = normalize(normalize(vNormal) - tilt);
\`\`\`

Plus le sol monte vers l'est, plus la normale penche vers l'ouest. C'est pour
ça que la hauteur est une fonction : il faut pouvoir l'appeler trois fois.

Et la règle du varying s'applique aussi ici. Calculée par sommet puis
interpolée, cette normale dessine des carrés dans les ombres, parce que le
relief est plus fin qu'un triangle. Calculée par pixel, elle est lisse.

## Un piège de précision

Le fragment shader déclare \`uniform highp float uTime;\`, explicitement.

\`palette.glsl\` est collé devant lui et fixe la précision par défaut à
\`mediump\`, alors que le vertex shader garde son défaut de \`highp\`. Un uniform
dont la précision diffère entre les deux étages **refuse de linker**, avec un
message qui ne dit pas d'où il vient. C'est la rançon du \`#include\` par
concaténation.

Tirez le curseur de relief : les montagnes montent, la mer ne bouge pas —
\`lift()\` ne soulève que ce qui dépasse zéro.`,

  resources: [
    { label: "Inigo Quilez — fBm", url: "https://iquilezles.org/articles/fbm/" },
    { label: "Inigo Quilez — Normals for an SDF", url: "https://iquilezles.org/articles/normalsSDF/" },
    { label: "The Book of Shaders — Fractal Brownian Motion", url: "https://thebookofshaders.com/13/" },
  ],
}

export default step
