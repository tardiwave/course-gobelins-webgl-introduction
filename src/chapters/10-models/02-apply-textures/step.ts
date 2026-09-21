import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Apply textures',
  required: true,

  insight: `## Ce n'est plus vous qui décidez des coordonnées

Jusqu'ici le cours générait ses propres UV : le dépliage d'une sphère, le 0 à 1
d'un triangle plein écran. Ici quelqu'un d'autre a décidé comment ce rocher se
déplie, et la texture a été peinte contre cette décision.

Le shader ne fait donc rien d'astucieux :

\`\`\`glsl
gl_FragColor = texture2D(tMap, vUv);
\`\`\`

Tout le travail est dans le fichier. C'est une bascule mentale à faire : avec un
modèle, le shader s'adapte à la donnée, pas l'inverse.

## Le matériau livré, et pourquoi on l'ignore

\`\`\`ts
const material = gltf.materials[0]

tMap: { value: material.baseColorTexture.texture }
\`\`\`

On prend la texture, pas le matériau. OGL sait construire le matériau PBR
complet décrit par le fichier, mais il vient avec ses propres lumières, son
propre espace colorimétrique et ses propres hypothèses — qui ne seront pas
celles de votre scène.

Prendre la géométrie et les textures, puis écrire le shader soi-même, est à la
fois plus simple et le seul moyen de garder une scène cohérente. C'est ce que
font la plupart des productions stylisées.

## Un détail qui mord

Les textures de base color d'un glTF sont en **sRGB**, les normal maps et les
cartes de rugosité en linéaire. Un moteur complet gère ça pour vous ; ici, comme
tout le cours reste en espace non corrigé, la question ne se pose pas — mais
elle se posera dès que vous mélangerez un modèle importé à un rendu physique.`,

  resources: [
    { label: "Khronos — glTF 2.0 overview", url: "https://www.khronos.org/gltf/" },
  ],
}

export default step
