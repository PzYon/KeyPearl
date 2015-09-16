using System;
using KeyPearl.Library.Persistance;

namespace KeyPearl.Library.Entities.Tags
{
  public class Tag : IEntity
  {
    public int Id { get; set; }

    public DateTime? Created { get; set; }

    public DateTime? Modified { get; set; }

    public int ParentId { get; set; }

    public string Name { get; set; }

    public override string ToString()
    {
      return string.Format("{0} (id: {1}, parent id: {2})", Name, Id, ParentId);
    }
  }
}