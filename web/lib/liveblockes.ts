import { Liveblocks } from '@liveblocks/node';

const key = process.env.LIVEBLOCKS_SECRET_KEY;

if (!key) {
  throw new Error('Missing LIVEBLOCKS_SECRET_KEY');
}

const liveblocks = new Liveblocks({ secret: key });

export default liveblocks;