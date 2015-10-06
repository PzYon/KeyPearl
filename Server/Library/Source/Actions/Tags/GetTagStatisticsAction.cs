using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Entities.Tags;
using KeyPearl.Library.Persistance;

namespace KeyPearl.Library.Actions.Tags
{
  public class GetTagStatisticsAction : BaseAction<TagStatistics, NullInfo>
  {
    private readonly int tagId;

    public GetTagStatisticsAction(HttpRequestMessage request, IDbContext dbContext, int tagId)
      : base(request, dbContext)
    {
      this.tagId = tagId;
    }

    protected override void Execute(ActionResult<TagStatistics, NullInfo> actionResult)
    {
      actionResult.Data = TagManager.GetTagStatistics(DbContext, tagId);
    }
  }
}