using System.Linq;
using System.Net.Http;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Persistance;

namespace KeyPearl.Library.Actions.Links
{
  public class GetLinkAction : BaseAction<Link, NullInfo>
  {
    private readonly int id;

    public GetLinkAction(HttpRequestMessage request, IDbContext dbContext, int id)
      : base(request, dbContext)
    {
      this.id = id;
    }

    protected override void Execute(ActionResult<Link, NullInfo> actionResult)
    {
      actionResult.Data = DbContext.Links.FirstOrDefault(l => l.Id == id);
    }
  }
}