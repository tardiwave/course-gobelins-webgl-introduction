import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Size with depth',
  required: true,

  insight: `## Pourquoi le nuage paraissait plat

\`gl_PointSize\` se mesure en pixels. La matrice de projection rétrécit tout le
reste avec la distance, mais elle n'a **aucune prise** sur un nombre exprimé en
pixels : il est appliqué après la projection.

On le fait donc à la main :

\`\`\`glsl
vec4 viewPosition = modelViewMatrix
                  * vec4(position, 1.0);

gl_PointSize = 40.0 * uPixelRatio / -viewPosition.z;
\`\`\`

## Quels pixels, exactement

Des pixels du **framebuffer**, pas des pixels CSS. Sur un écran retina le
canvas fait deux fois la taille demandée, donc sans le \`uPixelRatio\` les
particules sortent deux fois trop petites — et seulement sur les machines qui ont
un tel écran, ce qui en fait un bug qu'on ne voit jamais sur la sienne.

\`\`\`ts
uniforms: { uPixelRatio: { value: gl.renderer.dpr } }
\`\`\`

C'est un problème propre aux points : une géométrie, elle, a une taille en
unités du monde et la projection s'en occupe toute seule.

## Le signe moins

\`viewPosition.z\` est **négatif** devant la caméra. OpenGL place la caméra à
l'origine regardant le long de son propre -Z, donc plus un objet est loin, plus
son z est négatif. Le \`-\` remet la distance à l'endroit.

C'est une convention qui n'a aucune justification profonde et qui fait perdre
du temps à tout le monde une fois. Si votre taille de point explose au lieu de
diminuer, c'est ce signe.

## Une variable qui vaut d'être sortie

Découper \`modelViewMatrix * position\` dans sa propre variable est une habitude à
prendre. C'est le seul endroit du pipeline où l'on peut lire la distance d'un
objet **avant** qu'elle ne soit aplatie sur l'écran par la projection. Le
brouillard, plus loin dans ce chapitre, s'en servira exactement pareil.

## La limite matérielle

Les pilotes plafonnent la taille d'un point, souvent à 64 ou 255 pixels :

\`\`\`ts
gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)
\`\`\`

Une particule très proche cesse simplement de grandir. Ce plafond est l'une des
raisons pour lesquelles on finit par passer à de la géométrie instanciée, à la
fin de
ce chapitre.`,

  resources: [
    { label: "WebGL Fundamentals — Perspective", url: "https://webglfundamentals.org/webgl/lessons/webgl-3d-perspective.html" },
  ],
}

export default step
