import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Sphere UVs',
  required: true,

  insight: `## Deux matrices, et c'est tout

\`\`\`glsl
gl_Position = projectionMatrix
            * modelViewMatrix
            * vec4(position, 1.0);
\`\`\`

La **model-view** place l'objet devant la caméra, la **projection** transforme
la distance en perspective. OGL les remplit pour vous à chaque frame ; vous
n'avez qu'à les multiplier dans cet ordre.

L'ordre n'est pas négociable : le vecteur est à droite, et la chaîne
s'applique de droite à gauche — la model-view d'abord, la projection ensuite. Inversez-les et vous
n'obtenez pas un résultat un peu faux, vous obtenez un écran vide.

## Le quatrième 1.0

\`vec4(position, 1.0)\` — ce 1 dit « ceci est un point », par opposition à un
vecteur de direction qui porterait un 0. C'est ce qui décide si une translation
s'applique ou non. Pour une normale, ce sera 0, et vous verrez pourquoi deux
étapes plus loin.

## Ce que montre la vue des UV

La couture là où la texture se referme, et le pincement aux pôles où toutes les
colonnes convergent en un point. Les deux sont des propriétés du dépliage d'une
sphère, pas des bugs — et les deux vous poseront de vrais problèmes plus tard,
dans la normal map et dans la displacement map.

Une sphère n'est pas dépliable à plat sans distorsion : c'est le même théorème
qui empêche toute carte du monde d'être juste partout.`,

  resources: [
    { label: "WebGL Fundamentals — Perspective", url: "https://webglfundamentals.org/webgl/lessons/webgl-3d-perspective.html" },
    { label: "OGL on GitHub", url: "https://github.com/oframe/ogl" },
  ],
}

export default step
