import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Pixelate around the mouse',

  insight: `## Le cercle devient un masque

Le même cercle qu'à l'étape précédente, sauf qu'il n'est jamais dessiné :

\`\`\`glsl
float mask = smoothstep(
  0.25, 0.2, length(uv - mouse)
);

gl_FragColor = texture2D(
  tMap, mix(base, pixelated, mask)
);
\`\`\`

Forme → masque → effet, encore. Ici le \`mix\` interpole entre deux jeux de
**coordonnées**, pas entre deux couleurs, donc la pixelisation apparaît en
fondu sur le bord du cercle au lieu de s'enclencher d'un coup.

## Un détail qui a l'air faux et ne l'est pas

Mélanger deux coordonnées de lecture n'est pas la même chose que mélanger deux
résultats de lecture. Sur un dégradé doux, les deux se ressemblent ; sur une
image contrastée, le mélange de coordonnées glisse au lieu de fondre.

Les deux sont utiles. Mélanger les coordonnées coûte **une** lecture de texture
au lieu de deux, ce qui compte quand l'effet couvre tout l'écran.

## Les deux seuils

0.25 et 0.2 laissent cinq centièmes d'écran de transition. Rapprochez-les et le
bord devient net et crénelé ; écartez-les et l'effet devient une brume sans
forme. Le bon réglage se trouve à l'œil, pas au calcul.`,

  resources: [
    { label: "The Book of Shaders — Shaping functions", url: "https://thebookofshaders.com/05/" },
  ],
}

export default step
