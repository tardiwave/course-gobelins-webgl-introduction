import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Asteroid belt',
  required: true,

  insight: `La ceinture de particules carrées a disparu, remplacée par deux mille quatre
cents copies d'un modèle. \`BeltScene\` est devenue \`AsteroidsScene\`, et
\`new Belt(gl)\` y est devenu \`new Asteroids(gl)\`.

## Substituer, pas refactorer

Les deux objets sont des \`Transform\` avec un \`update\` et un \`dispose\`, donc la
scène n'a jamais eu besoin de savoir lequel elle tenait. C'est le retour sur
investissement du chapitre organisation, et c'est ce qui distingue une
interface d'une convention : personne n'a eu à se souvenir de quoi que ce soit.

## Une lumière partagée

\`\`\`ts
const sun = this.planet.light.value

this.asteroids.light.value.copy(sun)
\`\`\`

Les rochers copient le vecteur de la planète à chaque frame. Deux objets qui
calculent chacun leur direction de lumière finissent toujours par diverger — au
premier changement d'animation, au premier oubli. Une seule source, recopiée,
ne peut pas se tromper.

## La dérive par bruit

\`\`\`glsl
vec3 base = offset
          + asteroidDrift(offset, random, uTime);
\`\`\`

\`src/shaders/chunks/drift.glsl\` ajoute une lente oscillation par-dessus
l'orbite. Le détail
qui compte : la graine est la **position de repos** du rocher, pas son
\`random\`. Des voisins ont donc des graines voisines et dérivent ensemble, ce qui
se lit comme un courant dans la ceinture. Avec un random par rocher, on obtient
du bruit statistique, qui a l'air d'un bug.

Sa vitesse orbitale vient toujours du rayon **de repos**, sinon un rocher qui
part vers l'extérieur ralentirait et sortirait de la formation.

## Ce que ça coûte

La ceinture de points, c'était 4000 particules à un carré chacune. Ici c'est
2400 rochers à 1500 triangles chacun : près de mille fois plus de
géométrie, toujours un seul appel de dessin — mais ce n'est plus gratuit.

C'est la scène finale, donc elle vit dans \`src/scenes/AsteroidsScene.ts\` et tous
les chapitres suivants la rendent.`,

  resources: [
    { label: "WebGL Fundamentals — Instanced drawing", url: "https://webglfundamentals.org/webgl/lessons/webgl-instanced-drawing.html" },
    { label: "Asteroids Pack by Sebastian Sosnowski (CC BY)", url: "https://sketchfab.com/3d-models/asteroids-pack-rocky-version-adde1ecf129e4509be8af61b84bafa85" },
  ],
}

export default step
