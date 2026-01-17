using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using MyPage.Models;

var builder = WebApplication.CreateBuilder(args);

// =======================
// SERVICES
// =======================

// MVC
builder.Services.AddControllersWithViews();

// Entity Framework Core + LocalDB
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// Authentication (Cookies)
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Auth/Login";
        options.LogoutPath = "/Auth/Logout";
    });

var app = builder.Build();

// =======================
// MIDDLEWARE
// =======================

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Authentication MUST be before Authorization
app.UseAuthentication();
app.UseAuthorization();

// =======================
// ROUTES
// =======================

app.MapControllerRoute(
    name: "default",
     pattern: "{controller}/{action}/{id?}");

app.Run();
