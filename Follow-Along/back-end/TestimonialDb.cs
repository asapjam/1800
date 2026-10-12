using Microsoft.EntityFrameworkCore;

class TestimonialDb : DbContext
{
    public TestimonialDb(DbContextOptions<TestimonialDb> options)
        : base(options) { }

    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
}