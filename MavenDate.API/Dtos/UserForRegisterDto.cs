using System.ComponentModel.DataAnnotations;

namespace MavenDate.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }    

        [Required]
        [StringLength(8, MinimumLength = 4, ErrorMessage = "Password msut be between 4 and 8 characters")]
        public string Password { get; set; }     
    }
}