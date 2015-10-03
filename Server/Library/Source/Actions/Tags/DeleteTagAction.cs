using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using KeyPearl.Library.Entities.Tags;
using KeyPearl.Library.Persistance;

namespace KeyPearl.Library.Actions.Tags
{
  public class DeleteTagAction : BaseAction<List<Tag>, TagModificationInfo>
  {
    private readonly int id;

    public DeleteTagAction(HttpRequestMessage request, IDbContext dbContext, int id)
      : base(request, dbContext)
    {
      this.id = id;
    }

    protected override void Execute(ActionResult<List<Tag>, TagModificationInfo> actionResult)
    {
      actionResult.Info = TagManager.DeleteTag(DbContext, id);

      DbContext.SaveChanges();

      actionResult.Data = DbContext.Tags.ToList();
    }
  }
}