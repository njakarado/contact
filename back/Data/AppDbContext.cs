using Microsoft.EntityFrameworkCore;
using ContactApi.Models;

namespace ContactApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Contact> Contacts => Set<Contact>();
    public DbSet<Address> Addresses => Set<Address>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuration de la relation 1:1 entre Contact et Address
        modelBuilder.Entity<Contact>()
            .HasOne(c => c.Address)
            .WithOne(a => a.Contact)
            .HasForeignKey<Address>(a => a.ContactId);
    }
}