using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using ToDo.Models;
using ToDo.DTOs;

namespace ToDo.Controllers;

[ApiController]
[Route("[controller]")]
public class TokensController : ControllerBase
{
    private readonly ILogger<TokensController> _logger;

    public TokensController(ILogger<TokensController> logger)
    {
        _logger = logger;
    }

    [HttpPost]
    [Route("login")]
    public IActionResult Post([FromBody] DTOs.Login data)
    {
        var db = new ToDoDbContext();

        var user = (from x in db.User where x.NationalId == data.NationalId select x).FirstOrDefault();
        if (user == null) return Unauthorized();

        string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: data.Password ?? "123456",
            salt: Encoding.UTF8.GetBytes(user.Salt),
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 10000,
            numBytesRequested: 256 / 8
        ));

        if (user.HashedPassword != hashed) return Unauthorized();

        var desc = new SecurityTokenDescriptor();
        desc.Subject = new ClaimsIdentity(
            new Claim[]
            {
                new Claim(ClaimTypes.Name, user.Id.ToString()),
                new Claim(ClaimTypes.Role, "user")
            }
        );

        desc.NotBefore = DateTime.UtcNow;
        desc.Expires = DateTime.UtcNow.AddHours(3);
        desc.IssuedAt = DateTime.UtcNow;
        desc.Issuer = "ToDoApp";
        desc.Audience = "public";
        desc.SigningCredentials = new SigningCredentials(
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(Program.SecurityKey)
            ),
            SecurityAlgorithms.HmacSha256Signature
        );

        var handler = new JwtSecurityTokenHandler();
        var token = handler.CreateToken(desc);

        return Ok(new {
            token = handler.WriteToken(token)
        });
    }
}