using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Persistance;
using KeyPearl.Library.Queries;

namespace KeyPearl.Library.Actions.Links
{
  public class SearchLinkAction : BaseAction<List<Link>, LinkSearchInfo>
  {
    private readonly string queryString;
    private readonly int maxResultSize;

    public SearchLinkAction(HttpRequestMessage request, IDbContext dbContext, string queryString, int maxResultSize)
      : base(request, dbContext)
    {
      this.maxResultSize = maxResultSize;
      this.queryString = queryString;
    }

    protected override void Execute(ActionResult<List<Link>, LinkSearchInfo> actionResult)
    {
      IEnumerable<Link> links = queryString == null
                                  ? DbContext.Links
                                  : QueryExecutor.Execute(DbContext.Links, queryString);

      Link[] loadedLinks = links.OrderByDescending(l => l.Modified)
                                .Take(maxResultSize + 1)
                                .ToArray();

      actionResult.Info.TotalLinksCount = loadedLinks.Length > maxResultSize
                                            ? DbContext.Links.Count()
                                            : 0;

      actionResult.Data = loadedLinks.Take(maxResultSize).ToList();
    }
  }
}