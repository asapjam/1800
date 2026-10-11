var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.MapGet("/testimonials", () => "Hello World!");
app.MapPost("/testimonials", () => "Hello World!");

app.Run();