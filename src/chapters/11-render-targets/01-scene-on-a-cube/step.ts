import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Scene on a cube',
  required: true,

  insight: `Jusqu'ici tout était dessiné directement à l'écran, et une fois un pixel posé
il était perdu. Un **render target** change ça : c'est une texture dans
laquelle le GPU a le droit de dessiner, donc la scène devient une image qu'on
garde en main.

Et une image, on en fait ce qu'on veut. Ici : les six faces d'un cube.

## Deux rendus, deux caméras

\`\`\`ts
renderer.render({ scene, camera: film, target })
renderer.render({ scene: cube, camera })
\`\`\`

Le premier a une \`target\`, le second n'en a pas. Et surtout, ils n'ont pas la
même caméra : \`film\` regarde la planète, \`camera\` regarde le cube. La scène est
**filmée**, elle n'est plus regardée.

C'est la bascule mentale de ce chapitre. À l'instant où une scène devient une
texture, elle cesse d'être une scène : plus rien en aval ne sait qu'il y avait
une planète, une ceinture et un ciel.

Derrière, un render target est un
[framebuffer object](https://developer.mozilla.org/en-US/docs/Web/API/WebGLFramebuffer)
avec une texture attachée. « Rendre à l'écran » est simplement le cas où le
framebuffer est celui du navigateur.

## Une cible carrée

Les faces du cube sont carrées, donc la cible l'est aussi — et la caméra qui
filme reçoit \`aspect: 1\`. Filmer en 16:9 pour plaquer sur un carré étirerait
l'image, et c'est le genre de détail qu'on ne voit qu'une fois le résultat à
l'écran.

Notez aussi que la taille est **fixe** ici : 1024×1024, indépendante de la
fenêtre. Une cible n'a aucune obligation de suivre le canvas ; ce n'est vrai
que quand elle sert à un effet plein écran, ce que fait le chapitre suivant.

## Les UV viennent gratuitement

\`Box\` donne à chaque face son propre 0 à 1. La même texture se pose donc
entière sur les six, sans une ligne de plus.

## Ce que ça ouvre

À partir du moment où une image existe en mémoire, on peut la relire autant de
fois qu'on veut, à n'importe quelle coordonnée. Le cube est la démonstration la
plus littérale ; le chapitre suivant s'en sert pour déformer, décaler et
recombiner le rendu.`,

  resources: [
    { label: "WebGL Fundamentals — Render to texture", url: "https://webglfundamentals.org/webgl/lessons/webgl-render-to-texture.html" },
    { label: "Learn OpenGL — Framebuffers", url: "https://learnopengl.com/Advanced-OpenGL/Framebuffers" },
  ],
}

export default step
