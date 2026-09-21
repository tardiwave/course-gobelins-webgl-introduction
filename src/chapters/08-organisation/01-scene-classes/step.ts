import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Scene classes',
  required: true,

  insight: `La même image qu'à la fin du chapitre 3D, et le \`main.ts\` de l'étape tient en
vingt-cinq lignes. Rien n'a été supprimé : tout a déménagé dans les dossiers
partagés de \`src/\`, qu'il vaut la peine d'ouvrir à côté de celui-ci.

## Pourquoi maintenant

Jusqu'ici chaque étape était un fichier autonome : son renderer, sa boucle, ses
textures, tout écrit sur place, comme un exemple OGL. C'était volontaire —
tant qu'une étape ne contient qu'une idée, voir la plomberie vaut mieux que la
cacher.

Ça a cessé de marcher à l'étape des nuages : trois sphères partageant une
géométrie, un vecteur de lumière et une horloge, plus quatre shaders, le tout
dans une seule fonction.

Ces choses formaient déjà un paquet d'état et de comportement. C'est la
définition d'un objet.

## Transform est le point d'accroche

\`\`\`ts
export class Planet extends Transform {
  light = { value: new Vec3(1, 0.4, 0.6) }

  update(time: number) { /* ... */ }
  dispose() { /* ... */ }
}
\`\`\`

\`Transform\` est la classe d'OGL qui porte une position, une rotation et une
liste d'enfants. En l'étendant, \`Planet\` devient quelque chose qu'on insère
dans n'importe quelle scène avec \`setParent\`, qu'on fait tourner, qu'on imbrique.

Le graphe de scène n'est pas une abstraction du moteur : c'est juste des
matrices multipliées de parent en enfant. \`Scene\` est la même idée un cran
au-dessus, avec un \`update\` et un \`dispose\` en plus.

## Où va quoi

Le code partagé est rangé par nature, et c'est une structure que vous
retrouverez dans la plupart des projets 3D :

\`\`\`text
src/core/        canvas, horloge, pointeur, viewport, type Scene
src/utils/       textures, panneau de debug
src/geometries/  des Geometry
src/shaders/     un dossier par programme, + chunks/
src/objects/     des Mesh et des Transform
src/scenes/      les assemblages
\`\`\`

La règle : n'y mettez rien « au cas où ». Attendez le deuxième usage, c'est lui
qui vous dit quelle est la bonne interface. Ce qui reste dans l'étape, c'est le
sujet de l'étape.

## Un type plutôt qu'une classe de base

\`\`\`ts
export interface Scene {
  update(time: number): void
  dispose(): void
}
\`\`\`

\`Scene\` n'est pas une classe dont on hérite mais un **contrat** qu'on
implémente. Les scènes étendent déjà \`Transform\` — et on n'hérite que d'une
seule classe — donc le contrat passe par \`implements\`.

C'est aussi plus honnête : ce qui compte n'est pas de partager du code, c'est
que \`main.ts\` puisse appeler \`update\` et \`dispose\` sans savoir sur quoi.

À partir d'ici, tout est construit comme ça.`,

  resources: [
    { label: "OGL — Transform source", url: "https://github.com/oframe/ogl/blob/master/src/core/Transform.js" },
  ],
}

export default step
