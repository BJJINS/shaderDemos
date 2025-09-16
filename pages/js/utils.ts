export async function loadImage(url: string) {
  return new Promise(resolve => {
    const image = new Image();

    // CROSS_ORIGIN
    // https://webgl2fundamentals.org/webgl/lessons/webgl-cors-permission.html
    try {
      if ((new URL(url)).host !== location.host) {
        image.crossOrigin = '';
      }
    } catch (_e) {}

    image.onload = function() {
      resolve(image);
    };
    image.src = url;
  })
}