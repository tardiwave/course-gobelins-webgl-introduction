import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Merging spheres',

  insight: `Pas de géométrie. Pas de buffer de sommets, pas de normales, pas d'UV : le
triangle plein écran du premier chapitre et **une seule fonction** qui répond,
pour n'importe quel point de l'espace, à quelle distance se trouve la surface
la plus proche.

## La scène est une fonction

\`\`\`glsl
vec2 map(vec3 p) {
  float a = sdSphere(p - centreA(), 0.75);
  float b = sdSphere(p - centreB(), 0.55);

  float k = uBlend;
  float h = clamp(0.5 + 0.5 * (b-a) / k, 0., 1.);

  // la distance, et de quel côté on penche
  return vec2(mix(b, a, h) - k*h*(1.0-h), h);
}
\`\`\`

Elle est faite de pièces que vous avez déjà : \`sdSphere\` est le cercle du
chapitre formes avec une coordonnée de plus, et \`smin\` est la même union douce.
Deux sphères qui se traversent fusionnent comme du liquide, parce qu'un champ
de distance n'a pas de couture à cacher — c'est le grand avantage de cette
représentation sur les maillages.

## Le sphere tracing

\`\`\`glsl
float t = 0.0;
for (int i = 0; i < 72; i++) {
  float d = map(origin + direction * t).x;
  if (d < 0.001) break;
  t += d;
}
\`\`\`

On avance le long du rayon **d'exactement la distance que le champ déclare
sûre**. Comme cette distance est celle de la surface la plus proche dans toutes
les directions, on ne peut jamais dépasser ; et dans le vide, les pas sont
énormes.

C'est pour ça qu'une scène presque vide coûte peu et qu'une scène pleine de
détails fins coûte cher : le nombre d'itérations dépend de la géométrie, pas de
la résolution.

## La normale sort du champ

\`\`\`glsl
vec2 e = vec2(0.0015, 0.0);
vec3 n = normalize(vec3(
  map(p + e.xyy).x - map(p - e.xyy).x,
  map(p + e.yxy).x - map(p - e.yxy).x,
  map(p + e.yyx).x - map(p - e.yyx).x
));
\`\`\`

C'est son gradient, mesuré en interrogeant la scène six fois de plus.
La même astuce des voisins qu'au chapitre vertex shaders, et c'est pourquoi
cette étape atterrit ici. L'astuce du \`e.xyy\` / \`e.yxy\` est un idiome répandu
pour éviter d'écrire trois \`vec3\`.

## Ce qu'il n'y a pas

Pas d'objet \`Camera\` : la scène vit entièrement dans un shader, donc tourner
autour, c'est deux angles accumulés au glissé et envoyés comme uniform, amortis
à l'entrée comme toutes les autres entrées de ce cours.

Le curseur « blend » du panneau est le \`k\` du \`smin\`. Près de 0 les deux sphères
s'interpénètrent avec une arête nette ; montez-le et le col s'épaissit jusqu'à
ce qu'elles ne fassent plus qu'une goutte.

## Le compromis

Vous obtenez des formes qu'aucun maillage ne ferait à bon compte, et des
opérations — union douce, répétition infinie, torsion — qui seraient des
cauchemars en géométrie. Vous payez le fait que chaque pixel parcourt la scène,
donc le prix monte avec la taille de l'écran et avec la complexité de \`map\`.`,

  resources: [
    { label: "Inigo Quilez — 3D distance functions", url: "https://iquilezles.org/articles/distfunctions/" },
    { label: "Inigo Quilez — Normals for an SDF", url: "https://iquilezles.org/articles/normalsSDF/" },
    { label: "Inigo Quilez — Smooth minimum", url: "https://iquilezles.org/articles/smin/" },
  ],
}

export default step
