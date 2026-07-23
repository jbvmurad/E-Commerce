using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.EntityFrameworkCore;
using Profile.Application.Features.ProfileAttributeFeatures.UserAddressFeatures.Commands.AddUserAddress;
using Profile.Application.Features.ProfileAttributeFeatures.UserAddressFeatures.Commands.DeleteUserAddress;
using Profile.Application.Features.ProfileAttributeFeatures.UserAddressFeatures.Commands.UpdateUserAddress;
using Profile.Application.Services.ProfileAttributeServices;
using Profile.Domain.DTOs.ProfileAttributeDTOs;
using Profile.Domain.DTOs.SystemDTOs;
using Profile.Domain.Entities.ProfileAttributeEntities;
using Profile.Presentation.Controllers.AbstractController;
using Wolverine;

namespace Profile.Presentation.Controllers.ProfileAttributeControllers;

[Route("api/profile/addresses")]
public sealed class UserAddressController : APIController
{
    private readonly IUserAddressService _userAddressService;
    private readonly IMapper _mapper;

    public UserAddressController(
        IMessageBus bus,
        IUserAddressService userAddressService,
        IMapper mapper) : base(bus)
    {
        _userAddressService = userAddressService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        ODataQueryOptions<UserAddress> options,
        CancellationToken cancellationToken)
    {
        IQueryable<UserAddress> query = _userAddressService.GetMyAddresses();

        query = (IQueryable<UserAddress>)options.ApplyTo(query, new ODataQuerySettings());

        var result = await query
            .ProjectTo<UserAddressResponse>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] AddUserAddressCommand request, CancellationToken cancellationToken)
    {
        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(request, cancellationToken);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        [FromBody] UpdateUserAddressCommand request,
        CancellationToken cancellationToken)
    {
        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(request with { Id = id }, cancellationToken);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken cancellationToken)
    {
        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(
            new DeleteUserAddressCommand(id),
            cancellationToken);

        return Ok(response);
    }
}
