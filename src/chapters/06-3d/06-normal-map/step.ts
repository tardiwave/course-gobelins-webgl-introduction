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

## Les pôles, gratuitement

Aux pôles, la direction « est » n'existe plus. On ne normalise donc pas la
tangente :

\`\`\`glsl
vec3 t = vec3(n.z, 0.0, -n.x);
\`\`\`

Sa longueur vaut 1 à l'équateur et 0 aux pôles. Le relief s'efface tout seul
là où la carte équirectangulaire est écrasée, et on évite le
\`normalize(vec3(0.0))\`, qui renvoie NaN et laisse un disque noir sans
aucune erreur dans la console.

Tirez le curseur de force. Au-delà de 1.0 la planète cesse de ressembler à une
planète : une normal map est un mensonge dont vous choisissez l'ampleur.`,

  resources: [
    { label: "Learn OpenGL — Normal mapping", url: "https://learnopengl.com/Advanced-Lighting/Normal-Mapping" },
    { label: "Polycount — Normal map", url: "http://wiki.polycount.com/wiki/Normal_map" },
  ],
}

export default step
