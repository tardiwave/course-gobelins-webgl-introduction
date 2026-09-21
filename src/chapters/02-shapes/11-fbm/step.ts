import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'fbm',

  insight: `## Additionner la même chose à plusieurs échelles

\`\`\`glsl
float fbm(vec2 p) {
  float total = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < 5; i++) {
    total += perlin(p) * amplitude;

    p *= 2.0;
    amplitude *= 0.5;
  }

  return total;
}
\`\`\`

Cinq fois le même bruit, chaque fois deux fois plus serré et deux fois moins
fort. C'est tout ce qu'est le **fractal Brownian motion**, et c'est la recette
derrière la quasi-totalité des terrains, nuages, fumées et matières
procédurales que vous croiserez.

Chaque passage s'appelle une **octave**, par analogie avec la musique : on
double la fréquence à chaque fois.

## Les deux nombres à connaître

Le facteur de fréquence (ici 2.0) s'appelle la **lacunarité**, le facteur
d'amplitude (ici 0.5) le **gain**. Avec ce couple, l'amplitude de chaque
octave est inversement proportionnelle à sa fréquence : c'est le profil
statistique de beaucoup de reliefs naturels, et c'est pour ça que ces deux
valeurs sont le réglage par défaut partout.

Montez le gain vers 0.7 et le résultat devient rugueux et bruyant ; descendez
vers 0.3 et il redevient lisse, presque une seule octave.

## Ce que ça coûte

Cinq évaluations de bruit par pixel au lieu d'une. Ajouter des octaves
n'apporte plus rien dès que la plus fine descend sous la taille d'un pixel :
elle ne fait alors qu'ajouter du scintillement quand l'image bouge. Quatre ou
cinq est la fourchette habituelle.

## La borne de boucle

\`for (int i = 0; i < 5; i++)\` — 5 est une constante, pas un uniform. GLSL ES
1.00 exige des nombres d'itérations que le compilateur peut connaître à
l'avance ; un nombre d'octaves réglable s'écrit avec un \`break\`, exactement
comme à l'étape Monitor values.

Le chapitre des vertex shaders reprend ce \`fbm\` en 3D pour sculpter une
planète entière.`,

  resources: [
    { label: "Inigo Quilez — fBm", url: "https://iquilezles.org/articles/fbm/" },
    { label: "The Book of Shaders — Fractal Brownian Motion", url: "https://thebookofshaders.com/13/" },
  ],
}

export default step
