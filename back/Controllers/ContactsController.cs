using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContactApi.Models;
using ContactApi.Data;
using AutoMapper;

namespace ContactApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ContactsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public ContactsController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // GET: api/Contacts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContactDto>>> GetContacts()
    {
        var contacts = await _context.Contacts.Include(c => c.Address).ToListAsync();
        return _mapper.Map<List<ContactDto>>(contacts);
    }

    // GET: api/Contacts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ContactDto>> GetContact(int id)
    {
        var contact = await _context.Contacts.Include(c => c.Address).FirstOrDefaultAsync(c => c.Id == id);

        if (contact == null)
        {
            return NotFound();
        }

        return _mapper.Map<ContactDto>(contact);
    }

    // PUT: api/Contacts/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutContact(int id, ContactDto contactDto)
    {
        if (id != contactDto.Id)
        {
            return BadRequest();
        }

        var contact = await _context.Contacts.FindAsync(id);
        if (contact == null)
        {
            return NotFound();
        }

        _mapper.Map(contactDto, contact);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/Contacts
    [HttpPost]
    public async Task<ActionResult<ContactDto>> PostContact(ContactDto contactDto)
    {
        var contact = _mapper.Map<Contact>(contactDto);
        _context.Contacts.Add(contact);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetContact", new { id = contact.Id }, _mapper.Map<ContactDto>(contact));
    }

    // DELETE: api/Contacts/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteContact(int id)
    {
        var contact = await _context.Contacts.FindAsync(id);
        if (contact == null)
        {
            return NotFound();
        }

        _context.Contacts.Remove(contact);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
