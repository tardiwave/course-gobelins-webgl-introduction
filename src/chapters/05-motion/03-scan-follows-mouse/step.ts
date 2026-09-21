import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Scan follows the mouse',
  required: true,

  insight: `## Une ligne a changé

\`fract(uTime * 0.2)\` est devenu \`uMouse.x\`. La bande, le masque, la
pixelisation, le liseré : tout le reste est identique.

Ça vaut la peine d'être remarqué. **Un shader se moque de l'origine d'un
nombre.** Le temps et le curseur ne sont tous les deux qu'un \`float\` qui arrive
du JavaScript, donc tout ce qui est piloté par l'un peut l'être par l'autre, et
généralement gratuitement.

## Là où le curseur est converti

Le shader reçoit une valeur déjà propre. La conversion se fait une fois, en
JavaScript, en haut de \`main.ts\` :

\`\`\`ts
const bounds = root.getBoundingClientRect()
mouse.set(
  (event.clientX - bounds.left) / bounds.width,
  1 - (event.clientY - bounds.top) / bounds.height
)
\`\`\`

Deux choses à retenir. \`getBoundingClientRect()\` et non \`offsetX\`, parce que le
canvas n'est pas forcément à l'origine de la page ni à sa taille CSS. Et le
\`1 -\` sur y, parce que le DOM compte depuis le haut et les UV depuis le bas.

## Ce qui ne va pas encore

La bande est soudée au curseur : elle s'arrête net quand vous vous arrêtez, et
elle se téléporte si vous sautez. Rien ici n'a de poids. L'étape suivante
règle ça en trois lignes.`,

  resources: [
    { label: "MDN — getBoundingClientRect", url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect" },
  ],
}

export default step
