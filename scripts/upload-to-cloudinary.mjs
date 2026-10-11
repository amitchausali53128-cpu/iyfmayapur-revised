import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const sourceDirectories = [
  { directory: path.join(projectRoot, 'public'), prefix: '' },
  { directory: path.join(projectRoot, 'src', 'assets'), prefix: 'assets' },
];
const targetFolder = 'mayapur/mayapur';

const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('Missing Cloudinary credentials. Set the following in your .env file:');
  console.error('VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name');
  console.error('CLOUDINARY_API_KEY=your_api_key');
  console.error('CLOUDINARY_API_SECRET=your_api_secret');
  process.exit(1);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
  timeout: 120000,
});

function getFilesRecursively(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...getFilesRecursively(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function getSourcePath(filePath, prefix) {
  const sourcePath = prefix
    ? path.relative(path.join(projectRoot, 'src', 'assets'), filePath).split(path.sep).join('/')
    : path.relative(path.join(projectRoot, 'public'), filePath).split(path.sep).join('/');

  return prefix ? `${prefix}/${sourcePath}` : sourcePath;
}

async function uploadFile(filePath, prefix) {
  const relativePath = getSourcePath(filePath, prefix);
  const publicIdWithoutExtension = relativePath.replace(/\.[^/.]+$/, '');
  const publicId = `${targetFolder}/${publicIdWithoutExtension}`;

  await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    resource_type: 'image',
    overwrite: true,
    invalidate: true,
  });

  console.log(`Uploaded: ${relativePath} -> ${publicId}`);
}

async function main() {
  const files = sourceDirectories.flatMap(({ directory, prefix }) => {
    if (!fs.existsSync(directory)) {
      console.error(`Image directory not found: ${directory}`);
      process.exitCode = 1;
      return [];
    }

    return getFilesRecursively(directory)
      .filter((file) => /\.(png|jpe?g|webp|gif|svg|avif|bmp)$/i.test(file))
      .filter((file) => path.basename(file).toLowerCase() !== 'temple.webp')
      .map((file) => ({ file, prefix }));
  });

  if (!files.length) {
    console.warn('No image files found in configured image directories');
    return;
  }

  console.log(`Uploading ${files.length} files to Cloudinary folder: ${targetFolder}`);

  let failedUploads = 0;

  for (const { file, prefix } of files) {
    try {
      await uploadFile(file, prefix);
    } catch (error) {
      failedUploads += 1;
      console.error(`Failed to upload ${getSourcePath(file, prefix)}`);
      console.error(error.message || error);
    }
  }

  if (failedUploads) {
    console.error(`Bulk upload completed with ${failedUploads} failure(s).`);
    process.exitCode = 1;
    return;
  }

  console.log('Bulk upload completed successfully.');
}

main();
