import os
import boto3
import botocore.session
from botocore.config import Config
from botocore.exceptions import ClientError


def _client():
    # session = botocore.session.Session()
    # session.set_config_variable("config_file", "/dev/null")
    # boto3_session = boto3.Session(botocore_session=session)
    return boto3.client(
        "s3",
        aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
        region_name=os.environ.get("AWS_REGION"),
        config=Config(signature_version="s3v4"),
    )


def upload_file(local_path: str, bucket: str, key: str, content_type: str | None = None) -> str:
    """Upload a local file to S3. Returns the S3 URI (s3://bucket/key)."""
    extra = {"ContentType": content_type} if content_type else {}
    _client().upload_file(local_path, bucket, key, ExtraArgs=extra or None)
    return f"s3://{bucket}/{key}"


def upload_bytes(data: bytes, bucket: str, key: str, content_type: str | None = None) -> str:
    """Upload raw bytes to S3. Returns the S3 URI (s3://bucket/key)."""
    client = _client()
    kwargs = {"Body": data, "Bucket": bucket, "Key": key}
    if content_type:
        kwargs["ContentType"] = content_type
    obj = client.put_object(**kwargs)
    head = client.head_object(Bucket=bucket, Key=key)
    print(client, obj, head)
    return f"s3://{bucket}/{key}"


def download_file(bucket: str, key: str, local_path: str) -> None:
    """Download an S3 object to a local file."""
    _client().download_file(bucket, key, local_path)


def fetch_bytes(bucket: str, key: str) -> bytes:
    """Fetch an S3 object and return its contents as bytes."""
    response = _client().get_object(Bucket=bucket, Key=key)
    return response["Body"].read()


def get_presigned_url(bucket: str, key: str, expires_in: int = 3600) -> str:
    """Generate a presigned GET URL for an S3 object."""
    return _client().generate_presigned_url(
        "get_object",
        Params={"Bucket": bucket, "Key": key},
        ExpiresIn=expires_in,
    )


def object_exists(bucket: str, key: str) -> bool:
    """Return True if the object exists in S3, False otherwise."""
    try:
        _client().head_object(Bucket=bucket, Key=key)
        return True
    except ClientError as e:
        if e.response["Error"]["Code"] == "404":
            return False
        raise
