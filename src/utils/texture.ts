import { TextureLoader, type OGLRenderingContext, type Texture } from 'ogl'

/**
 * Loaded without mipmaps, so what you see is exactly what the shader read.
 * Any pixelation in this course comes from the shader rounding its
 * coordinates, never from the source image.
 */
export function loadTexture(gl: OGLRenderingContext, src: string, tile = false): Texture {
  return TextureLoader.load(gl, {
    src,
    minFilter: gl.LINEAR,
    magFilter: gl.LINEAR,
    generateMipmaps: false,
    // A map wraps around the sphere, so it always loops horizontally.
    wrapS: gl.REPEAT,
    // Vertically it must not, or the poles fold over. Pass tile = true for a
    // flat pattern meant to repeat both ways.
    wrapT: tile ? gl.REPEAT : gl.CLAMP_TO_EDGE,
  })
}
