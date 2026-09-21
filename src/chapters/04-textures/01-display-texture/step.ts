import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Display a texture',
  required: true,

  insight: `## Lire une image

\`\`\`glsl
gl_FragColor = texture2D(tMap, uv);
\`\`\`

\`texture2D\` prend un sampler et une coordonnée, et renvoie la couleur de
l'image à cet endroit. Les UV que vous utilisez depuis la première étape sont
exactement cette coordonnée : il n'y a rien de nouveau à apprendre, seulement
une nouvelle source de couleur.

Un \`sampler2D\` n'est pas l'image : c'est un numéro d'unité de texture. Le GPU
en a un nombre limité — souvent 16, et la spec n'en garantit que 8 — et c'est une des rares ressources
que vous pouvez épuiser.

## Pourquoi cover()

Sans correction, la carte est étirée. Les UV vont de 0 à 1 quelle que soit la
forme du canvas, alors que l'image a ses propres proportions : c'est le même
problème d'unités qu'à l'étape du ratio, avec un rapport de plus à concilier.

\`cover()\`, dans \`src/shaders/chunks/uv.glsl\`, est l'équivalent shader de
[\`object-fit: cover\`](https://developer.mozilla.org/fr/docs/Web/CSS/object-fit) :
elle remet les coordonnées à l'échelle autour du centre pour que l'image garde
ses proportions et remplisse le cadre.

## Ce que le shader ne peut pas savoir

Il n'existe aucun moyen de demander la taille d'une texture depuis GLSL ES
1.00 — pas de \`textureSize()\`, ça arrive en WebGL 2. Il faut donc la passer à
la main :

\`\`\`ts
uTextureSize: { value: new Vec2(2048, 1024) }
\`\`\`

Et la tenir à jour si le fichier change. C'est une des sources de bug les plus
bêtes du domaine.`,

  resources: [
    { label: "WebGL Fundamentals — Textures", url: "https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html" },
  ],
}

export default step
