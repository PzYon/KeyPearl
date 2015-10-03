namespace KeyPearl.Library.Actions
{
  public sealed class ActionResult<TData, TInfo> where TInfo : BaseInfo, new()
  {
    public long ServerTimeInMs;
    public TData Data;
    public TInfo Info = new TInfo();
    public string ErrorMessage;
  }
}