using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

//BUILDERS

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ProductDb>(opt => opt.UseInMemoryDatabase("ProductList"));
builder.Services.AddDbContext<UserDb>(opt => opt.UseInMemoryDatabase("UserList"));
builder.Services.AddDbContext<OrderDb>(opt => opt.UseInMemoryDatabase("OrderList"));
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

app.MapGet("/productsAPI/{id}", async (int id, ProductDb db) =>
    await db.Products.FindAsync(id)
        is Product product
            ? Results.Ok(product)
            : Results.NotFound());

app.MapPost("/productsAPI", async (Product new_product, ProductDb db) =>
{
    db.Products.Add(new_product);
    await db.SaveChangesAsync();

    return Results.Created($"/productsAPI/{new_product.id}", new_product);
});

app.MapPut("/productsAPI/{id}", async (int id, Product updatedProductData, ProductDb db) =>
{
    var currentProductData = await db.Products.FindAsync(id);

    if (currentProductData is null) return Results.NotFound();

    currentProductData.name = updatedProductData.name;
    currentProductData.price = updatedProductData.price;
    currentProductData.inventory = updatedProductData.inventory;
    currentProductData.rating = updatedProductData.rating;
    currentProductData.seller_id = updatedProductData.seller_id;

    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.MapDelete("/productsAPI/{id}", async (int id, ProductDb db) =>
{
    if (await db.Products.FindAsync(id) is Product product)
    {
        db.Products.Remove(product);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }

    return Results.NotFound();
});

//USER DATABASE GET/POST

app.MapGet("/usersAPI", async (UserDb db) =>
    await db.Users.ToListAsync());

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

//ORDER DATABASE GET/POST

app.MapGet("/ordersAPI", async (OrderDb db) =>
    await db.Orders.ToListAsync());

app.MapGet("/ordersAPI/{id}", async (int id, OrderDb db) =>
    await db.Orders.FindAsync(id)
        is Order order
            ? Results.Ok(order)
            : Results.NotFound());

app.MapPost("/ordersAPI", async (Order new_order, OrderDb db) =>
{
    db.Orders.Add(new_order);
    await db.SaveChangesAsync();

    return Results.Created($"/ordersAPI/{new_order.id}", new_order);
});

app.MapDelete("/ordersAPI/{id}", async (int id, OrderDb db) =>
{
    if (await db.Orders.FindAsync(id) is Order order)
    {
        db.Orders.Remove(order);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }

    return Results.NotFound();
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