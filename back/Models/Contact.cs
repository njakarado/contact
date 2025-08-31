namespace ContactApi.Models;

public class Contact
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;

    // Relation 1:1 avec Address
    public int? AddressId { get; set; }
    public Address? Address { get; set; }
}