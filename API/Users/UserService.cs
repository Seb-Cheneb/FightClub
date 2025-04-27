//using API.Persistence;

//using API.Services.Interfaces;
//using Data.DTOs;
//using Data.Mappers;

//using Data.Models;
//using Microsoft.EntityFrameworkCore;
//using System.Security.Cryptography;
//using System.Text;

//namespace API.Services;

//public class UserService : IUserService
//{
//    private readonly DataContext _db;

//    public UserService(DataContext dataContext)
//    {
//        _db = dataContext;
//    }

//    public async Task<User> Add(RegistrationModel request)
//    {
//        if (request == null)
//        {
//            throw new ArgumentNullException(nameof(request), "Register request cannot be null.");
//        }

//        CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
//        User newUser = UserMapper.RegisterReqToEntity(request);
//        newUser.PasswordHash = passwordHash;
//        newUser.PasswordSalt = passwordSalt;
//        newUser.Role = "User";

//        _db.Users.Add(newUser);
//        await _db.SaveChangesAsync();

//        User createdUser = await GetByUsername(newUser.UserName);

//        if (createdUser == null)
//        {
//            throw new InvalidOperationException("Failed to retrieve the created user from the database.");
//        }

//        return createdUser;
//    }

//    public void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
//    {
//        if (string.IsNullOrEmpty(password)) throw new ArgumentException("Password cannot be null or empty.", nameof(password));

//        using (var hmac = new HMACSHA512())
//        {
//            passwordSalt = hmac.Key;
//            passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
//        }
//    }

//    public async Task<bool> Delete(int id)
//    {
//        var product = await _db.Users.FindAsync(id);
//        if (product == null) return false;

//        _db.Users.Remove(product);
//        await _db.SaveChangesAsync();
//        return true;
//    }

//    public async Task<bool> Exists(int id)
//    {
//        return await _db.Users.AnyAsync(entry => entry.Id == id);
//    }

//    public async Task<ICollection<UserDTO>> GetAll()
//    {
//        List<User> users = await _db.Users.ToListAsync();
//        List<UserDTO> userDTOs = users.Select(UserMapper.EntityToDTO).ToList();

//        return userDTOs;
//    }

//    public async Task<UserDTO> GetById(int id)
//    {
//        User user = await _db.Users.FindAsync(id);
//        UserDTO response = UserMapper.EntityToDTO(user);
//        return response;
//    }

//    public async Task<User> GetByUsername(string username)
//    {
//        return await _db.Users.FirstOrDefaultAsync(u => u.UserName == username);
//    }

//    public async Task<UserDTO> UpdateModel(UserDTO request)
//    {
//        var entry = await _db.Users.FindAsync(request.Id);
//        if (entry == null)
//        {
//            throw new ArgumentNullException(
//                nameof(entry),
//                "Register request cannot be null."
//            );
//        }
//        entry.Email = request.Email;
//        entry.Name = request.Name;
//        entry.UserName = request.UserName;
//        await _db.SaveChangesAsync();
//        return UserMapper.EntityToDTO(entry);
//    }

//    public bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
//    {
//        using (var hmac = new HMACSHA512(storedSalt))
//        {
//            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
//            return computedHash.SequenceEqual(storedHash);
//        }
//    }
//}