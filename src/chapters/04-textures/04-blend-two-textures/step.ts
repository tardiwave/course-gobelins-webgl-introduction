import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Blend two textures',

  insight: `## Une texture n'est pas forcément une image à regarder

Ici la seconde sert de masque : sa luminosité décide où la première apparaît.

\`\`\`glsl
float noise = texture2D(tNoise, vUv * 0.5).r;
float clouds = smoothstep(0.45, 0.68, noise);
vec3 color = mix(earth, CREAM, clouds);
\`\`\`

C'est encore le motif forme → masque → effet, sauf que le masque vient d'une
image au lieu d'une formule. Tout ce que vous savez peindre, vous pouvez le
piloter : de l'usure, de la rouille, une carte de rugosité, un seuil de
dissolution.

## Un seul canal suffit

On ne lit que \`.r\`. Une image en niveaux de gris occupe quand même quatre
canaux en mémoire une fois chargée, donc les studios y rangent quatre masques
différents — un par canal. Quand vous verrez une texture aux couleurs
improbables dans un moteur, c'est généralement ça.

## L'échelle du bruit

\`vUv * 0.5\` **agrandit** le motif, puisque parcourir l'écran ne traverse plus
qu'une moitié de l'image. Multiplier les UV rétrécit, diviser agrandit : c'est
contre-intuitif la première fois, et on s'y trompe longtemps.

Le \`smoothstep\` transforme un dégradé continu en masse avec un bord. Déplacez
ses deux seuils l'un vers l'autre pour durcir le contour, écartez-les pour
l'adoucir.`,

  resources: [
    { label: "Learn OpenGL — Textures", url: "https://learnopengl.com/Getting-started/Textures" },
  ],
}

export default step
