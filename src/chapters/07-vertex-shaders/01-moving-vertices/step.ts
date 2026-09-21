import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Moving vertices',
  required: true,

  insight: `Le vertex shader tourne depuis le chapitre 3D, et tout ce qu'on lui a jamais
demandé c'est de projeter. Il peut aussi déplacer les choses — et c'est le
**seul** endroit où c'est possible, puisqu'un fragment shader n'a aucune idée
du sommet dont il provient.

## Deux lignes

\`\`\`glsl
float height = sin(position.y * 8.0 + uTime);
vec3 displaced = position
               + normal * height * uAmplitude;
\`\`\`

Calculer une hauteur, puis pousser la position le long de sa normale. **Le long
de la normale** précisément : c'est ce qui fait gonfler une surface au lieu de
la faire glisser de côté. Pousser le long de Y donnerait un cisaillement.

## Le maillage est la limite

Un vertex shader ne peut déplacer que les sommets qui existent. Cette sphère a
96 segments là où le reste du cours en utilise 48 ; descendez à 12 et la vague
devient un polygone.

C'est la différence fondamentale avec un fragment shader : le fragment shader a
un pixel de résolution, le vertex shader a la résolution que vous lui avez
donnée. Aucun lissage ne viendra rattraper un maillage trop grossier — et
inversement, une sphère à 300 segments coûte cher même si personne ne la
regarde de près.

## Ce qui est déjà cassé

Regardez l'éclairage : il n'a pas bougé. Les normales décrivent toujours une
sphère parfaite, parce qu'elles ont été calculées par OGL au moment de créer la
géométrie, avant que votre shader n'existe.

Déplacer un sommet ne déplace pas sa normale, et rien dans WebGL ne s'en rend
compte. L'étape suivante répare ça.`,

  resources: [
    { label: "WebGL Fundamentals — How it works", url: "https://webglfundamentals.org/webgl/lessons/webgl-how-it-works.html" },
  ],
}

export default step
