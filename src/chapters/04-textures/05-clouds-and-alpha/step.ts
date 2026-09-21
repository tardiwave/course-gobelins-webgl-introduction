import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Clouds and alpha',

  insight: `## Le quatrième canal

\`texture2D\` a toujours renvoyé un \`vec4\`. Jusqu'ici nous n'avons lu que \`.rgb\` :

\`\`\`glsl
vec4 clouds = texture2D(tClouds, uv);
gl_FragColor = vec4(
  mix(ground, clouds.rgb, clouds.a), 1.0
);
\`\`\`

\`.a\` dit à quel point chaque pixel est opaque. C'est un masque que quelqu'un a
déjà peint, livré avec l'image, gratuit.

C'est toute l'astuce d'une couche de nuages : une seule image porte la couleur
et la forme. Pas de seuil à régler, pas de seconde texture à charger.

## Prémultiplié ou non

Le piège classique. Certaines images stockent des couleurs déjà multipliées par
leur alpha, d'autres non, et mélanger les deux conventions donne des halos
sombres ou clairs sur les bords. WebGL laisse le choix :

\`\`\`ts
gl.pixelStorei(
  gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true
)
\`\`\`

OGL le laisse à \`false\` par défaut, et c'est ce que suppose le \`mix\` ci-dessus.
Si un jour vos bords transparents ont un liseré noir, c'est la première chose à
vérifier.

## Alpha n'est pas transparence

Ici l'alpha est juste un nombre qu'on utilise dans un \`mix\` : rien n'est
transparent, on écrit une couleur opaque. La vraie transparence — le blending
matériel, le tri par profondeur — arrive au chapitre 3D, à l'étape Halo, et elle apporte des
problèmes entièrement différents.

Cette couche revient dans le chapitre mouvement, animée, puis dans le chapitre
3D, enroulée autour de la sphère.`,

  resources: [
    { label: "WebGL Fundamentals — Textures", url: "https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html" },
  ],
}

export default step
