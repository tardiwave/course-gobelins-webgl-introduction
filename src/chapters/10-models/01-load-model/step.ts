import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Load a model',
  required: true,

  insight: `Tout ce qui a été dessiné jusqu'ici était une forme que le code savait décrire.
Un modèle est l'autre cas : les sommets de quelqu'un d'autre, qui arrivent sous
forme de fichier.

## glTF, et ce qu'on en prend

\`\`\`ts
const url = '/models/asteroids.glb'
const gltf = await GLTFLoader.load(gl, url)

const mesh = gltf.meshes[0]
const geometry = mesh.primitives[0].geometry
\`\`\`

glTF contient une scène entière : nœuds, meshes, matériaux, parfois des
animations et des squelettes. Le \`.glb\` est sa variante binaire — un en-tête,
un bloc JSON, un bloc de données — ce qui évite une requête par fichier.

On ne garde que la géométrie. Le fichier contient dix rochers, et
\`meshes[0]\` est le premier. Le \`primitives[0]\` n'est pas du bruit : un mesh
glTF peut être découpé en plusieurs primitives, une par matériau.

## Le chargement est asynchrone

La boucle de rendu ne l'attend pas : elle démarre sur une scène vide et le
modèle la rejoint à son arrivée. Ça veut dire que la fonction de nettoyage doit
supporter qu'on quitte l'étape **avant** que le fichier ne soit arrivé :

\`\`\`ts
let disposed = false

GLTFLoader.load(gl, url).then((gltf) => {
  if (disposed) return
  // ...
})
\`\`\`

Sans ce garde-fou, vous créez un mesh dans une scène déjà détruite — et comme
le contexte WebGL existe encore, ça ne plante même pas. Ça fuit.

## Les normales d'abord

Comme au chapitre 3D : avant de faire confiance à un modèle, vérifiez que sa
surface pointe là où vous le croyez. Un modèle exporté avec des faces inversées
ou des normales manquantes s'éclaire n'importe comment, et on cherche longtemps
du côté du shader.

Le modèle dans \`public/models\` est crédité dans CREDITS.md à côté.`,

  resources: [
    { label: "OGL — GLTFLoader source", url: "https://github.com/oframe/ogl/blob/master/src/extras/GLTFLoader.js" },
    { label: "Khronos — glTF 2.0 overview", url: "https://www.khronos.org/gltf/" },
  ],
}

export default step
