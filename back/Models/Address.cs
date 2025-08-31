namespace ContactApi.Models
{
    public class Address
    {
        public int Id { get; set; }
        public string Street { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;

        // Relation 1:1 avec Contact
        public int ContactId { get; set; }
        public Contact Contact { get; set; } = null!;
    }
}
