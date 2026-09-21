import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Show the normals',
  required: true,

  insight: `## Une normale, c'est une direction

C'est le vecteur perpendiculaire à la surface en un point. La géométrie en
porte déjà une par sommet — nous ne l'avions simplement jamais demandée.

\`\`\`glsl
attribute vec3 normal;
varying vec3 vNormal;

void main() {
  vNormal = normalize(mat3(modelMatrix) * normal);
  // ...
}
\`\`\`

## Pourquoi mat3 et pas mat4

\`mat3()\` ne garde que la partie rotation/échelle de la matrice. Une direction
ne se translate pas : déplacer un objet de dix mètres ne change pas le sens
dans lequel sa surface est tournée. Multiplier \`vec4(normal, 1.0)\` par la
\`mat4\` complète est une erreur silencieuse — l'objet reste éclairé, mais de
travers, et seulement quand il n'est pas à l'origine. C'est le quatrième
nombre de l'étape Sphere UVs : une direction porte un 0, et \`mat3()\` revient
au même.

**Le piège suivant**, que vous rencontrerez tôt ou tard : si l'objet a une
échelle non uniforme, \`mat3(modelMatrix)\` ne suffit plus, il faut la transposée
de l'inverse. Ici toutes les échelles sont uniformes, donc ça passe.

## Le deuxième réflexe de debug

Afficher les normales en couleurs vient juste après afficher les UV :

\`\`\`glsl
gl_FragColor = vec4(normal * 0.5 + 0.5, 1.0);
\`\`\`

Le \`* 0.5 + 0.5\` remappe -1..1 vers 0..1, parce qu'un écran n'affiche pas de
couleur négative. Rouge = la surface regarde vers +X, vert vers +Y, bleu vers
+Z.

Une plage d'une seule couleur signifie une géométrie plate ; une rupture nette
signale une couture ou des normales mal exportées. Tout ce qui touche à la
lumière part de ce vecteur, donc c'est la première chose à vérifier quand un
éclairage semble absurde.`,

  resources: [
    { label: "WebGL Fundamentals — Directional lighting", url: "https://webglfundamentals.org/webgl/lessons/webgl-3d-lighting-directional.html" },
  ],
}

export default step
