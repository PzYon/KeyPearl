using System;
using KeyPearl.Library.Entities.Tags;
using KeyPearl.Library.Persistance;

namespace KeyPearl.Library.Entities.Links
{
  public class Link : IEntity, ITaggable
  {
    public int Id { get; set; }

    public DateTime? Created { get; set; }

    public DateTime? Modified { get; set; }

    public string Url { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public string TagString
    {
      get { return _tagString; }
      set
      {
        TagManager.EnsureValidTagString(value);
        _tagString = value;
      }
    }

    public int[] TagIds
    {
      get { return _tagIds ?? (_tagIds = TagManager.GetIdsFromTagString(TagString)); }
      set { _tagIds = value; }
    }

    private string _tagString;

    private int[] _tagIds;

    public void ClearTagString()
    {
      // clear tag string but remember tag ids
      // -> load TagIds to be sure they are initialized
      int[] tagIds = TagIds;
      TagString = string.Empty;
      TagIds = tagIds;
    }
  }
}