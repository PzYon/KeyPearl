namespace KeyPearl.Library.Entities.Tags
{
  public interface ITaggable
  {
    string TagString { get; set; }
    int[] TagIds { get; set; }
  }
}