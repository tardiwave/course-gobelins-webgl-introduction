import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Textured sphere',
  required: true,

  insight: `## Les deux moitiés du cours se rejoignent

Le shader est la lecture de texture du chapitre textures, avec les UV de la
sphère à la place de ceux d'un triangle plein écran :

\`\`\`glsl
gl_FragColor = texture2D(tMap, vUv);
\`\`\`

C'est tout. Une fois qu'une géométrie porte des UV, lire une image dessus ne
demande rien de nouveau.

## La projection équirectangulaire

La carte enroule sa **largeur** autour de l'équateur et sa **hauteur** d'un pôle
à l'autre. Cette convention est universelle pour les planètes, les HDRI et les
panoramas 360, et elle a deux conséquences directes :

\`\`\`ts
wrapS: gl.REPEAT,          // la longitude boucle
wrapT: gl.CLAMP_TO_EDGE,   // la latitude, non
\`\`\`

Si vous mettez \`REPEAT\` verticalement, les pôles se replient l'un sur l'autre
et vous obtenez une bande d'artefacts au sommet.

## Ce qu'elle coûte

Les texels sont énormément étirés près des pôles : toute la largeur de l'image
s'écrase sur un point. C'est pour ça qu'une planète texturée a l'air floue au
sommet, et c'est une limite de la projection, pas de votre résolution. Les
moteurs qui s'en soucient utilisent une cubemap.`,

  resources: [
    { label: "OGL examples", url: "https://oframe.github.io/ogl/examples" },
    { label: "WebGL Fundamentals — Textures", url: "https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html" },
  ],
}

export default step
