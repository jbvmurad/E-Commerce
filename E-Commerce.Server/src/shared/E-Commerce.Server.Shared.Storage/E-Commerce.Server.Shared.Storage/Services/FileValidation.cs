using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;

namespace E_Commerce.Server.Shared.Storage.Services;

internal static class FileValidation
{
    private static readonly HashSet<string> ImageExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp"
    };

    private static readonly HashSet<string> DocumentExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".pdf",
        ".doc", ".docx",
        ".xls", ".xlsx",
        ".ppt", ".pptx",
        ".odt", ".ods", ".odp"
    };

    public static void ValidateImage(IFormFile media, ILocalizationService? lan = null)
    {
        if (media is null || media.Length == 0)
            throw ToValidationException(
                lan?.Get("Validation.FileRequired")
                ?? "Image file is required");

        if (!media.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            throw ToValidationException(
                lan?.Get("Validation.InvalidImageType")
                ?? "Only image files are allowed");

        var ext = Path.GetExtension(media.FileName).ToLowerInvariant();

        if (!ImageExtensions.Contains(ext))
            throw ToValidationException(
                lan?.Get("Validation.InvalidImageFormat")
                ?? "Unsupported image format. Use jpg/jpeg/png/webp");

        if (!HasValidImageMagicBytes(media))
            throw ToValidationException(
                lan?.Get("Validation.InvalidImageType")
                ?? "Only image files are allowed");
    }

    public static void ValidatePostMedia(IFormFile media, ILocalizationService? lan = null)
    {
        if (media is null || media.Length == 0)
            throw ToValidationException(
                lan?.Get("Validation.FileRequired")
                ?? "Media file is required");

        var ext = Path.GetExtension(media.FileName).ToLowerInvariant();

        var isImage = media.ContentType.StartsWith(
            "image/",
            StringComparison.OrdinalIgnoreCase);

        var isDocument = DocumentExtensions.Contains(ext);

        if (!isImage && !isDocument)
            throw ToValidationException(
                lan?.Get("Validation.InvalidFileType")
                ?? "Only image or document files are allowed");

        if (isDocument && media.Length > 100L * 1024 * 1024)
            throw ToValidationException(
                lan?.Get("Validation.DocumentTooLarge")
                ?? "Document is too large. Max 100MB");

        if (isImage && !HasValidImageMagicBytes(media))
            throw ToValidationException(
                lan?.Get("Validation.InvalidImageType")
                ?? "Only image files are allowed");

        if (isDocument && !HasValidDocumentMagicBytes(media, ext))
            throw ToValidationException(
                lan?.Get("Validation.InvalidFileType")
                ?? "Only image or document files are allowed");
    }

    private static bool HasValidImageMagicBytes(IFormFile file)
    {
        Span<byte> header = stackalloc byte[12];

        using var stream = file.OpenReadStream();

        var bytesRead = stream.Read(header);

        if (bytesRead < 4)
            return false;

        // JPEG: FF D8 FF
        if (header[0] == 0xFF
            && header[1] == 0xD8
            && header[2] == 0xFF)
        {
            return true;
        }

        // PNG: 89 50 4E 47 0D 0A 1A 0A
        if (header[0] == 0x89
            && header[1] == 0x50
            && header[2] == 0x4E
            && header[3] == 0x47)
        {
            return true;
        }

        // WebP: RIFF....WEBP
        if (bytesRead >= 12
            && header[0] == 0x52
            && header[1] == 0x49
            && header[2] == 0x46
            && header[3] == 0x46
            && header[8] == 0x57
            && header[9] == 0x45
            && header[10] == 0x42
            && header[11] == 0x50)
        {
            return true;
        }

        return false;
    }

    private static bool HasValidDocumentMagicBytes(IFormFile file, string ext)
    {
        Span<byte> header = stackalloc byte[8];

        using var stream = file.OpenReadStream();

        var bytesRead = stream.Read(header);

        if (bytesRead < 4)
            return false;

        // PDF: 25 50 44 46 (%PDF)
        if (header[0] == 0x25
            && header[1] == 0x50
            && header[2] == 0x44
            && header[3] == 0x46)
        {
            return true;
        }

        // OLE compound (doc, xls, ppt): D0 CF 11 E0
        if (header[0] == 0xD0
            && header[1] == 0xCF
            && header[2] == 0x11
            && header[3] == 0xE0)
        {
            return true;
        }

        // ZIP-based (docx, xlsx, pptx, odt, ods, odp): 50 4B 03 04
        if (header[0] == 0x50
            && header[1] == 0x4B
            && header[2] == 0x03
            && header[3] == 0x04)
        {
            return true;
        }

        return false;
    }

    public static ValidationException ToValidationException(string message)
    {
        if (string.IsNullOrWhiteSpace(message))
            message = "Validation failed";

        return new ValidationException(new[]
        {
            new ValidationFailure(string.Empty, message)
        });
    }
}