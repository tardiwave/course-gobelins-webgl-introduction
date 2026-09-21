import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'First points',
  required: true,

  insight: `## Une particule est un sommet

Le buffer est le même que celui d'une sphère — trois nombres par entrée. Seul
le mode de dessin change ce que le GPU en fait :

\`\`\`ts
new Mesh(gl, {
  mode: gl.POINTS,
  geometry: new Geometry(gl, {
    position: { size: 3, data: position },
    random: { size: 1, data: random },
  }),
  program,
})
\`\`\`

Au lieu de relier les sommets en triangles, il dessine un carré centré sur
chacun. Pas de géométrie supplémentaire, pas d'indices : deux mille particules
sont deux mille sommets.

## Le piège du premier essai

\`\`\`glsl
gl_PointSize = 5.0;
\`\`\`

Le vertex shader **doit** écrire \`gl_PointSize\`. Sinon la taille est
indéfinie : selon le GPU, rien n'est dessiné ou chaque point fait un pixel —
sans erreur ni avertissement. C'est la seule
variable obligatoire du pipeline que personne ne mentionne jamais.

Et cette taille est en **pixels écran**, pas en unités du monde. Pour l'instant
toutes les particules font la même taille quelle que soit leur distance, ce qui
ruine complètement la profondeur. L'étape suivante corrige ça.

## Ce qui n'est pas fait ici

Aucun arrondi dans le fragment shader, aucun \`gl_PointCoord\` : le point reste
le carré brut que le GPU nous donne. On y reviendra.

Tout ce qui suit est écrit comme le chapitre organisation l'a posé : l'objet
est une classe qui possède son buffer, son shader et son mouvement, et
\`main.ts\` se contente de construire une scène.`,

  resources: [
    { label: "MDN — WebGLRenderingContext.drawArrays", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays" },
  ],
}

export default step
