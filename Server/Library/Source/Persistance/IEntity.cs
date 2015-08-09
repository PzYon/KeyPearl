using System;

namespace KeyPearl.Library.Persistance
{
  public interface IEntity
  {
    int Id { get; set; }
    DateTime? Created { get; set; }
    DateTime? Modified { get; set; }
  }
}