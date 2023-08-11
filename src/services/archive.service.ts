import * as yauzl from 'yauzl';
import { promisify } from 'util';

const zipFromBuffer = promisify(yauzl.fromBuffer.bind(yauzl)); // TODO: use https://www.npmjs.com/package/unzipper

export async function unzipArchive(data: Buffer) {
    const zipArchive: yauzl.ZipFile = await zipFromBuffer(data, { lazyEntries: true });
    const openReadStream = promisify(zipArchive.openReadStream.bind(zipArchive));

    zipArchive.readEntry();

    const files: { path: string; content: string }[] = [];

    zipArchive.on('entry', async (entry: yauzl.Entry) => {
        if (!entry.fileName || !entry.fileName.length || entry.fileName[entry.fileName.length - 1] === '/') {
            zipArchive.readEntry();
            return;
        }
        const fileName = `/${entry.fileName}`;
        const stream = await openReadStream(entry);
        const buffers = [];

        for await (const data of stream) {
            buffers.push(data);
        }

        const buffer = Buffer.concat(buffers);
        const file = buffer.toString('utf-8');

        files.push({
            path: fileName,
            content: file,
        });

        zipArchive.readEntry();
    });

    await new Promise((resolve) => zipArchive.on('end', resolve));

    return files;
}