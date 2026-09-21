import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Per-particle attributes',
  required: true,

  insight: `## Un flottant casse l'uniformité

Deux mille particules identiques se lisent comme une texture, pas comme une
foule. Il suffit d'un attribut de plus :

\`\`\`ts
new Geometry(gl, {
  position: { size: 3, data: position },
  random: { size: 1, data: random },
})
\`\`\`

Un attribut n'est qu'un buffer parallèle à \`position\`. Comme une particule est
un sommet, tout ce qu'on y met devient une donnée par particule : taille,
couleur, vitesse, délai de démarrage, durée de vie. Ici un seul \`random\` pilote
à la fois la taille et la couleur, ce qui suffit presque toujours.

## Les tableaux doivent être alignés

Le GPU associe l'entrée *n* de chaque buffer au sommet *n*. Il n'y a pas de
clé, pas de vérification : si \`random\` a une entrée de moins que \`position\`,
vous ne verrez pas une erreur mais des valeurs décalées, ou du bruit en fin de
tableau. C'est à vous de garder les longueurs cohérentes.

Notez aussi le \`size: 1\` : c'est le nombre de composantes par sommet, pas le
nombre de sommets. OGL en déduit la longueur en divisant.

## Un varying qui n'interpole rien

\`vRandom\` est déclaré \`varying\` et pourtant sa valeur est constante sur tout le
carré. C'est normal : un point n'a **qu'un** sommet, donc il n'y a rien entre
quoi interpoler. Le mécanisme est le même, c'est la géométrie qui est
dégénérée.

Ça change dès qu'une particule cesse d'être un point : l'étape des cubes
instanciés en donne huit à chacune, et les varyings se remettent à interpoler.`,

  resources: [
    { label: "WebGL Fundamentals — How it works", url: "https://webglfundamentals.org/webgl/lessons/webgl-how-it-works.html" },
  ],
}

export default step
