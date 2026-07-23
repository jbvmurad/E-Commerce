using AutoMapper;
using E_Commerce.Server.Shared.Localization.Localizations;
using GenericRepository;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Profile.Application.Features.ProfileAttributeFeatures.UserAddressFeatures.Commands.AddUserAddress;
using Profile.Application.Features.ProfileAttributeFeatures.UserAddressFeatures.Commands.DeleteUserAddress;
using Profile.Application.Features.ProfileAttributeFeatures.UserAddressFeatures.Commands.UpdateUserAddress;
using Profile.Application.Services.ProfileAttributeServices;
using Profile.Domain.DTOs.ProfileAttributeDTOs;
using Profile.Domain.DTOs.SystemDTOs;
using Profile.Domain.Entities.ProfileAttributeEntities;
using Profile.Domain.Repositories.ProfileAttributeRepositories;
using System.Security.Claims;

namespace Profile.Persistance.Services.ProfileAttributeServices;

public sealed class UserAddressService : IUserAddressService
{
    private readonly IUserAddressRepository _userAddressRepository;
    private readonly IProfileRepository _profileRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILocalizationService _lan;

    public UserAddressService(
        IUserAddressRepository userAddressRepository,
        IProfileRepository profileRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IHttpContextAccessor httpContextAccessor,
        ILocalizationService lan)
    {
        _userAddressRepository = userAddressRepository;
        _profileRepository = profileRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _httpContextAccessor = httpContextAccessor;
        _lan = lan;
    }

    public IQueryable<UserAddress> GetMyAddresses()
    {
        var userId = GetCurrentUser().UserId;

        return _userAddressRepository
            .Where(x => x.UserProfile.UserId == userId)
            .AsNoTracking();
    }

    public async Task AddUserAddressAsync(AddUserAddressCommand request, CancellationToken cancellationToken)
    {
        var currentUser = GetCurrentUser();
        var profile = await EnsureProfileAsync(currentUser, cancellationToken);

        await ClearDefaultAddressesAsync(
            profile.Id,
            addressIdToExclude: null,
            request.IsDefaultShipping,
            request.IsDefaultBilling,
            cancellationToken);

        var address = _mapper.Map<UserAddress>(request);
        address.UserProfileId = profile.Id;
        NormalizeAddress(address);

        await _userAddressRepository.AddAsync(address);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateUserAddressAsync(UpdateUserAddressCommand request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUser().UserId;

        var address = await _userAddressRepository
            .Where(x => x.Id == request.Id && x.UserProfile.UserId == userId)
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new KeyNotFoundException(_lan.Get("Error.UserAddressNotFound"));

        await ClearDefaultAddressesAsync(
            address.UserProfileId,
            address.Id,
            request.IsDefaultShipping,
            request.IsDefaultBilling,
            cancellationToken);

        _mapper.Map(request, address);
        NormalizeAddress(address);
        address.UpdatedAt = DateTime.UtcNow;

        _userAddressRepository.Update(address);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteUserAddressAsync(DeleteUserAddressCommand request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUser().UserId;

        var address = await _userAddressRepository
            .Where(x => x.Id == request.Id && x.UserProfile.UserId == userId)
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new KeyNotFoundException(_lan.Get("Error.UserAddressNotFound"));

        _userAddressRepository.Delete(address);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
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

    private async Task ClearDefaultAddressesAsync(
        string userProfileId,
        string? addressIdToExclude,
        bool clearShipping,
        bool clearBilling,
        CancellationToken cancellationToken)
    {
        if (clearShipping)
        {
            await _userAddressRepository
                .Where(x => x.UserProfileId == userProfileId &&
                            x.Id != addressIdToExclude &&
                            x.IsDefaultShipping)
                .ExecuteUpdateAsync(
                    setters => setters.SetProperty(x => x.IsDefaultShipping, false),
                    cancellationToken);
        }

        if (clearBilling)
        {
            await _userAddressRepository
                .Where(x => x.UserProfileId == userProfileId &&
                            x.Id != addressIdToExclude &&
                            x.IsDefaultBilling)
                .ExecuteUpdateAsync(
                    setters => setters.SetProperty(x => x.IsDefaultBilling, false),
                    cancellationToken);
        }
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

    private static void NormalizeAddress(UserAddress address)
    {
        address.Title = address.Title.Trim();
        address.RecipientFullName = address.RecipientFullName.Trim();
        address.PhoneNumber = address.PhoneNumber.Trim();
        address.CountryCode = address.CountryCode.Trim().ToUpperInvariant();
        address.City = address.City.Trim();
        address.StateOrRegion = NormalizeOptional(address.StateOrRegion);
        address.District = NormalizeOptional(address.District);
        address.AddressLine1 = address.AddressLine1.Trim();
        address.AddressLine2 = NormalizeOptional(address.AddressLine2);
        address.PostalCode = NormalizeOptional(address.PostalCode);
    }

    private static string? NormalizeOptional(string? value)
        => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
