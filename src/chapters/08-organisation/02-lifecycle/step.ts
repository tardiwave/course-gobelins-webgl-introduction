import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Lifecycle',

  insight: `Toutes les quelques secondes cette scène est jetée et reconstruite de zéro —
nouvelle géométrie, nouveaux programmes, nouvelles textures. Regardez le
compteur : le rendu ne bronche jamais.

## Le ramasse-miettes ne voit pas le GPU

C'est le point que personne ne devine. Une géométrie et un programme sont de la
mémoire **sur la carte graphique**, allouée par le pilote. JavaScript ne sait
pas qu'elle existe : lâcher la dernière référence à un objet OGL ne libère
rien du tout, et l'allocation reste pour toute la vie du contexte WebGL.

\`\`\`ts
dispose() {
  this.geometry.remove()   // partagée par 3 meshes
  this.ground.program.remove()
  this.clouds.program.remove()
  this.halo.program.remove()
}
\`\`\`

Symptôme typique : une application monopage qui ralentit au fil de la
navigation, puis un \`CONTEXT_LOST\` sans explication. La mémoire vidéo n'est
pas extensible.

Le contexte lui-même se libère aussi à la main. Retirer le canvas de la page
ne le détruit pas : il reste vivant jusqu'au passage du ramasse-miettes, et le
navigateur n'accepte qu'environ 16 contextes à la fois. Ce cours crée un
renderer par étape, donc chaque nettoyage finit par :

\`\`\`ts
gl.getExtension('WEBGL_lose_context')?.loseContext()
\`\`\`

Sans cette ligne, parcourez vite une vingtaine d'étapes et la console affiche
\`Too many active WebGL contexts\`. Dans une vraie application, le plus simple
reste de garder un seul renderer pour toute la vie de la page.

## La règle qui rend ça gérable

**Celui qui crée quelque chose est responsable de le libérer.** \`Planet\` libère
sa géométrie et ses trois programmes, \`Scene\` libère ses enfants, l'étape libère
la scène. Chaque niveau ne connaît que le sien.

Le corollaire : quand un objet en reçoit un autre en paramètre, il ne le libère
pas. Une texture passée de l'extérieur appartient à l'extérieur.

## Pourquoi chaque étape renvoie une fonction

\`\`\`ts
return () => {
  orbit.remove()
  scene.dispose()
  stop()
}
\`\`\`

Toutes les étapes de ce cours font ça depuis le début. Jusqu'ici elle ne
retirait que des écouteurs ; à partir de maintenant elle a du vrai travail, et
le compteur de cette page est là pour prouver qu'elle le fait bien.`,

  resources: [
    { label: "MDN — WebGL best practices", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices" },
  ],
}

export default step
