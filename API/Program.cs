using System.Text;
using API.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using API.Users.Models;
using API.Features.Brackets;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.AddFilter("Microsoft.EntityFrameworkCore.Database.Command", LogLevel.None);

builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    //options.JsonSerializerOptions.MaxDepth = 10;
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
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

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("Moderator", policy => policy.RequireRole("Admin", "Moderator"));
});

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

// Seed roles before any requests are handled
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        string[] roles = { "User", "Moderator", "Admin" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding roles");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseCors("developmentPolicy");
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseExceptionHandler(appError =>
    {
        appError.Run(async context =>
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsync("An unexpected error occurred.");
        });
    });
}
else
{
    app.UseCors("productionPolicy");
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();