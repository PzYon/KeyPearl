namespace KeyPearl.Library.Entities.Tags
{
  public sealed class TagStatistics
  {
    public int TagId;

    public int DirectCount;

    public int InheritedCount;

    public int TaggedLinksCount;

    public int TotalCount
    {
      get { return DirectCount + InheritedCount; }
    }
  }
}