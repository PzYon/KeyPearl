﻿using System.Web.Http;
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