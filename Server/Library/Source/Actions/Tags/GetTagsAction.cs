using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using KeyPearl.Library.Entities.Tags;
using KeyPearl.Library.Persistance;

namespace KeyPearl.Library.Actions.Tags
{
  public class GetTagsAction : BaseAction<List<Tag>, NullInfo>
  {
    public GetTagsAction(HttpRequestMessage request, IDbContext dbContext)
      : base(request, dbContext)
    {
    }

    protected override void Execute(ActionResult<List<Tag>, NullInfo> actionResult)
    {
      actionResult.Data = DbContext.Tags.ToList();
    }
  }
}