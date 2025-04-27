//using API.Data.Models.Authentication;
//using API.Data.Models.DTOs;
//using API.Data.Models.Entities;

//namespace API.Services.Interfaces;

//public interface IUserService
//{
//    Task<AppUser> Add(RegistrationRequest request);

//    void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt);

//    Task<bool> Delete(int id);

//    Task<bool> Exists(int id);

//    Task<ICollection<User>> GetAll();

//    Task<User> GetById(int id);

//    Task<AppUser> GetByUsername(string username);

//    Task<User> Update(User user);

//    bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt);
//}