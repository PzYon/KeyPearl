using KeyPearl.Library.Persistance;

namespace KeyPearl.Library.Configuration
{
  public static class KeyPearlConfiguration
  {
    public static string ConnectionString = "data source=.;initial catalog=KeyPearl;integrated security=True;";

    public static bool LogSqlQueries = true;

    public static int MaxResultSize = 50;

    public static IDbContext GetDbContext()
    {
      return new KeyPearlDbContext();
    }
  }
}