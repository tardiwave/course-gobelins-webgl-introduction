import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Orbit controls',
  required: true,

  insight: `## Rien n'a changé sur la sphère

Cliquez-glissez pour tourner, molette pour zoomer. Seule la caméra bouge, et
c'est tout l'intérêt : en 3D on regarde une scène depuis n'importe où sans
toucher à la géométrie. La sphère ne tourne plus d'elle-même, puisque c'est
vous qui décidez.

## Orbit écrit dans la caméra

\`\`\`ts
const orbit = new Orbit(camera, {
  element: gl.canvas,
})

// dans la boucle
orbit.update()
\`\`\`

\`Orbit\` écrase \`camera.position\` à chaque \`update()\`. Donc tout ce qui
définirait la position de la caméra ailleurs entrera en conflit : si vous devez
régler un cadrage initial, faites-le **avant** de créer l'\`Orbit\`, qui part de
la position courante.

## Toujours rendre ses écouteurs

\`\`\`ts
return () => {
  orbit.remove()
  cancelAnimationFrame(frame)
  observer.disconnect()
  gl.canvas.remove()
  gl.getExtension('WEBGL_lose_context')?.loseContext()
}
\`\`\`

\`Orbit\` pose des écouteurs sur le canvas. Si vous quittez l'étape sans appeler
\`remove()\`, ils restent — et comme le canvas est détruit, ils fuient
silencieusement. C'est la même discipline que pour le panneau de debug, et elle
reviendra au chapitre organisation avec beaucoup plus d'enjeu.

Chaque étape de ce cours renvoie une fonction de nettoyage exactement pour ça.`,

  resources: [
    { label: "OGL — Orbit source", url: "https://github.com/oframe/ogl/blob/master/src/extras/Orbit.js" },
    { label: "WebGL Fundamentals — Perspective", url: "https://webglfundamentals.org/webgl/lessons/webgl-3d-perspective.html" },
  ],
}

export default step
