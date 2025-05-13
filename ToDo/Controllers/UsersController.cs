using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using ToDo.Models;

using Microsoft.AspNetCore.Authorization;

namespace ToDo.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;
    
    public UsersController(ILogger<UsersController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    [Authorize(Roles = "user")]
    public IActionResult Get()
    {
        var db = new ToDoDbContext();

        var users = from u in db.User select u;
        if (!users.Any()) return NoContent();
        
        return Ok(users);
    }

    // register a new user
    [HttpPost]
    [Route("register")]
    public IActionResult Post([FromBody] DTOs.Register data)
    {
        var db = new ToDoDbContext();

        var user = new Models.User
        {
            NationalId = data.NationalId ?? "1234567890123",
            Salt = Program.SecurityKey,
            HashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: data.Password ?? "123456",
                salt: Encoding.UTF8.GetBytes(Program.SecurityKey),
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8
            )),
            Title = data.Title ?? "Mr.",
            FirstName = data.FirstName ?? "John",
            LastName = data.LastName ?? "Doe"
        };
        
        db.User.Add(user);
        db.SaveChanges();

        return Ok("User registered");
    }
}