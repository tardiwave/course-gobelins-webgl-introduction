import { TextureLoader, type OGLRenderingContext, type Texture } from 'ogl'

// No mipmaps: any pixelation in this course comes from the shader, not the image.
export function loadTexture(gl: OGLRenderingContext, src: string, tile = false): Texture {
  return TextureLoader.load(gl, {
    src,
    minFilter: gl.LINEAR,
    magFilter: gl.LINEAR,
    generateMipmaps: false,
    // A map wraps around the sphere, so it loops horizontally.
    wrapS: gl.REPEAT,
    // Clamped vertically so the poles do not fold over. tile = true repeats both ways.
    wrapT: tile ? gl.REPEAT : gl.CLAMP_TO_EDGE,
  })
}
