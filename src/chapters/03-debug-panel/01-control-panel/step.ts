import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Control panel',
  required: true,

  insight: `Jusqu'ici, changer un nombre dans un shader voulait dire éditer le fichier et
attendre le rechargement. Ça va pour un nombre. C'est pénible pour les quatre
de ce shader, et vous en aurez vingt d'ici la fin du cours.

## Un binding pointe, il ne copie pas

\`\`\`ts
panel.pane.addBinding(uniforms.uFalloff, 'value', {
  min: 1,
  max: 20,
})
\`\`\`

Toute l'idée est là. Tweakpane ne prend pas une copie de la valeur : il garde
une référence sur l'objet \`uniforms.uFalloff\` et écrit dans son champ \`value\`.
Or c'est exactement l'objet que le programme lit à chaque frame. Il n'y a
aucune synchronisation à écrire, aucun callback à brancher.

C'est aussi pourquoi les uniforms d'OGL sont des objets \`{ value: ... }\` et non
des nombres nus : un nombre serait copié, un objet se partage.

## Deux formes de contrôle

Les nombres se branchent directement sur un uniform. Une couleur ou une case à
cocher, non : GLSL ne sait pas ce qu'est \`#3838ff\` ni ce qu'est \`true\`. Ces
deux-là se branchent sur un objet de réglages ordinaire, et un \`on('change')\`
convertit :

\`\`\`ts
panel.pane.addBinding(settings, 'grid')
  .on('change', (event) => {
    uniforms.uGrid.value = event.value ? 1 : 0
  })
\`\`\`

Les booléens deviennent 0.0 ou 1.0, puis servent dans un \`mix\`. Un
\`if (uGrid > 0.5)\` marcherait aussi, et coûterait presque rien : tous les
pixels prennent le même chemin. Ce qui coûte, c'est un \`if\` dont la condition
change d'un pixel à l'autre — les pixels voisins s'exécutent en groupe, et le
groupe paie alors les deux branches. Le \`mix\` évite de se poser la question.

## Le piège : dispose

\`createPanel\`, dans \`src/utils/panel.ts\`, fait une vingtaine de lignes, et la
seule qui compte est \`dispose()\`. Un panneau est du DOM, pas une ressource
WebGL, et ses moniteurs tournent sur des minuteries : sans \`dispose()\`, ils
continuent de tourner après la fin de l'étape, et personne ne les arrête pour
vous.

À partir d'ici, dès qu'une étape a un nombre qu'il vaut mieux sentir que lire,
elle vient avec un panneau. La
[documentation de Tweakpane](https://tweakpane.github.io/docs/input-bindings/)
liste tous les types de contrôles.`,

  resources: [
    { label: "Tweakpane", url: "https://tweakpane.github.io/docs/" },
    { label: "Tweakpane — Input bindings", url: "https://tweakpane.github.io/docs/input-bindings/" },
  ],
}

export default step
