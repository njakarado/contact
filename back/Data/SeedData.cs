using ContactApi.Models;

namespace ContactApi.Data;

public static class SeedData
{
    public static void Initialize(AppDbContext context)
    {
        if (!context.Contacts.Any())
        {
            var contact1 = new Contact
            {
                Name = "Alice Dupont",
                Email = "alice.dupont@example.com",
                Phone = "0123456789"
            };

            var contact2 = new Contact
            {
                Name = "Bob Martin",
                Email = "bob.martin@example.com",
                Phone = "0987654321"
            };

            context.Contacts.AddRange(contact1, contact2);
            context.SaveChanges();

            // Ajoute les adresses après avoir sauvé les contacts pour obtenir leurs IDs
            context.Addresses.AddRange(
                new Address
                {
                    Street = "123 Rue de Paris",
                    City = "Paris",
                    PostalCode = "75000",
                    Country = "France",
                    ContactId = contact1.Id
                },
                new Address
                {
                    Street = "456 Rue de Lyon",
                    City = "Lyon",
                    PostalCode = "69000",
                    Country = "France",
                    ContactId = contact2.Id
                }
            );

            context.SaveChanges();
        }
    }
}