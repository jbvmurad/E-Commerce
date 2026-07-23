using Microsoft.AspNetCore.Http;
using SkiaSharp;

namespace E_Commerce.Server.Shared.Storage.Services;

internal static class MediaOptimization
{
    private const int DefaultJpegQuality = 90;
    private const int MinimumJpegQuality = 45;

    public static async Task<byte[]> OptimizeImageAsync(
        IFormFile media,
        int maxDimension,
        long targetMaxBytes,
        CancellationToken cancellationToken)
    {
        byte[] imageData;

        await using (var input = media.OpenReadStream())
        {
            using var buffer = new MemoryStream();

            await input.CopyToAsync(buffer, cancellationToken);

            imageData = buffer.ToArray();
        }

        using var original = LoadWithOrientation(imageData);

        var currentMaxDimension =
            Math.Min(
                maxDimension,
                Math.Max(original.Width, original.Height));

        var minimumDimension =
            Math.Max(
                1,
                (int)(currentMaxDimension * 0.10));

        byte[]? bestBytes = null;
        long bestDistance = long.MaxValue;

        while (currentMaxDimension >= minimumDimension)
        {
            using var working =
                ResizeBitmap(original, currentMaxDimension);

            var encoded =
                EncodeOptimizedJpeg(
                    working,
                    targetMaxBytes);

            var distance =
                Math.Abs(
                    encoded.LongLength - targetMaxBytes);

            if (bestBytes is null
                || encoded.LongLength < bestBytes.LongLength
                || distance < bestDistance)
            {
                bestBytes = encoded;
                bestDistance = distance;
            }

            if (encoded.LongLength <= targetMaxBytes)
            {
                return encoded;
            }

            currentMaxDimension =
                (int)Math.Floor(
                    currentMaxDimension * 0.85);
        }

        return bestBytes
            ?? throw FileValidation.ToValidationException(
                "Image could not be processed.");
    }

    private static SKBitmap LoadWithOrientation(byte[] data)
    {
        var bitmap =
            SKBitmap.Decode(data)
            ?? throw FileValidation.ToValidationException(
                "Image could not be decoded.");

        using var ms = new MemoryStream(data);
        using var codec = SKCodec.Create(ms);

        if (codec is null)
        {
            return bitmap;
        }

        return ApplyExifOrientation(
            bitmap,
            codec.EncodedOrigin);
    }

    private static SKBitmap ApplyExifOrientation(
        SKBitmap bitmap,
        SKEncodedOrigin origin)
    {
        switch (origin)
        {
            case SKEncodedOrigin.TopLeft:
            default:
                return bitmap;

            case SKEncodedOrigin.BottomRight:
                {
                    var dst =
                        new SKBitmap(
                            bitmap.Width,
                            bitmap.Height);

                    using var canvas = new SKCanvas(dst);

                    canvas.Clear();
                    canvas.Translate(
                        bitmap.Width,
                        bitmap.Height);

                    canvas.RotateDegrees(180);
                    canvas.DrawBitmap(bitmap, 0, 0);

                    bitmap.Dispose();

                    return dst;
                }

            case SKEncodedOrigin.RightTop:
                {
                    var dst =
                        new SKBitmap(
                            bitmap.Height,
                            bitmap.Width);

                    using var canvas = new SKCanvas(dst);

                    canvas.Clear();
                    canvas.Translate(bitmap.Height, 0);
                    canvas.RotateDegrees(90);
                    canvas.DrawBitmap(bitmap, 0, 0);

                    bitmap.Dispose();

                    return dst;
                }

            case SKEncodedOrigin.LeftBottom:
                {
                    var dst =
                        new SKBitmap(
                            bitmap.Height,
                            bitmap.Width);

                    using var canvas = new SKCanvas(dst);

                    canvas.Clear();
                    canvas.Translate(0, bitmap.Width);
                    canvas.RotateDegrees(-90);
                    canvas.DrawBitmap(bitmap, 0, 0);

                    bitmap.Dispose();

                    return dst;
                }

            case SKEncodedOrigin.TopRight:
                {
                    var dst =
                        new SKBitmap(
                            bitmap.Width,
                            bitmap.Height);

                    using var canvas = new SKCanvas(dst);

                    canvas.Clear();

                    canvas.Scale(
                        -1,
                        1,
                        bitmap.Width / 2f,
                        bitmap.Height / 2f);

                    canvas.DrawBitmap(bitmap, 0, 0);

                    bitmap.Dispose();

                    return dst;
                }

            case SKEncodedOrigin.BottomLeft:
                {
                    var dst =
                        new SKBitmap(
                            bitmap.Width,
                            bitmap.Height);

                    using var canvas = new SKCanvas(dst);

                    canvas.Clear();

                    canvas.Scale(
                        1,
                        -1,
                        bitmap.Width / 2f,
                        bitmap.Height / 2f);

                    canvas.DrawBitmap(bitmap, 0, 0);

                    bitmap.Dispose();

                    return dst;
                }

            case SKEncodedOrigin.LeftTop:
                {
                    var dst =
                        new SKBitmap(
                            bitmap.Height,
                            bitmap.Width);

                    using var canvas = new SKCanvas(dst);

                    canvas.Clear();
                    canvas.Translate(bitmap.Height, 0);
                    canvas.RotateDegrees(90);

                    canvas.Scale(
                        -1,
                        1,
                        bitmap.Height / 2f,
                        bitmap.Width / 2f);

                    canvas.DrawBitmap(bitmap, 0, 0);

                    bitmap.Dispose();

                    return dst;
                }

            case SKEncodedOrigin.RightBottom:
                {
                    var dst =
                        new SKBitmap(
                            bitmap.Height,
                            bitmap.Width);

                    using var canvas = new SKCanvas(dst);

                    canvas.Clear();
                    canvas.Translate(0, bitmap.Width);
                    canvas.RotateDegrees(-90);

                    canvas.Scale(
                        -1,
                        1,
                        bitmap.Height / 2f,
                        bitmap.Width / 2f);

                    canvas.DrawBitmap(bitmap, 0, 0);

                    bitmap.Dispose();

                    return dst;
                }
        }
    }

    private static SKBitmap ResizeBitmap(
        SKBitmap source,
        int maxDimension)
    {
        if (source.Width <= maxDimension
            && source.Height <= maxDimension)
        {
            return source.Copy();
        }

        var scale =
            Math.Min(
                (double)maxDimension / source.Width,
                (double)maxDimension / source.Height);

        var newWidth =
            Math.Max(
                1,
                (int)(source.Width * scale));

        var newHeight =
            Math.Max(
                1,
                (int)(source.Height * scale));

        return source.Resize(
            new SKImageInfo(
                newWidth,
                newHeight),
            new SKSamplingOptions(
                SKCubicResampler.Mitchell))
            ?? throw FileValidation.ToValidationException(
                "Image could not be resized.");
    }

    private static byte[] EncodeOptimizedJpeg(
        SKBitmap bitmap,
        long targetMaxBytes)
    {
        byte[]? bestBytes = null;
        long bestDistance = long.MaxValue;

        SKBitmap workBitmap;

        if (bitmap.ColorType != SKColorType.Rgba8888
            && bitmap.ColorType != SKColorType.Rgb888x)
        {
            workBitmap =
                new SKBitmap(
                    bitmap.Width,
                    bitmap.Height,
                    SKColorType.Rgba8888,
                    SKAlphaType.Premul);

            using var tempCanvas =
                new SKCanvas(workBitmap);

            tempCanvas.Clear();
            tempCanvas.DrawBitmap(bitmap, 0, 0);
        }
        else
        {
            workBitmap = bitmap;
        }

        using var image =
            SKImage.FromBitmap(workBitmap);

        if (workBitmap != bitmap)
        {
            workBitmap.Dispose();
        }

        if (image is null)
        {
            throw FileValidation.ToValidationException(
                "Image could not be processed.");
        }

        for (var quality = DefaultJpegQuality;
             quality >= MinimumJpegQuality;
             quality -= 7)
        {
            using var data =
                image.Encode(
                    SKEncodedImageFormat.Jpeg,
                    quality);

            if (data is null)
            {
                continue;
            }

            var bytes = data.ToArray();

            var distance =
                Math.Abs(
                    bytes.LongLength - targetMaxBytes);

            if (bestBytes is null
                || bytes.LongLength < bestBytes.LongLength
                || distance < bestDistance)
            {
                bestBytes = bytes;
                bestDistance = distance;
            }

            if (bytes.LongLength <= targetMaxBytes)
            {
                return bytes;
            }
        }

        return bestBytes
            ?? throw FileValidation.ToValidationException(
                "Image could not be processed.");
    }
}

