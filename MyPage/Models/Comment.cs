namespace MyPage.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Text { get; set; } = null!;
        public string Username { get; set; } = null!;
        public DateTime Date { get; set; }
    }

}
