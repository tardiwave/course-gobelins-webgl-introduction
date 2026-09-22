import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Starter',
  required: true,

  insight: `Toutes les étapes précédentes tenaient dans un seul \`main.ts\`. Celle-ci est un
**starter** complet et autonome : son dossier n'importe rien du reste du
projet. Copiez-le tel quel, c'est un point de départ pour votre propre projet.

## Pourquoi maintenant

Tant qu'une étape ne contient qu'une idée, voir la plomberie vaut mieux que la
cacher. Ça cesse de marcher avec la planète du chapitre 3D : trois sphères qui
partagent une géométrie, une lumière et une horloge, plus quatre shaders, le
tout dans une seule fonction. Ces choses formaient déjà un paquet d'état et de
comportement, c'est-à-dire un objet.

## Où va quoi

\`\`\`text
main.ts      monte le canvas, lance la scène
core/        Canvas, Clock, Pointer, Viewport
geometries/  des Geometry (l'anneau)
objects/     des Mesh : Planet, Ring
scenes/      les assemblages
shaders/     un dossier par programme
utils/       lerp, damp
\`\`\`

On range par **nature**, pas par fonctionnalité. C'est la structure que vous
retrouverez dans la plupart des projets 3D, et celle du dossier \`src/\` que la
suite du cours utilise. La règle : n'y mettez rien « au cas où ». Attendez le
deuxième usage, c'est lui qui vous dit quelle est la bonne interface.

## Transform est le point d'accroche

\`\`\`ts
export class Planet extends Transform {
  light = { value: new Vec3(1, 0.4, 0.6) }
}
\`\`\`

[\`Transform\`](https://github.com/oframe/ogl/blob/master/src/core/Transform.js)
porte une position, une rotation et des enfants. En l'étendant, \`Planet\`
s'insère dans n'importe quelle scène avec \`setParent\`, et le renderer accepte
directement n'importe quel \`Transform\` comme racine. \`SpaceScene\` fait
pencher tout ce qu'elle contient vers le curseur en tournant sur elle-même :
la planète et l'anneau suivent parce que ce sont ses enfants.

Le piège que personne ne devine : \`light\` est un **objet** \`{ value }\`
passé tel quel aux trois programmes. OGL lit \`.value\` à chaque rendu, donc
modifier \`this.light.value\` met à jour les trois shaders d'un coup. Recréer
l'objet (\`this.light = { value: ... }\`) casserait ce lien sans erreur.

\`Scene\` n'est pas une classe de base mais un **contrat** (\`implements\`) :
on n'hérite que d'une seule classe, et c'est déjà \`Transform\`. \`Canvas\`
appelle \`update(clock)\` puis dessine, sans savoir quelle scène il fait tourner.
Les objets, eux, n'appellent jamais \`requestAnimationFrame\` eux-mêmes.

## Un amorti qui ne dépend pas de l'écran

\`\`\`ts
this.rotation.y = damp(this.rotation.y, target, 3, clock.delta)
\`\`\`

« Un seizième de l'écart par frame » va deux fois plus vite sur un écran
120 Hz. \`damp\` passe par \`delta\`, le temps écoulé depuis la frame
précédente, et une exponentielle : le mouvement est le même partout. \`Clock\` plafonne \`delta\` :
un onglet resté en arrière-plan revient avec plusieurs secondes d'écart.

## Le ramasse-miettes ne voit pas le GPU

Une géométrie et un programme sont de la mémoire **sur la carte graphique**.
JavaScript ne sait pas qu'elle existe : lâcher la dernière référence à un objet
OGL ne libère rien. D'où la règle : **celui qui crée quelque chose le libère.**
\`Planet\` libère sa géométrie et ses trois programmes, la scène libère ses
objets, \`main.ts\` libère la scène puis le canvas. Un objet reçu en paramètre,
comme le \`pointer\` de la scène, appartient à celui qui l'a créé.

Une exception : les textures. OGL n'a pas de \`texture.remove()\`, et
\`TextureLoader\` garde chaque image en cache selon son chemin. Recharger
\`earth.png\` rend la même texture au lieu d'en allouer une nouvelle. Pour
vraiment la libérer, il faut \`gl.deleteTexture(texture.texture)\`.

Le contexte lui-même se libère à la main. Retirer le canvas de la page ne le
détruit pas, et le navigateur n'en accepte qu'environ seize à la fois :

\`\`\`ts
gl.getExtension('WEBGL_lose_context')?.loseContext()
\`\`\`

Sans cette ligne, parcourez vite une vingtaine d'étapes et la console affiche
\`Too many active WebGL contexts\`.`,

  resources: [
    { label: 'OGL — Transform source', url: 'https://github.com/oframe/ogl/blob/master/src/core/Transform.js' },
    { label: 'MDN — WebGL best practices', url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices' },
    { label: 'Frame rate independent damping', url: 'https://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/' },
  ],
}

export default step
