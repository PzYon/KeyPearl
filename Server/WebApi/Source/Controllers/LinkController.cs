using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
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
    public HttpResponseMessage Get(int id)
    {
      return GetResponse<Link, NullInfo>(result => Get(id, result));
    }

    [Route(controllerUrl)]
    public HttpResponseMessage Post(Link link)
    {
      return GetResponse<Link, NullInfo>(result => Post(link, result));
    }

    [Route(controllerUrl + "/{id}")]
    public HttpResponseMessage Delete(int id)
    {
      return GetResponse<Link, NullInfo>(result =>
                                           {
                                             DbContext.Delete<Link>(id);
                                             DbContext.SaveChanges();
                                           });
    }

    [HttpGet]
    [Route(controllerUrl + "/search/")]
    public HttpResponseMessage Search(string queryString = null)
    {
      return GetResponse<List<Link>, LinkSearchInfo>(result => Search(queryString, result));
    }

    private Link Get(int id, ResponseData<Link, NullInfo> result)
    {
      return result.Data = DbContext.Links.FirstOrDefault(l => l.Id == id);
    }

    private void Post(Link link, ResponseData<Link, NullInfo> result)
    {
      // encode URL
      link.Url = new Uri(link.Url).AbsoluteUri;

      TagManager.SyncTagStringWithTagIds(DbContext, link);

      Link updatedLink = DbContext.Update(link);
      DbContext.SaveChanges();

      result.Data = updatedLink;
    }

    private void Search(string queryString, ResponseData<List<Link>, LinkSearchInfo> result)
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