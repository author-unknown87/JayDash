using JayDash.Data;
using JayDash.Middleware;
using JayDash.Repositories;
using JayDash.Repositories.Interfaces;
using JayDash.Services;
using JayDash.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Serilog;

try
{
    var builder = WebApplication.CreateBuilder(args);

    // Add services to the container.

    builder.Services.AddControllers();
    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowLocalhost",
            policy => policy.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin());
    });

    // Register Repositories
    builder.Services.AddTransient<ISystemConfigurationRepository, SystemConfigurationRepository>();
    builder.Services.AddTransient<IEducationRepository, EducationRepository>();
    builder.Services.AddTransient<IIndustryToolsRepository, IndustryToolsRepository>();
    builder.Services.AddTransient<ISkillsRepository, SkillsRepository>();
    builder.Services.AddTransient<IWorkplaceRepository, WorkplaceRepository>();

    // Register Services
    builder.Services.AddTransient<IResumeService, ResumeService>();

    // Register DB context
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

    builder.Services.AddDbContext<AppDbContext>(options =>
    {
        options.UseSqlServer(connectionString);
    });

    // CORS
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowReact", policy =>
        {
            policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
    });

    // Logging
    Log.Logger = new LoggerConfiguration()
        .ReadFrom.Configuration(builder.Configuration)
        .Enrich.FromLogContext()
        .CreateLogger();

    builder.Services.AddSerilog();

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    //app.UseHttpsRedirection();
    app.UseMiddleware<ExceptionHandlingMiddleware>();

    app.UseAuthorization();

    app.UseCors("AllowLocalhost");
    app.UseCors("AllowReact");
    app.MapControllers();

    app.Run();
} catch (Exception ex)
{
    Log.Fatal(ex, "Application blew a gakset, engine won't turn over.");
}
finally
{
    Log.CloseAndFlush();
}
