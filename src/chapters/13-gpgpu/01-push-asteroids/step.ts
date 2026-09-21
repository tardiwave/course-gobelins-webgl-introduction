import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Push the asteroids',

  insight: `Promenez le curseur dans la ceinture : les rochers se dispersent, puis
redérivent vers leur place en tournant sur eux-mêmes. **Rien en JavaScript ne
les touche** — pas de tableau de positions côté CPU, pas de buffer renvoyé au
GPU.

## La vignette est la mémoire

En bas à droite, cette grille de carrés **est** la ceinture : un texel par
astéroïde, et la couleur dit de combien ce rocher a été poussé hors de sa
place. Le gris est au repos, parce que le déplacement est signé et se fait
recentrer comme dans une normal map.

Cliquez dessus pour la voir en grand, et agitez le curseur : vous regardez la
mémoire, pas le rendu.

## Trois briques déjà connues

Rendre dans une texture, c'est le chapitre render targets. Lire une texture
depuis un vertex shader, c'est la displacement map. Deux cibles utilisées à
tour de rôle, parce qu'un shader ne peut pas lire la texture dans laquelle il
écrit : c'est ce que faisait déjà le flou en deux passes du compositing.

Le GPGPU, c'est ces trois choses pointées vers des **données** plutôt que vers
des pixels.

\`\`\`ts
renderer.render({ scene: simulation, target: next })

const previous = current
current = next
next = previous
\`\`\`

## Trois détails faciles à rater

**La précision.** \`precision highp float\` devant la simulation. \`mediump\` ne
garantit qu'environ trois décimales : parfait pour une couleur, désespérant
pour une position réinjectée dans elle-même des milliers de fois. Et ça doit
venir en premier, parce qu'un fragment shader n'a aucune précision par défaut
pour les flottants.

**Le filtrage.** \`NEAREST\` partout. \`LINEAR\` mélangerait des texels voisins, et
des texels voisins ici sont des rochers sans aucun rapport.

**Le delta.** Chaque force multipliée par \`uDelta\`. Une boucle de rétroaction qui
l'oublie n'est pas un peu fausse sur un écran 144 Hz : c'est une autre
simulation.

## Ce qui n'est pas dans la texture

L'orbite et la dérive de bruit. Les deux sont des formules du temps, évaluées
**deux fois** : une fois dans la simulation pour savoir où un rocher appartient,
une fois dans le vertex shader pour l'y dessiner.

C'est pourquoi \`asteroidDrift\` vit dans \`src/shaders/chunks/drift.glsl\`
et est collé devant
les deux. Deux copies finiraient par ne plus être d'accord, et le seul symptôme
serait une poussée qui vise légèrement à côté.

**Seul ce qui ne peut pas être recalculé mérite de la mémoire.**

WebGL 1 rend tout ça possible via deux extensions,
[OES_texture_float](https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float)
et \`WEBGL_color_buffer_float\`, qu'il faut demander explicitement.`,

  resources: [
    { label: "WebGL Fundamentals — GPGPU", url: "https://webglfundamentals.org/webgl/lessons/webgl-gpgpu.html" },
    { label: "MDN — OES_texture_float", url: "https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float" },
  ],
}

export default step
