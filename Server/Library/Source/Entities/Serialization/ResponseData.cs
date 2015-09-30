namespace KeyPearl.Library.Entities.Serialization
{
  public class ResponseData<TData, TInfo> where TInfo : new()
  {
    public long ServerTimeInMs;
    public TData Data;
    public TInfo Info;
    public string ErrorMessage;

    public ResponseData()
    {
      Info = new TInfo();
    }
  }
}