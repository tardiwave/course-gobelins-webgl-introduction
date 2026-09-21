import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Light direction',
  required: true,

  insight: `Une ligne transforme un autocollant plat en planète :

\`\`\`glsl
float light = max(
  dot(normalize(vNormal), normalize(uLight)),
  0.0
);
\`\`\`

## Le produit scalaire

Entre deux vecteurs **normalisés**, \`dot\` vaut le cosinus de l'angle qui les
sépare : 1 quand la surface fait face à la lumière, 0 quand elle est de profil,
négatif quand elle lui tourne le dos. \`max\` jette la moitié négative, et cette
frontière est le terminateur que vous voyez balayer le globe.

Le « normalisés » n'est pas décoratif : \`dot\` renvoie le cosinus **multiplié
par les deux longueurs**. Un vecteur non normalisé donne un éclairage trop
fort ou trop faible sans autre symptôme, et c'est très pénible à diagnostiquer.

Cette loi porte un nom, le
[cosinus de Lambert](https://fr.wikipedia.org/wiki/Loi_de_Lambert), et elle
décrit correctement presque toutes les surfaces mates.

## Il n'y a aucun objet lumière

\`uLight\` est une direction, trois nombres, et c'est sincèrement tout ce qu'est
une lumière directionnelle : le soleil est assez loin pour que ses rayons
arrivent parallèles. Pas de position, pas d'atténuation, pas de portée.

WebGL ne fournit **aucune** notion de lumière. Tout ce que font les moteurs 3D
dans ce domaine est du code que quelqu'un a écrit dans un shader. Le helper
d'axes n'est là que pour voir où ces trois nombres pointent.

## L'ambiante est une triche

Mettez-la à zéro dans le panneau : la face nuit devient parfaitement noire, ce
qui est physiquement correct et paraît faux. Dans la réalité, la lumière rebondit
partout. Simuler ces rebonds coûte très cher, donc presque tous les moteurs
ajoutent une constante — ici 0.06 — et l'appellent ambiante.

Tirez le curseur d'angle avec la rotation coupée : voir le terminateur se
déplacer pendant qu'on change un seul nombre vaut mieux que n'importe quelle
explication.`,

  resources: [
    { label: "WebGL Fundamentals — Directional lighting", url: "https://webglfundamentals.org/webgl/lessons/webgl-3d-lighting-directional.html" },
    { label: "Wikipedia — Lambert's cosine law", url: "https://en.wikipedia.org/wiki/Lambert%27s_cosine_law" },
  ],
}

export default step
