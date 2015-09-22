using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using KeyPearl.Library.Entities;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Entities.Serialization;
using KeyPearl.Library.Entities.Tags;
using KeyPearl.Library.Queries;

namespace KeyPearl.WebApi.Controllers
{
  public class LinkController : BaseDbContextApiController
  {
    private const string controllerUrl = "links";

    [Route(controllerUrl + "/{id}")]
    public ServerResult<Link, NullInfo> Get(int id)
    {
      return CreateResult<Link, NullInfo>(result => Get(id, result));
    }

    [Route(controllerUrl)]
    public ServerResult<Link, NullInfo> Post(Link link)
    {
      return CreateResult<Link, NullInfo>(result => Post(link, result));
    }

    [Route(controllerUrl + "/{id}")]
    public ServerResult<Link, NullInfo> Delete(int id)
    {
      return CreateResult<Link, NullInfo>(result =>
                                            {
                                              DbContext.Delete<Link>(id);
                                              DbContext.SaveChanges();
                                            });
    }

    [HttpGet]
    [Route(controllerUrl + "/search/")]
    public ServerResult<List<Link>, LinkSearchInfo> Search(string queryString = null)
    {
      return CreateResult<List<Link>, LinkSearchInfo>(result => Search(queryString, result));
    }

    private Link Get(int id, ServerResult<Link, NullInfo> result)
    {
      return result.Data = DbContext.Links.FirstOrDefault(l => l.Id == id);
    }

    private void Post(Link link, ServerResult<Link, NullInfo> result)
    {
      TagManager.SyncTagStringWithTagIds(DbContext, link);

      Link updatedLink = DbContext.Update(link);
      DbContext.SaveChanges();

      result.Data = updatedLink;
    }

    private void Search(string queryString, ServerResult<List<Link>, LinkSearchInfo> result)
    {
      IEnumerable<Link> links = queryString == null
                                  ? DbContext.Links
                                  : QueryExecutor.Execute(DbContext.Links, queryString);

      var maxResultSize = WebConfigReader.Get<int>("MaxResultSize");

      Link[] loadedLinks = links.OrderByDescending(l => l.Modified)
                                .Take(maxResultSize + 1)
                                .ToArray();

      result.Data = loadedLinks.Take(maxResultSize).ToList();
      result.Info.TotalLinksCount = loadedLinks.Length > maxResultSize
                                       ? DbContext.Links.Count()
                                       : 0;
    }
  }
}