using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

//BUILDERS

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ProductDb>(opt => opt.UseInMemoryDatabase("ProductList"));
builder.Services.AddDbContext<UserDb>(opt => opt.UseInMemoryDatabase("UserList"));
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

//SCLAR DEBUG

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapGet("/", () => "Add /productsAPI to the URL Einstein, /usersAPI Einstein (2), or /scalar/v1 to the URL to access Scalar UI, Einstein(3)");

//PRODUCT DATABASE GET/POST

app.MapGet("/productsAPI", async (ProductDb db) =>
    await db.Products.ToListAsync());

app.MapPost("/productsAPI", async (Product new_product, ProductDb db) =>
{
    db.Products.Add(new_product);
    await db.SaveChangesAsync();

    return Results.Created($"/productsAPI/{new_product.id}", new_product);
});

//USER DATABASE GET/POST

app.MapGet("/usersAPI", async (UserDb db) =>
    await db.Users.ToListAsync());

    //get specific user? not sure if this works
app.MapGet("/usersAPI/{id}", async (int id, UserDb db) =>
    await db.Users.FindAsync(id)
        is User user
            ? Results.Ok(user)
            : Results.NotFound());

app.MapPost("/usersAPI", async (User new_user, UserDb db) =>
{
    db.Users.Add(new_user);
    await db.SaveChangesAsync();

    return Results.Created($"/usersAPI/{new_user.id}", new_user);
});

//WHO CAN REQUEST DATA?

app.UseCors(MyAllowSpecificOrigins);

//RUN APP

app.Run();



// app.MapGet("/products/complete", async (ProductDb db) =>
//     await db.Todos.Where(t => t.IsComplete).ToListAsync());

// app.MapGet("/products/{id}", async (int id, ProductDb db) =>
//     await db.Todos.FindAsync(id)
//         is Todo todo
//             ? Results.Ok(todo)
//             : Results.NotFound());

// app.MapPut("/products/{id}", async (int id, Todo inputTodo, ProductDb db) =>
// {
//     var todo = await db.Todos.FindAsync(id);

//     if (todo is null) return Results.NotFound();

//     todo.Name = inputTodo.Name;
//     todo.IsComplete = inputTodo.IsComplete;

//     await db.SaveChangesAsync();

//     return Results.NoContent();
// });

// app.MapDelete("/products/{id}", async (int id, ProductDb db) =>
// {
//     if (await db.Todos.FindAsync(id) is Todo todo)
//     {
//         db.Todos.Remove(todo);
//         await db.SaveChangesAsync();
//         return Results.NoContent();
//     }

//     return Results.NotFound();
// });