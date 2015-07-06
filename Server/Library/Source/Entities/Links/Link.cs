using KeyPearl.Library.Entities.Tags;
using KeyPearl.Library.Persistance;

namespace KeyPearl.Library.Entities.Links
{
  public class Link : IEntity, ITaggable
  {
    public int Id { get; set; }

    public string Url { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public string TagString { get; set; }
  }
}