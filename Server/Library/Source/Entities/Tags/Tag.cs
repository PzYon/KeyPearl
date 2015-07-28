using KeyPearl.Library.Persistance;

namespace KeyPearl.Library.Entities.Tags
{
  public class Tag : IEntity
  {
    public int Id { get; set; }

    public int ParentId { get; set; }

    public string Name { get; set; }
  }
}