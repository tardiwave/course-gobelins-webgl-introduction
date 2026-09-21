import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Pixelation scan',
  required: true,

  insight: `## Une forme qui n'est plus dessinée

Le chapitre formes a fabriqué une bande, l'étape précédente l'a déplacée, et
maintenant elle ne sert plus qu'à décider **où** un effet s'applique :

\`\`\`glsl
float band = smoothstep(
  width, width - 0.02, abs(vUv.x - position)
);

vec3 color = texture2D(
  tMap, mix(uv, pixelated, band)
).rgb;
\`\`\`

Regardez bien la dernière ligne : le \`mix\` n'interpole pas deux couleurs, il
interpole deux **coordonnées**. C'est ce qui fait que l'effet apparaît en fondu
au lieu de s'enclencher d'un coup.

Toutes les révélations, les balayages et les transitions que vous verrez sont
cette même idée : forme → masque → effet.

## Un seul nombre pilote tout

À l'étape suivante, \`fract(uTime * 0.2)\` devient \`uMouse.x\`, et le scan devient
une interaction sans que rien d'autre ne bouge.

## Le liseré

Les deux traits fins sur les bords de la bande sont dessinés séparément, pour
rendre visible un masque qui, sinon, serait invisible. Garder un moyen
d'afficher ses masques est une habitude de debug qui fait gagner des heures.`,

}

export default step
