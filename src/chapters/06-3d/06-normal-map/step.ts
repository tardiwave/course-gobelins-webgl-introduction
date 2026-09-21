import type { Step } from '../../../core/step.ts'

const step: Step = {
  title: 'Normal map',

  insight: `La géométrie a toujours 48 segments. Tout le relief que vous voyez désormais
vient d'une image.

## Une image qui contient des directions

Une normal map stocke un vecteur dans chaque pixel au lieu d'une couleur,
empaqueté dans le RGB :

\`\`\`glsl
vec3 mapped = texture2D(tNormal, vUv).rgb
            * 2.0 - 1.0;
\`\`\`

C'est pour ça qu'elle a cet air lavande : une zone plate vaut (0.5, 0.5, 1.0),
ce qui se remappe en (0, 0, 1) — droit sorti de la surface.

Conséquence pratique : **une normal map ne doit jamais être chargée en sRGB**.
C'est de la donnée, pas de la couleur ; lui appliquer une correction gamma fausse
tous les angles. C'est l'erreur la plus répandue du domaine.

## Le repère tangent

Ces directions sont relatives à la surface, pas au monde. « Droit sorti » ne
veut pas dire la même chose à l'équateur et au pôle. Le vertex shader construit
donc trois vecteurs par sommet — dehors, est, nord — et le fragment shader s'en
sert pour planter la direction de la carte sur la sphère :

\`\`\`glsl
vec3 normal = normalize(
    vTangent * mapped.x
  + vBitangent * mapped.y
  + vNormal * mapped.z
);
\`\`\`

Ce trio s'appelle un repère tangent (TBN). Sur un modèle importé il est
généralement fourni par l'exportateur ; ici on peut le construire à la main
parce qu'une sphère unité a une propriété commode : **la position d'un sommet
est déjà sa normale**.

## Deux pièges qui font un trou noir

\`cross()\` renvoie exactement zéro aux pôles, où la normale est parallèle à Y,
et \`normalize(vec3(0.0))\` vaut NaN. Un NaN dans une couleur donne un disque
noir, et rien dans la console. D'où l'axe de repli :

\`\`\`glsl
vec3 axis = abs(n.y) > 0.999
  ? vec3(0.0, 0.0, 1.0)
  : vec3(0.0, 1.0, 0.0);
\`\`\`

Et comme une carte équirectangulaire est écrasée à néant aux pôles, son détail
y est du bruit pur : \`vFade\` le fait disparaître progressivement.

Tirez le curseur de force. Au-delà de 1.0 la planète cesse de ressembler à une
planète : une normal map est un mensonge dont vous choisissez l'ampleur.`,

  resources: [
    { label: "Learn OpenGL — Normal mapping", url: "https://learnopengl.com/Advanced-Lighting/Normal-Mapping" },
    { label: "Polycount — Normal map", url: "http://wiki.polycount.com/wiki/Normal_map" },
  ],
}

export default step
