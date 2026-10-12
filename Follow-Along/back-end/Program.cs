using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<TestimonialDb>(opt => opt.UseInMemoryDatabase("TestimonialList"));
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy  =>
                      {
                          policy.WithOrigins("http://localhost:5173").AllowAnyMethod().AllowAnyHeader();
                      });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapGet("/", () => "Add /testimonials to the URL, Einstein. Add /scalar/v1 to the URL to access Scalar UI, Einstein(2)");

app.MapGet("/testimonials", async (TestimonialDb db) =>
    await db.Testimonials.ToListAsync());

app.MapPost("/testimonials", async (Testimonial testimonial, TestimonialDb db) =>
{
    db.Testimonials.Add(testimonial);
    await db.SaveChangesAsync();

    return Results.Created($"/testimonials/{testimonial.Id}", testimonial);
});

app.UseCors(MyAllowSpecificOrigins);

app.Run();

// app.MapGet("/testimonials/complete", async (TestimonialDb db) =>
//     await db.Todos.Where(t => t.IsComplete).ToListAsync());

// app.MapGet("/testimonials/{id}", async (int id, TestimonialDb db) =>
//     await db.Todos.FindAsync(id)
//         is Todo todo
//             ? Results.Ok(todo)
//             : Results.NotFound());

// app.MapPut("/testimonials/{id}", async (int id, Todo inputTodo, TestimonialDb db) =>
// {
//     var todo = await db.Todos.FindAsync(id);

//     if (todo is null) return Results.NotFound();

//     todo.Name = inputTodo.Name;
//     todo.IsComplete = inputTodo.IsComplete;

//     await db.SaveChangesAsync();

//     return Results.NoContent();
// });

// app.MapDelete("/testimonials/{id}", async (int id, TestimonialDb db) =>
// {
//     if (await db.Todos.FindAsync(id) is Todo todo)
//     {
//         db.Todos.Remove(todo);
//         await db.SaveChangesAsync();
//         return Results.NoContent();
//     }

//     return Results.NotFound();
// });