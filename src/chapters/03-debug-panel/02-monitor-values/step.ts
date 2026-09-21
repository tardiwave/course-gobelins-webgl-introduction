import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Monitor values',

  insight: `Un panneau ne sert pas qu'à écrire. Ajoutez \`readonly: true\` et il lit ;
ajoutez \`view: 'graph'\` et il trace les dernières centaines de mesures.

\`\`\`ts
panel.pane.addBinding(readouts, 'frame', {
  readonly: true,
  view: 'graph',
  interval: 32,
  min: 0,
  max: 40,
})
\`\`\`

## Mesurer plutôt que deviner

Tirez le curseur « extra work ». Il fait faire au fragment shader jusqu'à 128
paires de sinus et cosinus inutiles par pixel, et le graphe grimpe d'un 16 ms
bien plat (8 ms sur un écran 120 Hz) vers quelque chose qui saccade. Rien d'autre n'a changé.

Le réflexe à retenir : quand un shader devient lent, le coût est presque
toujours **du travail par pixel multiplié par un écran plein de pixels**. Deux
millions de pixels fois une lecture de texture en plus, ça fait deux millions
de lectures en plus. Une optimisation qui ne change pas ce produit ne changera
rien.

## interval, et pourquoi il existe

Les moniteurs interrogent l'objet à leur propre rythme, pas au vôtre. 200 ms
convient pour un nombre qu'on lit, 32 ms pour un graphe qu'on regarde.
Interroger à chaque frame coûterait plus que ça n'apprend — et, plus subtil,
fausserait la mesure en ajoutant du travail DOM dans la boucle.

## Une contrainte de GLSL ES 1.00

Regardez la boucle du shader : la borne est la constante 128, et le curseur
décide seulement quand faire \`break\`.

\`\`\`glsl
for (int i = 0; i < 128; i++) {
  if (float(i) >= uLoad) break;
  // ...
}
\`\`\`

La spécification exige des nombres d'itérations que le compilateur peut
connaître à l'avance, pour pouvoir dérouler la boucle. « Une boucle qui tourne
n fois » s'écrit donc « une boucle qui tourne 128 fois et abandonne en route ».
C'est une des différences les plus déroutantes entre GLSL et un langage
ordinaire, et elle disparaît en WebGL 2.`,

  resources: [
    { label: "Tweakpane — Monitor bindings", url: "https://tweakpane.github.io/docs/monitor-bindings/" },
    { label: "MDN — requestAnimationFrame", url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame" },
  ],
}

export default step
