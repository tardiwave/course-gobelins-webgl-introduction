import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Perlin noise',

  insight: `## GLSL n'a pas de rand()

Aucune fonction aléatoire, aucun générateur, aucun état. Ce qu'on utilise à la
place est un **hash** : une fonction qui mélange assez ses entrées pour que ses
sorties paraissent quelconques, tout en restant parfaitement déterministe.

\`\`\`glsl
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)),
           dot(p, vec2(269.5, 183.3)));

  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
\`\`\`

Déterministe est exactement ce qu'il faut : le même point donne toujours la
même valeur, donc l'image ne grésille pas d'une frame à l'autre et deux pixels
voisins peuvent être calculés indépendamment.

Le revers, qu'il faut connaître : ce hash repose sur les décimales de \`sin\`,
qui ne sont pas garanties identiques d'un GPU à l'autre. Pour du visuel c'est
sans conséquence ; pour une simulation qui doit donner le même résultat
partout, il faut un hash entier.

## Du bruit, pas du grain

Un hash pur donne de la neige. Perlin donne du **bruit cohérent** : des valeurs
qui varient doucement, donc qui ressemblent à quelque chose.

L'idée tient en une phrase : une **direction** aléatoire à chaque coin d'une
grille, et la valeur en un point mesure à quel point ce point est d'accord avec
les quatre coins qui l'entourent — d'où les quatre \`dot\`.

## Le détail qui enlève la grille

\`\`\`glsl
vec2 blend = l * l * l * (l * (l * 6.0 - 15.0) + 10.0);
\`\`\`

C'est un smootherstep, pas un \`smoothstep\`. Sa dérivée **seconde** s'annule
aussi aux extrémités, alors que celle de \`smoothstep\` ne s'annule pas. Avec un
\`smoothstep\` ordinaire on voit la grille apparaître en filigrane dès qu'on
éclaire le résultat ou qu'on en prend la pente.

C'est [la correction que Perlin a lui-même apportée en
2002](https://mrl.cs.nyu.edu/~perlin/paper445.pdf) à sa version de 1985.

## Une octave ne suffit pas

Ce bruit est doux et régulier — il lui manque le détail. L'étape suivante
l'empile à plusieurs échelles, et c'est cet empilement qui sert à fabriquer
des terrains, des nuages et des matières dans tout le reste du cours.`,

  resources: [
    { label: "The Book of Shaders — Noise", url: "https://thebookofshaders.com/11/" },
    { label: "Inigo Quilez — Gradient noise", url: "https://iquilezles.org/articles/gradientnoise/" },
  ],
}

export default step
