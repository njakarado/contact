using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContactApi.Models;
using ContactApi.Data;

namespace ContactApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AddressesController : ControllerBase
{
    private readonly AppDbContext _context;

    public AddressesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Addresses/5 (par ID de contact)
    [HttpGet("by-contact/{contactId}")]
    public async Task<ActionResult<Address>> GetAddressByContactId(int contactId)
    {
        var address = await _context.Addresses.FirstOrDefaultAsync(a => a.ContactId == contactId);

        if (address == null)
        {
            return NotFound();
        }

        return address;
    }

    // PUT: api/Addresses/5 (par ID de contact)
    [HttpPut("by-contact/{contactId}")]
    public async Task<IActionResult> PutAddressByContactId(int contactId, Address address)
    {
        var existingAddress = await _context.Addresses.FirstOrDefaultAsync(a => a.ContactId == contactId);
        if (existingAddress == null)
        {
            return NotFound();
        }

        existingAddress.Street = address.Street;
        existingAddress.City = address.City;
        existingAddress.PostalCode = address.PostalCode;
        existingAddress.Country = address.Country;

        _context.Entry(existingAddress).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!AddressExists(existingAddress.Id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // POST: api/Addresses (par ID de contact)
    [HttpPost("by-contact/{contactId}")]
    public async Task<ActionResult<Address>> PostAddressByContactId(int contactId, Address address)
    {
        var contact = await _context.Contacts.FindAsync(contactId);
        if (contact == null)
        {
            return NotFound("Contact non trouvé.");
        }

        address.ContactId = contactId;
        _context.Addresses.Add(address);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetAddressByContactId", new { contactId = address.ContactId }, address);
    }

    // DELETE: api/Addresses/5 (par ID de contact)
    [HttpDelete("by-contact/{contactId}")]
    public async Task<IActionResult> DeleteAddressByContactId(int contactId)
    {
        var address = await _context.Addresses.FirstOrDefaultAsync(a => a.ContactId == contactId);
        if (address == null)
        {
            return NotFound();
        }

        _context.Addresses.Remove(address);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool AddressExists(int id)
    {
        return _context.Addresses.Any(e => e.Id == id);
    }
}
