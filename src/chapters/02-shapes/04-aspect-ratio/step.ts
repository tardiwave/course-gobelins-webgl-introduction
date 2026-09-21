import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Aspect ratio',
  required: true,

  insight: `Deux carrés, le même code. Le gris à gauche n'est pas un carré du tout, et
redimensionner la fenêtre empire les choses. Le bleu à droite tient.

## Le bug est une histoire d'unités

\`vUv.x\` couvre toute la **largeur** et \`vUv.y\` toute la **hauteur**. Ce ne sont
pas les mêmes nombres de pixels, donc le même 0.12 vaut 0.12 de la largeur sur
un axe et 0.12 de la hauteur sur l'autre. Sur un canvas 16:9 c'est presque deux
fois plus large que haut.

Rien dans WebGL ne vous prévient : les UV sont normalisés par construction,
c'est le prix à payer pour qu'ils marchent sur n'importe quelle taille d'écran.

## La correction

\`\`\`glsl
float aspect = uResolution.x / uResolution.y;

vec2 uv = vUv;
uv.x *= aspect;   // étire depuis le bord gauche
\`\`\`

Attention au centre autour duquel vous étirez. Multiplier \`uv.x\` étire depuis
le bord gauche ; pour garder une forme centrée en \`c\` il faut
\`(uv.x - c) * aspect + c\`, ce que fait la version de droite.

## Un uniform, c'est quoi

\`uResolution\` était déjà là dans Smooth circle, sans explication. C'est un
**uniform** : une valeur envoyée par le JavaScript. Un uniform est constant pour tous les pixels d'un même rendu — par
opposition à un \`varying\`, qui change d'un pixel à l'autre. Le mettre à jour
coûte un appel par frame, pas un par pixel.

À partir d'ici, chaque étape qui dessine une forme commence par cette ligne.`,

  resources: [
    { label: "The Book of Shaders — Shapes", url: "https://thebookofshaders.com/07/" },
  ],
}

export default step
