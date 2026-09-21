import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Distort the scene',

  insight: `La scène part dans une texture, comme au chapitre post-processing, et la
dernière passe la lit à \`vUv - velocity * uStrength\` au lieu de \`vUv\`. C'est
toute l'étape.

## Le signe moins

\`\`\`glsl
vec2 uv = vUv - velocity * uStrength;

gl_FragColor = vec4(
  texture2D(tScene, uv).rgb, 1.0
);
\`\`\`

Échantillonner **en arrière** le long de la vitesse donne l'impression que
l'image est entraînée en avant, avec votre main. Mettez un plus et elle fuit le
curseur, ce qui paraît faux immédiatement alors que les maths sont tout aussi
valables.

C'est exactement la même inversion que dans l'advection : on ne pousse pas
l'image, on va chercher d'où elle vient.

## Deux vues de la même frame

La vignette en bas à droite montre le champ pendant que le reste montre ce
qu'il fait. Cliquez-la pour l'agrandir.

Pouvoir passer de la donnée au résultat sans changer d'écran est l'essentiel du
débogage d'un shader — et c'est exactement ce que fait un moteur quand il vous
propose d'afficher ses buffers intermédiaires.

## Là où les deux moitiés du cours se rejoignent

Le champ ne sait rien de la planète ; la planète ne sait rien du champ. Une
passe rend, une autre lit — et comme la scène est une image à ce moment-là,
**tout ce qui sait produire un décalage 2D peut la déformer** : une normal map,
un bruit, une vidéo de fumée, une texture peinte à la main.

Le coût est d'une lecture de texture de plus par pixel. La scène est rendue une
fois dans les deux cas, ce qui explique que cette technique tourne encore sur
un téléphone là où un vrai fluide ne tournerait pas.`,

  resources: [
    { label: "WebGL Fundamentals — Render to texture", url: "https://webglfundamentals.org/webgl/lessons/webgl-render-to-texture.html" },
  ],
}

export default step
