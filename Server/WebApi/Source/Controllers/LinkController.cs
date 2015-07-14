using System.Linq;
using System.Web.Http;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Entities.Tags;
using KeyPearl.Library.Queries;

namespace KeyPearl.WebApi.Controllers
{
  public class LinkController : BaseDbContextApiController
  {
    [Route("api/links/")]
    public Link[] Get(string queryString = null)
    {
      return (queryString == null
                ? DbContext.Links
                : QueryExecutor.Execute(DbContext.Links, queryString)).ToArray();
    }

    [Route("api/links/getbyid/{id}")]
    public Link GetById(int id)
    {
      return DbContext.Links.FirstOrDefault(l => l.Id == id);
    }

    [Route("api/links/")]
    public Link Post(Link link)
    {
      TagManager.SyncTagStringWithTagIds(DbContext, link);

      Link updatedLink = DbContext.Update(link);
      DbContext.SaveChanges();

      return updatedLink;
    }
  }
}