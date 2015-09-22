namespace KeyPearl.Library.Entities.Serialization
{
  public abstract class BaseInfo
  {
  }

  public class NullInfo : BaseInfo
  {
  }

  public class TagModificationInfo : BaseInfo
  {
    public int ModifiedTagsCount;
    public int ModifiedLinksCount;
  }

  public class LinkSearchInfo : BaseInfo
  {
    public int TotalLinksCount;
  }
}
