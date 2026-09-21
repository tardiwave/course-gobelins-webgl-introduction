import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: "Film grain",

  insight: `## Ce que le grain cache

Deux choses trahissent un rendu : le **banding**, ces marches visibles dans un
dégradé doux parce qu'un écran 8 bits n'a que 256 niveaux par canal, et les
surfaces trop propres pour être réelles.

Un bruit léger casse les deux. C'est la même raison pour laquelle on ajoute du
dithering dans les dégradés d'une interface.

## Il doit vivre dans les tons moyens

\`\`\`glsl
vec3 weights = vec3(0.299, 0.587, 0.114);
float luminance = dot(color, weights);

float window = smoothstep(0.08, 0.24, luminance)
             * smoothstep(1.0, 0.45, luminance);

color += grain * uAmount * window;
\`\`\`

Pulvérisé uniformément, le grain se lit comme de la neige télé posée sur
l'image. Le vrai grain argentique n'existe ni dans les noirs ni dans les hautes
lumières brûlées : les deux \`smoothstep\` dessinent cette fenêtre.

Le seuil bas à 0.08 n'est pas cosmétique — il doit dégager le fond du ciel, qui
est juste au-dessus du noir. Sans ça le grain grouille sur tout l'espace vide,
là où l'œil le voit le plus.

Les coefficients 0.299 / 0.587 / 0.114 sont la luminance
[Rec. 601](https://en.wikipedia.org/wiki/Rec._601) : l'œil est beaucoup plus
sensible au vert qu'au bleu, donc une moyenne simple donnerait une luminance
fausse.

## Le bruit doit bouger

\`\`\`glsl
float grain = hash(vUv + fract(uTime)) - 0.5;
\`\`\`

Sans le \`fract(uTime)\`, le motif est identique à chaque frame et se lit comme un
objectif sale. Avec, il se renouvelle et devient de la pellicule.

Le \`hash\` à base de \`sin\` est l'idiome standard en GLSL faute de générateur
aléatoire. Il n'est pas de très bonne qualité et son comportement varie d'un
GPU à l'autre, mais pour du grain c'est sans conséquence.

Montez le curseur à fond une fois pour voir où l'effet s'applique et où il se
retient, puis redescendez.`,

  resources: [
    { label: "The Book of Shaders — Random", url: "https://thebookofshaders.com/10/" },
  ],
}

export default step
