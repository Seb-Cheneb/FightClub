using System.Text;
using Data.Entities;
using API.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using API.Services.Interfaces;
using API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.AddFilter("Microsoft.EntityFrameworkCore.Database.Command", LogLevel.None);

builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    //options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
                    options.JsonSerializerOptions.MaxDepth = 10;
                });

// SWAGGER
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<DataContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("SQLServer") ?? throw new InvalidOperationException("Database connection string not configured");
    options.UseSqlServer(connectionString);
});

builder.Services
    .AddIdentity<AppUser, IdentityRole>(options => options.User.AllowedUserNameCharacters += " ")
    .AddEntityFrameworkStores<DataContext>()
    .AddDefaultTokenProviders();

var secret = builder.Configuration["JWT:Secret"] ?? throw new InvalidOperationException("Secret not configured");

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = builder.Configuration["JWT:ValidIssuer"] ?? throw new InvalidOperationException("ValidIssuer not configured"),
            ValidAudience = builder.Configuration["JWT:ValidAudience"] ?? throw new InvalidOperationException("ValidAudience not configured"),
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
            ClockSkew = new TimeSpan(0, 0, 5)
        };
    });

// Register Application Services
builder.Services.AddScoped<IBracketService, BracketService>();
//builder.Services.AddScoped<ITimeService, TimeService>();

//builder.Services.AddAuthorization(options =>
//{
//    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
//    options.AddPolicy("Manager", policy => policy.RequireRole("Admin", "Manager"));
//});

const string developmentPolicy = "developmentPolicy";
const string productionPolicy = "productionPolicy";
string[] allowedOrigins = ["http://192.168.1.35", "http://192.168.1.36"];

builder.Services.AddCors(options =>
{
    options.AddPolicy(developmentPolicy, p =>
    {
        p.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
    options.AddPolicy(productionPolicy, p =>
    {
        p.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseCors("developmentPolicy");
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseCors("productionPolicy");
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();