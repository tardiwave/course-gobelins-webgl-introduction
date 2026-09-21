import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Grid',
  required: true,

  insight: `## fract répète tout

\`fract(x)\` ne garde que la partie décimale. Multipliez les coordonnées pour
choisir le nombre de cellules, appliquez \`fract\`, et chaque cellule repart de
zéro :

\`\`\`glsl
// 10 cellules, chacune de 0 à 1
vec2 cell = fract(uv * 10.0);
\`\`\`

La forme que vous savez déjà écrire se dessine alors une fois par cellule, sans
boucle et sans coût supplémentaire. C'est le mécanisme derrière tous les motifs
répétés que vous verrez en shader.

## Le piège des bords

\`fract\` crée une discontinuité à chaque frontière de cellule : la valeur saute
de 0.999 à 0. Tant que vous ne faites que comparer, c'est sans conséquence.
Mais dès que vous dériverez quelque chose de \`cell\` — un flou, un \`fwidth\`, une
normale — cette marche produira une ligne d'artefacts sur chaque bord.

## Corriger le ratio d'abord

La correction de l'étape précédente s'applique **avant** la répétition, sinon
les cellules s'étirent avec la fenêtre. L'ordre des opérations compte autant
que les opérations.

[The Book of Shaders — Patterns](https://thebookofshaders.com/09/) enchaîne sur
les grilles décalées et les pavages.`,

  resources: [
    { label: "The Book of Shaders — Patterns", url: "https://thebookofshaders.com/09/" },
  ],
}

export default step
