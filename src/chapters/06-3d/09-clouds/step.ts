import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Clouds',

  insight: `Une troisième sphère, 1,2 % plus grande que le sol, avec une texture
transparente. La planète est maintenant trois meshes partageant une géométrie
et une lumière : c'est la forme que le chapitre organisation transformera en
classe.

## Pourquoi 1,2 % et pas 10 %

Assez pour que le depth test sépare les deux couches, assez peu pour que
l'épaisseur ne se voie pas sur la silhouette. Si vous mettez les deux sphères
exactement au même rayon, vous obtenez du
[z-fighting](https://en.wikipedia.org/wiki/Z-fighting) : un papillotement de
pixels là où le GPU n'arrive pas à décider laquelle est devant.

## Le domain warping revient

\`\`\`glsl
float nx = texture2D(tNoise, vUv * 2.0 + uTime * 0.005).r;
float ny = texture2D(tNoise, vUv * 2.0 - uTime * 0.007 + 0.37).r;

vec2 offset = (vec2(nx, ny) - 0.5) * uWarp;

vec4 clouds = texture2D(tClouds, vUv + offset + vec2(uTime * 0.003, 0.0));
\`\`\`

Faire tourner la couche ne suffit pas : des nuages qui tournent comme une coque
rigide se lisent comme un autocollant peint. Le bruit n'est jamais dessiné, il
décide **où** lire la carte de nuages, et comme il est lu deux fois à deux
vitesses, la nappe s'étire et se plie en avançant.

Tirez le curseur de warp. À zéro vous retrouvez l'autocollant. Au-delà de 0.02
les bandes s'écrasent en traînées et cessent de se lire comme de la météo. La
fenêtre où ça marche est étroite, et le seul moyen de la trouver est de bouger
le nombre et de regarder.

## L'échelle entière

\`vUv * 2.0\` et pas \`vUv * 2.3\`. La texture de bruit est chargée en \`REPEAT\` ;
avec un facteur entier, le motif se referme exactement sur lui-même au tour du
globe. Toute autre valeur laisse une couture visible dans le dos de la planète,
que vous ne verrez qu'en tournant la caméra.`,

  resources: [
    { label: "Inigo Quilez — Domain warping", url: "https://iquilezles.org/articles/warp/" },
    { label: "MDN — blendFunc", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc" },
  ],
}

export default step
