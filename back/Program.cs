using Microsoft.EntityFrameworkCore;
using ContactApi.Data;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;
using AutoMapper;

var builder = WebApplication.CreateBuilder(args);

// Ajoute les services CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        builder => builder
            .WithOrigins("http://localhost:4200") // Autorise les requêtes depuis Angular
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Ajoute AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Ajoute le contexte de base de données
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Ajoute les contrôleurs avec une configuration JSON pour gérer les références circulaires
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// Ajoute Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Contact API", Version = "v1" });
});

var app = builder.Build();

// Configure le pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); app.UseSwaggerUI(options => // UseSwaggerUI is called only in Development.
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = string.Empty;
    });
}

//app.UseHttpsRedirection();
app.UseAuthorization();

// Active le middleware CORS
app.UseCors("AllowAngularApp");
app.MapControllers();

// Seed la base de données
//using (var scope = app.Services.CreateScope())
//{
//    var services = scope.ServiceProvider;
//    try
//    {
//        var context = services.GetRequiredService<AppDbContext>();
//        SeedData.Initialize(context);
//    }
//    catch (Exception ex)
//    {
//        var logger = services.GetRequiredService<ILogger<Program>>();
//        logger.LogError(ex, "Une erreur est survenue lors du seeding de la base de données.");
//    }
//}

app.Run();