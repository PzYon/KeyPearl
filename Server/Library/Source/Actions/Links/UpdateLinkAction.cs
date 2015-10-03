using System;
using System.Net.Http;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Entities.Tags;
using KeyPearl.Library.Persistance;

namespace KeyPearl.Library.Actions.Links
{
  public class UpdateLinkAction : BaseAction<Link, NullInfo>
  {
    private readonly Link link;

    public UpdateLinkAction(HttpRequestMessage request, IDbContext dbContext, Link link) : base(request, dbContext)
    {
      this.link = link;
    }

    protected override void Execute(ActionResult<Link, NullInfo> actionResult)
    {
      // encode URL
      link.Url = new Uri(link.Url).AbsoluteUri;

      TagManager.SyncTagStringWithTagIds(DbContext, link);

      Link updatedLink = DbContext.Update(link);
      DbContext.SaveChanges();

      actionResult.Data = updatedLink;
    }
  }
}