import AWS from 'aws-sdk';

export default function handler(req, res) {
  const { file } = req.query; // fichier à downloader
  console.log(`file`, file);
  const credentials = new AWS.Credentials({
    accessKeyId: process.env.NEXT_AWS_ID,
    secretAccessKey: process.env.NEXT_AWS_SECRET,
  });
  const s3 = new AWS.S3({
    credentials,
  });
  // const buffer = Buffer.from(bufferSignal);
  const params = {
    Bucket: process.env.NEXT_AWS_BUCKET,
    Key: file,
    Expires: 60,
  };

  const preSignedUrl = s3.getSignedUrl('getObject', params);
  console.log(`preSignedUrl`, preSignedUrl);

  return res.status(200).json({ url: preSignedUrl });
}
