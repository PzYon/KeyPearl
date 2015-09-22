namespace KeyPearl.Library.Entities.Serialization
{
  public class ServerResult<TData, TInfo>
  {
    public long ServerTimeInMs;
    public TData Data;
    public TInfo Info;
  }
}