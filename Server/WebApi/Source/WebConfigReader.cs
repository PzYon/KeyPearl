using System.Configuration;

namespace KeyPearl.WebApi
{
  public static class WebConfigReader
  {
    public static T Get<T>(string key)
    {
      var x = new AppSettingsReader();
      return (T) x.GetValue(key, typeof (T));
    }

    public static string GetConnectionString(string key)
    {
      return ConfigurationManager.ConnectionStrings[key].ConnectionString;
    }
  }
}