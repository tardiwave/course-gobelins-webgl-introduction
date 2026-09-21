import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Depth fog',

  insight: `Le côté lointain de l'anneau s'enfonce dans le fond au lieu d'être aussi net
que le côté proche. Comparez avec l'étape précédente : la géométrie est
identique, un seul uniform est passé de 0 à 1.

## Deux lignes, dans deux shaders

\`\`\`glsl
// vertex
vFog = smoothstep(3.0, 7.5, -viewPosition.z);

// fragment
color = mix(color, DARK, vFog * uFog);
\`\`\`

Le vertex shader sait déjà à quelle profondeur se trouve chaque particule :
c'est \`-viewPosition.z\`, le nombre même qui met la taille du point à l'échelle.
Il le range dans un varying, et le fragment shader s'en sert pour un \`mix\`.

## La couleur du brouillard n'est pas libre

Elle doit être la **couleur de fond**. Si elle diffère, les objets lointains
s'estompent vers quelque chose qui n'est pas là et l'illusion se casse
immédiatement. C'est pour ça que \`DARK\` est à la fois la constante de la
palette et la couleur passée à \`gl.clearColor\`.

## Les distances dépendent de la scène

3 et 7,5, parce que la ceinture est à environ 4 unités de la caméra. Ces
nombres n'ont aucune valeur universelle : reportez-les dans une autre scène et
le brouillard ne fera rien, ou dévorera tout.

C'est une des raisons pour lesquelles le brouillard se règle presque toujours à
l'œil, avec un panneau, plutôt qu'au calcul.

## Pourquoi c'est resté

C'est l'indice de profondeur le moins cher qui existe : une interpolation par
pixel, aucune lecture de texture, aucune passe supplémentaire. Il existait
comme interrupteur matériel dans OpenGL fixe, avant même qu'on puisse écrire un
shader, et three.js le propose toujours en une ligne.`,

  resources: [
    { label: "WebGL Fundamentals — Fog", url: "https://webglfundamentals.org/webgl/lessons/webgl-fog.html" },
  ],
}

export default step
