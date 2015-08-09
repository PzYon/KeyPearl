using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Entities.Tags;
using KeyPearl.Library.Queries;

namespace KeyPearl.WebApi.Controllers
{
  public class LinkController : BaseDbContextApiController
  {
    private const string controllerUrl = "links";

    [Route(controllerUrl)]
    public LinkQueryResult Get(string queryString = null)
    {
      IEnumerable<Link> links = queryString == null
                                  ? DbContext.Links
                                  : QueryExecutor.Execute(DbContext.Links, queryString);

      var maxResultSize = WebConfigReader.Get<int>("MaxResultSize");

      Link[] loadedLinks = links.OrderByDescending(l => l.Modified)
                                .Take(maxResultSize + 1)
                                .ToArray();

      return new LinkQueryResult
        {
          Links = loadedLinks.Take(maxResultSize).ToArray(),
          TotalLinksCount = loadedLinks.Length > maxResultSize
                              ? DbContext.Links.Count()
                              : 0
        };
    }

    [Route(controllerUrl + "/getbyid/{id}")]
    public Link GetById(int id)
    {
      return DbContext.Links.FirstOrDefault(l => l.Id == id);
    }

    [Route(controllerUrl)]
    public Link Post(Link link)
    {
      TagManager.SyncTagStringWithTagIds(DbContext, link);

      Link updatedLink = DbContext.Update(link);
      DbContext.SaveChanges();

      return updatedLink;
    }
  }
}