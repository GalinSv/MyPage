using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyPage.Models;

namespace MyPage.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CommentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string orderBy = "date")
        {
            var query = _context.Comments.AsQueryable();

            if (orderBy == "user")
            {
                query = query
                    .OrderBy(c => c.Username)
                    .ThenByDescending(c => c.Date);
            }
            else
            {
                query = query
                    .OrderByDescending(c => c.Date)
                    .ThenBy(c => c.Username);
            }

            var comments = await query
                .Take(20)
                .Select(c => new
                {
                    c.Id,
                    c.Text,
                    c.Username,
                    c.Date,
                    IsOwner = User.Identity!.IsAuthenticated &&
                              User.Identity.Name == c.Username
                })
                .ToListAsync();

            return Ok(comments);
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] CreateCommentRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Text))
                return BadRequest("Text is required.");

            var comment = await _context.Comments.FindAsync(id);

            if (comment == null)
                return NotFound();

            if (comment.Username != User.Identity!.Name)
                return Forbid();

            comment.Text = request.Text.Trim();
            comment.Date = DateTime.UtcNow; // update timestamp

            await _context.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCommentRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Text))
                return BadRequest("Comment text is required.");

            var comment = new Comment
            {
                Text = request.Text.Trim(),
                Username = User.Identity!.Name!,
                Date = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                comment.Id,
                comment.Text,
                comment.Username,
                comment.Date
            });
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var comment = await _context.Comments.FindAsync(id);

            if (comment == null)
                return NotFound();

            if (comment.Username != User.Identity!.Name)
                return Forbid();

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
