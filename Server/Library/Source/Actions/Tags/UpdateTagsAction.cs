using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using KeyPearl.Library.Entities.Tags;
using KeyPearl.Library.Persistance;

namespace KeyPearl.Library.Actions.Tags
{
  public class UpdateTagsAction : BaseAction<List<Tag>, TagModificationInfo>
  {
    private readonly List<Tag> tags;

    public UpdateTagsAction(HttpRequestMessage request, IDbContext dbContext, List<Tag> tags)
      : base(request, dbContext)
    {
      this.tags = tags;
    }

    protected override void Execute(ActionResult<List<Tag>, TagModificationInfo> actionResult)
    {
      actionResult.Info = TagManager.UpdateTags(DbContext, tags);

      DbContext.SaveChanges();

      actionResult.Data = DbContext.Tags.ToList();
    }
  }
}