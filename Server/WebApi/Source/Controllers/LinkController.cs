using System.Web.Http;
using KeyPearl.Library.Actions.Links;
using KeyPearl.Library.Entities.Links;

namespace KeyPearl.WebApi.Controllers
{
  public class LinkController : BaseDbContextApiController
  {
    private const string controllerUrl = "links";

    [Route(controllerUrl + "/{id}")]
    public IHttpActionResult Get(int id)
    {
      return new GetLinkAction(Request, DbContext, id);
    }

    [Route(controllerUrl)]
    public IHttpActionResult Post(Link link)
    {
      return new UpdateLinkAction(Request, DbContext, link);
    }

    [Route(controllerUrl + "/{id}")]
    public IHttpActionResult Delete(int id)
    {
      return new DeleteLinkAction(Request, DbContext, id);
    }

    [HttpGet]
    [Route(controllerUrl + "/search/")]
    public IHttpActionResult Search(string queryString = null)
    {
      return new SearchLinkAction(Request, DbContext, queryString, WebConfigReader.Get<int>("MaxResultSize"));
    }
  }
}