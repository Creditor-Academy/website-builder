import { DeleteObjectCommand, DeleteObjectsCommand, ListObjectsCommand, PutObjectCommand, S3 } from "@aws-sdk/client-s3";

class S3Service {
    private s3: S3;

    constructor() {
        this.s3 = new S3({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
            },
            region: process.env.AWS_REGION || "",
        });
    }

    // Upload file to S3 (given file and key)
    async uploadFileToS3(file: Express.Multer.File, key: string) {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        await this.s3.send(new PutObjectCommand(params));
    }

    // Delete file from S3 (given key)
    async deleteFileFromS3(key: string) {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        };
        await this.s3.send(new DeleteObjectCommand(params));
    }

    // Delete all files from S3 (given prefix)
    async deleteAllFilesFromS3(prefix: string) {
        const listObjectsParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: prefix,
        };
        const listObjectsResponse = await this.s3.send(new ListObjectsCommand(listObjectsParams));
        const objectKeys = listObjectsResponse.Contents?.map((object) => ({ Key: object.Key! }));

        if (!objectKeys || objectKeys.length === 0) return;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Delete: {
                Objects: objectKeys,
                Quiet: true,
            },
        };
        await this.s3.send(new DeleteObjectsCommand(params));
    }
}

export default S3Service;