import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Animate in the vertex shader',
  required: true,

  insight: `## Un flottant pour deux mille particules

Le buffer de positions est envoyé une fois et plus jamais touché. À chaque
frame le CPU envoie un seul nombre :

\`\`\`ts
program.uniforms.uTime.value = time
\`\`\`

et le GPU déplace deux mille particules avec.

C'est tout l'intérêt d'animer dans le vertex shader. Les déplacer en JavaScript
voudrait dire réécrire le buffer et le renvoyer soixante fois par seconde : ce
transfert coûte cher et son coût **grandit avec le nombre de particules**. Ici
il ne grandit pas du tout.

## Le prix : pas de mémoire

Le shader ne peut pas demander où était une particule à la frame précédente.
Chaque mouvement doit donc être une **formule** de \`uTime\` et de ce que la
particule porte déjà :

\`\`\`glsl
float angle = uTime * (0.5 / radius);
\`\`\`

Conséquences concrètes. Donnez le même \`random\` à deux particules et elles
bougeront à l'identique, pour toujours. Et rien ne peut réagir à une collision,
à un obstacle, à un événement : tout ce qui dépend du passé est hors de portée.

## Comment on s'en sort quand même

Deux issues. Soit on rend la formule plus riche — du bruit, des harmoniques,
des décalages par particule — et c'est ce que fait la ceinture juste après.
Soit on se donne une mémoire, en rangeant l'état dans une texture qu'on
réécrit à chaque frame : c'est le chapitre GPGPU.`,

  resources: [
    { label: "WebGL Fundamentals — How it works", url: "https://webglfundamentals.org/webgl/lessons/webgl-how-it-works.html" },
  ],
}

export default step
