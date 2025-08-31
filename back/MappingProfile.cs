using AutoMapper;
using ContactApi.Models;

namespace ContactApi;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Contact, ContactDto>().ReverseMap();
        CreateMap<Address, AddressDto>().ReverseMap();
    }
}