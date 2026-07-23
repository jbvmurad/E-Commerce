using AutoMapper;
using E_Commerce.Server.Shared.Caching.Abstraction;
using E_Commerce.Server.Shared.Localization.Localizations;
using E_Commerce.Server.Shared.Storage.Services;
using GenericRepository;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Profile.Application.Features.ProfileAttributeFeatures.ProfileFeatures.Commands.UpdateProfile;
using Profile.Application.Services.ProfileAttributeServices;
using Profile.Domain.DTOs.ProfileAttributeDTOs;
using Profile.Domain.DTOs.SystemDTOs;
using Profile.Domain.Entities.ProfileAttributeEntities;
using Profile.Domain.Repositories.ProfileAttributeRepositories;
using System.Security.Claims;

namespace Profile.Persistance.Services.ProfileAttributeServices;

public sealed class ProfileService : IProfileService
{
    private static readonly TimeSpan ProfileCacheDuration = TimeSpan.FromMinutes(10);

    private readonly IProfileRepository _profileRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IFileStorage _fileStorage;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ICacheService _cacheService;
    private readonly ILocalizationService _lan;

    public ProfileService(
        IProfileRepository profileRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IFileStorage fileStorage,
        IHttpContextAccessor httpContextAccessor,
        ICacheService cacheService,
        ILocalizationService lan)
    {
        _profileRepository = profileRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _fileStorage = fileStorage;
        _httpContextAccessor = httpContextAccessor;
        _cacheService = cacheService;
        _lan = lan;
    }

    public async Task<ProfileResponse> GetMyProfileAsync(CancellationToken cancellationToken)
    {
        var user = GetCurrentUser();
        var cacheKey = ProfileCacheKey(user.UserId);

        return await _cacheService.GetOrSetAsync(
            cacheKey,
            async () =>
            {
                var profile = await EnsureProfileAsync(user, cancellationToken);
                return _mapper.Map<ProfileResponse>(profile);
            },
            ProfileCacheDuration,
            cancellationToken);
    }

    public async Task UpdateMyProfileAsync(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        var user = GetCurrentUser();
        var profile = await EnsureProfileAsync(user, cancellationToken);
        var oldImageUrl = profile.ImageUrl;
        var oldFullName = profile.FullName;
        var oldPhoneNumber = profile.PhoneNumber;

        _mapper.Map(request, profile);

        if (string.IsNullOrWhiteSpace(request.FullName))
            profile.FullName = oldFullName;

        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
            profile.PhoneNumber = oldPhoneNumber;

        if (request.RemoveImage)
        {
            profile.ImageUrl = null;
        }
        else if (request.Image is not null)
        {
            profile.ImageUrl = await _fileStorage.SaveImageAsync(
                request.Image,
                cancellationToken,
                folder: "uploads/profile-images",
                targetMaxBytes: 2 * 1024 * 1024);
        }
        else
        {
            profile.ImageUrl = oldImageUrl;
        }

        profile.UpdatedAt = DateTime.UtcNow;

        _profileRepository.Update(profile);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _cacheService.RemoveAsync(ProfileCacheKey(user.UserId), cancellationToken);

        var shouldDeleteOldImage = !string.IsNullOrWhiteSpace(oldImageUrl) &&
                                   !string.Equals(oldImageUrl, profile.ImageUrl, StringComparison.OrdinalIgnoreCase);

        if (shouldDeleteOldImage)
            await _fileStorage.TryDeleteAsync(oldImageUrl, cancellationToken);
    }

    private async Task<UserProfile> EnsureProfileAsync(CurrentUser currentUser, CancellationToken cancellationToken)
    {
        var existing = await _profileRepository
            .Where(x => x.UserId == currentUser.UserId)
            .FirstOrDefaultAsync(cancellationToken);

        if (existing is not null)
            return existing;

        var profile = new UserProfile
        {
            UserId = currentUser.UserId,
            FullName = currentUser.FullName,
            PhoneNumber = null,
            ImageUrl = null
        };

        await _profileRepository.AddAsync(profile);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return profile;
    }

    private CurrentUser GetCurrentUser()
    {
        var user = _httpContextAccessor.HttpContext?.User
            ?? throw new UnauthorizedAccessException(_lan.Get("Validation.Unauthorized"));

        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException(_lan.Get("Validation.Unauthorized"));

        var fullName = user.FindFirstValue("FullName")
            ?? user.FindFirstValue(ClaimTypes.Name)
            ?? user.FindFirstValue(ClaimTypes.Email)
            ?? "User";

        return new CurrentUser(userId, fullName);
    }

    private static string ProfileCacheKey(string userId)
        => $"profile:me:{userId}";
}
