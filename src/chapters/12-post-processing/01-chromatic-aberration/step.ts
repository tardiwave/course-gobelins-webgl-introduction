import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: "Chromatic aberration",
  required: true,

  insight: `## Trois lectures, un canal chacune

\`\`\`glsl
vec2 offset = (vUv - 0.5) * 0.004;

vec3 color = vec3(
  texture2D(tScene, vUv + offset).r,
  texture2D(tScene, vUv).g,
  texture2D(tScene, vUv - offset).b
);
\`\`\`

Une lentille ne dévie pas toutes les longueurs d'onde de la même façon, donc le
rouge, le vert et le bleu atterrissent légèrement décalés — et d'autant plus
loin du centre, ce qui explique le \`vUv - 0.5\`.

## Pourquoi une passe séparée et pas dans le shader de la planète

Parce qu'à ce stade la scène est **une image**. L'effet ne sait rien de la
géométrie, des lumières, du nombre d'objets : il coûte trois lectures par pixel
d'écran, que la scène contienne un cube ou un million de triangles.

C'est la propriété qui définit le post-processing, et la raison pour laquelle
presque tous les effets d'ambiance d'un jeu vivent là.

## Le réglage

Poussez \`0.004\` à \`0.05\` pour voir ce que ça fait, puis redescendez. L'effet
marche mieux quand on n'arrive pas tout à fait à dire qu'il est là — au-delà,
ça ne ressemble plus à un objectif mais à une erreur d'encodage.

Une version plus fidèle échantillonne cinq ou sept fois le long de l'axe au
lieu de trois, pour éviter les franges dures sur les bords très contrastés.`,

  resources: [
    { label: "Wikipedia — Chromatic aberration", url: "https://en.wikipedia.org/wiki/Chromatic_aberration" },
  ],
}

export default step
