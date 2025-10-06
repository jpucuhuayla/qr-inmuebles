import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class S3Service {
  private client = new S3Client({
    region: process.env.AWS_REGION,
    // The SDK will automatically use AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from environment variables
  });
  private bucket = process.env.S3_BUCKET_NAME!;

  presignUpload(objectKey: string, contentType: string) {
    const cmd = new PutObjectCommand({ Bucket: this.bucket, Key: objectKey, ContentType: contentType });
    return getSignedUrl(this.client, cmd, { expiresIn: 300 });
  }
  presignDownload(objectKey: string) {
    const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: objectKey });
    return getSignedUrl(this.client, cmd, { expiresIn: 300 });
  }
  async delete(objectKey: string) {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: objectKey }));
  }
}
