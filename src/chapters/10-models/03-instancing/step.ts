import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Instancing',
  required: true,

  insight: `## Une géométrie chargée est une géométrie ordinaire

\`\`\`ts
const geometry = gltf.meshes[1].primitives[0].geometry

geometry.addAttribute('offset', {
  instanced: 1, size: 3, data: offset,
})
\`\`\`

Une fois que le loader en a fini, c'est un buffer comme un autre : il accepte
des attributs instanciés exactement comme le cube du chapitre précédent.

\`meshes[1]\` et non plus \`meshes[0]\` : c'est le rocher le plus léger du pack,
1 472 triangles contre 3 394 pour le premier. Quand une géométrie est dessinée
deux mille quatre cents fois en un seul appel, c'est elle qu'on choisit.

## Pourquoi ces deux techniques vont ensemble

Un modèle coûte cher à fabriquer et rien à répéter. L'instanciation est le
mécanisme qui rend cette répétition gratuite. Un rocher plus deux buffers de
nombres aléatoires font une ceinture.

C'est le compromis central de toute scène dense : peu d'assets, beaucoup
d'instances, et toute la variété obtenue par des nombres.

## La variation doit venir des buffers

Le même modèle à la même taille dans la même orientation deux mille quatre
cents fois se lit comme du papier peint. Chaque instance reçoit donc son
échelle, sa rotation et sa luminosité, le tout dérivé d'un seul flottant :

\`\`\`glsl
mat3 spin = rotationY(
  uTime * (0.2 + random * 0.7) + random * 6.28
);

vec3 local = spin * position
           * (0.010 + random * 0.024);
\`\`\`

Le \`+ random * 6.28\` est le plus important : sans ce décalage de phase, tous
les rochers tournent en même temps et l'œil voit immédiatement la
supercherie. Décaler les phases est le réflexe à avoir dès qu'on répète une
animation.`,

  resources: [
    { label: "WebGL Fundamentals — Instanced drawing", url: "https://webglfundamentals.org/webgl/lessons/webgl-instanced-drawing.html" },
  ],
}

export default step
