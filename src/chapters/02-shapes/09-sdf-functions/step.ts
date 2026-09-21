import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'SDF functions',

  insight: `## Signed distance field

Un SDF ne répond pas « dedans ou dehors » mais « à quelle distance du bord »,
négatif à l'intérieur, zéro exactement sur le contour.

\`\`\`glsl
float sdCircle(vec2 p, float radius) {
  return length(p) - radius;
}
\`\`\`

C'est une information beaucoup plus riche qu'un booléen. Avec elle vous pouvez
contourer (\`abs(d) < épaisseur\`), faire briller (\`exp(-d * k)\`), arrondir un
coin (soustraire un rayon) ou fondre deux formes — le tout sans rien changer à
la fonction de la forme.

Les anneaux qui défilent sont ce champ rendu visible : \`fract(d * 12.0)\` prend
la distance partout à l'écran, pas seulement sur le contour.

## L'union douce

\`\`\`glsl
float smoothUnion(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b-a) / k, 0., 1.);
  return mix(b, a, h) - k * h * (1.0 - h);
}
\`\`\`

C'est un \`min\` avec un fondu de largeur \`k\`. Ici \`k\` respire au fil du temps :
regardez le col se former quand il monte, et les deux formes se détacher net
quand il retombe vers 0. Le terme \`- k * h * (1 - h)\` est ce qui creuse le
raccord.

Ce que vous ne pouviez pas deviner : après un \`smoothUnion\`, le champ n'est
plus une vraie distance mais une borne inférieure. Ça reste utilisable pour
tracer, mais les marches d'un raymarcher deviennent un peu trop prudentes —
c'est le compromis accepté partout.

## Déplacer une forme, c'est déplacer l'espace

\`\`\`glsl
float circle = sdCircle(uv + travel, 0.22);
float box = sdBox(rotate(t * 0.4) * (uv - travel), vec2(0.18));
\`\`\`

On ne translate jamais la forme : on translate la coordonnée **avant** de la
mesurer, et dans le sens inverse. Même chose pour la rotation, avec la matrice
inverse. C'est déroutant une fois, et ensuite ça vaut pour toutes les
transformations que vous ferez en shader.

## À quoi ça mène

Le dernier chapitre du cours construit deux volumes entiers avec exactement
ces deux fonctions, en 3D. [L'article d'Inigo Quilez sur le smooth
minimum](https://iquilezles.org/articles/smin/) compare une demi-douzaine de
variantes.`,

  resources: [
    { label: "Inigo Quilez — 2D distance functions", url: "https://iquilezles.org/articles/distfunctions2d/" },
    { label: "Inigo Quilez — Smooth minimum", url: "https://iquilezles.org/articles/smin/" },
  ],
}

export default step
