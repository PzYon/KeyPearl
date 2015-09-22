using System;
using System.Diagnostics;
using System.Web.Http;
using KeyPearl.Library.Entities;
using KeyPearl.Library.Entities.Serialization;
using KeyPearl.Library.Persistance;

namespace KeyPearl.WebApi.Controllers
{
  public abstract class BaseDbContextApiController : ApiController
  {
    protected readonly IDbContext DbContext;

    protected BaseDbContextApiController()
    {
      DbContext = new KeyPearlDbContext(WebConfigReader.GetConnectionString("KeyPearl"),
                                        WebConfigReader.Get<bool>("LogSqlQueries"));
    }

    protected ServerResult<TData, TInfo> CreateResult<TData, TInfo>(Action<ServerResult<TData, TInfo>> processAction)
      where TInfo : class, new()
      where TData : class, new()
    {
      var watch = new Stopwatch();
      watch.Start();

      var result = new ServerResult<TData, TInfo>();
      result.Info = new TInfo();

      processAction(result);

      watch.Stop();
      result.ServerTimeInMs = watch.ElapsedMilliseconds;

      return result;
    }

    protected override void Dispose(bool disposing)
    {
      if (DbContext != null)
      {
        DbContext.Dispose();
      }

      base.Dispose(disposing);
    }
  }
}