export async function GET(_: never, { params: { x, y, z } }: { params: { x: string; y: string; z: string } }) {
  const response = await fetch(`https://tiles.stadiamaps.com/tiles/alidade_smooth/${z}/${x}/${y}.png`, {
    referrer: 'https://voltfinder.berente.net',
  });

  if (response.ok) {
    return response;
  }

  return fetch(`https://tile.openstreetmap.fr/hot/${z}/${x}/${y}.png`);
}
